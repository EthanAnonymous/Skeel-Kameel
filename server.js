import express from 'express';
import pkg from 'pg';
import path from 'path';
import { fileURLToPath } from 'url';
import { sendBookingConfirmationEmail, sendBookingStatusUpdateEmail } from './src/services/emailService.js';

const { Pool } = pkg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5510;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'dist')));

// Database connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' 
    ? { rejectUnauthorized: false } 
    : false,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Test database connection
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

(async () => {
  try {
    const res = await pool.query('SELECT NOW()');
    console.log('✓ Database connected:', res.rows[0].now);
  } catch (err) {
    console.error('✗ Database connection failed:', err);
  }
})();

// ============================================================================
// BOOKING ENDPOINTS
// ============================================================================

app.post('/api/bookings', async (req, res) => {
  const { customer_name, email, phone, pickup_location, dropoff_location, booking_date, notes } = req.body;

  if (!customer_name || !email) {
    return res.status(400).json({ error: 'customer_name and email are required' });
  }

  try {
    const booking_id = `BK-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const result = await pool.query(
      `INSERT INTO bookings (booking_id, customer_name, email, phone, pickup_location, dropoff_location, booking_date, notes, status) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
       RETURNING *`,
      [booking_id, customer_name, email, phone, pickup_location || null, dropoff_location || null, booking_date || null, notes || null, 'pending']
    );

    const booking = result.rows[0];

    // Send confirmation emails
    try {
      await sendBookingConfirmationEmail(booking);
    } catch (emailError) {
      console.error('Email sending error (non-critical):', emailError.message);
    }

    res.status(201).json(booking);
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/bookings', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM bookings ORDER BY booking_date DESC NULLS LAST');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/bookings/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM bookings WHERE booking_id = $1 OR id = $2', [id, isNaN(id) ? -1 : id]);
    res.json(result.rows[0] || {});
  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).json({ error: error.message });
  }
});

app.patch('/api/bookings/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ error: 'status is required' });
  }

  try {
    const result = await pool.query(
      'UPDATE bookings SET status = $1, updated_at = NOW() WHERE booking_id = $2 OR id = $3 RETURNING *',
      [status, id, isNaN(id) ? -1 : id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    const booking = result.rows[0];

    try {
      await sendBookingStatusUpdateEmail(booking, status);
    } catch (emailError) {
      console.error('Email sending error (non-critical):', emailError.message);
    }

    res.json(booking);
  } catch (error) {
    console.error('Error updating booking:', error);
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/bookings/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM bookings WHERE booking_id = $1 OR id = $2 RETURNING *', [id, isNaN(id) ? -1 : id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting booking:', error);
    res.status(500).json({ error: error.message });
  }
});

// ============================================================================
// INVOICE ENDPOINTS
// ============================================================================

app.post('/api/invoices', async (req, res) => {
  const { booking_id, amount, status } = req.body;

  if (!booking_id || !amount) {
    return res.status(400).json({ error: 'booking_id and amount are required' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO invoices (booking_id, amount, status) VALUES ($1, $2, $3) RETURNING *',
      [booking_id, amount, status || 'pending']
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating invoice:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/invoices', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM invoices ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching invoices:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/invoices/booking/:booking_id', async (req, res) => {
  const { booking_id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM invoices WHERE booking_id = $1', [booking_id]);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching invoices:', error);
    res.status(500).json({ error: error.message });
  }
});

// ============================================================================
// SPA FALLBACK
// ============================================================================

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// ============================================================================
// ERROR HANDLING
// ============================================================================

app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// ============================================================================
// START SERVER
// ============================================================================

app.listen(PORT, () => {
  console.log(`✓ Server running at http://localhost:${PORT}`);
  console.log(`✓ API available at http://localhost:${PORT}/api`);
});

export default app;
