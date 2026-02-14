# 🚀 STEP-BY-STEP: Patient Self-Signup Implementation Guide

## Public Registration with Manual Admin Linking

**Website:** http://147.93.153.249:8081/

---

## 📋 OVERVIEW

This guide shows you how to enable **public patient self-registration** on your website.

**How it works**:

1. Patient visits your website and clicks "Sign Up"
2. Patient fills registration form
3. User account is created (but NOT a Patient yet)
4. Admin manually creates Patient record and links to User
5. Patient can now login and book appointments

**Time Required**:

- Setup: 10 minutes
- Per patient: 2-3 minutes admin work

---

## ⚙️ PHASE 1: ADMIN CONFIGURATION (One-Time Setup)

### Step 1.1: Enable Website Sign Ups

1. **Login as Administrator**:

   ```
   URL: http://147.93.153.249:8081/login
   Username: Administrator
   Password: admin
   ```

2. **Open Website Settings**:
   - Click the search bar (top right, or press `Ctrl+K`)
   - Type: `Website Settings`
   - Click on **"Website Settings"** from results
   - OR go directly to: `http://147.93.153.249:8081/app/website-settings`

3. **Scroll down to "Sign Up" section** (about halfway down the page)

4. **Enable Sign Up**:

   ```
   Find: "Allow Sign Ups" checkbox
   Action: ☑ CHECK THIS BOX
   ```

5. **Configure Sign Up Settings** (in the same section):

   ```
   Signup Enabled: Yes (auto-checked)
   Sign Up Role: Website User (default - leave as is)
   Login After Signup: 0 (no auto-login)
   ```

6. **Click "Save"** (top right button)

7. **Verify**:
   - Open a new incognito/private browser window
   - Go to: `http://147.93.153.249:8081/signup`
   - You should see a signup form (if you see an error, signups aren't enabled)

---

### Step 1.2: Configure Healthcare Settings

1. **Go to Healthcare Settings**:
   - Search: `Healthcare Settings` (Ctrl+K)
   - OR: `http://147.93.153.249:8081/app/healthcare-settings`

2. **Enable Required Options**:
   Scroll through the form and check these boxes:

   ```
   ☑ Patient Master Created
   ☑ Link Customer to Patient
   ☑ Manage Customer and Patient Relations
   ```

3. **Optional - Registration Fee** (skip if you don't charge):

   ```
   ☐ Collect Registration Fee (leave unchecked for now)
   ```

4. **Click "Save"**

---

### Step 1.3: Verify Prerequisites

Make sure you have:

- [ ] At least **1 Medical Department** created
  - Check: `http://147.93.153.249:8081/app/medical-department`
  - If empty: Click "+ Add" and create departments

- [ ] At least **1 Healthcare Practitioner** created
  - Check: `http://147.93.153.249:8081/app/healthcare-practitioner`
  - If empty: Click "+ Add" and create doctors

- [ ] At least **1 Practitioner Schedule** created
  - Check: `http://147.93.153.249:8081/app/practitioner-schedule`
  - If empty: Click "+ Add" and create schedules

**Without these, patients can't book appointments even after registration!**

---

## 👤 PHASE 2: PATIENT SELF-REGISTRATION (Patient Does This)

### Step 2.1: Patient Accesses Signup Page

Patient can access signup in multiple ways:

**Method A - Direct URL:**

```
http://147.93.153.249:8081/signup
```

**Method B - From Login Page:**

1. Go to: `http://147.93.153.249:8081/login`
2. Look for: **"Don't have an account? Sign Up"** link
3. Click it

**Method C - From Your Website:**

1. Go to: `http://147.93.153.249:8081/appointment`
2. Click "Sign Up" button in the login prompt

---

### Step 2.2: Patient Fills Signup Form

The signup form will have these fields:

```
┌─────────────────────────────────────┐
│  Sign Up                            │
├─────────────────────────────────────┤
│                                     │
│  Full Name: John Smith              │
│  Email: johnsmith@example.com       │
│  Password: •••••••••••              │
│                                     │
│  [Sign Up Button]                   │
│                                     │
│  Already have an account? Login     │
└─────────────────────────────────────┘
```

**Patient should enter**:

- **Full Name**: Their real name (e.g., John Smith)
- **Email**: Valid email address (important!)
- **Password**: Strong password (min 6 characters)

---

### Step 2.3: Patient Submits Form

1. Patient clicks **"Sign Up"** button

2. **Success Message** appears:

   ```
   "Your account has been created"
   OR
   "Please check your email to verify"
   ```

3. **Patient is NOT auto-logged in** (ERPNext security feature)

4. Patient should go to: `http://147.93.153.249:8081/login`

5. Patient enters their email and password

6. Patient clicks **"Login"**

7. **Important**: At this point, patient can login but **CANNOT book appointments yet** because no Patient record exists!

---

## 👨‍⚕️ PHASE 3: ADMIN LINKS USER TO PATIENT (Admin Does This)

This is the **critical step** that connects the User account to a Patient record.

### Step 3.1: Admin Checks New User

1. **Admin logs in** (if not already)

2. **Go to User List**:
   - Search: `User`
   - OR: `http://147.93.153.249:8081/app/user`

3. **Find the new user**:
   - Sort by: "Created On" (most recent first)
   - Look for: The email that just signed up (e.g., johnsmith@example.com)
   - Click on the user to verify it exists

4. **Note the email address** (you'll need it in next step)

---

### Step 3.2: Admin Creates Patient Record

**IMPORTANT**: This is where you connect the User to healthcare system!

1. **Go to Patient List**:
   - Search: `Patient`
   - OR: `http://147.93.153.249:8081/app/patient`

2. **Click "+ Add Patient"** button (top right)

3. **Fill the REQUIRED fields**:

   ```
   ┌─────────────────────────────────────────────┐
   │ Patient                                     │
   ├─────────────────────────────────────────────┤
   │                                             │
   │ First Name*: John                           │
   │ Last Name: Smith                            │
   │ Patient Name: John Smith (auto-fills)       │
   │                                             │
   │ Gender*: ○ Male  ○ Female  ○ Other         │
   │                                             │
   │ Date of Birth*: [DD-MM-YYYY]               │
   │                                             │
   │ Mobile: +880XXXXXXXXXX                      │
   │ Email: johnsmith@example.com                │
   │                                             │
   │ Blood Group: [Select]                       │
   │                                             │
   └─────────────────────────────────────────────┘
   ```

4. **MOST IMPORTANT - Link the User**:

   Scroll down to find **"User" field**:

   ```
   User: [Start typing email...]
   ```

   - Click in the "User" field
   - Type: `johnsmith@example.com` (the email they signed up with)
   - Select from dropdown that appears
   - **This link is CRITICAL - without it, the user can't book appointments!**

5. **Optional fields** (can add now or later):

   ```
   Customer: [Auto-created or select existing]
   Occupation: Student/Professional/etc
   Marital Status: Single/Married/etc
   ```

6. **Click "Save"** (top right)

7. **Verify Success**:
   - You should see: "Patient [name] saved successfully"
   - The Patient ID is generated (e.g., PAT-00001)
   - User field shows the linked email

---

### Step 3.3: Verify the Link Works

**Test the connection**:

1. **Stay logged in as Admin**

2. **Find the Patient you just created**:
   - Patient List → Click on the patient name

3. **Check the "User" field**:
   - Should show: johnsmith@example.com (linked)
   - If empty: YOU MUST go back and link it!

4. **Check Permissions**:
   - The User now has access to their patient portal

---

## ✅ PHASE 4: PATIENT TESTS THE PORTAL (Patient Does This)

Now the patient can use the full portal!

### Step 4.1: Patient Logs In

1. **Patient goes to**: `http://147.93.153.249:8081/login`

2. **Enters credentials**:

   ```
   Email: johnsmith@example.com
   Password: [their password]
   ```

3. **Clicks "Login"**

4. **Redirected to**: `/app` (ERPNext desk)

---

### Step 4.2: Patient Books Appointment

1. **From homepage, patient goes to**:

   ```
   http://147.93.153.249:8081/app/patient-appointment/new
   ```

   OR from your website:

   ```
   http://147.93.153.249:8081/appointment
   → Click "Proceed to Booking System"
   ```

2. **Appointment Form appears**:

   ```
   ┌─────────────────────────────────────────────┐
   │ Patient Appointment                         │
   ├─────────────────────────────────────────────┤
   │                                             │
   │ Patient*: John Smith (auto-filled!)         │
   │                                             │
   │ Practitioner*: [Select Doctor]              │
   │                                             │
   │ Department: [Auto-fills based on doctor]    │
   │                                             │
   │ Appointment Date*: [Calendar]               │
   │                                             │
   │ Appointment Time*: [Available slots]        │
   │                                             │
   │ Symptoms: [Optional description]            │
   │                                             │
   └─────────────────────────────────────────────┘
   ```

3. **Patient fills**:
   - Selects Doctor
   - Picks Date
   - Chooses Time Slot
   - Adds symptoms (optional)

4. **Clicks "Save"**

5. **Success!** Appointment is created

---

### Step 4.3: Patient Views Appointment

1. **Go to My Appointments**:

   ```
   http://147.93.153.249:8081/app/patient-appointment
   ```

2. **Patient sees**:
   - List of all their appointments
   - Status (Open, Scheduled, Closed)
   - Doctor name
   - Date and time
   - Can click to view details

---

## 🔄 WORKFLOW SUMMARY (Complete Flow)

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  PUBLIC WEBSITE                                         │
│  ├─ Patient clicks "Sign Up"                           │
│  ├─ Patient fills: Name, Email, Password               │
│  └─ Patient clicks "Sign Up" button                    │
│                                                         │
└──────────────────┬──────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  ERPNEXT SYSTEM                                         │
│  ├─ User account created                               │
│  ├─ User can login                                     │
│  └─ BUT: No Patient record yet                        │
│                                                         │
└──────────────────┬──────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  ADMIN PANEL                                            │
│  ├─ Admin sees new User in User list                   │
│  ├─ Admin creates Patient record                       │
│  ├─ Admin links User email to Patient                  │
│  └─ Admin saves                                        │
│                                                         │
└──────────────────┬──────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  PATIENT PORTAL                                         │
│  ├─ Patient logs in                                    │
│  ├─ Patient can book appointments                      │
│  ├─ Patient can view medical records                   │
│  └─ Full access to healthcare features                 │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 📝 DAILY ADMIN WORKFLOW (After Setup)

Every day, admin should:

### Morning Routine (5-10 minutes)

1. **Check for new signups**:

   ```
   Go to: /app/user
   Filter: Created: Today
   Note: Any new emails
   ```

2. **Create Patient records for new users**:

   ```
   For each new user email:
   → Go to: /app/patient
   → Click "+ Add Patient"
   → Fill details
   → Link User field to email
   → Save
   ```

3. **Notify patients** (optional):
   ```
   Send email/SMS:
   "Your account is ready! You can now book appointments at [website]"
   ```

---

## 🚨 TROUBLESHOOTING

### Issue 1: Patient Can't See Signup Page

**Symptoms**:

- Going to `/signup` shows error or blank page
- No "Sign Up" link on login page

**Solution**:

1. Check Website Settings
2. Make sure "Allow Sign Ups" is ☑ checked
3. Click Save
4. Clear browser cache
5. Try again in incognito mode

**Verify**: `http://147.93.153.249:8081/signup` should show form

---

### Issue 2: After Signup, Patient Can't Login

**Symptoms**:

- Signup succeeds
- But login shows "Invalid credentials"

**Possible causes**:

1. Email verification required (but not configured)
2. User account not activated

**Solution** (Admin):

1. Go to: `/app/user/[patient-email]`
2. Check: ☑ "Enabled"
3. Uncheck: ☐ "Send Welcome Email"
4. Save
5. Ask patient to try logging in again

---

### Issue 3: Patient Can Login But Can't Book Appointment

**Symptoms**:

- Patient logs in successfully
- Tries to book appointment
- Shows "Access Denied" or "No Patient found"

**Cause**: User exists but NOT linked to Patient record

**Solution** (Admin):

1. Go to: `/app/patient`
2. Search: Does Patient exist for this email?
3. If NO → Create new Patient and link User
4. If YES → Open Patient → Check "User" field is filled
5. Save

---

### Issue 4: Multiple Patients with Same Email

**Symptoms**:

- System shows error when creating Patient
- "Email already exists"

**Cause**: Someone already created a Patient with this email

**Solution**:

1. Search existing Patient
2. Link the User field to existing Patient
3. OR: Use different email for new Patient

---

### Issue 5: Admin Forgot to Link User Field

**Symptoms**:

- Patient exists
- User exists
- But patient can't access portal

**Solution**:

1. Open Patient record
2. Find "User" field (scroll down)
3. Start typing the patient's email
4. Select from dropdown
5. Save
6. Ask patient to try again

---

## 🎯 BEST PRACTICES

### 1. Create a Daily Linking Routine

**Set a schedule**:

- Check for new signups: 9 AM and 3 PM daily
- Create Patient records immediately
- Notify patients within 1 hour

### 2. Use a Spreadsheet to Track

Create a simple tracker:

```
Date | Email | Signed Up | Patient Created | Status
-----|-------|-----------|-----------------|-------
14/2 | john@example.com | ✓ | ✓ | Done
14/2 | jane@example.com | ✓ | ⏳ | Pending
```

### 3. Train Reception Staff

Create a 1-page guide for staff:

1. Check User list
2. Create Patient
3. Link email
4. Save
5. Notify patient

### 4. Set Up Notifications (Optional)

If you have email configured:

- Admin can receive email when new user signs up
- Faster response time
- Better patient experience

### 5. Consider Automation (Advanced)

For high volume:

- Create a custom script to auto-create Patient when User signs up
- Requires Frappe developer
- Worth it if you get 10+ signups/day

---

## 📊 QUICK REFERENCE COMMANDS

### For Admin:

| Task                | URL                        | Shortcut                 |
| ------------------- | -------------------------- | ------------------------ |
| Check new users     | `/app/user`                | Ctrl+K → "User"          |
| Create patient      | `/app/patient/new`         | Ctrl+K → "Patient" → New |
| All patients        | `/app/patient`             | Ctrl+K → "Patient"       |
| All appointments    | `/app/patient-appointment` | Ctrl+K → "Appointment"   |
| Website Settings    | `/app/website-settings`    | Ctrl+K → "Website"       |
| Healthcare Settings | `/app/healthcare-settings` | Ctrl+K → "Healthcare"    |

### For Patients:

| Task             | URL                            |
| ---------------- | ------------------------------ |
| Signup           | `/signup`                      |
| Login            | `/login`                       |
| Book appointment | `/app/patient-appointment/new` |
| My appointments  | `/app/patient-appointment`     |
| My records       | `/app/patient-medical-record`  |
| Dashboard        | `/app`                         |

---

## ✅ FINAL CHECKLIST

Setup (One-time):

- [ ] Website Settings → "Allow Sign Ups" → ☑ Enabled
- [ ] Healthcare Settings → All options enabled
- [ ] Tested signup URL works: `/signup`
- [ ] At least 1 doctor exists
- [ ] At least 1 schedule exists
- [ ] At least 1 department exists

Daily Process (Per patient):

- [ ] Patient signs up at `/signup`
- [ ] Admin checks `/app/user` for new registrations
- [ ] Admin creates Patient at `/app/patient/new`
- [ ] Admin fills patient details
- [ ] Admin links "User" field to email ← **CRITICAL!**
- [ ] Admin saves Patient record
- [ ] Admin notifies patient (optional)
- [ ] Patient logs in and books appointment
- [ ] Verified patient can access portal

---

## 🎓 TRAINING TIP

**For your reception staff**, print this one-pager:

```
═══════════════════════════════════════════════════
   DAILY TASK: Link New Patient Signups
═══════════════════════════════════════════════════

1. Go to: /app/user
   → Look for today's signups
   → Note the email addresses

2. For each email:
   → Go to: /app/patient
   → Click "+ Add Patient"
   → Fill: Name, Gender, DOB, Mobile

3. IMPORTANT:
   → Scroll to "User" field
   → Type the signup email
   → Select from dropdown
   ⚠️ Without this, patient can't book!

4. Click "Save"

5. Done! Patient can now login and book.

═══════════════════════════════════════════════════
```

---

## 📞 SUPPORT

If you're stuck:

1. **Read the error message carefully**
2. **Check this guide's Troubleshooting section**
3. **Verify all checkboxes in Final Checklist**
4. **Test with a fresh incognito browser**
5. **Check ERPNext logs**: Click "Tools" → "Console"

---

## 🚀 YOU'RE READY!

Follow this guide step-by-step, and your patient self-signup system will work perfectly!

**Remember**: The key step is **Admin linking User to Patient** - without this, patients can't access healthcare features!

Good luck! 🎉
