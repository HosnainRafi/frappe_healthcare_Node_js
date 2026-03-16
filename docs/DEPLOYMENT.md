# Production Deployment Guide — Frappe Healthcare Docker

Complete **copy-paste-ready** guide to deploy this project from your Windows development machine to a Linux production server.

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [What You Need Before Starting](#what-you-need-before-starting)
3. [PART A — Prepare Your Code (on Windows)](#part-a--prepare-your-code-on-windows)
4. [PART B — Set Up the Server (on Ubuntu)](#part-b--set-up-the-server-on-ubuntu)
5. [PART C — Deploy the Application](#part-c--deploy-the-application)
6. [PART D — SSL & Domain Setup](#part-d--ssl--domain-setup)
7. [PART E — Post-Deployment Configuration](#part-e--post-deployment-configuration)
8. [PART F — Maintenance & Operations](#part-f--maintenance--operations)
9. [PART G — Updating the Application](#part-g--updating-the-application)
10. [Troubleshooting](#troubleshooting)

---

## Architecture Overview

```
Internet
   │
   ▼
[ Nginx Reverse Proxy (port 80/443) ]
   │
   ├──► React Frontend (port 5173) — Patient portal UI
   ├──► Node.js Backend (port 3000) — REST API + WebSocket
   │       ├── PostgreSQL (port 5432)
   │       └── Redis (port 6379)
   │
   └──► Frappe/ERPNext (port 8080) — Admin panel + Healthcare module
           ├── MariaDB (port 3306)
           ├── Redis Cache
           ├── Redis Queue
           └── Redis SocketIO
```

### Services (14 containers total)

| Service          | Image                         | Purpose                       |
| ---------------- | ----------------------------- | ----------------------------- |
| `react-frontend` | Built from `./frontend`       | Patient-facing React app      |
| `nodejs-backend` | Built from `./nodejs-backend` | API server (Express + Prisma) |
| `postgres`       | postgres:15-alpine            | Node.js API database          |
| `redis-nodejs`   | redis:7-alpine                | Node.js caching & queues      |
| `frontend`       | frappe/erpnext:v15            | Frappe nginx proxy            |
| `backend`        | frappe/erpnext:v15            | Frappe gunicorn app server    |
| `websocket`      | frappe/erpnext:v15            | Frappe SocketIO               |
| `scheduler`      | frappe/erpnext:v15            | Background job scheduler      |
| `queue-long`     | frappe/erpnext:v15            | Long-running job worker       |
| `queue-short`    | frappe/erpnext:v15            | Short job worker              |
| `db`             | mariadb:10.6                  | Frappe database               |
| `redis-cache`    | redis:6.2-alpine              | Frappe cache                  |
| `redis-queue`    | redis:6.2-alpine              | Frappe job queue              |
| `redis-socketio` | redis:6.2-alpine              | Frappe real-time              |

---

## What You Need Before Starting

### You Must Have

- [ ] A **VPS/server** with Ubuntu 22.04 or 24.04 (DigitalOcean, AWS EC2, Linode, Hetzner, etc.)
- [ ] **Minimum specs**: 2 CPU cores, 4GB RAM (recommended: 4 cores, 8GB RAM), 50GB SSD
- [ ] **Root/sudo SSH access** to the server
- [ ] A **domain name** (e.g., `yourdomain.com`) — optional but recommended for HTTPS

### Nice to Have

- [ ] A **GitHub/GitLab account** with this repo pushed (simplifies deployments)
- [ ] A registered domain with DNS control

---

## PART A — Prepare Your Code (on Windows)

### A1. Push Your Code to Git

Open PowerShell in your project folder:

```powershell
cd C:\Users\hp\Projects\frappe-healthcare-docker
```

If you haven't initialized git yet:

```powershell
git init
git add .
git commit -m "Initial commit - healthcare docker project"
```

Create a repository on GitHub (https://github.com/new), then:

```powershell
git remote add origin https://github.com/YOUR_USERNAME/frappe-healthcare-docker.git
git branch -M main
git push -u origin main
```

### A2. Create the Production Environment File

Create a file called `.env.production` (do NOT push this to git):

```powershell
notepad .env.production
```

Paste this content — **replace every placeholder** with real values:

```env
# ================================================
# PRODUCTION ENVIRONMENT CONFIGURATION
# ================================================

# MariaDB (Frappe database)
MYSQL_ROOT_PASSWORD=CHANGE_ME_strong_mysql_password_here_123!

# Frappe
FRAPPE_SITE_NAME=frontend
ADMIN_PASSWORD=CHANGE_ME_admin_password_here

# ERPNext Version
ERPNEXT_VERSION=v15

# Frontend
FRONTEND_PORT=8080
SOCKETIO_PORT=9000

# Proxy
PROXY_READ_TIMEOUT=120
CLIENT_MAX_BODY_SIZE=50m

# Node.js Backend
FRAPPE_API_KEY=your_frappe_api_key
FRAPPE_API_SECRET=your_frappe_api_secret
JWT_SECRET=CHANGE_ME_generate_with_openssl_rand_base64_64
WEBHOOK_SECRET=CHANGE_ME_generate_with_openssl_rand_base64_32

# PostgreSQL (Node.js database)
POSTGRES_DB=hospital_db
POSTGRES_USER=hospital_user
POSTGRES_PASSWORD=CHANGE_ME_strong_postgres_password_here

# Optional: Twilio SMS
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=
```

### A3. Make Sure `.env.production` is in `.gitignore`

```powershell
Add-Content .gitignore "`n.env.production"
git add .gitignore
git commit -m "Add .env.production to gitignore"
git push
```

---

## PART B — Set Up the Server (on Ubuntu)

### B1. Connect to Your Server via SSH

From PowerShell on Windows:

```powershell
ssh root@YOUR_SERVER_IP
```

> Replace `YOUR_SERVER_IP` with your actual server IP address (e.g., `167.99.123.45`).

If this is your first connection, type `yes` when prompted about the fingerprint.

### B2. Update the System

```bash
apt update && apt upgrade -y
```

### B3. Create a Deploy User (don't run as root)

```bash
adduser deploy
```

Enter a password when prompted. Press Enter for all other fields.

```bash
usermod -aG sudo deploy
```

### B4. Set Up SSH Key for Deploy User

```bash
mkdir -p /home/deploy/.ssh
cp /root/.ssh/authorized_keys /home/deploy/.ssh/
chown -R deploy:deploy /home/deploy/.ssh
chmod 700 /home/deploy/.ssh
chmod 600 /home/deploy/.ssh/authorized_keys
```

### B5. Switch to Deploy User

```bash
su - deploy
```

From now on, all commands run as `deploy`.

### B6. Install Docker

```bash
# Download and run Docker install script
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Allow 'deploy' user to use Docker without sudo
sudo usermod -aG docker $USER

# IMPORTANT: Log out and back in for group change to take effect
exit
```

Now SSH back in as `deploy`:

```powershell
ssh deploy@YOUR_SERVER_IP
```

Verify Docker works:

```bash
docker --version
```

Expected output: `Docker version 27.x.x` or similar.

### B7. Install Docker Compose

```bash
# Docker Compose V2 is usually included with Docker now. Check:
docker compose version
```

If that shows a version, you're good. If not, install it:

```bash
sudo apt install -y docker-compose-plugin
```

> **Note**: On some servers, use `docker compose` (with a space). On others, `docker-compose` (with a hyphen). This guide uses `docker compose`. If your server has the older version, replace `docker compose` with `docker-compose` in all commands below.

### B8. Install Git and Other Tools

```bash
sudo apt install -y git curl wget nano htop
```

### B9. Configure the Firewall

```bash
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw --force enable
sudo ufw status
```

Expected output:

```
Status: active

To                         Action      From
--                         ------      ----
OpenSSH                    ALLOW       Anywhere
80/tcp                     ALLOW       Anywhere
443/tcp                    ALLOW       Anywhere
```

### B10. (Recommended) Add Swap Space

If your server has 4GB RAM or less:

```bash
sudo fallocate -l 4G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

Verify:

```bash
free -h
```

You should see `Swap: 4.0G` in the output.

---

## PART C — Deploy the Application

### C1. Clone the Repository on the Server

```bash
cd /home/deploy
git clone https://github.com/YOUR_USERNAME/frappe-healthcare-docker.git healthcare-app
cd healthcare-app
```

### C2. Create the Production .env File

```bash
nano .env
```

Paste your production values (same content as `.env.production` from Step A2). Save with `Ctrl+O`, `Enter`, `Ctrl+X`.

**Or** — copy from Windows using SCP. Open a **new PowerShell window** on Windows:

```powershell
cd C:\Users\hp\Projects\frappe-healthcare-docker
scp .env.production deploy@YOUR_SERVER_IP:/home/deploy/healthcare-app/.env
```

### C3. Generate Strong Secrets (on the server)

```bash
# Generate JWT_SECRET
echo "JWT_SECRET=$(openssl rand -base64 64 | tr -d '\n')"

# Generate WEBHOOK_SECRET
echo "WEBHOOK_SECRET=$(openssl rand -base64 32 | tr -d '\n')"

# Generate MYSQL_ROOT_PASSWORD
echo "MYSQL_ROOT_PASSWORD=$(openssl rand -base64 24 | tr -d '\n')"

# Generate POSTGRES_PASSWORD
echo "POSTGRES_PASSWORD=$(openssl rand -base64 24 | tr -d '\n')"
```

Copy-paste each generated value into the `.env` file:

```bash
nano .env
```

### C4. Update docker-compose.yml for Production

Edit the docker-compose file to set `NODE_ENV=production` for the Node.js backend:

```bash
nano docker-compose.yml
```

Find the `nodejs-backend` service and change:

```yaml
- NODE_ENV=development
```

to:

```yaml
- NODE_ENV=production
```

Save and exit (`Ctrl+O`, `Enter`, `Ctrl+X`).

### C5. Build the Docker Images

```bash
cd /home/deploy/healthcare-app
docker compose build
```

This builds:

- `nodejs-backend` — from `./nodejs-backend/Dockerfile`
- `react-frontend` — from `./frontend/Dockerfile`

All other services use pre-built images from Docker Hub.

> **This will take 3-10 minutes** depending on your server's internet speed.

### C6. Start All Services

```bash
docker compose up -d
```

### C7. Verify All Containers Are Running

```bash
docker compose ps
```

Expected output — all services should show `Up` or `Up (healthy)`:

```
NAME                                        STATUS
frappe-healthcare-docker-backend-1          Up
frappe-healthcare-docker-db-1               Up (healthy)
frappe-healthcare-docker-frontend-1         Up
frappe-healthcare-docker-nodejs-backend-1   Up (healthy)
frappe-healthcare-docker-postgres-1         Up (healthy)
frappe-healthcare-docker-queue-long-1       Up
frappe-healthcare-docker-queue-short-1      Up
frappe-healthcare-docker-react-frontend-1   Up
frappe-healthcare-docker-redis-cache-1      Up
frappe-healthcare-docker-redis-nodejs-1     Up (healthy)
frappe-healthcare-docker-redis-queue-1      Up
frappe-healthcare-docker-redis-socketio-1   Up
frappe-healthcare-docker-scheduler-1        Up
frappe-healthcare-docker-websocket-1        Up
```

### C8. Wait for First-Time Initialization

The `create-site` container installs Frappe, ERPNext, and Healthcare modules. **This takes 5-15 minutes on first run.**

Watch its progress:

```bash
docker compose logs -f create-site
```

Wait until you see something like:

```
create-site-1  | Installing healthcare...
create-site-1  | Updating Dashboard for frappe
create-site-1  | Updating Dashboard for erpnext
```

Press `Ctrl+C` to stop following logs.

### C9. Verify Services Are Accessible

```bash
# Test Node.js API
curl -s http://localhost:3000/health | head

# Test Frappe
curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/

# Test React Frontend
curl -s -o /dev/null -w "%{http_code}" http://localhost:5173/
```

Expected: `200` for each.

### C10. Test from Your Browser

If you don't have a domain yet, access directly via IP:

- **React Patient Portal**: `http://YOUR_SERVER_IP:5173`
- **Node.js API Docs**: `http://YOUR_SERVER_IP:3000/api-docs`
- **Frappe Admin Panel**: `http://YOUR_SERVER_IP:8080` (login: `Administrator` / your ADMIN_PASSWORD)

> **Important**: Ports 3000, 5173, and 8080 must be temporarily opened if you want direct access:
>
> ```bash
> sudo ufw allow 3000/tcp
> sudo ufw allow 5173/tcp
> sudo ufw allow 8080/tcp
> ```
>
> Remove these after setting up the reverse proxy (Part D).

---

## PART D — SSL & Domain Setup

Skip this section if you don't have a domain name. You can come back later.

### D1. Point Your Domain to the Server

Go to your domain registrar (GoDaddy, Namecheap, Cloudflare, etc.) and add these **DNS A records**:

| Type | Name  | Value            | TTL  |
| ---- | ----- | ---------------- | ---- |
| A    | `@`   | `YOUR_SERVER_IP` | 3600 |
| A    | `www` | `YOUR_SERVER_IP` | 3600 |

Wait for DNS propagation (usually 5-30 minutes). Verify:

```bash
ping yourdomain.com
```

Should show your server IP.

### D2. Install Certbot for SSL

```bash
sudo apt install -y certbot
```

### D3. Get SSL Certificate

**Stop the services first** (port 80 must be free for certbot):

```bash
docker compose down
```

```bash
sudo certbot certonly --standalone \
  -d yourdomain.com \
  -d www.yourdomain.com \
  --email your-email@example.com \
  --agree-tos \
  --no-eff-email
```

Certificates are saved to `/etc/letsencrypt/live/yourdomain.com/`.

### D4. Create the Production Nginx Config

```bash
sudo nano /home/deploy/healthcare-app/nginx/nginx.prod.conf
```

Paste this — **replace `yourdomain.com` everywhere**:

```nginx
events {
    worker_connections 1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/s;

    # Gzip
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml text/javascript
               application/json application/javascript application/xml+rss;

    # HTTP → HTTPS redirect
    server {
        listen 80;
        server_name yourdomain.com www.yourdomain.com;

        location /.well-known/acme-challenge/ {
            root /var/www/certbot;
        }

        location / {
            return 301 https://$host$request_uri;
        }
    }

    # HTTPS — Main site
    server {
        listen 443 ssl http2;
        server_name yourdomain.com www.yourdomain.com;

        ssl_certificate     /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
        ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
        ssl_protocols       TLSv1.2 TLSv1.3;
        ssl_ciphers         HIGH:!aNULL:!MD5;
        ssl_prefer_server_ciphers on;

        client_max_body_size 50m;

        # React Frontend
        location / {
            proxy_pass http://react-frontend:5173;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";
        }

        # Node.js API
        location /api/ {
            limit_req zone=api_limit burst=20 nodelay;
            proxy_pass http://nodejs-backend:3000;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_read_timeout 300s;
        }

        # Node.js WebSocket
        location /socket.io/ {
            proxy_pass http://nodejs-backend:3000;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
        }

        # Frappe / ERPNext admin
        location /frappe/ {
            proxy_pass http://frontend:8080/;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # Static assets cache
        location ~* \.(jpg|jpeg|png|gif|ico|css|js|woff2|woff|ttf|svg)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
            try_files $uri @react;
        }

        location @react {
            proxy_pass http://react-frontend:5173;
        }
    }
}
```

### D5. Add Nginx Reverse Proxy to Docker Compose

```bash
nano /home/deploy/healthcare-app/docker-compose.yml
```

Add this service **at the end of the `services:` section** (before the `volumes:` section):

```yaml
nginx-proxy:
  image: nginx:1.25-alpine
  ports:
    - "80:80"
    - "443:443"
  volumes:
    - ./nginx/nginx.prod.conf:/etc/nginx/nginx.conf:ro
    - /etc/letsencrypt:/etc/letsencrypt:ro
    - certbot-www:/var/www/certbot:ro
  depends_on:
    - react-frontend
    - nodejs-backend
    - frontend
  restart: unless-stopped
```

Add `certbot-www:` to the `volumes:` section at the bottom.

### D6. Remove Direct Port Exposure (Security)

Still in `docker-compose.yml`, remove or comment out the `ports:` for services that should only be accessed through nginx:

- `react-frontend`: remove `"5173:5173"`
- `nodejs-backend`: remove `"3000:3000"`
- `frontend` (Frappe): remove `"8080:8080"`

Keep `ports:` only for:

- `nginx-proxy` (80, 443)
- `postgres` and `db` (only if you need external DB access, otherwise remove too)

### D7. Start Everything

```bash
docker compose up -d
```

### D8. Remove Temporary Firewall Rules

```bash
sudo ufw delete allow 3000/tcp
sudo ufw delete allow 5173/tcp
sudo ufw delete allow 8080/tcp
```

### D9. Set Up Auto-Renewal for SSL

```bash
sudo crontab -e
```

Add this line:

```
0 3 * * * certbot renew --quiet --deploy-hook "docker restart $(docker ps -q --filter name=nginx-proxy)"
```

### D10. Test HTTPS

Open in browser: `https://yourdomain.com`

---

## PART E — Post-Deployment Configuration

### E1. Configure Frappe Healthcare

Access Frappe at `https://yourdomain.com/frappe/` (or `http://YOUR_SERVER_IP:8080` without domain).

Login: `Administrator` / the `ADMIN_PASSWORD` from your `.env`.

Go to:

1. **Setup Wizard** → Complete it
2. **Healthcare Settings** → Configure appointment durations
3. **Healthcare Practitioner** → Add your doctors

### E2. Generate Frappe API Keys

In Frappe, go to **User** → select the API user → **API Access** → **Generate Keys**.

Copy the API Key and API Secret, then update your `.env`:

```bash
cd /home/deploy/healthcare-app
nano .env
```

Update `FRAPPE_API_KEY` and `FRAPPE_API_SECRET`, then restart:

```bash
docker compose restart nodejs-backend
```

### E3. Set Up Automated Backups

```bash
nano /home/deploy/backup.sh
```

Paste:

```bash
#!/bin/bash
set -e
BACKUP_DIR="/home/deploy/backups/$(date +%Y-%m-%d)"
mkdir -p "$BACKUP_DIR"

cd /home/deploy/healthcare-app

# Backup PostgreSQL
echo "Backing up PostgreSQL..."
docker compose exec -T postgres pg_dump -U hospital_user hospital_db > "$BACKUP_DIR/postgres.sql"

# Backup MariaDB
echo "Backing up MariaDB..."
docker compose exec -T db mysqldump -u root -p"$(<.env grep MYSQL_ROOT_PASSWORD | cut -d= -f2)" --all-databases > "$BACKUP_DIR/mariadb.sql"

# Backup .env
cp .env "$BACKUP_DIR/env.backup"

# Remove backups older than 14 days
find /home/deploy/backups -type d -mtime +14 -exec rm -rf {} + 2>/dev/null || true

echo "Backup complete: $BACKUP_DIR"
```

```bash
chmod +x /home/deploy/backup.sh
```

Schedule daily backup at 2 AM:

```bash
crontab -e
```

Add:

```
0 2 * * * /home/deploy/backup.sh >> /home/deploy/backup.log 2>&1
```

---

## PART F — Maintenance & Operations

### F1. View Logs

```bash
cd /home/deploy/healthcare-app

# All services
docker compose logs --tail=50

# Specific service
docker compose logs --tail=50 nodejs-backend
docker compose logs --tail=50 backend
docker compose logs --tail=50 react-frontend

# Follow logs in real-time
docker compose logs -f nodejs-backend
```

### F2. Restart Services

```bash
# Restart everything
docker compose restart

# Restart one service
docker compose restart nodejs-backend
docker compose restart backend
docker compose restart frontend
```

### F3. Stop Everything

```bash
docker compose down
```

### F4. Start Everything

```bash
docker compose up -d
```

### F5. Check Resource Usage

```bash
# Container resource usage
docker stats

# Server resource usage
htop

# Disk space
df -h
```

### F6. Enter a Container Shell (for debugging)

```bash
# Node.js backend
docker compose exec nodejs-backend sh

# Frappe backend
docker compose exec backend bash

# PostgreSQL
docker compose exec postgres psql -U hospital_user hospital_db

# MariaDB
docker compose exec db mysql -u root -p
```

### F7. Run Prisma Commands

```bash
# Check database status
docker compose exec nodejs-backend npx prisma db push

# Open Prisma Studio (web database viewer)
docker compose exec nodejs-backend npx prisma studio
```

### F8. Run Frappe Bench Commands

```bash
# Migrate after app update
docker compose exec backend bench --site frontend migrate

# Clear cache
docker compose exec backend bench --site frontend clear-cache

# Rebuild assets
docker compose exec backend bench build
```

### F9. Manual Backup

```bash
/home/deploy/backup.sh
```

### F10. Restore from Backup

```bash
# Restore PostgreSQL
docker compose exec -T postgres psql -U hospital_user hospital_db < /home/deploy/backups/2026-03-16/postgres.sql

# Restore MariaDB
docker compose exec -T db mysql -u root -p < /home/deploy/backups/2026-03-16/mariadb.sql
```

---

## PART G — Updating the Application

When you make code changes on Windows and want to deploy them to the server.

### G1. Push Changes from Windows

On your Windows machine (PowerShell):

```powershell
cd C:\Users\hp\Projects\frappe-healthcare-docker
git add .
git commit -m "Description of changes"
git push origin main
```

### G2. Pull and Redeploy on Server

SSH into your server:

```bash
ssh deploy@YOUR_SERVER_IP
cd /home/deploy/healthcare-app
```

Pull latest code:

```bash
git pull origin main
```

Rebuild and restart only the changed services:

```bash
# If you changed Node.js backend code:
docker compose build nodejs-backend
docker compose up -d nodejs-backend

# If you changed React frontend code:
docker compose build react-frontend
docker compose up -d react-frontend

# If you changed both:
docker compose build nodejs-backend react-frontend
docker compose up -d nodejs-backend react-frontend

# If you changed docker-compose.yml itself:
docker compose up -d
```

### G3. Run Database Migrations (if schema changed)

```bash
docker compose exec nodejs-backend npx prisma db push
```

### G4. Quick One-Liner Deploy

For a full redeploy:

```bash
cd /home/deploy/healthcare-app && git pull origin main && docker compose build && docker compose up -d
```

---

## Troubleshooting

### Problem: Container keeps restarting

```bash
# Check what's wrong
docker compose logs --tail=100 SERVICE_NAME

# Check if it's an OOM kill
docker inspect SERVICE_NAME | grep -i oom
```

### Problem: 502 Bad Gateway

```bash
# Restart the nginx frontend and backend
docker compose restart frontend backend

# Or restart everything
docker compose restart
```

### Problem: Cannot connect to database

```bash
# Check if database container is healthy
docker compose ps postgres db

# Restart databases
docker compose restart postgres db

# Check database logs
docker compose logs postgres
docker compose logs db
```

### Problem: Out of disk space

```bash
# Check disk usage
df -h

# Clean unused Docker data (images, containers, volumes)
docker system prune -a

# WARNING: This removes unused volumes (data). Only if you have backups:
docker volume prune
```

### Problem: Out of memory

```bash
# Check memory
free -h

# Add more swap
sudo fallocate -l 8G /swapfile2
sudo chmod 600 /swapfile2
sudo mkswap /swapfile2
sudo swapon /swapfile2
```

### Problem: SSL certificate expired

```bash
sudo certbot renew
docker compose restart nginx-proxy
```

### Problem: Frappe shows "Site not found"

```bash
docker compose exec backend bench --site frontend migrate
docker compose restart backend frontend
```

---

## Quick Reference Card

| Task             | Command                                                     |
| ---------------- | ----------------------------------------------------------- |
| Start all        | `docker compose up -d`                                      |
| Stop all         | `docker compose down`                                       |
| Restart all      | `docker compose restart`                                    |
| View status      | `docker compose ps`                                         |
| View logs        | `docker compose logs --tail=50 SERVICE`                     |
| Follow logs      | `docker compose logs -f SERVICE`                            |
| Rebuild service  | `docker compose build SERVICE`                              |
| Deploy update    | `git pull && docker compose build && docker compose up -d`  |
| Backup           | `/home/deploy/backup.sh`                                    |
| Server resources | `docker stats`                                              |
| Disk space       | `df -h`                                                     |
| Enter container  | `docker compose exec SERVICE sh`                            |
| Frappe migrate   | `docker compose exec backend bench --site frontend migrate` |
| Prisma push      | `docker compose exec nodejs-backend npx prisma db push`     |

Service names: `nodejs-backend`, `react-frontend`, `backend`, `frontend`, `postgres`, `db`, `redis-nodejs`, `redis-cache`, `redis-queue`, `redis-socketio`, `scheduler`, `queue-long`, `queue-short`, `websocket`
