# Quick Start: Google Apps Script Integration

## What Changed

✅ **Replaced Firebase** with Google Apps Script + Google Sheets
✅ **Created** `src/lib/google-apps-script.ts` - API layer for Google Apps Script calls
✅ **Updated** `src/pages/BookingPage.tsx` - Now uses Google Apps Script instead of Firebase
✅ **Updated** `.env.example` - New environment variable format
✅ **Updated** `README.md` - Complete Google Sheets setup instructions

## 3-Step Setup (Takes ~10 minutes)

### Step 1: Create Google Sheet
1. Go to [Google Sheets](https://sheets.google.com/)
2. Create new spreadsheet: "Overberg Transport Bookings"
3. Rename first sheet to "Bookings"
4. Create second sheet "Invoices"
5. Add column headers (see `GOOGLE_APPS_SCRIPT_SETUP.md`)

### Step 2: Deploy Google Apps Script
1. In Google Sheet → **Tools** → **Script Editor**
2. Paste the Google Apps Script code (in `GOOGLE_APPS_SCRIPT_SETUP.md`)
3. **Deploy** → **New deployment** → **Web app**
4. Set "Who has access" to **"Anyone"**
5. Copy the deployment URL

### Step 3: Add Environment Variable
1. Create/edit `.env.local` in project root:
   ```
   VITE_GAS_DEPLOYMENT_URL=https://script.google.com/macros/d/YOUR_DEPLOYMENT_ID/usercript
   ```
2. Restart dev server: `npm run dev`

**Done!** Your app is now connected to Google Sheets.

## How It Works

```
React App → BookingPage.tsx → google-apps-script.ts → fetch() → Google Apps Script → Google Sheets
```

1. User submits booking in React app
2. `BookingPage.tsx` calls functions from `google-apps-script.ts`
3. These functions use `fetch()` to POST to your Google Apps Script deployment URL
4. Google Apps Script receives request and updates Google Sheets
5. Data saved to "Bookings" or "Invoices" sheet

## What Works Now

✅ Submit bookings → Saved to Google Sheets
✅ View booking history → Loaded from Google Sheets
✅ Update booking status → Changes reflect in Google Sheets
✅ Cancel bookings → Status updated to "cancelled"
✅ Auto-generate invoices → Saved to "Invoices" sheet
✅ Update invoice payment status → Changes in Google Sheets

## Testing

1. Run `npm run dev`
2. Go to http://localhost:5510
3. Fill out and submit a booking form
4. Check your Google Sheet - booking should appear!
5. Refresh the page - booking should still be there

## Important Files

- [GOOGLE_APPS_SCRIPT_SETUP.md](GOOGLE_APPS_SCRIPT_SETUP.md) - **Complete setup guide with all code**
- [README.md](README.md) - Project documentation including Google Apps Script section
- [src/lib/google-apps-script.ts](src/lib/google-apps-script.ts) - API layer
- [src/pages/BookingPage.tsx](src/pages/BookingPage.tsx) - Uses the API
- [.env.example](.env.example) - Environment variable template

## Environment Variable

Once setup, your `.env.local` should look like:
```
VITE_GAS_DEPLOYMENT_URL=https://script.google.com/macros/d/1q2w3e4r5t6y7u8i9o0p/usercript
```

(Your actual deployment ID will be different)

## Troubleshooting

**"Failed to save booking" error**
- Check deployment URL in `.env.local` is correct
- Verify Google Apps Script deployment is set to "Anyone"
- Check browser console (F12) for error details

**Bookings not appearing in Google Sheets**
- Verify sheet names are exactly "Bookings" and "Invoices"
- Check Google Apps Script execution logs for errors
- Ensure Google Sheets is shared/accessible

**CORS or 403 errors**
- Google Apps Script must be deployed with "Anyone" access
- Re-deploy if you changed permissions

## For More Details

See [GOOGLE_APPS_SCRIPT_SETUP.md](GOOGLE_APPS_SCRIPT_SETUP.md) for:
- Detailed column specifications
- Complete Google Apps Script code
- All available API actions
- Advanced troubleshooting
- API endpoint documentation

## Next Steps

After setup is working:
1. Test with multiple bookings
2. Verify invoices are generated automatically
3. Test status updates
4. Export your data from Google Sheets as needed
5. Monitor your bookings in real-time

Good luck! 🚀
