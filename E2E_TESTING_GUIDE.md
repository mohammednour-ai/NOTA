# E2E Visual Testing Suite - User Guide

## Overview
Complete visual and functional testing suite with iframe support for the NOTA platform.

---

## 🚀 Quick Start

### 1. Open the Testing Suite
```bash
# Option 1: Direct open
open e2e-test-visual.html

# Option 2: Or just double-click the file
```

### 2. Ensure Application is Running
Make sure NOTA is running at `http://localhost:3001`

```bash
npm start
```

### 3. Run Tests
Click **"Run All Tests"** button in the testing suite

---

## 🎯 Features

### Device Testing
- **Desktop** (1920x1080)
- **Laptop** (1366x768)  
- **Tablet** (768x1024)
- **Mobile** (375x667)
- **iPhone 12** (390x844)
- **iPad** (810x1080)

### Test Categories
1. **Visual Tests**: Colors, fonts, icons, borders
2. **Functional Tests**: Navigation, interactions, API calls
3. **Full Suite**: All tests combined

### What Gets Tested

#### Visual Regression Tests
✅ Color scheme (pink vs old purple)  
✅ Typography (system fonts vs Google Fonts)  
✅ Border radius (8px vs pill shapes)  
✅ Icons (SVG vs emojis)  
✅ Button styling  
✅ Card styling  
✅ Progress bar  

#### Functional Tests
✅ Page load  
✅ Quiz start  
✅ Single-choice auto-advance  
✅ Multiple-choice behavior  
✅ Progress tracking  
✅ Navigation buttons  
✅ Form validation  

---

## 🎮 Controls

### Buttons
- **Run All Tests**: Execute complete test suite (9 tests)
- **Visual Tests**: Run only visual regression tests
- **Functional Tests**: Run only functional/interaction tests
- **Clear Results**: Reset test results
- **Export Report**: Download JSON test report
- **Screenshot**: Capture current state
- **Reload**: Refresh the iframe

### Device Selector
Change viewport size to test responsive design

### Test URL Input
Change the application URL if needed (default: localhost:3001)

---

## 📊 Test Results

### Summary Cards
- **Total Tests**: Number of tests executed
- **Passed**: Green tests (all checks passed)
- **Failed**: Red tests (one or more checks failed)
- **Running**: Currently executing tests

### Test List
Each test shows:
- Test name (TC-XXX format)
- Status badge (Running/Pass/Fail)
- Details/error message
- Real-time updates

### Console Log
- Color-coded log entries
- Timestamps
- Test progress
- Error details

---

## 🧪 Test Cases Included

### TC-001: Page Load
Verifies all main elements load correctly

### TC-002: Hero Button Styling
Checks button has correct colors and styling

### TC-004: Start Quiz
Tests quiz initialization on button click

### TC-006: Single-Choice Selection & Auto-Advance
Validates click-to-advance behavior (300ms delay)

### TC-015: Progress Bar Accuracy
Ensures progress calculation is correct

### TC-038: Color Consistency
Verifies pink color scheme (no purple)

### TC-039: System Fonts
Checks for system fonts (no Playfair/Inter)

### TC-040: No Emojis
Confirms SVG icons instead of emojis

### TC-041: Border Radius
Validates 8px radius (not pill shapes)

---

## 📸 Screenshots

Click **Screenshot** button to capture current state:
- Saves to gallery
- Includes timestamp
- Shows device type
- Can be used for visual regression

---

## 📥 Export Report

Click **Export Report** to download JSON file containing:
```json
{
  "timestamp": "2026-01-05T...",
  "device": "desktop",
  "results": [
    {
      "name": "TC-001: Page Load",
      "status": "pass",
      "details": "All elements loaded",
      "timestamp": "..."
    }
  ],
  "summary": {
    "total": 9,
    "passed": 9,
    "failed": 0
  }
}
```

---

## 🔧 How It Works

### iframe Integration
- Application loads in isolated iframe
- Tests access iframe content via `contentDocument`
- No CORS issues (same origin)
- Can interact with DOM elements
- Captures computed styles

### Test Execution Flow
1. Reload iframe for clean state
2. Wait for page load (2s)
3. Execute tests sequentially
4. Wait between tests (1s buffer)
5. Update results in real-time
6. Generate summary

### Visual Regression Detection
- Reads computed styles from iframe
- Compares against expected values
- Checks color codes (RGB/Hex)
- Validates dimensions and spacing
- Detects emojis via regex
- Counts SVG elements

---

## ✅ Expected Results

### All Tests Pass Scenario
```
Total Tests: 9
Passed: 9
Failed: 0
Running: 0
```

### Typical Issues
- **Color Mismatch**: Old purple colors still present
- **Font Issues**: Google Fonts still loading
- **Border Radius**: Still using pill shapes (50px)
- **Emoji Detection**: Emojis not replaced with SVG
- **Auto-Advance**: 300ms delay not working

---

## 🐛 Troubleshooting

### iframe Not Loading
- Check if app is running at localhost:3001
- Verify no CORS errors in console
- Try reloading iframe

### Tests Failing
- Ensure latest code is deployed
- Clear browser cache
- Check console for errors
- Verify API key is set

### Style Detection Issues
- Some browsers report colors differently (RGB vs Hex)
- Tests use approximate matching
- Check actual vs expected in details

---

## 🔄 Continuous Integration

### Manual Testing
1. Run before each commit
2. Run on different devices
3. Export reports for records
4. Take screenshots for comparison

### Automated Testing
Can be extended with:
- Puppeteer/Playwright
- Cypress
- Selenium
- GitHub Actions CI/CD

---

## 📋 Test Scenarios Coverage

**From QA_TEST_SCENARIOS.md**:
- ✅ TC-001: Page Load
- ✅ TC-002: Button Styling
- ✅ TC-004: Start Quiz
- ✅ TC-006: Single-Choice Selection
- ✅ TC-015: Progress Bar
- ✅ TC-038: Color Consistency
- ✅ TC-039: Typography
- ✅ TC-040: Icon Rendering
- ✅ TC-041: Border Radius

**Additional Manual Tests** (refer to QA_TEST_SCENARIOS.md):
- TC-008 to TC-014: Multiple-choice and text input
- TC-016 to TC-025: Quiz completion and results
- TC-026 to TC-028: Responsive design
- TC-029 to TC-031: Error handling
- TC-032 to TC-034: Accessibility
- TC-035 to TC-037: Performance

---

## 🎨 Visual Comparison

The suite validates the design changes from Function of Beauty comparison:
- ✅ Pink colors instead of purple
- ✅ System fonts instead of decorative fonts
- ✅ SVG icons instead of emojis
- ✅ 8px borders instead of pills
- ✅ Flat design instead of gradients
- ✅ Auto-advance on single-choice
- ✅ Cleaner, minimal aesthetic

---

## 📦 Files Included

1. **e2e-test-visual.html** - Main testing suite
2. **QA_TEST_SCENARIOS.md** - Complete test scenarios (46 tests)
3. **DESIGN_CHANGES.md** - Design comparison documentation

---

## 🚀 Next Steps

1. Run the test suite
2. Fix any failing tests
3. Test on different devices
4. Export and save reports
5. Run before deployment
6. Integrate with CI/CD pipeline

---

**Ready to test!** Open `e2e-test-visual.html` in your browser and click "Run All Tests"! 🎉
