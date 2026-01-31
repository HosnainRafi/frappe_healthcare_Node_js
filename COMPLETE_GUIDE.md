# 🏥 Frappe Healthcare + ERPNext Docker Installation - Complete Beginner Guide

> **Last Updated:** January 31, 2026  
> **Tested On:** Windows 10/11 with Docker Desktop  
> **Time Required:** 30-45 minutes (depending on internet speed)

---

## 📋 Table of Contents

1. [What You Will Get](#-what-you-will-get)
2. [Before You Start (Prerequisites)](#-before-you-start-prerequisites)
3. [Installation Steps (Copy-Paste Commands)](#-installation-steps-copy-paste-commands)
4. [Issues You Will Face & How to Fix Them](#-issues-you-will-face--how-to-fix-them)
5. [Daily Usage Commands](#-daily-usage-commands)
6. [Setting Up on a New PC](#-setting-up-on-a-new-pc)
7. [Quick Reference Card](#-quick-reference-card)

---

## 🎯 What You Will Get

After following this guide, you will have:

- ✅ **ERPNext v15** - Full ERP system
- ✅ **Frappe Healthcare Module** - Patient management, appointments, medical records
- ✅ **Running on localhost:8080** - Access from your browser
- ✅ **All data persisted** - Data saved even after restart

---

## 🔧 Before You Start (Prerequisites)

### Step 1: Install Docker Desktop

1. **Download:** Go to https://www.docker.com/products/docker-desktop/
2. **Install:** Run the downloaded installer
3. **IMPORTANT:** When asked, select **"Use WSL 2 instead of Hyper-V"**
4. **Restart** your computer after installation
5. **Start Docker Desktop** - Wait until the whale icon in system tray stops animating

### Step 2: Verify Docker is Working

Open **PowerShell** or **Command Prompt** and run:

```powershell
docker --version
```

You should see something like: `Docker version 29.1.5, build 0e6fee6`

If you get an error, see [Issue #1: Docker Won't Start](#issue-1-docker-desktop-wont-start)

### Step 3: System Requirements Check

| Requirement    | Minimum                 | Recommended |
| -------------- | ----------------------- | ----------- |
| RAM            | 8 GB                    | 16 GB       |
| Disk Space     | 20 GB free              | 50 GB free  |
| OS             | Windows 10 (64-bit)     | Windows 11  |
| Virtualization | Must be enabled in BIOS | -           |

---

## 🚀 Installation Steps (Copy-Paste Commands)

### Step 1: Open PowerShell and Navigate to Project Folder

```powershell
cd c:\Users\hp\Projects\frappe-healthcare-docker
```

> 📁 **Note:** Change this path if your folder is in a different location

---

### Step 2: Pull Docker Images (Downloads ~3-5 GB)

```powershell
docker-compose pull
```

⏱️ **Wait Time:** 10-30 minutes depending on internet speed

✅ **Success looks like:**

```
[+] Pulling 15/15
 ✔ Image mariadb:10.6 Pulled
 ✔ Image redis:6.2-alpine Pulled
 ✔ Image frappe/erpnext:v15 Pulled
```

---

### Step 3: Start All Containers

```powershell
docker-compose up -d
```

⏱️ **Wait Time:** 1-2 minutes for containers to start

✅ **Success looks like:**

```
[+] Running 11/11
 ✔ Container frappe-healthcare-docker-db-1 Started
 ✔ Container frappe-healthcare-docker-redis-cache-1 Started
 ✔ Container frappe-healthcare-docker-backend-1 Started
 ... (more containers)
```

---

### Step 4: Wait for Site Creation (IMPORTANT!)

The system automatically creates the ERPNext site. **This takes 3-5 minutes.**

**Monitor the progress:**

```powershell
docker-compose logs -f create-site
```

⏱️ **Wait until you see:**

```
Installing frappe...
Updating DocTypes for frappe: [========================================] 100%
Installing erpnext...
Updating DocTypes for erpnext: [========================================] 100%
*** Scheduler is disabled ***
```

**Press `Ctrl+C` to exit the log viewer after site is created.**

---

### Step 5: Install Healthcare Module

**Option A: Using the batch file (Easiest)**

```powershell
.\install-healthcare.bat
```

**Option B: Manual commands**

```powershell
# Download Healthcare app
docker-compose exec backend bench get-app https://github.com/frappe/healthcare.git --branch version-15

# Install on site
docker-compose exec backend bench --site frontend install-app healthcare

# Run migrations
docker-compose exec backend bench --site frontend migrate

# Clear cache
docker-compose exec backend bench --site frontend clear-cache
```

⏱️ **Wait Time:** 2-3 minutes

✅ **Success looks like:**

```
Installing healthcare...
Updating DocTypes for healthcare: [========================================] 100%
Updating Dashboard for healthcare
```

---

### Step 6: Access ERPNext Healthcare! 🎉

1. Open your browser
2. Go to: **http://localhost:8080**
3. Login with:
   - **Username:** `Administrator`
   - **Password:** `admin`

---

## ⚠️ Issues You Will Face & How to Fix Them

### Issue #1: Docker Desktop Won't Start

**🔴 Problem:** Docker Desktop stuck on "Starting..." or shows "WSL 2 installation is incomplete"

**✅ Solution:**

1. **Open PowerShell as Administrator** (Right-click → Run as Administrator)

2. **Install WSL 2:**

   ```powershell
   wsl --install
   wsl --set-default-version 2
   ```

3. **Restart your computer**

4. **If still not working - Enable Virtualization in BIOS:**
   - Restart PC and press F2/F10/Del during startup
   - Find "Virtualization Technology" or "Intel VT-x" or "AMD-V"
   - Enable it
   - Save and Exit

---

### Issue #2: "Internal Server Error" After Installation

**🔴 Problem:** When opening http://localhost:8080, you see "Internal Server Error"

**✅ Solution:** Run these commands in order:

```powershell
# Step 1: Run database migrations
docker-compose exec backend bench --site frontend migrate

# Step 2: Restart services
docker-compose restart backend frontend websocket

# Step 3: Wait 30 seconds, then clear cache
docker-compose exec backend bench --site frontend clear-cache
docker-compose exec backend bench --site frontend clear-website-cache

# Step 4: Refresh browser (Ctrl+F5 for hard refresh)
```

**Why this happens:** After installing new apps (like Healthcare), the database schema changes. Migrations update the database, and restart loads the new code.

---

### Issue #3: Port 8080 Already in Use

**🔴 Problem:** Error message: "Bind for 0.0.0.0:8080 failed: port is already allocated"

**✅ Solution:**

**Option A: Find and kill the process using port 8080**

```powershell
# Find what's using port 8080
netstat -ano | findstr :8080

# Kill the process (replace 1234 with actual PID from above)
taskkill /PID 1234 /F
```

**Option B: Use a different port**

Edit `docker-compose.yml`, find this line:

```yaml
ports:
  - "8080:8080"
```

Change to:

```yaml
ports:
  - "8081:8080"
```

Then restart:

```powershell
docker-compose down
docker-compose up -d
```

Now access at: **http://localhost:8081**

---

### Issue #4: Site Creation Fails / Database Errors

**🔴 Problem:** `create-site` container shows errors or exits immediately

**✅ Solution:**

```powershell
# Full reset (WARNING: This deletes all data!)
docker-compose down -v
docker-compose up -d
```

Wait 5 minutes for site to be created again.

---

### Issue #5: Healthcare App Installation Fails

**🔴 Problem:** "App not found" or git clone fails

**✅ Solution:**

```powershell
# Try with full URL
docker-compose exec backend bench get-app https://github.com/frappe/healthcare.git --branch version-15
```

If version-15 doesn't exist, try:

```powershell
docker-compose exec backend bench get-app https://github.com/frappe/healthcare.git --branch develop
```

---

### Issue #6: Containers Keep Restarting

**🔴 Problem:** Running `docker-compose ps` shows containers with status "Restarting"

**✅ Solution:**

```powershell
# Check which container is failing
docker-compose ps

# Check its logs
docker-compose logs backend

# Usually fix by increasing Docker memory:
# Docker Desktop → Settings → Resources → Memory → Set to 6GB or higher
```

---

### Issue #7: Very Slow Performance

**🔴 Problem:** Pages take 10+ seconds to load

**✅ Solution:**

1. **Increase Docker Resources:**
   - Open Docker Desktop
   - Go to Settings → Resources
   - Set Memory to **6-8 GB**
   - Set CPUs to **4**
   - Click "Apply & Restart"

2. **Restart containers:**
   ```powershell
   docker-compose restart
   ```

---

### Issue #8: "This site can't be reached" in Browser

**🔴 Problem:** Browser shows connection refused error

**✅ Solution:**

```powershell
# Check if containers are running
docker-compose ps

# All should show "Up" status
# If not, start them:
docker-compose up -d

# Wait 2-3 minutes for services to be ready
```

---

## 📅 Daily Usage Commands

### Start ERPNext (when you turn on PC)

```powershell
cd c:\Users\hp\Projects\frappe-healthcare-docker
docker-compose up -d
```

Wait 1-2 minutes, then open http://localhost:8080

### Stop ERPNext (when done working)

```powershell
docker-compose down
```

Your data is saved and will be there when you start again!

### Check Status

```powershell
docker-compose ps
```

### View Logs (for debugging)

```powershell
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
```

### Create Backup

```powershell
docker-compose exec backend bench --site frontend backup --with-files
```

---

## 💻 Setting Up on a New PC

### What to Copy

Copy this entire folder to the new PC:

```
frappe-healthcare-docker/
├── docker-compose.yml
├── .env
├── setup.bat
├── install-healthcare.bat
├── start.bat
├── stop.bat
└── ... (all other files)
```

### On the New PC

1. **Install Docker Desktop** (see Prerequisites section)

2. **Open PowerShell and navigate to folder:**

   ```powershell
   cd path\to\frappe-healthcare-docker
   ```

3. **Run setup:**

   ```powershell
   docker-compose pull
   docker-compose up -d
   ```

4. **Wait for site creation** (5 minutes)

5. **Install Healthcare:**

   ```powershell
   .\install-healthcare.bat
   ```

6. **If you get Internal Server Error:**

   ```powershell
   docker-compose exec backend bench --site frontend migrate
   docker-compose restart backend frontend websocket
   docker-compose exec backend bench --site frontend clear-cache
   ```

7. **Access at:** http://localhost:8080

---

## 📇 Quick Reference Card

### Login Credentials

| Field    | Value                 |
| -------- | --------------------- |
| URL      | http://localhost:8080 |
| Username | Administrator         |
| Password | admin                 |

### Essential Commands

| Action      | Command                                                                 |
| ----------- | ----------------------------------------------------------------------- |
| Start       | `docker-compose up -d`                                                  |
| Stop        | `docker-compose down`                                                   |
| Restart     | `docker-compose restart`                                                |
| Status      | `docker-compose ps`                                                     |
| Logs        | `docker-compose logs -f`                                                |
| Fix Errors  | `docker-compose exec backend bench --site frontend migrate`             |
| Clear Cache | `docker-compose exec backend bench --site frontend clear-cache`         |
| Full Reset  | `docker-compose down -v` then `docker-compose up -d`                    |
| Backup      | `docker-compose exec backend bench --site frontend backup --with-files` |

### File Purposes

| File                   | Purpose                                       |
| ---------------------- | --------------------------------------------- |
| docker-compose.yml     | Main configuration (don't edit unless needed) |
| .env                   | Environment variables                         |
| setup.bat              | First-time setup script                       |
| install-healthcare.bat | Installs Healthcare module                    |
| start.bat              | Starts containers                             |
| stop.bat               | Stops containers                              |
| backup.bat             | Creates backup                                |
| logs.bat               | Shows logs                                    |

### Installed Apps

| App        | Version | Branch     |
| ---------- | ------- | ---------- |
| Frappe     | 15.x    | -          |
| ERPNext    | 15.x    | -          |
| Healthcare | 15.x    | version-15 |

---

## 🆘 Still Having Issues?

1. **Check Docker is running:** Look for whale icon in system tray
2. **Check containers:** Run `docker-compose ps`
3. **Check logs:** Run `docker-compose logs backend`
4. **Full reset:** `docker-compose down -v` then `docker-compose up -d`
5. **Google the error:** Copy the error message and search

### Useful Resources

- ERPNext Documentation: https://docs.erpnext.com/
- Frappe Framework: https://frappeframework.com/docs
- Healthcare Module: https://github.com/frappe/healthcare
- ERPNext Forum: https://discuss.erpnext.com/

---

## 📝 Summary: The Complete Flow

```
1. Install Docker Desktop
         ↓
2. docker-compose pull        (Download images - 20 mins)
         ↓
3. docker-compose up -d       (Start containers - 2 mins)
         ↓
4. Wait for site creation     (Auto - 5 mins)
         ↓
5. install-healthcare.bat     (Install module - 3 mins)
         ↓
6. IF "Internal Server Error":
   → docker-compose exec backend bench --site frontend migrate
   → docker-compose restart backend frontend websocket
   → docker-compose exec backend bench --site frontend clear-cache
         ↓
7. Open http://localhost:8080
         ↓
8. Login: Administrator / admin
         ↓
   ✅ DONE! Start using Healthcare module
```

---

**Created with ❤️ for beginners who want to run ERPNext Healthcare without the hassle!**
