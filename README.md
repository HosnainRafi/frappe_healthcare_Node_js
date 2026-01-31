<p align="center">
  <img src="https://raw.githubusercontent.com/frappe/erpnext/develop/erpnext/public/images/erpnext-logo.png" alt="ERPNext Logo" width="200"/>
</p>

<h1 align="center">🏥 Frappe Healthcare + ERPNext</h1>
<h3 align="center">Docker Setup for Windows</h3>

<p align="center">
  <a href="#-quick-start"><img src="https://img.shields.io/badge/Quick%20Start-5%20min-brightgreen?style=for-the-badge" alt="Quick Start"/></a>
  <a href="#-features"><img src="https://img.shields.io/badge/ERPNext-v15-blue?style=for-the-badge" alt="ERPNext v15"/></a>
  <a href="#-features"><img src="https://img.shields.io/badge/Healthcare-v15-orange?style=for-the-badge" alt="Healthcare v15"/></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge" alt="License"/></a>
</p>

<p align="center">
  <b>Complete Docker setup for running ERPNext with Healthcare module on Windows</b><br>
  <sub>No complex installation. Just clone, run, and start managing your healthcare practice! 🚀</sub>
</p>

---

## 📋 Table of Contents

- [Features](#-features)
- [Prerequisites](#-prerequisites)
- [Quick Start](#-quick-start)
- [Step-by-Step Guide](#-step-by-step-guide)
- [Troubleshooting](#-troubleshooting)
- [Commands Reference](#-commands-reference)
- [Configuration](#-configuration)
- [Backup & Restore](#-backup--restore)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

| Feature                  | Description                                                |
| ------------------------ | ---------------------------------------------------------- |
| 🏥 **Healthcare Module** | Patient management, appointments, medical records, billing |
| 📊 **Full ERPNext**      | Complete ERP with accounting, inventory, HR, and more      |
| 🐳 **Dockerized**        | Easy setup with Docker - no complex dependencies           |
| 💾 **Persistent Data**   | All data saved even after container restart                |
| 🔧 **Batch Scripts**     | One-click setup, start, stop, and backup                   |
| 📚 **Well Documented**   | Comprehensive guides for beginners                         |

---

## 🔧 Prerequisites

Before you begin, ensure you have:

| Requirement | Details                        |
| ----------- | ------------------------------ |
| **OS**      | Windows 10/11 (64-bit)         |
| **RAM**     | Minimum 8GB (16GB recommended) |
| **Disk**    | At least 20GB free space       |
| **Docker**  | Docker Desktop with WSL 2      |

### Install Docker Desktop

1. Download from [docker.com](https://www.docker.com/products/docker-desktop/)
2. Run installer and select **"Use WSL 2 instead of Hyper-V"**
3. Restart your computer
4. Start Docker Desktop and wait for it to initialize

Verify installation:

```powershell
docker --version
docker-compose --version
```

---

## 🚀 Quick Start

```powershell
# Clone the repository
git clone https://github.com/HosnainRafi/frappe-healthcare.git
cd frappe-healthcare

# Pull images and start containers
docker-compose pull
docker-compose up -d

# Wait 5 minutes for site creation, then install Healthcare
docker-compose exec backend bench get-app https://github.com/frappe/healthcare.git --branch version-15
docker-compose exec backend bench --site frontend install-app healthcare
docker-compose exec backend bench --site frontend migrate
docker-compose exec backend bench --site frontend clear-cache
```

**Access ERPNext:** http://localhost:8080

| Credential | Value           |
| ---------- | --------------- |
| Username   | `Administrator` |
| Password   | `admin`         |

---

## 📖 Step-by-Step Guide

### Step 1: Clone & Navigate

```powershell
git clone https://github.com/HosnainRafi/frappe-healthcare.git
cd frappe-healthcare
```

### Step 2: Pull Docker Images

```powershell
docker-compose pull
```

> ⏱️ This downloads ~3-5GB. Takes 10-30 minutes depending on internet speed.

### Step 3: Start Containers

```powershell
docker-compose up -d
```

### Step 4: Wait for Site Creation

```powershell
docker-compose logs -f create-site
```

Wait until you see:

```
Installing erpnext...
Updating DocTypes for erpnext: [========================================] 100%
```

Press `Ctrl+C` to exit logs.

### Step 5: Install Healthcare Module

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

### Step 6: Access ERPNext 🎉

Open http://localhost:8080 and login with:

- **Username:** `Administrator`
- **Password:** `admin`

---

## 🔧 Troubleshooting

### ❌ Internal Server Error

**Solution:**

```powershell
docker-compose exec backend bench --site frontend migrate
docker-compose restart backend frontend websocket
docker-compose exec backend bench --site frontend clear-cache
```

### ❌ Docker Won't Start

**Solution:**

```powershell
# Run as Administrator
wsl --install
wsl --set-default-version 2
# Restart computer
```

### ❌ Port 8080 Already in Use

**Solution:**

```powershell
# Find process using port
netstat -ano | findstr :8080

# Kill process (replace PID)
taskkill /PID <PID> /F
```

Or change port in `docker-compose.yml`:

```yaml
ports:
  - "8081:8080" # Access via localhost:8081
```

### ❌ Site Creation Fails

**Solution:**

```powershell
docker-compose down -v
docker-compose up -d
```

### ❌ Slow Performance

**Solution:**

1. Open Docker Desktop → Settings → Resources
2. Set Memory to **6-8 GB**
3. Set CPUs to **4**
4. Apply & Restart

<details>
<summary><b>📋 More Issues & Solutions</b></summary>

| Issue                    | Solution                              |
| ------------------------ | ------------------------------------- |
| Connection refused       | Wait 2-3 min, run `docker-compose ps` |
| Permission denied        | Run Docker as Administrator           |
| Out of memory            | Increase Docker memory to 8GB         |
| Database timeout         | `docker-compose restart db`           |
| Healthcare install fails | Use `--branch develop`                |

</details>

---

## 📝 Commands Reference

### Daily Usage

| Action      | Command                  |
| ----------- | ------------------------ |
| **Start**   | `docker-compose up -d`   |
| **Stop**    | `docker-compose down`    |
| **Restart** | `docker-compose restart` |
| **Status**  | `docker-compose ps`      |
| **Logs**    | `docker-compose logs -f` |

### Bench Commands

```powershell
# Clear cache
docker-compose exec backend bench --site frontend clear-cache

# Run migrations
docker-compose exec backend bench --site frontend migrate

# List apps
docker-compose exec backend bench --site frontend list-apps

# Backup
docker-compose exec backend bench --site frontend backup --with-files
```

### Batch Scripts

| Script                   | Purpose                   |
| ------------------------ | ------------------------- |
| `setup.bat`              | Initial setup             |
| `start.bat`              | Start containers          |
| `stop.bat`               | Stop containers           |
| `install-healthcare.bat` | Install Healthcare module |
| `backup.bat`             | Create backup             |
| `logs.bat`               | View logs                 |

---

## ⚙️ Configuration

### Default Credentials

| Service | Username      | Password |
| ------- | ------------- | -------- |
| ERPNext | Administrator | admin    |
| MariaDB | root          | 123      |

### Ports

| Service     | Port            |
| ----------- | --------------- |
| ERPNext Web | 8080            |
| MariaDB     | 3306 (internal) |
| Redis       | 6379 (internal) |

### Docker Volumes

| Volume    | Purpose             |
| --------- | ------------------- |
| `sites`   | Site files & config |
| `db-data` | Database files      |
| `logs`    | Application logs    |

---

## 💾 Backup & Restore

### Create Backup

```powershell
docker-compose exec backend bench --site frontend backup --with-files
```

### Restore Backup

```powershell
docker cp backup.sql.gz frappe-healthcare-backend-1:/tmp/
docker-compose exec backend bench --site frontend restore /tmp/backup.sql.gz
```

---

## 📁 Project Structure

```
frappe-healthcare/
├── 📄 docker-compose.yml     # Main Docker configuration
├── 📄 .env                   # Environment variables
├── 📄 README.md              # This file
├── 📄 COMPLETE_GUIDE.md      # Detailed beginner guide
├── 🔧 setup.bat              # Initial setup script
├── 🔧 start.bat              # Start containers
├── 🔧 stop.bat               # Stop containers
├── 🔧 install-healthcare.bat # Install Healthcare
├── 🔧 backup.bat             # Create backup
├── 🔧 logs.bat               # View logs
└── 🔧 cleanup-all.bat        # Full cleanup (deletes data!)
```

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📚 Resources

- [ERPNext Documentation](https://docs.erpnext.com/)
- [Frappe Framework](https://frappeframework.com/docs)
- [Healthcare Module](https://github.com/frappe/healthcare)
- [ERPNext Forum](https://discuss.erpnext.com/)
- [Docker Documentation](https://docs.docker.com/)

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

ERPNext and Frappe are licensed under [GNU GPLv3](https://www.gnu.org/licenses/gpl-3.0.en.html).

---

<p align="center">
  <b>Made with ❤️ for the healthcare community</b><br>
  <sub>If this helped you, please ⭐ the repository!</sub>
</p>
