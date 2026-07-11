const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { AdminUser } = require('../models');

exports.login = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ message: 'Username and password required' });

  const user = await AdminUser.findOne({ where: { username } });
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return res.status(401).json({ message: 'Invalid credentials' });

  const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRY || '7d',
  });

  res.json({ token, expiresIn: process.env.JWT_EXPIRY || '7d', passwordChanged: user.passwordChanged });
};

exports.changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) return res.status(400).json({ message: 'Both fields required' });
  if (newPassword.length < 8) return res.status(400).json({ message: 'New password must be at least 8 characters' });

  const user = await AdminUser.findByPk(req.admin.id);
  const valid = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!valid) return res.status(401).json({ message: 'Current password incorrect' });

  const passwordHash = await bcrypt.hash(newPassword, 12);
  await user.update({ passwordHash, passwordChanged: true });
  res.json({ message: 'Password updated successfully' });
};
