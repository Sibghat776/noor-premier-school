# Noor Premier School — Full Stack Website

> Under The Supervision and with Affiliation of IntellActX

Production-ready school website: React + Node.js/Express + MySQL (RDS), deployed on AWS EC2 via Terraform + GitHub Actions CI/CD.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Tailwind CSS v4, react-router-dom, react-hook-form + zod, react-toastify, axios, lucide-react |
| Backend | Node.js 18+, Express 5, Sequelize 6, MySQL2, bcryptjs, jsonwebtoken, express-rate-limit, express-validator |
| Database | Amazon RDS MySQL 8.0 |
| Infra | Terraform (EC2 t2.micro + RDS db.t3.micro + VPC) |
| CI/CD | GitHub Actions → SSH deploy → PM2 + Nginx |

---

## Local Development

### Prerequisites
- Node.js 18+ LTS
- MySQL 8.0 running locally

### 1. Backend

```bash
cd Backend
npm install
# Edit .env — set MYSQL_* credentials and generate a real JWT_SECRET:
#   JWT_SECRET=$(openssl rand -hex 32)
npm run dev
# Runs on http://localhost:5000
# Admin auto-seeded: admin / admin123  ← CHANGE THIS IMMEDIATELY
```

### 2. Frontend

```bash
cd Frontend
npm install
# .env already has VITE_API_URL=http://localhost:5000/api
npm run dev
# Runs on http://localhost:5173
```

### Local URLs

| URL | Description |
|-----|-------------|
| http://localhost:5173 | Public site |
| http://localhost:5173/admissions | Admission form |
| http://localhost:5173/admin | Admin login |
| http://localhost:5173/admin/dashboard | Admin dashboard |
| http://localhost:5000/api/health | API health check |

---

## End-to-End Verification Checklist

Once deployed to AWS, perform these crucial tests:

1.  **Frontend Functionality:** Verify all public-facing components (Home, About, Highlights, Notices, ContactUs) load correctly and are fully responsive.
2.  **Admission Form Submission:**
    -   Navigate to `/admissions`.
    -   Fill out and submit the form with valid data.
    -   Confirm success toast message.
    -   Verify the submitted application appears in the Admin Dashboard under "Admissions Manager".
3.  **Admin Portal Functionality:**
    -   Log in at `/admin` using default credentials (`admin`/`admin123`). You will be prompted to change the password immediately.
    -   **Notices Manager:**
        -   Add a new notice: Confirm it appears in the table and on the public "Notice Board".
        -   Edit an existing notice: Verify changes are reflected.
        -   Delete a notice: Confirm it's removed from the table and public site.
    -   **Admissions Manager:**
        -   View full details of an admission.
        -   Toggle admission status from "Pending" to "Reviewed".
        -   Delete an admission.
4.  **API Health Checks:** Confirm `http://<EC2_PUBLIC_IP>/api/health` and `http://<EC2_PUBLIC_IP>/` both return HTTP 200.

---

## AWS Deployment

### Step 1 — Prerequisites

```bash
# Install tools
brew install terraform awscli gh   # or use apt/dnf

# Configure AWS credentials
aws configure

# Verify identity
aws sts get-caller-identity

# Generate SSH key pair for EC2
ssh-keygen -t ed25519 -f ./noor-key -N ""
# noor-key     = private key (keep safe, never commit)
# noor-key.pub = public key  (goes into terraform.tfvars)
```

### Step 2 — Terraform

```bash
cd infra
cp terraform.tfvars.example terraform.tfvars
# Fill in:
#   my_ip_cidr     = "YOUR_IP/32"   (curl ifconfig.me)
#   ec2_public_key = contents of noor-key.pub
#   db_password    = strong password (min 8 chars)

terraform init
terraform plan
terraform apply
# Note outputs: ec2_public_ip, rds_endpoint
```

### Step 3 — Verify Infrastructure (AWS CLI)

```bash
# Run the verification script — confirms EC2 running, RDS available,
# auto-fills Backend/.env with real RDS endpoint + generated JWT_SECRET
bash infra/scripts/verify-infra.sh
```

This script:
- Confirms EC2 state = `running` and RDS status = `available`
- Checks CloudWatch alarm `noor-ec2-cpu-high` exists
- Verifies RDS backup retention = 7 days
- Auto-fills `Backend/.env` with `MYSQL_HOST`, `FRONTEND_URL`, and a generated `JWT_SECRET`

### Step 4 — Set GitHub Secrets

```bash
# Requires: gh auth login
MYSQL_PASSWORD=yourpassword KEY_FILE=./noor-key bash infra/scripts/set-github-secrets.sh
```

Secrets set: `EC2_HOST`, `EC2_USER`, `EC2_SSH_KEY`, `MYSQL_PASSWORD`

Also set `JWT_SECRET` manually:
```bash
gh secret set JWT_SECRET --body "$(openssl rand -hex 32)"
```

### Step 5 — Deploy

```bash
git push origin main
# GitHub Actions will:
# 1. Build frontend (npm run build)
# 2. SSH into EC2
# 3. Pull latest code
# 4. Write Backend/.env from secrets
# 5. Restart backend via PM2 ecosystem.config.js
# 6. Copy dist/ to /var/www/html/
# 7. Install nginx config + reload nginx
# 8. Smoke test /api/health and /
```

### Step 6 — SSH into EC2 (if needed)

```bash
ssh -i ./noor-key ec2-user@<EC2_PUBLIC_IP>
pm2 logs noor-backend
pm2 status
```

---

## Security Notes

- **Change the default admin password immediately** after first login — the dashboard will prompt you automatically.
- `JWT_SECRET` must be a 32+ byte random string. Never use the placeholder.
- `Backend/.env` is gitignored — never commit it.
- CORS is locked to `FRONTEND_URL` from `.env` — not `*`.
- Rate limiting: 10 login attempts / 15 min, 20 admission submissions / hour.
- All admission form inputs are validated server-side via `express-validator`.

---

## Project Structure

```
├── Backend/
│   ├── ecosystem.config.js     # PM2 config
│   ├── index.js                # Entry point
│   └── src/
│       ├── app.js              # Express + CORS + rate limiting
│       ├── config/database.js
│       ├── models/             # AdminUser, Admission, Notice
│       ├── controllers/        # auth, admission, notice
│       ├── routes/
│       └── middleware/         # authMiddleware, errorHandler
├── Frontend/
│   └── src/
│       ├── components/         # Navbar, Hero, Footer, etc.
│       │   └── SocialIcons.jsx # Custom social media icons
│       ├── pages/
│       │   ├── admin/
│       │   │   ├── NoticesManager.jsx
│       │   │   └── AdmissionsViewer.jsx
│       │   ├── AdminDashboard.jsx
│       │   ├── AdminLogin.jsx
│       │   ├── AdmissionPortal.jsx
│       │   └── Home.jsx
│       ├── hooks/useAuth.js
│       └── services/api.js
├── infra/
│   ├── main.tf                 # EC2 + RDS + VPC + CloudWatch
│   ├── variables.tf
│   ├── outputs.tf
│   ├── nginx/noor-premier.conf # Nginx reverse proxy config
│   └── scripts/
│       ├── verify-infra.sh     # AWS CLI post-Terraform checks
│       └── set-github-secrets.sh
└── .github/workflows/deploy.yml
```

---

## Default Admin Credentials

| Username | Password |
|----------|----------|
| `admin` | `admin123` |

> **Change this immediately after first login.**

---

## What to Do Before Going Fully Live

1.  **Change admin password** — dashboard prompts on first login
2.  **Add real images** — `Frontend/src/assets/images/` is empty; add school photos
3.  **Custom domain + HTTPS** — point a domain to EC2 IP, then run Certbot: `sudo certbot --nginx`
4.  **Review MYSQL_PASSWORD** — use a strong, unique password in production
5.  **Monitor CloudWatch** — alarm `noor-ec2-cpu-high` fires at 80% CPU; add an SNS email notification if needed

---

## Contact

- Phone/WhatsApp: +92 335-9933339
- Instagram: [@noorpremierschool](https://instagram.com/noorpremierschool)
- Facebook: [/noorpremierschool](https://facebook.com/noorpremierschool)
- LinkedIn: [/noorpremierschool](https://linkedin.com/company/noorpremierschool)


