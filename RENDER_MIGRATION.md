# Render.com Migration Guide

This guide covers migrating your Overberg Transport Connect app from XAMPP to Render.com with Google Sheets as your database.

## Overview

Your architecture after migration:
- **Frontend**: React app built with Vite, served by Node.js server
- **Backend**: Node.js server (hosted on Render)
- **Database**: Google Sheets (via Google Apps Script API)
- **Optional**: Redis for caching/sessions

## Prerequisites

1. **GitHub Repository** - Push your code to GitHub
2. **Render Account** - Sign up at [render.com](https://render.com)
3. **Google Sheet** - Already set up with Apps Script deployment
4. **Deployment URL** - From your Google Apps Script

## Step 1: Prepare Your Repository

### 1.1 Update repository structure

Your current structure is already compatible. Ensure you have:

```
.
├── render.yaml              # Render configuration (create this)
├── .env.example             # Updated with Render variables
├── package.json
├── server.js                # Node.js server (already configured)
├── vite.config.ts
├── src/
│   ├── App.tsx
│   ├── lib/
│   │   ├── google-apps-script.ts
│   │   ├── firebase.ts
│   │   └── booking-utils.ts
│   └── ...
└── dist/                    # Built files (created at deploy time)
```

### 1.2 Verify Node.js version compatibility

Check your `package.json` - Render uses Node.js 18+ by default. Your app is compatible.

### 1.3 Push to GitHub

```bash
git add .
git commit -m "Prepare for Render deployment"
git push origin main
```

## Step 2: Deploy to Render

### 2.1 Create a new Web Service

1. Log in to [Render Dashboard](https://dashboard.render.com)
2. Click **+ New** → **Web Service**
3. Connect your GitHub repository
4. Configure:
   - **Name**: `overberg-transport-web`
   - **Runtime**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `node server.js`
   - **Plan**: Free (or paid for production)

### 2.2 Set Environment Variables

In the Render dashboard, add these environment variables:

```
VITE_GAS_DEPLOYMENT_URL=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
VITE_GAS_SHEET_ID=YOUR_GOOGLE_SHEET_ID
NODE_ENV=production
PORT=3000
```

**Important**: Get these from:
- `VITE_GAS_DEPLOYMENT_URL`: From your Google Apps Script deployment
- `VITE_GAS_SHEET_ID`: From your Google Sheet URL

### 2.3 Deploy

Click **Deploy** and wait for the build to complete (3-5 minutes)

Your app will be live at: `https://overberg-transport-web.onrender.com`

## Step 3: Verify the Deployment

### 3.1 Test the app

1. Open `https://your-render-url.onrender.com`
2. Submit a test booking
3. Check your Google Sheet - data should appear in the "Bookings" sheet

### 3.2 Check Logs

- Render Dashboard → Logs
- Look for any errors during startup or API calls

## Step 4: Database Migration (Google Sheets)

Since you're using Google Sheets, there's no traditional database migration needed. However:

### 4.1 Backup Your Data

**Before migrating to production:**

1. Open your Google Sheet
2. File → Download → Download as Excel

This creates a backup of all bookings and invoices.

### 4.2 Verify Sheet Structure

The Apps Script expects these sheets:

**Bookings Sheet**:
- Columns: id, passengerName, passengerPhone, passengerEmail, pickupLocation, dropoffLocation, pickupDate, pickupTime, vehicleType, distanceKm, estimatedFare, status, createdAt

**Invoices Sheet**:
- Columns: id, bookingId, invoiceNumber, passengerName, passengerEmail, items, subtotal, tax, total, paymentStatus, createdAt

### 4.3 Share with Render

The Google Apps Script automatically runs under your Google account. No additional sharing needed unless you want multiple team members to access the sheet.

## Step 5: Code Changes for Render

The good news: **minimal changes needed!** Your current code is already Render-compatible.

### 5.1 Server Configuration

Your `server.js` already handles:
- ✅ SPA routing (for React Router)
- ✅ Static file serving
- ✅ Proper MIME types
- ✅ Security (directory traversal prevention)

### 5.2 API Configuration

The `google-apps-script.ts` already uses environment variables:
```typescript
const GAS_DEPLOYMENT_URL = import.meta.env.VITE_GAS_DEPLOYMENT_URL
```

This automatically reads from the environment variables you set in Render.

### 5.3 Port Configuration

The server uses port 5510 locally, but Render uses port 3000. The server.js needs a small fix:

Update line 9 in `server.js`:

**Before:**
```javascript
const PORT = 5510;
```

**After:**
```javascript
const PORT = process.env.PORT || 5510;
```

This allows Render to set PORT=3000 while keeping local development on 5510.

### 5.4 Build Optimization

Your `vite.config.ts` is already optimized for production. No changes needed.

## Step 6: Optional - Set Up Redis

### 6.1 Create Redis Service

1. In Render Dashboard, click **+ New** → **Redis**
2. Configure:
   - **Name**: `overberg-transport-redis`
   - **Plan**: Free (or paid)

### 6.2 Connect Redis to Web Service

1. Go to your Web Service settings
2. Environment → Add new from service
3. Select your Redis service
4. Variable name: `REDIS_URL`

Render automatically provides `REDIS_URL` in the format:
```
redis://default:password@hostname:port
```

### 6.3 Use Redis in Your App (Optional)

If you want to implement caching, create a new utility file `src/lib/redis-client.ts`:

```typescript
import redis from 'redis';

const REDIS_URL = process.env.REDIS_URL;

export const redisClient = REDIS_URL 
  ? redis.createClient({ url: REDIS_URL })
  : null;

// Connect if available
if (redisClient) {
  redisClient.connect().catch(console.error);
}

export const cacheBookings = async (bookings: any[], ttl = 3600) => {
  if (!redisClient) return;
  
  try {
    await redisClient.setEx('bookings', ttl, JSON.stringify(bookings));
  } catch (error) {
    console.error('Redis cache error:', error);
  }
};
```

## Step 7: Troubleshooting

### Build fails
- Check: `npm run build` works locally
- Ensure all imports are correct
- Check Node.js version compatibility

### App won't start
- Check logs in Render Dashboard
- Verify `PORT` environment variable is set
- Ensure `dist/` folder is created during build

### Google Apps Script errors
- Verify `VITE_GAS_DEPLOYMENT_URL` is correct
- Check Google Sheet permissions
- Review Google Apps Script logs in your sheet

### Deployment URL not working
- Allow 2-3 minutes for first deployment
- Check that GitHub repository is properly connected
- Verify environment variables are set

### Data not appearing in sheet
- Check Google Apps Script deployment is set to "Anyone"
- Verify Sheet ID is correct in Apps Script
- Check browser console for errors (F12)

## Step 8: Production Considerations

### 8.1 Custom Domain

1. Render Dashboard → Settings
2. Custom Domain section
3. Add your domain (e.g., bookings.overberg.com)
4. Update DNS records per Render instructions

### 8.2 SSL/TLS

- Automatically provided by Render
- Certificate auto-renews

### 8.3 Performance

- Render free tier sleeps after 15 min of inactivity
- Upgrade to paid plan for always-on
- Response time: ~100ms first request, <50ms after

### 8.4 Monitoring

Set up alerts:
1. Render Dashboard → Settings → Notifications
2. Enable email alerts for:
   - Deploy failures
   - Service crashes
   - Memory threshold

## Step 9: Continuous Deployment

Your app is already set up for continuous deployment:
- Push to GitHub → Render auto-deploys
- No manual deployment needed
- Automatic rolling restart

## Migration Checklist

- [ ] GitHub repository ready
- [ ] `render.yaml` created
- [ ] `.env.example` updated
- [ ] `server.js` updated with PORT environment variable
- [ ] Google Apps Script deployed and working
- [ ] Environment variables set in Render
- [ ] Web Service created and deployed
- [ ] App tested on Render URL
- [ ] Data appears in Google Sheet
- [ ] Logs checked for errors
- [ ] (Optional) Redis service created
- [ ] (Optional) Custom domain configured

## Rollback Plan

If issues occur:

1. **Keep XAMPP running** during testing
2. **Update DNS** last (after everything works)
3. **Keep GitHub branches** for easy rollback
4. **Backup Google Sheet** regularly

## Support

- **Render Docs**: https://render.com/docs
- **Google Apps Script Logs**: Extensions → Apps Script → View → Logs
- **Render Logs**: Dashboard → your service → Logs
