# Deployment & Database Alternatives Guide

This guide provides recommendations and setup instructions for hosting and database options for Overberg Transport Connect.

## Table of Contents

1. [Hosting Platforms](#hosting-platforms)
2. [Database Options](#database-options)
3. [Quick Setup Recommendations](#quick-setup-recommendations)
4. [Detailed Setup Instructions](#detailed-setup-instructions)

---

## Hosting Platforms

### Option 1: **Vercel** ⭐ RECOMMENDED

**Best for:** Fullstack React apps, fastest deployment, great free tier

**Pros:**
- ✅ 0-config deployment from GitHub
- ✅ Automatic SSL/HTTPS
- ✅ Built-in API routes for backend
- ✅ Generous free tier (unlimited deployments)
- ✅ Edge functions for low latency
- ✅ Automatic CI/CD on push

**Cons:**
- ❌ Paid tier required for more resources
- ❌ Serverless (not always-on)

**Cost:** Free tier sufficient for small-medium traffic

**Setup:** See [Vercel Setup](#vercel-setup-detailed)

---

### Option 2: **Netlify**

**Best for:** Frontend hosting with simple backend

**Pros:**
- ✅ Simple GitHub integration
- ✅ Free tier includes functions
- ✅ Great analytics
- ✅ No cold start delays on free tier

**Cons:**
- ❌ Limited backend capabilities
- ❌ Function execution time limited

**Cost:** Free tier available

**Setup:** See [Netlify Setup](#netlify-setup-detailed)

---

### Option 3: **Railway** ⭐ GREAT VALUE

**Best for:** Full Docker support, running Node.js server

**Pros:**
- ✅ Easy Docker/Node.js deployment
- ✅ $5/month free credits (continuous)
- ✅ Built-in PostgreSQL/MongoDB support
- ✅ Simple GitHub deployment
- ✅ Always-on processes

**Cons:**
- ❌ Requires understanding deployment
- ❌ Credits expire monthly

**Cost:** From $0-15/month (with free credits)

**Setup:** See [Railway Setup](#railway-setup-detailed)

---

### Option 4: **Fly.io**

**Best for:** Global deployment, Docker containers

**Pros:**
- ✅ Global CDN included
- ✅ Generous free tier
- ✅ Full Docker support
- ✅ Built-in database support

**Cons:**
- ❌ Steeper learning curve
- ❌ Less beginner-friendly

**Cost:** Free tier includes 3 shared-cpu instances

**Setup:** See [Fly.io Setup](#flyio-setup-detailed)

---

### Option 5: **AWS (EC2 + RDS)**

**Best for:** Enterprise, maximum control, scalability

**Pros:**
- ✅ Maximum control and scalability
- ✅ Auto-scaling capabilities
- ✅ Free tier available
- ✅ Load balancing

**Cons:**
- ❌ Complex configuration
- ❌ Steeper learning curve
- ❌ Can get expensive quickly

**Cost:** Free tier available ($0-50+/month after)

---

## Database Options

### Option 1: **PostgreSQL** ⭐ RECOMMENDED

**Best for:** Relational data, most reliable

**Pros:**
- ✅ Excellent for bookings/invoices (structured data)
- ✅ Mature, battle-tested
- ✅ ACID compliant
- ✅ Free/open-source
- ✅ Easy to host (Railway, Render, AWS, Heroku)

**Cons:**
- ❌ Requires schema design
- ❌ Scaling for high concurrency more complex

**Connection String Format:**
```
DATABASE_URL=postgresql://user:password@host:5432/database_name
```

**Hosting:**
- Railway: Free PostgreSQL included
- AWS RDS: Free tier up to 12 months
- Vercel: Via Vercel Postgres ($0.3/GB stored)
- Render: $7/month starter instance

**Setup:** See [PostgreSQL Setup](#postgresql-setup-detailed)

---

### Option 2: **MongoDB**

**Best for:** Flexible schema, rapid development

**Pros:**
- ✅ No schema required initially
- ✅ Great for rapid prototyping
- ✅ Horizontal scaling (sharding)
- ✅ Atlas free tier (512MB)

**Cons:**
- ❌ Larger data size than SQL
- ❌ Transactions more complex
- ❌ Less suitable for relational booking data

**Connection String Format:**
```
DATABASE_URL=mongodb+srv://user:password@cluster.mongodb.net/database_name
```

**Hosting:**
- MongoDB Atlas: Free tier (512MB)
- AWS DocumentDB: Paid, ~$1/day
- Railway: Via MongoDB Atlas

**Setup:** See [MongoDB Setup](#mongodb-setup-detailed)

---

### Option 3: **MySQL / MariaDB**

**Best for:** Legacy compatibility, widespread hosting

**Pros:**
- ✅ Very common, easy to find hosting
- ✅ Good for relational data
- ✅ Free/open-source

**Cons:**
- ❌ Older than PostgreSQL
- ❌ Fewer advanced features
- ❌ Not as performant

**Connection String Format:**
```
DATABASE_URL=mysql://user:password@host:3306/database_name
```

**Setup:** Similar to PostgreSQL setup below

---

### Option 4: **Supabase** (PostgreSQL with API)

**Best for:** Quick backend without coding

**Pros:**
- ✅ PostgreSQL with auto-generated REST API
- ✅ Real-time subscriptions
- ✅ Built-in authentication
- ✅ Free tier generous
- ✅ No backend coding needed

**Cons:**
- ❌ Less control
- ❌ Vendor lock-in

**Cost:** Free tier (500MB database)

**Setup:** See [Supabase Setup](#supabase-setup-detailed)

---

## Quick Setup Recommendations

### **🚀 Fastest Setup (30 minutes)**

**Stack:** Vercel + Supabase + Node.js API routes

1. Deploy frontend on Vercel
2. Use Supabase for database + auto-generated APIs
3. No backend server needed

---

### **⭐ Most Reliable (Development-Friendly)**

**Stack:** Railway + PostgreSQL + Node.js Express

1. Railway hosts everything (frontend + backend)
2. PostgreSQL for bookings/invoices
3. Simple, scalable, $5/month free credits

---

### **💰 Most Economical**

**Stack:** Netlify + MongoDB Atlas (free tier)

1. Netlify hosts frontend free
2. MongoDB Atlas free (512MB)
3. Netlify Functions for simple API
4. Cost: $0/month

---

## Detailed Setup Instructions

### PostgreSQL Setup (Detailed)

#### 1. Create PostgreSQL Database

**Option A: Railway (Recommended)**
```bash
1. Go to https://railway.app
2. Click "New Project" → "Provision PostgreSQL"
3. Copy connection string from Variables tab
4. Add to your .env as DATABASE_URL
```

**Option B: AWS RDS**
```bash
1. Go to https://aws.amazon.com/rds/
2. Create DB instance (PostgreSQL, free tier)
3. Configure security groups
4. Get endpoint URL
5. Connection: postgresql://admin:password@endpoint:5432/dbname
```

#### 2. Update Backend Server

Create `src/db/postgres.ts`:

```typescript
import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

export default pool;
```

#### 3. Create Tables

```sql
CREATE TABLE bookings (
  id SERIAL PRIMARY KEY,
  customer_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  booking_date TIMESTAMP DEFAULT NOW(),
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE invoices (
  id SERIAL PRIMARY KEY,
  booking_id INTEGER REFERENCES bookings(id),
  amount DECIMAL(10, 2),
  status VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### 4. Update API Endpoints

In `server.js`:

```javascript
import pool from './src/db/postgres.js';

app.post('/api/bookings', async (req, res) => {
  const { customer_name, email, phone } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO bookings (customer_name, email, phone) VALUES ($1, $2, $3) RETURNING *',
      [customer_name, email, phone]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/bookings', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM bookings');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

---

### MongoDB Setup (Detailed)

#### 1. Create MongoDB Cluster

```bash
1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up/login
3. Create Free Tier cluster
4. Create database user (save credentials)
5. Add your IP to whitelist
6. Get connection string from Connect modal
```

#### 2. Update Backend

```typescript
// src/db/mongo.ts
import { MongoClient } from 'mongodb';

const client = new MongoClient(process.env.DATABASE_URL);
export const db = client.db('overberg_transport');

export const bookingsCollection = db.collection('bookings');
export const invoicesCollection = db.collection('invoices');
```

#### 3. Use in API

```javascript
import { bookingsCollection } from './src/db/mongo.js';

app.post('/api/bookings', async (req, res) => {
  try {
    const result = await bookingsCollection.insertOne(req.body);
    res.json({ id: result.insertedId, ...req.body });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/bookings', async (req, res) => {
  try {
    const bookings = await bookingsCollection.find({}).toArray();
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

---

### Supabase Setup (Detailed)

#### 1. Create Supabase Project

```bash
1. Go to https://supabase.com
2. Sign in with GitHub
3. Create new project
4. Wait for database to initialize
5. Copy API URL and API Key
```

#### 2. Create Tables in Supabase UI

Go to SQL Editor → create tables (same SQL as PostgreSQL above)

#### 3. Enable Row Level Security (RLS)

```sql
-- Enable RLS
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

-- Create policies (allow all for now, restrict later)
CREATE POLICY "Allow all" ON bookings FOR ALL USING (true);
CREATE POLICY "Allow all" ON invoices FOR ALL USING (true);
```

#### 4. Use Supabase Client

```typescript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

// In your components
export const saveBooking = async (booking: BookingRequest) => {
  const { data, error } = await supabase
    .from('bookings')
    .insert([booking])
    .select();
  
  if (error) throw error;
  return data[0];
};

export const fetchAllBookings = async () => {
  const { data, error } = await supabase
    .from('bookings')
    .select('*');
  
  if (error) throw error;
  return data;
};
```

---

### Vercel Setup (Detailed)

#### 1. Deploy to Vercel

```bash
# Option A: GitHub Integration (Recommended)
1. Push code to GitHub
2. Go to https://vercel.com
3. Import your repository
4. Vercel auto-detects Vite React app
5. Add environment variables
6. Deploy

# Option B: CLI
npm install -g vercel
vercel
```

#### 2. Create API Routes

Create `api/bookings.ts`:

```typescript
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'POST') {
    // Save booking to database
    // Return 201 with saved booking
  } else if (req.method === 'GET') {
    // Fetch all bookings
    // Return bookings array
  }
}
```

#### 3. Update Frontend

Change `VITE_API_URL` to `https://your-project.vercel.app`

---

### Railway Setup (Detailed)

#### 1. Connect GitHub

```bash
1. Go to https://railway.app
2. Sign in with GitHub
3. New Project → GitHub Repo
4. Select your repository
5. Railway auto-detects Node.js
```

#### 2. Add PostgreSQL Service

```bash
1. In Railway project → "New"
2. Add PostgreSQL
3. Right-click → "Add to Render"
```

#### 3. Deploy

```bash
1. Push to GitHub
2. Railway auto-deploys
3. Get public URL from Deploy tab
4. Add to frontend VITE_API_URL
```

---

## Environment Variables Template

Create `.env.local`:

```bash
# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/db_name
# or for MongoDB:
# DATABASE_URL=mongodb+srv://user:pass@cluster.mongodb.net/db_name
# or for Supabase:
# SUPABASE_URL=https://xxx.supabase.co
# SUPABASE_ANON_KEY=your_key

# API Configuration
VITE_API_URL=http://localhost:5510/api
# Production:
# VITE_API_URL=https://your-domain.com/api

# Server
PORT=5510
NODE_ENV=development
```

---

## Comparison Table

| Feature | Vercel | Railway | Supabase | Railway+PG |
|---------|--------|---------|----------|-----------|
| **Hosting** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Database** | 3rd party | Included | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Backend** | Serverless | Full | Auto API | Full |
| **Ease** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| **Cost** | Free | $5-15 | Free-25 | Free-15 |
| **Cold Starts** | Yes | No | N/A | No |
| **Uptime** | 99.99% | 99.9% | 99.9% | 99.9% |

---

## Recommended Path Forward

### For Small/Medium Business:

**Railway + PostgreSQL** (My recommendation)

```bash
1. Sign up: https://railway.app
2. Connect GitHub repo
3. Add PostgreSQL
4. Deploy (auto)
5. Cost: $5-10/month with free credits
6. Time: 5 minutes
```

### For Rapid Development:

**Vercel + Supabase**

```bash
1. Deploy frontend on Vercel
2. Database on Supabase (no backend code)
3. Use Supabase client directly
4. Cost: Free tier
5. Time: 10 minutes
```

### For Maximum Control:

**AWS EC2 + RDS**

```bash
1. Create EC2 instance
2. Deploy Node.js app
3. Create RDS PostgreSQL
4. Set up auto-scaling
5. Cost: $20-50+/month
6. Time: 1 hour
```

---

## Next Steps

1. **Choose your stack** from the comparison table above
2. **Follow the detailed setup** for your chosen database
3. **Update API endpoints** in `server.js`
4. **Test locally** with `npm run dev`
5. **Deploy** using your chosen platform
6. **Update frontend** `VITE_API_URL` environment variable

Need help? Check the specific setup section for your chosen combination!
