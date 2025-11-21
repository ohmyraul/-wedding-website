# Formspree Setup - Native RSVP Form

## Your form is now native! ✅
The RSVP form now stays on your website - no redirecting to Google Forms!

## Quick Setup (5 minutes)

### Step 1: Sign up for Formspree
1. Go to [formspree.io](https://formspree.io)
2. Click "Sign Up" (it's free!)
3. Sign up with email or GitHub

### Step 2: Create a Form
1. After logging in, click **"New Form"**
2. Form name: "Wedding RSVP"
3. Click **"Create"**

### Step 3: Get Your Endpoint
1. You'll see your form endpoint - it looks like:
   `https://formspree.io/f/xxxxxxxxxx`
2. **Copy this URL**

### Step 4: Update Your Code
1. Open `src/App.jsx`
2. Find this line (around line 1990):
   ```javascript
   const FORMSPREE_ENDPOINT = "https://formspree.io/f/YOUR_FORM_ID";
   ```
3. Replace `YOUR_FORM_ID` with your actual Formspree endpoint
4. For example, if your endpoint is `https://formspree.io/f/abc123xyz`, change it to:
   ```javascript
   const FORMSPREE_ENDPOINT = "https://formspree.io/f/abc123xyz";
   ```

### Step 5: Deploy
```bash
cd /Users/shubs/wedding-website
git add src/App.jsx
git commit -m "Add Formspree endpoint"
git push
```

---

## What You Get

✅ **Native form** - stays on your site  
✅ **Email notifications** - get an email for each RSVP  
✅ **Formspree dashboard** - view all submissions  
✅ **Free tier** - 50 submissions/month (plenty for a wedding!)  
✅ **No redirects** - users never leave your site  

---

## Testing

After you update the endpoint and deploy:
1. Go to your live site
2. Fill out the RSVP form
3. Submit it
4. Check your email - you should get a notification!
5. Check Formspree dashboard - submission will be there

---

## Need Help?

If you get stuck, just share your Formspree endpoint and I'll update the code for you!

