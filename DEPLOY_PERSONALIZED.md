# 🚀 NOTA Life - Personalized Deployment Script
# For GitHub user: mohammednour-ai

## Your Quick Deployment Commands

### Step 1: Push to GitHub (2 minutes)

Copy and paste these commands in PowerShell:

```powershell
# Make sure you're in the project directory
cd d:\Lab2

# Add your GitHub repository as remote
git remote add origin https://github.com/mohammednour-ai/NOTA.git

# Push your code to GitHub
git branch -M main
git push -u origin main
```

**Note**: GitHub will ask you to authenticate. Follow the prompts to login.

---

### Step 2: Create GitHub Repository First!

Before running the commands above, create your repository:

1. Go to: https://github.com/new
2. Repository name: `NOTA`
3. Make it **Private** (recommended)
4. **Do NOT** check any initialization options
5. Click "Create repository"

---

### Step 3: Deploy to Railway (10 minutes)

1. **Sign up/Login to Railway**
   - Go to: https://railway.app
   - Click "Login with GitHub"
   - Authorize Railway

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose `mohammednour-ai/NOTA`
   - Railway will auto-detect and start deploying

3. **Add Environment Variables**
   - Click your service → "Variables" tab
   - Add these three variables:
   
   ```
   ANTHROPIC_API_KEY=sk-ant-your-actual-key-here
   PORT=3000
   NODE_ENV=production
   ```
   
   ⚠️ **Replace the API key with your real one!**

4. **Get Your Railway URL**
   - Go to Settings → Domains
   - Copy your Railway URL (e.g., `nota-life-production.up.railway.app`)
   - Test it in your browser

---

### Step 4: Connect Domain (5 minutes)

#### In Railway:
1. Settings → Domains → "+ Custom Domain"
2. Enter: `www.nota-life.com`
3. Copy the CNAME value Railway shows you

#### In GoDaddy:
1. Login: https://www.godaddy.com
2. My Products → nota-life.com → DNS
3. Add CNAME record:
   - **Type**: CNAME
   - **Name**: www
   - **Value**: [paste from Railway]
   - **TTL**: 600
4. Save

#### Wait for DNS (1-2 hours)
- Check progress: https://dnschecker.org
- Enter: www.nota-life.com
- Select: CNAME

---

### Step 5: Test & Go Live! 🎉

Visit: https://www.nota-life.com

Test checklist:
- [ ] Site loads with HTTPS
- [ ] Splash screen appears
- [ ] Quiz works (all 30 questions)
- [ ] Results page shows recommendations
- [ ] Images display correctly
- [ ] Works on mobile

---

## Your GitHub Repository URL

Your repo will be at: **https://github.com/mohammednour-ai/NOTA**

---

## Quick Links

- **GitHub Repo**: https://github.com/mohammednour-ai/NOTA (create this first!)
- **Railway**: https://railway.app
- **GoDaddy**: https://www.godaddy.com
- **Anthropic API**: https://console.anthropic.com
- **DNS Checker**: https://dnschecker.org

---

## Copy-Paste Commands Summary

```powershell
# Step 1: Push to GitHub (after creating the repo)
cd d:\Lab2
git remote add origin https://github.com/mohammednour-ai/NOTA.git
git branch -M main
git push -u origin main
```

That's it! Then follow the Railway and DNS steps above.

---

## Troubleshooting

**Authentication error when pushing?**
- GitHub will prompt you to login
- Use your browser to authenticate
- Or use: `gh auth login` if you have GitHub CLI

**Repository doesn't exist?**
- Make sure you created the repo first at: https://github.com/new
- Name must be exactly: `NOTA`

**Need more help?**
- Visual Guide: Open `DEPLOYMENT_VISUAL_GUIDE.html`
- Full Guide: Read `DEPLOYMENT_GUIDE.md`
- Checklist: Read `DEPLOYMENT_CHECKLIST.md`

---

## Timeline

- **Create GitHub repo**: 2 minutes
- **Push code**: 2 minutes
- **Railway deployment**: 10 minutes
- **DNS configuration**: 5 minutes
- **DNS propagation wait**: 1-2 hours
- **Testing**: 5 minutes

**Total active time**: ~20 minutes
**Total time to live**: ~2-3 hours

---

## 🎯 Ready? Start Now!

1. **First**: Create your GitHub repo at https://github.com/new (name it: NOTA)
2. **Then**: Run the PowerShell commands above
3. **Next**: Deploy to Railway
4. **Finally**: Connect your domain

You'll be live at **www.nota-life.com** in just a few hours! 🚀

---

*Your personalized deployment guide for mohammednour-ai*
