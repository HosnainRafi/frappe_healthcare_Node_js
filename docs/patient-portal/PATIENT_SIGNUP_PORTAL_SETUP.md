# 🚀 PATIENT SIGNUP & PORTAL - COMPLETE SETUP GUIDE

## System URL: http://147.93.153.249:8081/

This guide will help you set up a complete patient self-registration system with a custom portal.

---

## 📦 WHAT YOU GET

✅ **Patient Signup Page** - Beautiful custom registration form  
✅ **Auto Patient Creation** - Automatic patient record creation on signup  
✅ **Patient Portal** - Personalized dashboard after login  
✅ **Appointment Booking** - Direct access to book appointments  
✅ **Medical Records** - View health records and history

---

## 🎯 STEP-BY-STEP SETUP

### STEP 1: Enable Server Scripts (Already Done ✓)

You already added the server script for auto-creating patients. Let's verify it's working:

1. **Login as Administrator**:

   ```
   URL: http://147.93.153.249:8081/login
   Username: Administrator
   Password: admin
   ```

2. **Check Server Script**:
   - Press `Ctrl+K` → type "Server Script"
   - Verify you have: **"Auto Create Patient"**
   - Status should be: **Enabled ✓**
   - Event: **Before Insert**
   - DocType: **User**

If not set up, follow the [AUTO_PATIENT_CREATION_GUIDE.md](./AUTO_PATIENT_CREATION_GUIDE.md)

---

### STEP 2: Upload Signup Page to Frappe

Now let's create the custom signup page in Frappe:

#### Option A: Create as Web Page (Recommended)

1. **Go to Web Page List**:

   ```
   Press Ctrl+K → type "Web Page" → Click "Web Page"
   OR navigate to: http://147.93.153.249:8081/app/web-page
   ```

2. **Click "+ Add Web Page"**

3. **Fill the form**:

   ```
   Title: Patient Signup
   Route: patient-signup
   Published: ☑ (checked)
   ```

4. **Scroll down to "Main Section" or "HTML" field**

5. **Copy the content from**:

   ```
   website-pages/patient-signup.html
   ```

   Open the file and copy the ENTIRE content (from `<!DOCTYPE html>` to `</html>`)

6. **Paste into the "HTML" field**

7. **Click "Save"**

8. **Your signup page is now live at**:
   ```
   http://147.93.153.249:8081/patient-signup
   ```

#### Option B: Create as Custom HTML Page

1. **Go to your Frappe apps directory** (via SSH/terminal):

   ```bash
   cd ~/frappe-bench/apps/erpnext/erpnext/www
   ```

2. **Create the file**:

   ```bash
   nano patient-signup.html
   ```

3. **Paste the content from** `website-pages/patient-signup.html`

4. **Save and restart**:

   ```bash
   bench restart
   ```

5. **Access at**: `http://147.93.153.249:8081/patient-signup`

---

### STEP 3: Upload Patient Portal Page

Create the patient dashboard:

1. **Go to Web Page List**:

   ```
   Ctrl+K → "Web Page" → "+ Add Web Page"
   ```

2. **Fill the form**:

   ```
   Title: Patient Portal
   Route: patient-portal
   Published: ☑ (checked)
   ```

3. **Copy content from**:

   ```
   website-pages/patient-portal.html
   ```

4. **Paste into "HTML" field**

5. **Click "Save"**

6. **Portal is now at**:
   ```
   http://147.93.153.249:8081/patient-portal
   ```

---

### STEP 4: Configure Patient Permissions

Ensure patients can access their data:

1. **Go to Role Permission Manager**:

   ```
   Ctrl+K → "Role Permission Manager"
   OR: http://147.93.153.249:8081/app/permission-manager
   ```

2. **Select DocType**: `Patient`

3. **Find or Add Role**: `Patient`

4. **Set Permissions**:

   ```
   ☑ Read (Level 0)
   ☑ Write (Level 0) - optional, if you want patients to edit their profile
   ```

5. **Add User Permissions Rule**:
   - Click **"Set User Permissions"** button
   - Create rule: Patient can only see their own record

   ```
   DocType: Patient
   Condition: user == frappe.session.user
   ```

6. **Configure Patient Appointment Permissions**:
   - Select DocType: `Patient Appointment`
   - Role: `Patient`
   - Permissions:
     ```
     ☑ Read
     ☑ Write
     ☑ Create
     ```

7. **Configure Medical Record Permissions**:
   - Select DocType: `Patient Medical Record`
   - Role: `Patient`
   - Permissions:
     ```
     ☑ Read
     ```

8. **Click "Update"**

---

### STEP 5: Configure Portal Settings

Set up the portal configuration:

1. **Go to Portal Settings**:

   ```
   Ctrl+K → "Portal Settings"
   OR: http://147.93.153.249:8081/app/portal-settings
   ```

2. **Configure Default Portal Role**:

   ```
   Default Role: Patient
   ```

3. **Add Portal Menu Items**:
   Click **"Add Row"** for each menu item:

   ```
   Title: Dashboard
   Route: /patient-portal
   Enabled: ☑

   Title: My Appointments
   Route: /app/patient-appointment
   Enabled: ☑

   Title: Book Appointment
   Route: /app/patient-appointment/new
   Enabled: ☑

   Title: Medical Records
   Route: /app/patient-medical-record
   Enabled: ☑

   Title: My Profile
   Route: /app/patient
   Enabled: ☑
   ```

4. **Set Default Home Page** (optional):
   - Scroll to **"Default Home Page"** or **"Home Page"**
   - Set to: `/patient-portal`

5. **Click "Save"**

---

### STEP 6: Configure User Settings (Auto-assign Patient Role)

Make sure new users automatically get the Patient role:

1. **Go to Role Profile**:

   ```
   Ctrl+K → "Role Profile" → "+ Add Role Profile"
   ```

2. **Create Patient Role Profile**:

   ```
   Role Profile Name: Patient Portal Access

   Roles:
   ☑ Patient
   ☑ Website User
   ```

3. **Save**

4. **Update Signup Settings** (if available):
   - Go to Website Settings: `Ctrl+K → "Website Settings"`
   - Look for **"Default Role on Signup"** or similar
   - Set to: `Patient` or `Website User`

---

### STEP 7: Update Server Script (Add Role Assignment)

Update your existing server script to assign the Patient role:

1. **Go to Server Script**:

   ```
   Ctrl+K → "Server Script" → "Auto Create Patient"
   ```

2. **Update the script** to include role assignment:

```python
# Auto-create Patient when User signs up
import frappe
from frappe import _

def execute(doc, method=None):
    # Only run for new website users (not staff/admin)
    if doc.name == "Administrator" or doc.name == "Guest":
        return

    # Check if user has the role that indicates a patient signup
    user_roles = [d.role for d in doc.roles]

    # Ensure Patient role is assigned
    if "Patient" not in user_roles and "Website User" in user_roles:
        doc.append("roles", {
            "role": "Patient"
        })

    if "Website User" in user_roles or "Patient" in user_roles:
        # Check if Patient already exists for this user
        existing_patient = frappe.db.exists("Patient", {"user": doc.name})

        if not existing_patient:
            try:
                # Create new Patient
                patient = frappe.get_doc({
                    "doctype": "Patient",
                    "first_name": doc.first_name or doc.full_name.split()[0] if doc.full_name else "Patient",
                    "last_name": doc.last_name or " ".join(doc.full_name.split()[1:]) if doc.full_name and len(doc.full_name.split()) > 1 else "",
                    "patient_name": doc.full_name or doc.name,
                    "email": doc.email,
                    "mobile": doc.mobile_no or "",
                    "user": doc.name,
                    "status": "Active",
                    "customer_group": "Individual"
                })

                # Insert the patient record
                patient.insert(ignore_permissions=True)
                frappe.db.commit()

                frappe.logger().info(f"Auto-created Patient {patient.name} for User {doc.name}")

            except Exception as e:
                frappe.logger().error(f"Failed to auto-create Patient for User {doc.name}: {str(e)}")
                # Don't block user creation if patient creation fails
                pass
```

3. **Click "Save"**

---

### STEP 8: Update Website Homepage (Optional)

Add a link to the signup page on your website:

1. **Edit your homepage** (`home.html` or `home-dynamic.html`)

2. **Add a signup/register button** in the navigation or hero section:

```html
<a href="/patient-signup" class="btn btn-primary">Register as Patient</a>
```

Or update your navigation menu to include:

```html
<nav>
  <a href="/home">Home</a>
  <a href="/doctors">Doctors</a>
  <a href="/services">Services</a>
  <a href="/patient-signup">Patient Registration</a>
  <a href="/login">Login</a>
</nav>
```

---

## 🧪 TESTING THE COMPLETE FLOW

### Test 1: Patient Signup

1. **Open incognito/private browser window**

2. **Go to signup page**:

   ```
   http://147.93.153.249:8081/patient-signup
   ```

3. **Fill the form**:

   ```
   Full Name: John Doe
   Email: johndoe@example.com
   Mobile: +1234567890
   Gender: Male
   Date of Birth: 1990-01-01
   Password: test123456
   Confirm Password: test123456
   ```

4. **Click "Create Account"**

5. **Expected result**:
   - ✓ Success message appears
   - ✓ Redirects to login page

---

### Test 2: Verify Patient Creation

1. **Login as Administrator**

2. **Check User was created**:

   ```
   Go to: http://147.93.153.249:8081/app/user
   Search: johndoe@example.com
   Status: Should exist ✓
   Roles: Should have "Patient" role ✓
   ```

3. **Check Patient was auto-created**:
   ```
   Go to: http://147.93.153.249:8081/app/patient
   Search: John Doe OR johndoe@example.com
   Should exist ✓
   Open record → User field should be linked ✓
   Status should be: Active ✓
   ```

---

### Test 3: Patient Login & Portal Access

1. **Open new incognito window**

2. **Login as the patient**:

   ```
   URL: http://147.93.153.249:8081/login
   Email: johndoe@example.com
   Password: test123456
   ```

3. **After login, should redirect to**:

   ```
   http://147.93.153.249:8081/patient-portal
   ```

4. **Verify portal displays**:
   - ✓ Patient name in header
   - ✓ Welcome banner with patient name
   - ✓ Statistics cards (0 appointments initially)
   - ✓ Quick action cards (Book Appointment, etc.)
   - ✓ Appointments section

---

### Test 4: Book Appointment

1. **While logged in as patient, click**:

   ```
   "Book Appointment" card
   ```

2. **Should open**:

   ```
   http://147.93.153.249:8081/app/patient-appointment/new
   ```

3. **Fill appointment form**:

   ```
   Patient: Should auto-fill with "John Doe" ✓
   Practitioner: Select a doctor
   Date: Select future date
   Time: Select time slot
   ```

4. **Click "Save"**

5. **Go back to portal**:

   ```
   http://147.93.153.249:8081/patient-portal
   ```

6. **Verify appointment appears**:
   - ✓ Statistics updated (1 upcoming appointment)
   - ✓ Appointment card displayed with details

---

## 🔧 CUSTOMIZATION OPTIONS

### Change Portal Colors

Edit `patient-portal.html`, find the style section:

```css
/* Change primary color */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

/* Change to your brand colors */
background: linear-gradient(135deg, #YOUR_COLOR_1 0%, #YOUR_COLOR_2 100%);
```

### Add Hospital Logo

Add to the header in `patient-portal.html`:

```html
<div class="header-content">
  <img src="/files/your-logo.png" alt="Hospital Logo" style="height: 40px;" />
  <h1>🏥 Patient Portal</h1>
  ...
</div>
```

### Add More Quick Actions

In `patient-portal.html`, add to the `.quick-actions` section:

```html
<a href="/your-custom-route" class="action-card">
  <span class="icon">🩺</span>
  <h3>Lab Reports</h3>
  <p>View your test results</p>
</a>
```

### Customize Signup Fields

Edit `patient-signup.html` to add/remove fields:

```html
<!-- Add Blood Group field -->
<div class="form-group">
  <label for="bloodGroup">Blood Group</label>
  <select id="bloodGroup" name="bloodGroup">
    <option value="">Select Blood Group</option>
    <option value="A+">A+</option>
    <option value="A-">A-</option>
    <option value="B+">B+</option>
    <option value="B-">B-</option>
    <option value="O+">O+</option>
    <option value="O-">O-</option>
    <option value="AB+">AB+</option>
    <option value="AB-">AB-</option>
  </select>
</div>
```

---

## 🚨 TROUBLESHOOTING

### Issue 1: Signup page not accessible

**Problem**: Getting 404 on `/patient-signup`

**Solution**:

1. Check Web Page is **Published** ✓
2. Check route is exactly: `patient-signup` (no slashes)
3. Clear cache: `Ctrl+K → "Clear Cache" → "Clear Cache"`
4. Try: `bench clear-cache` in terminal

---

### Issue 2: Patient not auto-created

**Problem**: User created but Patient record missing

**Solution**:

1. Check Server Script is **Enabled**
2. Check Error Log: `/app/error-log`
3. Verify script Event is **Before Insert** (not After Insert)
4. Check user has "Website User" or "Patient" role

---

### Issue 3: Portal shows "Guest" or redirects to login

**Problem**: After login, redirected back to login

**Solution**:

1. Check session is valid (logout and login again)
2. Check the patient-portal.html is fetching user correctly
3. Check browser console for CORS errors
4. Verify API endpoint is accessible: `/api/method/frappe.auth.get_logged_user`

---

### Issue 4: Can't book appointments

**Problem**: Permission denied when creating appointment

**Solution**:

1. Check Patient role has permissions for "Patient Appointment"
2. Go to: Role Permission Manager → Patient Appointment
3. Ensure Patient role has: Read, Write, Create ✓
4. Check User Permissions are not blocking

---

### Issue 5: Appointments not showing in portal

**Problem**: Portal loads but no appointments displayed

**Solution**:

1. Check browser console for JavaScript errors
2. Verify API call returns data: `/api/resource/Patient%20Appointment`
3. Check Patient has appointments linked
4. Check date format matches your system

---

## 📊 MONITORING & MAINTENANCE

### Daily Checks

1. **Monitor Signups**:

   ```
   /app/user
   Filter: Created = Today
   ```

2. **Verify Patient Creation**:

   ```
   /app/patient
   Filter: Created = Today
   Count should match new users ✓
   ```

3. **Check Error Log**:
   ```
   /app/error-log
   Filter: Auto Patient Creation
   Should be empty ✓
   ```

### Weekly Reports

Create a saved filter in Patient list:

```
Name: New Patients This Week
Filters:
  Created: Last 7 days
  Status: Active
```

### Performance Tips

1. **Enable caching** for Web Pages
2. **Optimize images** in portal pages
3. **Minify CSS/JS** for faster loading
4. **Use CDN** for static assets (if available)

---

## 🎉 SUCCESS CHECKLIST

Setup Complete:

- [ ] Server Scripts enabled in System Settings
- [ ] Auto Create Patient script is Enabled
- [ ] Signup page accessible at `/patient-signup`
- [ ] Patient portal accessible at `/patient-portal`
- [ ] Patient role has correct permissions
- [ ] Portal settings configured
- [ ] Homepage updated with signup link

Testing Complete:

- [ ] New patient can signup
- [ ] Patient record auto-created
- [ ] Patient can login
- [ ] Portal displays correctly
- [ ] Patient can book appointments
- [ ] Appointments show in portal
- [ ] Patient can view medical records

Production Ready:

- [ ] Tested with 5+ test patients
- [ ] No errors in Error Log
- [ ] Portal loads in < 3 seconds
- [ ] Mobile responsive verified
- [ ] Email notifications working (if configured)

---

## 🚀 GO LIVE!

Your patient self-service portal is ready!

**Share these links with patients**:

📝 **Registration**: `http://147.93.153.249:8081/patient-signup`  
🔐 **Login**: `http://147.93.153.249:8081/login`  
🏠 **Portal**: `http://147.93.153.249:8081/patient-portal`

---

## 📞 SUPPORT

If you encounter issues:

1. Check this guide's troubleshooting section
2. Check Frappe Error Log: `/app/error-log`
3. Check browser console for JavaScript errors
4. Review server script execution logs

---

## 🎯 NEXT STEPS

Consider adding:

- 📧 **Email Verification** for new signups
- 📱 **SMS Notifications** for appointments
- 💳 **Online Payment** for appointments
- 📄 **PDF Reports** download
- 🔔 **Push Notifications** for appointment reminders
- 📊 **Patient Health Dashboard** with charts
- 💬 **Chat with Doctor** feature
- 🎥 **Video Consultation** integration

---

## ✨ YOU'RE ALL SET!

Patients can now:

1. ✅ Self-register in 2 minutes
2. ✅ Auto-created as patients
3. ✅ Login to their portal
4. ✅ Book appointments immediately
5. ✅ View their medical records
6. ✅ Manage their profile

**No admin intervention required!** 🎉
