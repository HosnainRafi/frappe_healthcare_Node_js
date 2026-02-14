# 📚 Documentation Index

Complete documentation for Frappe Healthcare Docker setup.

**🌐 Live System:** http://147.93.153.249:8081

---

## 📂 Documentation Structure

All guides are organized by category for easy navigation:

```
docs/
├── setup/                  # Initial setup & configuration
├── patient-portal/         # Patient & doctor portal guides
├── advanced/               # Advanced automation features
└── COMPLETE_GUIDE.md       # All-in-one reference
```

---

## 🛠️ Setup & Configuration

**Start here if you're setting up for the first time!**

### [📖 Complete Setup Guide](setup/COMPLETE_SETUP_GUIDE.md)

**⭐ START HERE!** - Comprehensive step-by-step setup guide (500+ lines)

**What's included:**

- ERPNext configuration
- Healthcare module installation & persistence
- Data entry (departments, doctors, schedules)
- Dynamic website page creation
- Navigation setup
- Patient & doctor portal configuration
- Troubleshooting

**Time:** 30-45 minutes  
**Difficulty:** Beginner-friendly

---

### [✅ Implementation Checklist](setup/IMPLEMENTATION_CHECKLIST.md)

Task-by-task checklist to track your setup progress

**What's included:**

- Pre-launch checklist
- Setup tasks with checkboxes
- Configuration verification steps
- Launch preparation

**Time:** 5 minutes (reference)  
**Difficulty:** All levels

---

### [🔧 Healthcare Persistence Fix](setup/HEALTHCARE_PERSISTENCE_FIX.md)

Fix healthcare module disappearing after container restart

**What's included:**

- Why the module disappears
- Permanent fix steps
- Verification methods
- Prevention tips

**Time:** 10 minutes  
**Difficulty:** Intermediate

---

## 👤 Patient Portal & Registration

**Learn how patients and doctors use the system**

### [🩺 Patient & Doctor Portal Guide](patient-portal/PATIENT_DOCTOR_PORTAL_GUIDE.md)

Complete guide for end-users (patients and doctors)

**What's included:**

- **Patient Portal:**
  - How to register
  - Booking appointments
  - Viewing medical records
  - Accessing prescriptions
  - Billing information
- **Doctor Portal:**
  - Managing appointments
  - Patient encounters
  - Creating prescriptions
  - Viewing schedules
  - Dashboard customization

**Time:** 15 minutes  
**Difficulty:** Beginner (end-user guide)

---

### [📋 Official Patient Portal Guide](patient-portal/OFFICIAL_PATIENT_PORTAL_GUIDE.md)

ERPNext's official patient management workflows

**What's included:**

- Official ERPNext Healthcare workflow
- Admin-first patient creation model
- Portal features and permissions
- Configuration checklist
- Comparison: Official vs Self-Signup methods

**Time:** 10 minutes  
**Difficulty:** Intermediate

---

### [🔐 Patient Signup Guide](patient-portal/PATIENT_SIGNUP_GUIDE.md)

Enable and configure patient self-registration

**What's included:**

- Enabling "Allow Sign Ups" in Website Settings
- Manual patient linking workflow
- Troubleshooting signup issues
- User permissions setup

**Time:** 10 minutes  
**Difficulty:** Intermediate

---

## 🚀 Advanced Features

**Automation and advanced configurations**

### [🤖 Auto Patient Creation Guide](advanced/AUTO_PATIENT_CREATION_GUIDE.md)

**⭐ HIGHLY RECOMMENDED!** - Automate patient record creation

**What's included:**

- Enable Server Scripts in System Settings
- Auto-create Patient when User signs up (copy-paste code)
- Enhanced scripts with validation
- Web Form for custom signup fields
- Troubleshooting automation issues

**Benefits:**

- ✅ Zero manual admin work
- ✅ Patients can book immediately after signup
- ✅ No forgetting to link users
- ✅ Scales to unlimited signups

**Saves:** 2-3 minutes per patient (forever!)

**Time:** 10-15 minutes setup  
**Difficulty:** Beginner (use basic script) / Intermediate (customize)

---

### [📝 Self-Signup Implementation Guide](advanced/SELF_SIGNUP_IMPLEMENTATION_GUIDE.md)

Manual patient linking workflow (alternative to automation)

**What's included:**

- Step-by-step public signup enablement
- Daily admin workflow for linking patients
- Troubleshooting guide
- Staff training templates

**Use when:**

- You want full control over patient approval
- Lower patient volume (< 10/day)
- Testing before automating

**Time:** 20 minutes setup + 2-3 min per patient  
**Difficulty:** Beginner

---

## 📖 Reference

### [📚 Complete Reference Guide](COMPLETE_GUIDE.md)

All-in-one comprehensive guide with everything in one place

**What's included:**

- Everything from all other guides combined
- Quick lookup reference
- Complete command reference

**Time:** 60+ minutes (full read)  
**Difficulty:** All levels

---

## 🎯 Recommended Reading Path

### For First-Time Setup

```
1. Complete Setup Guide (setup/)
   ↓
2. Implementation Checklist (setup/)
   ↓
3. Auto Patient Creation (advanced/) ⭐ Recommended!
   ↓
4. Patient & Doctor Portal Guide (patient-portal/)
   ↓
5. Start using the system! ✅
```

### For Patient Registration Issues

```
1. Patient Signup Guide (patient-portal/)
   ↓
2. Auto Patient Creation (advanced/) ⭐ Better solution!
   ↓
3. Official Patient Portal Guide (patient-portal/) - Understand official method
```

### For Module Persistence Issues

```
1. Healthcare Persistence Fix (setup/)
   ↓
2. Verify installation
   ↓
3. Test restart: docker-compose restart
```

---

## 📋 Quick Reference

### By Use Case

| I want to...                             | Read this guide                                                                  |
| ---------------------------------------- | -------------------------------------------------------------------------------- |
| **Set up system from scratch**           | [Complete Setup Guide](setup/COMPLETE_SETUP_GUIDE.md)                            |
| **Enable patient self-registration**     | [Auto Patient Creation](advanced/AUTO_PATIENT_CREATION_GUIDE.md) ⭐              |
| **Train patients/doctors**               | [Patient & Doctor Portal Guide](patient-portal/PATIENT_DOCTOR_PORTAL_GUIDE.md)   |
| **Fix healthcare module disappearing**   | [Healthcare Persistence Fix](setup/HEALTHCARE_PERSISTENCE_FIX.md)                |
| **Understand official ERPNext workflow** | [Official Patient Portal Guide](patient-portal/OFFICIAL_PATIENT_PORTAL_GUIDE.md) |
| **Manual patient linking**               | [Self-Signup Implementation](advanced/SELF_SIGNUP_IMPLEMENTATION_GUIDE.md)       |
| **Track setup progress**                 | [Implementation Checklist](setup/IMPLEMENTATION_CHECKLIST.md)                    |

### By Role

| Role                             | Start Here                                                                     |
| -------------------------------- | ------------------------------------------------------------------------------ |
| **System Administrator**         | [Complete Setup Guide](setup/COMPLETE_SETUP_GUIDE.md)                          |
| **Hospital Manager**             | [Implementation Checklist](setup/IMPLEMENTATION_CHECKLIST.md)                  |
| **IT Staff**                     | [Healthcare Persistence Fix](setup/HEALTHCARE_PERSISTENCE_FIX.md)              |
| **Receptionist**                 | [Self-Signup Implementation](advanced/SELF_SIGNUP_IMPLEMENTATION_GUIDE.md)     |
| **End Users (Patients/Doctors)** | [Patient & Doctor Portal Guide](patient-portal/PATIENT_DOCTOR_PORTAL_GUIDE.md) |

### By Difficulty Level

| Level            | Guides                                                                        |
| ---------------- | ----------------------------------------------------------------------------- |
| **Beginner**     | Complete Setup, Patient Portal, Auto Patient Creation (basic script)          |
| **Intermediate** | Self-Signup Implementation, Healthcare Persistence Fix, Official Portal Guide |
| **Advanced**     | Auto Patient Creation (enhanced script), Custom Web Forms                     |

---

## 📊 Guide Statistics

| Guide                      | Lines | Reading Time | Difficulty   | Priority           |
| -------------------------- | ----- | ------------ | ------------ | ------------------ |
| Complete Setup Guide       | 500+  | 20 min       | Beginner     | ⭐⭐⭐ Must Read   |
| Auto Patient Creation      | 600+  | 15 min       | Beginner     | ⭐⭐⭐ Recommended |
| Patient Portal Guide       | 400+  | 15 min       | Beginner     | ⭐⭐ Important     |
| Self-Signup Implementation | 700+  | 20 min       | Beginner     | ⭐⭐ Alternative   |
| Healthcare Persistence Fix | 200+  | 10 min       | Intermediate | ⭐ As Needed       |
| Official Portal Guide      | 400+  | 10 min       | Intermediate | ⭐ Reference       |
| Implementation Checklist   | 150+  | 5 min        | All Levels   | ⭐⭐ Tracking      |

---

## 🔗 External Resources

### Official Documentation

- [ERPNext User Manual](https://docs.erpnext.com/)
- [Frappe Framework Docs](https://frappeframework.com/docs)
- [Marley Healthcare Docs](https://marleyhealth.io/docs)
- [Frappe School - Healthcare Course](https://school.frappe.io/lms/courses/healthcare-management)

### Community

- [ERPNext Forum](https://discuss.erpnext.com/)
- [Frappe GitHub](https://github.com/frappe/frappe)
- [Healthcare GitHub](https://github.com/earthians/marley)

---

## 💡 Tips for Reading

### Color Coding

- ⭐⭐⭐ - Must read for all users
- ⭐⭐ - Recommended for most users
- ⭐ - Situational/reference only

### Symbols

- 🛠️ - Configuration required
- 👤 - User-facing features
- 🚀 - Advanced/optional
- 🔧 - Troubleshooting
- ✅ - Checklist/tasks

### Time Estimates

- Setup guides: 10-30 minutes (one-time)
- User guides: 10-15 minutes (training)
- Reference guides: Variable (lookup as needed)

---

## 🆘 Getting Help

If you don't find what you need:

1. **Search all guides**: Use Ctrl+F in each guide
2. **Check troubleshooting sections**: Most guides have dedicated troubleshooting
3. **Review Complete Guide**: [COMPLETE_GUIDE.md](COMPLETE_GUIDE.md) has everything
4. **Check main README**: [../README.md](../README.md) has quick answers
5. **Visit ERPNext Forum**: https://discuss.erpnext.com/

---

## 🎓 Learning Path

### Week 1: Setup & Configuration

- Day 1-2: Complete Setup Guide + Implementation Checklist
- Day 3: Healthcare Persistence Fix (if needed)
- Day 4: Auto Patient Creation ⭐
- Day 5: Test and verify everything works

### Week 2: User Training

- Day 1-2: Patient Portal Guide (train reception staff)
- Day 3-4: Doctor Portal Guide (train medical staff)
- Day 5: Handle questions and adjustments

### Week 3: Go Live

- Day 1: Final testing
- Day 2-3: Soft launch (limited users)
- Day 4-5: Full launch + monitoring

---

## 📝 Documentation Maintenance

These guides are regularly updated. Last major update: February 2026.

**Changelog:**

- Feb 2026: Reorganized all documentation into topic folders
- Feb 2026: Added Auto Patient Creation Guide
- Feb 2026: Added Official Patient Portal Guide based on Marley Health docs
- Feb 2026: Comprehensive Healthcare Persistence Fix guide

---

<p align="center">
  <b>📚 Happy Learning!</b><br>
  <sub>If these guides helped you, please ⭐ star the repository!</sub>
</p>

<p align="center">
  <a href="setup/COMPLETE_SETUP_GUIDE.md">📖 Start Setup</a> •
  <a href="advanced/AUTO_PATIENT_CREATION_GUIDE.md">🤖 Enable Automation</a> •
  <a href="patient-portal/PATIENT_DOCTOR_PORTAL_GUIDE.md">👥 User Training</a>
</p>
