# Noir Luxe Quick Reference Guide

## 🎨 Color Tokens (CSS Variables)

### Usage in Code
```css
/* Use these tokens instead of hardcoded colors */
background: var(--bg-primary);      /* #0a0a0a */
color: var(--text-primary);         /* #f5f5f5 */
border: 1px solid var(--border-subtle); /* #2a2a2a */
```

### Token Categories

#### Backgrounds
- `--bg-primary` - Main page background (#0a0a0a)
- `--bg-surface` - Cards, modals (#1a1a1a)
- `--bg-surface-hover` - Hover state (#242424)

#### Text
- `--text-primary` - Main text (#f5f5f5)
- `--text-secondary` - Secondary text (#b8b8b8)
- `--text-tertiary` - Hints, subtle (#888888)

#### CTA (Call-to-Action)
- `--cta-primary` - Evergreen base (#2d5f4e)
- `--cta-primary-hover` - Hover state (#3a7a62)
- `--cta-primary-rgb` - RGB for effects (45, 95, 78)

#### Accents
- `--accent-gold` - Champagne gold (#d4af70)
- `--accent-gold-dim` - Subtle highlights (#a38c5a)

#### Semantic
- `--success-color` - Success state (#4a8f6a)
- `--warning-color` - Warning state (#d49a3a)
- `--error-color` - Error state (#c74242)

#### Borders & Focus
- `--border-subtle` - Light dividers (#2a2a2a)
- `--border-emphasis` - Strong dividers (#3a3a3a)
- `--focus-ring` - Keyboard focus (= accent-gold)

#### Shadows
- `--shadow` - Small (0 2px 8px)
- `--shadow-hover` - Medium (0 4px 16px)
- `--shadow-lg` - Large (0 8px 32px)

---

## 🛒 Aggregated Offers UI

### HTML Structure
```html
<div class="offers-card">
    <div class="offers-header">
        <h3>Where to Buy</h3>
        <p>Compare prices...</p>
    </div>
    
    <div class="offer-list">
        <div class="offer-row best-deal">
            <div class="offer-retailer">
                <div class="retailer-logo-placeholder">🛒</div>
                <span class="retailer-name">Amazon.com</span>
            </div>
            <div class="offer-price">$89.99</div>
            <a href="..." class="visit-btn">Visit</a>
        </div>
        <!-- More offer rows... -->
    </div>
    
    <div class="affiliate-disclosure">...</div>
</div>
```

### CSS Classes

#### Container
- `.offers-card` - Main wrapper (dark surface)
- `.offers-header` - Title section
- `.offer-list` - List container

#### Offer Row
- `.offer-row` - Single offer row
- `.offer-row.best-deal` - Best deal variant (gold border)

#### Row Contents
- `.offer-retailer` - Retailer column (logo + name)
- `.retailer-logo-placeholder` - Icon/emoji
- `.retailer-name` - Retailer text
- `.offer-price` - Price column
- `.price-unavailable` - For missing prices
- `.visit-btn` - CTA button (evergreen)

#### Footer
- `.affiliate-disclosure` - Legal notice

---

## 📱 Responsive Breakpoints

### Desktop (> 768px)
```css
.offer-row {
    grid-template-columns: 2fr 1fr auto;
    /* Retailer | Price | Button */
}
```

### Mobile (≤ 768px)
```css
.offer-row {
    grid-template-columns: 1fr;
    /* Stacked layout */
}

.visit-btn {
    width: 100%;
}
```

---

## 🔧 JavaScript Functions

### Parse Price
```javascript
parsePrice("$89.99")  // Returns: 89.99
parsePrice("€45,50")  // Returns: 45.50
parsePrice("N/A")     // Returns: null
```

### Render Offers
```javascript
renderAggregatedOffers(retailerLinks)
// Returns: HTML string of sorted offer rows
// - Sorts by price (ascending)
// - Highlights best deal
// - Handles missing prices
```

### Get Retailer Icon
```javascript
getRetailerEmoji("Amazon")    // Returns: "🛒"
getRetailerEmoji("Sephora")   // Returns: "💎"
getRetailerEmoji("Ulta")      // Returns: "🌟"
// ... etc
```

---

## 🎯 Component States

### Button States
```css
/* Default */
.visit-btn {
    background: var(--cta-primary);
    color: var(--text-primary);
}

/* Hover */
.visit-btn:hover {
    background: var(--cta-primary-hover);
    transform: translateY(-2px);
}

/* Focus (keyboard) */
.visit-btn:focus {
    outline: 2px solid var(--focus-ring);
}
```

### Best Deal State
```css
.offer-row.best-deal {
    border-color: var(--accent-gold);
    /* Gold accent */
}

.offer-row.best-deal::before {
    content: "BEST DEAL";
    /* Badge styling */
}

.offer-row.best-deal .offer-price {
    color: var(--success-color);
    /* Green price */
}
```

---

## 📊 Testing Checklist

### Visual Tests
- [ ] Check color contrast (WCAG AA)
- [ ] Test hover states on all buttons
- [ ] Verify focus indicators (Tab navigation)
- [ ] Test responsive layout (resize browser)
- [ ] Check best deal highlighting

### Functional Tests
- [ ] Prices sort correctly (ascending)
- [ ] Missing prices handled gracefully
- [ ] Retailer icons display properly
- [ ] Click tracking works
- [ ] Mobile layout responsive

### Browser Tests
- [ ] Chrome/Edge (desktop)
- [ ] Firefox (desktop)
- [ ] Safari (desktop)
- [ ] Mobile browsers (iOS/Android)

---

## 🐛 Common Issues & Fixes

### Issue: Colors not showing
**Fix**: Clear browser cache, check CSS tokens are defined

### Issue: Offers not sorting
**Fix**: Verify `parsePrice()` function, check price format

### Issue: Best deal not highlighted
**Fix**: Check sorting logic, verify `.best-deal` class applied

### Issue: Mobile layout broken
**Fix**: Check responsive CSS (@media queries)

### Issue: Low contrast warnings
**Fix**: Use semantic colors (--text-primary, not hardcoded)

---

## 📝 Code Conventions

### CSS
```css
/* Use tokens, not hardcoded colors */
❌ background: #ff0000;
✅ background: var(--error-color);

/* Use semantic names */
❌ color: #d4af70;
✅ color: var(--accent-gold);
```

### JavaScript
```javascript
// Check for null/undefined
const price = parsePrice(link.price);
if (price !== null) {
    // Use price
}

// Use semantic variable names
const isBestDeal = (index === bestDealIndex);
```

### HTML
```html
<!-- Use semantic class names -->
<div class="offer-row best-deal">
  <!-- Not: <div class="row highlight"> -->
  
<!-- Keep structure flat, avoid deep nesting -->
✅ Good: 3 levels deep
❌ Bad: 6+ levels deep
```

---

## 🚀 Quick Start

### 1. View Demo
```
Navigate to: /playground.html
```

### 2. Update Component Colors
```css
/* In your CSS file */
.my-component {
    background: var(--bg-surface);
    color: var(--text-primary);
    border: 1px solid var(--border-subtle);
}
```

### 3. Add New Offer Row
```javascript
// In displayResults() or similar
const offersHtml = renderAggregatedOffers(perfume.retailerLinks);
```

### 4. Test Changes
```
1. Save files
2. Refresh browser (Ctrl+Shift+R / Cmd+Shift+R)
3. Check console for errors
4. Test responsive (DevTools)
```

---

## 📚 Additional Resources

- **Full Implementation**: See `NOIR_LUXE_IMPLEMENTATION_COMPLETE.md`
- **Original Plan**: `C:\Users\Baba\.cursor\plans\noir_luxe_palette_+_results_offers_b8e7108e.plan.md`
- **Playground Demo**: `/playground.html`
- **Token Reference**: `:root` in `public/styles.css`

---

**Need help?** Check the implementation docs or inspect existing components for examples.
