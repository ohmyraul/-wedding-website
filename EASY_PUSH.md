# Easy Way to Push - No Password Typing Needed!

## Method 1: Put Token in URL (Easiest!)

Instead of typing the password, we'll put your token directly in the command.

### Step 1: Get Your Personal Access Token
(You should have this from earlier - if not, create one at github.com → Settings → Developer settings → Personal access tokens)

### Step 2: Run This Command (Replace YOUR_TOKEN with your actual token):

```bash
cd /Users/shubs/wedding-website
git remote set-url origin https://YOUR_TOKEN@github.com/ohmyraul/wedding-website.git
```

**Example:** If your token is `ghp_abc123xyz456`, the command would be:
```bash
git remote set-url origin https://ghp_abc123xyz456@github.com/ohmyraul/wedding-website.git
```

### Step 3: Now Push (No password needed!):
```bash
git push -u origin main
```

---

## Method 2: Use GitHub CLI (Even Easier!)

Install GitHub CLI:
```bash
brew install gh
```

Login:
```bash
gh auth login
```
(Follow the prompts - it will open a browser)

Then push:
```bash
git push -u origin main
```

---

## Method 3: Use Credential Helper (For Future)

This saves your credentials so you don't have to type them again:

```bash
git config --global credential.helper osxkeychain
```

Then when you push, it will ask once and save it.

