# 🤖 Automated Amazon Affiliate Link Tools

This directory contains automated tools to help you generate and manage Amazon affiliate links for your NOTA perfume app.

---

## 🛠️ Tools Included

### 1. **amazon-link-generator.js** - Core Link Generator
Programmatically generate affiliate links from ASINs or URLs.

### 2. **find-amazon-links.js** - Interactive Link Finder (RECOMMENDED!)
Interactive tool to quickly convert Amazon URLs to affiliate links.

---

## 🚀 Quick Start - Interactive Method (EASIEST!)

### **Step 1: Run the Interactive Tool**

```bash
node find-amazon-links.js
```

### **Step 2: Follow the Prompts**

The tool will:
1. Show you search links for popular perfumes
2. You open them in your browser
3. Find the product you want
4. Copy the Amazon URL
5. Paste it back
6. Get your affiliate link instantly!

**Example:**
```
Paste Amazon URL: https://www.amazon.com/Some-Product/dp/B07QPKQNP1

✅ Success!
   ASIN: B07QPKQNP1
   Affiliate Link: https://www.amazon.com/dp/B07QPKQNP1?tag=nota0c-20
   
   Copy this for your database:
   amazon: 'https://www.amazon.com/dp/B07QPKQNP1?tag=nota0c-20',
```

---

## 📦 Programmatic Method

### **Generate Link from ASIN:**

```javascript
const { generateAmazonLink } = require('./amazon-link-generator');

const link = generateAmazonLink('B07QPKQNP1');
console.log(link);
// Output: https://www.amazon.com/dp/B07QPKQNP1?tag=nota0c-20
```

### **Extract ASIN from URL:**

```javascript
const { extractASIN } = require('./amazon-link-generator');

const asin = extractASIN('https://www.amazon.com/product-name/dp/B07QPKQNP1/ref=xyz');
console.log(asin);
// Output: B07QPKQNP1
```

### **Batch Generate Links:**

```javascript
const { batchGenerateLinks } = require('./amazon-link-generator');

const products = [
  { name: 'Ariana Grande Cloud', asin: 'B07QPKQNP1' },
  { name: 'Billie Eilish', url: 'https://www.amazon.com/dp/B09JKQM5LX' }
];

const results = batchGenerateLinks(products);
console.log(results);
```

---

## 🎯 Workflow for Updating Your Database

### **Method 1: Interactive (Recommended)**

```bash
# Step 1: Run the tool
node find-amazon-links.js

# Step 2: Open the search links it provides
# Step 3: Find products on Amazon
# Step 4: Paste URLs back into the tool
# Step 5: Copy the generated affiliate links
# Step 6: Update perfume-database.js
```

### **Method 2: Manual with Helper**

```bash
# Step 1: Get Amazon URLs manually
# Step 2: Use the generator
node amazon-link-generator.js

# Step 3: The script shows example usage
# Step 4: Add your URLs to the example list
# Step 5: Run again to get affiliate links
```

---

## 🔧 Configuration

Set your Amazon Associate tag in `.env`:

```env
AMAZON_ASSOCIATE_TAG=nota0c-20
```

Or it will default to `nota0c-20` from the code.

---

## 📚 API Functions

### **generateAmazonLink(asin)**
Generate affiliate link from ASIN.
- **Input**: `'B07QPKQNP1'`
- **Output**: `'https://www.amazon.com/dp/B07QPKQNP1?tag=nota0c-20'`

### **extractASIN(url)**
Extract ASIN from any Amazon URL format.
- **Input**: `'https://www.amazon.com/.../dp/B07QPKQNP1/...'`
- **Output**: `'B07QPKQNP1'`

### **generateSearchLink(query)**
Generate Amazon search link with your affiliate tag.
- **Input**: `'Ariana Grande Cloud'`
- **Output**: `'https://www.amazon.com/s?k=Ariana+Grande+Cloud&tag=nota0c-20'`

### **batchGenerateLinks(products)**
Process multiple products at once.
- **Input**: Array of products with ASIN or URL
- **Output**: Array of affiliate links

### **validateLink(url)**
Check if an Amazon link is valid (async).
- **Input**: Amazon URL
- **Output**: Boolean (true if valid)

---

## 💡 Pro Tips

### **Finding Correct ASINs:**
1. Search product on Amazon
2. Look for "ASIN" in product details (scroll down on product page)
3. Or extract from URL using the tool

### **Handling Different Sizes:**
Different product sizes have different ASINs:
- 1.0 oz: Different ASIN
- 1.7 oz: Different ASIN
- 3.4 oz: Different ASIN

Choose the size you want to promote!

### **Batch Processing:**
Update `productsToFind` array in `find-amazon-links.js` with your product list.

---

## 🚨 Common Issues

### **"Could not extract ASIN"**
- Make sure you copied the full Amazon URL
- URL should contain `/dp/` or `/product/` with ASIN
- Try copying from browser address bar

### **"Link doesn't work"**
- Product might be out of stock
- ASIN might be for wrong region (use amazon.com not .co.uk)
- Try searching for the product again

---

## 🎓 Example: Complete Workflow

```bash
# Terminal 1: Run the interactive tool
node find-amazon-links.js

# Browser: Search for products
# Copy URL: https://www.amazon.com/Ariana-Grande-Cloud/dp/B07QPKQNP1

# Terminal 1: Paste URL
Paste Amazon URL: https://www.amazon.com/Ariana-Grande-Cloud/dp/B07QPKQNP1

# Output:
✅ Success!
   ASIN: B07QPKQNP1
   Affiliate Link: https://www.amazon.com/dp/B07QPKQNP1?tag=nota0c-20
   
   Copy this for your database:
   amazon: 'https://www.amazon.com/dp/B07QPKQNP1?tag=nota0c-20',

# Now update perfume-database.js with this link!
```

---

## 🚀 Next Steps

1. **Run the interactive tool**: `node find-amazon-links.js`
2. **Get your product links**
3. **Update perfume-database.js**
4. **Test locally**: `npm start`
5. **Push to production**: `git push`

---

## 📞 Need Help?

If you need help finding links for specific products, just run:
```bash
node find-amazon-links.js
```

And follow the prompts! The tool will guide you through the process.

---

**Happy linking!** 🎉
