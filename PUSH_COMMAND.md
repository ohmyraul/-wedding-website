# How to Push Your Code to GitHub

## Run This Command:

```bash
cd /Users/shubs/wedding-website
git push -u origin main
```

## When It Asks For Credentials:

**Username:** `ohmyraul`

**Password:** Paste your Personal Access Token (NOT your GitHub password!)

---

## If You Get "Authentication Failed":

1. Make sure you're using the **Personal Access Token**, not your password
2. Make sure the token has the **repo** permission checked
3. Try creating a new token if the old one doesn't work

---

## Alternative: Use GitHub CLI (Easier)

If you have GitHub CLI installed:

```bash
gh auth login
```

Then:
```bash
git push -u origin main
```

---

## After Successful Push:

You should see:
```
Enumerating objects: X, done.
Counting objects: 100% (X/X), done.
...
To https://github.com/ohmyraul/wedding-website.git
 * [new branch]      main -> main
Branch 'main' set up to track remote branch 'main' from 'origin'.
```

Then your code will be on GitHub and Vercel will be able to deploy it!

