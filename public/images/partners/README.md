# Partner Logo Images - Placement Guide

## 📁 Location
Place all partner/retailer logos in: `public/images/partners/`

## 🖼️ Required Images

### Current Placeholders:
1. **amazon-logo.png** - Amazon logo (white or gold version for dark background)
2. **sephora-logo.png** - Sephora logo  
3. **nordstrom-logo.png** - Nordstrom logo
4. **ulta-logo.png** - Ulta Beauty logo
5. **macys-logo.png** - Macy's logo
6. **bloomingdales-logo.png** - Bloomingdale's logo

## 📐 Image Specifications

### Recommended Dimensions:
- **Width**: 200-300px
- **Height**: 80-100px  
- **Format**: PNG with transparent background (preferred)
- **Alternative**: White or gold monochrome versions

### Design Guidelines:
- **Style**: Clean, professional logos
- **Background**: Transparent or solid white/gold for dark theme
- **Quality**: High resolution (2x for retina displays)
- **File Size**: Optimize to under 50KB each

## 🎨 Noir Luxe Theme Considerations

Since we're using a dark luxury theme, logos should be:
- **White**, **Gold**, or **Light colored** versions
- Avoid dark logos (won't show on dark background)
- If only dark logos available, apply CSS filter in code

## 💡 Where to Find Logos

### Official Brand Resources:
1. **Brand Press Kits** - Most companies have official logo downloads
2. **Partner/Affiliate Portals** - Check your affiliate program resources
3. **Wikimedia Commons** - Many official logos available
4. **Clearbit Logo API** - `https://logo.clearbit.com/[domain].com`

### Example API Usage:
```
https://logo.clearbit.com/amazon.com
https://logo.clearbit.com/sephora.com
https://logo.clearbit.com/nordstrom.com
```

## 🔧 Implementation Status

The carousel is already coded and will work automatically once you add the images. 

### Current Features:
✅ Grayscale filter (color on hover)
✅ Smooth fade transitions  
✅ 60% opacity default, 100% on hover
✅ Responsive scaling
✅ Auto-scrolling animation ready

## 📝 Notes

- If logos are missing, the carousel will show broken image placeholders
- You can add more logos by duplicating the `.partner-logo-wrapper` div in HTML
- CSS styling is already optimized for dark Noir Luxe theme
- Logos will automatically be optimized for mobile displays

## 🚀 Quick Start

1. Download/save logo images
2. Place in `public/images/partners/` folder
3. Name exactly as specified above
4. Refresh browser - logos will appear automatically!

---

**Alternative**: If you don't have access to logos, you can temporarily use text-based retailer names with elegant typography until official logos are obtained.
