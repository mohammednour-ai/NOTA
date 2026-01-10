# 🧪 Scraper Demo Page - Quick Start Guide

## 🎯 Access the Demo

**URL:** http://localhost:3001/demo

The demo page is now live and ready to test!

---

## 📸 What You'll See

### Beautiful Demo Interface
- **Purple gradient background** with modern design
- **Search input** with real-time testing
- **Quick example buttons** for instant testing
- **Live retailer cards** with confidence scores
- **Best deal highlighting** in green
- **Product normalization display**

---

## 🚀 How to Use

### 1. Enter a Perfume Name
Type any perfume in the search box:
```
Examples:
- Chanel Coco Mademoiselle EDP 100ml
- Dior Sauvage EDT 100ml
- Tom Ford Oud Wood
- Ariana Grande Cloud
- YSL Black Opium
```

### 2. Click Search (or press Enter)
The system will:
- ✅ Normalize the product (brand, line, concentration, size)
- ✅ Check cache (1-hour TTL)
- ✅ Scrape 6 retailers in parallel (if not cached)
- ✅ Validate with 80+ confidence threshold
- ✅ Display sorted results

### 3. View Results
You'll see:
- **Product Information Card** - Normalized brand, line, concentration, size
- **Statistics Bar** - Number of retailers, average confidence, cache status
- **Retailer Cards** - Each with:
  - Retailer name
  - Price (if available)
  - Confidence score with visual bar
  - "Visit" button with direct link
- **Best Deal Badge** - Green highlighting on top result
- **Affiliate Disclosure** - Compliance notice

---

## 🎨 Features

### Quick Examples
Click any example button for instant testing:
- 🌸 Chanel Coco
- 💎 Dior Sauvage  
- 🌲 Tom Ford Oud
- ☁️ Ariana Cloud
- 🖤 YSL Black Opium

### Product Normalization Display
See how your input is parsed:
```
Input: "Chanel Coco Mademoiselle EDP 100ml"
↓
Brand: Chanel
Line: Coco Mademoiselle
Concentration: EDP
Size: 100ml
```

### Retailer Cards
Each card shows:
- 🏪 Retailer name (e.g., "Sephora Canada")
- 💰 Price (e.g., "$165.00")
- ✅ Confidence score (e.g., "95% match")
- 🔗 Direct link button
- 🏆 Best deal badge (for #1 result)

### Real-Time Stats
- Number of retailers found
- Average confidence score
- Cache status (cached or live)
- Timestamp information

---

## ⚡ Performance

### First Search (Cold)
- **Time:** 5-10 seconds
- **Action:** Scrapes all 6 retailers in parallel
- **Result:** Cached for 1 hour

### Subsequent Searches (Warm)
- **Time:** <500ms (instant)
- **Action:** Returns cached results
- **Duration:** Valid for 1 hour

### Rate Limiting
- **Limit:** 10 requests per minute
- **Response:** Automatic rate limit headers
- **Reset:** Every 60 seconds

---

## 🎯 What Gets Scraped

### 6 Retailers in Parallel
1. ✅ **Sephora Canada** (.com/ca)
2. ✅ **Sephora USA** (.com)
3. ✅ **Amazon Canada** (.ca)
4. ✅ **Amazon USA** (.com)
5. ✅ **Shoppers Drug Mart Canada**
6. ✅ **Shoppers Drug Mart USA**

### Validation Rules
- ✅ Brand must match (40 points)
- ✅ Line must match (30 points)
- ✅ Concentration must match (20 points)
- ✅ Size must match ±5ml (10 points)
- ✅ **Total ≥80% required**

### Rejection Rules
❌ Samples  
❌ Travel sizes  
❌ Gift sets  
❌ Miniatures  
❌ Accessories  

---

## 💡 Testing Scenarios

### Test 1: Popular Perfume (Should Find Many)
```
Input: Chanel Coco Mademoiselle EDP 100ml
Expected: 4-6 retailers, 90%+ confidence
```

### Test 2: Luxury Perfume (May Find Fewer)
```
Input: Tom Ford Oud Wood
Expected: 2-4 retailers, 85%+ confidence
```

### Test 3: Celebrity Perfume (Budget Friendly)
```
Input: Ariana Grande Cloud
Expected: 3-5 retailers, 90%+ confidence
```

### Test 4: Designer Classic
```
Input: Dior Sauvage EDT
Expected: 4-6 retailers, 95%+ confidence
```

### Test 5: Niche Perfume (Harder to Find)
```
Input: Le Labo Santal 33
Expected: 1-3 retailers, 80%+ confidence
```

---

## 🔍 Understanding Results

### High Confidence (90-100%)
- **Perfect match** on all criteria
- **Brand, line, concentration, size** all verified
- **Safe to purchase** - exact product

### Good Confidence (80-89%)
- **Strong match** with minor variation
- Usually **size difference** or concentration variant
- **Verify details** before purchasing

### Below 80% (Not Shown)
- **Rejected automatically**
- Did not meet validation threshold
- **Not displayed** to user

---

## 📊 Sample Result Display

```
┌─────────────────────────────────────┐
│ 📦 Product Information              │
├─────────────────────────────────────┤
│ Brand:          Chanel              │
│ Product Line:   Coco Mademoiselle   │
│ Concentration:  EDP                 │
│ Size:           100ml               │
└─────────────────────────────────────┘

📊 Found 5 retailers • Average: 92% • Live

┌──────────────────────┐ ┌──────────────────────┐
│ 🏆 Best Deal        │ │ Retailer Card        │
│ Sephora Canada      │ │ Amazon Canada        │
│ $165.00             │ │ $158.99              │
│ 95% match ███████   │ │ 90% match ██████     │
│ [Visit Sephora CA]  │ │ [Visit Amazon CA]    │
└──────────────────────┘ └──────────────────────┘
```

---

## 🎓 Technical Details

### API Endpoint Used
```
GET /api/search?query={perfume_name}
```

### Response Format
```json
{
  "source": "live" | "cache",
  "normalized": {
    "brand": "Chanel",
    "line": "Coco Mademoiselle",
    "concentration": "EDP",
    "size": 100,
    "normalizedId": "chanel_coco_mademoiselle_edp_100"
  },
  "results": [
    {
      "retailer": "Sephora Canada",
      "price": "$165.00",
      "confidence": 95,
      "url": "https://..."
    }
  ]
}
```

### Caching Strategy
- **TTL:** 1 hour
- **Key:** Normalized product ID
- **Storage:** File-based (cache/products.json)
- **Cleanup:** Automatic on read

---

## 🚨 Troubleshooting

### "No Retailers Found"
**Possible Reasons:**
1. Product is very niche or new
2. Retailers don't stock this specific size
3. Scraping timed out (try again)
4. Product name spelling incorrect

**Solutions:**
- Try different size (e.g., 50ml instead of 100ml)
- Simplify query (remove size/concentration)
- Check spelling of brand/product name
- Try again in a few seconds

### "Search Failed" Error
**Possible Reasons:**
1. Rate limit exceeded (10/min)
2. Server error
3. Network timeout

**Solutions:**
- Wait 1 minute and retry
- Check server is running
- Refresh the page

### Empty Results But No Error
**This is Normal!**
- System tried scraping
- No matches met 80% threshold
- Results cached as "empty"
- Try different perfume or query

---

## 🎉 Next Steps

### For Development
1. ✅ Test with various perfumes
2. ✅ Verify confidence scores
3. ✅ Check retailer links work
4. ✅ Validate pricing displays
5. ✅ Test caching behavior

### For Production
1. Monitor demo page usage
2. Track which perfumes work best
3. Analyze confidence score patterns
4. Optimize slow scrapers
5. Add more retailers

---

## 📝 Demo Page Features

### ✅ Implemented
- Product normalization display
- Multi-retailer parallel scraping
- Confidence scoring visualization
- Best deal highlighting
- Cache status indication
- Real-time search
- Quick example buttons
- Responsive design
- Error handling
- Rate limit awareness
- Affiliate disclosure

### 🎨 Design Elements
- Purple gradient theme
- Modern card layouts
- Smooth animations
- Loading spinner
- Confidence progress bars
- Best deal badges
- Hover effects
- Mobile responsive

---

**Demo URL:** http://localhost:3001/demo  
**Status:** 🟢 **LIVE & READY TO TEST**

Test it now and see the multi-retailer scraping in action! 🚀
