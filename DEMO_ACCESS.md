# 🎯 Scraper Demo Page - Quick Access Guide

## ✅ Server Status
**Server is running on:** http://localhost:3001

## 🔗 Access the Demo Page

Open your browser and navigate to:
```
http://localhost:3001/demo
```

## 📋 How to Use

1. **Enter Perfume Name**: Type any perfume name in the search box
   - Example: "Chanel Coco Mademoiselle"
   - Example: "Tom Ford Oud Wood"
   - Example: "Dior Sauvage"

2. **Click Search**: The system will:
   - Normalize the product name (extract brand, line, concentration, size)
   - Search across 6 retailer adapters (Sephora CA/US, Amazon CA/US, Shoppers CA/US)
   - Display all results with confidence scores, prices, and direct links

3. **View Results**: You'll see:
   - 📦 **Normalized Product Info**: Brand, line, concentration, size
   - 🏪 **Retailer Cards**: Each retailer with price, confidence score, and direct link
   - ⏱️ **Search Time**: How long the scraping took
   - 💾 **Cache Status**: Whether results came from cache or live scraping

## 🎨 Features

- **Real-time Scraping**: Uses Puppeteer to scrape live data
- **Smart Caching**: Results are cached for 1 hour to improve performance
- **Confidence Scoring**: Only shows products with 80%+ match confidence
- **Multi-Retailer**: Searches 6 different retailers simultaneously
- **Affiliate Ready**: All links include tracking parameters from your .env file

## 🧪 Test Products

Try these popular perfumes:
- Chanel Coco Mademoiselle
- Dior Sauvage
- Tom Ford Oud Wood
- Versace Eros
- Bleu de Chanel
- Acqua di Gio Profumo

## 🐛 Troubleshooting

### "Not found" error?
- Make sure the server is running (check terminal)
- Verify you're accessing http://localhost:3001/demo (not /scraper-demo.html)

### No results found?
- Some retailers may be blocking automated access (this is expected)
- Try different perfume names
- Check terminal for detailed error logs

### Slow performance?
- First search takes 20-40 seconds (real-time scraping)
- Subsequent searches for the same product are instant (cached)
- Scraping is happening in parallel across 6 retailers

## 📊 What You're Seeing

The demo page demonstrates the complete scraping pipeline:

1. **Input Normalization** → Extracts brand, line, concentration, size
2. **Multi-Retailer Scraping** → Puppeteer scrapes 6 retailers in parallel
3. **Intelligent Validation** → Confidence scoring & filtering
4. **Affiliate Injection** → Adds tracking parameters
5. **Result Display** → Clean, organized output

---

**Next Steps**: Once you're satisfied with the demo, we can integrate this into the main quiz results page!
