# RSVP Form Troubleshooting

## If the form is not submitting:

### Step 1: Check Browser Console
1. Open your site
2. Press **F12** (or right-click → Inspect)
3. Go to **Console** tab
4. Try submitting the form
5. Look for any red error messages
6. Share those errors with me

### Step 2: Check Formspree Activation
Formspree might need activation:
1. Go to [formspree.io](https://formspree.io)
2. Log in
3. Check your form `mnnwwold`
4. Look for any "Activate" or "Confirm" button
5. Check your email for an activation link

### Step 3: Test Formspree Directly
Test if Formspree is working:
1. Go to: https://formspree.io/f/mnnwwold
2. Try submitting a test form there
3. If it works there but not on your site, it's a code issue
4. If it doesn't work there either, it's a Formspree setup issue

### Step 4: Check Network Tab
1. Open browser DevTools (F12)
2. Go to **Network** tab
3. Submit the form
4. Look for a request to `formspree.io`
5. Click on it and check:
   - Status code (should be 200 or 302)
   - Response (should show success or error message)

### Step 5: Common Issues

**Issue: "Form not activated"**
- Solution: Check your email for Formspree activation link

**Issue: CORS error**
- Solution: Formspree should handle CORS, but if you see this, we might need to use a different approach

**Issue: 422 Unprocessable Entity**
- Solution: Usually means form data format is wrong (I just fixed this)

**Issue: Network error**
- Solution: Check your internet connection, or Formspree might be down

---

## Quick Test

Try this in your browser console (F12 → Console) after the page loads:

```javascript
fetch('https://formspree.io/f/mnnwwold', {
  method: 'POST',
  headers: { 'Accept': 'application/json', 'Content-Type': 'application/x-www-form-urlencoded' },
  body: 'name=Test&email=test@test.com&phone=123&guests=1&attending=Count Me In'
}).then(r => r.json()).then(console.log).catch(console.error);
```

This will tell us if Formspree is working at all.

---

## Alternative: Use Native HTML Form

If fetch doesn't work, we can switch to a native HTML form that submits directly to Formspree (but this will cause a page reload).

Let me know what errors you see in the console!

