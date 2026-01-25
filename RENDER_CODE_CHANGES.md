# Code Changes for Render Deployment

This document details all code changes needed for Render deployment and explains why each change is necessary.

## Summary of Changes

| File | Change | Reason |
|------|--------|--------|
| `server.js` | Use `process.env.PORT` | Render uses PORT=3000 at runtime |
| `.env.example` | Add detailed comments | Help new developers with setup |
| `vite.config.ts` | No changes needed | Already optimized for production |
| `google-apps-script.ts` | No changes needed | Already uses environment variables |
| `firebase.ts` | No changes needed | Works with environment variables |

## Detailed Changes

### 1. server.js - Port Configuration

**Change Made**: Allow port to be set via environment variable

**Before**:
```javascript
const PORT = 5510;
```

**After**:
```javascript
const PORT = process.env.PORT || 5510;
```

**Why**: 
- Render automatically sets `PORT=3000` when the app starts
- Local development continues to use port 5510
- Renders to both environments seamlessly

**Impact**: ✅ Zero breaking changes

---

### 2. .env.example - Environment Variables

**Change Made**: Complete restructure with detailed documentation

**Before**:
```dotenv
VITE_GAS_DEPLOYMENT_URL=https://script.google.com/macros/s/...
```

**After**:
```dotenv
# Google Apps Script Configuration
VITE_GAS_DEPLOYMENT_URL=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
VITE_GAS_SHEET_ID=YOUR_GOOGLE_SHEET_ID

# Firebase Configuration (Optional)
# VITE_FIREBASE_API_KEY=...

# Server Configuration
PORT=5510
NODE_ENV=production

# Redis Configuration (Optional)
# REDIS_URL=...
```

**Why**:
- Clear documentation for team members
- Explains where each variable comes from
- Groups related configurations
- Makes it obvious which are optional

**Impact**: ✅ Informational only, no code changes

---

### 3. render.yaml - New File

**Purpose**: Defines your Render infrastructure as code

**What it does**:
- Defines web service (Node.js app)
- Defines Redis service (optional)
- Sets environment variables
- Configures build and start commands

**Implementation**:
```bash
# Push to GitHub
git add render.yaml .env.example server.js
git commit -m "Update for Render deployment"
git push origin main

# Render will automatically detect and use render.yaml
```

**Impact**: ✅ New file, no changes to existing code

---

## Environment Variables Explained

### Required Variables (Google Apps Script)

#### `VITE_GAS_DEPLOYMENT_URL`
- **Source**: Google Apps Script deployment
- **Format**: `https://script.google.com/macros/s/YOUR_ID/exec`
- **Get it**: 
  1. Open Google Apps Script
  2. Click Deploy → Manage deployments
  3. Copy the URL under "Latest version"

#### `VITE_GAS_SHEET_ID`
- **Source**: Google Sheet URL
- **Format**: Long alphanumeric string
- **Get it**: Extract from `https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/edit`

### Optional Variables

#### Firebase (Only needed if using Firebase)
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`

#### Redis (Only needed if using Redis)
- `REDIS_URL`: Automatically set by Render if Redis service is added

---

## How Environment Variables Flow

```
render.yaml
    ↓
Render Platform (reads render.yaml)
    ↓
Sets environment variables at runtime
    ↓
Your Node.js app starts with process.env
    ↓
Vite replaces import.meta.env.VITE_* during build
    ↓
Browser receives code with actual URLs
```

---

## No Changes Needed - Already Render-Ready

### vite.config.ts ✅

Your configuration is optimal:
```typescript
export default defineConfig({
  build: {
    outDir: 'dist',           // ✅ Correct
    sourcemap: false,         // ✅ Good for production
    minify: 'terser',         // ✅ Best performance
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
```

No changes needed.

### google-apps-script.ts ✅

Already uses environment variables correctly:
```typescript
const GAS_DEPLOYMENT_URL = import.meta.env.VITE_GAS_DEPLOYMENT_URL
```

This automatically reads from:
1. `.env.local` (local development)
2. Render environment variables (production)

No changes needed.

### firebase.ts ✅

Already uses environment variables correctly:
```typescript
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'YOUR_API_KEY',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '...',
  // ...
};
```

No changes needed.

---

## Build Process on Render

When you push to GitHub:

1. **Render detects `render.yaml`**
2. **Runs build command**: `npm install && npm run build`
   - Installs dependencies
   - Runs Vite build
   - Outputs to `dist/` folder
   - Vite replaces environment variables
3. **Runs start command**: `node server.js`
   - Starts Node.js server
   - Listens on port 3000 (from Render's PORT env var)
   - Serves `dist/index.html` for all routes (SPA routing)

---

## Testing Locally

### Simulate Render environment locally:

```bash
# Build production bundle
npm run build

# Set environment variables
export PORT=3000
export VITE_GAS_DEPLOYMENT_URL=https://script.google.com/macros/s/YOUR_ID/exec
export VITE_GAS_SHEET_ID=YOUR_SHEET_ID

# Start server like Render does
node server.js
```

Visit `http://localhost:3000` - should work identically to Render.

---

## Troubleshooting Code Issues

### "Cannot find module" errors

**Cause**: Import path issues

**Solution**:
```typescript
// ✅ Good - uses alias from vite.config.ts
import { saveBooking } from '@/lib/google-apps-script';

// ❌ Bad - relative paths can break
import { saveBooking } from '../../../lib/google-apps-script';
```

### Environment variable undefined

**Cause**: Variable not set in Render

**Solution**:
1. Check Render Dashboard → Environment
2. Ensure variable name starts with `VITE_` for Vite
3. Redeploy after adding variables

### SPA routing not working

**Cause**: Server not redirecting routes to index.html

**Status**: ✅ Your server.js already handles this correctly

### Server won't start on port 3000

**Cause**: PORT environment variable not being read

**Solution**: ✅ Already fixed in server.js with `process.env.PORT || 5510`

---

## Performance Optimization

Your build is already optimized for Render:

✅ Code splitting (Vite does this automatically)
✅ Minification enabled (terser)
✅ Source maps disabled (smaller bundles)
✅ React SWC compiler (faster builds)
✅ Tailwind CSS purging (smaller CSS)

No additional changes needed.

---

## Security Checklist

- ✅ Environment variables for secrets (never hardcode URLs)
- ✅ `.env.local` in `.gitignore` (never commit secrets)
- ✅ CORS handled by Google Apps Script ("Anyone" access)
- ✅ Server prevents directory traversal attacks
- ✅ No sensitive data in build output

---

## Next Steps

1. ✅ Update server.js (done)
2. ✅ Update .env.example (done)
3. ✅ Create render.yaml (done)
4. **Commit changes**:
   ```bash
   git add server.js .env.example render.yaml
   git commit -m "Prepare for Render deployment"
   git push origin main
   ```
5. **Deploy on Render** (see RENDER_MIGRATION.md)
