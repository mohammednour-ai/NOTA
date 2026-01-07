# 🌸 ScentMatch - AI-Powered Perfume Recommendation Platform

A beautiful, modern perfume recommendation platform inspired by Function of Beauty's quiz interface. Get personalized perfume recommendations powered by Claude AI with direct affiliate shopping links.

## ✨ Features

- **30-Question Personalized Quiz** - Comprehensive questionnaire covering preferences, occasions, notes, and style
- **AI-Powered Recommendations** - Claude 3.5 Sonnet analyzes your preferences to suggest perfect perfumes
- **Affiliate Integration** - Direct shopping links to Amazon, ShareASale, and other affiliate platforms
- **Beautiful UI** - Modern, responsive design inspired by Function of Beauty
- **Real-time Progress** - Track your quiz progress with animated UI elements

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Anthropic API Key (Claude)
- (Optional) Affiliate API keys for Amazon, ShareASale

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd Lab2
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```bash
cp .env.example .env
```

4. Edit `.env` and add your API keys:
```env
# Required
ANTHROPIC_API_KEY=your_anthropic_api_key_here

# Optional (for better affiliate integration)
AMAZON_ACCESS_KEY=your_amazon_access_key
AMAZON_SECRET_KEY=your_amazon_secret_key
AMAZON_ASSOCIATE_TAG=your_associate_tag

SHARESALE_TOKEN=your_sharesale_token
SHARESALE_SECRET=your_sharesale_secret
SHARESALE_AFFILIATE_ID=your_affiliate_id

PORT=3000
```

### Getting API Keys

#### Anthropic Claude API (Required)
1. Go to [console.anthropic.com](https://console.anthropic.com)
2. Sign up or log in
3. Navigate to API Keys section
4. Create a new API key
5. Copy and paste into your `.env` file

#### Amazon Associates (Optional)
1. Sign up at [affiliate-program.amazon.com](https://affiliate-program.amazon.com)
2. Apply for Amazon Product Advertising API access
3. Get your Access Key, Secret Key, and Associate Tag
4. Add to `.env` file

#### ShareASale (Optional)
1. Sign up at [shareasale.com](https://www.shareasale.com)
2. Apply for merchant programs related to beauty/perfume
3. Get your API credentials from Settings
4. Add to `.env` file

### Running the Application

1. Start the server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

2. Open your browser and navigate to:
```
http://localhost:3000
```

## 📁 Project Structure

```
Lab2/
├── public/
│   ├── index.html      # Main HTML file
│   ├── styles.css      # Styling (Function of Beauty inspired)
│   └── script.js       # Frontend JavaScript
├── server.js           # Express backend server
├── questions.json      # 30 quiz questions
├── package.json        # Dependencies
├── .env.example        # Environment variables template
├── .gitignore         # Git ignore file
└── README.md          # This file
```

## 🎨 Design Features

### Inspired by Function of Beauty
- Clean, modern layout with premium feel
- Gradient animations and smooth transitions
- Card-based quiz interface
- Progress tracking with visual feedback
- Mobile-responsive design

### Color Scheme
- Primary: `#2d2a4a` (Deep purple)
- Secondary: `#8b7fbf` (Lavender)
- Accent: `#e6b8c7` (Soft pink)
- Background: `#f8f6f4` (Warm white)

## 🤖 How It Works

1. **Quiz Flow**
   - User answers 30 personalized questions
   - Questions cover gender, age, occasions, seasons, fragrance families, notes, style, and budget
   - Answers are stored and validated in real-time

2. **AI Analysis**
   - All answers are sent to Claude 3.5 Sonnet API
   - Claude analyzes preferences and recommends 5 specific perfumes
   - Each recommendation includes brand, name, description, matching reasons, and key notes

3. **Affiliate Search**
   - Recommended perfumes are searched across affiliate platforms
   - Amazon and ShareASale links are generated
   - Users can click to purchase with affiliate attribution

4. **Results Display**
   - Beautiful cards show each perfume recommendation
   - Direct shopping links with platform badges
   - Option to retake quiz for new recommendations

## 🔧 Customization

### Adding More Questions
Edit `questions.json` to add or modify quiz questions:

```json
{
  "id": 31,
  "question": "Your question here?",
  "type": "single",  // or "multiple" or "text"
  "options": ["Option 1", "Option 2", "Option 3"]
}
```

### Adding More Affiliate Platforms
Edit `server.js` and add new search functions:

```javascript
async function searchNewPlatform(query) {
  // Implement your affiliate API logic
  return {
    platform: 'Platform Name',
    url: 'affiliate-link',
    price: 'Price info'
  };
}
```

### Customizing Styles
Edit `public/styles.css` to change colors, fonts, and layouts:

```css
:root {
    --primary-color: #your-color;
    --secondary-color: #your-color;
    /* etc. */
}
```

## 🌐 API Endpoints

### GET `/api/questions`
Returns all quiz questions

### POST `/api/analyze`
- Body: `{ "answers": { ... } }`
- Returns: Claude AI recommendations

### POST `/api/search-affiliates`
- Body: `{ "perfumes": [...] }`
- Returns: Affiliate links for each perfume

## 📱 Mobile Support

The platform is fully responsive and works beautifully on:
- Desktop (1920px+)
- Laptop (1024px - 1919px)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

## 🔒 Security Notes

- Never commit your `.env` file
- Keep API keys secure and rotate regularly
- Use environment variables for all sensitive data
- Implement rate limiting for production use

## 🚀 Deployment

### Heroku
```bash
heroku create your-app-name
heroku config:set ANTHROPIC_API_KEY=your_key
git push heroku main
```

### Vercel
```bash
vercel
# Follow prompts and add environment variables in dashboard
```

### DigitalOcean/AWS
1. Set up Node.js server
2. Install dependencies
3. Configure environment variables
4. Set up reverse proxy (nginx)
5. Enable SSL

## 📄 License

This project is provided as-is for educational and commercial use.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 💡 Future Enhancements

- [ ] User accounts and saved results
- [ ] Email recommendations
- [ ] More affiliate platforms (Sephora, Ulta, FragranceX)
- [ ] Social sharing
- [ ] Admin dashboard for analytics
- [ ] Multi-language support
- [ ] Advanced filtering options
- [ ] Price comparison across platforms
- [ ] User reviews and ratings integration

## 📧 Support

For issues, questions, or suggestions, please open an issue on GitHub.

## 🙏 Acknowledgments

- Inspired by [Function of Beauty](https://functionofbeauty.com)
- Powered by [Anthropic Claude AI](https://www.anthropic.com)
- Built with Express.js and vanilla JavaScript

---

**Affiliate Disclosure**: This platform uses affiliate links. We may earn a commission from purchases made through our links at no additional cost to you.
