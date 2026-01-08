# 🎨 DALL-E Image Generation Guide

## 📋 Overview

This script automatically generates **80 high-quality quiz card images** for the NOTA perfume app using OpenAI's DALL-E 3.

---

## 🚀 Quick Start

### 1. Get OpenAI API Key

1. Go to: https://platform.openai.com/api-keys
2. Click **"Create new secret key"**
3. Give it a name (e.g., "NOTA Image Generation")
4. Copy the key (starts with `sk-...`)

### 2. Add API Key to Environment

Add to your `.env` file:
```env
OPENAI_API_KEY=sk-your-api-key-here
```

### 3. Install Dependencies

```bash
npm install openai axios
```

### 4. Run the Script

```bash
node generate-quiz-images-dalle.js
```

---

## 📊 What Gets Generated

### Total Images: **80**

| Category | Count | Quiz Question | Examples |
|----------|-------|---------------|----------|
| **Floral Notes** | 7 | Q9 | Rose, Jasmine, Lavender, Lily, Peony, Violet, Orange Blossom |
| **Citrus Notes** | 6 | Q10 | Lemon, Orange, Bergamot, Grapefruit, Mandarin, Lime |
| **Woody Notes** | 6 | Q11 | Sandalwood, Cedar, Oud, Vetiver, Patchouli, Pine |
| **Sweet Notes** | 6 | Q13 | Vanilla, Caramel, Honey, Chocolate, Cotton Candy, Tonka Bean |
| **Spicy Notes** | 6 | Q14 | Cinnamon, Pepper, Cardamom, Clove, Ginger, Nutmeg |
| **Fruity Notes** | 6 | Q16 | Strawberry, Apple, Peach, Pear, Pineapple, Plum |
| **Seasons** | 4 | Q4 | Spring, Summer, Fall, Winter |
| **Time of Day** | 5 | Q5 | Morning, Afternoon, Evening, Night, All Day |
| **Moods** | 7 | Q28 | Confident, Romantic, Energetic, Calm, Mysterious, Happy, Sophisticated |
| **Occasions** | 6 | Q3 | Daily Wear, Work, Evening Events, Date Night, Casual, Special |
| **Styles** | 6 | Q21 | Elegant, Casual, Sporty, Romantic, Bold, Minimalist |
| **Intensity** | 5 | Q6 | Very Light, Light, Moderate, Strong, Very Strong |
| **Longevity** | 5 | Q7 | 2-4h, 4-6h, 6-8h, 8+h, All Day |

---

## 📁 Output Structure

```
public/images/quiz-cards/
├── floral/
│   ├── rose.png
│   ├── jasmine.png
│   └── ...
├── citrus/
├── woody/
├── sweet/
├── spicy/
├── fruity/
├── seasons/
├── time-of-day/
├── moods/
├── occasions/
├── styles/
├── intensity/
└── longevity/
```

---

## ⚙️ Configuration

### DALL-E 3 Settings

```javascript
const CONFIG = {
  model: 'dall-e-3',    // Latest DALL-E model
  size: '1792x1024',    // Landscape HD (closest to 3:2 ratio)
  quality: 'hd',        // High quality (best)
  style: 'natural',     // Natural style (vs vivid)
  n: 1                  // One image per request
};
```

### Master Style Guide

All images follow this consistent style:
- **Format:** Landscape 1792x1024px (3:2-like ratio)
- **Style:** Soft watercolor + vector hybrid
- **Backgrounds:** Pastel gradients (lavender, rose gold, mint, pearl)
- **Aesthetic:** Luxury perfume branding (Chanel/Dior inspired)
- **Effects:** Soft shadows, gentle glow, pill-shaped card aesthetic

---

## ⏱️ Timing & Cost

### Generation Time
- **Per Image:** ~10-20 seconds (DALL-E 3 is fast!)
- **Total Time:** ~30-45 minutes for all 80 images
- **Rate Limiting:** 1-second delay between requests

### OpenAI Costs (DALL-E 3 HD)
- **Cost per image:** $0.080 USD (HD 1792x1024)
- **Total cost:** ~$6.40 USD for all 80 images
- **Much cheaper than Leonardo AI!**

### Pricing Reference
- Standard 1024x1024: $0.040/image
- **HD 1792x1024: $0.080/image** ← We use this
- HD 1024x1792: $0.080/image

---

## 🔧 Troubleshooting

### Error: "Invalid API Key"
```bash
# Check your .env file
echo $OPENAI_API_KEY

# Make sure it's in format:
OPENAI_API_KEY=sk-...
```

### Error: "Rate Limit Exceeded"
- **Free tier:** 5 images per minute
- **Paid tier:** 50+ images per minute
- **Solution:** Script has 1s delays built-in
- If you hit limits, wait 1 minute and resume

### Error: "Content Policy Violation"
- **Cause:** DALL-E refused the prompt (rare with our prompts)
- **Solution:** Script logs failed items - adjust prompt or skip

### Error: "Insufficient Quota"
- **Cause:** Out of OpenAI credits
- **Solution:** Add payment method at https://platform.openai.com/account/billing

---

## 💡 Advantages of DALL-E 3 vs Leonardo AI

| Feature | DALL-E 3 | Leonardo AI |
|---------|----------|-------------|
| **Cost** | $6.40 for 80 images | $25-40 for 80 images |
| **Speed** | ~30-45 minutes | ~2-3 hours |
| **Quality** | Excellent, consistent | Excellent |
| **API Stability** | Very stable | Sometimes slow |
| **Setup** | Simple (OpenAI SDK) | More complex |
| **Rate Limits** | 50+ req/min (paid) | Slower |

---

## 📝 Customization

### Modify a Single Prompt

```javascript
{
  name: 'rose',
  prompt: `YOUR CUSTOM PROMPT HERE. Keep it descriptive.`
}
```

### Change Image Size

```javascript
const CONFIG = {
  size: '1024x1024',  // Square
  // OR
  size: '1792x1024',  // Landscape (what we use)
  // OR
  size: '1024x1792',  // Portrait
};
```

### Change Quality

```javascript
const CONFIG = {
  quality: 'standard',  // Faster, cheaper ($0.04)
  // OR
  quality: 'hd',       // Better quality ($0.08) ← We use this
};
```

---

## 🎯 Usage in App

### After Generation Complete:

1. **Images Location:** `public/images/quiz-cards/`

2. **Update questions.json:**

```json
{
  "id": 9,
  "question": "Which floral notes appeal to you?",
  "type": "multiple",
  "options": [
    {
      "value": "Rose",
      "image": "/images/quiz-cards/floral/rose.png"
    },
    {
      "value": "Jasmine",
      "image": "/images/quiz-cards/floral/jasmine.png"
    }
  ]
}
```

3. **Display in Quiz UI (script.js):**

```javascript
// Add image to options
if (option.image) {
  html += `
    <div class="option-with-image">
      <img src="${option.image}" alt="${option.value}">
      <span>${option.value}</span>
    </div>
  `;
}
```

---

## 📊 Progress Tracking

The script provides real-time feedback:

```
🎨 Generating: floral/rose
   ✓ Image generated successfully
   ✓ Saved: floral/rose.png
```

At the end:
```
🎉 IMAGE GENERATION COMPLETE!
============================================================
✅ Successfully generated: 80
❌ Failed: 0
📁 Images saved to: public/images/quiz-cards/
============================================================
```

---

## 🆘 Support

### OpenAI Help
- Docs: https://platform.openai.com/docs/guides/images
- API Reference: https://platform.openai.com/docs/api-reference/images
- Community: https://community.openai.com/
- Support: https://help.openai.com/

### Common Issues

**"openai module not found"**
```bash
npm install openai
```

**"Request too large"**
- Prompt is too long (max 4000 chars)
- Our prompts are optimized and under limit

**Images look different from expected**
- DALL-E 3 interprets prompts creatively
- Adjust prompt wording for better control

---

## 🎨 Alternative: Manual Generation

If the script doesn't work, generate manually:

1. Go to: https://platform.openai.com/playground?mode=image
2. Copy prompts from `generate-quiz-images-dalle.js`
3. Settings:
   - Model: **DALL-E 3**
   - Size: **1792x1024**
   - Quality: **HD**
   - Style: **Natural**
4. Download and organize manually

---

## ✅ Next Steps

After generation completes:

1. ✅ Verify all 80 images generated successfully
2. ✅ Check image quality and style consistency
3. ✅ Update `questions.json` to include image paths
4. ✅ Update CSS for image display in quiz options
5. ✅ Test quiz with new images
6. ✅ Optimize PNGs (optional - use TinyPNG)
7. ✅ Commit images to git repository

---

## 🎁 Bonus: Batch Re-generation

To regenerate only failed images:

```javascript
// Edit the script to only include failed categories
const IMAGE_PROMPTS = {
  floral: [
    // Only include failed items
  ]
};
```

Then run again:
```bash
node generate-quiz-images-dalle.js
```

---

## 💰 Cost Comparison Summary

**Full 80-image generation:**
- **DALL-E 3 HD:** $6.40 USD ✅
- **Leonardo AI:** $25-40 USD
- **Manual ChatGPT Plus:** Included (but tedious)

**Recommendation:** Use DALL-E 3 API - it's 4x cheaper and faster!

---

**Happy Generating! 🎨✨**

**Estimated total cost: $6.40 USD**  
**Estimated total time: 30-45 minutes**
