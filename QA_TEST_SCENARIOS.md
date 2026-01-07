# QA Test Scenarios - ScentMatch Platform

## Test Plan Overview
- **Application**: ScentMatch - Perfume Recommendation Platform
- **Version**: 1.0.0
- **Test Type**: End-to-End (E2E) Functional & Visual Testing
- **Browser Support**: Chrome, Firefox, Safari, Edge
- **Devices**: Desktop, Tablet, Mobile

---

## Test Environment
- **Local**: http://localhost:3001
- **API**: Anthropic Claude 3.5 Sonnet
- **Backend**: Express.js (Node.js)
- **Frontend**: Vanilla JavaScript

---

## Test Scenarios & Expected Results

### 1. HERO/LANDING PAGE TESTS

#### TC-001: Page Load
**Precondition**: None
**Steps**:
1. Navigate to http://localhost:3001
**Expected Result**:
- ✅ Page loads within 2 seconds
- ✅ Hero section is visible
- ✅ "ScentMatch" logo displayed (no emoji)
- ✅ Header navigation visible (About, How It Works, Contact)
- ✅ Hero title: "Discover Your Signature Scent"
- ✅ Hero subtitle present
- ✅ "TAKE THE QUIZ" button visible
- ✅ 3 feature icons visible (AI-Powered, Personalized, Instant Links)
- ✅ 3 animated perfume bottles visible on right side
- ✅ Footer visible at bottom

#### TC-002: Hero Button Styling
**Steps**:
1. Inspect "TAKE THE QUIZ" button
**Expected Result**:
- ✅ Background color: `#ff6b9d` (pink)
- ✅ Text: Uppercase, white color
- ✅ Border radius: 8px (not pill-shaped)
- ✅ No gradient background

#### TC-003: Hero Button Hover
**Steps**:
1. Hover over "TAKE THE QUIZ" button
**Expected Result**:
- ✅ Background changes to `#ff5087` (darker pink)
- ✅ No transform animation
- ✅ Cursor changes to pointer

#### TC-004: Start Quiz
**Steps**:
1. Click "TAKE THE QUIZ" button
**Expected Result**:
- ✅ Hero section disappears
- ✅ Quiz section appears
- ✅ Question 1 of 30 displayed
- ✅ Progress bar shows ~3.33% (1/30)
- ✅ Progress bar color: pink (`#ff6b9d`)

---

### 2. QUIZ NAVIGATION TESTS

#### TC-005: First Question Display
**Precondition**: Quiz started
**Steps**:
1. Observe first question
**Expected Result**:
- ✅ Question text: "What's your gender?"
- ✅ 4 options visible: Female, Male, Non-binary, Prefer not to say
- ✅ Options are cards with 1px border
- ✅ Border color: `#e0e0e0` (light gray)
- ✅ "Previous" button is disabled
- ✅ "Next" button is NOT visible (single-choice question)
- ✅ No checkboxes or radio buttons visible

#### TC-006: Single-Choice Selection
**Steps**:
1. Hover over an option
**Expected Result**:
- ✅ Background changes to `#f5f5f5`
- ✅ Border changes to pink
- ✅ Cursor is pointer

**Steps**:
2. Click "Female" option
**Expected Result**:
- ✅ Option background changes to `#fff5f8` (light pink)
- ✅ Border becomes 2px and pink
- ✅ Font weight increases to 500
- ✅ After 300ms delay, automatically advances to Question 2
- ✅ No "Next" button click needed

#### TC-007: Auto-Advance Timing
**Steps**:
1. Click any single-choice option
2. Time the auto-advance
**Expected Result**:
- ✅ Delay is exactly 300 milliseconds
- ✅ Smooth transition to next question
- ✅ Previous answer is saved

#### TC-008: Multiple-Choice Question
**Precondition**: Navigate to Question 3
**Steps**:
1. Observe Question 3 (When will you wear perfume?)
**Expected Result**:
- ✅ Question type: multiple-choice
- ✅ Hint text visible: "Select all that apply"
- ✅ Checkboxes visible inside options
- ✅ "Next" button IS visible
- ✅ "Previous" button is enabled
- ✅ Can select multiple options

#### TC-009: Multiple Selection
**Steps**:
1. Click "Daily wear"
2. Click "Evening events"
3. Click "Work/Office"
**Expected Result**:
- ✅ All 3 options show as selected
- ✅ All have pink background and border
- ✅ Checkboxes are checked
- ✅ Does NOT auto-advance
- ✅ "Next" button remains visible

#### TC-010: Deselect Option
**Steps**:
1. Click already selected "Daily wear"
**Expected Result**:
- ✅ Option becomes unselected
- ✅ Background returns to white
- ✅ Border returns to gray
- ✅ Checkbox unchecked

#### TC-011: Multiple-Choice Validation
**Steps**:
1. Deselect all options
2. Click "Next" button
**Expected Result**:
- ✅ Alert appears: "Please answer the question before continuing."
- ✅ Does not advance to next question
- ✅ Stays on current question

#### TC-012: Text Input Question
**Precondition**: Navigate to Question 30
**Steps**:
1. Observe Question 30 (Past perfumes loved)
**Expected Result**:
- ✅ Question type: text input
- ✅ Text input field visible
- ✅ Placeholder text present
- ✅ "Next" button visible
- ✅ Button text shows "GET RESULTS" (last question)

#### TC-013: Text Input Validation
**Steps**:
1. Leave text field empty
2. Click "GET RESULTS"
**Expected Result**:
- ✅ Alert appears: "Please answer the question before continuing."
- ✅ Does not submit quiz

#### TC-014: Previous Button
**Steps**:
1. On Question 5, click "Previous"
**Expected Result**:
- ✅ Returns to Question 4
- ✅ Previous answer is still selected
- ✅ Progress bar decreases
- ✅ Question counter shows 4 of 30

#### TC-015: Progress Bar Accuracy
**Steps**:
1. Check progress at Question 15
**Expected Result**:
- ✅ Progress bar shows 50% width (15/30)
- ✅ Counter shows "Question 15 of 30"
- ✅ Progress bar is pink
- ✅ Height is 4px

---

### 3. QUIZ COMPLETION & LOADING TESTS

#### TC-016: Submit Quiz
**Steps**:
1. Answer all 30 questions
2. On Question 30, enter text and click "GET RESULTS"
**Expected Result**:
- ✅ Quiz section disappears
- ✅ Loading section appears
- ✅ Spinner animation visible
- ✅ Title: "Analyzing Your Preferences..."
- ✅ Subtitle: "Our AI is finding the perfect perfumes for you"
- ✅ 4 loading steps visible

#### TC-017: Loading Steps Animation
**Steps**:
1. Observe loading steps
**Expected Result**:
- ✅ Step 1 "Processing answers" is active (opacity: 1)
- ✅ Steps 2-4 are inactive (opacity: 0.5)
- ✅ After 1.5s, Step 2 becomes active
- ✅ After 3s, Step 3 becomes active
- ✅ After 4.5s, Step 4 becomes active
- ✅ SVG icons visible (no emojis)
- ✅ Pink color on icons

#### TC-018: API Call Success
**Precondition**: Valid Anthropic API key in .env
**Steps**:
1. Submit quiz with all answers
**Expected Result**:
- ✅ API call to `/api/analyze` succeeds
- ✅ Response contains 5 perfume recommendations
- ✅ Each has: brand, name, description, why, notes
- ✅ API call to `/api/search-affiliates` succeeds
- ✅ Affiliate links returned
- ✅ Total loading time: 3-8 seconds

---

### 4. RESULTS PAGE TESTS

#### TC-019: Results Display
**Precondition**: Quiz completed, API calls successful
**Steps**:
1. Observe results page
**Expected Result**:
- ✅ Loading section disappears
- ✅ Results section appears
- ✅ Header: "Your Perfect Perfumes"
- ✅ Subtitle present
- ✅ 5 perfume cards displayed
- ✅ Grid layout (responsive)
- ✅ "Take Quiz Again" button at bottom

#### TC-020: Perfume Card Content
**Steps**:
1. Inspect first perfume card
**Expected Result**:
- ✅ Brand name in uppercase (pink color)
- ✅ Perfume name as heading
- ✅ Description paragraph
- ✅ "Perfect for you because" section (pink background)
- ✅ Key notes as tags
- ✅ Affiliate links section
- ✅ Clean white card with subtle shadow
- ✅ 8px border radius

#### TC-021: Perfume Card Styling
**Steps**:
1. Inspect card styling
**Expected Result**:
- ✅ Border: 1px solid `#e0e0e0`
- ✅ Border radius: 12px
- ✅ Background: white
- ✅ Padding: 2rem
- ✅ Shadow: subtle (0 2px 8px)

#### TC-022: Card Hover Effect
**Steps**:
1. Hover over perfume card
**Expected Result**:
- ✅ Card moves up 3px (translateY)
- ✅ Shadow becomes more prominent
- ✅ Smooth transition (0.3s)

#### TC-023: Affiliate Link Display
**Steps**:
1. Check affiliate links in card
**Expected Result**:
- ✅ Amazon link present
- ✅ Link background: pink (`#ff6b9d`)
- ✅ White text
- ✅ Platform name with icon
- ✅ "Check Amazon" or price text
- ✅ Border radius: 8px

#### TC-024: Affiliate Link Click
**Steps**:
1. Click Amazon affiliate link
**Expected Result**:
- ✅ Opens in new tab (`target="_blank"`)
- ✅ Has `rel="nofollow noopener"`
- ✅ Navigates to Amazon search
- ✅ Includes affiliate tag if configured

#### TC-025: Take Quiz Again
**Steps**:
1. Click "Take Quiz Again" button
**Expected Result**:
- ✅ Results section disappears
- ✅ Hero section appears
- ✅ All answers cleared
- ✅ Progress reset to 0%
- ✅ Ready for new quiz

---

### 5. RESPONSIVE DESIGN TESTS

#### TC-026: Mobile View (375px width)
**Steps**:
1. Resize browser to 375px width
**Expected Result**:
- ✅ Hero switches to single column
- ✅ Perfume bottles stack vertically or shrink
- ✅ Navigation menu hidden or hamburger
- ✅ Quiz cards full width
- ✅ Text remains readable
- ✅ Buttons full width or centered
- ✅ Results cards stack (1 column)

#### TC-027: Tablet View (768px width)
**Steps**:
1. Resize browser to 768px width
**Expected Result**:
- ✅ Hero adjusts appropriately
- ✅ Quiz cards maintain good width
- ✅ Results show 2 columns
- ✅ Navigation visible
- ✅ All interactive elements accessible

#### TC-028: Desktop View (1920px width)
**Steps**:
1. View on large desktop
**Expected Result**:
- ✅ Hero in 2 columns
- ✅ Quiz content centered, max-width 900px
- ✅ Results show 2-3 columns
- ✅ Content doesn't stretch too wide
- ✅ Proper margins maintained

---

### 6. ERROR HANDLING TESTS

#### TC-029: No API Key
**Precondition**: Remove ANTHROPIC_API_KEY from .env
**Steps**:
1. Complete quiz and submit
**Expected Result**:
- ✅ Error during API call
- ✅ User sees error message or alert
- ✅ Returns to quiz (or shows error page)
- ✅ Answers preserved

#### TC-030: Network Error
**Steps**:
1. Disconnect network
2. Submit quiz
**Expected Result**:
- ✅ Fetch fails gracefully
- ✅ Error alert shown
- ✅ User can retry
- ✅ Loading stops

#### TC-031: Invalid Question Navigation
**Steps**:
1. Open browser console
2. Try to navigate to question 31 (doesn't exist)
**Expected Result**:
- ✅ Gracefully handles invalid index
- ✅ Stays on last valid question
- ✅ No JavaScript errors

---

### 7. ACCESSIBILITY TESTS

#### TC-032: Keyboard Navigation
**Steps**:
1. Use Tab key to navigate
**Expected Result**:
- ✅ Can tab through all interactive elements
- ✅ Focus visible on buttons and cards
- ✅ Can select options with Enter/Space
- ✅ Focus order is logical

#### TC-033: Arrow Key Navigation
**Steps**:
1. Press Right Arrow on quiz
**Expected Result**:
- ✅ Advances to next question (if answered)
- ✅ Left Arrow goes to previous

#### TC-034: Screen Reader Support
**Steps**:
1. Use screen reader (NVDA/JAWS)
**Expected Result**:
- ✅ All text is read correctly
- ✅ Button labels clear
- ✅ Form elements have labels
- ✅ Progress announced

---

### 8. PERFORMANCE TESTS

#### TC-035: Initial Page Load
**Steps**:
1. Clear cache
2. Load page, measure time
**Expected Result**:
- ✅ First Contentful Paint < 1.5s
- ✅ Time to Interactive < 3s
- ✅ Total page size < 500KB (without node_modules)

#### TC-036: Quiz Interaction Speed
**Steps**:
1. Click option, measure response
**Expected Result**:
- ✅ Selection feedback < 50ms
- ✅ Auto-advance delay exactly 300ms
- ✅ Question load < 100ms
- ✅ Smooth animations (60fps)

#### TC-037: API Response Time
**Steps**:
1. Submit quiz, measure API time
**Expected Result**:
- ✅ Claude API responds in 2-5 seconds
- ✅ Affiliate search < 1 second
- ✅ Total processing < 8 seconds

---

### 9. VISUAL REGRESSION TESTS

#### TC-038: Color Consistency
**Expected Result**:
- ✅ Primary pink: `#ff6b9d`
- ✅ Hover pink: `#ff5087`
- ✅ Text black: `#1a1a1a`
- ✅ Border gray: `#e0e0e0`
- ✅ No purple colors (old design)
- ✅ No gradient backgrounds

#### TC-039: Typography
**Expected Result**:
- ✅ Font family: System fonts (no Google Fonts)
- ✅ No Playfair Display
- ✅ Font weights: 400 (normal), 500 (medium), 600 (semibold)
- ✅ Consistent line heights
- ✅ Letter spacing on uppercase buttons

#### TC-040: Icon Rendering
**Expected Result**:
- ✅ No emojis anywhere
- ✅ All icons are SVG
- ✅ Icons render clearly at all sizes
- ✅ Icon color matches design (pink)

#### TC-041: Border Radius
**Expected Result**:
- ✅ Buttons: 8px
- ✅ Cards: 8px (options) or 12px (result cards)
- ✅ Input fields: 8px
- ✅ No pill shapes (50px radius)

#### TC-042: Shadow Consistency
**Expected Result**:
- ✅ Subtle shadows: `0 2px 8px rgba(0,0,0,0.06)`
- ✅ Hover shadows: `0 4px 16px rgba(0,0,0,0.1)`
- ✅ No heavy shadows (old design)

---

### 10. CROSS-BROWSER TESTS

#### TC-043: Chrome
**Steps**: Test all scenarios in Chrome
**Expected Result**: ✅ All tests pass

#### TC-044: Firefox
**Steps**: Test all scenarios in Firefox
**Expected Result**: ✅ All tests pass

#### TC-045: Safari
**Steps**: Test all scenarios in Safari
**Expected Result**: ✅ All tests pass

#### TC-046: Edge
**Steps**: Test all scenarios in Edge
**Expected Result**: ✅ All tests pass

---

## Test Summary

**Total Test Cases**: 46
**Critical**: 20 (TC-001 to TC-025)
**Important**: 15 (TC-026 to TC-037)
**Nice to Have**: 11 (TC-038 to TC-046)

---

## Pass/Fail Criteria

- **Pass**: All expected results achieved, no errors
- **Fail**: One or more expected results not achieved
- **Blocked**: Cannot test due to environment issue
- **Skip**: Not applicable for current test run

---

## Test Execution

### Manual Testing
- Execute all scenarios step by step
- Document actual results
- Take screenshots for visual tests
- Record videos for flow tests

### Automated Testing
- Use E2E framework (Cypress/Playwright)
- Run automated suite
- Generate test reports
- Track test coverage

---

**Last Updated**: January 5, 2026
**Test Engineer**: QA Team
**Status**: Ready for Execution
