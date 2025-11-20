# Deployment Guide - Wedding Website

## Quick Deploy Options

### Option 1: Vercel (Recommended - Easiest)

**Via Web Interface (No CLI needed):**

1. **Push to GitHub** (if not already):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

2. **Deploy on Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Sign up/login with GitHub
   - Click "Add New Project"
   - Import your GitHub repository
   - Vercel auto-detects Vite settings
   - Click "Deploy"
   - Done! Your site will be live in ~2 minutes

**Via CLI:**
```bash
npm install -g vercel
vercel login
vercel
```

---

### Option 2: Netlify (Also Very Easy)

**Via Web Interface:**

1. **Push to GitHub** (same as above)

2. **Deploy on Netlify:**
   - Go to [netlify.com](https://netlify.com)
   - Sign up/login with GitHub
   - Click "Add new site" → "Import an existing project"
   - Select your repository
   - Build settings (auto-detected):
     - Build command: `npm run build`
     - Publish directory: `dist`
   - Click "Deploy site"
   - Done!

**Via CLI:**
```bash
npm install -g netlify-cli
netlify login
netlify deploy --prod
```

---

### Option 3: GitHub Pages

1. **Install gh-pages:**
   ```bash
   npm install --save-dev gh-pages
   ```

2. **Add to package.json scripts:**
   ```json
   "scripts": {
     "predeploy": "npm run build",
     "deploy": "gh-pages -d dist"
   }
   ```

3. **Deploy:**
   ```bash
   npm run deploy
   ```

4. **Enable GitHub Pages:**
   - Go to your repo → Settings → Pages
   - Source: `gh-pages` branch
   - Your site will be at: `https://YOUR_USERNAME.github.io/REPO_NAME`

---

## Important Notes

### Before Deploying:

1. **Test your build locally:**
   ```bash
   npm run build
   npm run preview
   ```

2. **Check that all images are in `/public/images/`** (they should be)

3. **Verify music file is in `/public/music/`** (it should be)

### Environment Variables:

If you need any environment variables, add them in:
- **Vercel**: Project Settings → Environment Variables
- **Netlify**: Site Settings → Build & Deploy → Environment Variables

### Custom Domain:

Both Vercel and Netlify offer free custom domains:
- **Vercel**: Project Settings → Domains
- **Netlify**: Site Settings → Domain Management

---

## Recommended: Vercel

**Why Vercel?**
- ✅ Zero configuration needed
- ✅ Automatic HTTPS
- ✅ Free custom domain
- ✅ Fast global CDN
- ✅ Automatic deployments on git push
- ✅ Perfect for Vite/React apps

**Your site will be live at:**
`https://YOUR_PROJECT_NAME.vercel.app`

---

## Troubleshooting

**Build fails?**
- Make sure all dependencies are in `package.json`
- Run `npm install` locally first
- Check that `npm run build` works locally

**Images not loading?**
- Ensure images are in `/public/images/`
- Check paths in code use `/images/...` (not `/public/images/...`)

**Music not playing?**
- Ensure music file is in `/public/music/`
- Check browser console for errors
- Some browsers block autoplay

