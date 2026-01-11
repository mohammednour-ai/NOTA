# ✅ YOUR GOOGLE API CREDENTIALS - READY TO USE!

Copy these TWO lines and add them to your `.env` file:

```
GOOGLE_API_KEY=AIzaSyBAVF0OMiUEJf7OVVP_iq77JncjIBXvf7U
GOOGLE_SHOPPING_CX=030521f618b0b4c48
```

---

## 📝 STEP-BY-STEP:

### 1. Open your `.env` file
Location: `D:\Lab2\.env`

If it doesn't exist, create it!

### 2. Add these lines at the TOP of the file:
```
GOOGLE_API_KEY=AIzaSyBAVF0OMiUEJf7OVVP_iq77JncjIBXvf7U
GOOGLE_SHOPPING_CX=030521f618b0b4c48
```

### 3. Your complete `.env` file should look like:
```bash
# Google Shopping API Configuration
GOOGLE_API_KEY=AIzaSyBAVF0OMiUEJf7OVVP_iq77JncjIBXvf7U
GOOGLE_SHOPPING_CX=030521f618b0b4c48

# Server Configuration
PORT=3001
USE_DIRECT_SCRAPING=true

# Anthropic Claude API (for quiz analysis)
ANTHROPIC_API_KEY=your_anthropic_api_key_here

# Email Configuration (optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
ADMIN_EMAIL=your-email@gmail.com

# Email Capture Mode
EMAIL_CAPTURE_MODE=always

# Affiliate Configuration (optional)
AMAZON_ASSOCIATE_TAG=nota0c-20
SHARESALE_AFFILIATE_ID=youraffid

# Environment
NODE_ENV=development
```

---

## 🧪 READY TO TEST!

After saving `.env` file, run:

```bash
node test-google-api.js
```

**You should see:**
```
✅ Google API Key: Configured (AIzaSyBAVF...f7U)
✅ Google Search CX: Configured (030521f618...c48)

📍 Searching for: Dior Sauvage EDP 100ml
✅ TOTAL RESULTS: 15+ products found

📦 Sample Results:
   1. Dior Sauvage Eau de Parfum (Amazon US) - $129.99
   2. DIOR Sauvage 100ml (Sephora CA) - $180.00
   ...
```

---

## 🚀 THEN LAUNCH YOUR SITE!

```bash
node server.js
```

Open: http://localhost:3001

Complete the quiz and you'll see **"Where to Buy"** sections with direct links! 🎉

---

## 📋 QUICK REFERENCE:

**Your API Key:** `AIzaSyBAVF0OMiUEJf7OVVP_iq77JncjIBXvf7U`
**Your CX ID:** `030521f618b0b4c48`

**File to edit:** `D:\Lab2\.env`
**Test command:** `node test-google-api.js`
**Launch command:** `node server.js`

---

**Save this file! Then add the credentials to `.env` and test!** ✅
