Implement "Share SCENTORY with Friends" feature with strategic placement:

PLACEMENT POINTS:
1. Header/Nav: Floating "Gift" icon (always visible)
2. Welcome Screen: "Send to a friend who needs this" link
3. Mid-Quiz (Question 15/30): "Your friend would love this too! Share →"
4. Post-Results: Prominent "Share SCENTORY" card

COMPONENT: ShareAppButton

Props:
- variant: "icon" | "button" | "card" | "banner"
- placement: "header" | "welcome" | "mid-quiz" | "post-results"
- incentive?: string // e.g., "Both get 10% off"

Features:
1. Click triggers modal with sharing options:
   - WhatsApp: "Hey! I found this amazing perfume quiz 🌸 You have to try it: [link]"
   - Facebook: Share with custom message
   - Twitter: "Just discovered my signature scent with @ScentoryApp 💫 Find yours: [link]"
   - Instagram: "Copy link & story template" 
   - Email: Pre-filled invitation email
   - Copy Link: With success toast

2. Referral tracking:
   - Generate unique referral code per user
   - Add to all shared links: scentory.app/quiz?ref=USER123
   - Track signups from each referral
   - Store in database: { userId, referralCode, clickCount, signupCount }

3. Incentive system:
   - "Share with 3 friends → unlock exclusive scent guide"
   - "First friend who completes quiz → both get 15% off"
   - Progress tracker: "2/3 friends clicked your link!"

4. Pre-built templates:
   WhatsApp: "Found my signature scent! 🌸 It's [Personality Type] - take the quiz: [link]"
   Email Subject: "[Friend Name] thinks you'll love this perfume quiz ✨"
   Instagram Story: Auto-generated gradient with "Take my perfume quiz 💫 Link in bio"

ANALYTICS TO TRACK:
- Share button clicks by placement
- Share method preference (WhatsApp vs Instagram vs Email)
- Referral conversion rate
- Time to first share

Create the ShareAppModal component with all social options.
Implement referral code generation and tracking.
Add incentive progress tracking UI.