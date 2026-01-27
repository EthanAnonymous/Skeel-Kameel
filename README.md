# Overberg Transport Connect

A modern web application for transport services and booking management built with React, TypeScript, and Tailwind CSS.

## ⚡ Quick Start

### Local Development

```bash
# Install dependencies
npm install

# Start development server (http://localhost:5510)
npm run dev

# Build for production
npm run build
```

## 🚀 Deployment

**NEW:** Render and Google Apps Script integrations have been removed for a more flexible architecture.

### Choose Your Stack

We recommend **Railway + PostgreSQL** for the best balance of cost, ease, and reliability.

📖 **See [QUICK_DEPLOYMENT_GUIDE.md](QUICK_DEPLOYMENT_GUIDE.md)** for a 5-minute setup guide.

📖 **See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)** for detailed options including:

**Hosting Platforms:**
- ✅ **Railway** (Recommended - $5-15/month)
- Vercel (Serverless)
- Netlify (Serverless)
- Fly.io (Global)
- AWS (Enterprise)

**Database Options:**
- ✅ **PostgreSQL** (Recommended - best for bookings/invoices)
- MongoDB (Flexible)
- MySQL (Compatible)
- Supabase (Auto API)

### What's Included

The frontend is framework-agnostic and connects to a REST API. You'll need:

1. **Backend Server** - Node.js/Express API for bookings and invoices
2. **Database** - PostgreSQL, MongoDB, MySQL, or equivalent
3. **Hosting** - Railway, Vercel, AWS, etc.

---

## 📋 Project Structure

```
├── src/
│   ├── components/          # React UI components
│   ├── pages/              # Page components
│   ├── lib/
│   │   ├── google-apps-script.ts  # Generic API client (update for your backend)
│   │   └── booking-utils.ts       # Booking logic
│   ├── types/              # TypeScript types
│   └── App.tsx
├── server.js               # Node.js server for static serving
├── package.json
├── vite.config.ts
└── tailwind.config.ts
```

---

## 🔧 Features

- ✅ Modern React UI with Shadcn/ui components
- ✅ TypeScript for type safety
- ✅ Tailwind CSS for styling
- ✅ Booking form with validation
- ✅ Invoice generation
- ✅ Responsive design
- ✅ SEO optimized

---

## 📝 API Endpoints (To Implement)

Your backend should provide these endpoints:

```
POST   /api/bookings              # Create booking
GET    /api/bookings              # Get all bookings
GET    /api/bookings/:id          # Get booking by ID
PATCH  /api/bookings/:id/status   # Update booking status
DELETE /api/bookings/:id          # Cancel booking

POST   /api/invoices              # Create invoice
GET    /api/invoices              # Get all invoices
GET    /api/invoices/booking/:id  # Get invoices for booking
```

---

## 🛠️ Customization

### Update API Endpoint

In your deployment:

```bash
# Production .env
VITE_API_URL=https://your-api-domain.com/api
```

### Modify API Client

Edit `src/lib/google-apps-script.ts` to match your API structure if needed.

---

## 🧪 Testing

```bash
# Run unit tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run ESLint
npm run lint
```

---

## 📚 Documentation

- [QUICK_DEPLOYMENT_GUIDE.md](QUICK_DEPLOYMENT_GUIDE.md) - 5-minute quick start
- [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) - Detailed setup for all platforms
- [TROUBLESHOOTING_APPS_SCRIPT.md](TROUBLESHOOTING_APPS_SCRIPT.md) - Common issues (if using legacy setup)

---

## 🤝 Contributing

1. Create a feature branch (`git checkout -b feature/amazing-feature`)
2. Commit changes (`git commit -m 'Add amazing feature'`)
3. Push to branch (`git push origin feature/amazing-feature`)
4. Open a Pull Request

---

## 📄 License

MIT License - feel free to use this project for any purpose.

---

## ❓ FAQ

**Q: Do I need Google Sheets or Render anymore?**  
A: No, those integrations have been removed. You can now use any database and hosting platform.

**Q: What database should I use?**  
A: PostgreSQL is recommended for relational booking data. See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for alternatives.

**Q: How much will it cost?**  
A: Railway + PostgreSQL costs $5-15/month typically, but often covered by free credits. See [QUICK_DEPLOYMENT_GUIDE.md](QUICK_DEPLOYMENT_GUIDE.md) for cost breakdown.

**Q: Can I use this with AWS/Azure/Google Cloud?**  
A: Yes! Any cloud provider will work. See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for setup options.

---

## 📞 Support

For deployment help, check the guides first:
1. [QUICK_DEPLOYMENT_GUIDE.md](QUICK_DEPLOYMENT_GUIDE.md) - Start here
2. [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) - Detailed options

## Development

### Available Scripts

- `npm run build` - Build for production (creates optimized `dist/` folder)
- `npm run build:dev` - Build in development mode
- `npm run lint` - Run ESLint to check code quality
- `npm test` - Run tests once
- `npm run test:watch` - Run tests in watch mode

### How it Works

1. **React SPA Build**: `npm run build` creates an optimized production build in the `dist/` folder
2. **Static Site**: GitHub Pages serves the built files as static HTML/CSS/JS
3. **Client-Side Routing**: React Router handles all navigation in the browser
4. **No Server Required**: Everything runs in the browser - no backend server needed for the UI

## Technologies

This project is built with:

- **Vite** - Build tool (compiles React to static files)
- **TypeScript** - Type-safe JavaScript
- **React** - UI library
- **shadcn-ui** - High-quality UI components
- **Tailwind CSS** - Utility-first CSS framework
- **React Hook Form** - Performant form handling
- **React Query** - Data fetching and caching
- **React Router** - Client-side navigation

## Features

### Booking System
- **Online Booking Form**: Customers can book rides directly through the web interface
- **Vehicle Selection**: Choose between Standard, Premium, and Van options
- **Fare Estimation**: Real-time fare calculation based on vehicle type
- **Booking Status Tracking**: Monitor pending, confirmed, completed, and cancelled bookings
- **Booking History**: View all previous bookings with detailed information

### Invoicing System
- **Auto-Generated Invoices**: Invoices are automatically created when bookings are submitted
- **Itemized Charges**: Professional invoice layout with itemized service charges
- **Tax Calculation**: 15% tax automatically applied to all invoices
- **Payment Status**: Track invoice payment status (unpaid, paid, overdue)
- **PDF Export**: Download invoices as PDF (placeholder for backend implementation)
- **Email Integration**: Send invoices via email (placeholder for backend implementation)

## Project Structure

```
src/
├── components/
│   ├── ui/                    # shadcn-ui components
│   ├── BookingForm.tsx        # Main booking form component
│   ├── InvoiceDisplay.tsx     # Invoice display component
│   ├── ContactForm.tsx
│   ├── Footer.tsx
│   ├── Hero.tsx
│   ├── NavLink.tsx
│   ├── RateCard.tsx
│   └── ReassuranceBar.tsx
├── hooks/                     # Custom React hooks
├── lib/
│   ├── utils.ts              # Utility functions
│   └── booking-utils.ts      # Booking & invoice utilities
├── pages/
│   ├── Index.tsx             # Home page
│   ├── BookingPage.tsx       # Booking & invoicing page
│   └── NotFound.tsx
├── types/
│   └── booking.ts            # TypeScript types for bookings & invoices
├── App.tsx                    # Root component
└── main.tsx                   # Entry point

dist/                          # Build output (generated by npm run build)
server.js                      # Development server (local only)
```

## Deployment on GitHub Pages

The application is pre-configured for GitHub Pages deployment:

1. **Build**: Run `npm run build` locally
2. **Push**: Commit and push the built files to your GitHub repository
3. **Enable**: Go to repository Settings → Pages → select main branch
4. **Deploy**: GitHub automatically deploys the `dist/` folder
5. **URL**: Access at `https://yourusername.github.io/repository-name/`

## Database & Backend Integration

### Current Implementation: Google Apps Script + Google Sheets

The application uses **Google Apps Script** as a middleware API and **Google Sheets** as the database. This approach is free, easy to maintain, and requires no backend server infrastructure.

### Google Sheets + Google Apps Script Setup Instructions

#### Step 1: Create a Google Sheet

1. Go to [Google Sheets](https://sheets.google.com/)
2. Create a new blank spreadsheet
3. Name it: `Overberg Transport Bookings`
4. You'll need two sheets: `Bookings` and `Invoices`

#### Step 2: Set Up the Bookings Sheet

In the first sheet named `Bookings`, add these column headers in row 1:
- A: `id`
- B: `passengerName`
- C: `passengerPhone`
- D: `passengerEmail`
- E: `pickupLocation`
- F: `dropoffLocation`
- G: `pickupDate`
- H: `pickupTime`
- I: `vehicleType`
- J: `distanceKm`
- K: `estimatedFare`
- L: `status`
- M: `createdAt`

#### Step 3: Set Up the Invoices Sheet

Create a new sheet named `Invoices` and add these column headers:
- A: `id`
- B: `bookingId`
- C: `invoiceNumber`
- D: `passengerName`
- E: `passengerEmail`
- F: `items` (JSON array as string)
- G: `subtotal`
- H: `tax`
- I: `total`
- J: `paymentStatus`
- K: `createdAt`

#### Step 4: Create Google Apps Script

1. In your Google Sheet, click "Tools" → "Script Editor"
2. Replace all code with this template (see full code below):

```javascript
// Google Apps Script Code
// Paste this entire script into your Google Apps Script editor

const BOOKINGS_SHEET = "Bookings";
const INVOICES_SHEET = "Invoices";

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
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(BOOKINGS_SHEET);
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
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(BOOKINGS_SHEET);
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
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(BOOKINGS_SHEET);
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
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(INVOICES_SHEET);
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
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(INVOICES_SHEET);
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
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(INVOICES_SHEET);
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

#### Step 5: Deploy as Web App

1. In the Script Editor, click "Deploy" → "New deployment"
2. Select "Type" → "Web app"
3. Set "Execute as" → Your Google Account
4. Set "Who has access" → "Anyone"
5. Click "Deploy"
6. Copy the deployment URL (looks like: `https://script.google.com/macros/s/YOUR_ID/usercript`)

#### Step 6: Add Environment Variable

1. Copy `.env.example` to `.env.local`:
   ```sh
   cp .env.example .env.local
   ```

2. Edit `.env.local` and add your deployment URL:
   ```
   VITE_GAS_DEPLOYMENT_URL=https://script.google.com/macros/s/YOUR_ID/usercript
   ```

**⚠️ Important**: Never commit `.env.local` to Git. It's already in `.gitignore`.

### Features Now Enabled

✅ **Persistent Booking Storage** - Bookings save to Google Sheets
✅ **Auto-Generated Invoices** - Invoices created automatically  
✅ **Booking History** - All bookings loaded from Google Sheets
✅ **Status Updates** - Update booking status directly from the UI
✅ **Booking Cancellation** - Cancel bookings with one click
✅ **Free Database** - No costs, unlimited usage

### Accessing Your Data

#### View Data in Google Sheets
1. Open your Google Sheet: `Overberg Transport Bookings`
2. Switch between `Bookings` and `Invoices` sheets
3. See all data in real-time as bookings are submitted

#### Edit or Delete Data
- You can manually edit cells in the sheet
- Delete rows to remove bookings or invoices
- All changes take effect immediately

### Advantages of This Approach

✅ **Free** - No hosting or database costs
✅ **Easy to Manage** - Familiar Google Sheets interface
✅ **No Backend Infrastructure** - Google handles all hosting
✅ **Instant Data Access** - View bookings anytime in Google Sheets
✅ **Automatic Scaling** - No server management needed
✅ **Data Export** - Easy to export data as CSV or Excel

### Troubleshooting

- **CORS errors**: Make sure deployment is set to "Anyone" access
- **"Failed to save booking"**: Check that deployment URL is correct in `.env.local`
- **Data not appearing**: Ensure Google Sheets is accessible and Scripts are deployed
- **Environment variable not loading**: Restart dev server after updating `.env.local`
- **Script errors**: Check Google Apps Script execution logs (Execution → View logs)

### Future Enhancements

- **Authentication**: Add user login for passenger history
- **Email Notifications**: Use Google Mail service to send confirmations
- **Data Validation**: Add spreadsheet data validation rules
- **Reports**: Create Google Sheets charts and reports
- **Backup**: Enable version history in Google Sheets

## License

MIT
