# 🏥 Complete Hospital Management System Setup Guide

## ERPNext + Frappe Healthcare Implementation

**Last Updated:** February 14, 2026  
**Your Website:** http://147.93.153.249:8081/

---

## 🎯 What You're Building

A complete hospital website with:

- ✅ Public pages (Home, Doctors, Services, Contact)
- ✅ Patient registration, login, and appointment booking
- ✅ Patient portal (view appointments, medical records)
- ✅ Doctor portal (view appointments, patient records)
- ✅ **100% Dynamic** - updates automatically when you add doctors/departments

---

## 📋 PART 1: Initial ERPNext Configuration

### Step 1: Enable Healthcare Module

1. Login to ERPNext: `http://147.93.153.249:8081/`
   - Username: `Administrator`
   - Password: `admin`

2. Go to **Healthcare Settings**:
   - Search "Healthcare Settings" in the search bar (top)
   - OR go to: `http://147.93.153.249:8081/app/healthcare-settings`

3. Enable these options:
   ```
   ☑ Enable Healthcare
   ☑ Patient Master Created
   ☑ Manage Customer and Patient Relations
   ☑ Link Customer to Patient
   ☑ Default Medical Code Standard: ICD-10
   ```
4. Click **Save**

### Step 2: Enable Patient Registration

1. Still in **Healthcare Settings**, scroll down to **Patient Portal**:

   ```
   ☑ Allow Patient Registration
   ☑ Enable Patient Portal
   ```

2. Go to **Website Settings**:
   - Search "Website Settings"
   - OR: `http://147.93.153.249:8081/app/website-settings`

3. Enable Sign Ups:

   ```
   ☑ Allow Sign Ups
   Sign Up Role: Website User (default)
   ```

4. Click **Save**

---

## 📋 PART 2: Add Your Hospital Data

### Step 1: Add Medical Departments

1. Search for **Medical Department** or go to:
   `http://147.93.153.249:8081/app/medical-department`

2. Click **+ Add Medical Department**

3. Add these departments (one by one):
   - **Department:** Cardiology
   - **Department:** Neurology
   - **Department:** Pediatrics
   - **Department:** Orthopedics
   - **Department:** Gynecology
   - **Department:** ENT
   - **Department:** Urology
   - **Department:** Dermatology

4. Click **Save** for each

### Step 2: Add Healthcare Practitioners (Doctors)

1. Go to **Healthcare Practitioner**:
   `http://147.93.153.249:8081/app/healthcare-practitioner`

2. Click **+ Add Healthcare Practitioner**

3. Fill in the form:

   ```
   First Name: John
   Last Name: Doe
   Practitioner Name: Dr. John Doe (auto-fills)
   Gender: Male
   Department: Cardiology
   Designation: Senior Cardiologist
   Op Consulting Charge: 500
   Description: Senior Cardiologist with 15 years of experience...
   ```

4. **IMPORTANT - Add Profile Photo**:
   - Scroll to **Image** field
   - Click **Attach**
   - Upload doctor's photo (JPG/PNG)
   - This photo will appear on your website automatically!

5. **IMPORTANT - Create User Account** (for doctor login):
   - Scroll to **User** field
   - Click **Create a new User**
   - Email: `doctor@example.com`
   - First Name: John
   - Last Name: Doe
   - Send Welcome Email: ☑ (optional)
   - Roles: Check these:
     ```
     ☑ Healthcare Practitioner
     ☑ Physician
     ```
   - Click **Save**

6. Click **Save** on Healthcare Practitioner form

7. Repeat for all your doctors

### Step 3: Create Practitioner Schedules

1. Go to **Practitioner Schedule**:
   `http://147.93.153.249:8081/app/practitioner-schedule`

2. Click **+ Add Practitioner Schedule**

3. Fill in:

   ```
   Practitioner: Dr. John Doe
   Schedule Name: Morning Shift
   ```

4. In **Time Slots** table, click **Add Row**:

   ```
   Day: Monday
   From Time: 09:00:00
   To Time: 13:00:00
   ```

5. Add more rows for each day of the week

6. Click **Save**

---

## 📋 PART 3: Create Dynamic Website Pages

Now we create the public website pages that **automatically fetch data** from your ERPNext database.

### Page 1: Home Page (Dynamic)

1. Go to **Web Page**: `http://147.93.153.249:8081/app/web-page`

2. Click **+ Add Web Page**

3. Settings:

   ```
   Title: Home
   Route: home
   Content Type: HTML
   Published: ☑
   ```

4. In **Main Section**, paste the HTML from the file:
   `website-pages/home-dynamic.html` (I'll create this for you)

5. Click **Save**

### Page 2: Our Doctors (Dynamic)

1. New Web Page:

   ```
   Title: Our Doctors
   Route: our-doctors
   Content Type: HTML
   Published: ☑
   ```

2. Paste content from: `website-pages/doctors-dynamic.html`

3. Click **Save**

### Page 3: Our Services (Dynamic)

1. New Web Page:

   ```
   Title: Our Services
   Route: our-services
   Content Type: HTML
   Published: ☑
   ```

2. Paste content from: `website-pages/services-dynamic.html`

3. Click **Save**

### Page 4: Book Appointment

1. New Web Page:

   ```
   Title: Book Appointment
   Route: appointment
   Content Type: HTML
   Published: ☑
   ```

2. Paste content from: `website-pages/appointment-dynamic.html`

3. Click **Save**

---

## 📋 PART 4: Configure Navigation Menu

1. Go to **Website Settings**

2. Set **Home Page**: `home`

3. Scroll to **Top Bar Items**

4. Delete existing items (click X on each row)

5. Add these rows:

   | Label            | URL           | Parent Label | Right |
   | ---------------- | ------------- | ------------ | ----- |
   | Home             | /home         |              |       |
   | Our Doctors      | /our-doctors  |              |       |
   | Departments      | /our-services |              |       |
   | Book Appointment | /appointment  |              |       |
   | Contact          | /contact      |              |       |
   | Login            | /login        |              | ☑     |

6. Click **Save**

---

## 📋 PART 5: Patient Registration & Login Flow

### How Patients Register

1. **Patient visits your website**: `http://147.93.153.249:8081/home`

2. **Clicks "Book Appointment"** or **"Login"**

3. **On login page**, clicks **"Don't have an account? Sign Up"**

4. **Fills registration form**:

   ```
   Full Name: John Smith
   Email: patient@example.com
   Password: ••••••••
   ```

5. **Clicks Sign Up** → Account created!

6. **BUT**: User is created, but **not yet a Patient** in the system

### How to Link User to Patient

**Option A: Patient Self-Service (Automatic)**

After login, patient should see a prompt:

- "Complete your patient registration"
- Redirects to patient registration form
- Patient fills: Name, DOB, Gender, Phone, Address
- Submits → Patient record created automatically

**Option B: Admin Creates Patient (Manual)**

If automatic doesn't work:

1. Admin goes to: `http://147.93.153.249:8081/app/patient`
2. Click **+ Add Patient**
3. Fill form:
   ```
   First Name: John
   Last Name: Smith
   Gender: Male
   DOB: 1990-01-01
   Mobile: +880XXXXXXXXXX
   Email: patient@example.com
   User: patient@example.com (link to existing user)
   ```
4. Click **Save**

Now the user `patient@example.com` is linked to a Patient record!

### Why Registration Doesn't Auto-Login?

ERPNext creates the account but doesn't auto-login for security. Patient must:

1. Go back to `/login`
2. Enter email and password
3. Click Login

---

## 📋 PART 6: Patient Portal - What Patients Can Do

### Patient Login Flow

1. Patient goes to: `http://147.93.153.249:8081/login`
2. Enters credentials
3. Clicks Login
4. Redirected to their dashboard

### Patient Portal Pages

After login, patients can access:

| Page                     | URL                            | What They See                            |
| ------------------------ | ------------------------------ | ---------------------------------------- |
| **My Appointments**      | `/app/patient-appointment`     | All their appointments (past & upcoming) |
| **Book New Appointment** | `/app/patient-appointment/new` | Form to book with a doctor               |
| **My Medical Records**   | `/app/patient-medical-record`  | Lab results, diagnoses, etc.             |
| **My Prescriptions**     | `/app/patient-encounter`       | All prescriptions from doctors           |
| **My Profile**           | `/app/patient/[patient-name]`  | View/edit personal info                  |
| **My Bills**             | `/app/sales-invoice`           | View medical bills                       |

### How Patient Books an Appointment

1. Go to: `/app/patient-appointment/new`
2. Form shows:
   ```
   Patient: [Auto-filled with their name]
   Practitioner: [Dropdown - select doctor]
   Department: [Auto-filled based on doctor]
   Appointment Date: [Calendar picker]
   Appointment Time: [Time slot picker - shows available slots]
   Appointment Type: [Clinical, Wellness, etc.]
   ```
3. Click **Save**
4. Appointment created! Doctor will see it in their dashboard

---

## 📋 PART 7: Doctor Portal - What Doctors Can Do

### Doctor Login Problem - SOLUTION

**Issue:** You created a practitioner with an email but can't login.

**Why:** The email in the practitioner form is just contact info. You need to create a **User** account separately.

**Solution:**

1. Go to the Healthcare Practitioner you created
2. Scroll to **User** field
3. If empty:
   - Click **Create a new User**
   - Email: `doctor@example.com`
   - First Name: [Doctor's name]
   - Roles:
     ```
     ☑ Healthcare Practitioner
     ☑ Physician
     ```
   - Click **Save**

4. Go back to practitioner and link the user

5. Now the doctor can login with `doctor@example.com`

### Doctor Portal Pages

After login, doctors see the **ERPNext Desk** (not a separate portal):

| Page                   | URL                          | What They See                     |
| ---------------------- | ---------------------------- | --------------------------------- |
| **My Appointments**    | `/app/patient-appointment`   | All appointments assigned to them |
| **Patient List**       | `/app/patient`               | All patients in the system        |
| **Start Consultation** | `/app/patient-encounter/new` | Create new consultation record    |
| **My Patients**        | `/app/patient` (filtered)    | Patients they've treated          |
| **Lab Orders**         | `/app/lab-test`              | Order/view lab tests              |
| **Prescriptions**      | `/app/patient-encounter`     | Write prescriptions               |

### How Doctor Sees Their Appointments

1. Doctor logs in
2. Goes to: `/app/patient-appointment`
3. By default, shows ALL appointments
4. To see only THEIR appointments:
   - Click **Filter** button
   - Add filter: `Practitioner = Dr. John Doe`
   - Click **Apply**

**Better: Create a Custom Workspace**

1. Search for **Workspace**
2. Create **Doctor Dashboard**
3. Add shortcuts:
   - My Appointments (with pre-applied filter)
   - My Patients
   - New Consultation
   - Lab Orders

### How Doctor Handles an Appointment

1. Doctor sees appointment in list
2. Clicks appointment
3. Appointment details open
4. Clicks **Create > Patient Encounter**
5. Patient Encounter form opens (consultation record)
6. Doctor fills:
   ```
   Patient: [Auto-filled]
   Practitioner: [Auto-filled]
   Encounter Date: [Today]
   Symptoms: [Patient complaints]
   Diagnosis: [Doctor's diagnosis]
   Drug Prescription: [Add rows with medicines]
   Lab Tests: [Order tests if needed]
   ```
7. Clicks **Save**
8. Patient can now view this in their portal!

---

## 📋 PART 8: Make Everything Dynamic

### How Dynamic Pages Work

Your HTML pages use **Jinja2** templating:

```html
<!-- This fetches ALL doctors from database -->
{% set doctors = frappe.get_all('Healthcare Practitioner', fields=['name',
'practitioner_name', 'department', 'image'], filters={'status': 'Active'}) %}

<!-- This loops through each doctor -->
{% for doc in doctors %}
<div class="doctor-card">
  <img src="{{ doc.image }}" />
  <h3>{{ doc.practitioner_name }}</h3>
  <p>{{ doc.department }}</p>
</div>
{% endfor %}
```

### What Happens When You Add a New Doctor?

1. You add a new Healthcare Practitioner in ERPNext
2. You upload their photo
3. You save the record
4. **Instantly**, the doctor appears on your website!
5. No need to edit any HTML files

### What Happens When You Add a New Department?

1. You add a Medical Department in ERPNext
2. The department appears on "Our Services" page automatically
3. When you assign a doctor to this department, they're grouped accordingly

---

## 📋 PART 9: Testing Your Setup

### Test 1: Check Public Website

1. Open incognito browser
2. Go to: `http://147.93.153.249:8081/home`
3. You should see:
   - Your doctors with photos
   - Your departments
   - Navigation menu

### Test 2: Test Patient Registration

1. Click **Login** → **Sign Up**
2. Create account: `testpatient@test.com`
3. After signup, login with same credentials
4. Go to: `/app/patient-appointment/new`
5. Try booking an appointment

### Test 3: Test Doctor Login

1. Logout
2. Login with doctor's email
3. Go to: `/app/patient-appointment`
4. You should see the test appointment you just created

---

## 🛠️ Troubleshooting Common Issues

### Issue 1: "Doctors page is empty"

**Cause:** No Healthcare Practitioners added, or they're not Active

**Solution:**

1. Go to: `/app/healthcare-practitioner`
2. Check if you have added doctors
3. Open each doctor → Check **Status** = Active
4. Make sure **Image** field has a photo

### Issue 2: "Can't login with doctor's email"

**Cause:** No User account linked to the practitioner

**Solution:**

1. Go to the Healthcare Practitioner
2. Scroll to **User** field
3. Create new user or link existing
4. Make sure roles include: `Healthcare Practitioner` and `Physician`

### Issue 3: "After signup, can't book appointment"

**Cause:** User exists but not linked to Patient record

**Solution:**

1. As Administrator, go to: `/app/patient`
2. Create new Patient
3. Link **User** field to the signup email
4. Save

### Issue 4: "Services page shows no departments"

**Cause:** No Medical Departments created

**Solution:**

1. Go to: `/app/medical-department`
2. Add at least 3-4 departments
3. Refresh the website

### Issue 5: "Doctors see all appointments, not just theirs"

**Solution:**

1. In `/app/patient-appointment` page
2. Click **Filter**
3. Add: `Practitioner = [Doctor's name]`
4. Click **Save Filter** to remember it

---

## 📱 Mobile Responsiveness

All the dynamic HTML files I've created are mobile-responsive. Test on:

- Desktop (Chrome, Firefox)
- Tablet (iPad)
- Mobile (iPhone, Android)

---

## 🎨 Customization Tips

### Change Colors

In each HTML file, find the `<style>` section:

```css
/* Primary color (blue) */
background: #0d6efd; /* Change to your brand color */
```

### Change Logo

1. Go to **Website Settings**
2. Upload your logo in **Banner Image** field
3. It will appear in the navigation bar

### Add More Fields to Doctor Cards

In `doctors-dynamic.html`, modify the Jinja query:

```html
{% set doctors = frappe.get_all('Healthcare Practitioner', fields=['name',
'practitioner_name', 'department', 'image', 'op_consulting_charge'],
filters={'status': 'Active'}) %}

<!-- Then use it -->
<p>Fee: {{ doc.op_consulting_charge }} BDT</p>
```

---

## 🚀 Next Steps

1. ✅ Follow PART 1-4 to setup ERPNext
2. ✅ Add your real doctors and departments (PART 2)
3. ✅ Create web pages with the dynamic HTML files (PART 3)
4. ✅ Test patient registration (PART 5)
5. ✅ Test doctor login (PART 6-7)
6. ✅ Book a test appointment end-to-end
7. ✅ Customize colors and content
8. ✅ Add more features (reports, billing, etc.)

---

## 📞 Quick Reference

| What You Want       | Where to Go                    |
| ------------------- | ------------------------------ |
| Add a doctor        | `/app/healthcare-practitioner` |
| Add a department    | `/app/medical-department`      |
| View appointments   | `/app/patient-appointment`     |
| Create a patient    | `/app/patient`                 |
| Edit website pages  | `/app/web-page`                |
| Change navigation   | `/app/website-settings`        |
| Healthcare settings | `/app/healthcare-settings`     |

---

## 🎓 Learning Resources

- **ERPNext Docs**: https://docs.erpnext.com/
- **Frappe Docs**: https://frappeframework.com/docs
- **Healthcare Module**: https://github.com/frappe/healthcare

---

**You're all set!** Follow this guide step by step, and you'll have a fully functional hospital management system. Remember: everything is **dynamic** - add data once in ERPNext, it appears everywhere automatically! 🎉
