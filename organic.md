# Social Sharing System for SCENTORY App

Create a comprehensive social sharing system for SCENTORY app with the following capabilities:

## CORE SHARING FUNCTIONALITY

### 1. SocialShareManager Utility Class

Create a SocialShareManager utility class with methods:

- `shareToFacebook(url, title, description, imageUrl)`
- `shareToTwitter(text, url, hashtags)`
- `shareToWhatsApp(text, url)`
- `shareToMessenger(url)`
- `shareToInstagram(imageUrl, caption)` // Open Instagram with pre-filled caption
- `shareToTikTok(videoUrl)` // Deep link if possible
- `shareToPinterest(imageUrl, description, url)`
- `shareViaEmail(to, subject, body, htmlBody)`
- `copyToClipboard(url)`
- `shareNative()` // Use Web Share API for mobile

### 2. Shareable Content Generator

- `generateShareableImage(userResults)` // Canvas API to create branded result image
- `generateShareText(userName, topMatch, personality)`
- `generateHashtags()` // #PerfumeTok #ScentOfTheDay #FragranceCommunity
- `generateUTMParameters(source, medium, campaign)`

### 3. URL Shortening Integration

- Use Bitly or similar API
- Track click-through rates
- Create vanity URLs for different share sources

### 4. Open Graph Meta Tags Generator

- Dynamic OG tags based on user results
- Personalized images for each share

## TECHNICAL REQUIREMENTS

- Next.js 14 compatible
- Mobile-first with native share API fallback
- Track all share events with analytics
- Rate limiting to prevent spam
- Error handling for blocked popups

## Example Usage

```javascript
const shareManager = new SocialShareManager();
await shareManager.shareToFacebook({
  url: `${baseUrl}/quiz?ref=${userId}`,
  title: "I found my signature scent!",
  description: "I'm a Natural Wanderer and my perfect match is Marc Jacobs Daisy",
  imageUrl: generatedImageUrl
});
```
