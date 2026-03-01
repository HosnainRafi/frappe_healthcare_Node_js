# Production Deployment Guide

Complete guide to deploy this Frappe Healthcare project to a live server.

---

## Overview

This guide covers deploying to:

- VPS (Virtual Private Server) - DigitalOcean, AWS EC2, Linode, etc.
- Bare metal server
- Cloud platforms

---

## Server Requirements

### Minimum Specifications

- **CPU**: 2 cores (4 cores recommended)
- **RAM**: 4GB minimum (8GB recommended)
- **Storage**: 50GB SSD
- **OS**: Ubuntu 22.04 LTS (recommended) or Ubuntu 20.04
- **Network**: Static IP address
- **Domain**: Registered domain name (e.g., yourdomain.com)

### Required Ports

Open these ports in your firewall:

- `80` - HTTP
- `443` - HTTPS (SSL)
- `22` - SSH (for server access)

---

## Pre-Deployment Checklist

- [ ] Domain name purchased and DNS configured
- [ ] SSL certificate ready (Let's Encrypt recommended)
- [ ] Server provisioned with Ubuntu 22.04
- [ ] Root/sudo access to server
- [ ] Backups strategy planned
- [ ] Environment variables prepared

---

## Step 1: Server Setup

### 1.1 Connect to Your Server

```bash
ssh root@your-server-ip
```

### 1.2 Update System

```bash
apt update && apt upgrade -y
```

### 1.3 Create Non-Root User (Recommended)

```bash
adduser deploy
usermod -aG sudo deploy
su - deploy
```

### 1.4 Install Docker

```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add user to docker group
sudo usermod -aG docker $USER

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.24.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Verify installation
docker --version
docker-compose --version
```

### 1.5 Install Additional Tools

```bash
sudo apt install -y git curl wget nano ufw
```

### 1.6 Configure Firewall

```bash
sudo ufw allow 22/tcp      # SSH
sudo ufw allow 80/tcp      # HTTP
sudo ufw allow 443/tcp     # HTTPS
sudo ufw --force enable
sudo ufw status
```

---

## Step 2: Clone and Configure Project

### 2.1 Clone Repository

```bash
cd /home/deploy
git clone <your-repository-url> healthcare-app
cd healthcare-app
```

### 2.2 Configure Environment Variables

```bash
nano .env
```

Update with production values:

```env
# Database - Use strong passwords
POSTGRES_PASSWORD=<STRONG_RANDOM_PASSWORD>
POSTGRES_USER=postgres
POSTGRES_DB=healthcare_portal

# JWT - Generate new secret
JWT_SECRET=<GENERATE_STRONG_SECRET_KEY>

# Frappe
FRAPPE_SITE_NAME=yourdomain.com
MYSQL_ROOT_PASSWORD=<STRONG_RANDOM_PASSWORD>

# Email Configuration (Optional but recommended)
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=your-email@gmail.com
MAIL_PASSWORD=<APP_PASSWORD>
```

**Generate Strong Secrets:**

```bash
# Generate JWT secret
openssl rand -base64 32

# Generate database password
openssl rand -base64 24
```

### 2.3 Update docker-compose.yml for Production

Create `docker-compose.prod.yml`:

```bash
nano docker-compose.prod.yml
```

```yaml
version: "3.8"

services:
  nginx:
    restart: always
    environment:
      - SERVER_NAME=yourdomain.com
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.prod.conf:/etc/nginx/nginx.conf:ro
      - ./certbot/conf:/etc/letsencrypt:ro
      - ./certbot/www:/var/www/certbot:ro

  nodejs-backend:
    restart: always
    environment:
      - NODE_ENV=production

  react-frontend:
    restart: always
    build:
      context: ./frontend
      args:
        - VITE_API_URL=https://yourdomain.com
    environment:
      - NODE_ENV=production

  backend:
    restart: always
    environment:
      - FRAPPE_SITE_NAME=yourdomain.com

  postgres:
    restart: always
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./backups/postgres:/backups

  mariadb:
    restart: always
    volumes:
      - mariadb_data:/var/lib/mysql
      - ./backups/mariadb:/backups

  redis-cache:
    restart: always
  redis-queue:
    restart: always
  redis-socketio:
    restart: always

volumes:
  postgres_data:
  mariadb_data:
```

---

## Step 3: Configure Nginx and SSL

### 3.1 Create Nginx Production Config

```bash
mkdir -p nginx
nano nginx/nginx.prod.conf
```

```nginx
events {
    worker_connections 1024;
}

http {
    upstream backend {
        server nodejs-backend:3000;
    }

    upstream frappe {
        server backend:8000;
    }

    # HTTP - Redirect to HTTPS
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

    # HTTPS - Frontend
    server {
        listen 443 ssl http2;
        server_name yourdomain.com www.yourdomain.com;

        ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
        ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

        # SSL configuration
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers HIGH:!aNULL:!MD5;
        ssl_prefer_server_ciphers on;

        # Frontend
        location / {
            proxy_pass http://react-frontend:5173;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # Backend API
        location /api/ {
            proxy_pass http://backend/;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_read_timeout 300s;
        }

        # WebSocket support
        location /socket.io {
            proxy_pass http://backend;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";
        }
    }

    # HTTPS - Frappe Admin
    server {
        listen 443 ssl http2;
        server_name admin.yourdomain.com;

        ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
        ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers HIGH:!aNULL:!MD5;

        location / {
            proxy_pass http://frappe;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
    }
}
```

### 3.2 Install SSL Certificate (Let's Encrypt)

```bash
# Install certbot
sudo apt install -y certbot

# Create directories
mkdir -p certbot/conf certbot/www

# Get certificate (make sure domain DNS is pointed to your server)
sudo certbot certonly --standalone \
  -d yourdomain.com \
  -d www.yourdomain.com \
  -d admin.yourdomain.com \
  --email your-email@example.com \
  --agree-tos \
  --no-eff-email

# Auto-renewal
sudo systemctl enable certbot.timer
```

---

## Step 4: Deploy Application

### 4.1 Build and Start Services

```bash
# Build images
docker-compose -f docker-compose.yml -f docker-compose.prod.yml build

# Start services
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# Check status
docker-compose ps
```

### 4.2 Initialize Frappe (First Time Only)

```bash
# Wait for Frappe to be ready (5-10 minutes)
docker-compose logs -f backend

# Once ready, create site
docker-compose exec backend bench new-site yourdomain.com \
  --mariadb-root-password <MYSQL_ROOT_PASSWORD> \
  --admin-password <ADMIN_PASSWORD>

# Install ERPNext
docker-compose exec backend bench --site yourdomain.com install-app erpnext

# Install Healthcare
docker-compose exec backend bench --site yourdomain.com install-app healthcare

# Set as default site
docker-compose exec backend bench use yourdomain.com
```

### 4.3 Setup Database

```bash
# Run Prisma migrations
docker-compose exec nodejs-backend npx prisma generate
docker-compose exec nodejs-backend npx prisma db push
```

---

## Step 5: Post-Deployment Configuration

### 5.1 Configure DNS

Point your domain to your server IP:

```
Type    Name    Value               TTL
A       @       your-server-ip      3600
A       www     your-server-ip      3600
A       admin   your-server-ip      3600
```

### 5.2 Frappe Configuration

Access admin panel: https://admin.yourdomain.com

1. **System Settings**
   - Set timezone
   - Set date format
   - Configure email

2. **Email Account**
   - Add email account for notifications
   - Test email sending

3. **Healthcare Settings**
   - Configure appointment duration
   - Set working hours
   - Configure departments

### 5.3 Setup Automated Backups

```bash
# Create backup script
nano /home/deploy/backup.sh
```

```bash
#!/bin/bash
BACKUP_DIR="/home/deploy/backups"
DATE=$(date +%Y%m%d_%H%M%S)

# Create backup directory
mkdir -p $BACKUP_DIR

# Backup PostgreSQL
docker-compose exec -T postgres pg_dump -U postgres healthcare_portal > $BACKUP_DIR/postgres_$DATE.sql

# Backup Frappe
docker-compose exec backend bench --site yourdomain.com backup

# Backup files
tar -czf $BACKUP_DIR/files_$DATE.tar.gz frontend/uploads nodejs-backend/uploads

# Keep only last 7 days of backups
find $BACKUP_DIR -type f -mtime +7 -delete

echo "Backup completed: $DATE"
```

```bash
# Make executable
chmod +x /home/deploy/backup.sh

# Setup cron job (daily at 2 AM)
crontab -e
```

Add:

```
0 2 * * * /home/deploy/backup.sh >> /home/deploy/backup.log 2>&1
```

### 5.4 Setup Monitoring

```bash
# Install monitoring tools
sudo apt install -y htop iotop nethogs

# Setup log rotation
sudo nano /etc/logrotate.d/docker-logs
```

```
/home/deploy/healthcare-app/logs/*.log {
    daily
    rotate 14
    compress
    delaycompress
    notifempty
    create 0640 deploy deploy
}
```

---

## Step 6: Security Hardening

### 6.1 Secure SSH

```bash
sudo nano /etc/ssh/sshd_config
```

Update:

```
PermitRootLogin no
PasswordAuthentication no  # Use SSH keys only
Port 2222  # Change from default 22
```

```bash
sudo systemctl restart sshd
```

### 6.2 Install Fail2Ban

```bash
sudo apt install -y fail2ban
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

### 6.3 Configure Docker Security

```bash
# Limit container resources
# Add to docker-compose.prod.yml for each service:
```

```yaml
services:
  nodejs-backend:
    deploy:
      resources:
        limits:
          cpus: "0.5"
          memory: 512M
```

### 6.4 Setup HTTPS-Only

Update `.env`:

```env
SECURE_COOKIES=true
HTTPS_ONLY=true
```

---

## Step 7: Performance Optimization

### 7.1 Enable Caching

Update nginx config to add cache headers:

```nginx
location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

### 7.2 Configure Redis for Sessions

Already configured in docker-compose.yml, verify:

```bash
docker-compose exec redis-cache redis-cli ping
# Should return: PONG
```

### 7.3 Database Optimization

```bash
# PostgreSQL
docker-compose exec postgres psql -U postgres -d healthcare_portal -c "VACUUM ANALYZE;"

# MariaDB
docker-compose exec mariadb mysql -u root -p<password> -e "OPTIMIZE TABLE \`tabPatient\`;"
```

---

## Step 8: Monitoring and Maintenance

### 8.1 Check Service Health

```bash
# Check all containers
docker-compose ps

# Check logs
docker-compose logs --tail=100 -f

# Check resource usage
docker stats
```

### 8.2 Update Application

```bash
# Pull latest changes
cd /home/deploy/healthcare-app
git pull origin main

# Rebuild and restart
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build

# Check status
docker-compose ps
```

### 8.3 Database Backups

```bash
# Manual backup
./backup.sh

# Restore from backup
docker-compose exec -T postgres psql -U postgres healthcare_portal < backup.sql
```

---

## Common Deployment Issues

### Issue 1: SSL Certificate Not Working

**Symptoms:** HTTPS not accessible, SSL errors

**Solution:**

```bash
# Verify certificate
sudo certbot certificates

# Renew certificate
sudo certbot renew --dry-run

# Check nginx config
docker-compose exec nginx nginx -t

# Restart nginx
docker-compose restart nginx
```

### Issue 2: Out of Memory

**Symptoms:** Containers crashing, slow performance

**Solution:**

```bash
# Check memory usage
free -h
docker stats

# Increase swap
sudo fallocate -l 4G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile

# Make permanent
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

### Issue 3: Database Connection Timeout

**Symptoms:** Backend can't connect to database

**Solution:**

```bash
# Check database is running
docker-compose ps postgres mariadb

# Restart databases
docker-compose restart postgres mariadb

# Check database logs
docker-compose logs postgres
docker-compose logs mariadb
```

### Issue 4: Domain Not Accessible

**Symptoms:** Can't access website via domain

**Solution:**

1. Check DNS propagation: https://dnschecker.org/
2. Verify nginx is running: `docker-compose ps nginx`
3. Check firewall: `sudo ufw status`
4. Check nginx logs: `docker-compose logs nginx`

### Issue 5: Slow Performance

**Solution:**

```bash
# Check resource usage
htop
docker stats

# Optimize database
docker-compose exec postgres vacuumdb -U postgres -d healthcare_portal -z -v

# Clear cache
docker-compose exec redis-cache redis-cli FLUSHDB

# Restart services
docker-compose restart
```

---

## Rollback Procedure

If deployment fails:

```bash
# Stop current deployment
docker-compose down

# Restore previous version
git checkout <previous-commit-hash>

# Restore database
docker-compose exec -T postgres psql -U postgres healthcare_portal < backup.sql

# Start services
docker-compose up -d
```

---

## Scaling (Advanced)

### Horizontal Scaling

1. Use Docker Swarm or Kubernetes
2. Setup load balancer
3. Configure shared storage for uploads
4. Use external Redis cluster
5. Database replication

### Vertical Scaling

```yaml
# Increase resources in docker-compose.prod.yml
deploy:
  resources:
    limits:
      cpus: "2"
      memory: 4G
```

---

## Maintenance Schedule

### Daily

- Check service status
- Review error logs
- Monitor disk space

### Weekly

- Review backup logs
- Check SSL certificate expiry
- Update security patches

### Monthly

- Full system backup
- Performance review
- Security audit
- Update dependencies

---

## Support and Troubleshooting

### Get Help

- Check logs: `docker-compose logs -f`
- Server resources: `htop`, `df -h`
- Network: `netstat -tulpn`

### Emergency Contacts

- Server Provider Support
- DNS Provider Support
- SSL Certificate Authority

---

## Next Steps

- Setup monitoring (Prometheus, Grafana)
- Configure CDN (Cloudflare)
- Implement CI/CD pipeline
- Setup staging environment
- Configure automatic updates

---

## Additional Resources

- Docker Production Best Practices: https://docs.docker.com/develop/dev-best-practices/
- Nginx Security: https://nginx.org/en/docs/http/ngx_http_ssl_module.html
- Let's Encrypt: https://letsencrypt.org/docs/
- Frappe Production Setup: https://frappeframework.com/docs/user/en/production-setup
