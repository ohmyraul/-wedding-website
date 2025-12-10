# PHASE 3 – Implementation Plan
## Targeted Improvements Based on Diagnosis

**Based on:** PHASE3_DIAGNOSIS.md  
**Goal:** Bring site to WCAG 2.1 AA compliance and optimize performance without changing visual design

---

## 1. Headings & Landmarks

### Changes

**A. Add H1 to Hero Section**
- **Component:** `Hero` (line ~1453)
- **Change:** Convert `<h2>` "Shubs & Alysha" to `<h1>`
- **Why:** Page must have exactly one H1 for semantic structure
- **Impact:** Visual unchanged (same styling via TYPO_H1)

**B. Verify Heading Hierarchy**
- **Components:** All sections
- **Change:** Ensure no heading level jumps (H2 → H4)
- **Specific fixes:**
  - Celebration timeline events: Change `<h4>` to `<h3>` (line ~3253)
  - Cookie game headings: Keep as `<h4>` (game UI, not page structure)
  - Explore Goa items: Change `<h4>` to `<h3>` if they're subsection headings
- **Why:** Proper hierarchy helps screen readers navigate

**C. Add `<main>` Wrapper**
- **Component:** `App` (line ~4915)
- **Change:** Wrap all `<section>` elements in `<main>` element
- **Structure:**
  ```jsx
  <div className="scroll-container">
    <Nav />
    <DotNav />
    <main>
      <section id="hero">...</section>
      <section id="the-celebration">...</section>
      // ... all other sections
    </main>
    <Footer />
  </div>
  ```
- **Why:** Provides main content landmark for screen readers

**D. Add Semantic `<header>` and `<nav>`**
- **Component:** `Nav` (line ~1022)
- **Change:** 
  - Wrap nav container in `<header>`
  - Wrap navigation links in `<nav>` with `aria-label="Main navigation"`
- **Why:** Proper semantic structure

**E. Add `aria-current` to Active Nav**
- **Component:** `Nav` and `DotNav`
- **Change:** Add `aria-current="page"` to active section link/dot
- **Why:** Indicates current page/section to screen readers

---

## 2. Images & Alt Text

### Changes

**A. Improve Alt Text Specificity**
- **Component:** `Story` section
- **Change:** 
  - `goa-scooter.jpg`: Change `alt="Goa Life"` to `alt="Shubs and Alysha on a scooter in Goa"`
- **Why:** More descriptive alt text is better for screen readers

**B. Verify All Images Have Alt**
- **Status:** ✅ All images already have alt text
- **Action:** No changes needed, but verify during implementation

**C. Add Responsive Images (Optional, Performance)**
- **Components:** Hero, Story images
- **Change:** Add `srcset` for responsive images (if time permits)
- **Why:** Better performance on mobile devices
- **Priority:** Medium (can be done later)

---

## 3. Interactive Elements (ARIA, Keyboard)

### Changes

**A. Add Focus Traps to Modals**
- **Components:**
  - `ImageModal` (line ~2476)
  - `PasswordModal` (line ~4502)
  - RSVP success/decline modals (lines ~4269, ~4285)
  - `CookieChaseGame` (when open)
- **Change:** Implement focus trap using `useEffect` and `tabIndex` management
- **Implementation:**
  ```jsx
  useEffect(() => {
    if (!isOpen) return;
    const focusableElements = modalRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    const handleTab = (e) => {
      if (e.key !== 'Tab') return;
      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    };
    
    firstElement?.focus();
    document.addEventListener('keydown', handleTab);
    return () => document.removeEventListener('keydown', handleTab);
  }, [isOpen]);
  ```
- **Why:** Prevents keyboard users from tabbing out of modal

**B. Return Focus on Modal Close**
- **Components:** All modals
- **Change:** Store trigger element ref, return focus on close
- **Implementation:**
  ```jsx
  const triggerRef = useRef(null);
  
  const openModal = () => {
    triggerRef.current = document.activeElement;
    setIsOpen(true);
  };
  
  const closeModal = () => {
    setIsOpen(false);
    triggerRef.current?.focus();
  };
  ```
- **Why:** Returns keyboard focus to logical location

**C. Add ARIA Roles to Modals**
- **Components:** All modals
- **Change:** Add `role="dialog"` and `aria-modal="true"` to modal container
- **Change:** Add `aria-labelledby` pointing to modal heading
- **Example:**
  ```jsx
  <motion.div
    role="dialog"
    aria-modal="true"
    aria-labelledby="modal-title"
    // ...
  >
    <h3 id="modal-title">Modal Title</h3>
  </motion.div>
  ```
- **Why:** Properly identifies modals to screen readers

**D. Add `aria-live` for RSVP Feedback**
- **Component:** `RSVP` form (line ~4083)
- **Change:** Add `aria-live="polite"` region for form submission messages
- **Implementation:**
  ```jsx
  <div aria-live="polite" aria-atomic="true" className="sr-only">
    {submissionStatus && <p>{submissionStatus}</p>}
  </div>
  ```
- **Why:** Announces form submission status to screen readers

**E. Associate Error Messages with Inputs**
- **Component:** `RSVP` form
- **Change:** Add `aria-describedby` to inputs, link to error message IDs
- **Why:** Associates errors with form fields for screen readers
- **Note:** Currently form uses browser validation, may need custom error handling

**F. Fix Dress Code Color Picker**
- **Component:** `DressCode` (line ~3402)
- **Change:** Convert `motion.div` with `onClick` to `<button>` or add `role="button"` and keyboard handlers
- **Why:** Interactive elements should be buttons

**G. Add Skip Link**
- **Component:** `App` (top of component tree)
- **Change:** Add skip to main content link
- **Implementation:**
  ```jsx
  <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-navy focus:text-white">
    Skip to main content
  </a>
  <main id="main-content">
    {/* content */}
  </main>
  ```
- **Why:** Allows keyboard users to skip navigation

---

## 4. Motion & Reduced Motion

### Changes

**A. Verify All Animations Respect Reduced Motion**
- **Components:** All animated components
- **Status:** ✅ `FadeInWhenVisible` and `ParallaxWrapper` already respect it
- **Action:** Verify floating elements (FloatingPalmTree, FloatingMusicNotes) respect reduced motion
- **Change:** If not, add `prefersReducedMotion` check to disable animations
- **Why:** Accessibility requirement

**B. Keep User-Initiated Animations**
- **Status:** ✅ Hover/tap transitions should remain (user-initiated)
- **Action:** No changes needed

---

## 5. Contrast Tweaks (If Needed)

### Changes

**A. Audit Low Opacity Text**
- **Components:** All sections
- **Change:** 
  - Find all instances of `text-navy/60` and `text-navy/50`
  - Verify contrast ratios
  - Increase opacity or use different color if fails WCAG AA
- **Priority:** High (may have contrast failures)

**B. Verify Peach Text Contrast**
- **Components:** Celebration timeline, links
- **Change:** 
  - Test `#D88D66` on `#FDF9F4` contrast ratio
  - If fails, use darker shade for body text, or add underline for links
- **Priority:** High (likely fails for normal text)

**C. Add CSS for Contrast Fixes**
- **Change:** Create utility classes for accessible text colors
- **Example:**
  ```css
  .text-peach-accessible { color: #B8704A; } /* Darker peach for body text */
  .text-peach-link { 
    color: #D88D66;
    text-decoration: underline;
  }
  ```

---

## 6. Performance (Lazy Loading, Code-Splitting)

### Changes

**A. Lazy Load CookieChaseGame**
- **Component:** `CookieChaseGame`
- **Change:** 
  ```jsx
  const CookieChaseGame = React.lazy(() => import('./components/CookieChaseGame'));
  
  // In App component:
  <Suspense fallback={<div>Loading game...</div>}>
    {isGameOpen && <CookieChaseGame isOpen={isGameOpen} onClose={...} />}
  </Suspense>
  ```
- **Why:** Reduces initial bundle size (~50KB+)
- **Impact:** Game only loads when user clicks button

**B. Lazy Load Family Mode Sections**
- **Components:** `KidenaHouse`, `FamilyItinerary`
- **Change:**
  ```jsx
  const KidenaHouse = React.lazy(() => import('./components/KidenaHouse'));
  const FamilyItinerary = React.lazy(() => import('./components/FamilyItinerary'));
  
  // Conditionally render with Suspense
  ```
- **Why:** Reduces bundle for non-family users
- **Note:** These are currently inline in App.jsx, may need extraction first

**C. Lazy Load ImageModal (If Not Already Split)**
- **Component:** `ImageModal`
- **Change:** Lazy load if it's not already code-split
- **Why:** Only needed when viewing carousel

**D. Optimize Image Loading**
- **Components:** Hero, Story images
- **Change:** Add `srcset` for responsive images (optional, medium priority)
- **Why:** Better performance on mobile

**E. Extract Static Style Objects**
- **Components:** Timeline circles, other components with inline styles
- **Change:** Move static style objects outside render
- **Example:**
  ```jsx
  // Before:
  <div style={{ boxShadow: '0 10px 15px...' }} onMouseEnter={...} />
  
  // After:
  const baseShadow = '0 10px 15px -3px rgba(216, 141, 102, 0.15)';
  const hoverShadow = '0 15px 20px -3px rgba(216, 141, 102, 0.2)';
  ```
- **Why:** Prevents object recreation on each render

---

## Implementation Order

### Phase 1: Critical Accessibility (Must Do)
1. Add H1 to Hero
2. Add `<main>` wrapper
3. Add semantic `<header>` and `<nav>`
4. Fix heading hierarchy
5. Add focus traps to modals
6. Add focus return on modal close
7. Add ARIA roles to modals

### Phase 2: High Priority Accessibility
8. Add `aria-live` for RSVP feedback
9. Add skip link
10. Fix contrast issues (peach text, low opacity)
11. Add `aria-current` to active nav

### Phase 3: Performance
12. Lazy load CookieChaseGame
13. Lazy load family mode sections (if extracted)
14. Extract static style objects

### Phase 4: Polish
15. Improve alt text specificity
16. Add responsive images (optional)
17. Final accessibility audit

---

## Components to Modify

1. **App.jsx**
   - Add `<main>` wrapper
   - Add skip link
   - Lazy load components
   - Fix heading hierarchy

2. **Hero Component** (in App.jsx)
   - Change H2 to H1

3. **Nav Component** (in App.jsx)
   - Wrap in `<header>` and `<nav>`
   - Add `aria-current`

4. **DotNav Component** (in App.jsx)
   - Add `aria-current`

5. **ImageModal Component** (in App.jsx)
   - Add focus trap
   - Add focus return
   - Add ARIA roles

6. **PasswordModal Component** (in App.jsx)
   - Add focus trap
   - Add focus return
   - Add ARIA roles

7. **RSVP Component** (in App.jsx)
   - Add `aria-live` region
   - Add error message associations
   - Fix success/decline modal ARIA

8. **CookieChaseGame.jsx**
   - Add focus trap
   - Add focus return

9. **Celebration Component** (in App.jsx)
   - Fix heading hierarchy (H4 → H3)

10. **DressCode Component** (in App.jsx)
    - Fix color picker button semantics

11. **FadeInWhenVisible.jsx**
    - ✅ Already respects reduced motion (no changes)

12. **ParallaxWrapper.jsx**
    - ✅ Already respects reduced motion (no changes)

---

## Testing Checklist

After implementation, verify:

- [ ] Exactly one H1 on page
- [ ] Proper heading hierarchy (no level jumps)
- [ ] `<main>` landmark present
- [ ] `<header>` and `<nav>` present
- [ ] All modals trap focus
- [ ] All modals return focus on close
- [ ] All modals have `role="dialog"` and `aria-modal="true"`
- [ ] Skip link works
- [ ] Active nav has `aria-current`
- [ ] RSVP form announces status to screen readers
- [ ] All text meets WCAG AA contrast (4.5:1 for normal, 3:1 for large)
- [ ] CookieChaseGame lazy loads
- [ ] Family mode sections lazy load (if implemented)
- [ ] No visual changes to design
- [ ] All animations respect `prefers-reduced-motion`

---

## Notes

- **Visual Design:** All changes must maintain exact visual appearance
- **Design Tokens:** Do not modify TYPO_*, CARD_*, SPACE_*, or color palette values
- **Copy:** Do not change any text content
- **Dependencies:** Do not add heavy new dependencies (focus trap can be custom implementation)

---

**Ready for implementation after approval.**









