# Xneelo + PostgreSQL Deployment Guide

Complete setup guide for deploying Overberg Transport Connect on Xneelo hosting with PostgreSQL database.

## Table of Contents

1. [Xneelo Hosting Setup](#xneelo-hosting-setup)
2. [PostgreSQL Database Setup](#postgresql-database-setup)
3. [Deploy Application](#deploy-application)
4. [Configure Email Notifications](#configure-email-notifications)
5. [Troubleshooting](#troubleshooting)

---

## Xneelo Hosting Setup

### Step 1: Create Xneelo Account

1. Go to https://www.xneelo.co.za/hosting/
2. Choose a hosting plan (Linux Shared Hosting recommended for starting)
3. Register domain and complete signup
4. Access your Xneelo control panel

### Step 2: Access cPanel

1. Log in to https://www.xneelo.co.za/login/
2. Go to "Manage Hosting" for your domain
3. Click "cPanel Login"
4. You'll see the cPanel dashboard

### Step 3: Set Up Node.js

**If your plan supports Node.js:**

1. In cPanel, find **"Node.js Manager"** (or "Setup Node.js App")
2. Click **"Create Application"**
3. Configure:
   - **Node.js Version**: 22.22.0 (or latest LTS)
   - **Application Root**: `/home/username/public_html/overberg-transport`
   - **Application URL**: Your domain
   - **Application Startup File**: `server.js`
4. Click **"Create"**

**If Node.js not available:**

Contact Xneelo support or upgrade to a plan that includes Node.js support. Alternatively, use traditional PHP hosting with a separate backend.

### Step 4: Upload Code via Git or FTP

**Option A: Git (Recommended)**

```bash
# SSH into your Xneelo server
ssh username@your-domain.com

# Navigate to application directory
cd public_html/overberg-transport

# Clone your repository
git clone https://github.com/EthanAnonymous/Skeel-Kameel.git .

# Install dependencies
npm install

# Build frontend
npm run build
```

**Option B: FTP**

1. In cPanel, go to **"Files"** → **"FTP Accounts"**
2. Create an FTP account
3. Use FTP client (FileZilla, WinSCP) to connect
4. Upload all files from your local repository
5. Run `npm install` after upload

### Step 5: Set Environment Variables

1. In cPanel, go to **"Environment Variables"** (or edit `.env` file via FTP)
2. Create `.env` file in your application root:

```bash
DATABASE_URL=postgresql://user:password@db-host:5432/database_name
PORT=3000
NODE_ENV=production
VITE_API_URL=https://your-domain.com/api
SMTP_HOST=smtp.xneelo.co.za
SMTP_PORT=587
SMTP_USER=your-email@your-domain.com
SMTP_PASSWORD=your-email-password
SMTP_FROM=noreply@your-domain.com
```

---

## PostgreSQL Database Setup

### Option 1: Xneelo Managed PostgreSQL (If Available)

1. In cPanel, look for **"PostgreSQL Databases"**
2. Create new database and user
3. Get connection details
4. Set `DATABASE_URL` in `.env`

### Option 2: External PostgreSQL (Recommended)

Use a managed PostgreSQL provider:

**Best Providers for South Africa:**

1. **Railway** (Recommended)
   - Cost: $5-15/month
   - Easy integration
   - See: [Railway Setup](#railway-postgresql-setup)

2. **AWS RDS**
   - Cost: $15-30/month
   - Reliable, scalable
   - See: [AWS RDS Setup](#aws-rds-setup)

3. **Heroku Postgres** (Legacy - getting expensive)
   - Cost: $9-50+/month
   - See: [Heroku Setup](#heroku-postgres-setup)

### Railway PostgreSQL Setup

1. Go to https://railway.app
2. Create new project
3. Add PostgreSQL
4. In Variables tab, copy `DATABASE_URL`
5. Add to your `.env`:

```
DATABASE_URL=postgresql://user:password@host:5432/dbname
```

### Create Database Tables

Connect to your PostgreSQL database and run:

```sql
CREATE TABLE bookings (
  id SERIAL PRIMARY KEY,
  booking_id VARCHAR(36) UNIQUE NOT NULL,
  customer_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  pickup_location VARCHAR(255),
  dropoff_location VARCHAR(255),
  booking_date TIMESTAMP,
  status VARCHAR(50) DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE invoices (
  id SERIAL PRIMARY KEY,
  booking_id INTEGER REFERENCES bookings(id),
  amount DECIMAL(10, 2),
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE email_logs (
  id SERIAL PRIMARY KEY,
  booking_id INTEGER REFERENCES bookings(id),
  recipient_email VARCHAR(255),
  subject VARCHAR(255),
  status VARCHAR(50) DEFAULT 'sent',
  sent_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_email ON bookings(email);
CREATE INDEX idx_invoices_booking_id ON invoices(booking_id);
CREATE INDEX idx_email_logs_booking_id ON email_logs(booking_id);
```

---

## Deploy Application

### Step 1: Update server.js

Create PostgreSQL connection pool in `server.js`:

```javascript
import express from 'express';
import pkg from 'pg';
import path from 'path';
import { fileURLToPath } from 'url';
import nodemailer from 'nodemailer';

const { Pool } = pkg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' 
    ? { rejectUnauthorized: false } 
    : false
});

// Email configuration (see next section)
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_PORT === '465',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD
  }
});

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'dist')));

// BOOKING ENDPOINTS
app.post('/api/bookings', async (req, res) => {
  const { customer_name, email, phone, pickup_location, dropoff_location, booking_date, notes } = req.body;
  
  try {
    const booking_id = `BK-${Date.now()}`;
    
    const result = await pool.query(
      `INSERT INTO bookings (booking_id, customer_name, email, phone, pickup_location, dropoff_location, booking_date, notes, status) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
       RETURNING *`,
      [booking_id, customer_name, email, phone, pickup_location, dropoff_location, booking_date, notes, 'pending']
    );

    // Send email notification (see email section)
    await sendBookingConfirmationEmail(result.rows[0]);
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/bookings', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM bookings ORDER BY booking_date DESC');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/bookings/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM bookings WHERE booking_id = $1', [id]);
    res.json(result.rows[0] || {});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.patch('/api/bookings/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const result = await pool.query(
      'UPDATE bookings SET status = $1, updated_at = NOW() WHERE booking_id = $2 RETURNING *',
      [status, id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/bookings/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM bookings WHERE booking_id = $1', [id]);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// INVOICE ENDPOINTS
app.post('/api/invoices', async (req, res) => {
  const { booking_id, amount, status } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO invoices (booking_id, amount, status) VALUES ($1, $2, $3) RETURNING *',
      [booking_id, amount, status || 'pending']
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/invoices', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM invoices ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// EMAIL FUNCTIONS (see next section)
async function sendBookingConfirmationEmail(booking) {
  // Implementation in email section
}

// SPA fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

### Step 2: Push to Production

```bash
git add server.js
git commit -m "Add PostgreSQL database integration for Xneelo deployment"
git push origin main
```

### Step 3: Deploy on Xneelo

**Via SSH:**
```bash
ssh username@your-domain.com
cd public_html/overberg-transport
git pull origin main
npm install --production
npm run build
```

**Restart application** in cPanel → Node.js Manager

---

## Configure Email Notifications

### Step 1: Set Up Email on Xneelo

1. In cPanel, go to **"Email Accounts"**
2. Create email account: `noreply@your-domain.com` (or use existing)
3. Get credentials:
   - Email: `noreply@your-domain.com`
   - Password: (your password)
   - SMTP Host: `smtp.xneelo.co.za` or `mail.your-domain.com`
   - SMTP Port: `587` (TLS) or `465` (SSL)

### Step 2: Add Email Configuration to .env

In your `.env` file add:

```bash
SMTP_HOST=smtp.xneelo.co.za
SMTP_PORT=587
SMTP_USER=noreply@your-domain.com
SMTP_PASSWORD=your-email-password
SMTP_FROM=noreply@your-domain.com
RECIPIENT_EMAIL=admin@your-domain.com
```

### Step 3: Create Email Service

Create `src/services/emailService.ts`:

```typescript
import nodemailer from 'nodemailer';
import { BookingRequest } from '@/types/booking';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_PORT === '465',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD
  }
});

export const sendBookingConfirmationEmail = async (booking: BookingRequest) => {
  const bookingDetails = `
    <h2>Booking Confirmation</h2>
    <p><strong>Booking ID:</strong> ${booking.booking_id}</p>
    <p><strong>Customer Name:</strong> ${booking.customer_name}</p>
    <p><strong>Email:</strong> ${booking.email}</p>
    <p><strong>Phone:</strong> ${booking.phone}</p>
    <p><strong>Pickup Location:</strong> ${booking.pickup_location}</p>
    <p><strong>Dropoff Location:</strong> ${booking.dropoff_location}</p>
    <p><strong>Booking Date:</strong> ${new Date(booking.booking_date).toLocaleString()}</p>
    <p><strong>Status:</strong> ${booking.status}</p>
  `;

  // Email to customer
  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: booking.email,
    subject: `Booking Confirmation - ${booking.booking_id}`,
    html: `
      <h1>Overberg Transport Connect</h1>
      ${bookingDetails}
      <p>Thank you for booking with us. We will contact you shortly to confirm.</p>
    `
  });

  // Email to admin
  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: process.env.RECIPIENT_EMAIL,
    subject: `New Booking - ${booking.booking_id}`,
    html: `
      <h1>New Booking Received</h1>
      ${bookingDetails}
    `
  });

  console.log(`Booking confirmation emails sent for ${booking.booking_id}`);
};

export const sendBookingStatusUpdateEmail = async (booking: BookingRequest, newStatus: string) => {
  const statusMessages = {
    confirmed: 'Your booking has been confirmed',
    completed: 'Your booking has been completed',
    cancelled: 'Your booking has been cancelled'
  };

  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: booking.email,
    subject: `Booking Status Update - ${booking.booking_id}`,
    html: `
      <h1>Overberg Transport Connect</h1>
      <h2>${statusMessages[newStatus] || 'Booking Status Changed'}</h2>
      <p><strong>Booking ID:</strong> ${booking.booking_id}</p>
      <p><strong>New Status:</strong> ${newStatus}</p>
      <p>Thank you for using our service.</p>
    `
  });
};
```

### Step 4: Update server.js to Send Emails

In `server.js`, import and use email service:

```javascript
import { sendBookingConfirmationEmail, sendBookingStatusUpdateEmail } from './src/services/emailService.js';

// When creating booking
app.post('/api/bookings', async (req, res) => {
  // ... database insert code ...
  
  try {
    const booking = result.rows[0];
    await sendBookingConfirmationEmail(booking);
    res.status(201).json(booking);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// When updating booking status
app.patch('/api/bookings/:id/status', async (req, res) => {
  // ... database update code ...
  
  try {
    const booking = result.rows[0];
    await sendBookingStatusUpdateEmail(booking, req.body.status);
    res.json(booking);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
});
```

### Step 5: Install nodemailer

```bash
npm install nodemailer
npm install --save-dev @types/nodemailer
```

---

## Troubleshooting

### Email Not Sending

**Check SMTP Settings:**
```bash
# Verify SMTP credentials
# Try connecting with mail client (Thunderbird, Outlook)
```

**Common Issues:**
- Wrong password: Double-check in Xneelo control panel
- Port blocked: Try 587 (TLS) instead of 465
- Firewall: Contact Xneelo support to unblock SMTP ports
- Rate limiting: Xneelo may limit emails per day

### Database Connection Failed

**Check Connection String:**
```bash
# Format: postgresql://user:password@host:port/database
# Verify:
# - Username and password are correct
# - Host is reachable
# - Port is not blocked
```

**Test Connection:**
```bash
npm install -g psql
psql $DATABASE_URL -c "SELECT 1"
```

### Application Not Starting

1. Check Node.js version: `node --version` (need 18+)
2. Check error logs in cPanel → Error Logs
3. Verify `.env` file exists and has DATABASE_URL
4. Try manual build: `npm run build`

### Port Already in Use

If port 3000 is in use:
1. Use different port in `.env`: `PORT=8080`
2. Contact Xneelo to configure port forwarding
3. Check which process is using port: `lsof -i :3000`

---

## Monitoring & Maintenance

### Set Up Auto-Restarts

In cPanel → Cron Jobs, add:

```bash
* * * * * cd /home/username/public_html/overberg-transport && npm start > /dev/null 2>&1 || npm start > /dev/null 2>&1 &
```

### Monitor Disk Space

In cPanel → Disk Space Usage, ensure you have:
- At least 500MB free space
- Monitor `node_modules/` size (~1GB)

### Database Backups

1. In cPanel → PostgreSQL Backups (if available)
2. Or use Railway backup features
3. Schedule weekly backups via `pg_dump`

---

## Support

For issues:
1. Check Xneelo support: https://support.xneelo.co.za
2. Check PostgreSQL logs
3. Check email service logs
4. Review application error logs in cPanel

Your deployment is now complete! 🎉
