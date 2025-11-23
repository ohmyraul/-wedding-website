# PHASE 5 – Final QA, Edge Cases & "Feel" Audit

## A. Layout & Responsive Issues

### A1. Family Itinerary Container Width Inconsistency
**Component:** `FamilyItinerary`  
**Location:** `src/App.jsx:2358`  
**Breakpoint:** All  
**Symptom:** Family Itinerary still uses `max-w-5xl` instead of `max-w-6xl`, breaking Phase 4 alignment normalization.  
**Probable Cause:** Missed during Phase 4 implementation.  
**Impact:** **Must-fix** - Visual inconsistency with other sections.

---

### A2. Travel Ticket Connector Line Overflow Risk
**Component:** `Travel` (ticket card connector)  
**Location:** `src/App.jsx:3093`  
**Breakpoint:** `md` and above (hidden on mobile)  
**Symptom:** The dashed connector line (`w-8 h-[1px]`) extends from ticket card with `translate-x-full`. On narrow `md` viewports (~768px), this might visually overflow or feel disconnected if the gap between cards is tight.  
**Probable Cause:** Fixed width connector doesn't account for responsive gap (`gap-8 md:gap-10 lg:gap-12`).  
**Impact:** **Noticeable** - Minor visual polish issue.

---

### A3. Hero Event Details Text Wrapping on Very Small Screens
**Component:** `Hero` (event details card)  
**Location:** `src/App.jsx:1546-1561`  
**Breakpoint:** Mobile < 640px  
**Symptom:** Event details use `flex-col md:flex-row md:flex-wrap` with `gap-3`. On very small screens (< 400px), the location text "Blu Missel, Ribandar, Goa" might wrap awkwardly or feel cramped.  
**Probable Cause:** No explicit text wrapping constraints or min-width on flex items.  
**Impact:** **Minor** - Edge case for very small devices.

---

### A4. Decorative Anchor Positioning Edge Cases
**Component:** Story, Explore Goa, RSVP (decorative anchors)  
**Location:** `src/App.jsx:1594, 2857, 3449`  
**Breakpoint:** `md` and above  
**Symptom:** Anchors use fixed positioning (`top-32 left-8`, `top-20 right-8`, `top-16 right-12`). On tablet landscape or narrow desktop, these might overlap content or feel too close to section edges.  
**Probable Cause:** Fixed pixel values don't scale with container width.  
**Impact:** **Noticeable** - Should verify on tablet breakpoints.

---

### A5. Base Camp Card Hidden on Mobile Layout
**Component:** `Travel` (base camp card)  
**Location:** `src/App.jsx:3103`  
**Breakpoint:** Mobile < 768px  
**Symptom:** Base camp card has `hidden md:block`, so on mobile only the ticket card is visible. The grid becomes single-column, which is fine, but the ticket card might feel isolated.  
**Probable Cause:** Intentional design decision.  
**Impact:** **Minor** - Design choice, but worth verifying the single-card layout feels intentional.

---

## B. Interaction & Edge Cases

### B1. RSVP Form Input Length Validation Missing
**Component:** `RSVP` (form inputs)  
**Location:** `src/App.jsx:3469-3550`  
**Breakpoint:** All  
**Symptom:** Text inputs (name, email, phone, dietary, song) have no `maxLength` attributes. Very long inputs could:
- Break layout visually
- Cause form submission issues
- Create poor UX for users with long names/emails  
**Probable Cause:** No input length constraints defined.  
**Impact:** **Must-fix** - Could cause real-world issues.

**Suggested Limits:**
- Name: `maxLength={100}`
- Email: `maxLength={254}` (RFC 5321)
- Phone: `maxLength={20}`
- Dietary: `maxLength={200}`
- Song: `maxLength={100}`

---

### B2. RSVP Form Error Handling Uses Alert()
**Component:** `RSVP` (form submission)  
**Location:** `src/App.jsx:3414-3431`  
**Breakpoint:** All  
**Symptom:** Error messages use `alert()`, which:
- Blocks the UI
- Doesn't match the site's design language
- Can't be styled
- Poor accessibility (screen reader announcements may be delayed)  
**Probable Cause:** Quick implementation using native alerts.  
**Impact:** **Noticeable** - UX polish issue, but functional.

---

### B3. CookieChaseGame Suspense Fallback is Null
**Component:** `App` (lazy-loaded game)  
**Location:** `src/App.jsx:4485`  
**Breakpoint:** All  
**Symptom:** `<Suspense fallback={null}>` means no loading indicator when the game component loads. On slow connections, clicking "Cookie & Bailey" might feel unresponsive.  
**Probable Cause:** Minimal fallback chosen for simplicity.  
**Impact:** **Noticeable** - Could feel like a bug on slow networks.

---

### B4. Modal Scroll Lock Cleanup Verification
**Component:** `ImageModal`, `RSVP` modals, `CookieChaseGame`  
**Location:** `src/App.jsx:1809, 1813, 1820` and `src/components/CookieChaseGame.jsx:202, 205`  
**Breakpoint:** All  
**Symptom:** Multiple modals set `document.body.style.overflow = 'hidden'`. Need to verify:
- Cleanup happens on unmount
- No conflicts if multiple modals could theoretically open
- Works correctly with browser back button  
**Probable Cause:** Multiple components managing body scroll independently.  
**Impact:** **Must-fix** - Could cause scroll lock bugs.

**Current State:**
- `ImageModal`: Has cleanup in `useEffect` return ✅
- `CookieChaseGame`: Has cleanup in `useEffect` return ✅
- `RSVP` modals: **Missing scroll lock** - No `document.body.style.overflow = 'hidden'` when modal opens. Background might still be scrollable.

---

### B5. Focus Trap Edge Case: Empty Modals
**Component:** `ImageModal`, `RSVP` modals  
**Location:** `src/App.jsx:1840-1864, 3914-3924`  
**Breakpoint:** All  
**Symptom:** Focus trap logic checks `if (!focusableElements || focusableElements.length === 0) return;`, which means if a modal has no focusable elements, focus isn't trapped. This is probably fine, but worth noting.  
**Probable Cause:** Defensive check to avoid errors.  
**Impact:** **Minor** - Edge case, unlikely to occur.

---

### B6. Invalid Tailwind Class: `border-3`
**Component:** `Celebration` (timeline icon circles)  
**Location:** `src/App.jsx:2592`  
**Breakpoint:** All  
**Symptom:** Uses `border-3` which is not a standard Tailwind class. Tailwind has `border`, `border-2`, `border-4`, `border-8`, but no `border-3`. This likely falls back to browser default or doesn't apply.  
**Probable Cause:** Typo or custom class assumption.  
**Impact:** **Must-fix** - Visual bug, border might not render as intended.

**Current:** `border-3 border-navy`  
**Should be:** `border-[3px] border-navy` or `border-2 border-navy` (if 2px is acceptable)

---

### B7. RSVP Form Keyboard-Only Flow
**Component:** `RSVP` (form)  
**Location:** `src/App.jsx:3466-3595`  
**Breakpoint:** All  
**Symptom:** Form uses radio buttons with hidden inputs and custom styled divs. Keyboard navigation should work (labels are clickable), but need to verify:
- Tab order is logical
- Radio buttons are keyboard accessible
- Submit button is reachable via keyboard  
**Probable Cause:** Custom radio styling might affect keyboard behavior.  
**Impact:** **Noticeable** - Accessibility concern.

**Verification needed:** Test tab navigation through form fields.

---

## C. "Feel" Issues

### C1. Travel Connector Line Disconnection on Mobile
**Component:** `Travel` (connector line)  
**Location:** `src/App.jsx:3093`  
**Breakpoint:** Mobile < 768px  
**Symptom:** Connector line is `hidden md:block`, so on mobile it doesn't exist. This is fine, but the ticket card might feel like it's missing its "pair" visually.  
**Probable Cause:** Intentional mobile simplification.  
**Impact:** **Minor** - Design choice, but could feel incomplete.

---

### C2. Decorative Anchors Z-Index Layering
**Component:** Story, Explore Goa, RSVP (decorative anchors)  
**Location:** `src/App.jsx:1594, 2857, 3449`  
**Breakpoint:** `md` and above  
**Symptom:** Anchors use `z-0` while section content uses `z-10`. This should be fine (anchors behind content), but if content has transparent backgrounds, anchors might show through unexpectedly.  
**Probable Cause:** Z-index hierarchy for layering.  
**Impact:** **Minor** - Should verify anchors stay behind content.

---

### C3. FadeInWhenVisible Animation Duration
**Component:** `FadeInWhenVisible` (shared component)  
**Location:** `src/components/shared/FadeInWhenVisible.jsx:30`  
**Breakpoint:** All  
**Symptom:** Animation duration is `0.6s` with `easeOut`. On fast scroll, animations might feel slow or laggy. Users scrolling quickly might not see animations complete.  
**Probable Cause:** Standard animation timing.  
**Impact:** **Noticeable** - Could feel sluggish on fast scroll.

**Current:** `duration: 0.6, delay, ease: 'easeOut'`  
**Consider:** Reducing to `0.4s` or `0.5s` for snappier feel.

---

### C4. CookieChaseGame Loading State Absence
**Component:** `App` (Suspense boundary)  
**Location:** `src/App.jsx:4485`  
**Breakpoint:** All  
**Symptom:** No loading indicator when game loads. User clicks "Cookie & Bailey", nothing happens for a moment (on slow networks), then game appears. Could feel like a broken button.  
**Probable Cause:** `fallback={null}` chosen for simplicity.  
**Impact:** **Noticeable** - UX polish, especially on slow connections.

**Suggestion:** Add a minimal loading state (e.g., small spinner or "Loading..." text in palette colors).

---

### C5. RSVP Submit Button Disabled State Transition
**Component:** `RSVP` (submit button)  
**Location:** `src/App.jsx:3586-3594`  
**Breakpoint:** All  
**Symptom:** Button has `disabled:opacity-50` and `disabled:hover:bg-[#D88D66]` (prevents hover effects when disabled). The transition from enabled to disabled might feel abrupt if submission is fast.  
**Probable Cause:** Standard disabled state styling.  
**Impact:** **Minor** - Very subtle, probably fine as-is.

---

### C6. Hero Event Details Card Spacing on Mobile
**Component:** `Hero` (event details)  
**Location:** `src/App.jsx:1544`  
**Breakpoint:** Mobile < 640px  
**Symptom:** Card uses `mt-8 md:mt-10 lg:mt-12` (increased in Phase 4). On mobile, `mt-8` might feel slightly tight after the "Your presence would mean the world to us" text.  
**Probable Cause:** Phase 4 spacing adjustment.  
**Impact:** **Minor** - Very subtle spacing feel.

---

### C7. Celebration Timeline Icon Circle Border Issue
**Component:** `Celebration` (timeline icons)  
**Location:** `src/App.jsx:2592`  
**Breakpoint:** All  
**Symptom:** Uses `border-3` (invalid Tailwind class). Border might not render, making circles look lighter than intended.  
**Probable Cause:** Typo in class name.  
**Impact:** **Noticeable** - Visual weight inconsistency (already noted in B6, but also a "feel" issue).

---

### C8. Travel Base Camp Card Hidden on Mobile
**Component:** `Travel` (base camp)  
**Location:** `src/App.jsx:3103`  
**Breakpoint:** Mobile < 768px  
**Symptom:** Base camp card is completely hidden on mobile. The Travel section becomes just the ticket card. This might feel incomplete or confusing if users expect to see accommodation info.  
**Probable Cause:** Intentional design to reduce mobile clutter.  
**Impact:** **Noticeable** - Design decision, but could feel like missing content.

---

## Summary by Priority

### Must-Fix (Before Launch)
1. **A1:** Family Itinerary container width (`max-w-5xl` → `max-w-6xl`)
2. **B1:** RSVP form input length validation (`maxLength` attributes)
3. **B4:** Verify RSVP modal scroll lock cleanup
4. **B6:** Fix invalid `border-3` class in Celebration timeline

### Nice-to-Have (Polish)
5. **A2:** Travel connector line responsive behavior
6. **B2:** Replace `alert()` with styled error messages
7. **B3:** Add loading state for CookieChaseGame
8. **C3:** Reduce FadeInWhenVisible animation duration slightly
9. **C4:** Add CookieChaseGame loading indicator

### Edge Cases (Low Priority)
10. **A3:** Hero event details text wrapping on very small screens
11. **A4:** Decorative anchor positioning verification
12. **A5:** Base camp mobile layout feel
13. **B5:** Focus trap empty modal edge case
14. **B7:** RSVP keyboard-only flow verification
15. **C1:** Travel connector mobile disconnection
16. **C2:** Decorative anchor z-index verification
17. **C5:** RSVP button disabled transition
18. **C6:** Hero event details mobile spacing
19. **C8:** Base camp mobile hidden feel

---

**Total Issues Found:** 19  
**Must-Fix:** 4  
**Nice-to-Have:** 5  
**Edge Cases:** 10

