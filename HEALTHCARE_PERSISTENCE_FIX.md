# Healthcare Module Persistence Issue - Root Cause Analysis & Solution

## Problem Description

The Healthcare module keeps getting deleted/removed after Docker container restarts. After running `docker compose restart` or `docker compose up -d`, the Healthcare app disappears and you see:
- "Module Healthcare not found"
- "The resource you are looking for is not available"

---

## Root Cause Analysis

### Issue #1: The Configurator Overwrites apps.txt

In `docker-compose.yml`, the **configurator** service runs this command on every startup:

```bash
ls -1 apps > sites/apps.txt;
```

This command:
1. Lists all apps in the container's `/home/frappe/frappe-bench/apps` directory
2. **Overwrites** `sites/apps.txt` with that list

Since the official `frappe/erpnext:v15` Docker image only contains `frappe` and `erpnext`, the apps.txt file gets reset to just those two apps - **removing Healthcare**.

### Issue #2: The Apps Folder is Not Persisted

Looking at the volumes configuration:

```yaml
volumes:
  - sites:/home/frappe/frappe-bench/sites
  - logs:/home/frappe/frappe-bench/logs
```

Only `sites` and `logs` are mounted as Docker volumes. The `apps` folder is **NOT** persisted. This means:

1. When you run `bench get-app healthcare`, it downloads Healthcare to `/home/frappe/frappe-bench/apps/healthcare`
2. This is stored **inside the container**, not in a persistent volume
3. When the container restarts, it starts fresh from the `frappe/erpnext:v15` image
4. The Healthcare app files are **lost**
5. The configurator runs and overwrites apps.txt with only `frappe` and `erpnext`

### The Chain of Events

```
Container Restart
        ↓
Container starts fresh from frappe/erpnext:v15 image
        ↓
apps folder only contains: frappe, erpnext (no healthcare)
        ↓
Configurator runs: ls -1 apps > sites/apps.txt
        ↓
apps.txt now contains only: frappe, erpnext
        ↓
Healthcare is gone! ❌
```

---

## Solutions

### Solution 1: Add Apps Volume (Recommended)

Add a persistent volume for the `apps` folder to preserve installed apps across restarts.

**Changes to docker-compose.yml:**

1. Add `apps` volume to all services that need it:
```yaml
volumes:
  - sites:/home/frappe/frappe-bench/sites
  - logs:/home/frappe/frappe-bench/logs
  - apps:/home/frappe/frappe-bench/apps  # ADD THIS LINE
```

2. Add to volumes section:
```yaml
volumes:
  db-data:
  redis-cache-data:
  redis-queue-data:
  redis-socketio-data:
  sites:
  logs:
  apps:  # ADD THIS LINE
```

3. Modify the configurator command to not overwrite apps.txt:
```yaml
command:
  - >
    if [ ! -f sites/apps.txt ]; then ls -1 apps > sites/apps.txt; fi;
    bench set-config -g db_host $$DB_HOST;
    ...
```

### Solution 2: Build Custom Docker Image

Build a custom Docker image that includes Healthcare pre-installed:

```dockerfile
FROM frappe/erpnext:v15

RUN bench get-app healthcare --branch version-15 \
    && echo "healthcare" >> sites/apps.txt
```

### Solution 3: Use install-healthcare.bat After Every Restart

Create a batch script that reinstalls Healthcare after restart (temporary workaround).

---

## Applied Fix

The `docker-compose.yml` has been updated with:

1. **Apps volume** - Persists the apps folder across restarts
2. **Modified configurator** - Only creates apps.txt if it doesn't exist
3. **Healthcare auto-install** - The create-site service now installs Healthcare automatically

---

## Commands Reference

### Check installed apps
```bash
docker compose exec backend bench --site all list-apps
```

### Manually install Healthcare (if needed)
```bash
docker compose exec backend bench get-app healthcare --branch version-15
docker compose exec backend bash -c "grep -q healthcare sites/apps.txt || echo 'healthcare' >> sites/apps.txt"
docker compose exec backend bench --site all install-app healthcare
docker compose exec backend bench --site all migrate
```

### Clear cache after installation
```bash
docker compose exec backend bench --site all clear-cache
docker compose restart
```

---

## Prevention Checklist

- [ ] Apps volume is mounted in docker-compose.yml
- [ ] Configurator doesn't overwrite apps.txt if it exists
- [ ] Healthcare is listed in sites/apps.txt
- [ ] Healthcare app files exist in apps folder
- [ ] Run `bench migrate` after any app installation

---

## Git Best Practices

### Add to .gitignore
```
# Docker volumes data (managed by Docker)
db-data/
redis-*/

# Don't track local site data
sites/*/private/
sites/*/public/files/
```

### Track configuration files
```bash
git add docker-compose.yml
git add install-healthcare.bat
git add HEALTHCARE_PERSISTENCE_FIX.md
git commit -m "fix: Add apps volume to persist Healthcare module across restarts"
```
