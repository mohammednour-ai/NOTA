# 🎨 Quiz Card Image Generation - Complete Solution

## 📋 Overview

Generate **80 beautiful quiz card images** for the NOTA perfume app using AI.

---

## 🎯 Two Options Available

### **Option 1: DALL-E 3 (OpenAI) - RECOMMENDED** ⭐

**Script:** `generate-quiz-images-dalle.js`

**Pros:**
- ✅ **Cheaper:** $6.40 for all 80 images
- ✅ **Faster:** 30-45 minutes total
- ✅ **More stable:** OpenAI API is very reliable
- ✅ **Better quality:** DALL-E 3 is excellent at following prompts
- ✅ **Easier setup:** Simple OpenAI SDK

**Cons:**
- ⚠️ Requires OpenAI API key with billing enabled

**Cost Breakdown:**
- DALL-E 3 HD (1792x1024): $0.08 per image
- 80 images × $0.08 = **$6.40 USD**

---

### **Option 2: Leonardo AI**

**Script:** `generate-quiz-images.js`

**Pros:**
- ✅ Free tier available (limited credits)
- ✅ More control over style presets
- ✅ Can use Leonardo Phoenix model

**Cons:**
- ⚠️ **More expensive:** $25-40 for 80 images
- ⚠️ **Slower:** 2-3 hours total
- ⚠️ API can be slower/unstable sometimes

**Cost Breakdown:**
- Leonardo Phoenix: ~4-5 credits per image
- 80 images × 4.5 credits = ~360 credits ≈ **$25-40 USD**

---

## 🚀 Quick Start (DALL-E - Recommended)

### 1. Get OpenAI API Key
```
https://platform.openai.com/api-keys
→ Create new secret key
→ Copy key (sk-...)
```

### 2. Add to .env
```bash
OPENAI_API_KEY=sk-your-api-key-here
```

### 3. Install Dependencies
```bash
npm install openai axios
```

### 4. Generate Images
```bash
node generate-quiz-images-dalle.js
```

### 5. Wait ~40 minutes
```
80 images will be generated and saved to:
public/images/quiz-cards/
```

---

## 📊 What You Get

### 80 Beautiful Images Across 13 Categories:

1. **Floral Notes (7):** Rose, Jasmine, Lavender, Lily, Peony, Violet, Orange Blossom
2. **Citrus Notes (6):** Lemon, Orange, Bergamot, Grapefruit, Mandarin, Lime
3. **Woody Notes (6):** Sandalwood, Cedar, Oud, Vetiver, Patchouli, Pine
4. **Sweet Notes (6):** Vanilla, Caramel, Honey, Chocolate, Cotton Candy, Tonka Bean
5. **Spicy Notes (6):** Cinnamon, Pepper, Cardamom, Clove, Ginger, Nutmeg
6. **Fruity Notes (6):** Strawberry, Apple, Peach, Pear, Pineapple, Plum
7. **Seasons (4):** Spring, Summer, Fall, Winter
8. **Time of Day (5):** Morning, Afternoon, Evening, Night, All Day
9. **Moods (7):** Confident, Romantic, Energetic, Calm, Mysterious, Happy, Sophisticated
10. **Occasions (6):** Daily Wear, Work, Evening Events, Date Night, Casual, Special
11. **Styles (6):** Elegant, Casual, Sporty, Romantic, Bold, Minimalist
12. **Intensity (5):** Very Light, Light, Moderate, Strong, Very Strong
13. **Longevity (5):** 2-4h, 4-6h, 6-8h, 8+h, All Day

---

## 🎨 Style Consistency

All images follow the **luxury perfume branding aesthetic**:

- 🖼️ **Landscape pill-shaped cards**
- 🎨 **Soft pastel gradients** (lavender, rose gold, mint, pearl, champagne)
- ✨ **Chanel/Dior inspired elegance**
- 🌊 **Watercolor + vector hybrid style**
- 💎 **Professional, sophisticated, calming**
- 🌟 **Gentle shadows and glows**
- 🎭 **Minimalist but luxurious**

---

## 📈 Comparison Table

| Feature | DALL-E 3 ⭐ | Leonardo AI |
|---------|------------|-------------|
| **Cost** | $6.40 | $25-40 |
| **Time** | 30-45 min | 2-3 hours |
| **Quality** | Excellent | Excellent |
| **Consistency** | Very high | High |
| **API Stability** | ✅ Excellent | ⚠️ Moderate |
| **Setup** | Simple | Complex |
| **Free Tier** | No (needs billing) | Yes (limited) |

---

## 🎯 Recommendation

**Use DALL-E 3 (`generate-quiz-images-dalle.js`)**

**Why?**
- 4x cheaper
- 4x faster
- More reliable
- Better at following style instructions
- Simpler setup

**Cost:** Only $6.40 for all 80 professional images!

---

## 📝 After Generation

### 1. Verify Images
```bash
# Check if all images were created
ls -R public/images/quiz-cards/
```

### 2. Update Quiz to Use Images

Create `questions-with-images.json`:
```json
{
  "id": 9,
  "question": "Which floral notes appeal to you?",
  "type": "multiple",
  "options": [
    {
      "value": "Rose",
      "image": "/images/quiz-cards/floral/rose.png"
    }
  ]
}
```

### 3. Update UI to Display Images

Add to `script.js`:
```javascript
if (option.image) {
  html += `
    <div class="option-card-with-image">
      <img src="${option.image}" alt="${option.value}" 
           class="option-image">
      <span class="option-label">${option.value}</span>
    </div>
  `;
}
```

### 4. Add CSS

```css
.option-card-with-image {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  border-radius: 12px;
  transition: transform 0.2s;
}

.option-image {
  width: 100%;
  max-width: 200px;
  height: auto;
  border-radius: 8px;
  margin-bottom: 0.5rem;
}
```

---

## 🚀 Ready to Generate!

**Recommended Path:**
1. Use **DALL-E 3** script (cheaper, faster)
2. Generate all 80 images (~$6.40, ~40 minutes)
3. Update quiz to use images
4. Test and deploy!

**Run this command to start:**
```bash
node generate-quiz-images-dalle.js
```

---

**Questions? Check the detailed guides:**
- `DALLE_IMAGE_GENERATION_GUIDE.md` - DALL-E 3 guide
- `LEONARDO_IMAGE_GENERATION_GUIDE.md` - Leonardo AI guide

**Happy Generating! 🎨✨**
