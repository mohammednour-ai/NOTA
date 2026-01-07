# NOTA Life - Deployment Guide 🚀

## Overview
This guide will help you deploy NOTA (www.nota-life.com) to production using Railway and connect it to your GoDaddy domain.

## Prerequisites
- ✅ Domain purchased from GoDaddy: www.nota-life.com
- ✅ GitHub account
- ✅ Anthropic API key (Claude)
- ✅ Node.js app ready for deployment

---

## Deployment Steps

### Step 1: Initialize Git Repository (If Not Already Done)

```bash
# Navigate to your project directory
cd d:\Lab2

# Initialize git
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit - NOTA Life app ready for deployment"
```

### Step 2: Create GitHub Repository

1. Go to [GitHub](https://github.com) and log in
2. Click the "+" icon → "New repository"
3. Name it: `nota-life`
4. Make it **Private** (recommended for now)
5. **Do NOT** initialize with README, .gitignore, or license
6. Click "Create repository"

### Step 3: Push Code to GitHub

```bash
# Add GitHub as remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/nota-life.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### Step 4: Deploy to Railway

1. **Sign Up/Login to Railway**
   - Go to [railway.app](https://railway.app)
   - Click "Login" and sign in with GitHub
   - Authorize Railway to access your GitHub account

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your `nota-life` repository
   - Railway will automatically detect it's a Node.js app

3. **Configure Environment Variables**
   - Click on your deployed service
   - Go to "Variables" tab
   - Add the following variables:
     ```
     ANTHROPIC_API_KEY=sk-ant-your-actual-key-here
     PORT=3000
     NODE_ENV=production
     ```
   - Click "Add" for each variable

4. **Wait for Deployment**
   - Railway will automatically build and deploy your app
   - This takes 2-5 minutes
   - You'll see build logs in real-time
   - When complete, you'll see a green "Active" status

5. **Get Your Railway URL**
   - Click "Settings" tab
   - Under "Domains", you'll see your default Railway URL
   - It looks like: `nota-life-production.up.railway.app`
   - Click to test it - your app should be live! 🎉

### Step 5: Connect Custom Domain (GoDaddy → Railway)

1. **Generate Domain in Railway**
   - In Railway, go to your project → "Settings" → "Domains"
   - Click "Custom Domain"
   - Enter: `www.nota-life.com`
   - Railway will show you the CNAME record you need to add

2. **Configure DNS in GoDaddy**
   - Log in to [GoDaddy](https://www.godaddy.com)
   - Go to "My Products" → Find your domain → Click "DNS"
   - Look for existing records for "www"

3. **Add/Update CNAME Record**
   - Click "Add" or edit existing "www" record
   - **Type**: CNAME
   - **Name**: www
   - **Value**: `your-app-name.up.railway.app` (from Railway)
   - **TTL**: 600 seconds (10 minutes)
   - Click "Save"

4. **Add Root Domain (Optional)**
   - If you want `nota-life.com` (without www) to work:
   - **Type**: A
   - **Name**: @
   - **Value**: Get IP from Railway or use forwarding
   - Or set up domain forwarding: `nota-life.com` → `www.nota-life.com`

5. **Wait for DNS Propagation**
   - DNS changes take 10 minutes to 48 hours
   - Usually works within 1-2 hours
   - Test with: `https://www.nota-life.com`

### Step 6: Verify SSL Certificate

- Railway automatically provides free SSL certificates
- Once DNS propagates, `https://www.nota-life.com` will work with SSL
- SSL certificates auto-renew every 90 days

---

## Quick Railway Alternative Options

If you prefer other platforms, here are alternatives:

### Option A: Vercel (Good for full-stack apps)
```bash
npm install -g vercel
vercel login
vercel --prod
```

### Option B: Render (Free tier available)
1. Go to [render.com](https://render.com)
2. Connect GitHub
3. Create "Web Service"
4. Connect custom domain in settings

### Option C: Heroku (Classic, paid only now)
```bash
heroku login
heroku create nota-life
git push heroku main
heroku config:set ANTHROPIC_API_KEY=your-key
```

---

## Environment Variables Required

Create these in your hosting platform:

```env
# Required
ANTHROPIC_API_KEY=sk-ant-your-key-here
PORT=3000
NODE_ENV=production

# Optional (if you add affiliate features)
AMAZON_ASSOCIATE_TAG=your-tag-20
SHARESALE_AFFILIATE_ID=your-id
```

---

## Post-Deployment Checklist

- [ ] App is accessible at Railway URL
- [ ] API endpoints work (test quiz)
- [ ] Claude AI recommendations work
- [ ] Images load correctly
- [ ] Custom domain points to Railway
- [ ] HTTPS works on custom domain
- [ ] Mobile responsive design works
- [ ] Test the full user flow

---

## Monitoring & Maintenance

### Railway Dashboard
- View logs: Project → "Deployments" → Click deployment → "View Logs"
- Monitor usage: Check "Metrics" tab
- Set up alerts: "Settings" → "Notifications"

### Automatic Deployments
- Every push to `main` branch triggers auto-deploy
- To disable: Settings → "Auto Deploy" → Toggle off

### Update Environment Variables
- Railway Dashboard → "Variables" → Add/Edit/Delete
- Changes apply immediately (may need restart)

---

## Troubleshooting

### App Won't Start
1. Check Railway logs for errors
2. Verify `PORT` environment variable is set
3. Ensure all dependencies are in `package.json`
4. Check that `npm start` command works locally

### API Errors
1. Verify `ANTHROPIC_API_KEY` is set correctly
2. Check API key has sufficient credits
3. View server logs for detailed error messages

### Domain Not Working
1. Verify CNAME record is correct in GoDaddy
2. Wait 1-2 hours for DNS propagation
3. Use [DNS Checker](https://dnschecker.org) to verify
4. Clear browser cache and try incognito mode

### SSL Certificate Issues
- Railway handles SSL automatically
- If not working, check domain is verified in Railway
- May take up to 24 hours for first SSL cert

---

## Costs

### Railway Pricing
- **Free Tier**: $5 credit/month (should cover small traffic)
- **Usage-based**: $0.000463/GB-hour for resources
- **Estimate**: ~$5-20/month for moderate traffic

### Domain (Already Paid)
- GoDaddy domain: Yearly renewal
- SSL: Free via Railway

---

## Support & Resources

### Railway
- [Railway Docs](https://docs.railway.app)
- [Railway Discord](https://discord.gg/railway)

### Domain Configuration
- [GoDaddy DNS Help](https://www.godaddy.com/help/manage-dns-680)

### Project Documentation
- See `README.md` for app features
- See `QUICKSTART.md` for local development

---

## Next Steps After Deployment

1. **Test Everything**
   - Run through complete quiz flow
   - Verify all pages load
   - Test on mobile devices

2. **Set Up Analytics** (Optional)
   - Add Google Analytics
   - Monitor user behavior
   - Track conversion rates

3. **Set Up Monitoring** (Optional)
   - Use UptimeRobot for uptime monitoring
   - Set up error tracking (Sentry)

4. **Marketing**
   - Share your live URL
   - Test SEO optimization
   - Set up social media presence

---

## Quick Command Reference

```bash
# View Railway logs
railway logs

# Deploy manually
git push origin main

# Restart Railway service
# (Do this in Railway dashboard)

# Check environment variables
railway variables

# Link local project to Railway
railway link
```

---

## Success! 🎉

Your app should now be live at:
- **Railway URL**: `https://your-app.up.railway.app`
- **Custom Domain**: `https://www.nota-life.com`

Test it, share it, and enjoy your live app!

---

*Need help? Check the logs, verify environment variables, and test locally first.*
