# 🎓 OFFICIAL: Patient Portal Setup (Based on Frappe Healthcare Docs)

## From: https://marleyhealth.io/docs & https://school.frappe.io

**Your Website:** http://147.93.153.249:8081/

---

## 🔑 KEY INSIGHT from Official Documentation

**IMPORTANT**: According to the official Marley Healthcare (ERPNext Healthcare) documentation:

> "ERPNext Healthcare allows you to create a portal user associated with a Patient by simply entering the user email id. A welcome email will be sent to the Patient email address to 'Complete' registration."

This means: **Admin creates the Patient first, THEN the system creates the User automatically!**

This is the **OPPOSITE** of what we thought (user signup first, then patient creation).

---

## ✅ THE OFFICIAL WAY (Recommended by Frappe)

### Method 1: Admin Creates Patient with Portal Access

This is how ERPNext Healthcare is designed to work:

1. **Admin logs in** to ERPNext

2. **Go to Patient List**:
   - Search "Patient"
   - OR: `http://147.93.153.249:8081/app/patient`

3. **Click "+ Add Patient"**

4. **Fill Patient Details**:

   ```
   First Name: John
   Last Name: Smith
   Gender: Male
   Date of Birth: 1990-01-01
   Mobile: +880XXXXXXXXXX
   Email: patient@example.com
   Blood Group: O+ (optional)
   ```

5. **IMPORTANT - Grant Portal Access**:
   - Find the **"User"** field in the Patient form
   - Enter: `patient@example.com` (the patient's email)
   - System will automatically create a User account
   - A **welcome email** is sent to this address
   - Patient receives email with link to complete registration

6. **Click Save**

7. **Patient receives email** with:
   - Link to set password
   - Portal access credentials
   - Instructions to login

8. **Patient clicks link** → Sets password → Can now login!

---

## 🎯 THE ALTERNATIVE WAY (Self-Signup)

If you still want patients to self-register (like on a public website):

### Step 1: Enable Self-Signup (Admin)

1. **Go to Website Settings**:
   `http://147.93.153.249:8081/app/website-settings`

2. **Enable**:

   ```
   ☑ Allow Sign Ups
   ```

3. **Go to Healthcare Settings**:
   `http://147.93.153.249:8081/app/healthcare-settings`

4. **Enable**:
   ```
   ☑ Link Customer to Patient
   ☑ Manage Customer and Patient Relations
   ```

### Step 2: Patient Self-Registers

1. Patient goes to: `http://147.93.153.249:8081/signup`

2. Fills form:

   ```
   Full Name: John Smith
   Email: patient@example.com
   Password: SecurePassword123!
   ```

3. Clicks **Sign Up**

4. **User account created** (but NOT a Patient yet!)

### Step 3: Auto-Link User to Patient (Requires Custom Script)

**Problem**: ERPNext doesn't auto-create Patient from User signup

**Solution**: Admin must manually create Patient and link to User:

1. **Go to Patient List**: `/app/patient`

2. **Create new Patient**

3. **In the "User" field**: Select the email that signed up

4. **Save**

Now the user can book appointments!

---

## ⚙️ CONFIGURATION CHECKLIST

Based on official docs, configure these settings:

### Healthcare Settings (`/app/healthcare-settings`)

- [ ] ☑ **Patient Master Created** - Core patient module enabled
- [ ] ☑ **Link Customer to Patient** - For billing integration
- [ ] ☑ **Manage Customer and Patient Relations** - Links accounting

### Optional: Registration Fee

- [ ] ☑ **Collect Registration Fee** - If you charge for patient registration
- [ ] **Registration Fee**: Set amount (e.g., 500 BDT)
- [ ] Note: Patients will be "Disabled" until fee is paid

### Website Settings (`/app/website-settings`)

- [ ] ☑ **Allow Sign Ups** - For self-service registration
- [ ] **Home Page**: `home` (your custom page)

### Portal Settings (`/app/portal-settings`)

- [ ] Ensure **"Patient"** role is allowed in portal
- [ ] Ensure **"Healthcare Practitioner"** role is allowed (for doctors)

---

## 🏥 OFFICIAL WORKFLOW (Step by Step)

### For Walk-in Patients (Clinic Reception)

1. **Patient arrives** at clinic

2. **Receptionist** opens ERPNext

3. **Creates Patient record**:
   - Patient List → New
   - Fill basic details
   - If patient wants portal access: Enter their email
   - Save

4. **Patient receives email** (if email provided)

5. **Patient sets password** via email link

6. **Patient can now**:
   - Login to portal
   - View appointments
   - Access medical records

### For Online Registration (Your Website)

**Current Limitation**: ERPNext doesn't have built-in patient self-registration flow.

**Workaround Options**:

**Option A: Use Web Form** (Simplest)

1. Create a **Web Form** in ERPNext:
   - Go to: Website → Web Form → New
   - DocType: Patient
   - Published: Yes
   - Allow Edit: No
   - Fields: First Name, Last Name, Email, Mobile, Gender, DOB

2. **Public URL**: `/patient-registration` (or whatever route you set)

3. **When patient submits**:
   - Patient record created automatically
   - Admin gets notification
   - Admin can then create User for portal access

**Option B: Custom Portal Module** (Advanced)

1. Create custom patient portal app (requires development)
2. Use Frappe's portal framework
3. Auto-create Patient + User on signup

**Option C: Manual Process** (Current)

1. Patient signs up → Creates User
2. Admin manually links User to Patient
3. Not ideal but works until better solution

---

## 🔍 WHAT THE OFFICIAL DOCS SAY

From **marleyhealth.io/docs/v13/user/manual/en/healthcare/patient**:

### Patient Portal Access

> "ERPNext Healthcare allows you to create a portal user associated with a Patient by simply entering the user email id. A welcome email will be sent to the Patient email address to 'Complete' registration."

**This means**:

- The **Patient** document is primary
- **User** is created from Patient (not the reverse!)
- System sends welcome email automatically
- Patient completes registration via email link

### Registration Fee

> "Many clinical facilities collect a registration fee during Patient Registration. You can enable this feature by checking the 'Collect Registration Fee' in Healthcare Settings."

**If enabled**:

- New Patients start in "Disabled" state
- Must invoice registration fee first
- Use "Invoice Patient Registration" button
- Patient becomes "Enabled" after payment

### Patient as Customer

> "By default, the system creates a Customer alongside a Patient and links to it."

**For billing**:

- Patient record → Creates Customer record
- All medical bills linked to Customer
- Important for accounting module

---

## 📱 PATIENT PORTAL FEATURES

Once a patient has portal access, they can:

| Feature              | URL                            | Description                   |
| -------------------- | ------------------------------ | ----------------------------- |
| **Dashboard**        | `/app`                         | Portal homepage               |
| **My Appointments**  | `/app/patient-appointment`     | View all appointments         |
| **Book Appointment** | `/app/patient-appointment/new` | Schedule new appointment      |
| **Medical Records**  | `/app/patient-medical-record`  | View diagnoses, prescriptions |
| **Lab Results**      | `/app/lab-test`                | View test results             |
| **Vital Signs**      | `/app/vital-signs`             | View BP, temperature history  |
| **Profile**          | `/app/patient/[id]`            | View/edit personal info       |

---

## 🚨 COMMON ISSUES & SOLUTIONS

### Issue 1: "No signup page available"

**Cause**: "Allow Sign Ups" not enabled

**Solution**:

1. Website Settings → Check "Allow Sign Ups"
2. Try: `http://147.93.153.249:8081/signup`

### Issue 2: "User signed up but can't access patient features"

**Cause**: User exists but no Patient record linked

**Solution** (Admin):

1. Create Patient record
2. Set User field to the signup email
3. Save

### Issue 3: "Welcome email not sent"

**Cause**: Email not configured in ERPNext

**Solution**:

- Configure email in: Email Account settings
- OR: Manually share login credentials with patient

### Issue 4: "Patient can't book appointments"

**Possible causes**:

1. No Healthcare Practitioner exists → Add doctors
2. No Practitioner Schedules → Create schedules
3. Patient not linked to User → Link in Patient record
4. Patient is "Disabled" → Check registration fee requirement

---

## 🎯 RECOMMENDED SETUP FOR YOUR HOSPITAL

Based on official documentation and best practices:

### For Hemayetpur Central Hospital

**Recommendation**: Use **Admin-Created Patients** (Official Way)

**Why**:

- Follows official ERPNext Healthcare design
- Easier to manage
- Better data quality
- No orphaned User accounts

**Implementation**:

1. **At Reception Desk**:
   - When patient arrives, receptionist creates Patient record
   - Asks: "Do you want online portal access?"
   - If yes: Enter patient email
   - System sends welcome email automatically

2. **On Your Website**:
   - Remove/hide signup link if using admin-created method
   - OR: Add "Request Registration" form that notifies admin
   - Admin creates patient record upon request

3. **For Existing Website Users**:
   - If they already signed up, admin links them manually
   - One-time cleanup task

---

## 📞 OFFICIAL RESOURCES

- **Course**: https://school.frappe.io/lms/courses/healthcare-management
- **Documentation**: https://marleyhealth.io/docs
- **GitHub**: https://github.com/earthians/marley (formerly frappe/healthcare)
- **Videos**: [YouTube Playlist](https://www.youtube.com/playlist?list=PL3lFfCEoMxvyj1qieiWKHJHesbn3XuJyR)

---

## ✅ UPDATED CHECKLIST

- [ ] **Watch** the official Frappe School course (1-2 hours)
- [ ] **Configure** Healthcare Settings properly
- [ ] **Decide** workflow: Admin-created patients OR self-signup
- [ ] **Create** at least 1 test patient using official method
- [ ] **Test** patient portal access end-to-end
- [ ] **Document** your chosen workflow for staff
- [ ] **Train** reception staff on creating patients

---

## 🎓 WATCH THIS COURSE!

**Frappe School - Healthcare Management**
https://school.frappe.io/lms/courses/healthcare-management

**Covers**:

1. Master Data and Setup
2. Patient Management ← **Important for your question!**
3. Consultation Management
4. Lab Management
5. Inpatient Management
6. Rehabilitation and Physiotherapy

**Duration**: ~1-2 hours
**Level**: Beginner-friendly
**Rating**: 4.6/5 stars

---

## 🚀 NEXT STEPS

1. **Watch Module 2** of Frappe School course (Patient Management)
2. **Follow the official method** shown in the video
3. **Test with 1 patient** before rolling out
4. **Update your guides** based on what works for you

---

**Key Takeaway**: ERPNext Healthcare is designed with **admin creating patients first**, then granting portal access by email. Self-signup requires custom development or manual linking workflow.

Your current implementation can work, but you'll need to manually link Users to Patients after they sign up. The official method avoids this extra step! 🎉
