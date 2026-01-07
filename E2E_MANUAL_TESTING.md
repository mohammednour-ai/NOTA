# 🧪 Complete E2E Quiz Flow Test

## Manual Testing Guide - Q1 to Results

### Test the Complete User Journey

---

## 📋 Test Checklist

### Phase 1: Landing Page
- [ ] Page loads at http://localhost:3001
- [ ] Hero section visible
- [ ] "ScentMatch" logo (no emoji)
- [ ] "TAKE THE QUIZ" button visible
- [ ] Button is pink (#ff6b9d)
- [ ] Button has 8px border radius
- [ ] 3 SVG feature icons visible

### Phase 2: Quiz Start
- [ ] Click "TAKE THE QUIZ"
- [ ] Hero disappears
- [ ] Quiz section appears
- [ ] Progress bar shows (4px height, pink)
- [ ] "Question 1 of 30" displays
- [ ] Q1: "What's your gender?" displays
- [ ] 4 options visible
- [ ] No "Next" button (single-choice)

### Phase 3: Single-Choice Questions (Q1, Q2, Q5, etc.)
- [ ] Click any option
- [ ] Option turns pink background
- [ ] Green confirming flash
- [ ] Checkmark SVG appears (not emoji)
- [ ] After 500ms, auto-advances to next question
- [ ] Progress bar increases
- [ ] Question counter updates

**Test Q1 → Q2:**
- [ ] Select "Female" on Q1
- [ ] Auto-advances to Q2
- [ ] Q2: "What's your age range?"
- [ ] Select "18-25" (has hyphen)
- [ ] Auto-advances to Q3

### Phase 4: Multiple-Choice Questions (Q3, Q4, Q8, etc.)
- [ ] Q3: "When will you primarily wear..."
- [ ] Hint text: "Select all that apply"
- [ ] Checkboxes visible
- [ ] "Next" button visible
- [ ] Click multiple options
- [ ] Options turn pink when selected
- [ ] Checkboxes check/uncheck
- [ ] Can deselect by clicking again
- [ ] Click "Next" to advance
- [ ] Progress updates

**Test Q3 (Multiple Choice):**
- [ ] Select "Daily wear"
- [ ] Select "Evening events"
- [ ] Both show as selected
- [ ] Click "Daily wear" again
- [ ] It deselects
- [ ] Click "Next"
- [ ] Advances to Q4

### Phase 5: Navigation
- [ ] "Previous" button appears (not on Q1)
- [ ] Click "Previous"
- [ ] Returns to previous question
- [ ] Previous answer still selected
- [ ] Can change answer
- [ ] Progress bar decreases
- [ ] Click "Next" or option to continue

### Phase 6: Progress Throughout
- [ ] Progress bar grows with each question
- [ ] At Q15: Should show ~50% (15/30)
- [ ] Question counter accurate: "Question X of 30"
- [ ] Progress bar is pink color
- [ ] No jumping or glitches

### Phase 7: Text Input (Q30)
- [ ] Q30: "If yes, what perfumes have you loved..."
- [ ] Text input field visible
- [ ] Can type text
- [ ] "GET RESULTS" button visible (last question)
- [ ] Type something (e.g., "Chanel No. 5")
- [ ] Click "GET RESULTS"

### Phase 8: Loading Screen
- [ ] Quiz disappears
- [ ] Loading screen appears
- [ ] Spinner animation running
- [ ] Title: "Analyzing Your Preferences..."
- [ ] 4 loading steps visible
- [ ] Steps animate (become active one by one)
- [ ] All icons are SVG (no emojis)
- [ ] Loading takes 3-8 seconds

### Phase 9: Results Page
- [ ] Loading disappears
- [ ] Results section appears
- [ ] Header: "Your Perfect Perfumes"
- [ ] 5 perfume cards display
- [ ] Each card has:
  - [ ] Brand name (uppercase, pink)
  - [ ] Perfume name (heading)
  - [ ] Description
  - [ ] "Perfect for you because" section
  - [ ] Key notes (tags)
  - [ ] Affiliate links
- [ ] Cards have clean design
- [ ] 12px border radius
- [ ] Hover effect works
- [ ] Affiliate links clickable
- [ ] "Take Quiz Again" button at bottom

### Phase 10: Quiz Restart
- [ ] Click "Take Quiz Again"
- [ ] Returns to hero page
- [ ] All answers cleared
- [ ] Progress reset
- [ ] Can take quiz again

---

## 🐛 Common Issues to Check

### Issue 1: Auto-Advance Not Working
**Symptoms:**
- Click option on Q1, nothing happens
- Stuck on question

**Check:**
- Console for JavaScript errors (F12)
- onclick handler working
- 500ms timeout completing

**Fix Applied:** ✅ Index-based selection

### Issue 2: Q2 Not Working
**Symptoms:**
- Q1 advances, Q2 doesn't
- Error in console about special characters

**Check:**
- Options with hyphens: "18-25", "36-45"
- Options with plus: "56+"

**Fix Applied:** ✅ Index-based selection

### Issue 3: Multiple-Choice Not Selecting
**Symptoms:**
- Click option, doesn't select
- Checkbox doesn't check

**Check:**
- selectMultipleOptionByIndex function
- Checkbox element finding

**Fix Applied:** ✅ Index-based with proper element selection

### Issue 4: Progress Bar Wrong
**Symptoms:**
- Progress doesn't match question number
- Jumps or incorrect percentage

**Check:**
- currentQuestionIndex value
- Progress calculation: (current / total) * 100

**Fix Applied:** ✅ Proper index tracking

### Issue 5: Results Not Loading
**Symptoms:**
- Loading forever
- No results appear

**Check:**
- Console for API errors
- ANTHROPIC_API_KEY in .env
- Network tab for API calls

**Fix:** Verify API key is valid

---

## 🧪 Automated E2E Test

### Run Full Test Suite
```
URL: http://localhost:3001/test
Action: Click "Run All Tests"
Expected: 9/9 PASS
```

### Individual Test Results Should Be:
```
✅ TC-001: Page Load
✅ TC-002: Button Styling  
✅ TC-038: Color Consistency
✅ TC-041: Border Radius
✅ TC-039: System Fonts
✅ TC-040: No Emojis
✅ TC-004: Start Quiz
✅ TC-006: Auto-Advance
✅ TC-015: Progress Bar
```

---

## ✅ Success Criteria

### Quiz Flow Works If:
1. ✅ Q1 → Q2 auto-advances
2. ✅ Q2 → Q3 auto-advances  
3. ✅ Q3 (multiple) shows Next button
4. ✅ Can select multiple options
5. ✅ All 30 questions accessible
6. ✅ Progress bar accurate
7. ✅ Loading screen appears
8. ✅ Results display correctly
9. ✅ Can restart quiz

### Design Is Correct If:
1. ✅ All icons are SVG (no emojis)
2. ✅ Colors are pink (not purple)
3. ✅ Buttons have 8px radius
4. ✅ System fonts used
5. ✅ Auto-advance works smoothly
6. ✅ Visual feedback on selection
7. ✅ Professional appearance

---

## 📊 Test Execution Log

### Date: _____________
### Tester: _____________

| Test Phase | Status | Notes |
|------------|--------|-------|
| Landing Page | ⬜ | |
| Quiz Start | ⬜ | |
| Q1 (Single) | ⬜ | |
| Q2 (Single) | ⬜ | |
| Q3 (Multiple) | ⬜ | |
| Navigation | ⬜ | |
| Progress | ⬜ | |
| Q30 (Text) | ⬜ | |
| Loading | ⬜ | |
| Results | ⬜ | |
| Restart | ⬜ | |

**Overall Result:** ⬜ PASS / ⬜ FAIL

**Issues Found:** ________________

**Notes:** ________________

---

## 🚀 Quick Test Commands

### Test Single-Choice Auto-Advance:
1. Go to Q1
2. Select any option
3. Should auto-advance in 500ms

### Test Multiple-Choice Selection:
1. Go to Q3
2. Click multiple options
3. All should select
4. Click "Next"

### Test Special Characters:
1. Go to Q2
2. Select "18-25" or "56+"
3. Should work without errors

### Test Complete Flow:
1. Start quiz
2. Select options quickly
3. Should reach results in 2-3 minutes

---

## 📝 Report Template

```
QUIZ FLOW TEST REPORT
===================

Date: [DATE]
Version: 1.0.0
Environment: http://localhost:3001

RESULTS:
- Landing Page: ✅ PASS
- Single-Choice: ✅ PASS  
- Multiple-Choice: ✅ PASS
- Navigation: ✅ PASS
- Progress: ✅ PASS
- Loading: ✅ PASS
- Results: ✅ PASS

ISSUES: None

OVERALL: ✅ READY FOR PRODUCTION
```

---

**Use this guide to thoroughly test the entire quiz flow from start to finish!**
