# Redis Setup Guide for Render

Complete guide for setting up and using Redis on Render with the Overberg Transport Connect application.

## Table of Contents

1. [Why Redis?](#why-redis)
2. [Setup on Render](#setup-on-render)
3. [Integration with Your App](#integration-with-your-app)
4. [Caching Strategies](#caching-strategies)
5. [Monitoring and Debugging](#monitoring-and-debugging)

---

## Why Redis?

Redis is an in-memory data store useful for:

| Use Case | Benefit |
|----------|---------|
| **Caching** | Reduce API calls to Google Apps Script |
| **Session Storage** | Store user sessions between requests |
| **Rate Limiting** | Prevent abuse of booking endpoints |
| **Job Queue** | Process background tasks (email notifications) |
| **Real-time Data** | Track active bookings |

For your app, caching is the primary benefit - avoid repeated Google Sheets queries.

---

## Setup on Render

### Step 1: Create Redis Service

1. **Log in to Render Dashboard**: https://dashboard.render.com
2. **Click** → **+ New** → **Redis**
3. **Configure**:
   - **Name**: `overberg-transport-redis`
   - **Region**: Same as your web service (for lower latency)
   - **Plan**: Free tier (1GB, no SSL)
     - Or paid tier for production (higher limits, SSL)

4. **Click** → **Create Redis**

Render will:
- Provision the Redis instance
- Auto-generate `REDIS_URL` environment variable
- Connect it to your web service

### Step 2: Verify Connection

After creation, your Redis service will have:
- **Internal URL**: `redis://<host>:<port>` (for Render services)
- **Automatically injected** as `REDIS_URL` environment variable

Check in your web service:
1. **Settings** → **Environment**
2. Look for `REDIS_URL` (Render auto-injects it)

Format: `redis://default:PASSWORD@HOST:PORT`

### Step 3: Update render.yaml (Optional)

If you want explicit Redis configuration in code:

```yaml
services:
  - type: web
    name: overberg-transport-web
    runtime: node
    # ... other config ...

  - type: pserv
    name: overberg-transport-redis
    runtime: redis-7
    plan: free
```

Push this and Render will create the Redis service automatically.

---

## Integration with Your App

### Step 1: Install Redis Client

```bash
npm install redis
```

### Step 2: Create Redis Client

Create `src/lib/redis-client.ts`:

```typescript
import { createClient } from 'redis';

// Initialize Redis client
const REDIS_URL = process.env.REDIS_URL;

export const redisClient = REDIS_URL
  ? createClient({
      url: REDIS_URL,
      socket: {
        reconnectStrategy: (retries) => Math.min(retries * 50, 500),
      },
    })
  : null;

// Handle connection events
if (redisClient) {
  redisClient.on('error', (err) => console.log('Redis Client Error', err));
  redisClient.on('connect', () => console.log('Redis Client Connected'));
  
  // Connect to Redis
  redisClient.connect().catch(console.error);
}

// Helper: Set with expiration
export const setCache = async (key: string, value: any, ttl = 3600) => {
  if (!redisClient) return false;
  try {
    await redisClient.setEx(key, ttl, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error('Cache set error:', error);
    return false;
  }
};

// Helper: Get from cache
export const getCache = async (key: string) => {
  if (!redisClient) return null;
  try {
    const data = await redisClient.get(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Cache get error:', error);
    return null;
  }
};

// Helper: Delete from cache
export const deleteCache = async (key: string) => {
  if (!redisClient) return false;
  try {
    await redisClient.del(key);
    return true;
  } catch (error) {
    console.error('Cache delete error:', error);
    return false;
  }
};

// Helper: Clear all cache
export const clearCache = async () => {
  if (!redisClient) return false;
  try {
    await redisClient.flushDb();
    return true;
  } catch (error) {
    console.error('Cache clear error:', error);
    return false;
  }
};
```

### Step 3: Update Google Apps Script Wrapper

Update `src/lib/google-apps-script.ts` to use caching:

```typescript
import { BookingRequest, Invoice } from '@/types/booking';
import { createInvoiceFromBooking } from './booking-utils';
import { getCache, setCache, deleteCache } from './redis-client';

const GAS_DEPLOYMENT_URL = import.meta.env.VITE_GAS_DEPLOYMENT_URL || 'YOUR_DEPLOYMENT_URL_HERE';

// Helper function to call Google Apps Script
const callGoogleAppsScript = async (action: string, data?: any) => {
  try {
    const response = await fetch(GAS_DEPLOYMENT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action,
        data,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    if (!result.success) {
      throw new Error(result.error || 'Google Apps Script request failed');
    }

    return result.data;
  } catch (error) {
    console.error('Google Apps Script error:', error);
    throw error;
  }
};

// Booking functions with caching
export const saveBooking = async (booking: BookingRequest): Promise<BookingRequest> => {
  try {
    const response = await callGoogleAppsScript('saveBooking', booking);
    
    // Invalidate cache since we added new data
    await deleteCache('bookings');
    
    return response;
  } catch (error) {
    console.error('Error saving booking:', error);
    throw error;
  }
};

export const fetchAllBookings = async (useCache = true): Promise<BookingRequest[]> => {
  try {
    // Try to get from cache first
    if (useCache) {
      const cached = await getCache('bookings');
      if (cached) {
        console.log('Returning bookings from cache');
        return cached;
      }
    }

    // Fetch from Google Apps Script
    const bookings = await callGoogleAppsScript('getBookings');
    
    // Store in cache for 5 minutes
    await setCache('bookings', bookings, 300);
    
    return bookings;
  } catch (error) {
    console.error('Error fetching bookings:', error);
    throw error;
  }
};

export const updateBookingStatus = async (
  bookingId: string,
  status: string
): Promise<{ success: boolean }> => {
  try {
    const response = await callGoogleAppsScript('updateBookingStatus', {
      bookingId,
      status,
    });
    
    // Invalidate cache
    await deleteCache('bookings');
    
    return response;
  } catch (error) {
    console.error('Error updating booking status:', error);
    throw error;
  }
};

export const cancelBooking = async (bookingId: string): Promise<{ success: boolean }> => {
  try {
    const response = await callGoogleAppsScript('cancelBooking', {
      bookingId,
    });
    
    // Invalidate cache
    await deleteCache('bookings');
    
    return response;
  } catch (error) {
    console.error('Error canceling booking:', error);
    throw error;
  }
};

// Invoice functions with caching
export const saveInvoice = async (invoice: Invoice): Promise<Invoice> => {
  try {
    const response = await callGoogleAppsScript('saveInvoice', invoice);
    
    // Invalidate caches
    await deleteCache('invoices');
    await deleteCache('bookings');
    
    return response;
  } catch (error) {
    console.error('Error saving invoice:', error);
    throw error;
  }
};

export const fetchAllInvoices = async (useCache = true): Promise<Invoice[]> => {
  try {
    // Try to get from cache first
    if (useCache) {
      const cached = await getCache('invoices');
      if (cached) {
        console.log('Returning invoices from cache');
        return cached;
      }
    }

    // Fetch from Google Apps Script
    const invoices = await callGoogleAppsScript('getInvoices');
    
    // Store in cache for 5 minutes
    await setCache('invoices', invoices, 300);
    
    return invoices;
  } catch (error) {
    console.error('Error fetching invoices:', error);
    throw error;
  }
};

export const updateInvoicePaymentStatus = async (
  invoiceId: string,
  paymentStatus: string
): Promise<{ success: boolean }> => {
  try {
    const response = await callGoogleAppsScript('updateInvoicePaymentStatus', {
      invoiceId,
      paymentStatus,
    });
    
    // Invalidate cache
    await deleteCache('invoices');
    
    return response;
  } catch (error) {
    console.error('Error updating invoice payment status:', error);
    throw error;
  }
};
```

### Step 4: Optional - Create Redis Utilities

Create `src/lib/cache-utils.ts` for advanced patterns:

```typescript
import { redisClient, setCache, getCache, deleteCache } from './redis-client';

// Cache booking with auto-invalidation
export const cacheBookingById = async (bookingId: string, booking: any, ttl = 3600) => {
  await setCache(`booking:${bookingId}`, booking, ttl);
};

export const getCachedBookingById = async (bookingId: string) => {
  return getCache(`booking:${bookingId}`);
};

// Rate limiting helper
export const isRateLimited = async (key: string, maxRequests = 10, windowSeconds = 60) => {
  if (!redisClient) return false;
  
  const count = await redisClient.incr(`rate-limit:${key}`);
  
  if (count === 1) {
    await redisClient.expire(`rate-limit:${key}`, windowSeconds);
  }
  
  return count > maxRequests;
};

// Session storage
export const setSession = async (sessionId: string, data: any, ttl = 86400) => {
  await setCache(`session:${sessionId}`, data, ttl);
};

export const getSession = async (sessionId: string) => {
  return getCache(`session:${sessionId}`);
};

// Cache statistics
export const getCacheStats = async () => {
  if (!redisClient) return null;
  
  try {
    const info = await redisClient.info('stats');
    return info;
  } catch (error) {
    console.error('Error getting cache stats:', error);
    return null;
  }
};
```

---

## Caching Strategies

### Strategy 1: Time-Based Expiration (Recommended)

```typescript
// Bookings are cached for 5 minutes
await setCache('bookings', bookingsData, 300);
```

**Pros**: Simple, predictable
**Cons**: Stale data possible

### Strategy 2: Invalidation on Write

```typescript
// Save booking
await callGoogleAppsScript('saveBooking', booking);

// Immediately clear cache
await deleteCache('bookings');
```

**Pros**: Always fresh when needed
**Cons**: More cache misses

### Strategy 3: Hybrid (Recommended)

```typescript
// Combine both strategies
export const fetchBookings = async () => {
  // Check cache first (5 min TTL)
  const cached = await getCache('bookings');
  if (cached) return cached;
  
  // Fetch from source
  const bookings = await callGoogleAppsScript('getBookings');
  
  // Cache for 5 minutes
  await setCache('bookings', bookings, 300);
  
  return bookings;
};

// On write, invalidate immediately
export const createBooking = async (booking) => {
  const result = await callGoogleAppsScript('saveBooking', booking);
  await deleteCache('bookings'); // Force fresh fetch
  return result;
};
```

---

## Monitoring and Debugging

### View Redis Logs

1. **Render Dashboard** → Your Redis service
2. **Logs** tab shows real-time activity

### Check Redis Connection

In your app, add this test endpoint:

```typescript
// In your backend or debug page
import { redisClient } from '@/lib/redis-client';

export const testRedisConnection = async () => {
  if (!redisClient) {
    return { connected: false, reason: 'REDIS_URL not set' };
  }
  
  try {
    const pong = await redisClient.ping();
    return { connected: true, message: pong };
  } catch (error) {
    return { connected: false, reason: error.message };
  }
};
```

### Monitor Redis Memory

```bash
# Via Render CLI (if installed)
render redis:info YOUR_REDIS_SERVICE_ID
```

Or check in Dashboard → Redis service → Info

### Clear Cache When Debugging

Add a debug endpoint:

```typescript
import { clearCache } from '@/lib/redis-client';

export const debugClearCache = async () => {
  await clearCache();
  return { message: 'Cache cleared' };
};
```

---

## Troubleshooting

### Redis Connection Fails

**Error**: `Error: connect ECONNREFUSED`

**Solution**:
1. Verify Redis service is running (Render Dashboard)
2. Check `REDIS_URL` is set in environment
3. Wait 2-3 minutes after creating Redis service

### Cache Not Working

**Check**: 
```typescript
if (!redisClient) {
  console.log('Redis not connected - caching disabled');
}
```

**Solution**: Ensure `REDIS_URL` environment variable is set

### High Memory Usage

**Solution**:
- Reduce TTL values (cache expires faster)
- Limit cache data size
- Use Render paid tier for more memory

### Stale Data Issues

**Solution**: Use shorter TTL or invalidation on write

```typescript
// Shorter cache: 1 minute instead of 5
await setCache('bookings', data, 60);
```

---

## Performance Benchmarks

### Without Redis (Direct API calls)
- Cold start: ~200ms
- Repeat requests: ~200ms each
- Google Sheets rate limit risk: Yes

### With Redis (Cached)
- Cold start: ~200ms (first time)
- Repeat requests: ~5ms (from cache)
- Google Sheets rate limit: Virtually eliminated

**Performance improvement**: 40x faster for cached data

---

## Best Practices

✅ **Always provide fallback** if Redis unavailable
✅ **Set reasonable TTL values** (300-3600 seconds)
✅ **Invalidate on writes** for consistency
✅ **Monitor cache hit rates** in production
✅ **Test locally** before deploying
✅ **Use namespaced keys** to avoid collisions (`booking:123` not `123`)
✅ **Handle connection errors gracefully**

---

## Cost Considerations

| Plan | Cost | Size | SSL |
|------|------|------|-----|
| Free | $0 | 1GB | No |
| Standard | $7/month | 25GB | Yes |
| Pro | $25/month | 100GB | Yes |

For production, recommend Standard tier ($7/month) for SSL and reliability.

---

## Next Steps

1. ✅ Create Redis service on Render
2. ✅ Install Redis client: `npm install redis`
3. ✅ Create `src/lib/redis-client.ts`
4. ✅ Update `google-apps-script.ts` with caching
5. ✅ Test locally and on Render
6. ✅ Monitor cache performance

Your app will now be significantly faster! 🚀
