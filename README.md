# Welcome to Planet Burnout 🎮

A Fallout Pip-Boy inspired call sign generator for the book "Welcome to Planet Burnout"

## Features

- Fallout-style green CRT aesthetic with scan lines and glow effects
- Story input (500 character limit)
- AI-generated military/sci-fi call signs using Claude
- HubSpot form integration
- Fully responsive design

## Live Demo

Visit your deployed site at: [Your URL Here]

## Deployment Options

### Option 1: Netlify (Recommended - Easiest)

Netlify provides both static hosting AND serverless functions in one platform.

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Sign up for Netlify:**
   - Go to [netlify.com](https://www.netlify.com)
   - Sign up with GitHub

3. **Deploy:**
   - Click "Add new site" → "Import an existing project"
   - Connect your GitHub repository
   - Netlify will auto-detect the configuration from `netlify.toml`
   - Click "Deploy"

4. **Add API Key:**
   - Go to Site Settings → Environment Variables
   - Add: `ANTHROPIC_API_KEY` with your Anthropic API key
   - Get your API key from: https://console.anthropic.com/

5. **Done!** Your site will be live at `your-site.netlify.app`

### Option 2: Vercel

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Update the fetch URL in `index.html`:**
   ```javascript
   // Change this line (around line 301):
   const response = await fetch('/.netlify/functions/generate-callsign', {
   // To:
   const response = await fetch('/api/generate-callsign', {
   ```

3. **Create Vercel function:**
   - Create folder: `mkdir -p api`
   - Move function: `cp netlify/functions/generate-callsign.js api/generate-callsign.js`

4. **Deploy:**
   ```bash
   vercel
   ```

5. **Add API Key:**
   ```bash
   vercel env add ANTHROPIC_API_KEY
   ```

### Option 3: GitHub Pages + Separate Backend

Since GitHub Pages only serves static files, you'll need to deploy the backend separately.

#### Static Frontend on GitHub Pages:

1. **Enable GitHub Pages:**
   - Go to repository Settings → Pages
   - Source: Deploy from branch `main`
   - Folder: `/ (root)`

2. **Update API URL in `index.html`:**
   ```javascript
   // Change this line (around line 301):
   const response = await fetch('/.netlify/functions/generate-callsign', {
   // To your backend URL:
   const response = await fetch('https://your-backend.railway.app/api/generate-callsign', {
   ```

#### Backend on Railway/Render:

1. **Create Express server** (`server.js`):
   ```javascript
   const express = require('express');
   const cors = require('cors');
   const Anthropic = require('@anthropic-ai/sdk');

   const app = express();
   app.use(cors());
   app.use(express.json());

   const anthropic = new Anthropic({
       apiKey: process.env.ANTHROPIC_API_KEY,
   });

   app.post('/api/generate-callsign', async (req, res) => {
       try {
           const { story } = req.body;

           const message = await anthropic.messages.create({
               model: 'claude-3-5-sonnet-20241022',
               max_tokens: 100,
               messages: [{
                   role: 'user',
                   content: `You are a military call sign generator for Planet Korob...
Story: ${story}

Respond with ONLY the call sign, nothing else.`
               }]
           });

           const callsign = message.content[0].text.trim().toUpperCase();
           res.json({ callsign });
       } catch (error) {
           res.status(500).json({ error: 'Failed to generate call sign' });
       }
   });

   const PORT = process.env.PORT || 3000;
   app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
   ```

2. **Deploy to Railway:**
   - Go to [railway.app](https://railway.app)
   - Create new project from GitHub
   - Add `ANTHROPIC_API_KEY` environment variable
   - Deploy!

## Local Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Create `.env` file:**
   ```
   ANTHROPIC_API_KEY=your_api_key_here
   ```

3. **Run locally with Netlify Dev:**
   ```bash
   npm run dev
   ```

4. **Open:** `http://localhost:8888`

## Environment Variables

You need to set the following environment variable:

- `ANTHROPIC_API_KEY` - Your Anthropic API key from https://console.anthropic.com/

## Project Structure

```
planet-burnout/
├── index.html              # Main website (HTML, CSS, JS all in one)
├── netlify/
│   └── functions/
│       └── generate-callsign.js  # Serverless function for API
├── netlify.toml           # Netlify configuration
├── package.json           # Dependencies
└── README.md             # This file
```

## Customization

### Change Colors
Edit the CSS in `index.html` (around line 13-200). Key color is `#00ff00` (Pip-Boy green).

### Adjust Call Sign Generation
Edit the prompt in `netlify/functions/generate-callsign.js` (around line 33-46).

### Modify Character Limit
Change `maxlength="500"` in the textarea (line 253).

## Technologies Used

- Pure HTML/CSS/JavaScript (no build tools needed)
- Anthropic Claude API for call sign generation
- Netlify Functions (serverless)
- HubSpot Forms
- Google Fonts (Share Tech Mono)

## Support

For issues or questions:
- Check the Netlify deployment logs
- Ensure ANTHROPIC_API_KEY is set correctly
- Verify HubSpot form embed code is correct

## License

MIT License - Feel free to use for your book promotion!

---

Made with 💚 for Planet Burnout
