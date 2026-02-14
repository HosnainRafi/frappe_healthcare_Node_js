# 🔐 Patient Signup & Registration Guide

## Step-by-Step Instructions

**Website:** http://147.93.153.249:8081/

---

## ⚙️ STEP 1: Enable Patient Signup (Admin Must Do This First!)

### 1.1 Enable Website Signups

1. **Login as Administrator**:
   - Go to: `http://147.93.153.249:8081/login`
   - Username: `Administrator`
   - Password: `admin`

2. **Go to Website Settings**:
   - Search "Website Settings" in the search bar (top)
   - OR go directly to: `http://147.93.153.249:8081/app/website-settings`

3. **Enable Sign Ups**:
   Scroll down to find **Sign Up** section and configure:

   ```
   ☑ Allow Sign Ups (CHECK THIS BOX!)
   Sign Up Role: Website User (default - leave as is)
   ```

4. **Click Save**

### 1.2 Enable Healthcare Patient Portal

1. **Go to Healthcare Settings**:
   - Search "Healthcare Settings"
   - OR: `http://147.93.153.249:8081/app/healthcare-settings`

2. **Enable Patient Features**:
   Scroll down and check these boxes:

   ```
   ☑ Patient Master Created
   ☑ Manage Customer and Patient Relations
   ☑ Link Customer to Patient
   ```

3. **Click Save**

### 1.3 Configure Portal Settings

1. **Still in Healthcare Settings**, find **Portal Settings** section
2. Enable:

   ```
   ☑ Enable Patient Portal (if available)
   ```

3. **Go to Portal Settings** (separate page):
   - Search "Portal Settings"
   - OR: `http://147.93.153.249:8081/app/portal-settings`

4. Make sure **Patient** is in the **Default Role** list

5. **Click Save**

---

## 👤 STEP 2: How Patient Signs Up

### Method 1: From Your Website

1. **Go to your website**: `http://147.93.153.249:8081/home`

2. **Click "Login"** (top right) or **"Book Appointment"**

3. **You'll see the login page**: `http://147.93.153.249:8081/login`

4. **Click "Sign Up"** link at the bottom:
   - Look for text like: "Don't have an account? Sign Up"
   - OR click the "Sign Up" tab if it exists

5. **Fill the Signup Form**:

   ```
   Full Name: John Smith
   Email: patient@example.com
   Password: YourStrongPassword123!
   ```

6. **Click "Sign Up" button**

7. **Check for success message** or email verification

### Method 2: Direct Signup URL

Go directly to: `http://147.93.153.249:8081/signup`

---

## 🔍 STEP 3: What to Do After Signup

### Scenario A: Signup Successful

After clicking "Sign Up", you should see:

- ✅ "Your account has been created"
- OR "Please check your email to verify"

**Next Step**: Login manually

1. Go to: `http://147.93.153.249:8081/login`
2. Enter your email and password
3. Click **Login**

### Scenario B: Error Messages

#### Error: "Allow Sign Ups is disabled"

**Solution**: Admin must enable it in Website Settings (see Step 1.1)

#### Error: "Email already exists"

**Solution**: This email is already registered. Use "Forgot Password" to reset.

#### Error: "Access Denied" after signup

**Solution**: User was created but needs Patient record (see Step 4)

---

## 🏥 STEP 4: Link User to Patient Record (Admin Task)

After a user signs up, they exist as a **User** but NOT yet as a **Patient**. Admin must link them:

### Option A: Automatic (If Configured)

If Healthcare module is properly configured, when the user first logs in, they might see:

- A prompt: "Complete your patient registration"
- Form asking for: DOB, Gender, Phone, Address
- User fills and submits → Patient record created automatically

### Option B: Manual (Admin Creates Patient)

If automatic doesn't work, admin must manually create the patient:

1. **Admin logs in**

2. **Go to Patient List**:
   - Search "Patient"
   - OR: `http://147.93.153.249:8081/app/patient`

3. **Click "+ Add Patient"**

4. **Fill Patient Form**:

   ```
   Patient Name: John Smith (or auto-generated ID)
   First Name: John
   Last Name: Smith
   Gender: Male
   Date of Birth: 1990-01-01
   Mobile: +880XXXXXXXXXX
   Email: patient@example.com (SAME as signup email!)

   MOST IMPORTANT:
   User: patient@example.com (Select from dropdown or type)
   ```

5. **Click Save**

6. **Now the user can book appointments!**

---

## ✅ STEP 5: Verify Patient Can Book Appointment

1. **Patient logs in**: `http://147.93.153.249:8081/login`

2. **Go to Book Appointment**: `http://147.93.153.249:8081/appointment`

3. **Click "Proceed to Booking System"**

4. **You should see the form**:
   - If you see the form → Success! ✅
   - If you see "Permission Denied" → Patient record not linked (do Step 4)

5. **Try booking**:
   - Select Practitioner (doctor)
   - Select Date
   - Select Time
   - Click Save

6. **Check "My Appointments"**: `http://147.93.153.249:8081/app/patient-appointment`

---

## 🚨 Troubleshooting Common Issues

### Issue 1: "Can't find Sign Up link"

**Check**:

1. Is "Allow Sign Ups" enabled in Website Settings?
2. Try going directly to: `http://147.93.153.249:8081/signup`

**If signup page doesn't exist**:
The signup feature might not be enabled. Admin must:

- Go to Website Settings
- Check ☑ "Allow Sign Ups"
- Save

### Issue 2: "After signup, redirected to blank page"

**Solution**:
This is normal. Manually go to: `http://147.93.153.249:8081/login` and login.

### Issue 3: "After login, can't access /app/patient-appointment"

**Cause**: User exists but Patient record doesn't exist or isn't linked

**Solution** (Admin):

1. Go to: `/app/patient`
2. Create new Patient
3. Link User field to the user's email
4. Save

### Issue 4: "Sign Up button creates user but shows error"

**Check** (Admin):

1. Go to: `/app/user` and find the newly created user
2. Check their roles - should have "Website User" at minimum
3. Create Patient record for them (see Step 4)

### Issue 5: "Email verification required but no email received"

**Cause**: Email not configured in ERPNext

**Solution**:

- Either: Configure email (complex)
- Or: Admin can activate the user manually:
  1. Go to `/app/user/[user-email]`
  2. Uncheck "Send Welcome Email"
  3. Check "Enabled"
  4. Save

### Issue 6: "Access Denied" after login

**Cause**: User doesn't have proper permissions

**Solution** (Admin):

1. Go to user: `/app/user/[user-email]`
2. Add roles:
   ```
   ☑ Patient (if available)
   ☑ Website User
   ```
3. Create Patient record linking this user
4. Save

---

## 🎯 Quick Checklist for Admin

Before patients can signup:

- [ ] Website Settings → "Allow Sign Ups" → ☑ Enabled
- [ ] Healthcare Settings → All patient options → ☑ Enabled
- [ ] At least 1 Healthcare Practitioner exists
- [ ] At least 1 Practitioner Schedule exists
- [ ] At least 1 Medical Department exists
- [ ] Tested signup URL works: `/signup`

After patient signs up:

- [ ] Check user exists: `/app/user`
- [ ] Create Patient record: `/app/patient/new`
- [ ] Link User field to their email
- [ ] Patient can login
- [ ] Patient can access `/app/patient-appointment/new`
- [ ] Patient can book appointment

---

## 📱 Testing the Complete Flow

### Test as Admin:

1. Enable all settings (Step 1)
2. Open incognito/private browser
3. Go to: `http://147.93.153.249:8081/signup`
4. Create test account: `testpatient@test.com`
5. Check if signup succeeds
6. Close incognito
7. Login as admin
8. Create Patient record for `testpatient@test.com`
9. Link User field
10. Save

### Test as Patient:

1. Open new incognito window
2. Login: `testpatient@test.com`
3. Go to: `/appointment`
4. Click "Proceed to Booking System"
5. Should see booking form
6. Select doctor, date, time
7. Save
8. Check "My Appointments"

---

## 🔗 Important URLs

| Purpose                        | URL                                                      |
| ------------------------------ | -------------------------------------------------------- |
| **Signup**                     | `http://147.93.153.249:8081/signup`                      |
| **Login**                      | `http://147.93.153.249:8081/login`                       |
| **Book Appointment**           | `http://147.93.153.249:8081/app/patient-appointment/new` |
| **My Appointments**            | `http://147.93.153.249:8081/app/patient-appointment`     |
| **My Profile**                 | `http://147.93.153.249:8081/app/patient`                 |
| **Admin: User List**           | `http://147.93.153.249:8081/app/user`                    |
| **Admin: Patient List**        | `http://147.93.153.249:8081/app/patient`                 |
| **Admin: Website Settings**    | `http://147.93.153.249:8081/app/website-settings`        |
| **Admin: Healthcare Settings** | `http://147.93.153.249:8081/app/healthcare-settings`     |

---

## 💡 Pro Tips

1. **Always test in incognito** to see what patients see
2. **Create a test patient account** before going live
3. **Keep a list** of patients who signup so you can create their records
4. **Consider auto-creating Patient records** with custom script (advanced)
5. **Document your signup process** for staff training

---

## 🎉 Success Indicators

You know it's working when:

- ✅ Signup page is accessible
- ✅ New users can register
- ✅ Users appear in User list (`/app/user`)
- ✅ Admin can create Patient records
- ✅ Patients can login
- ✅ Patients can book appointments
- ✅ Appointments appear in the system
- ✅ Doctors see the appointments

---

**If you're still stuck, provide these details:**

1. What happens when you go to: `http://147.93.153.249:8081/signup`?
2. Do you see a signup form or an error?
3. After filling the form, what message do you get?
4. Can you see "Allow Sign Ups" checkbox in Website Settings?

**Screenshot these for troubleshooting:**

- The signup page (or error you see)
- Website Settings → Sign Up section
- Healthcare Settings page
