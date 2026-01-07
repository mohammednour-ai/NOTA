# 🌸 NOTA Life - AI-Powered Perfume Recommendation Platform

<div align="center">

![NOTA Life](public/images/logo/nota2.jpg)

**Discover your perfect scent with AI**

[Live Demo](https://www.nota-life.com) • [Documentation](#documentation) • [Deployment Guide](#deployment)

</div>

---

## 🚀 Quick Start

### Local Development

```bash
# Install dependencies
npm install

# Create .env file with your API key
echo "ANTHROPIC_API_KEY=sk-ant-your-key" > .env
echo "PORT=3000" >> .env

# Start the server
npm start

# Open your browser
# Navigate to http://localhost:3000
```

### Deploy to Production

Your app is **ready to deploy**! Follow the [Visual Deployment Guide](DEPLOYMENT_VISUAL_GUIDE.html):

1. **Create GitHub Repository** (5 minutes)
2. **Deploy to Railway** (10 minutes)
3. **Connect Domain** (5 minutes)
4. **Wait for DNS** (1-2 hours)
5. **Go Live!** 🎉

**Detailed Guides:**
- 📖 [Deployment Checklist](DEPLOYMENT_CHECKLIST.md) - Complete step-by-step guide
- 🎯 [Quick Deploy](DEPLOY_NOW.md) - TL;DR version
- 📚 [Full Guide](DEPLOYMENT_GUIDE.md) - Comprehensive documentation
- 🎨 [Visual Guide](DEPLOYMENT_VISUAL_GUIDE.html) - Interactive HTML guide

---

## ✨ Features

### Core Features
- 🤖 **AI-Powered Recommendations** - Claude 3 Haiku analyzes 30 personalized questions
- 🎨 **Beautiful UI/UX** - Modern, responsive design inspired by premium beauty brands
- 🌈 **Dynamic Theming** - Color themes progress through the quiz journey
- 📱 **Mobile Responsive** - Optimized for all devices
- 🔗 **Affiliate Integration** - Amazon & ShareASale product links
- 🎯 **Personalized Results** - Custom recommendations based on preferences

### User Experience
- ✨ Stunning splash screen with gradient animations
- 🎭 30 carefully crafted questions covering:
  - Personal style & preferences
  - Fragrance notes & families
  - Occasion & lifestyle
  - Budget & brand preferences
- 🎪 3D carousel showcase for recommendations
- 💳 Direct purchase links to retailers
- 📊 Detailed perfume information

---

## 🛠️ Technology Stack

**Backend:**
- Node.js + Express
- Anthropic Claude API (AI recommendations)
- CORS & Body Parser middleware

**Frontend:**
- Pure HTML5, CSS3, JavaScript (ES6+)
- Responsive design
- CSS animations & transitions
- Progressive color theming

**Deployment:**
- Railway (recommended)
- Vercel / Render (alternatives)
- GoDaddy DNS
- Automatic SSL via Railway

**APIs:**
- Anthropic Claude 3 Haiku
- Amazon Product API (future)
- ShareASale API (future)

---

## 📁 Project Structure

```
d:\Lab2\
├── public/                      # Frontend files
│   ├── index.html              # Main quiz application
│   ├── script.js               # Quiz logic & API calls
│   ├── styles.css              # Styling & animations
│   ├── demo-data.js            # Demo recommendations
│   └── images/                 # Assets
│       ├── Splash/             # Splash screen images
│       └── logo/               # Logo files
├── server.js                   # Express server
├── perfume-database.js         # Perfume data & search
├── questions.json              # Quiz questions
├── package.json                # Dependencies
├── railway.json                # Railway config
├── Procfile                    # Process definition
├── .env                        # Environment variables (create this)
├── .gitignore                  # Git ignore rules
│
├── DEPLOYMENT_GUIDE.md         # Comprehensive deployment guide
├── DEPLOYMENT_CHECKLIST.md     # Step-by-step checklist
├── DEPLOY_NOW.md               # Quick reference
├── DEPLOYMENT_VISUAL_GUIDE.html # Interactive guide
│
├── README.md                   # This file
├── QUICKSTART.md               # Quick start guide
└── SETUP.html                  # Setup instructions
```

---

## 🔑 Environment Variables

Create a `.env` file in the root directory:

```env
# Required
ANTHROPIC_API_KEY=sk-ant-your-key-here
PORT=3000
NODE_ENV=production

# Optional (for affiliate features)
AMAZON_ASSOCIATE_TAG=your-tag-20
SHARESALE_AFFILIATE_ID=your-id
```

**Get Your Anthropic API Key:**
1. Visit [console.anthropic.com](https://console.anthropic.com)
2. Sign up or log in
3. Go to "API Keys"
4. Create a new key
5. Copy and paste into `.env`

---

## 📖 Documentation

### User Guides
- [Setup Instructions](SETUP.html) - Initial setup
- [Quick Start](QUICKSTART.md) - Get started in 5 minutes
- [Project Status](PROJECT_STATUS.md) - Current features

### Deployment
- [Visual Deployment Guide](DEPLOYMENT_VISUAL_GUIDE.html) - **Start here!**
- [Deployment Checklist](DEPLOYMENT_CHECKLIST.md) - Complete guide
- [Quick Deploy](DEPLOY_NOW.md) - TL;DR version
- [Full Guide](DEPLOYMENT_GUIDE.md) - Detailed documentation

### Development
- [Testing Guide](E2E_TESTING_GUIDE.md) - Testing scenarios
- [UI/UX Improvements](UI_UX_IMPROVEMENTS.md) - Design system
- [Splash Screen Guide](SPLASH_SCREEN_GUIDE.html) - Splash screen docs

---

## 🌐 Deployment

### Current Status: ✅ Ready to Deploy!

Your app is fully configured and ready for production deployment.

### Quick Deploy Steps

1. **Push to GitHub**
```bash
git remote add origin https://github.com/YOUR_USERNAME/nota-life.git
git branch -M main
git push -u origin main
```

2. **Deploy to Railway**
   - Sign up at [railway.app](https://railway.app)
   - Connect your GitHub repo
   - Add environment variables
   - Deploy automatically

3. **Connect Domain**
   - Add custom domain in Railway: `www.nota-life.com`
   - Update CNAME in GoDaddy DNS
   - Wait for DNS propagation (1-2 hours)

4. **Go Live!**
   - Test at https://www.nota-life.com
   - SSL automatically configured
   - Ready for users! 🎉

**Need Help?** Check [DEPLOYMENT_VISUAL_GUIDE.html](DEPLOYMENT_VISUAL_GUIDE.html)

---

## 💰 Cost Estimate

### Monthly Costs
- **Railway Hosting**: $5-15/month (first $5 free)
- **Domain**: Already purchased (yearly renewal)
- **Anthropic API**: ~$0.01-0.05 per quiz completion
- **SSL Certificate**: Free (via Railway)

**Total Estimated**: $5-20/month for moderate traffic

---

## 🧪 Testing

### Run Tests
```bash
# Start server
npm start

# Open test suite
http://localhost:3000/test
```

### Manual Testing
See [E2E_TESTING_GUIDE.md](E2E_TESTING_GUIDE.md) for comprehensive test scenarios.

### Test Checklist
- [ ] Splash screen loads correctly
- [ ] Quiz questions progress smoothly
- [ ] All 30 questions display
- [ ] Results page shows recommendations
- [ ] Images load properly
- [ ] Mobile responsive
- [ ] API returns valid results

---

## 🐛 Troubleshooting

### Common Issues

**App won't start:**
```bash
# Check if API key is set
echo $ANTHROPIC_API_KEY  # Linux/Mac
echo %ANTHROPIC_API_KEY% # Windows

# Verify dependencies
npm install

# Check logs
npm start
```

**API errors:**
- Verify API key is correct (starts with `sk-ant-`)
- Check Anthropic account has credits
- Review server logs for details

**Deployment issues:**
- See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)
- Check Railway logs in dashboard
- Verify environment variables are set

---

## 🚀 Features Roadmap

### Current Features
- ✅ 30-question personalized quiz
- ✅ AI-powered recommendations
- ✅ Beautiful splash screen
- ✅ 3D carousel results display
- ✅ Affiliate product links
- ✅ Mobile responsive design
- ✅ Production-ready deployment config

### Future Enhancements
- 🔄 User accounts & saved results
- 🔄 Social sharing capabilities
- 🔄 Advanced filtering options
- 🔄 Real-time inventory checking
- 🔄 Email recommendations
- 🔄 Analytics dashboard
- 🔄 A/B testing
- 🔄 Multi-language support

---

## 📝 License

ISC License - Feel free to modify and use for your purposes.

---

## 🤝 Contributing

This is a personal project, but suggestions are welcome! Feel free to:
- Open issues for bugs
- Suggest new features
- Improve documentation

---

## 📧 Support

- **Documentation**: Check the `docs/` folder
- **Deployment Issues**: See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)
- **Railway Help**: [docs.railway.app](https://docs.railway.app)
- **GoDaddy DNS**: [godaddy.com/help](https://www.godaddy.com/help)

---

## 🎉 Ready to Launch!

Your NOTA Life app is **production-ready** and configured for deployment. Follow the [Visual Deployment Guide](DEPLOYMENT_VISUAL_GUIDE.html) to get it live on **www.nota-life.com** in about 30 minutes!

**Quick Links:**
- 🎨 [Visual Guide](DEPLOYMENT_VISUAL_GUIDE.html) - Interactive deployment guide
- ✅ [Checklist](DEPLOYMENT_CHECKLIST.md) - Step-by-step process
- 🚀 [Quick Deploy](DEPLOY_NOW.md) - Fast reference
- 📚 [Full Docs](DEPLOYMENT_GUIDE.md) - Everything you need

---

<div align="center">

**Made with ❤️ for perfume lovers everywhere**

</div>
