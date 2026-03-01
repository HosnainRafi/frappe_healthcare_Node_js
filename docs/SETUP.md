# Local Setup Guide

Complete guide to set up this Frappe Healthcare project on your local machine.

---

## Prerequisites

Before starting, ensure you have the following installed:

### Required Software

1. **Docker Desktop**
   - Download: https://www.docker.com/products/docker-desktop
   - Version: 20.10 or higher
   - Enable WSL2 backend (Windows) or use Docker for Mac/Linux

2. **Git**
   - Download: https://git-scm.com/downloads
   - Required to clone the repository

3. **Node.js** (Optional - only if you want to run frontend outside Docker)
   - Version: 18.x or higher
   - Download: https://nodejs.org/

### System Requirements

- **RAM**: Minimum 8GB, Recommended 16GB
- **Storage**: At least 10GB free space
- **OS**: Windows 10/11, macOS 10.15+, or Linux

---

## Step-by-Step Setup

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd frappe-healthcare-docker
```

### 2. Configure Environment Variables

The project already has a `.env` file configured. Verify it contains:

```env
# Database
POSTGRES_PASSWORD=postgres
POSTGRES_USER=postgres
POSTGRES_DB=healthcare_portal

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# Frappe
FRAPPE_SITE_NAME=frontend
MYSQL_ROOT_PASSWORD=admin
```

**Important:** Change `JWT_SECRET` and `MYSQL_ROOT_PASSWORD` for production use.

### 3. Start the Project

#### Option A: Using the run script (Recommended)

```bash
.\run.bat
```

This will:

- Start all Docker containers
- Wait for services to initialize
- Display access URLs

#### Option B: Manual Docker Compose

```bash
docker-compose up -d
```

### 4. Wait for Initialization

**First-time setup takes 5-10 minutes** because:

- Frappe/ERPNext needs to build and install
- Healthcare app needs to be installed
- Databases need to initialize

Check progress:

```bash
docker-compose logs -f backend
```

Wait until you see:

```
web.1 | * Running on http://0.0.0.0:8000
```

### 5. Access the Application

Once started, access:

- **Frontend (Patient Portal)**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **Frappe Admin**: http://localhost:8080

#### Frappe Login Credentials

```
Username: Administrator
Password: admin
```

### 6. Create Test Data (First Time Only)

#### A. Create Healthcare Practitioner

1. Go to http://localhost:8080
2. Login as Administrator
3. Search for "Healthcare Practitioner" in search bar
4. Click "New"
5. Fill in details:
   - First Name: John
   - Last Name: Doe
   - Practitioner Type: Internal
   - Status: Active
6. Click "Save"

#### B. Register Patient

1. Go to http://localhost:5173
2. Click "Register"
3. Fill in the form with your details
4. After registration, login

#### C. Book an Appointment

1. Navigate to "Book Appointment"
2. Select a practitioner
3. Choose date and time
4. Submit booking

---

## Verify Everything is Working

### Check All Services are Running

```bash
docker-compose ps
```

Expected output - all services should show "Up" status:

```
NAME                                   STATUS
frappe-healthcare-docker-backend-1     Up (healthy)
frappe-healthcare-docker-db-1          Up (healthy)
frappe-healthcare-docker-mariadb-1     Up (healthy)
frappe-healthcare-docker-nginx-1       Up
frappe-healthcare-docker-nodejs-backend-1  Up (healthy)
frappe-healthcare-docker-postgres-1    Up (healthy)
frappe-healthcare-docker-react-frontend-1  Up
frappe-healthcare-docker-redis-*       Up
```

### Test API Endpoints

```bash
# Health check
curl http://localhost:3000/health

# Get doctors list
curl http://localhost:3000/api/doctors
```

### Check Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f nodejs-backend
docker-compose logs -f react-frontend
docker-compose logs -f backend
```

---

## Common Setup Issues

### Issue 1: Port Already in Use

**Error:**

```
Error: bind: address already in use
```

**Solution:**

```bash
# Find what's using the port (example for port 3000)
netstat -ano | findstr :3000

# Stop the process or change ports in docker-compose.yml
```

### Issue 2: Docker Out of Memory

**Error:**

```
docker: Error response from daemon: OCI runtime create failed
```

**Solution:**

1. Open Docker Desktop
2. Settings → Resources
3. Increase Memory to at least 8GB
4. Restart Docker

### Issue 3: Frappe Not Starting

**Symptoms:**

- Can't access http://localhost:8080
- Backend container keeps restarting

**Solution:**

```bash
# Check backend logs
docker-compose logs backend

# Restart backend
docker-compose restart backend

# If still failing, rebuild
docker-compose down
docker-compose up -d --build backend
```

### Issue 4: Frontend Can't Connect to Backend

**Symptoms:**

- Login fails
- API errors in browser console

**Solution:**

1. Verify backend is running:

   ```bash
   curl http://localhost:3000/health
   ```

2. Check frontend environment in `frontend/vite.config.js`:

   ```js
   proxy: {
     '/api': {
       target: 'http://nodejs-backend:3000',
       changeOrigin: true,
     }
   }
   ```

3. Restart frontend:
   ```bash
   docker-compose restart react-frontend
   ```

### Issue 5: Database Connection Error

**Error:**

```
Error: connect ECONNREFUSED
```

**Solution:**

```bash
# Restart database containers
docker-compose restart postgres mariadb

# Wait 30 seconds, then restart app services
docker-compose restart nodejs-backend backend
```

### Issue 6: Prisma Migration Issues

**Error:**

```
Error: P1001: Can't reach database server
```

**Solution:**

```bash
# Access nodejs-backend container
docker-compose exec nodejs-backend sh

# Run Prisma commands
npx prisma generate
npx prisma db push

# Exit container
exit
```

---

## Development Workflow

### Making Code Changes

#### Backend Changes (Node.js)

1. Edit files in `nodejs-backend/src/`
2. Changes are auto-reloaded (nodemon)
3. If not reloading, restart:
   ```bash
   docker-compose restart nodejs-backend
   ```

#### Frontend Changes (React)

1. Edit files in `frontend/src/`
2. Vite hot-reload will update browser automatically
3. If not working, restart:
   ```bash
   docker-compose restart react-frontend
   ```

#### Frappe Changes

1. Edit files in `frappe_extensions/`
2. Copy to container and reload:
   ```bash
   docker-compose exec backend bench --site frontend reload-doc
   ```

### Adding New Dependencies

#### Node.js Backend

```bash
# Access container
docker-compose exec nodejs-backend sh

# Install package
npm install package-name

# Exit and restart
exit
docker-compose restart nodejs-backend
```

#### React Frontend

```bash
# Access container
docker-compose exec react-frontend sh

# Install package
npm install package-name

# Exit and restart
exit
docker-compose restart react-frontend
```

### Database Changes

#### Prisma Schema Changes

1. Edit `nodejs-backend/prisma/schema.prisma`
2. Apply changes:
   ```bash
   docker-compose exec nodejs-backend npx prisma db push
   ```

#### Frappe DocType Changes

1. Access Frappe admin: http://localhost:8080
2. Make changes in UI
3. Or use bench commands:
   ```bash
   docker-compose exec backend bench --site frontend migrate
   ```

---

## Stopping the Project

### Stop all services (containers keep data)

```bash
docker-compose down
```

### Stop and remove all data (fresh start)

```bash
docker-compose down -v
```

**Warning:** This deletes all databases and uploaded files!

---

## Backup and Restore

### Backup

```bash
# Run backup script
.\scripts\backup.bat

# Or manually backup databases
docker-compose exec postgres pg_dump -U postgres healthcare_portal > backup_postgres.sql
docker-compose exec backend bench --site frontend backup
```

### Restore

```bash
# Restore PostgreSQL
docker-compose exec -T postgres psql -U postgres healthcare_portal < backup_postgres.sql

# Restore Frappe
docker-compose exec backend bench --site frontend restore backup_file.sql.gz
```

---

## Useful Commands

```bash
# View all running containers
docker-compose ps

# View logs (all services)
docker-compose logs -f

# View logs (specific service)
docker-compose logs -f nodejs-backend

# Restart a service
docker-compose restart nodejs-backend

# Stop all services
docker-compose down

# Start all services
docker-compose up -d

# Rebuild and start
docker-compose up -d --build

# Access container shell
docker-compose exec nodejs-backend sh
docker-compose exec backend bash

# Check health status
.\scripts\health-check.bat

# Clean up unused Docker resources
docker system prune -a
```

---

## Next Steps

1. Read [STRUCTURE.md](STRUCTURE.md) to understand the codebase
2. Read [DEPLOYMENT.md](DEPLOYMENT.md) for production deployment
3. Start developing your features!

---

## Getting Help

- Check logs: `docker-compose logs -f`
- Check container status: `docker-compose ps`
- Restart services: `docker-compose restart`
- For Frappe issues: https://discuss.frappe.io/
- For Docker issues: https://docs.docker.com/

---

## Additional Resources

- Frappe Documentation: https://frappeframework.com/docs
- ERPNext Healthcare: https://docs.erpnext.com/docs/user/manual/en/healthcare
- Docker Compose: https://docs.docker.com/compose/
- Prisma: https://www.prisma.io/docs
- React + Vite: https://vitejs.dev/guide/
