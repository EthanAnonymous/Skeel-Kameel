# Render Migration Quick Start

Start here! This checklist will get your app from XAMPP to Render in 30 minutes.

## Pre-Migration Checklist (5 min)

- [ ] Google Apps Script is deployed and working
- [ ] You have your `VITE_GAS_DEPLOYMENT_URL`
- [ ] You have your `VITE_GAS_SHEET_ID`
- [ ] Your code is on GitHub
- [ ] You have a Render account (free: render.com)

## Files Already Created For You ✅

- ✅ `render.yaml` - Infrastructure configuration
- ✅ `.env.example` - Environment variables template
- ✅ Updated `server.js` - Port configuration fixed
- ✅ `RENDER_MIGRATION.md` - Detailed guide
- ✅ `RENDER_CODE_CHANGES.md` - Code changes explained
- ✅ `RENDER_REDIS_SETUP.md` - Optional Redis guide

## Deployment Steps (10 min)

### Step 1: Push Code to GitHub

```bash
cd c:\xampp\htdocs\overberg-transport-connect-main

# Check what changed
git status

# Commit all changes
git add .
git commit -m "Prepare for Render deployment with Google Sheets API"

# Push to GitHub
git push origin main
```

### Step 2: Create Render Web Service

1. Go to https://dashboard.render.com
2. Click **+ New** → **Web Service**
3. Connect your GitHub repository
4. Configure:
   - **Name**: `overberg-transport-web`
   - **Runtime**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `node server.js`
   - **Plan**: Free (for testing) or Paid (for production)

### Step 3: Add Environment Variables

In Render Dashboard, go to your Web Service → **Environment** and add:

```
VITE_GAS_DEPLOYMENT_URL=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
VITE_GAS_SHEET_ID=YOUR_GOOGLE_SHEET_ID
NODE_ENV=production
```

Replace `YOUR_DEPLOYMENT_ID` and `YOUR_GOOGLE_SHEET_ID` with your actual values.

### Step 4: Deploy

1. Click **Deploy**
2. Wait 3-5 minutes for build to complete
3. You'll see your live URL: `https://overberg-transport-web.onrender.com`

### Step 5: Test It

1. Open your Render URL in browser
2. Submit a test booking
3. Check your Google Sheet - data should appear in "Bookings" sheet

✅ **You're deployed!** 🎉

---

## Optional: Redis for Better Performance (5 min)

Redis caches your data so it's 40x faster. Optional but recommended.

### Create Redis Service

1. In Render Dashboard, click **+ New** → **Redis**
2. Name it: `overberg-transport-redis`
3. Plan: Free
4. Click **Create Redis**

Render automatically connects it to your web service and sets `REDIS_URL` environment variable.

Your app can use it - no code changes needed (gracefully falls back if Redis unavailable).

---

## Troubleshooting

### Build Failed
- Check logs in Render Dashboard
- Ensure `npm run build` works locally
- Verify `npm install` completes

### App won't start
- Check environment variables are set
- Look at logs for errors
- Ensure PORT environment variable is used (✅ already fixed)

### Data not appearing in Google Sheet
- Verify Google Apps Script is still deployed
- Check `VITE_GAS_DEPLOYMENT_URL` is correct
- Check Google Sheet permissions are "Anyone"

### "Cannot GET /"
- Wait 5 minutes for Render to fully start
- Refresh page
- Check logs for startup errors

---

## What's Different From XAMPP?

| Feature | XAMPP | Render |
|---------|-------|--------|
| **Hosting** | Local PHP | Cloud (Node.js) |
| **Database** | Google Sheets | Google Sheets (same!) |
| **Port** | 5510 (custom) | 3000 (standard) |
| **URL** | http://localhost:5510 | https://your-app.onrender.com |
| **Cost** | Free | Free (with limits) |
| **Uptime** | Manual | 24/7 automatic |
| **Scaling** | Manual | Automatic |

**Good news**: Your database connection remains unchanged! Google Sheets stays your database.

---

## Detailed Guides

Want more details? Check these:

1. **[RENDER_MIGRATION.md](./RENDER_MIGRATION.md)** - Complete migration guide
2. **[RENDER_CODE_CHANGES.md](./RENDER_CODE_CHANGES.md)** - Code changes explained
3. **[RENDER_REDIS_SETUP.md](./RENDER_REDIS_SETUP.md)** - Redis caching guide
4. **[GOOGLE_APPS_SCRIPT_SETUP.md](./GOOGLE_APPS_SCRIPT_SETUP.md)** - Google Sheets setup

---

## Post-Deployment Checklist

After successful deployment:

- [ ] App loads at your Render URL
- [ ] Booking form works
- [ ] Data appears in Google Sheet
- [ ] No errors in Render logs
- [ ] (Optional) Redis service created
- [ ] Custom domain configured (if needed)
- [ ] Team members notified of new URL

---

## Common Questions

**Q: Is my data safe on Render?**
A: Your data stays in Google Sheets (you control it). Render only runs your app.

**Q: Can I use my own domain?**
A: Yes! Render dashboard → Settings → Custom Domain

**Q: What if the free tier is too slow?**
A: Upgrade to paid tier ($7/month) for always-on service.

**Q: Do I still have XAMPP running?**
A: No need! Render replaces it. You can remove XAMPP after verification.

**Q: How do I update my app?**
A: Just push to GitHub. Render auto-deploys (takes 2-3 min).

**Q: Can I rollback to XAMPP?**
A: Yes! Your XAMPP is still there. Update DNS back if needed.

---

## Support Resources

- **Render Docs**: https://render.com/docs
- **Render Dashboard**: https://dashboard.render.com
- **Google Apps Script Logs**: Extensions → Apps Script → View → Logs
- **Render Logs**: Dashboard → your-service → Logs

---

## Next Steps After Deployment

### Immediate (Do Now)
- ✅ Verify app works
- ✅ Test all features
- ✅ Check error logs

### Short Term (This Week)
- [ ] (Optional) Set up Redis
- [ ] (Optional) Configure custom domain
- [ ] Set up monitoring alerts
- [ ] Train team on new URL

### Long Term
- [ ] Plan database backup strategy (Google Sheets)
- [ ] Monitor performance metrics
- [ ] Consider paid tier if needed
- [ ] Plan mobile app testing

---

## Success! 🎉

Your app is now:
- ✅ Running on Render
- ✅ Connecting to Google Sheets
- ✅ Accessible 24/7
- ✅ Auto-deploying from GitHub
- ✅ Faster and more reliable

**That's it! You've successfully migrated from XAMPP to Render.**

Questions? Check the detailed guides above.

