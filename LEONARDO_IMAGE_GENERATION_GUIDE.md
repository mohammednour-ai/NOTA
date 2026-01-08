# 🎨 Leonardo AI Image Generation Guide

## 📋 Overview

This script automatically generates **80+ high-quality quiz card images** for the NOTA perfume app using Leonardo AI.

---

## 🚀 Quick Start

### 1. Get Leonardo AI API Key

1. Go to: https://app.leonardo.ai/settings
2. Navigate to **API Access**
3. Generate your **API Key**
4. Copy the key (starts with `Bearer ...`)

### 2. Add API Key to Environment

Add to your `.env` file:
```env
LEONARDO_API_KEY=your_leonardo_api_key_here
```

### 3. Install Dependencies (if needed)

```bash
npm install axios
```

### 4. Run the Script

```bash
node generate-quiz-images.js
```

---

## 📊 What Gets Generated

### Total Images: **80+**

| Category | Count | Examples |
|----------|-------|----------|
| **Floral Notes** | 7 | Rose, Jasmine, Lavender, Lily, Peony, Violet, Orange Blossom |
| **Citrus Notes** | 6 | Lemon, Orange, Bergamot, Grapefruit, Mandarin, Lime |
| **Woody Notes** | 6 | Sandalwood, Cedar, Oud, Vetiver, Patchouli, Pine |
| **Sweet Notes** | 6 | Vanilla, Caramel, Honey, Chocolate, Cotton Candy, Tonka Bean |
| **Spicy Notes** | 6 | Cinnamon, Pepper, Cardamom, Clove, Ginger, Nutmeg |
| **Fruity Notes** | 6 | Strawberry, Apple, Peach, Pear, Pineapple, Plum |
| **Seasons** | 4 | Spring, Summer, Fall, Winter |
| **Time of Day** | 4 | Morning, Afternoon, Evening, Night |
| **Moods** | 7 | Confident, Romantic, Energetic, Calm, Mysterious, Happy, Sophisticated |
| **Occasions** | 6 | Daily Wear, Work, Evening Events, Date Night, Casual, Special |
| **Styles** | 6 | Elegant, Casual, Sporty, Romantic, Bold, Minimalist |

---

## 📁 Output Structure

```
public/images/quiz-cards/
├── floral/
│   ├── rose.jpg
│   ├── jasmine.jpg
│   ├── lavender.jpg
│   └── ...
├── citrus/
│   ├── lemon.jpg
│   ├── orange.jpg
│   └── ...
├── woody/
│   ├── sandalwood.jpg
│   ├── cedar.jpg
│   └── ...
├── sweet/
│   ├── vanilla.jpg
│   ├── caramel.jpg
│   └── ...
├── spicy/
├── fruity/
├── seasons/
├── time-of-day/
├── moods/
├── occasions/
└── styles/
```

---

## ⚙️ Configuration

### Image Settings

```javascript
const CONFIG = {
  modelId: '6bef9f1b-29cb-40c7-b9df-32b51c1f67d3', // Leonardo Phoenix
  width: 896,        // 3:2 ratio
  height: 576,
  numImages: 1,      // One image per prompt
  promptMagic: true, // Better prompt understanding
  alchemy: true,     // Higher quality
  presetStyle: 'ILLUSTRATION'
};
```

### Master Style Guide

All images follow this consistent style:
- **Format:** Landscape 3:2 ratio (pill-shaped cards)
- **Style:** Soft watercolor + vector hybrid
- **Backgrounds:** Pastel gradients (lavender, rose gold, mint, pearl)
- **Aesthetic:** Luxury perfume branding (Chanel/Dior inspired)
- **Effects:** Soft shadows, gentle glow, rounded corners

---

## ⏱️ Timing & Cost

### Generation Time
- **Per Image:** ~30-60 seconds
- **Total Time:** ~2-3 hours for all 80 images
- **Rate Limiting:** 2-second delay between requests

### Leonardo AI Costs
- **Model:** Leonardo Phoenix (premium model)
- **Cost:** ~4-5 credits per image
- **Total:** ~320-400 credits for full set
- **Pricing:** Check https://leonardo.ai/pricing

---

## 🔧 Troubleshooting

### Error: "API Key Invalid"
```bash
# Check your .env file
cat .env | grep LEONARDO_API_KEY

# Make sure it's in format:
LEONARDO_API_KEY=your_key_here
```

### Error: "Rate Limit Exceeded"
- **Solution:** Script has 2s delays built-in, but if you hit limits:
- Increase delay in script: `setTimeout(resolve, 5000)` (5 seconds)
- Wait 1 hour and resume

### Error: "Generation Failed"
- **Cause:** Sometimes AI fails on specific prompts
- **Solution:** Script logs failed items - regenerate manually or adjust prompt

### Timeout Errors
- **Cause:** Generation taking too long
- **Solution:** Script waits 5 minutes max per image
- Failed items are logged - can re-run just those

---

## 📝 Customization

### Modify a Single Prompt

Edit in `IMAGE_PROMPTS` object:

```javascript
{
  name: 'rose',
  prompt: `YOUR CUSTOM PROMPT HERE. Keep it descriptive and include mood/style keywords.`
}
```

### Add New Categories

```javascript
IMAGE_PROMPTS.newCategory = [
  {
    name: 'item1',
    prompt: `Description...`
  }
];
```

### Change Image Dimensions

```javascript
const CONFIG = {
  width: 1024,   // Your width
  height: 768,   // Your height
  // ...
};
```

---

## 🎯 Usage in App

### After Generation Complete:

1. **Images Location:** `public/images/quiz-cards/`
2. **Reference in Quiz:**

```javascript
// In questions.json or quiz component
{
  id: 9,
  question: "Which floral notes appeal to you?",
  options: [
    {
      text: "Rose",
      image: "/images/quiz-cards/floral/rose.jpg"
    },
    {
      text: "Jasmine", 
      image: "/images/quiz-cards/floral/jasmine.jpg"
    }
  ]
}
```

3. **Display in UI:**

```javascript
<div class="option-card">
  <img src={option.image} alt={option.text} />
  <span>{option.text}</span>
</div>
```

---

## 📊 Progress Tracking

The script provides real-time feedback:

```
🎨 Generating: floral/rose
   ✓ Generation started: abc123def456
   ⏳ Status: PENDING - Waiting... (1/30)
   ✓ Generation complete!
   ✓ Saved: floral/rose.jpg
```

At the end:
```
🎉 IMAGE GENERATION COMPLETE!
============================================================
✅ Successfully generated: 78
❌ Failed: 2
📁 Images saved to: public/images/quiz-cards/
```

---

## 🆘 Support

### Leonardo AI Help
- Docs: https://docs.leonardo.ai/
- Discord: https://discord.gg/leonardo-ai
- Support: support@leonardo.ai

### Script Issues
- Check console logs for specific errors
- Verify API key is valid
- Ensure sufficient Leonardo AI credits
- Check internet connection

---

## 🎨 Alternative: Manual Generation

If the script doesn't work, generate manually:

1. Go to: https://app.leonardo.ai/
2. Copy prompts from `generate-quiz-images.js`
3. Use these settings:
   - Model: **Leonardo Phoenix**
   - Dimensions: **896 x 576**
   - Style: **Illustration**
   - Alchemy: **ON**
4. Download and organize manually

---

## ✅ Next Steps

After generation completes:

1. ✅ Verify all images generated successfully
2. ✅ Check image quality and style consistency
3. ✅ Update `questions.json` to include image paths
4. ✅ Test quiz with new images
5. ✅ Optimize images for web (optional - use TinyPNG)
6. ✅ Commit images to git repository

---

**Happy Generating! 🎨✨**
