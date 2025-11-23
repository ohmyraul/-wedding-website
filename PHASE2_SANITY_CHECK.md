# PHASE 2 Motion & Micro-interactions - Sanity Check Guide

## Desktop Review Checklist

### Hero Section
**What to check:**
- [ ] Does the entrance feel smooth and cinematic, or still a bit "piecey"?
- [ ] Logo, opening line, names, event card: Do they feel like one composed moment, or four separate tricks?
- [ ] Is the scroll indicator animation subtle and not distracting?
- [ ] Does the S&A logo spring animation feel natural (not too bouncy)?

**Expected behavior:**
- Elements should fade in with subtle upward motion (12-16px)
- Timing should feel coordinated, not staggered awkwardly
- Everything should feel like a single, composed entrance

---

### Story Section
**What to check:**
- [ ] Do year → text → photo staggers feel like chapter turns, or like a UI component demo?
- [ ] Is the timing between year tag, title, and photo natural?
- [ ] Do the photo frames feel like they're part of the story, not floating separately?

**Expected behavior:**
- Year tag appears first (delay: 0)
- Title and text follow (delay: 0.12s)
- Photo appears last (delay: 0.2s)
- Should feel like reading a storybook, not a carousel

---

### Celebration Section
**What to check:**
- [ ] Does the venue card's pulse feel like a human emphasis (nice) or like a product "feature highlight" (too much)?
- [ ] If it feels even slightly gimmicky, note it for amplitude/duration reduction
- [ ] Do timeline items feel like they're revealing in sequence, not all at once?
- [ ] Are timeline circle hovers subtle (scale 1.10, not aggressive)?

**Expected behavior:**
- Venue card should have a very subtle pulse (scale 1 → 1.02 → 1) after entrance
- Timeline circles should hover at 1.10 scale (not 1.25)
- Timeline items should stagger in smoothly

---

### Travel & Stay Section
**What to check:**
- [ ] Do the ticket and Base Camp cards feel like two sheets on a desk, not floating tiles?
- [ ] Does the ticket card entrance feel grounded (y-translate only, no sideways slide)?
- [ ] Is the stagger between cards natural (ticket first, then Base Camp)?

**Expected behavior:**
- Ticket card enters with simple upward motion (16px translate)
- Base Camp follows with 0.15s delay
- Cards should feel like physical objects, not UI components

---

### RSVP Section
**What to check:**
- [ ] Success modal entrance should feel warm and gentle, not SaaS-y
- [ ] Does the modal scale-in feel natural (0.95 → 1.0)?
- [ ] Is the timing smooth (300ms, not too fast)?

**Expected behavior:**
- Modal should fade in with subtle scale (not aggressive)
- Should feel celebratory, not like a notification
- No error shake animations (removed per constraints)

---

### General Desktop Checks
- [ ] Button hovers: Scale 1.02, lift 2px, no rotation on primary CTAs
- [ ] Card hovers: Subtle lift (4px), max 0.5° rotation, desktop only
- [ ] Dot nav: Hover scale 1.1, active scale 1.15
- [ ] Cookie & Bailey button: Subtle hover with 1° rotation (playful element)

---

## Mobile Review Checklist

### Touch Behavior
- [ ] Check if any card hover/motion ideas accidentally leak into touch behavior
- [ ] Cards should NOT have hover effects on mobile (they're hidden with `hidden md:block`)
- [ ] Buttons should still have active states (press feedback)

### Scroll Performance
- [ ] Make sure nothing feels jittery as you scroll slowly
- [ ] Check if parallax feels too aggressive or distracting
- [ ] Verify that entrance animations don't feel laggy on slower devices

### Motion Sensitivity
- [ ] If you have `prefers-reduced-motion` enabled, verify animations are minimal
- [ ] All automatic animations should respect reduced motion preference
- [ ] User-initiated interactions (taps, swipes) should still feel responsive

---

## Quick Assessment Template

After reviewing, fill this out:

### ✅ 3 Things That Immediately Feel Better Now:
1. 
2. 
3. 

### ⚠️ 2 Moments That Still Bug You (even if you can't articulate why):
1. 
2. 

---

## Technical Notes for Reference

**Motion Parameters:**
- Scroll-in duration: 280ms
- Translate distances: 8px (subtle), 12px (normal), 16px (emphasized)
- Button hover: scale 1.02, translateY -2px
- Card hover: translateY -4px, rotate 0.5° (desktop only)
- Timeline circles: hover scale 1.10 (reduced from 1.25)
- Dot nav: hover 1.1, active 1.15

**Accessibility:**
- All scroll animations respect `prefers-reduced-motion`
- Hover states preserved (user-initiated)
- Focus states remain visible

---

## Common Issues to Watch For

1. **Too fast/aggressive:** Animations should feel calm, not snappy
2. **Too slow/sluggish:** 280ms is the sweet spot, not 500ms+
3. **Inconsistent timing:** All similar elements should use same duration
4. **Jittery scrolling:** Parallax might be too strong, or entrance animations conflicting
5. **Gimmicky effects:** Pulse, rotations should feel hand-drawn, not product-y

---

## Next Steps

After completing this checklist, share:
- The 3 things that feel better
- The 2 moments that bug you
- Any specific sections that need refinement

We'll translate feedback into targeted tweaks for PHASE 2 refinements.

