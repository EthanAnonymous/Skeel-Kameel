# Google Apps Script Setup Guide

This document provides complete step-by-step instructions for setting up Google Apps Script and Google Sheets as the database for the Overberg Transport Connect application.

## Quick Start

1. **Create a Google Sheet** named "Overberg Transport Bookings"
2. **Set up two sheets**: "Bookings" and "Invoices" with the specified columns
3. **Create a Google Apps Script** in the sheet and deploy it
4. **Add the deployment URL** to your `.env.local` file
5. **Done!** Your app is now connected to Google Sheets

## Step-by-Step Setup

### 1. Create Google Sheet and Set Up Columns

Go to [Google Sheets](https://sheets.google.com/) and create a new spreadsheet.

**Sheet 1: Bookings**

Rename the first sheet to "Bookings" and add these headers in row 1:

| A | B | C | D | E | F | G | H | I | J | K | L | M |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| id | passengerName | passengerPhone | passengerEmail | pickupLocation | dropoffLocation | pickupDate | pickupTime | vehicleType | distanceKm | estimatedFare | status | createdAt |

**Sheet 2: Invoices**

Create a new sheet named "Invoices" and add these headers in row 1:

| A | B | C | D | E | F | G | H | I | J | K |
|---|---|---|---|---|---|---|---|---|---|---|
| id | bookingId | invoiceNumber | passengerName | passengerEmail | items | subtotal | tax | total | paymentStatus | createdAt |

### 2. Get Your Google Sheet ID

1. Open your Google Sheet in your browser
2. Look at the URL: `https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/edit`
3. **Copy the Sheet ID** (the long string between `/d/` and `/edit`)
4. Save this ID - you'll need it in the next step

### 3. Create Google Apps Script

1. In your Google Sheet, click the **Extensions** menu (or **Automations** if available)
2. Select **Apps Script** to open the script editor
3. Delete any default code
4. Copy the complete code from [APPS_SCRIPT_CODE.gs](./APPS_SCRIPT_CODE.gs) and paste it into the editor
5. Replace `YOUR_GOOGLE_SHEET_ID` with your actual Sheet ID from Step 2
6. Click **File** → **Save** and name it "Overberg Transport API"

### 4. Deploy as Web App

1. Click **Deploy** → **New deployment**
2. Click the gear icon and select **Web app**
3. Fill in these settings:
   - **Execute as**: Select your Google Account
   - **Who has access**: Select "Anyone"
4. Click **Deploy**
5. A popup will appear asking for permissions - click "Review permissions" → "Allow"
6. **Copy the deployment URL** that appears (looks like: `https://script.google.com/macros/d/YOUR_ID/usercript`)

### 5. Add Environment Variables

1. In your project root, create/edit `.env.local`:
   ```
   VITE_GAS_DEPLOYMENT_URL=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
   ```
   Replace `YOUR_DEPLOYMENT_ID` with the ID from your deployment URL

2. **Important**: `.env.local` is already in `.gitignore` - never commit it

3. Restart your dev server: `npm run dev`

### 6. Verify Sheet and Apps Script Linking

To ensure your Google Sheet is properly linked to your Apps Script:

1. **In your Google Sheet**, go to the **Extensions** menu → **Apps Script**
2. You should see the Apps Script editor open with your "Overberg Transport API" project
3. In the Apps Script editor, you can see the **Project ID** in the project settings (click the gear icon)
4. The sheet and script are automatically linked when you open the script from the sheet

**Note**: The Apps Script is bound to your Google Sheet. Any time you open the sheet and access Extensions → Apps Script, you'll see this same project.

## How It Works

The setup now has a **direct connection** between the Google Apps Script and your Google Sheet:

1. **Your Google Sheet** - Contains the actual data ("Bookings" and "Invoices" sheets)
2. **Apps Script** - Uses the Sheet ID to reference and access your data directly via `SpreadsheetApp.openById(SHEET_ID)`
3. **Deployment URL** - Used by your web app to call the Apps Script
4. **Your App** - Calls the deployment URL with the action and data

This approach makes the connection explicit and portable - the same script can work with any Google Sheet by changing the `SHEET_ID` constant. 

**To use:**
1. Open the file [APPS_SCRIPT_CODE.gs](./APPS_SCRIPT_CODE.gs)
2. Copy all the code
3. Paste it into your Google Apps Script editor (Extensions → Apps Script in your Google Sheet)
4. Save and deploy

**Or copy from here:**

```javascript
// Google Apps Script for Overberg Transport Connect
// This script handles all API calls for booking and invoice management

// Point directly to your Google Sheet by ID
const SHEET_ID = "YOUR_GOOGLE_SHEET_ID"; // Replace with your actual Sheet ID
const BOOKINGS_SHEET = "Bookings";
const INVOICES_SHEET = "Invoices";

// Get the spreadsheet directly by ID
function getSpreadsheet() {
  return SpreadsheetApp.openById(SHEET_ID);
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const action = data.action;
    const payload = data.data;

    let result;

    switch (action) {
      case 'saveBooking':
        result = saveBooking(payload);
        break;
      case 'getBookings':
        result = getBookings();
        break;
      case 'updateBookingStatus':
        result = updateBookingStatus(payload.bookingId, payload.status);
        break;
      case 'cancelBooking':
        result = cancelBooking(payload.bookingId);
        break;
      case 'saveInvoice':
        result = saveInvoice(payload);
        break;
      case 'getInvoices':
        result = getInvoices();
        break;
      case 'updateInvoicePaymentStatus':
        result = updateInvoicePaymentStatus(payload.invoiceId, payload.paymentStatus);
        break;
      default:
        return ContentService.createTextOutput(JSON.stringify({
          success: false,
          error: 'Unknown action'
        })).setMimeType(ContentService.MimeType.JSON);
    }

    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      data: result
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function saveBooking(booking) {
  const sheet = getSpreadsheet().getSheetByName(BOOKINGS_SHEET);
  const row = [
    booking.id,
    booking.passengerName,
    booking.passengerPhone,
    booking.passengerEmail,
    booking.pickupLocation,
    booking.dropoffLocation,
    booking.pickupDate,
    booking.pickupTime,
    booking.vehicleType,
    booking.distanceKm,
    booking.estimatedFare,
    booking.status || 'pending',
    new Date().toISOString()
  ];
  sheet.appendRow(row);
  return booking;
}

function getBookings() {
  const sheet = getSpreadsheet().getSheetByName(BOOKINGS_SHEET);
  const data = sheet.getDataRange().getValues();
  const bookings = [];

  for (let i = 1; i < data.length; i++) {
    bookings.push({
      id: data[i][0],
      passengerName: data[i][1],
      passengerPhone: data[i][2],
      passengerEmail: data[i][3],
      pickupLocation: data[i][4],
      dropoffLocation: data[i][5],
      pickupDate: data[i][6],
      pickupTime: data[i][7],
      vehicleType: data[i][8],
      distanceKm: data[i][9],
      estimatedFare: data[i][10],
      status: data[i][11],
      createdAt: data[i][12]
    });
  }

  return bookings;
}

function updateBookingStatus(bookingId, status) {
  const sheet = getSpreadsheet().getSheetByName(BOOKINGS_SHEET);
  const data = sheet.getDataRange().getValues();

  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === bookingId) {
      sheet.getRange(i + 1, 12).setValue(status);
      return { success: true };
    }
  }

  throw new Error('Booking not found');
}

function cancelBooking(bookingId) {
  return updateBookingStatus(bookingId, 'cancelled');
}

function saveInvoice(invoice) {
  const sheet = getSpreadsheet().getSheetByName(INVOICES_SHEET);
  const row = [
    invoice.id,
    invoice.bookingId,
    invoice.invoiceNumber,
    invoice.passengerName,
    invoice.passengerEmail,
    JSON.stringify(invoice.items),
    invoice.subtotal,
    invoice.tax,
    invoice.total,
    invoice.paymentStatus || 'unpaid',
    new Date().toISOString()
  ];
  sheet.appendRow(row);
  return invoice;
}

function getInvoices() {
  const sheet = getSpreadsheet().getSheetByName(INVOICES_SHEET);
  const data = sheet.getDataRange().getValues();
  const invoices = [];

  for (let i = 1; i < data.length; i++) {
    invoices.push({
      id: data[i][0],
      bookingId: data[i][1],
      invoiceNumber: data[i][2],
      passengerName: data[i][3],
      passengerEmail: data[i][4],
      items: JSON.parse(data[i][5]),
      subtotal: data[i][6],
      tax: data[i][7],
      total: data[i][8],
      paymentStatus: data[i][9],
      createdAt: data[i][10]
    });
  }

  return invoices;
}

function updateInvoicePaymentStatus(invoiceId, paymentStatus) {
  const sheet = getSpreadsheet().getSheetByName(INVOICES_SHEET);
  const data = sheet.getDataRange().getValues();

  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === invoiceId) {
      sheet.getRange(i + 1, 10).setValue(paymentStatus);
      return { success: true };
    }
  }

  throw new Error('Invoice not found');
}
```

## Available API Actions

Once deployed, your Google Apps Script supports these actions:

### Bookings

- **`saveBooking`** - Save a new booking
  ```json
  { "action": "saveBooking", "data": { booking object } }
  ```

- **`getBookings`** - Fetch all bookings
  ```json
  { "action": "getBookings" }
  ```

- **`updateBookingStatus`** - Update booking status
  ```json
  { "action": "updateBookingStatus", "data": { "bookingId": "BK001", "status": "confirmed" } }
  ```

- **`cancelBooking`** - Cancel a booking
  ```json
  { "action": "cancelBooking", "data": { "bookingId": "BK001" } }
  ```

### Invoices

- **`saveInvoice`** - Save a new invoice
  ```json
  { "action": "saveInvoice", "data": { invoice object } }
  ```

- **`getInvoices`** - Fetch all invoices
  ```json
  { "action": "getInvoices" }
  ```

- **`updateInvoicePaymentStatus`** - Update invoice payment status
  ```json
  { "action": "updateInvoicePaymentStatus", "data": { "invoiceId": "INV001", "paymentStatus": "paid" } }
  ```

## Testing the Setup

### Manual Testing

1. Submit a booking through the web app
2. Check your Google Sheet - the booking should appear in the "Bookings" sheet
3. An invoice should automatically appear in the "Invoices" sheet

### Using Google Apps Script Debugger

1. In Script Editor, click **View** → **Logs** to see request logs
2. Watch for any errors during booking submission
3. Each request will be logged with its action and result

## Troubleshooting

### "Failed to save booking" error

**Cause**: Deployment URL is incorrect or Google Apps Script is not deployed

**Solution**:
1. Verify the deployment URL is copied correctly
2. Check `.env.local` has the correct URL
3. Re-deploy the script if needed

### CORS or 403 error

**Cause**: Google Apps Script deployment is not set to "Anyone" access

**Solution**:
1. Go back to Script Editor
2. Click **Deploy** → **Manage deployments**
3. Click the existing deployment
4. Check "Who has access" is set to "Anyone"

### Data not appearing in Google Sheet

**Cause**: Script is not accessing the correct sheets

**Solution**:
1. Verify sheet names are exactly "Bookings" and "Invoices" (case-sensitive)
2. Check Google Apps Script logs for errors
3. Manually test by adding a row to ensure sheet is writable

### Blank page in booking form

**Cause**: JavaScript fetch() error due to deployment

**Solution**:
1. Open browser DevTools (F12)
2. Check the Network tab for failed requests
3. Check the Console for error messages
4. Verify deployment URL format

## Advantages of Google Apps Script + Sheets

✅ **Free** - No hosting costs
✅ **Easy Management** - Familiar Google Sheets interface
✅ **Reliable** - Google's infrastructure
✅ **No Server** - No maintenance needed
✅ **Scalable** - Can handle thousands of bookings
✅ **Data Backup** - Google Sheets automatic versioning
✅ **Instant Access** - View and edit data anytime

## Next Steps

Once your setup is complete:

1. **Test thoroughly** - Submit test bookings
2. **Monitor data** - Watch your Google Sheet grow
3. **Add features** - Consider email notifications via Google Mail
4. **Data export** - Download CSV/Excel reports anytime
5. **Scale up** - Google Sheets can handle unlimited rows

## Support

For issues:
1. Check the Troubleshooting section above
2. Review Google Apps Script execution logs
3. Verify all column headers match exactly
4. Ensure deployment URL is current and valid
