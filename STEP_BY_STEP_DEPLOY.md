# Step-by-Step: Deploy Your Wedding Website

## PART 1: Push to GitHub

### Step 1: Check if you have Git installed
Open Terminal (on Mac) and type:
```bash
git --version
```
If you see a version number, you're good! If not, install Git first.

### Step 2: Navigate to your project folder
In Terminal, type:
```bash
cd /Users/shubs/wedding-website
```

### Step 3: Initialize Git (if not already done)
```bash
git init
```
This creates a new Git repository in your folder.

### Step 4: Create a .gitignore file (to exclude unnecessary files)
```bash
cat > .gitignore << 'EOF'
node_modules/
dist/
.DS_Store
*.log
.env.local
EOF
```

### Step 5: Add all your files
```bash
git add .
```
This stages all your files for commit.

### Step 6: Make your first commit
```bash
git commit -m "Initial commit - wedding website"
```
This saves your files in Git.

### Step 7: Create a GitHub account (if you don't have one)
1. Go to [github.com](https://github.com)
2. Click "Sign up"
3. Create an account (it's free)

### Step 8: Create a new repository on GitHub
1. After logging in, click the **"+"** icon in the top right
2. Click **"New repository"**
3. Repository name: `wedding-website` (or whatever you want)
4. Description: "Shubs & Alysha Wedding Website"
5. Make sure it's set to **Public** (or Private if you prefer)
6. **DO NOT** check "Add a README file" or any other options
7. Click **"Create repository"**

### Step 9: Connect your local project to GitHub
GitHub will show you some commands. Use these:

```bash
git remote add origin https://github.com/YOUR_USERNAME/wedding-website.git
```
(Replace `YOUR_USERNAME` with your actual GitHub username)

### Step 10: Push your code to GitHub
```bash
git branch -M main
git push -u origin main
```

**If it asks for your GitHub username and password:**
- Username: Your GitHub username
- Password: You'll need to use a **Personal Access Token** (not your regular password)

**To create a Personal Access Token:**
1. Go to GitHub.com → Settings (click your profile picture → Settings)
2. Scroll down to "Developer settings" (left sidebar)
3. Click "Personal access tokens" → "Tokens (classic)"
4. Click "Generate new token" → "Generate new token (classic)"
5. Name it: "Wedding Website Deploy"
6. Check the "repo" box (this gives it access to your repositories)
7. Click "Generate token" at the bottom
8. **COPY THE TOKEN IMMEDIATELY** (you won't see it again!)
9. Use this token as your password when pushing

---

## PART 2: Deploy on Vercel

### Step 1: Go to Vercel
Open your browser and go to: [vercel.com](https://vercel.com)

### Step 2: Sign up
1. Click "Sign Up" or "Get Started"
2. Click "Continue with GitHub"
3. Authorize Vercel to access your GitHub account
4. Complete the signup process

### Step 3: Import your project
1. After logging in, you'll see a dashboard
2. Click **"Add New..."** button (usually top right)
3. Click **"Project"**
4. You'll see a list of your GitHub repositories
5. Find **"wedding-website"** (or whatever you named it)
6. Click **"Import"** next to it

### Step 4: Configure the project
Vercel will auto-detect your settings, but verify:
- **Framework Preset:** Vite (should be auto-detected)
- **Root Directory:** `./` (leave as is)
- **Build Command:** `npm run build` (should be auto-filled)
- **Output Directory:** `dist` (should be auto-filled)
- **Install Command:** `npm install` (should be auto-filled)

**Don't change anything unless it's wrong!**

### Step 5: Deploy!
1. Click the big **"Deploy"** button
2. Wait 1-2 minutes while it builds
3. You'll see a progress bar

### Step 6: Your site is live!
Once deployment finishes:
- You'll see a success message
- Click **"Visit"** to see your live site
- Your URL will be: `https://wedding-website-XXXXX.vercel.app`

---

## PART 3: Make Updates (After Initial Deploy)

Every time you make changes to your website:

### Step 1: Make your changes
Edit your files as usual.

### Step 2: Commit your changes
```bash
cd /Users/shubs/wedding-website
git add .
git commit -m "Updated wedding website"
```

### Step 3: Push to GitHub
```bash
git push
```

### Step 4: Vercel automatically deploys!
Vercel will automatically detect the push and redeploy your site. Wait 1-2 minutes and your changes will be live!

---

## Troubleshooting

### "git: command not found"
Install Git:
- Mac: Install Xcode Command Line Tools: `xcode-select --install`
- Or download from: [git-scm.com](https://git-scm.com)

### "Permission denied" when pushing
Make sure you're using a Personal Access Token, not your password.

### "Repository not found"
Double-check your GitHub username in the remote URL:
```bash
git remote -v
```
If wrong, fix it:
```bash
git remote set-url origin https://github.com/YOUR_USERNAME/wedding-website.git
```

### Build fails on Vercel
1. Make sure `npm run build` works locally first
2. Check Vercel's build logs for errors
3. Make sure all images are in `/public/images/` folder

### Images not showing
- Images must be in `/public/images/` folder
- Reference them as `/images/filename.jpg` (not `/public/images/...`)

---

## Quick Reference Commands

```bash
# Navigate to project
cd /Users/shubs/wedding-website

# Check status
git status

# Add all changes
git add .

# Commit changes
git commit -m "Your message here"

# Push to GitHub
git push

# Build locally to test
npm run build
npm run preview
```

---

## Need Help?

If you get stuck at any step, let me know which step and what error message you see!

