# 🚀 QUICK START - GOOGLE SHOPPING API

## ✅ IMPLEMENTATION STATUS: COMPLETE!

Your system now includes:
- ✅ Google Shopping API integration
- ✅ Hybrid fallback to web scraping
- ✅ All code updated and ready
- ✅ Test scripts created

---

## 🎯 OPTION 1: Test WITHOUT API First (2 minutes)

### Test with web scraping only:

```powershell
cd D:\Lab2
node test-google-shopping.js
```

**Expected:**
- ⚠️ "Google Shopping API not configured"
- ✅ System uses web scraping
- ✅ Gets 3-8 products per search
- ⏱️ Takes ~30 seconds per search

---

## 🎯 OPTION 2: Enable Google API (20 minutes)

### Step 1: Get Google Credentials (15 minutes)

Follow the detailed guide: **`GOOGLE_SHOPPING_API_SETUP.md`**

**Quick summary:**
1. Go to https://console.cloud.google.com/
2. Create new project: "PerfumeQuiz"
3. Enable "Custom Search API"
4. Create API Key
5. Go to https://programmablesearchengine.google.com/
6. Create Search Engine with `*.com`
7. Get Search Engine ID

---

### Step 2: Add Credentials to .env (1 minute)

Open your `.env` file and add:

```env
GOOGLE_API_KEY=AIzaSyXxXxXxXxXxXxXxXxXxXxXxXxXxXxX
GOOGLE_SHOPPING_CX=a1b2c3d4e5f6g7h8i9j
```

**Replace with your actual credentials!**

---

### Step 3: Test With API (2 minutes)

```powershell
cd D:\Lab2
node test-google-shopping.js
```

**Expected:**
- ✅ "Google Shopping API configured!"
- ✅ 15-25 products per search
- ✅ 10+ unique retailers
- ⚡ 2-3 seconds per search
- 🎉 Results show "Source: Google Shopping API"

---

## 📊 WHAT YOU'LL SEE

### Test Output Example:

```
################################################################################
🧪 TESTING GOOGLE SHOPPING API INTEGRATION
################################################################################

📋 Checking Configuration...

   GOOGLE_API_KEY: ✅ Set
   GOOGLE_SHOPPING_CX: ✅ Set

✅ Google Shopping API configured!

================================================================================
TEST 1/5: Chanel Coco Mademoiselle EDP 100ml
================================================================================

🔍 Hybrid Search: Chanel Coco Mademoiselle

[Google Shopping US] Searching for: Chanel Coco Mademoiselle EDP 100ml
[Google Shopping US] Found 12 products in 1.85s

[Google Shopping CA] Searching for: Chanel Coco Mademoiselle EDP 100ml
[Google Shopping CA] Found 8 products in 1.92s

✅ SUCCESS via Google Shopping API!
   Found 20 products from 12 retailers
   Duration: 2.15s
   Status: FAST PATH (no scraping needed) ⚡

📊 RESULTS:
   Products Found: 20
   Unique Retailers: 12
   Duration: 2.15s

   Top 5 Products:
   1. FragranceNet - Chanel Coco Mademoiselle Eau de Parfum Spray 100ml...
      Price: $89.99 | Confidence: 95% | Source: Google Shopping API
   2. Nordstrom - CHANEL COCO MADEMOISELLE Eau de Parfum Spray...
      Price: $138.00 | Confidence: 95% | Source: Google Shopping API
   3. Sephora - Coco Mademoiselle Eau de Parfum...
      Price: $138.00 | Confidence: 95% | Source: Google Shopping API
   ...
```

---

## 🎛️ SYSTEM BEHAVIOR

### Scenario A: API Configured + Good Results
```
User searches → Google API called → Returns 15+ products → DONE! ✅
Time: 2-3 seconds ⚡
```

### Scenario B: API Configured + Few Results
```
User searches → Google API called → Returns only 3 products → Fallback to scraping → Combined results
Time: 10-15 seconds
```

### Scenario C: No API Configured
```
User searches → Skip Google API → Web scraping only → Results
Time: 30-40 seconds (same as before)
```

---

## 🔍 HOW TO CHECK IT'S WORKING

### 1. Check Logs

When you run the test or use the demo:
- ✅ Look for: `"✅ SUCCESS via Google Shopping API!"`
- ✅ Look for: `"Source: Google Shopping API"` in products
- ❌ If you see: `"⚠️ Google API returned only X products"` → Falling back to scraping

### 2. Check Speed
- With API: 2-5 seconds ⚡
- Without API: 30-40 seconds

### 3. Check Retailers
- With API: 10-15+ retailers (Nordstrom, Ulta, Macy's, FragranceNet, etc.)
- Without API: 2-4 retailers (Amazon, Sephora)

---

## 🧪 TESTING OPTIONS

### Option 1: Command Line Test
```powershell
node test-google-shopping.js
```
Tests 5 perfumes, shows detailed results

### Option 2: Demo Page
```powershell
npm start
```
Then visit: http://localhost:3001/demo
- Enter perfume name
- See real-time results
- Visual interface

### Option 3: API Endpoint
```powershell
# Start server
npm start

# Test in browser
http://localhost:3001/api/search?query=Chanel+Coco+Mademoiselle+EDP+100ml
```

---

## 💰 COST TRACKING

### Check Your Usage:
1. Go to https://console.cloud.google.com/
2. Select your project
3. Go to "APIs & Services" → "Dashboard"
4. Click "Custom Search API"
5. See request count

### Free Tier:
- 100 searches/day = FREE
- Perfect for testing and low traffic sites

### If You Exceed:
- Billing kicks in at $5 per 1,000 searches
- Set up budget alerts in Google Cloud Console

---

## ❌ TROUBLESHOOTING

### "API key not valid"
1. Check `.env` has correct API key
2. Go to Google Cloud Console
3. Verify API key under "Credentials"
4. Make sure "Custom Search API" is enabled

### "No results from Google"
1. Check Search Engine configuration
2. Make sure it includes `*.com` or shopping sites
3. System will automatically fallback to scraping

### "Quota exceeded"
1. You hit 100 free searches/day
2. Wait until tomorrow OR enable billing
3. Check usage in Google Cloud Console

### Still not working?
- Run without Google API (remove credentials from `.env`)
- System falls back to web scraping automatically
- No downtime!

---

## 📁 FILES REFERENCE

All documentation:
- **`GOOGLE_SHOPPING_API_SETUP.md`** - Detailed setup guide
- **`GOOGLE_API_IMPLEMENTATION_COMPLETE.md`** - Full implementation details
- **`QUICK_START.md`** - This file
- **`ENV_TEMPLATE.txt`** - Environment variables template

Test scripts:
- **`test-google-shopping.js`** - Test the hybrid system
- **`test-local-perfumes.js`** - Original test (still works)

Main code:
- **`lib/google-shopping-adapter.js`** - Google API integration
- **`lib/hybrid-retailer-aggregator.js`** - Smart switching logic
- **`routes/search-api.js`** - API endpoint (updated)
- **`server.js`** - Main server (updated)

---

## ✅ CHECKLIST

**Before enabling API:**
- [ ] Read `GOOGLE_SHOPPING_API_SETUP.md`
- [ ] Run `node test-google-shopping.js` (without API)
- [ ] Confirm web scraping works

**Setting up API:**
- [ ] Create Google Cloud project
- [ ] Enable Custom Search API
- [ ] Create API key
- [ ] Create Search Engine
- [ ] Get Search Engine ID
- [ ] Add both to `.env` file

**Testing API:**
- [ ] Run `node test-google-shopping.js`
- [ ] See "✅ Google Shopping API configured!"
- [ ] Get 10+ retailers in results
- [ ] Response time < 5 seconds
- [ ] Check logs for "Source: Google Shopping API"

**Production:**
- [ ] Monitor usage in Google Cloud Console
- [ ] Set up billing alerts
- [ ] Enable caching (already done)
- [ ] Test with real users

---

## 🎉 YOU'RE READY!

### To test now (without API):
```powershell
node test-google-shopping.js
```

### To enable API:
Open **`GOOGLE_SHOPPING_API_SETUP.md`** and follow step-by-step instructions.

### Questions?
Check the other documentation files or run the test to see how it works!

---

**Built and ready to deploy!** 🚀
