# Quick Start: Recommended Setup

## My Top Recommendation: Railway + PostgreSQL

This is the **fastest and most cost-effective** production-ready setup for Overberg Transport Connect.

### Why Railway + PostgreSQL?

✅ **$5-15/month all-inclusive** (hosting + database)  
✅ **Free $5 monthly credits** (often covers everything)  
✅ **5-minute setup** (literally plug and play)  
✅ **No cold starts** (always-on server)  
✅ **PostgreSQL included** (best for bookings/invoices)  
✅ **GitHub auto-deploy** (push code = instant deploy)  
✅ **No vendor lock-in** (standard PostgreSQL)  

---

## Step-by-Step Setup (5 minutes)

### Step 1: Create Railway Account
```
1. Go to https://railway.app
2. Click "Start New Project"
3. Sign in with GitHub
```

### Step 2: Connect Your Repository
```
1. Select "Deploy from GitHub"
2. Choose your repository (Skeel-Kameel)
3. Click "Deploy"
4. Railway auto-detects Node.js and builds your app
```

### Step 3: Add PostgreSQL Database
```
1. In Railway project, click "+ New"
2. Select "Database" → "PostgreSQL"
3. Railway automatically sets DATABASE_URL env var
```

### Step 4: Create Database Tables

Click "PostgreSQL" → "Query" in Railway UI:

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

### Step 5: Update Backend Server

In `server.js`, add PostgreSQL routes:

```javascript
import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Booking endpoints
app.post('/api/bookings', async (req, res) => {
  const { customer_name, email, phone, booking_date, status } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO bookings (customer_name, email, phone, booking_date, status) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [customer_name, email, phone, booking_date, status || 'pending']
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
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
    const result = await pool.query('SELECT * FROM bookings WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.patch('/api/bookings/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const result = await pool.query(
      'UPDATE bookings SET status = $1 WHERE id = $2 RETURNING *',
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
    await pool.query('DELETE FROM bookings WHERE id = $1', [id]);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Invoice endpoints
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

app.get('/api/invoices/booking/:booking_id', async (req, res) => {
  const { booking_id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM invoices WHERE booking_id = $1', [booking_id]);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

### Step 6: Test Locally

```bash
# Create .env.local
cp .env.example .env.local

# Get DATABASE_URL from Railway and add to .env.local
# Or use local PostgreSQL for testing

npm run dev
```

### Step 7: Deploy

```bash
git add server.js
git commit -m "Add PostgreSQL database endpoints"
git push origin main
# Railway auto-deploys!
```

### Step 8: Get Your Live URL

In Railway dashboard:
- Click "Deployments"
- Find your latest deployment
- Copy the public URL (e.g., `https://overberg-transport-xxx.up.railway.app`)

Update your frontend `.env.production`:
```
VITE_API_URL=https://overberg-transport-xxx.up.railway.app/api
```

---

## Cost Breakdown

| Item | Cost |
|------|------|
| Railway hosting | $5/month |
| PostgreSQL database | Included |
| **Monthly free credits** | **$5** |
| **Your actual cost** | **$0-5/month** |

---

## Alternative Quick Options

### Option 2: Vercel + Supabase (Most Beginner-Friendly)

- Frontend: Vercel (free)
- Database: Supabase (free tier - 512MB)
- No backend server needed (use Supabase REST API)
- **Cost: $0/month**
- **Time: 10 minutes**

### Option 3: Netlify + MongoDB (Most Flexible)

- Frontend: Netlify (free)
- Database: MongoDB Atlas (free tier - 512MB)
- Functions: Netlify serverless functions
- **Cost: $0/month**
- **Time: 15 minutes**

---

## Support

For detailed setup instructions for any platform, see [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)

Need help? Questions about the setup? Check the full guide!
