require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// CORS — only allow configured frontend origin, never wildcard in production
const allowedOrigin = process.env.FRONTEND_URL;
app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowedOrigin === '*' || origin === allowedOrigin) return cb(null, true);
    cb(new Error(`CORS: origin ${origin} not allowed`));
  },
}));

app.use(express.json());

// Rate limiters
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 10, message: { message: 'Too many login attempts, try again later.' } });
const admissionLimiter = rateLimit({ windowMs: 60 * 60 * 1000, max: 20, message: { message: 'Too many submissions, try again later.' } });

app.use('/api/auth/login', authLimiter);
app.use('/api/admissions', (req, res, next) => req.method === 'POST' ? admissionLimiter(req, res, next) : next());

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/notices', require('./routes/noticeRoutes'));
app.use('/api/admissions', require('./routes/admissionRoutes'));

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.use(errorHandler);

module.exports = app;
