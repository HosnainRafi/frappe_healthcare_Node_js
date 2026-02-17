# 🚀 PATIENT PORTAL - QUICK START

## Your System: http://147.93.153.249:8081/

---

## ✅ WHAT'S READY

You already have:

- ✅ Server script for auto-creating patients (from AUTO_PATIENT_CREATION_GUIDE.md)
- ✅ Beautiful patient signup page HTML (`patient-signup.html`)
- ✅ Full-featured patient portal HTML (`patient-portal.html`)

---

## 🎯 NEXT STEPS (10 minutes)

### 1. Upload Signup Page

```
Login → Ctrl+K → "Web Page" → "+ Add Web Page"

Title: Patient Signup
Route: patient-signup
Published: ☑

Paste content from: website-pages/patient-signup.html
Save ✓
```

**Test**: http://147.93.153.249:8081/patient-signup

---

### 2. Upload Portal Page

```
Login → Ctrl+K → "Web Page" → "+ Add Web Page"

Title: Patient Portal
Route: patient-portal
Published: ☑

Paste content from: website-pages/patient-portal.html
Save ✓
```

**Test**: http://147.93.153.249:8081/patient-portal

---

### 3. Set Patient Permissions

```
Ctrl+K → "Role Permission Manager"

DocType: Patient
Role: Patient
Permissions: ☑ Read, ☑ Write

DocType: Patient Appointment
Role: Patient
Permissions: ☑ Read, ☑ Write, ☑ Create

DocType: Patient Medical Record
Role: Patient
Permissions: ☑ Read
```

---

### 4. Configure Portal Settings

```
Ctrl+K → "Portal Settings"

Default Role: Patient

Add Menu Items:
- Dashboard → /patient-portal
- My Appointments → /app/patient-appointment
- Book Appointment → /app/patient-appointment/new
- Medical Records → /app/patient-medical-record
- My Profile → /app/patient
```

---

## 🧪 TEST IT!

### Test Flow (5 minutes):

1. **Open incognito browser**

2. **Signup**: http://147.93.153.249:8081/patient-signup

   ```
   Full Name: Test Patient
   Email: testpatient@example.com
   Mobile: +1234567890
   Password: test123
   ```

3. **Verify (as Admin)**:
   - User created: `/app/user`
   - Patient auto-created: `/app/patient`
   - User field linked: ✓

4. **Login as patient**: http://147.93.153.249:8081/login

   ```
   Email: testpatient@example.com
   Password: test123
   ```

5. **Should see**: http://147.93.153.249:8081/patient-portal
   - Welcome message with patient name
   - Statistics dashboard
   - Quick action buttons
   - Appointments section

6. **Book appointment**: Click "Book Appointment"
   - Patient field auto-fills ✓
   - Can select doctor and date ✓

---

## 📚 FULL DOCUMENTATION

For complete setup with screenshots and troubleshooting:

👉 **[PATIENT_SIGNUP_PORTAL_SETUP.md](docs/patient-portal/PATIENT_SIGNUP_PORTAL_SETUP.md)**

---

## 🎉 FEATURES

Your patients can now:

- ✅ **Self-register** with custom signup page
- ✅ **Auto-created** as Patient records
- ✅ **Login** to personalized portal
- ✅ **View dashboard** with stats and appointments
- ✅ **Book appointments** instantly
- ✅ **Access medical records**
- ✅ **Update profile** information
- ✅ **Mobile responsive** design

---

## 🔗 IMPORTANT LINKS

| Page            | URL                                            |
| --------------- | ---------------------------------------------- |
| Patient Signup  | http://147.93.153.249:8081/patient-signup      |
| Patient Login   | http://147.93.153.249:8081/login               |
| Patient Portal  | http://147.93.153.249:8081/patient-portal      |
| Admin Dashboard | http://147.93.153.249:8081/app                 |
| User List       | http://147.93.153.249:8081/app/user            |
| Patient List    | http://147.93.153.249:8081/app/patient         |
| Server Scripts  | http://147.93.153.249:8081/app/server-script   |
| Web Pages       | http://147.93.153.249:8081/app/web-page        |
| Portal Settings | http://147.93.153.249:8081/app/portal-settings |
| Error Log       | http://147.93.153.249:8081/app/error-log       |

---

## 🚨 TROUBLESHOOTING

### Signup page 404?

- Check Web Page is **Published** ✓
- Route should be: `patient-signup` (no slashes)
- Clear cache: `Ctrl+K → "Clear Cache"`

### Patient not auto-created?

- Check Server Script is **Enabled**
- Event should be: **Before Insert**
- Check Error Log: `/app/error-log`

### Can't access portal after login?

- Check Patient role permissions
- Verify patient-portal.html is uploaded
- Check browser console for errors

### Can't book appointments?

- Check Patient Appointment permissions
- Patient role needs: Read, Write, Create
- Verify patient record has User field linked

---

## 💡 CUSTOMIZATION

### Change Colors

Edit the pages and find:

```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

Replace with your brand colors!

### Add Logo

In portal header section:

```html
<img src="/files/your-logo.png" alt="Logo" style="height: 40px;" />
```

### Add More Features

See customization section in the full guide!

---

## ✨ YOU'RE SET!

Follow the 4 steps above and you'll have a complete patient self-service portal running in 10 minutes!

**Questions?** Check the full guide: `docs/patient-portal/PATIENT_SIGNUP_PORTAL_SETUP.md`
