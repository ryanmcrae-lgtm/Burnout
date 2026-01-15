# Quick Deployment Guide

## Fastest Path: Deploy to Netlify in 5 Minutes

### Step 1: Get Your Anthropic API Key
1. Go to https://console.anthropic.com/
2. Sign up or log in
3. Navigate to API Keys
4. Create a new key and copy it

### Step 2: Deploy to Netlify
1. Go to https://app.netlify.com/
2. Click "Add new site" → "Import an existing project"
3. Choose "Deploy with GitHub" and authorize Netlify
4. Select your `Burnout` repository
5. Netlify will auto-detect settings - just click "Deploy"

### Step 3: Add Your API Key
1. After deployment, go to "Site configuration" → "Environment variables"
2. Click "Add a variable"
3. Key: `ANTHROPIC_API_KEY`
4. Value: [paste your API key from Step 1]
5. Click "Create variable"

### Step 4: Redeploy
1. Go to "Deploys" tab
2. Click "Trigger deploy" → "Clear cache and deploy site"
3. Wait 1-2 minutes for deployment to complete

### Step 5: Done! 🎉
Your site is now live at `https://your-site-name.netlify.app`

You can customize the domain in Site Settings → Domain Management

---

## Alternative: Vercel Deployment

### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

### Step 2: Update the Code
In `index.html`, find line ~301 and change:
```javascript
const response = await fetch('/.netlify/functions/generate-callsign', {
```
To:
```javascript
const response = await fetch('/api/generate-callsign', {
```

### Step 3: Move the Function
```bash
mkdir -p api
cp netlify/functions/generate-callsign.js api/generate-callsign.js
```

### Step 4: Deploy
```bash
vercel
```

Follow the prompts, then add your API key:
```bash
vercel env add ANTHROPIC_API_KEY production
```

### Step 5: Redeploy
```bash
vercel --prod
```

---

## Testing Locally Before Deployment

### Install Dependencies
```bash
npm install
```

### Create .env File
```bash
cp .env.example .env
```

Edit `.env` and add your API key:
```
ANTHROPIC_API_KEY=sk-ant-your-key-here
```

### Run Local Server
```bash
npm run dev
```

Open `http://localhost:8888` in your browser

---

## Troubleshooting

### Call Sign Generation Not Working
- Check that `ANTHROPIC_API_KEY` is set in environment variables
- Check deployment logs for errors
- Verify API key is valid at https://console.anthropic.com/

### HubSpot Form Not Appearing
- Forms appear after call sign is generated
- Check browser console for JavaScript errors
- Verify HubSpot embed code is correct

### Styling Issues
- Clear browser cache
- Check that CSS is loading (view page source)
- Try different browser

### 404 Errors on Netlify
- Ensure `netlify.toml` is in root directory
- Check that functions folder path is correct
- Redeploy with clear cache

---

## Cost Estimate

**Netlify Free Tier:**
- 100GB bandwidth/month
- 125k function requests/month
- FREE

**Anthropic API:**
- Claude 3.5 Sonnet: ~$0.003 per call sign
- 1000 call signs = ~$3
- Very affordable for a book launch

**Total:** Essentially free for typical book launch traffic!

---

## Next Steps After Deployment

1. **Custom Domain:** Add your own domain in Netlify settings
2. **Analytics:** Add Google Analytics or Netlify Analytics
3. **Social Sharing:** Test the page and share on social media
4. **Monitor:** Check HubSpot for form submissions
5. **Iterate:** Adjust the call sign prompt based on results

Need help? Open an issue on GitHub or contact support.
