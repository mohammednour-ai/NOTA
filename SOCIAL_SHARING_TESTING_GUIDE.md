# Social Sharing System - Testing Guide

## 🧪 Complete Testing Checklist

This guide walks you through testing all social sharing features on the NOTA platform.

---

## Pre-Testing Setup

### 1. Start the Server
```bash
npm start
```
Server should be running on `http://localhost:3000`

### 2. Open Browser
- **Desktop testing:** Chrome, Firefox, Safari, Edge
- **Mobile testing:** Use Chrome DevTools mobile emulator or real device

### 3. Take the Quiz
- Complete all 30 questions
- Reach the results page
- Verify 5 perfume recommendations appear

---

## Visual Checks

### ✅ Results Page
- [ ] "Share My Results" button is visible
- [ ] Button has share icon
- [ ] Button styling matches theme
- [ ] Button is clickable

### ✅ Share Modal
- [ ] Click "Share My Results" button
- [ ] Modal opens smoothly with slide-up animation
- [ ] Modal background is blurred/dimmed
- [ ] Close button (×) is visible in top-right
- [ ] Share preview image is generated and displayed
- [ ] Share text is pre-filled in text area
- [ ] All 8 platform buttons are visible:
  - Facebook
  - Twitter
  - WhatsApp
  - Pinterest
  - Instagram
  - Email
  - Copy Link
  - More (if on mobile)

---

## Platform Testing

### 1. Facebook Share

**Test Steps:**
1. Click Facebook button
2. Facebook share dialog should open in popup
3. URL should be pre-filled
4. Popup dimensions: ~600x400px

**Expected Result:**
- ✅ Popup opens successfully
- ✅ No popup blocker warning
- ✅ URL is correct
- ✅ Can close popup without issues

**Browser Console Check:**
```
📊 Share Event: facebook
```

---

### 2. Twitter Share

**Test Steps:**
1. Click Twitter button
2. Twitter intent should open in popup
3. Tweet text should include:
   - Share message
   - URL (shortened if possible)
   - Hashtags (#PerfumeTok, #ScentOfTheDay, #NOTA)

**Expected Result:**
- ✅ Popup opens (550x420px)
- ✅ Tweet pre-filled with text
- ✅ Hashtags included
- ✅ Character count looks reasonable

---

### 3. WhatsApp Share

**Desktop Test:**
1. Click WhatsApp button
2. WhatsApp Web should open in popup
3. Message should be pre-filled

**Mobile Test:**
1. Click WhatsApp button
2. WhatsApp app should open
3. Message should be ready to send

**Expected Result:**
- ✅ Correct WhatsApp interface opens
- ✅ Message includes text + URL
- ✅ Can select contact/group

---

### 4. Pinterest Share

**Test Steps:**
1. Click Pinterest button
2. Pinterest pin creator should open
3. Image should be loaded
4. Description should be pre-filled

**Expected Result:**
- ✅ Popup opens (750x550px)
- ✅ Image preview visible
- ✅ Description populated
- ✅ Can select board

---

### 5. Instagram Share

**Test Steps:**
1. Click Instagram button
2. Modal should appear with instructions
3. Caption should be copied to clipboard

**Desktop:**
- ✅ Shows modal: "Caption copied! Paste in Instagram"
- ✅ Clipboard has full caption + hashtags

**Mobile:**
- ✅ Instagram app attempts to open
- ✅ Fallback modal appears if app not installed

---

### 6. Email Share

**Test Steps:**
1. Click Email button
2. Default email client should open
3. Email should be pre-populated with:
   - Subject: Quiz results title
   - Body: Description + URL

**Expected Result:**
- ✅ Email client opens (Outlook, Gmail, etc.)
- ✅ Subject line is filled
- ✅ Body contains share text + URL
- ✅ Can edit before sending

---

### 7. Copy Link

**Test Steps:**
1. Click "Copy Link" button
2. Green notification should appear
3. Paste the clipboard content

**Expected Result:**
- ✅ Notification shows: "Link copied to clipboard! 📋"
- ✅ Clipboard contains full URL
- ✅ URL includes UTM parameters
- ✅ URL is valid and clickable

**Check clipboard contains:**
```
http://localhost:3000?utm_source=copy_clipboard&utm_medium=social&utm_campaign=quiz_results&utm_content=share_button
```

---

### 8. Native Share (Mobile)

**Test Steps:**
1. Open site on mobile device or use Chrome DevTools mobile emulator
2. Complete quiz to results
3. "More" button should be visible
4. Click "More" button

**Expected Result:**
- ✅ Native share sheet opens
- ✅ Shows installed apps (Messages, Email, etc.)
- ✅ Title and URL are pre-filled
- ✅ Can share to any app

**Desktop Fallback:**
- ✅ Button is hidden on desktop (no native share API)

---

## Share Image Testing

### Image Generation
1. Open share modal
2. Check preview image in modal

**Visual Checks:**
- [ ] Image is 600x315 pixels
- [ ] Gradient background (purple to pink for neutral)
- [ ] NOTA logo visible in top-left
- [ ] Perfume name displayed
- [ ] Match percentage shown
- [ ] Text is readable (white with shadow)
- [ ] No text cutoff or overlap

### Gender-Specific Colors
Take quiz with different genders:

**Male:**
- [ ] Gradient: Blue (#2196F3) to light blue (#90caf9)

**Female:**
- [ ] Gradient: Pink (#ff6b9d) to light pink (#ffd6e0)

**Non-binary:**
- [ ] Gradient: Purple (#9c27b0) to light purple (#ce93d8)

---

## URL Shortening

### Test TinyURL Integration
1. Open browser console
2. Share any platform
3. Check network tab for `/api/shorten-url` request

**Expected:**
- ✅ Request succeeds (200 OK)
- ✅ Response contains `shortUrl`
- ✅ Short URL is valid
- ✅ Fallback to long URL if service fails

**Console log:**
```
Shortened URL: https://tinyurl.com/abc123
```

---

## Error Handling

### 1. Popup Blocker Test
1. Enable popup blocker in browser
2. Try sharing to Facebook/Twitter
3. Verify error message appears

**Expected:**
- ✅ Notification: "Please allow popups to share"
- ✅ User can enable popups and retry

### 2. Rate Limiting Test
1. Click same share button rapidly (6+ times in 1 minute)
2. Verify rate limit message

**Expected:**
- ✅ After 5 shares: "Please wait XX seconds before sharing again"
- ✅ Countdown timer shows time remaining
- ✅ Button works again after cooldown

### 3. No Results Test
1. Open share modal without taking quiz
2. Should show error or nothing

**Expected:**
- ✅ Button disabled if no results
- ✅ Or error message if clicked

---

## Analytics Testing

### Browser Console Checks
After each share, verify console logs:

```javascript
📊 Share Event: {
  event: 'social_share',
  platform: 'facebook',
  timestamp: 1234567890
}
```

### Google Analytics (if configured)
1. Open GA Real-Time reports
2. Share to various platforms
3. Verify events appear

**Event structure:**
```
Event: share
Parameters:
  - method: facebook
  - content_type: perfume_quiz_results
```

---

## Meta Tags Testing

### Open Graph Validation
1. Complete quiz and reach results
2. Right-click → View Page Source
3. Find meta tags

**Check for:**
```html
<meta property="og:title" content="Your result title">
<meta property="og:description" content="Your description">
<meta property="og:image" content="data:image/png;base64...">
<meta property="og:url" content="http://localhost:3000/...">
```

### Facebook Debugger
1. Visit https://developers.facebook.com/tools/debug/
2. Enter your site URL
3. Check OG tags are read correctly

---

## Mobile Responsive Testing

### Screen Sizes
Test on:
- [ ] iPhone SE (375px)
- [ ] iPhone 12 (390px)
- [ ] Android (360px)
- [ ] iPad (768px)
- [ ] Desktop (1920px)

### Modal Behavior
- [ ] Modal fits screen on mobile
- [ ] Buttons are touch-friendly (min 44x44px)
- [ ] Text is readable
- [ ] Images scale properly
- [ ] Scroll works inside modal

### Touch Interactions
- [ ] Can tap platform buttons
- [ ] Can swipe to close modal (if implemented)
- [ ] Buttons have touch feedback
- [ ] No accidental double-taps

---

## Performance Testing

### Image Generation Speed
1. Click "Share My Results"
2. Time how long until image appears

**Expected:**
- ✅ Image generates in < 1 second
- ✅ No browser freezing
- ✅ Smooth modal animation

### Network Requests
Check Chrome DevTools Network tab:

- [ ] `/api/shorten-url` completes quickly
- [ ] Image size is reasonable (< 200KB)
- [ ] No failed requests

---

## Cross-Browser Testing

### Desktop Browsers

**Chrome:**
- [ ] All features work
- [ ] No console errors

**Firefox:**
- [ ] Share buttons work
- [ ] Canvas rendering correct

**Safari:**
- [ ] Native share API works
- [ ] Image generation works

**Edge:**
- [ ] Full functionality
- [ ] No compatibility issues

### Mobile Browsers

**iOS Safari:**
- [ ] Native share sheet works
- [ ] WhatsApp opens correctly

**Chrome Mobile:**
- [ ] All platforms functional
- [ ] Touch interactions smooth

---

## Accessibility Testing

### Keyboard Navigation
- [ ] Can tab to "Share My Results" button
- [ ] Can press Enter to open modal
- [ ] Can tab through platform buttons
- [ ] Can press Escape to close modal

### Screen Reader
- [ ] Buttons have aria-labels
- [ ] Modal has proper ARIA roles
- [ ] Notifications are announced

---

## Known Issues & Workarounds

### Issue 1: Instagram on Desktop
**Problem:** Instagram doesn't support pre-filled posts on desktop
**Workaround:** Show modal with instructions to copy caption

### Issue 2: Messenger Requires App ID
**Problem:** Facebook Messenger share requires app registration
**Workaround:** Fallback to Facebook share or remove button

### Issue 3: TikTok Deep Link Unreliable
**Problem:** TikTok deep links don't always work
**Workaround:** Open TikTok upload page in browser

---

## Success Criteria

All tests pass when:
- ✅ All 8 platforms share correctly
- ✅ Images generate properly
- ✅ URLs shorten successfully
- ✅ Analytics track all shares
- ✅ No console errors
- ✅ Mobile responsive works
- ✅ Error handling graceful
- ✅ Rate limiting prevents spam

---

## Quick Test Script

Run this in browser console after reaching results page:

```javascript
// Test share initialization
console.log('Share Manager:', shareManager);
console.log('Content Generator:', contentGenerator);
console.log('Current Results:', currentUserResults);

// Test image generation
if (contentGenerator) {
  contentGenerator.generateShareableImage(currentUserResults)
    .then(img => console.log('Image generated:', img.slice(0, 50) + '...'))
    .catch(err => console.error('Image generation failed:', err));
}

// Test URL shortening
fetch('/api/shorten-url', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ url: window.location.href })
})
  .then(r => r.json())
  .then(data => console.log('URL shortened:', data))
  .catch(err => console.error('URL shortening failed:', err));
```

---

## Reporting Issues

If you find bugs, note:
1. Browser & version
2. Device type
3. Steps to reproduce
4. Expected vs actual behavior
5. Console errors (if any)
6. Screenshots

---

## Next Steps

After testing:
1. ✅ Fix any bugs found
2. ✅ Optimize image generation if slow
3. ✅ Add more platforms if needed
4. ✅ Implement cloud image storage (optional)
5. ✅ Set up production analytics
6. ✅ Configure real UTM tracking

**Happy testing! 🎉**
