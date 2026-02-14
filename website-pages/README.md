# 🏥 Hospital Website Pages - DYNAMIC VERSION

## Integrated with ERPNext Healthcare Module

**⚠️ IMPORTANT**: Use the `-dynamic.html` files, NOT the old static files!

---

## 📁 Files in This Folder

### ✅ DYNAMIC Files (USE THESE!)

These files fetch data **automatically** from your ERPNext database:

| File                       | Route          | Description                   | What's Dynamic                          |
| -------------------------- | -------------- | ----------------------------- | --------------------------------------- |
| `home-dynamic.html`        | `home`         | Homepage with hero section    | Stats, doctors, departments auto-update |
| `doctors-dynamic.html`     | `our-doctors`  | Doctors listing with photos   | Fetches all Healthcare Practitioners    |
| `services-dynamic.html`    | `our-services` | Departments and facilities    | Fetches all Medical Departments         |
| `appointment-dynamic.html` | `appointment`  | Booking page with login check | Shows user status, dynamic departments  |

### ❌ OLD Static Files (DON'T USE)

These have hardcoded data and won't update:

- `home.html` - Old static version
- `doctors.html` - Hardcoded doctor data
- `services.html` - Hardcoded departments
- `appointment.html` - Static form
- `about.html` - About page (can still use if needed)

---

## 🚀 Quick Start (5 Minutes)

### Step 1: Login to ERPNext

```
URL: http://147.93.153.249:8081/
Username: Administrator
Password: admin
```

### Step 2: Add Your Data First!

Before creating web pages, add this data:

1. **Add Departments**: `/app/medical-department`
   - Add: Cardiology, Neurology, Pediatrics, etc.

2. **Add Doctors**: `/app/healthcare-practitioner`
   - Fill name, department, designation
   - **Upload photo** (important!)
   - Create User account for login
   - Add at least 3-4 doctors

3. **Add Schedules**: `/app/practitioner-schedule`
   - Create schedules for each doctor

### Step 3: Create Web Pages

1. Go to: `/app/web-page`
2. Click **+ Add Web Page**
3. For EACH page:

**Home Page:**

```
Title: Home
Route: home
Content Type: HTML
Published: ☑
Main Section: [Copy content from home-dynamic.html]
```

**Doctors Page:**

```
Title: Our Doctors
Route: our-doctors
Content Type: HTML
Published: ☑
Main Section: [Copy content from doctors-dynamic.html]
```

**Services Page:**

```
Title: Our Services
Route: our-services
Content Type: HTML
Published: ☑
Main Section: [Copy content from services-dynamic.html]
```

**Appointment Page:**

```
Title: Book Appointment
Route: appointment
Content Type: HTML
Published: ☑
Main Section: [Copy content from appointment-dynamic.html]
```

### Step 4: Configure Navigation

1. Go to: `/app/website-settings`
2. Set **Home Page**: `home`
3. In **Top Bar Items**, add:
   - Home → `/home`
   - Our Doctors → `/our-doctors`
   - Services → `/our-services`
   - Book Appointment → `/appointment`
   - Login → `/login` (check "Right")
4. Click **Save**

---

## 🎯 What Makes These Dynamic?

### Before (Static Files)

```html
<!-- Old way - hardcoded -->
<div class="doctor-card">
  <h3>Dr. John Doe</h3>
  <p>Cardiologist</p>
</div>
```

### After (Dynamic Files)

```html
<!-- New way - fetches from database -->
{% set doctors = frappe.get_all('Healthcare Practitioner', fields=['name',
'practitioner_name', 'department', 'image']) %} {% for doc in doctors %}
<div class="doctor-card">
  <img src="{{ doc.image }}" />
  <h3>{{ doc.practitioner_name }}</h3>
  <p>{{ doc.department }}</p>
</div>
{% endfor %}
```

**Result**: When you add a new doctor in ERPNext, they automatically appear on the website!

---

## ✅ What Updates Automatically

| Page            | What's Dynamic                                                                                                                        |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| **Home**        | ✅ Doctor count<br>✅ Patient count<br>✅ Department count<br>✅ Featured doctors with photos<br>✅ Department list                   |
| **Doctors**     | ✅ All Healthcare Practitioners<br>✅ Photos from database<br>✅ Department filter<br>✅ Consulting fees<br>✅ Book appointment links |
| **Services**    | ✅ All Medical Departments<br>✅ Doctor count per department<br>✅ Live statistics<br>✅ Appointment counts                           |
| **Appointment** | ✅ Login status detection<br>✅ User name display<br>✅ Department quick links<br>✅ Redirect to booking system                       |

---

## 🔧 Troubleshooting

### Issue: Pages show "No doctors listed"

**Solution**: Add Healthcare Practitioners at `/app/healthcare-practitioner`

### Issue: Photos not showing

**Solution**: Upload images in Healthcare Practitioner records (Image field)

### Issue: Department filter empty

**Solution**: Add Medical Departments at `/app/medical-department`

### Issue: Can't book appointment

**Solution**:

1. Enable patient registration in Healthcare Settings
2. Create practitioner schedules
3. Link user to patient record

---

## 📖 Full Documentation

For complete setup instructions, see:

- **`COMPLETE_SETUP_GUIDE.md`** - Detailed step-by-step guide
- **`PATIENT_DOCTOR_PORTAL_GUIDE.md`** - User workflow guide
- **`IMPLEMENTATION_CHECKLIST.md`** - Quick checklist

---

## 🎨 Customization

### Change Colors

Find `#0d6efd` in CSS and replace with your brand color:

```css
background: #0d6efd; /* Change to your color */
```

### Add Custom Fields

In Jinja queries, add more fields:

```html
{% set doctors = frappe.get_all('Healthcare Practitioner', fields=['name',
'practitioner_name', 'department', 'image', 'phone', 'email']) %}
```

---

## 🚀 Going Live Checklist

- [ ] Added at least 5 departments
- [ ] Added at least 3 doctors with photos
- [ ] Created schedules for all doctors
- [ ] Created all 4 web pages with dynamic HTML
- [ ] Set home as homepage in Website Settings
- [ ] Configured navigation menu
- [ ] Tested patient registration
- [ ] Tested appointment booking
- [ ] Tested doctor login

---

## 📱 Mobile Responsive

All pages are mobile-friendly and tested on:

- iPhone (Safari)
- Android (Chrome)
- iPad (Safari)
- Desktop (Chrome, Firefox, Edge)

---

**Need Help?** Read the complete guides in the parent folder! 🎉

## Installing Healthcare Module

To enable patient portal and appointment booking features, install the Healthcare module:

```bash
# Start Docker Desktop first, then run:
docker-compose exec backend bash -c "bench get-app https://github.com/frappe/health.git --branch version-15 && bench --site frontend install-app healthcare && bench --site frontend migrate"
```

Or use the batch file:

```bash
install-healthcare.bat
```

## Features

- **Responsive Design**: All pages are mobile-friendly
- **Bengali/English**: Content supports both languages
- **Modern UI**: Clean design matching the original website
- **Doctor Profiles**: 12 doctors with photos and qualifications
- **Appointment Form**: Ready for backend integration
- **Contact Info**: Phone, email, address, and working hours

## Customization

### Change Hospital Logo/Images

Update the `src` attributes in the HTML files with your actual image URLs from ERPNext File Manager.

### Update Contact Information

Edit `home.html` and `appointment.html` to update:

- Phone numbers
- Email address
- Physical address
- Working hours

### Add More Doctors

In `doctors.html`, duplicate a doctor card and update the details.

## Backend Integration

For the appointment form to save data:

1. Create a **Web Form** in ERPNext for appointments
2. Or use JavaScript API calls to `healthcare.api`
3. The form is ready for integration with the Healthcare module

---

Created for Hemayetpur Central Hospital ERPNext deployment.
