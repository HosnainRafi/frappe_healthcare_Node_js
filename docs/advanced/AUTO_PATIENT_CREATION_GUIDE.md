# 🤖 AUTOMATIC PATIENT CREATION GUIDE

## Auto-Create Patient Records When Users Sign Up

**Website:** http://147.93.153.249:8081/

---

## 🎯 WHAT THIS DOES

Instead of manually creating Patient records for each signup, this **automates everything**:

```
❌ MANUAL WAY (Current):
Patient signs up → Admin creates Patient → Admin links User → Patient can book

✅ AUTOMATED WAY (After setup):
Patient signs up → Patient record AUTO-CREATED → Patient can book immediately!
```

**Setup time:** 10 minutes  
**Saves:** 2-3 minutes per patient (forever!)

---

## 📋 OPTION 1: SERVER SCRIPT (RECOMMENDED - No Coding Required!)

This is the **easiest method** - everything done through UI!

### Step 1: Enable Server Scripts

1. **Login as Administrator**:

   ```
   URL: http://147.93.153.249:8081/login
   Username: Administrator
   Password: admin
   ```

2. **Go to System Settings**:
   - Press `Ctrl+K` (search)
   - Type: `System Settings`
   - Click on **"System Settings"**
   - OR: `http://147.93.153.249:8081/app/system-settings`

3. **Find "Allow Server Scripts" - Location Guide**:

   When you open System Settings, you'll see many sections. The page structure is:

   ```
   ┌─ System Settings ─────────────────────┐
   │ General                                │
   │ Email                                  │
   │ Password                               │
   │ ⋮                                      │
   │ Permissions                            │
   │  • Apply Strict User Permissions       │
   │  • Allow Older Web View Links          │
   │ ⋮                                      │
   │ >>> Server Script <<<  👈 FIND THIS!  │
   │  • Allow Server Scripts □              │
   │ ⋮                                      │
   └────────────────────────────────────────┘
   ```

   **Scroll down** past the Permissions section to find it!

4. **Enable Server Scripts**:
   - Scroll down in System Settings (it's usually in the middle/lower part of the page)
   - Look for: **"Server Script"** section (NOT in Permissions section)
   - Find: **"Allow Server Scripts"** checkbox
   - ☑ **Check it**
   - Click **"Save"** (top right)

   **Note**: The Permissions section shows:
   - "Apply Strict User Permissions"
   - "Allow Older Web View Links"

   You need to scroll PAST that section to find "Server Script" section!

---

### Step 2: Create the Auto-Creation Script

1. **Go to Server Script List**:
   - Press `Ctrl+K`
   - Type: `Server Script`
   - Click **"Server Script"**
   - OR: `http://147.93.153.249:8081/app/server-script`

2. **Click "+ Add Server Script"** (top right)

3. **Fill the form**:

   ```
   ┌─────────────────────────────────────────────┐
   │ Server Script                               │
   ├─────────────────────────────────────────────┤
   │                                             │
   │ Script Name*: Auto Create Patient           │
   │                                             │
   │ Script Type*: DocType Event                 │
   │                                             │
   │ DocType*: User                              │
   │                                             │
   │ Event*: Before Insert                       │
   │                                             │
   │ ☑ Enabled                                   │
   │                                             │
   └─────────────────────────────────────────────┘
   ```

4. **Scroll down to "Script" field**

5. **Copy and paste this code**:

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

6. **Click "Save"** (top right)

7. **Verify**:
   - Status should show: **Enabled ✓**
   - Script Type: **DocType Event**
   - DocType: **User**
   - Event: **Before Insert**

---

### Step 3: Test the Automation

1. **Open an incognito/private browser window**

2. **Go to signup**:

   ```
   http://147.93.153.249:8081/signup
   ```

3. **Fill the form**:

   ```
   Full Name: Test Patient
   Email: testpatient@example.com
   Password: test123
   ```

4. **Click "Sign Up"**

5. **Now verify (as Admin)**:

   **Check User was created**:
   - Go to: `/app/user`
   - Search: testpatient@example.com
   - Should exist ✓

   **Check Patient was auto-created**:
   - Go to: `/app/patient`
   - Search: Test Patient OR testpatient@example.com
   - Should exist ✓
   - Open it → Check "User" field is linked ✓

6. **Test the patient can book**:
   - Login as: testpatient@example.com
   - Go to: `/app/patient-appointment/new`
   - Patient field should auto-fill with "Test Patient"
   - Should be able to select doctors and book ✓

---

## 🔧 OPTION 2: CUSTOM SCRIPT (Advanced - More Control)

If you need more customization, use a Server Script with advanced logic:

### Enhanced Script with More Features

```python
import frappe
from frappe import _
from frappe.utils import today, getdate
import re

def execute(doc, method=None):
    """
    Auto-create Patient record when User signs up
    Enhanced version with validation and more fields
    """

    # Skip system users
    if doc.name in ["Administrator", "Guest"]:
        return

    # Only process website signups
    user_roles = [d.role for d in doc.roles]
    if "Website User" not in user_roles:
        return

    # Check if Patient already exists
    if frappe.db.exists("Patient", {"user": doc.name}):
        frappe.logger().info(f"Patient already exists for User {doc.name}")
        return

    try:
        # Parse name
        full_name = doc.full_name or doc.name
        name_parts = full_name.split()
        first_name = name_parts[0] if name_parts else "Patient"
        last_name = " ".join(name_parts[1:]) if len(name_parts) > 1 else ""

        # Validate email
        email = doc.email
        if not email or not re.match(r"[^@]+@[^@]+\.[^@]+", email):
            frappe.logger().warning(f"Invalid email for User {doc.name}")
            return

        # Create Patient
        patient = frappe.get_doc({
            "doctype": "Patient",
            "first_name": first_name,
            "last_name": last_name,
            "patient_name": full_name,
            "email": email,
            "mobile": doc.mobile_no or doc.phone or "",
            "user": doc.name,
            "status": "Active",

            # Optional fields (customize as needed)
            "customer_group": "Individual",
            "territory": "All Territories",

            # Add default values if you want
            # "blood_group": "",
            # "gender": "",
            # "dob": "",
        })

        # Insert with system permissions
        patient.insert(ignore_permissions=True)

        # Commit the transaction
        frappe.db.commit()

        # Log success
        frappe.logger().info(f"✓ Auto-created Patient {patient.name} for User {doc.name}")

        # Optional: Send welcome notification
        # send_patient_welcome_email(patient, doc)

    except Exception as e:
        # Log error but don't block user creation
        frappe.logger().error(f"✗ Failed to auto-create Patient for {doc.name}: {str(e)}")
        frappe.log_error(message=str(e), title=f"Auto Patient Creation Failed - {doc.name}")


def send_patient_welcome_email(patient, user):
    """
    Optional: Send welcome email to new patient
    """
    try:
        frappe.sendmail(
            recipients=[user.email],
            subject="Welcome to Our Hospital",
            message=f"""
            <p>Dear {patient.patient_name},</p>

            <p>Welcome to our hospital! Your patient account has been created.</p>

            <p>You can now:</p>
            <ul>
                <li>Book appointments with our doctors</li>
                <li>View your medical records</li>
                <li>Access prescriptions</li>
                <li>Check billing information</li>
            </ul>

            <p>Login at: <a href="http://147.93.153.249:8081/login">http://147.93.153.249:8081/login</a></p>

            <p>Best regards,<br>Hospital Management Team</p>
            """
        )
    except Exception as e:
        frappe.logger().error(f"Failed to send welcome email: {str(e)}")
```

**To use this enhanced script**:

1. Follow Step 1 and Step 2 above
2. Use this code instead of the basic one
3. Customize the optional fields as needed

---

## 🎨 OPTION 3: ADD MORE PATIENT FIELDS AT SIGNUP

If you want to collect more information during signup (Gender, DOB, Phone), you need to create a **Custom Signup Form**.

### Step 1: Create Web Form

1. **Go to Web Form List**:
   - Search: `Web Form`
   - OR: `/app/web-form`

2. **Click "+ Add Web Form"**

3. **Configure**:

   ```
   Title: Patient Registration
   Route: patient-registration
   DocType: Patient
   Is Standard: ☐ (unchecked)
   Published: ☑
   Allow Edit: ☐
   Show Sidebar: ☐
   Login Required: ☐
   ```

4. **Add Fields** (drag from right panel):
   - First Name (required)
   - Last Name
   - Email (required)
   - Mobile (required)
   - Gender (required)
   - Date of Birth (required)
   - Blood Group
   - Address

5. **Add Submit Button Text**: "Register as Patient"

6. **Save**

7. **Your custom form is now at**:

   ```
   http://147.93.153.249:8081/patient-registration
   ```

8. **Update your website links** to point to this instead of `/signup`

---

## 🔄 WORKFLOW COMPARISON

### Before (Manual):

```
1. Patient → /signup (2 min)
2. Admin checks new users (1 min)
3. Admin creates Patient (2 min)
4. Admin links User (30 sec)
5. Patient can book (1 min)
───────────────────────────
TOTAL: ~6.5 minutes per patient
```

### After (Automated):

```
1. Patient → /signup (2 min)
2. System auto-creates Patient (< 1 sec)
3. Patient can book immediately (1 min)
───────────────────────────
TOTAL: ~3 minutes per patient
SAVES: 3.5 minutes per patient!
```

**For 100 patients/month**: Save ~6 hours of admin work!

---

## 🚨 TROUBLESHOOTING

### Issue 1: Script Not Running

**Check**:

1. System Settings → Scroll down to **"Server Script"** section → "Allow Server Scripts" is ☑ checked
   - (NOT in Permissions section - scroll past it!)
2. Server Script → Status is **Enabled**
3. Server Script → Event is **Before Insert** (not After Insert)
4. Check Error Log: `/app/error-log`

**Test**:

- Signup with a new unique email
- Check Error Log for any Python errors

---

### Issue 2: Patient Created But User Field Empty

**Problem**: Script creates Patient but doesn't link User

**Solution**: Update the script to include:

```python
"user": doc.name,  # This line links the User
```

Make sure this line is in your Patient creation code.

---

### Issue 3: Getting "Duplicate Entry" Error

**Problem**: Patient already exists with same email

**Solution**: Add duplicate check:

```python
# Check if Patient already exists
existing = frappe.db.exists("Patient", {"email": doc.email})
if existing:
    return  # Don't create duplicate
```

---

### Issue 4: Script Blocks User Creation

**Problem**: If Patient creation fails, User signup also fails

**Solution**: Wrap in try-except (already in code above):

```python
try:
    patient.insert()
except Exception as e:
    frappe.logger().error(str(e))
    pass  # Don't block user creation
```

---

### Issue 5: Patient Created But Missing Fields

**Problem**: Gender, DOB, Mobile not captured at signup

**Solution**:

- Option A: Ask patients to complete profile after signup
- Option B: Use Web Form (Option 3 above) instead of default signup
- Option C: Add custom fields to signup form (requires code change)

---

## 🎯 RECOMMENDED SETUP

For best results, use this combination:

1. **Enable Auto-Creation** (Option 1 - Server Script)
2. **Keep Standard Signup** for simplicity
3. **Add Profile Completion Step** after first login

### Add Profile Completion Prompt

Create a simple message on patient dashboard:

1. Create a custom page: `/app/website-pages/new`
2. Route: `complete-profile`
3. Content:
   ```html
   <div class="alert alert-warning">
     <h4>Complete Your Profile</h4>
     <p>Please add the following information for better service:</p>
     <ul>
       <li>Date of Birth</li>
       <li>Gender</li>
       <li>Mobile Number</li>
       <li>Blood Group</li>
     </ul>
     <a href="/app/patient" class="btn btn-primary">Update Profile</a>
   </div>
   ```

---

## ✅ FINAL CHECKLIST

Setup:

- [ ] System Settings → "Allow Server Scripts" → ☑ Enabled
- [ ] Created Server Script for auto Patient creation
- [ ] Script Status: **Enabled**
- [ ] Script Event: **Before Insert**
- [ ] Script DocType: **User**

Testing:

- [ ] Tested signup with new email
- [ ] Verified User created in `/app/user`
- [ ] Verified Patient auto-created in `/app/patient`
- [ ] Verified Patient has "User" field linked
- [ ] Tested patient can login
- [ ] Tested patient can book appointment

Verification:

- [ ] No errors in Error Log (`/app/error-log`)
- [ ] Patient status is "Active"
- [ ] Email field is populated
- [ ] Patient name matches User name

---

## 📊 MONITORING

### Check Script Performance

1. **View Error Logs**:

   ```
   /app/error-log
   Filter: Auto Patient Creation
   ```

2. **Check Success**:

   ```
   Go to: /app/patient
   Sort by: Created (newest first)
   Verify: Recent patients have "User" field filled
   ```

3. **Monitor Daily**:
   - Count signups: `/app/user` (filter by today)
   - Count auto-created patients: `/app/patient` (filter by today)
   - Numbers should match!

---

## 🚀 BENEFITS

✅ **No manual admin work** - Patients auto-created  
✅ **Instant access** - Patients can book immediately  
✅ **Zero errors** - No forgetting to link User  
✅ **Scalable** - Works for 10 or 10,000 signups  
✅ **Customizable** - Easy to modify the script

---

## 💡 ADVANCED CUSTOMIZATION

### Add Custom Fields at Creation

If you added custom fields to Patient doctype:

```python
patient = frappe.get_doc({
    "doctype": "Patient",
    "first_name": first_name,
    # ... standard fields ...

    # Add your custom fields here:
    "custom_referred_by": "Website",
    "custom_patient_source": "Self Registration",
    "custom_registration_date": today(),
    "custom_assigned_to": "Dr. Default",
})
```

### Auto-Assign to Department

```python
# Get the first available department
default_dept = frappe.db.get_value("Medical Department",
                                   {"disabled": 0},
                                   "name")
if default_dept:
    patient.update({"custom_default_department": default_dept})
```

### Send SMS Notification

```python
# After patient creation
if patient.mobile:
    frappe.sendmail(
        recipients=[patient.mobile],
        message=f"Welcome {patient.patient_name}! Your patient ID is {patient.name}",
        communication_medium="SMS"
    )
```

---

## 📞 NEED HELP?

1. Check Error Log: `/app/error-log`
2. Test with fresh email
3. Verify script is Enabled
4. Check System Settings → **"Server Script"** section (scroll past Permissions) → "Allow Server Scripts" is checked
5. Review script code for typos

---

## 🎉 YOU'RE DONE!

With automatic Patient creation, your signup flow is now truly automated!

**Patient experience**:

1. Signs up (2 minutes)
2. Logs in (30 seconds)
3. Books appointment (1 minute)
4. Done! ✓

No waiting for admin approval! 🚀
