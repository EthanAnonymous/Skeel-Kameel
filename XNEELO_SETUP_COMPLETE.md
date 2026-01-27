# Xneelo + PostgreSQL Setup Complete ✅

Your Overberg Transport Connect app is now configured for Xneelo hosting with PostgreSQL and email notifications!

## What's Been Done

### ✅ Code Updates
- **Fixed**: Removed duplicate code error in `src/lib/google-apps-script.ts`
- **Created**: `src/services/emailService.ts` - Full email notification system
- **Updated**: `server.js` - Express.js server with PostgreSQL integration
- **Added**: Email templates for booking confirmations and status updates
- **Installed**: express, pg, nodemailer packages

### ✅ Email Features
- **Booking Confirmation**: Customer receives confirmation with booking details
- **Admin Notification**: Admin gets notified of new bookings
- **Status Updates**: Customers notified when booking status changes
- **Professional HTML Templates**: Formatted emails with branding
- **Error Handling**: Email failures don't crash the system

### ✅ Database Ready
- PostgreSQL connection pool configured
- All booking and invoice endpoints implemented
- Auto-generated booking IDs
- Status tracking for bookings
- Invoice management

---

## 🚀 Next Steps: Deploy to Xneelo

### Step 1: Get Xneelo PostgreSQL Details

**In Xneelo cPanel:**
1. Find "PostgreSQL Databases" or contact support
2. Create database and user
3. Get connection string: `postgresql://user:password@host:5432/dbname`

**OR use Railway PostgreSQL:**
1. Go to https://railway.app
2. Create PostgreSQL database
3. Copy DATABASE_URL from Variables

### Step 2: Create Database Tables

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
```

### Step 3: Set Up Email in Xneelo

**In Xneelo cPanel:**
1. Go to "Email Accounts"
2. Create: `noreply@your-domain.com`
3. Note the password

### Step 4: Configure Environment Variables

Create `.env` file on Xneelo with:

```bash
DATABASE_URL=postgresql://user:password@host:5432/dbname
NODE_ENV=production
PORT=3000
VITE_API_URL=https://your-domain.com/api

SMTP_HOST=smtp.xneelo.co.za
SMTP_PORT=587
SMTP_USER=noreply@your-domain.com
SMTP_PASSWORD=your-password
SMTP_FROM=noreply@your-domain.com
RECIPIENT_EMAIL=admin@your-domain.com
```

### Step 5: Deploy Code

```bash
# Via SSH to Xneelo server:
cd public_html/overberg-transport
git clone https://github.com/EthanAnonymous/Skeel-Kameel.git .
npm install
npm run build

# Then restart Node.js in cPanel → Node.js Manager
```

---

## 📧 Email Notifications

Emails are automatically sent for:

### 1. **Booking Confirmation**
- **To Customer**: Booking details and confirmation
- **To Admin**: New booking alert with action required
- **Sent**: When booking is created

### 2. **Status Updates**
- **To Customer**: When booking status changes (confirmed, completed, cancelled)
- **Sent**: When you update status via PATCH /api/bookings/:id/status

### 3. **Custom Emails** (if needed)
Use the `sendCustomEmail()` function in `src/services/emailService.ts`

---

## 🔗 API Endpoints

All ready to use:

```
POST   /api/bookings              # Create booking (emails auto-sent)
GET    /api/bookings              # Get all bookings
GET    /api/bookings/:id          # Get booking by ID
PATCH  /api/bookings/:id/status   # Update status (email sent)
DELETE /api/bookings/:id          # Cancel booking

POST   /api/invoices              # Create invoice
GET    /api/invoices              # Get all invoices
GET    /api/invoices/booking/:id  # Get invoices for booking
```

---

## 🧪 Test Locally

```bash
# 1. Create .env.local with test database
DATABASE_URL=postgresql://user:password@localhost:5432/overberg_test
SMTP_HOST=smtp.xneelo.co.za
SMTP_PORT=587
SMTP_USER=test@your-domain.com
SMTP_PASSWORD=password
SMTP_FROM=test@your-domain.com
RECIPIENT_EMAIL=you@your-domain.com

# 2. Install dependencies
npm install

# 3. Build frontend
npm run build

# 4. Start server
npm run dev

# 5. Test booking API
curl -X POST http://localhost:5510/api/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "customer_name": "John Doe",
    "email": "john@example.com",
    "phone": "555-1234",
    "pickup_location": "Airport",
    "dropoff_location": "Hotel",
    "booking_date": "2026-02-15T10:00:00"
  }'

# You should get booking back and emails sent!
```

---

## ✨ Features Implemented

✅ **Express.js Server** - Full Node.js backend  
✅ **PostgreSQL** - Relational database for bookings/invoices  
✅ **Email Notifications** - Booking confirmations and status updates  
✅ **Professional HTML Email Templates** - Formatted with company branding  
✅ **Error Handling** - Graceful failures, connection pooling  
✅ **REST API** - Complete booking and invoice endpoints  
✅ **Auto-generated Booking IDs** - Unique reference for each booking  
✅ **Admin Notifications** - Immediate alert when booking received  
✅ **Status Tracking** - pending → confirmed → completed/cancelled  

---

## 📚 Documentation

- [XNEELO_DEPLOYMENT_GUIDE.md](XNEELO_DEPLOYMENT_GUIDE.md) - Complete Xneelo setup guide
- [server.js](server.js) - Full backend implementation
- [src/services/emailService.ts](src/services/emailService.ts) - Email system
- [README.md](README.md) - Project overview

---

## 🆘 Troubleshooting

### Emails not sending?
1. Check SMTP credentials in .env
2. Verify email account exists in Xneelo cPanel
3. Check logs in cPanel Error Logs
4. Try different port: 465 (SSL) instead of 587 (TLS)

### Database connection failing?
1. Verify DATABASE_URL in .env is correct
2. Test connection: `npm install -g psql && psql $DATABASE_URL -c "SELECT 1"`
3. Check firewall settings in Xneelo
4. Verify credentials are correct

### Server not starting?
1. Check Node.js version: `node --version` (need 18+)
2. Check error logs in cPanel
3. Verify all packages installed: `npm install`
4. Build frontend: `npm run build`

---

## 📞 Support

For help:
1. Check [XNEELO_DEPLOYMENT_GUIDE.md](XNEELO_DEPLOYMENT_GUIDE.md)
2. Review error logs in cPanel
3. Contact Xneelo support: https://support.xneelo.co.za

**Your app is ready! 🎉 Deploy when you're ready.** Ready for production deployment on Xneelo!
