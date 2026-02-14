# 🏥 Patient & Doctor Portal Guide

## Quick Reference for Users

**Website:** http://147.93.153.249:8081/

---

## 👤 FOR PATIENTS

### How to Register

1. **Go to**: `http://147.93.153.249:8081/login`
2. Click **"Don't have an account? Sign Up"**
3. Fill the form:
   - Full Name
   - Email
   - Password
4. Click **Sign Up**
5. Check your email for verification (if enabled)
6. **Important**: After signup, you may need to complete your patient profile

### Why Registration Doesn't Auto-Login

ERPNext doesn't auto-login after registration for security reasons. You need to:

1. Go back to `/login`
2. Enter your email and password
3. Click **Login**

### How to Complete Patient Profile (If Required)

After first login, you may see a prompt to complete patient details:

1. Fill in:
   - Date of Birth
   - Gender
   - Phone Number
   - Address
2. Click **Save**
3. Now you're a registered patient!

### Patient Portal Access

After login, patients can access these URLs:

| What You Want        | URL                            | Description                                |
| -------------------- | ------------------------------ | ------------------------------------------ |
| **Book Appointment** | `/app/patient-appointment/new` | Schedule with a doctor                     |
| **My Appointments**  | `/app/patient-appointment`     | View all appointments (past & upcoming)    |
| **My Profile**       | `/app/patient`                 | View/edit personal information             |
| **Medical Records**  | `/app/patient-medical-record`  | View diagnoses, prescriptions, lab results |
| **Prescriptions**    | `/app/patient-encounter`       | All doctor prescriptions                   |
| **Lab Tests**        | `/app/lab-test`                | Lab test results                           |
| **Bills**            | `/app/sales-invoice`           | Medical bills and invoices                 |

### How to Book an Appointment

**Method 1: From the Website**

1. Click **"Book Appointment"** on homepage
2. Login (if not logged in)
3. Click **"Proceed to Booking System"**
4. Fill the form:
   - **Patient**: Auto-filled (your name)
   - **Practitioner**: Select a doctor
   - **Department**: Auto-filled based on doctor
   - **Appointment Date**: Pick a date
   - **Appointment Time**: Select available slot
   - **Symptoms**: Describe your problem (optional)
5. Click **Save**
6. Done! You'll receive a confirmation

**Method 2: Direct URL**
Go to: `http://147.93.153.249:8081/app/patient-appointment/new`

### What Happens After Booking?

1. Appointment is created in the system
2. Doctor sees it in their dashboard
3. You receive confirmation (if email is configured)
4. You can view it anytime in **My Appointments**
5. On appointment day, doctor will see you and create a consultation record

### How to View/Cancel Appointments

1. Go to: `/app/patient-appointment`
2. You see all your appointments
3. Click on any appointment to view details
4. To cancel: Click **Cancel** button (if allowed)

### How to View Medical Records

1. Go to: `/app/patient-medical-record`
2. You see all consultations, diagnoses, prescriptions
3. Click any record to view full details
4. You can download/print reports

### Patient Dashboard Quick Links

After login, add these to your bookmarks:

```
Home: /app
Book Appointment: /app/patient-appointment/new
My Appointments: /app/patient-appointment
My Records: /app/patient-medical-record
My Profile: /app/patient
```

---

## 👨‍⚕️ FOR DOCTORS

### Why Can't I Login with Practitioner Email?

**Common Mistake**: Adding email in Healthcare Practitioner form doesn't create a login account.

**Solution**: You need to create a **User** account linked to the practitioner.

### How to Create Doctor Login (Admin Does This)

1. **Open the Healthcare Practitioner** record
2. Scroll to **User** field
3. Click **Create a new User** (or select existing)
4. Fill user details:
   ```
   Email: doctor@example.com
   First Name: John
   Last Name: Doe
   ```
5. **IMPORTANT - Assign Roles**:
   ```
   ☑ Healthcare Practitioner
   ☑ Physician
   ☑ Desk User (allows access to /app)
   ```
6. Click **Save**
7. Now the doctor can login with this email

### Doctor Login

1. Go to: `http://147.93.153.249:8081/login`
2. Enter doctor's email and password
3. Click **Login**
4. You're taken to the **ERPNext Desk** (not a separate portal)

### Doctor Portal (Desk) Pages

Doctors use the full ERPNext desk with these key pages:

| What You Need             | URL                          | Description                            |
| ------------------------- | ---------------------------- | -------------------------------------- |
| **Dashboard**             | `/app`                       | Main dashboard with shortcuts          |
| **My Appointments**       | `/app/patient-appointment`   | All appointments (filter by your name) |
| **All Patients**          | `/app/patient`               | Complete patient database              |
| **Start Consultation**    | `/app/patient-encounter/new` | Create consultation/prescription       |
| **Lab Tests**             | `/app/lab-test`              | Order and view lab tests               |
| **Vital Signs**           | `/app/vital-signs`           | Record BP, temperature, etc.           |
| **Inpatient**             | `/app/inpatient-record`      | Admit/discharge patients               |
| **Medical Procedures**    | `/app/clinical-procedure`    | Record procedures done                 |
| **Practitioner Schedule** | `/app/practitioner-schedule` | View/edit your schedule                |

### How Doctors See ONLY Their Appointments

By default, `/app/patient-appointment` shows ALL appointments.

**To filter for your appointments**:

1. Go to: `/app/patient-appointment`
2. Click **Filter** button (top right)
3. Add filter:
   - Field: `Practitioner`
   - Condition: `=`
   - Value: `Dr. Your Name`
4. Click **Apply**
5. Click **Save Filter** to remember it

### How to Handle an Appointment (Full Workflow)

**Step 1: Doctor sees appointment**

- Go to `/app/patient-appointment`
- See list of appointments
- Click on an appointment

**Step 2: Mark patient as checked-in**

- In appointment, click **Check In** button
- Or change status to "Checked In"

**Step 3: Start consultation**

- From appointment, click **Create > Patient Encounter**
- A new form opens

**Step 4: Fill consultation details**

```
Patient: [Auto-filled]
Practitioner: [Auto-filled]
Encounter Date: [Today]
Encounter Time: [Current time]

Symptoms: [Patient's complaints]
Diagnosis: [Your diagnosis]

Drug Prescription:
  - Click Add Row
  - Drug Name: Paracetamol 500mg
  - Dosage: 1-0-1
  - Period: 5 days
  - Add more rows as needed

Lab Test Prescription:
  - Click Add Row
  - Lab Test: Blood Test
  - Add more if needed

Medical Code: [ICD code if applicable]
```

**Step 5: Save encounter**

- Click **Save**
- Click **Submit** to finalize
- Patient can now see this in their portal!

**Step 6: Mark appointment as closed**

- Go back to appointment
- Change status to **Closed**

### How to View Patient History

1. Go to: `/app/patient`
2. Search for patient name
3. Click patient name
4. You see:
   - Demographics
   - Past appointments
   - Medical history
   - Lab results
   - Prescriptions
   - Vital signs graph

### How to Create Prescription

**Method 1: During Encounter (Recommended)**

- While filling Patient Encounter
- Add drugs in **Drug Prescription** table
- Save → Patient gets the prescription

**Method 2: Standalone Prescription**

- Not typical in ERPNext Healthcare
- Usually done as part of encounter

### Doctor Dashboard Customization

You can create a custom workspace:

1. Go to: `/app/workspace`
2. Click **+ New Workspace**
3. Name: "Doctor Dashboard"
4. Add shortcuts:
   - "My Appointments" → `/app/patient-appointment`
   - "New Consultation" → `/app/patient-encounter/new`
   - "Patient List" → `/app/patient`
   - "Lab Tests" → `/app/lab-test`
5. Save and set as default

---

## 🔧 TROUBLESHOOTING

### Issue 1: Patient Can't Book Appointment

**Symptoms**: After login, "Book Appointment" doesn't work

**Causes**:

- User exists but not linked to Patient record
- Healthcare module not enabled
- Practitioner schedules not set

**Solutions**:

1. **Admin**: Create Patient record manually
   - Go to `/app/patient/new`
   - Link **User** field to the user's email
   - Save

2. Check Healthcare Settings:
   - Search "Healthcare Settings"
   - Enable "Allow Appointment Booking"

3. Check practitioner has schedules:
   - Go to `/app/practitioner-schedule`
   - Create schedule for doctor

### Issue 2: Doctor Can't Login

**Symptoms**: Email/password incorrect

**Causes**:

- No User account created
- Wrong roles assigned

**Solutions**:

1. Go to Healthcare Practitioner record
2. Check **User** field - if empty, create user
3. Make sure user has roles:
   - Healthcare Practitioner
   - Physician
   - Desk User

### Issue 3: Appointments Don't Show Available Slots

**Causes**:

- Practitioner has no schedule
- All slots are booked

**Solutions**:

1. Go to `/app/practitioner-schedule`
2. Create schedule for the doctor:
   - Days of week
   - Time slots (e.g., 9:00 AM - 5:00 PM)
   - Duration per appointment (e.g., 15 min)

### Issue 4: Patient Sees "Access Denied"

**Causes**:

- Wrong permissions
- User not linked to patient

**Solutions**:

1. Admin: Check Patient record
2. Make sure **User** field = patient's email
3. User should have "Patient" in Related To field

### Issue 5: After Signup, Can't See Patient Features

**Causes**:

- User created but Patient record not created

**Solutions**:
**Option A: Patient Self-Service**

- After login, patient may see a prompt
- "Complete Patient Registration"
- Fill details and save

**Option B: Admin Creates Manually**

1. Admin goes to `/app/patient/new`
2. Fill patient details
3. Link **User** field to signup email
4. Save

---

## 📱 MOBILE ACCESS

Both patient and doctor portals work on mobile:

- Responsive design
- Works on iPhone/Android
- Same URLs work on mobile browsers

Patients can:

- Book appointments on mobile
- View prescriptions
- Check appointment status

Doctors can:

- View appointments on mobile
- Access patient records
- Not ideal for writing prescriptions (use desktop)

---

## 🔐 PRIVACY & SECURITY

- All data encrypted in transit (HTTPS)
- Patients can only see their own records
- Doctors can only see their assigned patients
- Admin has full access
- Change default password immediately!

---

## 📞 SUPPORT

If patients have issues:

- Call hospital: +880 123 456 7890
- Email: info@hemayetpurhospital.com
- Admin can help at desk

---

## 🎯 QUICK SUMMARY

### For Patients:

1. Register at `/login` → Sign Up
2. Login again with credentials
3. Book appointment: `/app/patient-appointment/new`
4. View appointments: `/app/patient-appointment`
5. View records: `/app/patient-medical-record`

### For Doctors:

1. Admin creates User account (linked to practitioner)
2. Login at `/login`
3. View appointments: `/app/patient-appointment`
4. Filter for your appointments
5. Click appointment → Create Encounter
6. Fill diagnosis & prescription
7. Save & Submit

### For Admin:

1. Add departments: `/app/medical-department`
2. Add doctors: `/app/healthcare-practitioner`
3. Create user for doctor (link in practitioner)
4. Create schedules: `/app/practitioner-schedule`
5. When patient signs up, create Patient record linking the user

---

**Everything is now fully dynamic and integrated with ERPNext!** 🎉
