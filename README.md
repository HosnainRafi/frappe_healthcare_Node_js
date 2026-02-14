<p align="center">
  <img src="https://raw.githubusercontent.com/frappe/erpnext/develop/erpnext/public/images/erpnext-logo.png" alt="ERPNext Logo" width="200"/>
</p>

<h1 align="center">🏥 Frappe Healthcare + ERPNext</h1>
<h3 align="center">Complete Hospital Management System</h3>

<p align="center">
  <a href="#-quick-start"><img src="https://img.shields.io/badge/Quick%20Start-5%20min-brightgreen?style=for-the-badge" alt="Quick Start"/></a>
  <a href="#-features"><img src="https://img.shields.io/badge/ERPNext-v15-blue?style=for-the-badge" alt="ERPNext v15"/></a>
  <a href="#-features"><img src="https://img.shields.io/badge/Healthcare-v15-orange?style=for-the-badge" alt="Healthcare v15"/></a>
  <a href="#-documentation"><img src="https://img.shields.io/badge/Docs-Complete-success?style=for-the-badge" alt="Documentation"/></a>
</p>

<p align="center">
  <b>Complete Docker-based hospital management system with dynamic website</b><br>
  <sub>Patient registration • Doctor portals • Appointment booking • Medical records • Automated workflows</sub>
</p>

<p align="center">
  <b>🌐 Live Demo:</b> <a href="http://147.93.153.249:8081">http://147.93.153.249:8081</a>
</p>

---

## 📋 Table of Contents

- [Features](#-features)
- [Quick Start](#-quick-start)
- [Documentation](#-documentation)
- [Scripts](#-scripts)
- [Project Structure](#-project-structure)
- [Configuration](#-configuration)
- [Common Tasks](#-common-tasks)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

### 🏥 Healthcare Management

- ✅ **Patient Management** - Registration, records, medical history
- ✅ **Doctor/Practitioner Portal** - Manage appointments & consultations
- ✅ **Appointment System** - Online booking with schedule management
- ✅ **Medical Records** - Prescriptions, lab tests, encounters
- ✅ **Billing & Invoicing** - Integrated financial management
- ✅ **Lab Management** - Test templates, results, reports

### 🌐 Dynamic Public Website

- ✅ **Live Doctor Listings** - Auto-updates from database
- ✅ **Department Showcase** - Dynamic services/department pages
- ✅ **Online Booking** - Public appointment scheduling
- ✅ **Patient Self-Registration** - Automated or manual approval
- ✅ **Responsive Design** - Mobile-friendly interface

### 👥 User Portals

| Portal             | Features                                                   |
| ------------------ | ---------------------------------------------------------- |
| **Patient Portal** | Book appointments • View records • Prescriptions • Billing |
| **Doctor Portal**  | Manage schedules • Patient encounters • Consultations      |
| **Admin Portal**   | Full system control • Reports • Configuration              |

### 🤖 Automation

- ✅ **Auto Patient Creation** - No manual linking required (10-min setup)
- ✅ **Email Notifications** - Welcome emails, appointment reminders
- ✅ **Live Statistics** - Real-time doctor/patient/appointment counts
- ✅ **Server Scripts** - Custom automation without code changes

### 🛠️ Infrastructure

- 🐳 **Docker & Docker Compose** - Easy deployment
- 💾 **Persistent Storage** - Data survives container restarts
- 🔧 **Batch Scripts** - One-click operations (start/stop/backup)
- 📊 **MariaDB 10.6** - Reliable database
- 🚀 **Redis Services** - Caching, queuing, real-time features
- 📝 **Comprehensive Docs** - Step-by-step guides for everything

---

## 🔧 Prerequisites

Before starting, ensure you have:

| Requirement | Details                               |
| ----------- | ------------------------------------- |
| **OS**      | Windows 10/11 (64-bit)                |
| **RAM**     | Minimum 4GB (8GB recommended)         |
| **Storage** | 20GB+ free space                      |
| **Docker**  | Docker Desktop with WSL 2             |
| **Network** | Internet connection for initial setup |

### Install Docker Desktop

1. Download from [docker.com](https://www.docker.com/products/docker-desktop/)
2. Run installer and select **"Use WSL 2 instead of Hyper-V"**
3. Restart your computer
4. Start Docker Desktop and verify installation:

```powershell
docker --version
docker-compose --version
```

---

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

### One-Line Setup (with scripts)

```powershell
# Clone repository
git clone <your-repo-url>
cd frappe-healthcare-docker

# Run setup (everything automated!)
scripts\setup.bat
scripts\install-healthcare.bat
scripts\start.bat
```

### Manual Setup

```powershell
# 1. Pull Docker images
docker-compose pull

# 2. Start containers
docker-compose up -d

# 3. Wait 5 minutes, then install Healthcare
docker-compose exec backend bench get-app healthcare --branch version-15
docker-compose exec backend bench --site frontend install-app healthcare
docker-compose exec backend bench --site frontend migrate
docker-compose exec backend bench --site frontend clear-cache
```

### Access the System

| Service            | URL                                                 | Credentials           |
| ------------------ | --------------------------------------------------- | --------------------- |
| **ERPNext**        | http://localhost:8081 or http://147.93.153.249:8081 | Administrator / admin |
| **Public Website** | Same URL (public pages)                             | No login required     |

### Next Steps

1. ✅ **Configure System**: Follow [Complete Setup Guide](docs/setup/COMPLETE_SETUP_GUIDE.md)
2. ✅ **Enable Auto Patient Creation**: See [Auto Patient Creation Guide](docs/advanced/AUTO_PATIENT_CREATION_GUIDE.md)
3. ✅ **Add Doctors & Departments**: Use admin portal
4. ✅ **Customize Website**: Edit files in `website-pages/`

---

## 📚 Documentation

**All documentation is organized in the [`docs/`](docs/) folder:**

### 🛠️ Setup & Configuration

| Guide                                                                     | Description                                      | Reading Time |
| ------------------------------------------------------------------------- | ------------------------------------------------ | ------------ |
| [📖 Complete Setup Guide](docs/setup/COMPLETE_SETUP_GUIDE.md)             | **START HERE!** Full step-by-step system setup   | 20 min       |
| [✅ Implementation Checklist](docs/setup/IMPLEMENTATION_CHECKLIST.md)     | Task-by-task checklist with progress tracking    | 5 min        |
| [🔧 Healthcare Persistence Fix](docs/setup/HEALTHCARE_PERSISTENCE_FIX.md) | Fix healthcare module disappearing after restart | 5 min        |

### 👤 Patient Portal & Registration

| Guide                                                                                    | Description                             | Reading Time |
| ---------------------------------------------------------------------------------------- | --------------------------------------- | ------------ |
| [🩺 Patient & Doctor Portal Guide](docs/patient-portal/PATIENT_DOCTOR_PORTAL_GUIDE.md)   | How patients and doctors use the system | 15 min       |
| [📋 Official Patient Portal Guide](docs/patient-portal/OFFICIAL_PATIENT_PORTAL_GUIDE.md) | ERPNext official workflows              | 10 min       |
| [🔐 Patient Signup Guide](docs/patient-portal/PATIENT_SIGNUP_GUIDE.md)                   | Enable patient self-registration        | 10 min       |

### 🚀 Advanced Features

| Guide                                                                              | Description                                       | Reading Time |
| ---------------------------------------------------------------------------------- | ------------------------------------------------- | ------------ |
| [🤖 Auto Patient Creation](docs/advanced/AUTO_PATIENT_CREATION_GUIDE.md)           | **RECOMMENDED!** Automate patient record creation | 15 min       |
| [📝 Self-Signup Implementation](docs/advanced/SELF_SIGNUP_IMPLEMENTATION_GUIDE.md) | Manual patient linking workflow (alternative)     | 20 min       |

### 📖 Reference

| Document                                              | Description                        |
| ----------------------------------------------------- | ---------------------------------- |
| [📚 Complete Reference Guide](docs/COMPLETE_GUIDE.md) | All-in-one comprehensive reference |

### 📌 Recommended Reading Order

For beginners, read in this order:

1. **First**: [Complete Setup Guide](docs/setup/COMPLETE_SETUP_GUIDE.md) - Get system running
2. **Then**: [Auto Patient Creation](docs/advanced/AUTO_PATIENT_CREATION_GUIDE.md) - Enable automation (saves hours!)
3. **Finally**: [Patient & Doctor Portal Guide](docs/patient-portal/PATIENT_DOCTOR_PORTAL_GUIDE.md) - Learn workflows

---

## 🔧 Scripts

All operational scripts are in the [`scripts/`](scripts/) folder:

### Daily Operations

| Script    | Command             | Purpose              |
| --------- | ------------------- | -------------------- |
| **Start** | `scripts\start.bat` | Start all containers |
| **Stop**  | `scripts\stop.bat`  | Stop all containers  |
| **Logs**  | `scripts\logs.bat`  | View system logs     |

### Setup & Maintenance

| Script                 | Command                          | Purpose                             |
| ---------------------- | -------------------------------- | ----------------------------------- |
| **Setup**              | `scripts\setup.bat`              | Initial setup (run once)            |
| **Install Healthcare** | `scripts\install-healthcare.bat` | Install/reinstall healthcare module |
| **Backup**             | `scripts\backup.bat`             | Backup database and files           |
| **Cleanup**            | `scripts\cleanup-all.bat`        | ⚠️ Full cleanup (deletes all data!) |

### Quick Reference

```powershell
# Start system
scripts\start.bat

# Stop system
scripts\stop.bat

# View logs
scripts\logs.bat

# Backup data
scripts\backup.bat
```

---

## 📁 Project Structure

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

## 🎯 Common Tasks

### Add a New Doctor

1. Login as Administrator
2. Go to: `Healthcare → Healthcare Practitioner`
3. Click "+ Add Healthcare Practitioner"
4. Fill details (name, department, photo, consulting charge)
5. Save → Doctor appears on website automatically ✓

### Enable Patient Self-Registration

**Quick Setup (Automated - 10 minutes):**

1. Follow: [Auto Patient Creation Guide](docs/advanced/AUTO_PATIENT_CREATION_GUIDE.md)
2. Enable server scripts in System Settings
3. Create auto-creation script (copy-paste provided code)
4. Test signup → Patients created automatically! ✓

**Manual Setup:**

1. Follow: [Self-Signup Implementation Guide](docs/advanced/SELF_SIGNUP_IMPLEMENTATION_GUIDE.md)
2. Enable signups in Website Settings
3. Admin manually links each patient (2-3 min per patient)

### Customize Website Pages

Location: `website-pages/`

1. Edit files: `home-dynamic.html`, `doctors-dynamic.html`, etc.
2. Use Jinja2 syntax: `{% set doctors = frappe.get_all('Healthcare Practitioner') %}`
3. Changes reflect immediately
4. See: [Complete Setup Guide](docs/setup/COMPLETE_SETUP_GUIDE.md) for examples

### Create Practitioner Schedule

1. Go to: `Healthcare → Practitioner Schedule`
2. Click "+ Add Practitioner Schedule"
3. Select doctor, time slots, days
4. Save → Patients can now book in those slots ✓

---

## ⚙️ Configuration

### Default Credentials

| Service     | Username      | Password |
| ----------- | ------------- | -------- |
| **ERPNext** | Administrator | admin    |
| **MariaDB** | root          | 123      |

⚠️ **Security**: Change admin password in production!

### Ports

| Service           | Port | Access                |
| ----------------- | ---- | --------------------- |
| **Web Interface** | 8081 | http://localhost:8081 |
| **MariaDB**       | 3306 | Internal only         |
| **Redis**         | 6379 | Internal only         |

### Docker Services

| Service          | Purpose                    |
| ---------------- | -------------------------- |
| `backend`        | ERPNext application server |
| `frontend`       | Nginx web server           |
| `db`             | MariaDB database           |
| `redis-cache`    | Caching layer              |
| `redis-queue`    | Job queue                  |
| `redis-socketio` | Real-time communication    |
| `scheduler`      | Background job scheduler   |
| `websocket`      | WebSocket server           |

### Environment Variables

Edit `.env` file to customize:

```env
ERPNEXT_VERSION=v15.0.0
MARIADB_HOST=db
MYSQL_ROOT_PASSWORD=123
SITE_NAME=frontend
```

---

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

```
frappe-healthcare-docker/
│
├── 📄 README.md                    # ← You are here (main entry point)
├── 📄 docker-compose.yml           # Docker services configuration
├── 📄 .env                         # Environment variables
├── 📄 .gitignore                   # Git ignore rules
│
├── 📁 docs/                        # 📚 All Documentation
│   ├── setup/                      # Setup & configuration guides
│   │   ├── COMPLETE_SETUP_GUIDE.md
│   │   ├── IMPLEMENTATION_CHECKLIST.md
│   │   └── HEALTHCARE_PERSISTENCE_FIX.md
│   │
│   ├── patient-portal/             # Patient & doctor portal guides
│   │   ├── PATIENT_DOCTOR_PORTAL_GUIDE.md
│   │   ├── OFFICIAL_PATIENT_PORTAL_GUIDE.md
│   │   └── PATIENT_SIGNUP_GUIDE.md
│   │
│   ├── advanced/                   # Advanced automation guides
│   │   ├── AUTO_PATIENT_CREATION_GUIDE.md      # ⭐ Recommended!
│   │   └── SELF_SIGNUP_IMPLEMENTATION_GUIDE.md
│   │
│   └── COMPLETE_GUIDE.md           # All-in-one reference
│
├── 📁 scripts/                     # 🔧 Operational Scripts
│   ├── setup.bat                   # Initial setup
│   ├── start.bat                   # Start system
│   ├── stop.bat                    # Stop system
│   ├── backup.bat                  # Backup data
│   ├── cleanup-all.bat             # Full cleanup
│   ├── install-healthcare.bat      # Install healthcare module
│   └── logs.bat                    # View logs
│
├── 📁 website-pages/               # 🌐 Dynamic Website Pages
│   ├── home-dynamic.html           # Homepage with live stats
│   ├── doctors-dynamic.html        # Doctor listings from database
│   ├── services-dynamic.html       # Department/services page
│   └── appointment-dynamic.html    # Appointment booking page
│
└── 📁 hospital-management-system/  # 🏥 Custom Frontend (optional)
    ├── api/                        # Backend API server
    ├── css/                        # Stylesheets
    ├── js/                         # JavaScript files
    └── website-pages/              # Static HTML pages
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
