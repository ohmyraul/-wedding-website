# PHASE 3 – Diagnosis Report
## Accessibility, Semantics & Performance Audit

**Date:** Generated from codebase analysis  
**Scope:** Single-page React wedding website (`src/App.jsx` and components)  
**Purpose:** Structured audit for WCAG 2.1 AA compliance, semantic HTML, and performance optimization

---

## A. Accessibility & Semantics Audit

### Headings

**Critical Issue: Missing H1**
- **Problem:** No `<h1>` element found on the page
- **Current state:**
  - Hero section uses `<h2>` for "Shubs & Alysha" (line 1503)
  - RSVP section uses `<h2>` for "R.S.V.P." (line 4092)
  - All section headings use `<h2>` via `SignboardHeading` component
  - Story subsections use `<h3>` (e.g., "The First Time", "The Reunion", "Building a Life", "The Question")
  - Kidena House features use `<h3>` (e.g., "The House", "No Cooking, No Cleaning")
  - Celebration timeline events use `<h4>` (line 3253)
  - Cookie game uses `<h4>` for game screens (lines 2293, 2313, 2343)
  - Dress Code uses `<h3>` for "Beach Formal" and "Palette Notes" (lines 3385, 3398)
  - Explore Goa items use `<h4>` (line 3576)
  - Family Itinerary items use `<h3>` (line 3102)

**Recommendation:**
- Make "Shubs & Alysha" in Hero section the single `<h1>` (primary site title)
- Keep all section headings as `<h2>`
- Ensure subsections use `<h3>`, sub-subsections use `<h4>`, etc.
- No heading level jumps (e.g., h2 → h4)

**Heading Structure Should Be:**
```
H1: "Shubs & Alysha" (Hero)
  H2: "Our Story" (Story section)
    H3: "The First Time" (2015)
    H3: "The Reunion" (2018)
    H3: "Building a Life" (2019-2024)
    H3: "The Question" (2024)
  H2: "The Celebration" (Celebration section)
    H3: "Friday, March 20, 2026" (date heading)
    H4: "Ceremony", "Hi-Tea & Photos", etc. (timeline events)
  H2: "Travel & Stay"
  H2: "Kidena House" (family mode)
    H3: "The House", "No Cooking, No Cleaning", etc.
  H2: "The Family Plan" (family itinerary)
    H3: Day titles
  H2: "What to Wear" (Dress Code)
    H3: "Beach Formal", "Palette Notes"
  H2: "Explore Goa"
    H4: Item names
  H2: "R.S.V.P."
  H2: "Questions & Answers" (Q&A)
```

### Landmarks & Structure

**Missing `<main>` Element**
- **Problem:** No single `<main>` wrapper found
- **Current state:** All sections are direct children of `.scroll-container` div
- **Impact:** Screen readers cannot easily identify the main content area
- **Recommendation:** Wrap all sections (except Nav and Footer) in a `<main>` element

**Semantic Elements Status:**
- ✅ **Sections:** All major sections use `<section>` with `id` and `aria-label` (good)
- ❌ **Header:** Navigation uses `<div>` instead of `<header>` (line 1022+)
- ❌ **Nav:** Navigation links are in a `<div>` instead of `<nav>` (line 1022+)
- ✅ **Footer:** Uses `<footer>` element (line 4320)
- ❌ **Aside:** No `<aside>` used (could be used for floating elements like DotNav, MusicPlayer, FloatingRSVPButton)

**Section Accessible Names:**
- ✅ All sections have `aria-label` attributes:
  - Hero: `aria-label="Hero section"`
  - Story: `aria-label="Our Story"`
  - Celebration: `aria-label="The Celebration"`
  - Travel: `aria-label="Travel & Stay"`
  - Kidena House: `aria-label="Kidena House"`
  - Family Itinerary: `aria-label="Family Itinerary"`
  - Dress Code: `aria-label="Dress Code"`
  - Explore Goa: `aria-label="Explore Goa"`
  - Q&A: `aria-label="Questions & Answers"`
  - RSVP: `aria-label="RSVP"`

**Recommendations:**
- Wrap Nav in `<header>` and navigation links in `<nav>`
- Add `<main>` wrapper around all sections
- Consider `<aside>` for DotNav (optional, but semantically correct)

### Images & Media

**Image Inventory:**

1. **Hero Image** (line 1478)
   - `src="/images/hero.jpg"`
   - `alt="Shubs and Alysha"` ✅ (meaningful)
   - `loading="eager"` ✅ (above fold)
   - `width={1024} height={890}` ✅

2. **Story Images:**
   - `firsttime.jpg` (line 1581): `alt="The First Time"` ✅
   - `office.jpg` (line 1642): `alt="The Reunion"` ✅
   - `goa-scooter.jpg` (line 1667): `alt="Goa Life"` ✅ (could be more descriptive)
   - `proposal.jpg` (line 1744): `alt="The Proposal"` ✅

3. **Celebration Image:**
   - `blu-missel.jpeg` (line 3163): `alt="Blu Missel by the River"` ✅

4. **Dress Code Image:**
   - `warddrobe.jpg` (line 3367): `alt="Wedding wardrobe inspiration"` ✅

5. **Kidena House Carousel Images** (lines 2716-2725):
   - All have descriptive alt text ✅
   - `kidena-house.jpg`: `alt="Kidena House - Main View"`
   - `kidena-house2.jpg`: `alt="Kidena House - View 2"`
   - etc.

6. **Cookie Game Images** (multiple instances):
   - `cookie.png` / `cookie.jpg` (lines 578, 702, 2283, 2401): `alt="Cookie"` ✅
   - Note: Used in game context, alt is appropriate

**Decorative Images:**
- No decorative images found that need `alt=""`
- All images appear to have meaningful content

**Image Optimization:**
- Most images use `loading="lazy"` ✅
- Hero image uses `loading="eager"` ✅ (correct for above fold)
- Some images have `width` and `height` attributes ✅
- **Opportunity:** Consider `srcset` for responsive images (hero, story photos)

### Interactive Elements

**Navigation (Nav Component, ~line 1022):**
- ✅ Uses proper `<a>` tags for navigation links
- ✅ Has `aria-label` on links: `aria-label={`Navigate to ${link.name} section`}`
- ✅ Mobile menu button has `aria-label="Toggle navigation menu"` and `aria-expanded={isOpen}`
- ✅ Family mode toggle has `aria-label`
- ❌ **Missing:** `aria-current="page"` for active section (if applicable)
- ✅ Focus styles: `focus-visible:ring-2 focus-visible:ring-[#D88D66]`

**Dot Navigation (DotNav, ~line 4690):**
- ✅ Uses `<button>` elements
- ✅ Has `aria-label={section.name || section.id}`
- ✅ Has focus styles: `focus-visible:ring-2`
- ❌ **Missing:** `aria-current="true"` for active dot
- ✅ Keyboard accessible (button elements)

**Floating RSVP Button (FloatingRSVPButton, ~line 4477):**
- ✅ Uses `<button>` element
- ✅ Has `aria-label="Go to RSVP"`

**Music Player (MusicPlayer, ~line 4396):**
- ✅ Uses `<button>` element
- ✅ Has `aria-label={playing ? 'Pause background music' : 'Play background music'}`
- ✅ Dynamic label updates based on state

**Cookie & Bailey Button (Footer, ~line 4363):**
- ✅ Uses `<button>` element
- ✅ Has `aria-label="Cookie & Bailey"`

**Cookie Chase Game (CookieChaseGame.jsx):**
- ✅ Close button has `aria-label="Close game"` (line 518)
- ✅ Mobile control buttons have `aria-label` ("Move up", "Move left", "Move right", "Move down")
- ✅ Keyboard controls implemented (Arrow keys, WASD, Space, Escape)
- ❌ **Missing:** Focus trap when game is open
- ❌ **Missing:** Return focus to trigger button when game closes

**Image Modal (ImageModal, ~line 2476):**
- ✅ Close button has `aria-label="Close"`
- ✅ Zoom controls have `aria-label` ("Zoom in", "Zoom out", "Reset zoom")
- ✅ Navigation buttons have `aria-label` ("Previous image", "Next image")
- ✅ Keyboard support (Escape, Arrow keys, +/-)
- ❌ **Missing:** Focus trap when modal is open
- ❌ **Missing:** Return focus to trigger element when modal closes
- ❌ **Missing:** `role="dialog"` and `aria-modal="true"`

**Password Modal (PasswordModal, ~line 4502):**
- ❌ **Missing:** `role="dialog"` and `aria-modal="true"`
- ❌ **Missing:** Focus trap
- ❌ **Missing:** Return focus on close
- ❌ **Missing:** `aria-labelledby` pointing to heading

**RSVP Form (RSVP, ~line 4083):**
- ✅ All form inputs have proper `<label>` with `htmlFor` attributes
- ✅ Required fields marked with `required` attribute
- ✅ Submit button has `aria-label="Submit RSVP form"`
- ✅ Success/decline modals have headings (`<h3>`)
- ❌ **Missing:** `aria-live="polite"` region for form submission feedback
- ❌ **Missing:** Error messages not associated with inputs via `aria-describedby`

**Explore Goa Collapsible Sections (ExploreGoa, ~line 3526):**
- ✅ Uses `<button>` for mobile collapsible headers
- ✅ Has `aria-expanded={isExpanded}`
- ✅ Has `aria-label={`${isExpanded ? 'Collapse' : 'Expand'} ${section.category} section`}`
- ✅ Has focus styles

**Dress Code Color Picker (DressCode, ~line 3402):**
- ✅ Uses `<motion.div>` with `onClick` (should be `<button>` for better semantics)
- ❌ **Missing:** `role="button"` and `tabIndex="0"` if keeping as div
- ❌ **Missing:** Keyboard support (Enter/Space to activate)

### Keyboard & Focus

**Focus Styles:**
- ✅ Most interactive elements have `focus-visible:ring-2` styles
- ✅ Focus ring color: `ring-[#D88D66]` (peach, good contrast)
- ✅ Nav links have focus styles
- ✅ Form inputs have focus styles (`.modern-input:focus`)
- ✅ DotNav buttons have focus styles
- ✅ Mobile menu buttons have focus styles

**Keyboard Traps:**
- ❌ **Image Modal:** No focus trap - users can tab out of modal
- ❌ **Password Modal:** No focus trap
- ❌ **Cookie Game:** No focus trap - users can tab to page elements behind game
- ❌ **RSVP Success/Decline Modals:** No focus trap

**Focus Order:**
- ✅ Logical tab order through main sections
- ❌ **Issue:** Floating buttons (Music, RSVP, Cookie & Bailey) appear in DOM order, may interrupt natural flow
- **Recommendation:** Use `tabIndex="-1"` for decorative floating elements, or ensure they're at end of tab order

**Focus Return:**
- ❌ **Image Modal:** Does not return focus to trigger element on close
- ❌ **Password Modal:** Does not return focus
- ❌ **Cookie Game:** Does not return focus to trigger button
- ❌ **RSVP Modals:** Do not return focus

**Skip Links:**
- ❌ **Missing:** Skip to main content link

### Motion

**Current Motion Implementation:**
- ✅ `useReducedMotion` hook exists (line 873)
- ✅ `FadeInWhenVisible` respects `prefers-reduced-motion` (lines 890-946)
  - Disables `y` translation when reduced motion is preferred
  - Reduces animation duration
- ✅ `ParallaxWrapper` respects `prefers-reduced-motion` (lines 952-970)
  - Sets `adjustedOffset` to 0 when reduced motion is preferred
- ✅ Confetti respects `prefers-reduced-motion` (lines 17-25)

**Automatic Motion Still Present:**
- ✅ Scroll-triggered animations (FadeInWhenVisible) - **properly disabled** when reduced motion
- ✅ Parallax effects (ParallaxWrapper) - **properly disabled** when reduced motion
- ✅ Hover/tap transitions - **kept** (correct, as these are user-initiated)
- ✅ Floating decorative elements (FloatingPalmTree, FloatingMusicNotes) - **may still animate** (needs check)
- ✅ Countdown timer animations - **may still animate** (needs check)
- ✅ Cookie game animations - **may still animate** (needs check)

**Recommendations:**
- Verify all automatic entrance animations respect `prefers-reduced-motion`
- Keep hover/tap transitions (user-initiated)
- Consider disabling floating element animations when reduced motion is preferred

---

## B. Contrast & Readability

### Color Palette
- **Ink (text):** `#3B2F2A` (dark brown)
- **Canvas (background):** `#FDF9F4` (cream)
- **Stone:** `#EDEDE3` (light beige)
- **Peach Deep:** `#D88D66` (terracotta)
- **Peach Soft:** `#EBBA9A` (blush)

### Potential Contrast Issues

**1. Peach Text on Canvas/Stone:**
- **Location:** Timeline times in Celebration section (line ~3253)
- **Combination:** `text-[#D88D66]` on `bg-[#FDF9F4]`
- **Risk:** May not meet WCAG AA (4.5:1 for normal text, 3:1 for large text)
- **Recommendation:** Verify contrast ratio; may need darker shade for body text

**2. Low Opacity Text:**
- **Locations:**
  - `text-navy/80` (80% opacity) - may be acceptable for large text
  - `text-navy/70` (70% opacity) - borderline for body text
  - `text-navy/60` (60% opacity) - likely fails WCAG AA
  - `text-navy/50` (50% opacity) - fails WCAG AA
  - `text-navy/30` (30% opacity) - decorative only
- **Usage:** Found in various places (labels, secondary text, decorative elements)
- **Recommendation:** Audit all instances of `/60` and `/50` opacity text

**3. Peach Links on Canvas:**
- **Location:** Various links using `text-[#D88D66]` or `hover:text-[#D88D66]`
- **Combination:** Peach on cream background
- **Risk:** May not meet 4.5:1 contrast for links
- **Recommendation:** Verify contrast; ensure links have sufficient contrast (underlined links may help)

**4. Stone Background with Ink Text:**
- **Combination:** `bg-[#EDEDE3]` with `text-[#3B2F2A]`
- **Status:** Likely acceptable (dark on light)
- **Recommendation:** Verify, but should pass

**5. Peach Buttons with White/Cream Text:**
- **Combination:** `bg-[#D88D66]` with `text-[#FDF9F4]` or `text-white`
- **Status:** Likely acceptable (light on dark)
- **Recommendation:** Verify, but should pass

### Specific Selectors to Check

1. **Timeline times:** `.text-[#D88D66]` on canvas background
2. **Secondary text:** `.text-navy/70` and `.text-navy/60` instances
3. **Links:** Any `hover:text-[#D88D66]` on canvas backgrounds
4. **Labels:** `.text-navy/50` instances (should be decorative only)

**Recommendation:** Run automated contrast checker (e.g., axe DevTools, WAVE) to identify all failures, then fix systematically.

---

## C. Performance & Implementation

### Lazy Loading Opportunities

**1. CookieChaseGame Component**
- **Location:** `src/components/CookieChaseGame.jsx`
- **Size:** Large component with game logic, animations, state management
- **Usage:** Only loaded when user clicks "Cookie & Bailey" button
- **Recommendation:** Lazy load with `React.lazy()` and `Suspense`
- **Impact:** Reduces initial bundle size significantly

**2. Image Modal Component**
- **Location:** Defined in `App.jsx` (~line 2476)
- **Usage:** Only needed when viewing Kidena House carousel images
- **Recommendation:** Lazy load (though may already be code-split if not used initially)

**3. Kidena House Section**
- **Location:** `KidenaHouse` component (~line 2918)
- **Usage:** Only visible in family mode
- **Recommendation:** Lazy load entire section (including carousel)
- **Impact:** Reduces initial bundle for non-family users

**4. Family Itinerary Section**
- **Location:** `FamilyItinerary` component (~line 2997)
- **Usage:** Only visible in family mode
- **Recommendation:** Lazy load with Kidena House

**5. Heavy Image Sections**
- **Story Section:** Multiple large images (firsttime.jpg, office.jpg, proposal.jpg, goa-scooter.jpg)
- **Recommendation:** Images already use `loading="lazy"` ✅
- **Opportunity:** Consider lazy-loading entire Story section if below fold

### Asset Optimization

**Large Images Identified:**
1. **Hero image:** `hero.jpg` (1024x890) - ✅ Uses `loading="eager"` (correct)
2. **Story images:** Multiple photos (696x1024, 666x1024) - ✅ Use `loading="lazy"`
3. **Kidena House carousel:** 9 images - ✅ Use `loading="lazy"`
4. **Celebration image:** `blu-missel.jpeg` (1024x683) - ✅ Uses `loading="lazy"`
5. **Dress code image:** `warddrobe.jpg` (400x533) - ✅ Uses `loading="lazy"`

**Recommendations:**
- ✅ Images already have `width` and `height` attributes (prevents layout shift)
- ✅ Most images use `loading="lazy"` appropriately
- **Opportunity:** Add `srcset` for responsive images (hero, story photos)
- **Opportunity:** Consider WebP format with fallbacks
- **Opportunity:** Add `fetchPriority="high"` to hero image (already has `loading="eager"`)

**Audio Asset:**
- `goa-mix.mp3` - Uses `preload="none"` ✅ (good, doesn't block initial load)

### Code Optimization

**1. Inline Style Objects in Render:**
- **Location:** Various components
- **Examples:**
  - Timeline circles with `onMouseEnter/onMouseLeave` for shadow changes (line ~3241)
  - Inline `style` props with dynamic values
- **Recommendation:** Move static style objects outside render, use CSS variables for dynamic values where possible

**2. Anonymous Functions in Render:**
- **Location:** Various `.map()` callbacks, event handlers
- **Examples:**
  - Timeline items mapping (line ~3237)
  - Explore Goa items mapping (line ~3566)
  - Color picker mapping (line ~3401)
- **Recommendation:** Memoize callbacks with `useCallback` if they're passed as props, or keep inline if simple

**3. Un-memoized Components:**
- **Status:** Many components are already wrapped in `memo()` ✅
- **Examples:**
  - `FadeInWhenVisible` - ✅ memoized
  - `ParallaxWrapper` - ✅ memoized
  - `ImageModal` - ✅ memoized
  - `KidenaHouseCarousel` - ✅ memoized
- **Opportunity:** Check if large components like `Story`, `Celebration`, `Travel` should be memoized (if they receive stable props)

**4. State Management:**
- **Status:** State appears well-organized
- **Opportunity:** Consider if `activeSection` state causes unnecessary re-renders (currently used for DotNav highlighting)

**5. Large Inline Styles String:**
- **Location:** `styles` constant in `App.jsx` (lines 61-870+)
- **Size:** ~800+ lines of CSS
- **Recommendation:** Consider extracting to separate CSS file or CSS modules (though inline may be intentional for component portability)

### Bundle Size Opportunities

**1. Framer Motion:**
- **Usage:** Heavily used throughout (animations, parallax, gestures)
- **Size:** ~50KB+ gzipped
- **Recommendation:** Keep (essential for design), but ensure tree-shaking is working

**2. React Intersection Observer:**
- **Usage:** `useInView` hook in `FadeInWhenVisible`
- **Size:** Small
- **Recommendation:** Keep

**3. Lucide React Icons:**
- **Usage:** Many icons imported
- **Recommendation:** Ensure tree-shaking (only import used icons)
- **Status:** ✅ Icons imported individually (good)

**4. Canvas Confetti:**
- **Usage:** Dynamically imported (line 39) ✅
- **Recommendation:** Already optimized

### Render Performance

**1. Scroll Event Handlers:**
- **Location:** Active section tracking (line ~4817)
- **Implementation:** Uses Intersection Observer (good)
- **Status:** ✅ Efficient

**2. Parallax Calculations:**
- **Location:** `ParallaxWrapper` uses `useScroll` and `useTransform`
- **Status:** ✅ Uses Framer Motion's optimized scroll tracking
- **Note:** Already respects `prefers-reduced-motion`

**3. Image Carousel:**
- **Location:** `KidenaHouseCarousel`
- **Implementation:** Uses state for current index, transitions
- **Status:** ✅ Efficient

**4. Form Handling:**
- **Location:** RSVP form
- **Implementation:** Controlled inputs with `useState`
- **Status:** ✅ Standard React pattern

### Network Performance

**1. Font Loading:**
- **Status:** Fonts loaded via `<link>` tags in `index.html` ✅
- **Recommendation:** Consider `font-display: swap` if not already set

**2. Image Loading Strategy:**
- **Status:** ✅ Appropriate use of `loading="lazy"` and `loading="eager"`
- **Hero:** Eager (above fold) ✅
- **Others:** Lazy (below fold) ✅

**3. Code Splitting:**
- **Status:** ❌ No `React.lazy()` usage found
- **Opportunity:** Implement lazy loading for:
  - CookieChaseGame
  - KidenaHouse + FamilyItinerary (family mode sections)
  - ImageModal (if not already split)

---

## Summary

### Critical Issues (Must Fix)
1. ❌ **Missing H1** - No primary heading
2. ❌ **Missing `<main>`** - No main landmark
3. ❌ **Missing focus traps** - Modals and game don't trap focus
4. ❌ **Missing focus return** - Modals don't return focus on close
5. ❌ **Missing ARIA roles** - Modals need `role="dialog"` and `aria-modal="true"`

### High Priority (Should Fix)
1. ⚠️ **Heading hierarchy** - Ensure proper H1 → H2 → H3 structure
2. ⚠️ **Semantic nav/header** - Wrap navigation in `<nav>` and `<header>`
3. ⚠️ **Contrast issues** - Verify peach text on canvas meets WCAG AA
4. ⚠️ **Low opacity text** - Audit `/60` and `/50` opacity instances
5. ⚠️ **Form accessibility** - Add `aria-live` for RSVP feedback, `aria-describedby` for errors

### Medium Priority (Nice to Have)
1. 🔶 **Lazy loading** - CookieChaseGame, family mode sections
2. 🔶 **Skip link** - Add skip to main content
3. 🔶 **Image optimization** - Add `srcset` for responsive images
4. 🔶 **Component memoization** - Review large components for memo opportunities

### Low Priority (Optimization)
1. 🔹 **Inline styles** - Extract static style objects
2. 🔹 **Code splitting** - Further split if bundle size is an issue
3. 🔹 **Performance monitoring** - Add performance metrics

---

**Next Steps:**
1. Review this diagnosis
2. Approve the plan (to be created)
3. Implement fixes after approval







