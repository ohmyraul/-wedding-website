# PHASE 4 – Visual Cohesion Plan

## 1. Alignment & Grid

### Normalize Content Container Widths to Nav Baseline

**Components:** Hero, Story, Celebration, Travel & Stay, Explore Goa, RSVP, Footer

**Current State:**
- Nav: `max-w-6xl`
- Hero: `max-w-4xl`
- Story: `max-w-5xl`
- Kidena House: `max-w-7xl`
- Family Itinerary: `max-w-5xl`
- Celebration: `max-w-6xl` ✓
- Dress Code: `max-w-6xl` ✓
- Explore Goa: `max-w-6xl` ✓
- Travel: `max-w-5xl`
- RSVP: `max-w-3xl` (intentional for form)
- Footer: `max-w-4xl`

**Proposed Changes:**

1. **Hero** (`Hero` component, line ~1492):
   - Change `max-w-4xl` → `max-w-6xl`
   - **Why:** Aligns hero content edges with nav shell, creating visual continuity. The centered content within will still feel balanced.

2. **Story** (`Story` component, line ~1587):
   - Change `max-w-5xl` → `max-w-6xl`
   - **Why:** Matches nav and other major sections. Story photos and text will have more breathing room while staying aligned.

3. **Kidena House** (`KidenaHouse` component, line ~2276):
   - Change `max-w-7xl` → `max-w-6xl`
   - **Why:** Prevents this section from feeling disconnected. The 2x2 feature grid will still work perfectly within `max-w-6xl`.

4. **Family Itinerary** (`FamilyItinerary` component, line ~2356):
   - Change `max-w-5xl` → `max-w-6xl`
   - **Why:** Consistent with other sections. Timeline cards will have consistent alignment.

5. **Travel & Stay** (`Travel` component, line ~2980):
   - Change `max-w-5xl` → `max-w-6xl`
   - **Why:** Aligns with nav. The ticket/base camp pair will have more space and feel more integrated.

6. **Footer** (`Footer` component, line ~3687):
   - Change `max-w-4xl` → `max-w-6xl`
   - **Why:** Creates visual bookend matching the nav. Content will still feel centered and balanced.

**Keep as-is:**
- RSVP: `max-w-3xl` (intentional narrow width for form focus)

---

### Standardize Grid Gaps Using Existing Constants

**Components:** Story, Celebration, Travel, Explore Goa, FAQ, Kidena House

**Current State:**
- Story: `gap-8 md:gap-12 lg:gap-16` (inconsistent scaling)
- Celebration: `gap-12` (SPACE_GRID_LG)
- Travel: `gap-8` (SPACE_GRID_MD) with `lg:gap-12` override
- Explore Goa: `gap-8 md:gap-12`
- FAQ: `gap-6 md:gap-8`
- Kidena House: `gap-6 md:gap-8`

**Proposed Changes:**

1. **Story** (`Story` component, lines ~1599, 1641, 1683, 1742):
   - Change `gap-8 md:gap-12 lg:gap-16` → `gap-8 md:gap-12` (use SPACE_GRID_MD + SPACE_GRID_LG)
   - **Why:** Removes the `lg:gap-16` outlier. `gap-12` at large screens is sufficient and matches other sections.

2. **Travel & Stay** (`Travel` component, line ~2992):
   - Remove `lg:gap-12` override, keep `gap-8` (SPACE_GRID_MD)
   - **Why:** The ticket/base camp pair works well with `gap-8`. No need for larger gap at lg breakpoint.

3. **FAQ** (`QnA` component, line ~3272):
   - Change `gap-6 md:gap-8` → `gap-8` (SPACE_GRID_MD consistently)
   - **Why:** Slightly more breathing room between question cards. `gap-6` feels tight.

4. **Kidena House** (`KidenaHouse` component, line ~2286):
   - Change `gap-6 md:gap-8` → `gap-8` (SPACE_GRID_MD consistently)
   - **Why:** Matches FAQ and other card grids. Creates consistent vertical rhythm.

**Keep as-is:**
- Celebration: `gap-12` (SPACE_GRID_LG) - appropriate for the venue/timeline split
- Explore Goa: `gap-8 md:gap-12` - works well for the two-column layout

---

### Section Heading Left-Edge Alignment

**Components:** All sections with `SignboardHeading`

**Current State:**
- Headings are centered (`text-center` in `SignboardHeading`)
- Content blocks within sections have varying left padding/margins

**Proposed Changes:**

1. **Story Section** (`Story` component, line ~1590):
   - Ensure the `SignboardHeading` container and the first text block share the same left padding context
   - **Why:** Even though heading is centered, the container should align with the content grid below it.

2. **Celebration Section** (`Celebration` component, line ~2490):
   - Verify heading container aligns with the grid container below
   - **Why:** The venue card and timeline should feel connected to the heading above.

**Note:** Most sections already have proper alignment via `FadeInWhenVisible` wrappers with `max-w-*` containers. This is a verification pass rather than major changes.

---

## 2. Card & Container Weight

### Border Thickness Standardization

**Components:** All card components using CARD_PRIMARY, CARD_SECONDARY, Kidena House, Family Itinerary

**Current State:**
- CARD_PRIMARY/SECONDARY: `border` (1px default)
- Kidena House cards: `border-2` (2px) with colored borders
- Family Itinerary cards: `border-2` (2px) with dynamic colors
- Celebration venue photo: `border-2 border-navy` (2px)
- Cookie & Bailey button: `border-[3px]` (3px)
- Music player button: `border-[3px]` (3px)

**Proposed Rule:**
- **CARD_PRIMARY/SECONDARY:** Keep `border` (1px) - these are narrative/content cards
- **PHOTO frames (sketchy-border):** Keep organic shape, no explicit border class needed
- **Feature cards (Kidena House, Family Itinerary):** Use `border` (1px) instead of `border-2`
- **Interactive buttons (Cookie & Bailey, Music player):** Keep `border-[3px]` - these are UI controls, not content cards
- **Celebration venue photo:** Keep `border-2` - this is a key visual anchor

**Proposed Changes:**

1. **Kidena House feature cards** (`KidenaHouse` component, lines ~2288, 2300, 2312, 2324):
   - Change `border-2 border-[#D88D66]` → `border border-[#D88D66]`
   - Change `border-2 border-[#EBBA9A]` → `border border-[#EBBA9A]`
   - **Why:** Reduces visual weight to match other CARD_SECONDARY cards. The colored borders will still provide distinction without feeling heavy.

2. **Family Itinerary cards** (`FamilyItinerary` component, line ~2421):
   - Change `border-2` → `border` (keep dynamic `borderColor` via style)
   - **Why:** Matches Kidena House cards. The colored borders provide enough visual interest.

**Keep as-is:**
- Celebration venue photo `border-2` - key focal element
- Interactive buttons `border-[3px]` - appropriate for UI controls

---

### Shadow Strength Standardization

**Components:** All cards with inline `boxShadow` styles

**Current State:**
- Mix of peach-tinted shadows (`rgba(216, 141, 102, ...)`) and ink-tinted shadows (`rgba(59, 47, 42, ...)`)
- Intensities vary: `0.08`, `0.1`, `0.15`

**Proposed Rule:**
- **Hero/Key Info cards:** Use peach-tinted shadow (`rgba(216, 141, 102, 0.15)`) - these are primary focal points
- **Narrative/Content cards:** Use ink-tinted shadow (`rgba(59, 47, 42, 0.08)` or `0.1`) - these are secondary
- **Photo frames:** Keep existing peach-tinted shadow for warmth

**Proposed Changes:**

1. **Celebration venue card** (`Celebration` component, line ~2503):
   - Change `boxShadow: '0 8px 16px rgba(59, 47, 42, 0.1)'` → `boxShadow: '0 8px 16px rgba(216, 141, 102, 0.15)'`
   - **Why:** This is a key focal element (venue photo + info). Peach-tinted shadow matches Hero event details card and creates visual hierarchy.

2. **Travel ticket card** (`Travel` component, line ~3001):
   - Change `boxShadow: '0 8px 16px rgba(59, 47, 42, 0.1)'` → `boxShadow: '0 8px 16px rgba(216, 141, 102, 0.15)'`
   - **Why:** This is a primary set piece. Peach-tinted shadow reinforces its importance.

3. **Travel base camp card** (`Travel` component, line ~3094):
   - Change `boxShadow: '0 8px 16px rgba(59, 47, 42, 0.1)'` → `boxShadow: '0 8px 16px rgba(216, 141, 102, 0.15)'`
   - **Why:** Matches ticket card. The pair should feel unified.

**Keep as-is:**
- Hero event details: Already uses peach-tinted shadow ✓
- Kidena House, Explore Goa, FAQ: Keep lighter ink-tinted shadows (they're informational, not focal)
- Story photo frames: Keep existing peach-tinted shadow

---

### Card Padding Normalization

**Components:** Travel ticket, Story photos, all cards using CARD_PAD_*

**Current State:**
- Travel ticket: `pl-24 pr-8 py-6 md:py-10` (custom)
- Story photos: `p-3` (smaller than CARD_PAD_SM)
- Most other cards: Use CARD_PAD_SM/MD/LG correctly

**Proposed Changes:**

1. **Story photo frames** (`Story` component, lines ~1602, 1663, 1685, 1766):
   - Keep `p-3` as-is
   - **Why:** Photo frames are decorative containers, not content cards. The smaller padding is appropriate for the `sketchy-border` aesthetic.

2. **Travel ticket** (`Travel` component, line ~3011):
   - Keep `pl-24 pr-8 py-6 md:py-10` as-is
   - **Why:** The `pl-24` is essential for the "GOA EXPRESS" strip design. This is intentional personality, not a system violation.

**Verification Pass:**
- Ensure all other cards use CARD_PAD_SM/MD/LG constants where appropriate
- No changes needed - system is already well-applied

---

## 3. Decorative System

### Palm Tree Usage Rationalization

**Current State:**
- Kidena House: Large background palm (`w-96 h-96`, `opacity-5`)
- Family Itinerary: Large background palm (`w-96 h-96`, `opacity-5`)
- Celebration: Small palm icon in venue card (`w-8 h-8 md:w-10 md:h-10`)

**Proposed Rule:**
- **Large background palms:** Use only in **one** family-mode section (Kidena House OR Family Itinerary, not both)
- **Small palm icons:** Keep in Celebration venue card (this is contextual, not decorative)

**Proposed Changes:**

1. **Family Itinerary** (`FamilyItinerary` component, line ~2352):
   - Remove the large background palm tree (`SketchIcon type="palm"` with `w-96 h-96`)
   - **Why:** Kidena House already has the large palm. Having it in both sections feels repetitive. Family Itinerary can rely on the dotted background and icon circles for decoration.

**Keep as-is:**
- Kidena House large palm: Keep as the signature family-mode decorative element
- Celebration small palm icon: Keep (contextual, not decorative background)

---

### Icon Size System Standardization

**Current State:**
- Hero: `w-12 h-12` (Sun), `w-8 h-8` (Heart)
- Celebration timeline: `w-5 h-5` (inside circles)
- Celebration venue: `w-8 h-8 md:w-10 md:h-10` (palm)
- Kidena House feature cards: `w-6 h-6`
- Dress Code: `w-5 h-5`
- Explore Goa: `w-12 h-12 md:w-14 md:h-14` (in circles)

**Proposed System:**
- **Small UI icons (labels, bullets, feature cards):** `w-5 h-5` or `w-6 h-6` (consistent)
- **Hero/Decorative icons (floating doodles):** `w-8 h-8` to `w-12 h-12` (can vary for visual interest)
- **Icon circles (containers):** Size the circle, then use `w-5 h-5` or `w-6 h-6` icons inside

**Proposed Changes:**

1. **Kidena House feature card icons** (`KidenaHouse` component, lines ~2291, 2303, 2315, 2327):
   - Change `w-6 h-6` → `w-5 h-5`
   - **Why:** Matches Dress Code icons. Creates consistency for "feature card" icon size.

2. **Celebration venue palm icon** (`Celebration` component, line ~2531):
   - Change `w-8 h-8 md:w-10 md:h-10` → `w-6 h-6 md:w-8 h-8`
   - **Why:** Slightly smaller, more proportional to the card. Still responsive but less jumpy.

3. **Explore Goa icon circles** (`ExploreGoa` component, line ~2917):
   - Change `w-12 h-12 md:w-14 md:h-14` → `w-10 h-10 md:w-12 h-12`
   - Change icon inside from `w-5 h-5` → `w-5 h-5` (keep, but verify)
   - **Why:** Slightly smaller circles, more consistent with other icon containers.

**Keep as-is:**
- Hero floating icons: `w-12 h-12` and `w-8 h-8` - appropriate variation for decorative elements
- Celebration timeline icons: `w-5 h-5` - correct for small UI icons
- Dress Code icons: `w-5 h-5` - correct for small UI icons

---

### Missing Decorative Anchors

**Current State:**
- Story: No floating decorative elements
- Explore Goa: No decorative elements
- RSVP: No decorative elements (beyond form UI)

**Proposed Rule:**
- Add **one subtle decorative element** per "bare" section
- Use existing visual language (Sun, Heart, Music, or small SketchIcon)
- Keep it minimal and palette-consistent

**Proposed Changes:**

1. **Story Section** (`Story` component, after line ~1591):
   - Add one small floating Heart icon (`w-6 h-6`, `opacity-40`, `animate-float`) positioned near the "2015" moment
   - Use `ParallaxWrapper` with `offset={20}` and `className="absolute top-32 left-8 hidden md:block"`
   - **Why:** Ties Story to Hero's decorative language. Very subtle, won't compete with photos.

2. **Explore Goa Section** (`ExploreGoa` component, after line ~2854):
   - Add one small floating Anchor icon (`w-6 h-6`, `opacity-40`, `animate-float`) positioned near top-right
   - Use `ParallaxWrapper` with `offset={-20}` and `className="absolute top-20 right-8 hidden md:block"`
   - **Why:** Reinforces the "travel/exploration" theme. Matches the Anchor icon already used in Travel ticket card.

3. **RSVP Section** (`RSVP` component, after line ~3438):
   - Add one small floating Heart icon (`w-6 h-6`, `opacity-40`, `animate-float`) positioned near the form heading
   - Use `ParallaxWrapper` with `offset={15}` and `className="absolute top-16 right-12 hidden md:block"`
   - **Why:** Reinforces the "love/invitation" theme. Very subtle, won't distract from the form.

**Keep hidden on mobile:** All decorative anchors should use `hidden md:block` to maintain clean mobile experience.

---

## 4. Section Set Pieces

### Hero Section Refinements

**Component:** `Hero` (line ~1477)

**Current State:**
- Image: `max-w-xl` centered
- Text block: `max-w-2xl` centered
- Event details card: `max-w-2xl` with `CARD_SECONDARY` and peach shadow
- Floating doodles: Sun (top-left), Heart (bottom-right)

**Proposed Changes:**

1. **Increase spacing between text block and event details card:**
   - Change `mt-6 md:mt-8 lg:mt-10` → `mt-8 md:mt-10 lg:mt-12`
   - **Why:** Gives the "Shubs & Alysha" heading more breathing room before the event details card. Creates clearer hierarchy.

2. **Slightly increase event details card visual weight:**
   - Already has peach-tinted shadow ✓
   - Verify the card feels distinct from the text above (already good)

**No layout changes:** Keep image/text order and responsive behavior.

---

### Travel & Stay Section Refinements

**Component:** `Travel` (line ~2974)

**Current State:**
- Ticket card: Custom `pl-24` padding, peach shadow, "GOA EXPRESS" strip
- Base camp card: Standard `CARD_PAD_LG`, ink shadow, gradient background
- Grid: `gap-8` (SPACE_GRID_MD)

**Proposed Changes:**

1. **Unify shadow treatment (already in Card & Weight section):**
   - Change base camp shadow to peach-tinted (matches ticket)
   - **Why:** Makes the pair feel more unified. Both are primary set pieces.

2. **Slightly increase grid gap for the pair:**
   - Change `gap-8` → `gap-10 md:gap-12`
   - **Why:** Gives the ticket/base camp pair more breathing room. They're the focal moment of this section.

3. **Add subtle visual connector (optional, minimal):**
   - Add a small dashed line or dot between the two cards (CSS `::after` on ticket card, positioned to the right)
   - Use `border-dashed border-[#D4CDC2]` with `opacity-30`
   - **Why:** Reinforces they're a pair without adding clutter. Very subtle.

**No layout changes:** Keep ticket/base camp order, keep base camp hidden on mobile.

---

### RSVP Section Refinements

**Component:** `RSVP` (line ~3429)

**Current State:**
- Postcard wrapper
- Form: `max-w-3xl` (narrow, intentional)
- Radio buttons: `sketchy-border`
- Section divider above

**Proposed Changes:**

1. **Add subtle decorative anchor (already in Decorative System section):**
   - Add small floating Heart icon near heading
   - **Why:** Reinforces postcard/invitation feel without distracting from form.

2. **Slightly increase spacing above form:**
   - Change `mb-10 md:mb-12` → `mb-12 md:mb-14`
   - **Why:** Gives the "R.S.V.P." heading more breathing room. Creates clearer separation from divider above.

3. **Verify postcard wrapper visual weight:**
   - Ensure `Postcard` component has appropriate shadow/border
   - **Why:** The form should feel like a crafted invitation card, not a generic form.

**No layout changes:** Keep form structure, keep modals as-is.

---

### Story Section Refinements

**Component:** `Story` (line ~1583)

**Current State:**
- Four moments: 2015, 2018, 2018-2025, 2025
- All moments have equal visual weight
- Alternating photo/text layout

**Proposed Changes:**

1. **Slightly emphasize "The Proposal" (2025) moment:**
   - Increase the date badge size: Change `px-3 md:px-4` → `px-4 md:px-5` (only for the 2025 badge)
   - Increase photo frame shadow on hover: Already has hover effect, verify it's slightly more pronounced
   - **Why:** The proposal is the narrative climax. A subtle size increase in the badge makes it feel slightly more important without changing layout.

2. **Add decorative anchor (already in Decorative System section):**
   - Add small floating Heart icon near "2015" moment
   - **Why:** Ties Story to Hero's decorative language. Very subtle.

**No layout changes:** Keep alternating layout, keep all four moments visible.

---

## Summary of Proposed Changes

### Alignment & Grid (6 changes)
1. Hero: `max-w-4xl` → `max-w-6xl`
2. Story: `max-w-5xl` → `max-w-6xl`
3. Kidena House: `max-w-7xl` → `max-w-6xl`
4. Family Itinerary: `max-w-5xl` → `max-w-6xl`
5. Travel: `max-w-5xl` → `max-w-6xl`
6. Footer: `max-w-4xl` → `max-w-6xl`
7. Story grid gaps: Remove `lg:gap-16`, keep `gap-8 md:gap-12`
8. Travel grid gap: Remove `lg:gap-12` override
9. FAQ grid gap: `gap-6 md:gap-8` → `gap-8`
10. Kidena House grid gap: `gap-6 md:gap-8` → `gap-8`

### Card & Weight (5 changes)
1. Kidena House cards: `border-2` → `border`
2. Family Itinerary cards: `border-2` → `border`
3. Celebration venue card shadow: Ink-tinted → Peach-tinted
4. Travel ticket shadow: Ink-tinted → Peach-tinted
5. Travel base camp shadow: Ink-tinted → Peach-tinted

### Decorative System (6 changes)
1. Remove Family Itinerary large palm tree
2. Kidena House feature icons: `w-6 h-6` → `w-5 h-5`
3. Celebration venue palm: `w-8 h-8 md:w-10 md:h-10` → `w-6 h-6 md:w-8 h-8`
4. Explore Goa icon circles: `w-12 h-12 md:w-14 md:h-14` → `w-10 h-10 md:w-12 h-12`
5. Add Story floating Heart icon
6. Add Explore Goa floating Anchor icon
7. Add RSVP floating Heart icon

### Set Pieces (4 changes)
1. Hero: Increase spacing before event details card
2. Travel: Increase grid gap for ticket/base camp pair
3. Travel: Add subtle visual connector (optional)
4. RSVP: Increase spacing above form
5. Story: Slightly emphasize "The Proposal" badge size

---

**Total: ~22 minimal refinements across 4 categories**

All changes maintain existing layout, structure, and responsive behavior. No new components, breakpoints, or visual styles introduced.


