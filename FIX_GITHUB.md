# Fix: Empty GitHub Repository Error

## The Problem
Your GitHub repository exists but is empty. We need to connect your local code to GitHub and push it.

## Solution - Run These Commands

### Step 1: Connect to Your GitHub Repository

Replace `YOUR_USERNAME` with your actual GitHub username, and `REPO_NAME` with your repository name.

```bash
cd /Users/shubs/wedding-website
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git
```

**Example:** If your username is `shubs123` and repo is `wedding-website`:
```bash
git remote add origin https://github.com/shubs123/wedding-website.git
```

### Step 2: Verify the Connection
```bash
git remote -v
```
You should see your GitHub URL listed.

### Step 3: Push Your Code
```bash
git branch -M main
git push -u origin main
```

**When it asks for credentials:**
- Username: Your GitHub username
- Password: Use a **Personal Access Token** (see below)

### Step 4: Create Personal Access Token (if you haven't)

1. Go to GitHub.com → Your Profile → **Settings**
2. Left sidebar → **Developer settings**
3. **Personal access tokens** → **Tokens (classic)**
4. Click **Generate new token** → **Generate new token (classic)**
5. Name: "Wedding Website Deploy"
6. Check **repo** checkbox
7. Click **Generate token**
8. **COPY THE TOKEN** (you won't see it again!)
9. Use this token as your password when pushing

---

## Alternative: If You Created the Repo with a README

If you checked "Add a README" when creating the repo, you'll need to pull first:

```bash
git pull origin main --allow-unrelated-histories
```

Then push:
```bash
git push -u origin main
```

---

## After Pushing Successfully

Once you see "Successfully pushed to origin/main", your GitHub repo will have all your code.

Then go back to Vercel and:
1. Refresh the page
2. Try importing your repository again
3. It should work now!

