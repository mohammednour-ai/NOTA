# 🚀 100-PERFUME AUTOMATED TEST - EXECUTION GUIDE

## 🎯 What This Does

This is a **BULLETPROOF** automated testing system that:
- ✅ Tests 100 popular perfumes
- ✅ Retries up to 5 times per perfume until success
- ✅ Requires minimum 2 retailers (targets all 6)
- ✅ Processes in batches of 5 with cooldown periods
- ✅ Generates detailed JSON and Markdown reports
- ✅ Tracks retailer success rates
- ✅ Never gives up until all perfumes tested

---

## 🔥 START THE TEST

### Option 1: Run Full Test (Recommended)
```powershell
cd D:\Lab2
node test-100-perfumes.js
```

### Option 2: Run in Background
```powershell
cd D:\Lab2
Start-Process -FilePath "node" -ArgumentList "test-100-perfumes.js" -RedirectStandardOutput "test-output.log" -NoNewWindow
```

### Option 3: Run with Specific Config
```powershell
# Edit test-100-perfumes.js CONFIG section first
node test-100-perfumes.js
```

---

## ⚙️ Configuration (Editable)

```javascript
const CONFIG = {
  maxRetries: 5,              // Retry up to 5 times per perfume
  retryDelayBase: 5000,       // Start with 5s delay
  maxRetryDelay: 60000,       // Max 60s delay between retries
  minSuccessfulRetailers: 2,  // Accept if 2+ retailers respond
  targetRetailers: 6,         // Goal: all 6 retailers
  batchSize: 5,               // Process 5 at a time
  batchDelay: 10000,          // 10s cooldown between batches
  timeout: 120000             // 2 min timeout per perfume
};
```

**To change:** Edit lines 75-84 in `test-100-perfumes.js`

---

## 📊 Expected Duration

| Scenario | Time |
|----------|------|
| **Best Case** | 3-4 hours (if most succeed first try) |
| **Average Case** | 6-8 hours (with retries) |
| **Worst Case** | 10-12 hours (max retries on all) |

**Progress Updates:** Every perfume completion

---

## 📁 Output Reports

### Location:
```
D:\Lab2\test-reports\
```

### Files Generated:
1. **`test-report-YYYY-MM-DD-HH-MM-SS.json`**
   - Full structured data
   - All product details
   - Retailer statistics
   - Importable for analysis

2. **`test-report-YYYY-MM-DD-HH-MM-SS.md`**
   - Human-readable summary
   - Success/fail breakdown
   - Retailer performance
   - Top/bottom performers

---

## 🎯 Success Criteria

### Full Success:
- ✅ All 6 retailers respond
- ✅ Multiple products found
- Status: `FULL_SUCCESS`

### Partial Success:
- ⚠️ 2-5 retailers respond
- ✅ At least some products
- Status: `PARTIAL_SUCCESS`

### Failure:
- ❌ <2 retailers respond
- OR timeout after 5 retries
- Status: `FAILED`

---

## 📺 Real-Time Monitoring

### Watch Progress:
```powershell
# In separate terminal:
Get-Content test-output.log -Wait
```

### Check Current Status:
```powershell
# Count completed:
Select-String -Path test-output.log -Pattern "Progress:" | Select-Object -Last 1
```

### See Failures:
```powershell
Select-String -Path test-output.log -Pattern "FAILED"
```

---

## 🛑 Stop/Resume

### Stop Test:
```powershell
Stop-Process -Name "node" -Force
```

### Resume:
The test **automatically saves progress**. To resume:
1. Check last completed perfume in logs
2. Edit `test-100-perfumes.js` line 11 to start from that index
3. Rerun: `node test-100-perfumes.js`

---

## 🔍 Understanding Results

### Example Console Output:
```
==========================================================
🧪 Testing: Chanel Coco Mademoiselle EDP 100ml (Attempt 1/5)
==========================================================
📦 Normalized: { brand: 'Chanel', line: 'Coco Mademoiselle', ... }

✅ Found 4 products from 2 retailers in 35.24s
   1. Amazon CA - CHANEL Coco Mademoiselle - CDN$ 139.00 (87% confidence)
   2. Amazon US - Chanel Coco Mademoiselle - $98.00 (85% confidence)
   3. Amazon CA - Coco Mademoiselle EDP - CDN$ 145.00 (82% confidence)
   4. Sephora CA - COCO MADEMOISELLE - $158.00 (79% confidence)

🎉 PARTIAL_SUCCESS: 2/6 retailers responded

📊 Progress: 1/100 (1.0%)
   ✅ Successful: 0
   ⚠️ Partial: 1
   ❌ Failed: 0
```

---

## 🎯 100 Perfumes Being Tested

### Categories:
- **30** Women's Classics (Chanel, Dior, YSL, etc.)
- **30** Men's Classics (Sauvage, Bleu de Chanel, Eros, etc.)
- **20** Unisex & Niche (Le Labo, Byredo, Tom Ford, etc.)
- **20** Budget & Celebrity (Ariana Grande, Britney Spears, etc.)

**Full List:** Lines 11-109 in `test-100-perfumes.js`

---

## 🔧 Troubleshooting

### If Test Crashes:
```powershell
# Check error
cat test-output.log | Select-String -Pattern "Fatal error"

# Restart from last successful
node test-100-perfumes.js
```

### If Stuck on One Perfume:
- Max 5 retries × 2min timeout = 10 min max
- Will auto-skip after that
- Check terminal for "FAILED" message

### If Too Many Failures:
**Signs:**
- >80% failures
- All Sephora/Shoppers failing

**Solutions:**
1. Increase retry delay:
   ```javascript
   retryDelayBase: 10000  // 10s instead of 5s
   ```

2. Reduce batch size:
   ```javascript
   batchSize: 3  // 3 instead of 5
   ```

3. Add longer batch delay:
   ```javascript
   batchDelay: 30000  // 30s instead of 10s
   ```

---

## 📈 Target Metrics

### Acceptable Performance:
- ✅ Full Success: 40-60%
- ⚠️ Partial Success: 30-40%
- ❌ Failures: <20%
- 🏪 Amazon Success: >70%
- 🏪 Sephora Success: >20%

### Excellent Performance:
- ✅ Full Success: >70%
- ❌ Failures: <10%
- 🏪 All retailers: >50%

---

## 🚀 READY TO START?

### Quick Start:
```powershell
cd D:\Lab2
node test-100-perfumes.js
```

### Estimated Completion:
- **Optimistic:** 3-4 hours
- **Realistic:** 6-8 hours
- **Pessimistic:** 10-12 hours

### What You'll Get:
- ✅ 100 perfumes tested
- ✅ Thousands of product links
- ✅ Detailed performance metrics
- ✅ Retailer success rates
- ✅ Actionable insights for improvement

---

## 💡 After Test Completes

### Review Reports:
```powershell
cd test-reports
cat test-report-*.md | more
```

### Analyze JSON:
```javascript
const report = require('./test-reports/test-report-latest.json');
console.log(`Success Rate: ${report.summary.successRate}`);
```

### Next Steps:
1. **If >80% success:** Deploy to production
2. **If 60-80% success:** Optimize retry logic
3. **If <60% success:** Consider paid APIs (Google Shopping, ScraperAPI)

---

**LET THE AUTOMATION BEGIN!** 🤖🚀

Run: `node test-100-perfumes.js`
