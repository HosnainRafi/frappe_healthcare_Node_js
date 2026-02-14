# 📂 Repository Structure

Complete visual structure of the Frappe Healthcare Docker project.

---

## 🌳 Directory Tree

```
frappe-healthcare-docker/
│
├── 📄 README.md                       # Main entry point - start here!
├── 📄 docker-compose.yml              # Docker configuration
├── 📄 .env                            # Environment variables
├── 📄 .gitignore                      # Git ignore rules
│
├── 📁 docs/                           # 📚 ALL DOCUMENTATION
│   │
│   ├── 📄 README.md                   # Documentation index & navigation
│   ├── 📄 COMPLETE_GUIDE.md           # All-in-one reference guide
│   │
│   ├── 📁 setup/                      # 🛠️ Setup & Configuration
│   │   ├── COMPLETE_SETUP_GUIDE.md       # ⭐ Start here! Full setup
│   │   ├── IMPLEMENTATION_CHECKLIST.md   # Track your progress
│   │   └── HEALTHCARE_PERSISTENCE_FIX.md # Fix module issues
│   │
│   ├── 📁 patient-portal/             # 👤 User Portals
│   │   ├── PATIENT_DOCTOR_PORTAL_GUIDE.md    # End-user training
│   │   ├── OFFICIAL_PATIENT_PORTAL_GUIDE.md  # ERPNext official workflow
│   │   └── PATIENT_SIGNUP_GUIDE.md           # Enable registration
│   │
│   └── 📁 advanced/                   # 🚀 Advanced Features
│       ├── AUTO_PATIENT_CREATION_GUIDE.md        # ⭐ Automate everything!
│       └── SELF_SIGNUP_IMPLEMENTATION_GUIDE.md   # Manual workflow
│
├── 📁 scripts/                        # 🔧 OPERATIONAL SCRIPTS
│   ├── setup.bat                      # Initial setup
│   ├── start.bat                      # Start system
│   ├── stop.bat                       # Stop system
│   ├── backup.bat                     # Backup data
│   ├── cleanup-all.bat                # Full cleanup (⚠️ deletes data!)
│   ├── install-healthcare.bat         # Install healthcare module
│   └── logs.bat                       # View system logs
│
├── 📁 website-pages/                  # 🌐 DYNAMIC WEBSITE
│   ├── home-dynamic.html              # Homepage with live statistics
│   ├── doctors-dynamic.html           # Doctors from database
│   ├── services-dynamic.html          # Departments/services
│   └── appointment-dynamic.html       # Appointment booking
│
└── 📁 hospital-management-system/     # 🏥 CUSTOM FRONTEND (Optional)
    ├── api/                           # Backend API
    ├── css/                           # Stylesheets
    ├── js/                            # JavaScript
    └── website-pages/                 # Static HTML pages
```

---

## 📑 File Count Overview

| Category          | Count     | Description                             |
| ----------------- | --------- | --------------------------------------- |
| **Documentation** | 8 files   | All guides in `docs/` folder            |
| **Scripts**       | 7 files   | All `.bat` scripts in `scripts/` folder |
| **Website Pages** | 4 files   | Dynamic HTML in `website-pages/`        |
| **Configuration** | 3 files   | Root config files                       |
| **Total**         | 22+ files | Organized & clean!                      |

---

## 🎯 Quick Navigation

### By Goal

| I want to...           | Go to...                                                                                                    |
| ---------------------- | ----------------------------------------------------------------------------------------------------------- |
| **Get started**        | [README.md](../README.md)                                                                                   |
| **Read documentation** | [docs/README.md](../docs/README.md)                                                                         |
| **Setup system**       | [docs/setup/COMPLETE_SETUP_GUIDE.md](../docs/setup/COMPLETE_SETUP_GUIDE.md)                                 |
| **Automate patients**  | [docs/advanced/AUTO_PATIENT_CREATION_GUIDE.md](../docs/advanced/AUTO_PATIENT_CREATION_GUIDE.md)             |
| **Train users**        | [docs/patient-portal/PATIENT_DOCTOR_PORTAL_GUIDE.md](../docs/patient-portal/PATIENT_DOCTOR_PORTAL_GUIDE.md) |
| **Run scripts**        | `scripts\` folder                                                                                           |
| **Edit website**       | `website-pages\` folder                                                                                     |

### By Role

| Role                  | Start Here                                                                                                                |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| **New Administrator** | [README.md](../README.md) → [docs/setup/](../docs/setup/)                                                                 |
| **IT Staff**          | [docs/setup/HEALTHCARE_PERSISTENCE_FIX.md](../docs/setup/HEALTHCARE_PERSISTENCE_FIX.md)                                   |
| **Hospital Manager**  | [docs/README.md](../docs/README.md) → [docs/setup/IMPLEMENTATION_CHECKLIST.md](../docs/setup/IMPLEMENTATION_CHECKLIST.md) |
| **Receptionist**      | [docs/patient-portal/](../docs/patient-portal/)                                                                           |
| **Developer**         | `website-pages/` + `hospital-management-system/`                                                                          |

---

## 📊 Documentation Organization

### docs/setup/ - Setup & Configuration (3 files)

```
setup/
├── COMPLETE_SETUP_GUIDE.md      (500+ lines) ⭐ Start here!
├── IMPLEMENTATION_CHECKLIST.md  (150+ lines) Track progress
└── HEALTHCARE_PERSISTENCE_FIX.md (200+ lines) Fix issues
```

**Total: ~850 lines**

### docs/patient-portal/ - User Portals (3 files)

```
patient-portal/
├── PATIENT_DOCTOR_PORTAL_GUIDE.md    (400+ lines) User training
├── OFFICIAL_PATIENT_PORTAL_GUIDE.md  (400+ lines) ERPNext official
└── PATIENT_SIGNUP_GUIDE.md           (300+ lines) Enable signup
```

**Total: ~1,100 lines**

### docs/advanced/ - Advanced Features (2 files)

```
advanced/
├── AUTO_PATIENT_CREATION_GUIDE.md        (600+ lines) ⭐ Recommended!
└── SELF_SIGNUP_IMPLEMENTATION_GUIDE.md   (700+ lines) Manual workflow
```

**Total: ~1,300 lines**

### Total Documentation

**~3,250+ lines of comprehensive guides!**

---

## 🔧 Scripts Organization

### Daily Operations (3 scripts)

```
scripts/
├── start.bat     # Start containers
├── stop.bat      # Stop containers
└── logs.bat      # View logs
```

### Setup & Maintenance (4 scripts)

```
scripts/
├── setup.bat                # Initial setup
├── install-healthcare.bat   # Install module
├── backup.bat               # Backup data
└── cleanup-all.bat          # Full cleanup
```

---

## 🌐 Website Pages

### Dynamic Pages (4 files)

```
website-pages/
├── home-dynamic.html         # Live stats, featured doctors
├── doctors-dynamic.html      # All doctors from DB
├── services-dynamic.html     # Departments with counts
└── appointment-dynamic.html  # Smart booking with login detection
```

**Technology:**

- Jinja2 server-side templating
- `frappe.get_all()` for database queries
- Real-time statistics
- Responsive design

---

## 📦 Root Files

| File                 | Purpose          | Edit?                     |
| -------------------- | ---------------- | ------------------------- |
| `README.md`          | Main entry point | ✅ Yes (add info)         |
| `docker-compose.yml` | Docker config    | ⚠️ Careful (breaks setup) |
| `.env`               | Environment vars | ✅ Yes (credentials)      |
| `.gitignore`         | Git rules        | ✅ Yes (ignore files)     |

---

## 🚀 Benefits of This Structure

### ✅ Clean & Organized

- No clutter in root directory
- Clear separation of concerns
- Easy to find what you need

### ✅ Beginner-Friendly

- Clear entry point (README.md)
- Categorized documentation
- Progressive complexity

### ✅ Maintainable

- Easy to add new guides
- Clear folder purposes
- Scalable structure

### ✅ Professional

- Industry-standard layout
- Well-documented
- Easy to share/fork

---

## 📝 File Naming Conventions

### Documentation

- **ALL_CAPS_WITH_UNDERSCORES.md** - Main guides
- **README.md** - Index/navigation files
- Descriptive names indicating content

### Scripts

- **lowercase-with-hyphens.bat** - Operational scripts
- Action-verb names (start, stop, backup)
- Clear purpose from name

### Code

- **lowercase-with-hyphens.html** - Website pages
- Suffix indicates dynamic vs static
- Grouped by function

---

## 🔄 Before vs After

### Before (Messy) ❌

```
frappe-healthcare-docker/
├── README.md
├── docker-compose.yml
├── COMPLETE_GUIDE.md
├── COMPLETE_SETUP_GUIDE.md
├── PATIENT_DOCTOR_PORTAL_GUIDE.md
├── OFFICIAL_PATIENT_PORTAL_GUIDE.md
├── PATIENT_SIGNUP_GUIDE.md
├── AUTO_PATIENT_CREATION_GUIDE.md
├── SELF_SIGNUP_IMPLEMENTATION_GUIDE.md
├── HEALTHCARE_PERSISTENCE_FIX.md
├── IMPLEMENTATION_CHECKLIST.md
├── setup.bat
├── start.bat
├── stop.bat
├── backup.bat
├── cleanup-all.bat
├── install-healthcare.bat
├── logs.bat
└── website-pages/
```

**Issues:**

- 16+ files in root directory
- Hard to find specific guides
- No clear navigation
- Overwhelming for beginners

### After (Clean) ✅

```
frappe-healthcare-docker/
├── README.md                # Entry point
├── docker-compose.yml       # Config
├── docs/                    # 📚 All documentation
│   ├── setup/
│   ├── patient-portal/
│   └── advanced/
├── scripts/                 # 🔧 All scripts
└── website-pages/           # 🌐 Website
```

**Benefits:**

- Only 4 items in root
- Clear organization by purpose
- Easy navigation
- Professional structure

---

## 💡 How to Use This Structure

### For Beginners

1. Start: [README.md](../README.md)
2. Setup: [docs/setup/COMPLETE_SETUP_GUIDE.md](../docs/setup/COMPLETE_SETUP_GUIDE.md)
3. Automate: [docs/advanced/AUTO_PATIENT_CREATION_GUIDE.md](../docs/advanced/AUTO_PATIENT_CREATION_GUIDE.md)

### For Daily Operations

- Start system: `scripts\start.bat`
- Stop system: `scripts\stop.bat`
- View logs: `scripts\logs.bat`
- Backup: `scripts\backup.bat`

### For Documentation

- Browse: [docs/README.md](../docs/README.md)
- Search: Use Ctrl+F in relevant category
- Reference: [docs/COMPLETE_GUIDE.md](../docs/COMPLETE_GUIDE.md)

### For Development

- Website pages: Edit `website-pages/*.html`
- Custom frontend: Edit `hospital-management-system/`
- Scripts: Add to `scripts/`

---

## 🎓 Learning the Structure

**5-Minute Quick Tour:**

1. Root: Configuration files only
2. `docs/`: All documentation, organized by topic
3. `scripts/`: All operational scripts
4. `website-pages/`: Dynamic website pages

That's it! Simple and logical.

---

## 📞 Need Help?

- **Can't find a file?** Check this structure guide
- **Need documentation?** Go to `docs/README.md`
- **Looking for scripts?** Check `scripts/` folder
- **Want to customize?** Edit `website-pages/`

---

<p align="center">
  <b>🎉 Repository is now fully organized!</b><br>
  <sub>Clean, professional, and easy to navigate</sub>
</p>

<p align="center">
  <a href="../README.md">📖 Main README</a> •
  <a href="../docs/README.md">📚 Documentation Index</a> •
  <a href="../scripts">🔧 Scripts</a>
</p>
