# Test Formspree Endpoint

## Quick Test

Open your browser console (F12) and run this:

```javascript
fetch('https://formspree.io/f/mnnwwold', {
  method: 'POST',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/x-www-form-urlencoded',
  },
  body: 'name=Test&email=test@test.com&phone=123&guests=1&attending=Count Me In&_format=json'
})
.then(r => r.json())
.then(data => {
  console.log('Success:', data);
  alert('Formspree is working! Check your email.');
})
.catch(err => {
  console.error('Error:', err);
  alert('Error: ' + err.message);
});
```

This will tell us if:
- ✅ Formspree endpoint is correct
- ✅ Formspree is accepting submissions
- ✅ There's a CORS or network issue

---

## What to Look For

**If it works:**
- You'll see "Success" in console
- You'll get an email from Formspree
- The form code needs fixing

**If it fails:**
- Check the error message
- Might need to activate the form in Formspree
- Might be a CORS/network issue

---

## Check Formspree Dashboard

1. Go to [formspree.io](https://formspree.io)
2. Log in
3. Check your form `mnnwwold`
4. Look for:
   - "Activate" button
   - Recent submissions
   - Error messages

