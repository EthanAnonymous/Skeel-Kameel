# Pre-Deployment Verification Checklist

Use this to verify everything is ready before deploying to Render.

## Files Created ✅

- [x] `render.yaml` - Infrastructure configuration
- [x] `.env.example` - Updated environment template
- [x] `server.js` - Updated with PORT env var
- [x] `RENDER_SUMMARY.md` - Overview
- [x] `RENDER_QUICKSTART.md` - 30-min deployment guide
- [x] `RENDER_MIGRATION.md` - Detailed migration guide
- [x] `RENDER_CODE_CHANGES.md` - Code changes explained
- [x] `RENDER_REDIS_SETUP.md` - Redis guide (optional)
- [x] `RENDER_ARCHITECTURE.md` - Architecture diagrams
- [x] `RENDER_PRE_DEPLOYMENT_CHECKLIST.md` - This file

## Code Verification

### server.js ✅
```javascript
// Should have this line:
const PORT = process.env.PORT || 5510;
```

**How to verify:**
```bash
grep "process.env.PORT" server.js
# Should show: const PORT = process.env.PORT || 5510;
```

### render.yaml ✅
Should contain:
- Web service configuration
- Build command: `npm install && npm run build`
- Start command: `node server.js`
- Environment variables section

**How to verify:**
```bash
cat render.yaml | grep "buildCommand"
# Should show: buildCommand: npm install && npm run build
```

### .env.example ✅
Should have:
- `VITE_GAS_DEPLOYMENT_URL`
- `VITE_GAS_SHEET_ID`
- `NODE_ENV`
- `PORT`
- Comments explaining each variable

**How to verify:**
```bash
grep -c "VITE_" .env.example
# Should show: 2 (or more if you added others)
```

## Google Apps Script Verification

### Deployment Status ✅
```bash
# Items to check:
- [ ] Google Apps Script is deployed
- [ ] Deployment shows "Web app" type
- [ ] "Who has access" is set to "Anyone"
- [ ] You have the deployment URL
```

**URL format should be:**
```
https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
```

### Sheet Structure ✅
Your Google Sheet should have:

**Sheet 1: "Bookings"**
- Columns: id, passengerName, passengerPhone, passengerEmail, pickupLocation, dropoffLocation, pickupDate, pickupTime, vehicleType, distanceKm, estimatedFare, status, createdAt

**Sheet 2: "Invoices"**
- Columns: id, bookingId, invoiceNumber, passengerName, passengerEmail, items, subtotal, tax, total, paymentStatus, createdAt

**How to verify:**
1. Open your Google Sheet
2. Check Sheet 1 name is exactly "Bookings"
3. Check Sheet 2 name is exactly "Invoices"
4. Verify column headers match

## Local Testing ✅

### Build Test
```bash
npm install
npm run build
```

**Expected result:**
- ✅ No errors
- ✅ `dist/` folder created
- ✅ `dist/index.html` exists

### Local Server Test
```bash
# Set environment variables
export VITE_GAS_DEPLOYMENT_URL=https://script.google.com/macros/s/YOUR_ID/exec
export VITE_GAS_SHEET_ID=YOUR_SHEET_ID
export NODE_ENV=production

# Start server
node server.js
```

**Expected result:**
- ✅ Server starts without errors
- ✅ Logs show listening on port 5510
- ✅ Browser: http://localhost:5510 loads app

### Feature Test (Local)
```bash
# Test these features:
- [ ] App loads
- [ ] Booking form displays
- [ ] Can fill out booking form
- [ ] Submit booking works
- [ ] Google Sheet gets new row
- [ ] View bookings page loads
- [ ] Recent booking appears in list
```

## Git Repository Verification ✅

### Status Check
```bash
git status
```

**Expected result:**
- All files staged
- No uncommitted changes (except .env.local)

### Staging
```bash
git add .
git status
```

**Expected result:**
- All files ready to commit
- `.env.local` should NOT appear (in .gitignore)

### Commit
```bash
git commit -m "Prepare for Render deployment with Google Sheets API"
```

**Expected result:**
- ✅ Commit successful
- ✅ Shows number of files changed

### Push to GitHub
```bash
git push origin main
```

**Expected result:**
- ✅ Push successful
- ✅ Can see changes on GitHub web interface
- ✅ Including `render.yaml`

## Package.json Verification ✅

### Scripts Section
```json
{
  "scripts": {
    "dev": "node server.js",
    "build": "vite build",
    "lint": "eslint .",
    "test": "vitest run"
  }
}
```

**How to verify:**
```bash
cat package.json | grep -A 5 '"scripts"'
```

### Dependencies
```bash
npm list | head -20
```

**Expected result:**
- ✅ All dependencies installed
- ✅ No peer dependency warnings

## Environment Variables Verification ✅

### You Should Have
```
VITE_GAS_DEPLOYMENT_URL = https://script.google.com/macros/s/YOUR_ID/exec
VITE_GAS_SHEET_ID = YOUR_SHEET_ID (long alphanumeric string)
```

### Optional
```
VITE_FIREBASE_* = (only if using Firebase, can leave commented)
REDIS_URL = (will be auto-set by Render if Redis added)
```

### How to Get These

**VITE_GAS_DEPLOYMENT_URL:**
1. Open Google Apps Script
2. Click Deploy → Manage deployments
3. Copy URL from latest deployment

**VITE_GAS_SHEET_ID:**
1. Open your Google Sheet
2. URL: `https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/edit`
3. Extract the `YOUR_SHEET_ID` part

## Pre-Flight Checklist (Final)

### Environment
- [ ] Node.js 18+ installed
- [ ] Git configured with correct credentials
- [ ] GitHub repository ready
- [ ] Render account created

### Code
- [ ] `server.js` has PORT env var
- [ ] `render.yaml` exists and valid
- [ ] `.env.example` updated
- [ ] All documentation files created
- [ ] Local build successful
- [ ] Local server test successful

### Configuration
- [ ] Google Apps Script deployed
- [ ] Google Sheet structure verified
- [ ] Deployment URL obtained
- [ ] Sheet ID obtained
- [ ] All values ready for Render env vars

### Git
- [ ] All changes committed
- [ ] Code pushed to GitHub
- [ ] No sensitive data in commits
- [ ] `.env.local` in `.gitignore`

## Quick Test Before Deploy

Run this exact sequence:

```bash
# 1. Clean build
rm -rf dist node_modules
npm install
npm run build

# 2. Check dist folder
ls dist/
# Should show: index.html, assets/, etc

# 3. Check server reads PORT
grep "process.env.PORT" server.js

# 4. Check render.yaml is valid
cat render.yaml | head -10

# 5. Check .env.example
cat .env.example | grep VITE_GAS

# 6. Verify git is clean
git status
# Should show: nothing to commit, working tree clean

# 7. Verify it's on GitHub
git remote -v
# Should show GitHub URL
```

## Common Issues to Check

### "Cannot find module"
```bash
ls node_modules/@vitejs/
# If empty, run: npm install
```

### "Port already in use"
```bash
# Kill process on port 5510
lsof -ti:5510 | xargs kill -9
```

### Missing .env variable
```bash
# Check if variable exists
echo $VITE_GAS_DEPLOYMENT_URL
# Should show the URL, not empty
```

### Git authentication issues
```bash
# Test GitHub access
ssh -T git@github.com
# Should say: Hi [username]! You've successfully authenticated.
```

## Success Criteria

After this checklist, you should have:

✅ Code building successfully locally
✅ App running locally on port 5510
✅ All features working (booking form, Google Sheet updates)
✅ No errors in console or Render logs
✅ All files committed to GitHub
✅ render.yaml properly formatted
✅ Environment variables ready
✅ Google Apps Script deployed and working

If all above are checked, you're ready to deploy!

## Next Step

1. Complete this checklist
2. Open **RENDER_QUICKSTART.md**
3. Follow the deployment steps
4. Your app will be live in 10-15 minutes!

---

**Questions?**
- Technical: Check RENDER_CODE_CHANGES.md
- Architecture: Check RENDER_ARCHITECTURE.md
- Deployment: Check RENDER_MIGRATION.md
- Redis: Check RENDER_REDIS_SETUP.md
