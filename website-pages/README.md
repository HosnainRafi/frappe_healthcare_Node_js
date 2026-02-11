# Hemayetpur Central Hospital - ERPNext Website Pages

This folder contains HTML templates for the hospital website that can be added to ERPNext Web Pages.

## Pages Created

| File               | Route in ERPNext | Description                                  |
| ------------------ | ---------------- | -------------------------------------------- |
| `home.html`        | `home`           | Homepage with hero, doctors, services, stats |
| `about.html`       | `about-us`       | About page with history, mission, vision     |
| `doctors.html`     | `our-doctors`    | Full doctors list with filter by department  |
| `services.html`    | `our-services`   | All medical services and departments         |
| `appointment.html` | `appointment`    | Appointment booking form with contact info   |

## How to Add Pages to ERPNext

### Step 1: Access ERPNext Web Page

1. Login to ERPNext at `http://147.93.153.249:8081`
2. Go to **Website > Web Page** (`/app/web-page`)
3. Click **+ Add Web Page**

### Step 2: Create Each Page

For each HTML file:

1. **Title**: Enter page title (e.g., "Home", "About Us")
2. **Route**: Enter route name (e.g., "home", "about-us")
3. **Content Type**: Select **HTML**
4. **Main Section**: Copy-paste the entire HTML content
5. Click **Save**
6. Check **Published** checkbox
7. Click **Save** again

### Step 3: Set Homepage

1. Go to **Settings > Website Settings** (`/app/website-settings`)
2. Set **Home Page** to: `home`
3. Save

### Step 4: Configure Navbar

1. In Website Settings, scroll to **Top Bar Items**
2. Add navigation items:
   - Home → `/home`
   - About Us → `/about-us`
   - Our Doctors → `/our-doctors`
   - Our Services → `/our-services`
   - Appointment → `/appointment`

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
