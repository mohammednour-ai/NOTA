# NOTA Life - Quick Deployment Steps

## 1. Prerequisites Check ✅
- [ ] You have a GitHub account
- [ ] Your Anthropic API key is ready (starts with sk-ant-)
- [ ] Domain www.nota-life.com is in your GoDaddy account

## 2. Push to GitHub (5 minutes)

```bash
# Initialize git if needed
git init
git add .
git commit -m "Ready for deployment"

# Create repo on GitHub: https://github.com/new
# Name it: nota-life

# Push code
git remote add origin https://github.com/YOUR_USERNAME/nota-life.git
git branch -M main
git push -u origin main
```

## 3. Deploy to Railway (10 minutes)

1. **Go to Railway**: https://railway.app
2. **Login** with GitHub
3. **New Project** → "Deploy from GitHub repo"
4. **Select** your `nota-life` repository
5. **Add Environment Variables**:
   - Click your service → "Variables" tab
   - Add: `ANTHROPIC_API_KEY` = your actual key
   - Add: `PORT` = 3000
   - Add: `NODE_ENV` = production
6. **Wait for deployment** (2-5 minutes)
7. **Copy your Railway URL** from Settings → Domains

## 4. Connect Domain to Railway (15 minutes)

### In Railway:
1. Go to Settings → "Domains"
2. Click "Custom Domain"
3. Enter: `www.nota-life.com`
4. Copy the CNAME target (e.g., `your-app.up.railway.app`)

### In GoDaddy:
1. Login to GoDaddy: https://www.godaddy.com
2. My Products → Click DNS next to your domain
3. Add/Edit CNAME record:
   - **Type**: CNAME
   - **Name**: www
   - **Value**: [paste Railway CNAME target]
   - **TTL**: 600 seconds
4. Save

### Wait for DNS:
- Takes 10 minutes to 2 hours
- Test: https://www.nota-life.com

## 5. Test Your Live Site ✅

Visit: https://www.nota-life.com
- [ ] Site loads correctly
- [ ] Quiz starts
- [ ] Questions appear
- [ ] Results show recommendations
- [ ] Images display
- [ ] Works on mobile

---

## Troubleshooting

**App won't start?**
- Check Railway logs for errors
- Verify API key is correct

**Domain not working?**
- Wait 1-2 hours for DNS
- Clear browser cache
- Try incognito mode

**Need help?**
- See full guide: `DEPLOYMENT_GUIDE.md`
- Railway docs: https://docs.railway.app
- GoDaddy DNS help: https://www.godaddy.com/help/manage-dns-680

---

## You're Done! 🎉

Your app is live at:
- **Custom Domain**: https://www.nota-life.com
- **Railway URL**: https://your-app.up.railway.app

Time to celebrate! 🥳
