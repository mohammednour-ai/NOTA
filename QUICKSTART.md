# 🚀 QUICK START GUIDE

## Step 1: Install Dependencies
```bash
npm install
```

## Step 2: Set Up Environment Variables
1. Create a `.env` file:
   - Copy the contents from `env-template.txt`
   - Rename/save as `.env`

2. Get your Anthropic API Key (REQUIRED):
   - Visit: https://console.anthropic.com
   - Sign up or log in
   - Go to "API Keys" section
   - Click "Create Key"
   - Copy the key (starts with `sk-ant-`)
   - Paste it in your `.env` file

## Step 3: Run the Application
```bash
npm start
```

## Step 4: Open in Browser
Navigate to: http://localhost:3000

---

## 🎯 What You'll See

1. **Hero Page** - Beautiful landing page with "Take The Quiz" button
2. **Quiz Interface** - 30 personalized questions with progress bar
3. **Loading Screen** - AI analyzing your preferences
4. **Results Page** - 5 personalized perfume recommendations with shopping links

---

## ⚠️ Troubleshooting

### "Failed to load quiz questions"
- Make sure the server is running
- Check console for errors
- Verify `questions.json` exists

### "Failed to analyze preferences"
- Check that `ANTHROPIC_API_KEY` is set in `.env`
- Verify your API key is valid
- Check your Anthropic API quota

### "Port already in use"
- Change `PORT` in `.env` to a different number (e.g., 3001)
- Or kill the process using port 3000

---

## 💡 Tips

- **Test Mode**: You can skip questions by clicking through quickly
- **Mobile**: The site is fully responsive - try it on your phone
- **Customization**: Edit `questions.json` to change quiz questions
- **Styling**: Modify `public/styles.css` to change colors and design

---

## 📊 Expected Costs

### Anthropic Claude API
- Each quiz submission costs approximately $0.01-0.03
- Free tier includes $5 credit
- That's ~200-500 quiz completions for free!

### Affiliate APIs
- Amazon Associates: Free
- ShareASale: Free

---

## 🎨 Customization Quick Tips

### Change Color Scheme
Edit `public/styles.css`:
```css
:root {
    --primary-color: #2d2a4a;  /* Change this */
    --secondary-color: #8b7fbf; /* And this */
}
```

### Change Number of Recommendations
Edit `server.js`, line ~35:
```javascript
// Change from 5 to any number
recommend 5 specific perfumes  // Change this number
```

### Add Your Branding
Edit `public/index.html`:
```html
<h1>🌸 ScentMatch</h1>  <!-- Change name here -->
```

---

## ✅ Checklist

- [ ] Node.js installed
- [ ] Dependencies installed (`npm install`)
- [ ] `.env` file created
- [ ] Anthropic API key added to `.env`
- [ ] Server started (`npm start`)
- [ ] Browser opened to localhost:3000
- [ ] Quiz completed successfully
- [ ] Results displayed with recommendations

---

Need help? Check the full README.md for detailed documentation!
