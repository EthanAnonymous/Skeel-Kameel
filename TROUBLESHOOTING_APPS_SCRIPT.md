# Google Apps Script Linking & Troubleshooting Guide (2026)

## Your Current Setup

✅ **Google Sheet**: https://docs.google.com/spreadsheets/d/1XeC--cAKuNsShOWBGssf0lsBoP49TugocBI613mCW8s
✅ **Apps Script Deployment URL**: https://script.google.com/macros/s/AKfycbyfcGZLjQgv_ISWQjeVwj-GafwccVZN76SODJ0l-PfyyVe-AHhXtsGn2vk5EveoJeo5vQ/usercript
✅ **Environment Variable**: Added to `.env.local`

## Linking Your Sheet to Apps Script

### Important: Deployment URL Format

Google Apps Script has two endpoint types:
- **`/exec`** - For direct browser access, has CORS restrictions
- **`/usercript`** - For API calls from web apps, CORS-enabled ✅

**Always use `/usercript` for this project**. Your URL should end with:
```
https://script.google.com/macros/s/AKfycbyfcGZLjQgv_ISWQjeVwj-GafwccVZN76SODJ0l-PfyyVe-AHhXtsGn2vk5EveoJeo5vQ/usercript
```

### Step 1: Open Apps Script from Your Sheet

1. Open your Google Sheet: https://docs.google.com/spreadsheets/d/1XeC--cAKuNsShOWBGssf0lsBoP49TugocBI613mCW8s
2. Click **Extensions** menu (top menu bar)
3. Select **Apps Script**

This opens the Apps Script editor bound to your sheet.

### Step 2: Verify Deployment

1. In the Apps Script editor, click **Deploy** (top right button)
2. You should see your deployment URL listed
3. Verify the deployment status shows "Deployed"
4. Verify "Who has access" is set to **"Anyone"**

If you don't see a deployment:
- Click **Deploy** → **New deployment**
- Select Web App
- Execute as: Your Google Account
- Who has access: Anyone
- Deploy

### Step 3: Verify Script Code

1. Check that your Apps Script contains the `doPost(e)` function
2. Verify sheet names match exactly:
   - Sheet 1: **Bookings** (case-sensitive)
   - Sheet 2: **Invoices** (case-sensitive)

## Testing Connection

### Test 1: Manual API Call (Browser Console)

Open your web app and press **F12** → **Console** tab.

Paste this test (replace with your actual URL):

```javascript
fetch('https://script.google.com/macros/s/AKfycbyfcGZLjQgv_ISWQjeVwj-GafwccVZN76SODJ0l-PfyyVe-AHhXtsGn2vk5EveoJeo5vQ/usercript', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ action: 'getBookings' })
})
.then(r => r.json())
.then(data => console.log('Success:', data))
.catch(e => console.error('Failed:', e))
```

**Expected Results:**
- ✅ `Success: { success: true, data: [] }` → **Connection works!**
- ❌ Error message → Connection issue (see troubleshooting below)

### Test 2: Check Environment Variable

In browser console, paste:

```javascript
console.log('Env var:', import.meta.env.VITE_GAS_DEPLOYMENT_URL)
```

Should show your deployment URL.

## Troubleshooting

### Problem: CORS Error - "No 'Access-Control-Allow-Origin' header"

**Error Message**:
```
Access to fetch at '...exec' from origin 'http://localhost:5510' has been blocked by CORS policy
```

**Cause**: Using `/exec` endpoint instead of `/usercript`

**Solution**: 
1. Edit `.env.local`
2. Change the URL endpoint from `/exec` to `/usercript`:
   ```
   VITE_GAS_DEPLOYMENT_URL=https://script.google.com/macros/s/AKfycbyfcGZLjQgv_ISWQjeVwj-GafwccVZN76SODJ0l-PfyyVe-AHhXtsGn2vk5EveoJeo5vQ/usercript
   ```
3. Save the file
4. Restart dev server: `npm run dev`

**Why**: 
- `/exec` - For browser-based access directly, has CORS restrictions
- `/usercript` - For API calls from web apps, CORS-enabled ✅

### Problem: "Failed to load bookings" on Booking Page

**Check List:**

1. ✅ Is `.env.local` created with the correct deployment URL?
   ```
   VITE_GAS_DEPLOYMENT_URL=https://script.google.com/macros/s/AKfycbyfcGZLjQgv_ISWQjeVwj-GafwccVZN76SODJ0l-PfyyVe-AHhXtsGn2vk5EveoJeo5vQ/usercript
   ```
   ⚠️ **Important**: URL must end with `/usercript` not `/exec`

2. ✅ Did you restart dev server after creating `.env.local`?
   ```bash
   npm run dev
   ```

3. ✅ Is Apps Script deployment set to "Anyone" access?
   - Go to Apps Script → Deploy → Manage deployments
   - Click your deployment
   - Check "Who has access" = "Anyone"

4. ✅ Are sheet names exactly "Bookings" and "Invoices"?
   - Go to your Google Sheet
   - Check sheet tabs at the bottom
   - Names must match exactly (case-sensitive)

5. ✅ Does Apps Script have the correct code?
   - Go to Extensions → Apps Script
   - Look for the `doPost(e)` function
   - Verify it has the full code from APPS_SCRIPT_CODE.gs

### Problem: 403 Forbidden Error

**Cause**: Apps Script deployment permissions

**Solution**:
1. Go to Google Sheet → Extensions → Apps Script
2. Click **Deploy** button
3. Click **Manage deployments**
4. Click the deployment to edit
5. Change "Who has access" to **"Anyone"**
6. Save changes

### Problem: Sheet Names Not Found Error

**Cause**: Sheet names don't match exactly

**Solution**:
1. In your Google Sheet, look at the sheet tabs at the bottom
2. Verify you have:
   - **Bookings** (not "booking" or "BOOKINGS")
   - **Invoices** (not "invoices" or "Invoice")
3. Rename sheets if needed by right-clicking the tab

### Problem: "Items not appearing in Google Sheet"

**Cause**: Data is being sent but not appearing in sheet

**Solution**:
1. Check Google Apps Script logs:
   - Go to Extensions → Apps Script
   - Click **View** → **Logs**
   - Submit a booking and check for error messages
2. Check sheet permissions:
   - Your Google Account should have edit access to the sheet
3. Verify column headers:
   - Row 1 must have exact column headers
   - Check column alignment

## Verification Checklist

Before testing the app, verify all items:

- [ ] `.env.local` file exists in project root
- [ ] `VITE_GAS_DEPLOYMENT_URL` is set correctly in `.env.local`
- [ ] Dev server restarted after creating `.env.local` (`npm run dev`)
- [ ] Apps Script deployment is set to "Anyone" access
- [ ] Google Sheet has exactly "Bookings" and "Invoices" sheets
- [ ] Both sheets have correct column headers in row 1
- [ ] Apps Script has the complete code (check for `doPost` function)
- [ ] Test API call works from browser console

## Quick Fix Steps

If still getting "Failed to load bookings":

1. **Restart everything**:
   ```bash
   npm run dev
   ```

2. **Test API connection**:
   - Open browser console (F12)
   - Paste the test API call above
   - Check if you see `Success: { success: true, data: [] }`

3. **Check Google Apps Script logs**:
   - Extensions → Apps Script
   - View → Logs
   - Submit a booking
   - Look for error messages

4. **Re-deploy if needed**:
   - Extensions → Apps Script
   - Deploy button → Manage deployments
   - Delete old deployment
   - Deploy → New deployment → Web app
   - Set "Anyone" access

## Contact

If you're still having issues:
1. Check the browser console for error messages (F12 → Console)
2. Check Google Apps Script logs (Extensions → Apps Script → View → Logs)
3. Verify all three linking points:
   - `.env.local` has correct URL
   - Google Sheet is linked to Apps Script
   - Apps Script deployment is set to "Anyone"
