# Frappe Healthcare for ERPNext - Docker Installation Guide

## Complete Setup Guide for Windows with Docker Desktop

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Quick Start](#quick-start)
3. [Step-by-Step Installation](#step-by-step-installation)
4. [Troubleshooting Guide](#troubleshooting-guide)
5. [Common Issues & Solutions](#common-issues--solutions)
6. [Useful Commands](#useful-commands)
7. [Configuration Reference](#configuration-reference)
8. [Backup & Restore](#backup--restore)

---

## Prerequisites

### 1. Install Docker Desktop for Windows

1. Download Docker Desktop from: https://www.docker.com/products/docker-desktop/
2. Run the installer
3. **IMPORTANT**: During installation, ensure "Use WSL 2 instead of Hyper-V" is selected
4. Restart your computer after installation
5. Start Docker Desktop and wait for it to fully initialize (whale icon in system tray should stop animating)

### 2. System Requirements

- Windows 10/11 (64-bit) with WSL 2
- Minimum 8GB RAM (16GB recommended)
- At least 20GB free disk space
- Virtualization enabled in BIOS

### 3. Verify Docker Installation

Open PowerShell or Command Prompt and run:

```cmd
docker --version
docker-compose --version
```

Both commands should show version information.

---

## Quick Start

If you just want to get started quickly:

```cmd
cd c:\Users\hp\Projects\frappe-healthcare-docker

# Step 1: Start ERPNext
setup.bat

# Step 2: Wait for setup to complete (3-5 minutes)

# Step 3: Install Healthcare module
install-healthcare.bat

# Step 4: Access at http://localhost:8080
# Username: Administrator
# Password: admin
```

---

## Step-by-Step Installation

### Step 1: Prepare the Environment

1. Open Docker Desktop and ensure it's running
2. Open Command Prompt or PowerShell
3. Navigate to the project folder:

```cmd
cd c:\Users\hp\Projects\frappe-healthcare-docker
```

### Step 2: Pull Docker Images

```cmd
docker-compose pull
```

This downloads all required images (~3-5GB). This may take 10-30 minutes depending on your internet speed.

### Step 3: Start the Containers

```cmd
docker-compose up -d
```

### Step 4: Monitor Site Creation

The first startup creates the ERPNext site. Monitor progress:

```cmd
docker-compose logs -f create-site
```

Wait until you see: `Site frontend installed`

This typically takes 3-5 minutes.

### Step 5: Access ERPNext

Open your browser and go to: **http://localhost:8080**

Login credentials:

- **Username**: Administrator
- **Password**: admin

### Step 6: Install Healthcare Module

```cmd
docker-compose exec backend bench get-app healthcare --branch version-15
docker-compose exec backend bench --site frontend install-app healthcare
docker-compose exec backend bench --site frontend migrate
docker-compose exec backend bench --site frontend clear-cache
```

Or simply run:

```cmd
install-healthcare.bat
```

### Step 7: Configure Healthcare

1. Login to ERPNext at http://localhost:8080
2. Search for "Healthcare Settings" in the search bar
3. Configure your healthcare settings
4. Start creating Patients, Practitioners, etc.

---

## Troubleshooting Guide

### Issue 1: Docker Desktop Won't Start

**Symptoms:**

- Docker Desktop stuck on "Starting..."
- Error: "WSL 2 installation is incomplete"

**Solutions:**

1. **Enable WSL 2:**

   ```powershell
   # Run PowerShell as Administrator
   wsl --install
   wsl --set-default-version 2
   ```

2. **Enable Virtualization in BIOS:**
   - Restart computer
   - Enter BIOS (usually F2, F10, or Del during startup)
   - Find "Virtualization Technology" or "Intel VT-x" / "AMD-V"
   - Enable it
   - Save and restart

3. **Reinstall Docker Desktop:**
   - Uninstall Docker Desktop
   - Restart computer
   - Install Docker Desktop again

---

### Issue 2: Port 8080 Already in Use

**Symptoms:**

- Error: "Bind for 0.0.0.0:8080 failed: port is already allocated"

**Solutions:**

1. **Find what's using the port:**

   ```cmd
   netstat -ano | findstr :8080
   ```

2. **Kill the process:**

   ```cmd
   taskkill /PID <PID_NUMBER> /F
   ```

3. **Or change the port in docker-compose.yml:**
   Change `"8080:8080"` to `"8081:8080"` (then access via http://localhost:8081)

---

### Issue 3: Site Creation Fails

**Symptoms:**

- `create-site` container exits with error
- Database connection errors

**Solutions:**

1. **Check database is healthy:**

   ```cmd
   docker-compose logs db
   ```

2. **Restart everything:**

   ```cmd
   docker-compose down
   docker-compose up -d
   ```

3. **Full reset:**

   ```cmd
   docker-compose down -v
   docker-compose up -d
   ```

4. **Check disk space:**
   - Ensure at least 10GB free space
   - Docker Desktop > Settings > Resources > Disk image size

---

### Issue 4: Healthcare App Installation Fails

**Symptoms:**

- "App not found" error
- Git clone fails

**Solutions:**

1. **Try alternative repository URL:**

   ```cmd
   docker-compose exec backend bench get-app https://github.com/frappe/healthcare.git --branch version-15
   ```

2. **If version-15 branch doesn't exist:**

   ```cmd
   docker-compose exec backend bench get-app https://github.com/frappe/healthcare.git --branch develop
   ```

3. **Check container has internet:**
   ```cmd
   docker-compose exec backend ping github.com
   ```

---

### Issue 5: Slow Performance

**Symptoms:**

- Pages take long to load
- Container uses too much memory

**Solutions:**

1. **Increase Docker resources:**
   - Docker Desktop > Settings > Resources
   - Memory: Set to at least 4GB (8GB recommended)
   - CPUs: Set to at least 2

2. **Restart containers:**
   ```cmd
   docker-compose restart
   ```

---

### Issue 6: "This site can't be reached" Error

**Symptoms:**

- Browser shows connection refused
- localhost:8080 not working

**Solutions:**

1. **Check containers are running:**

   ```cmd
   docker-compose ps
   ```

   All services should show "Up"

2. **Check frontend logs:**

   ```cmd
   docker-compose logs frontend
   ```

3. **Wait longer:**
   Sometimes services need 2-3 minutes to fully start

4. **Try different browser or incognito mode**

---

### Issue 7: Permission Denied Errors

**Symptoms:**

- Permission errors in logs
- Cannot write to volumes

**Solutions:**

1. **Reset volumes:**

   ```cmd
   docker-compose down -v
   docker-compose up -d
   ```

2. **Run Docker Desktop as Administrator**

---

### Issue 8: Out of Memory

**Symptoms:**

- Containers keep restarting
- OOM (Out of Memory) in logs

**Solutions:**

1. **Increase Docker memory:**
   - Docker Desktop > Settings > Resources > Memory
   - Set to 6-8GB

2. **Close other applications**

3. **Reduce workers (edit docker-compose.yml):**
   - Remove `queue-long` service or reduce replica count

---

### Issue 9: Database Connection Timeout

**Symptoms:**

- "Can't connect to MySQL server"
- Timeout errors

**Solutions:**

1. **Wait for database to be ready:**

   ```cmd
   docker-compose logs db
   ```

   Wait for "ready for connections"

2. **Restart database:**

   ```cmd
   docker-compose restart db
   ```

3. **Check database health:**
   ```cmd
   docker-compose exec db mysqladmin ping -p123
   ```

---

### Issue 10: Redis Connection Issues

**Symptoms:**

- "Redis connection refused"
- Cache errors

**Solutions:**

1. **Check Redis containers:**

   ```cmd
   docker-compose ps | findstr redis
   ```

2. **Restart Redis services:**
   ```cmd
   docker-compose restart redis-cache redis-queue redis-socketio
   ```

---

## Common Issues & Solutions

| Issue                    | Quick Solution                                |
| ------------------------ | --------------------------------------------- |
| Docker not starting      | Enable WSL 2 and virtualization               |
| Port already in use      | Change port in docker-compose.yml             |
| Site won't create        | `docker-compose down -v` then `up -d`         |
| Healthcare install fails | Use develop branch                            |
| Slow performance         | Increase Docker memory to 8GB                 |
| Connection refused       | Wait 2-3 minutes, check `docker-compose ps`   |
| Permission denied        | Run Docker as Administrator                   |
| Out of memory            | Increase Docker memory limit                  |
| Database timeout         | Wait and restart: `docker-compose restart db` |

---

## Useful Commands

### Container Management

```cmd
# Start all containers
docker-compose up -d

# Stop all containers
docker-compose down

# Restart all containers
docker-compose restart

# View running containers
docker-compose ps

# View logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f db
```

### Bench Commands (Inside Container)

```cmd
# Access bench console
docker-compose exec backend bench console

# Clear cache
docker-compose exec backend bench --site frontend clear-cache

# Run migrations
docker-compose exec backend bench --site frontend migrate

# Install an app
docker-compose exec backend bench --site frontend install-app <app_name>

# Backup
docker-compose exec backend bench --site frontend backup --with-files

# List installed apps
docker-compose exec backend bench --site frontend list-apps
```

### Database Commands

```cmd
# Access MariaDB
docker-compose exec db mysql -u root -p123

# Show databases
docker-compose exec db mysql -u root -p123 -e "SHOW DATABASES;"
```

---

## Configuration Reference

### Default Credentials

| Service       | Username      | Password |
| ------------- | ------------- | -------- |
| ERPNext Admin | Administrator | admin    |
| MariaDB Root  | root          | 123      |

### Default Ports

| Service     | Port            |
| ----------- | --------------- |
| ERPNext Web | 8080            |
| MariaDB     | 3306 (internal) |
| Redis Cache | 6379 (internal) |
| Socket.IO   | 9000 (internal) |

### Docker Volumes

| Volume        | Purpose                      |
| ------------- | ---------------------------- |
| sites         | Site files and configuration |
| db-data       | MariaDB database files       |
| redis-\*-data | Redis persistence            |
| logs          | Application logs             |

---

## Backup & Restore

### Create Backup

```cmd
# Run backup script
backup.bat

# Or manually:
docker-compose exec backend bench --site frontend backup --with-files
```

### Restore Backup

```cmd
# Copy backup files to container
docker cp backup_file.sql.gz frappe-healthcare-docker-backend-1:/tmp/

# Restore
docker-compose exec backend bench --site frontend restore /tmp/backup_file.sql.gz
```

---

## File Structure

```
frappe-healthcare-docker/
├── docker-compose.yml      # Main Docker configuration
├── .env                    # Environment variables
├── setup.bat               # Initial setup script
├── install-healthcare.bat  # Healthcare module installer
├── start.bat               # Start containers
├── stop.bat                # Stop containers
├── cleanup-all.bat         # Complete cleanup (deletes data!)
├── logs.bat                # View logs
├── backup.bat              # Create backup
└── README.md               # This file
```

---

## Support & Resources

- **Frappe Framework**: https://frappeframework.com/docs
- **ERPNext Documentation**: https://docs.erpnext.com/
- **Healthcare Module**: https://github.com/frappe/healthcare
- **Docker Documentation**: https://docs.docker.com/
- **Community Forum**: https://discuss.erpnext.com/

---

## License

This setup guide and scripts are provided as-is for educational purposes.
Frappe and ERPNext are licensed under GNU GPLv3.

---

## Version History

- **v1.0** (January 2026) - Initial release with ERPNext v15 support
#   f r a p p e _ h e a l t h c a r e  
 #   f r a p p e - h e a l t h c a r e  
 