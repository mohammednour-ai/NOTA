# Leonardo AI - Shareable Card Template Generation

## 🎨 Quick Instructions

You need to generate **ONE** template image using Leonardo AI Vision XL to complete the social sharing system.

---

## Generation Settings

### Model Information
- **Model:** Leonardo Vision XL
- **Purpose:** Create shareable social media card background template
- **Cost:** ~4-5 tokens (one generation only)

### Image Specifications
- **Dimensions:** 600 x 315 pixels (1.9:1 aspect ratio)
- **Format:** PNG (best quality)
- **Quantity:** 1 image
- **File name:** `share-template.png`
- **Destination:** Save to `public/images/share-template.png`

---

## Prompt Settings

### Main Prompt

```
Modern geometric pattern background, gradient purple #c77dff to pink 
#ff6b9d diagonal from bottom-left to top-right, clean lines, 
minimalist luxury design, subtle perfume bottle silhouette watermark, 
600x315 social media card, premium perfume brand style, flat design, 
space for dynamic text, sophisticated and professional
```

### Negative Prompt

```
text, words, letters, numbers, typography, logos, buttons, UI elements, 
cluttered, busy, realistic photography, 3D render, low quality, people, 
faces, product photos
```

### Advanced Settings
- **Preset:** Product Design / Marketing
- **Width:** 600
- **Height:** 315
- **Guidance Scale:** 7 (balanced)
- **Number of Images:** 1
- **Photo Real:** OFF
- **Alchemy:** ON (if available)
- **Quality:** High

---

## Step-by-Step Generation Process

### 1. Access Leonardo AI
- Go to https://app.leonardo.ai/
- Log in to your account
- Click "Image Generation"

### 2. Select Model
- Click "Select Model" dropdown
- Choose **"Leonardo Vision XL"**
- Confirm selection

### 3. Set Dimensions
- Width: **600**
- Height: **315**
- Lock aspect ratio: OFF

### 4. Enter Prompts
- **Prompt field:** Paste the main prompt above
- **Negative prompt:** Paste the negative prompt above

### 5. Configure Settings
- **Number of Images:** 1
- **Guidance Scale:** 7
- **Photo Real:** Disabled
- **Preset:** Product Design (if available)

### 6. Generate
- Click "Generate" button
- Wait 10-20 seconds for generation
- **Cost:** ~4-5 tokens

### 7. Download & Save
- Click on the generated image
- Click "Download" button
- Save as: `share-template.png`
- Move to: `d:\Lab2\public\images\share-template.png`

---

## Optional: Enable Template in Code

Once you have the template image, enable it in the system:

### Option A: Use Leonardo Template (Recommended)

Edit `public/script.js` and update the initialization:

```javascript
contentGenerator = new ShareableContentGenerator({
    baseUrl: window.location.origin,
    brandName: 'NOTA',
    logoUrl: 'images/logo/gpt-image-1.5_Modern_luxury_perfume_app_logo_design_for_NOTA_minimalist_perfume_bottle_silhoue-0.jpg',
    templateUrl: 'images/share-template.png'  // ADD THIS LINE
});
```

### Option B: Use CSS Gradient (No Leonardo needed)

Leave the code as-is! The system will automatically generate a beautiful gradient background using CSS when no template is specified.

---

## What the Template Should Look Like

✅ **Good characteristics:**
- Clean diagonal gradient (purple to pink)
- Geometric line pattern (subtle, 10% opacity)
- Luxury/premium aesthetic
- Flat design (not 3D)
- No text or letters
- Professional marketing look
- Space in center for text overlay

❌ **Avoid:**
- Any text or words
- Busy/cluttered design
- Realistic photos
- People or faces
- 3D elements
- Low quality/pixelated

---

## Token Conservation Tips

1. **Generate once:** Only 1 image needed (saves tokens)
2. **No variations:** The Canvas API handles personalization
3. **Reusable:** Same template for all users
4. **Fallback available:** System works without template

**Total cost:** 4-5 tokens ✨

---

## Alternative: Skip Leonardo AI

If you want to conserve ALL tokens, you can skip the Leonardo generation entirely:

**The system will automatically:**
- Generate beautiful CSS gradients
- Adapt colors based on user gender (pink/blue/purple)
- Create geometric patterns programmatically
- Still look professional and polished

**No Leonardo image = 0 tokens used!**

---

## Testing the Template

After adding the template:

1. Start the server: `npm start`
2. Take the quiz
3. View results
4. Click "Share My Results"
5. Check if the preview image shows your Leonardo template
6. If not visible, check browser console for errors

---

## Troubleshooting

### Template not loading?
- Check file path: `public/images/share-template.png`
- Check file name is exact: `share-template.png`
- Clear browser cache and refresh
- Check browser console for errors

### Image looks wrong?
- Verify dimensions are 600x315
- Check file isn't corrupted
- Try re-downloading from Leonardo

### Want different style?
- Adjust the prompt and regenerate
- Cost: 4-5 more tokens per attempt

---

## Summary

**Option 1: With Leonardo (Professional Design)**
- Cost: 4-5 tokens
- Time: 5 minutes
- Result: Premium branded template

**Option 2: Without Leonardo (Built-in Gradients)**
- Cost: 0 tokens
- Time: 0 minutes
- Result: Beautiful CSS-generated background

**Both options work great!** Choose based on your preference and token budget.
