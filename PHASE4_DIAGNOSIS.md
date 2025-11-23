# PHASE 4 – Visual Cohesion Diagnosis

## A. Alignment & Grid

### Max-Width Inconsistencies
**Issue:** Section containers use varying max-widths, creating visual misalignment:

- **Nav:** `max-w-6xl` (consistent baseline)
- **Hero:** `max-w-4xl` (narrower than nav)
- **Our Story:** `max-w-5xl` (between nav and hero)
- **Kidena House:** `max-w-7xl` (widest, breaks grid)
- **Family Itinerary:** `max-w-5xl`
- **The Celebration:** `max-w-6xl` (matches nav)
- **Dress Code:** `max-w-6xl`
- **Explore Goa:** `max-w-6xl`
- **Travel & Stay:** `max-w-5xl` (narrower than nav)
- **RSVP:** `max-w-3xl` (narrowest, intentional for form)
- **Footer:** `max-w-4xl` (narrower than nav)

**Impact:** Hero text block and Story content don't align with nav shell edges. Kidena House feels disconnected from the rest.

### Section Heading Alignment
**Issue:** Section headings use `text-center` but lack consistent left-edge alignment with content:

- All major sections use `SignboardHeading` (centered)
- Content cards within sections have varying left padding
- Story section photos alternate left/right, but text blocks don't align to a consistent left edge
- Travel & Stay cards have different internal padding (`pl-24` for ticket vs `p-8 md:p-10` for base camp)

**Impact:** Visual rhythm feels slightly off when scrolling; sections don't feel like one continuous document.

### Card Grid Gaps
**Issue:** Grid gaps vary across sections:

- **Story:** `gap-8 md:gap-12 lg:gap-16` (inconsistent responsive scaling)
- **Celebration:** `gap-12` (SPACE_GRID_LG)
- **Travel:** `gap-8` (SPACE_GRID_MD) with `lg:gap-12` override
- **Explore Goa:** `gap-8 md:gap-12`
- **FAQ:** `gap-6 md:gap-8`
- **Kidena House:** `gap-6 md:gap-8`

**Impact:** Vertical rhythm feels inconsistent; some sections feel tighter, others more spacious.

### Column Alignment
**Issue:** Story section grid items alternate order (`order-1 md:order-2`), but text blocks don't share a consistent left margin:

- Story text blocks have no explicit left padding/margin
- Celebration timeline has `pl-8 md:pl-12` but venue card has no matching offset
- Travel ticket has `pl-24` (for the GOA EXPRESS strip) but base camp has standard padding

**Impact:** When viewing on desktop, alternating layouts feel slightly unanchored.

---

## B. Card & Container Weight

### Border Thickness Inconsistencies
**Issue:** Cards use mixed border widths:

- **CARD_PRIMARY/SECONDARY:** `border` (1px default)
- **Kidena House cards:** `border-2` (2px) with colored borders (`border-[#D88D66]`, `border-[#EBBA9A]`)
- **Family Itinerary cards:** `border-2` (2px) with dynamic colors
- **Celebration venue photo:** `border-2 border-navy` (2px, heavier)
- **RSVP form radio buttons:** `border` (1px) but with `sketchy-border` class
- **Cookie & Bailey button:** `border-[3px]` (3px, heaviest)
- **Music player button:** `border-[3px]` (3px)

**Impact:** Some cards feel heavier/darker than their neighbors. Kidena House cards stand out more than intended.

### Shadow Strength Variations
**Issue:** Box shadows vary in intensity and color:

- **Hero event details card:** `0 8px 16px -2px rgba(216, 141, 102, 0.15)` (peach-tinted, soft)
- **Celebration venue card:** `0 8px 16px rgba(59, 47, 42, 0.1)` (ink-tinted, slightly different)
- **Kidena House cards:** `0 4px 6px -1px rgba(59, 47, 42, 0.08)` (lighter, ink-tinted)
- **Explore Goa cards:** `0 4px 6px -1px rgba(59, 47, 42, 0.08)` (matches Kidena)
- **FAQ cards:** `0 4px 6px -1px rgba(59, 47, 42, 0.08)` (matches Kidena)
- **Travel ticket:** `0 8px 16px rgba(59, 47, 42, 0.1)` (matches Celebration)
- **Travel base camp:** `0 8px 16px rgba(59, 47, 42, 0.1)` (matches Celebration)
- **Dress Code cards:** `shadow-sm` (Tailwind default, likely lighter)
- **Story photo frames:** `0 10px 15px -3px rgba(216, 141, 102, 0.1)` (peach-tinted, different intensity)

**Impact:** Some sections feel lighter (Kidena, Explore Goa, FAQ) while others feel more substantial (Hero, Celebration, Travel). The mix of peach-tinted vs ink-tinted shadows creates subtle inconsistency.

### Border Radius Consistency
**Status:** Generally consistent:
- **CARD_PRIMARY:** `rounded-2xl` (1rem)
- **CARD_SECONDARY:** `rounded-xl` (0.75rem)
- **Photo frames:** `sketchy-border` class (organic shape, CSS-defined)
- **Buttons:** `rounded-lg` or `rounded-full` (appropriate for interactive elements)

**Minor Issue:** Some cards override with inline styles or additional classes, but the base system is sound.

### Card Padding Variations
**Issue:** Card padding doesn't always match the CARD_PAD_* constants:

- **Hero event details:** Uses `CARD_PAD_MD md:CARD_PAD_LG` (responsive override)
- **Story photos:** `p-3` (smaller than CARD_PAD_SM)
- **Travel ticket:** `pl-24 pr-8 py-6 md:py-10` (custom, not using constants)
- **Travel base camp:** `CARD_PAD_LG` (correct)
- **Explore Goa:** `CARD_PAD_LG` (correct)
- **FAQ:** `CARD_PAD_MD` (correct)

**Impact:** Travel ticket feels cramped on the right side compared to base camp. Story photos feel tighter than other cards.

---

## C. Decorative System

### Doodle/Icon Distribution
**Current Usage:**

1. **Hero Section:**
   - Sun icon (top-left, `opacity-60`, `animate-float`)
   - Heart icon (bottom-right, `opacity-60`, `animate-float`)
   - Both hidden on mobile

2. **Story Section:**
   - No decorative icons (relies on photo frames with `sketchy-border`)

3. **Celebration Section:**
   - Palm tree icon in venue card (`SketchIcon type="palm"`)
   - Timeline icons: Heart, SketchIcon (wine), Music, SketchIcon (plate), Sun
   - Watercolor background (`watercolor-bg`)

4. **Kidena House:**
   - Large palm tree sketch (`w-96 h-96`, `opacity-5`, background decoration)
   - Icon circles: Home, Plate, Sun, Music (in feature cards)
   - Dotted background (`dotted-background`)

5. **Family Itinerary:**
   - Large palm tree sketch (`w-96 h-96`, `opacity-5`, background decoration)
   - Icon circles: Sun, Heart (in timeline cards)

6. **Travel & Stay:**
   - Anchor icon (ticket card, `opacity-30`)
   - No other decorative elements

7. **Dress Code:**
   - Sun icon (in "Beach Formal" card)
   - Palette icon (in "Palette Notes" card)
   - No floating doodles

8. **Explore Goa:**
   - No decorative icons (relies on card structure)

9. **RSVP:**
   - Heart icon (in "Count Me In" radio)
   - X icon (in "Cannot Attend" radio)
   - No floating doodles

10. **Footer:**
    - Circular border decorations (`opacity-10`, background)
    - No icon doodles

**Issues:**

1. **Palm tree overuse:** Appears in Kidena House and Family Itinerary as large background elements. Could feel repetitive.

2. **Inconsistent icon sizes:** 
   - Hero: `w-12 h-12` (Sun), `w-8 h-8` (Heart)
   - Celebration timeline: `w-5 h-5` (inside circles)
   - Celebration venue: `w-8 h-8 md:w-10 md:h-10` (palm)
   - Kidena House feature cards: `w-6 h-6`
   - Dress Code: `w-5 h-5`

3. **Missing decorative anchors:** Story section has no floating doodles, making it feel more "serious" than Hero/Celebration. Explore Goa and RSVP also lack decorative elements, which could help tie them to the playful stationery feel.

4. **Washi tape / sketchy borders:** Used consistently for photo frames and some buttons, but not applied to section dividers or other connective elements.

5. **Dotted background:** Only used in Kidena House. Could be a signature pattern for family-mode sections, but currently feels like a one-off.

### Icon Circle Consistency
**Issue:** Icon circles vary in size and styling:

- **Celebration timeline:** `w-14 h-14 md:w-16 md:h-16` with `border-3` (custom, not Tailwind)
- **Kidena House:** `w-12 h-12` with colored backgrounds
- **Dress Code:** `w-10 h-10` with colored backgrounds
- **Explore Goa:** `w-12 h-12 md:w-14 md:h-14` with `border-2`

**Impact:** Icon circles don't feel like a unified system; they're sized contextually rather than systematically.

---

## D. Section "Set Pieces"

### Hero Section
**Focal Element:** Hero image + "Shubs & Alysha" heading with underline SVG

**Current State:**
- Image is `max-w-xl` centered
- Text block is `max-w-2xl` centered
- Event details card uses `CARD_SECONDARY` with peach-tinted shadow
- Two floating doodles (Sun, Heart) provide visual interest

**Issues:**
- Hero container is `max-w-4xl` while nav is `max-w-6xl`, so edges don't align
- Event details card feels slightly disconnected from the main hero content (spacing could be tighter)
- Floating doodles are hidden on mobile, which is fine, but the section feels less "set piece" on small screens

**Breathing Room:** Adequate, but the section could benefit from slightly more intentional spacing between image and text.

### Our Story Section
**Focal Element:** Alternating photo + text blocks (4 moments: 2015, 2018, 2018-2025, 2025)

**Current State:**
- Photos use `sketchy-border` with subtle rotations
- Text blocks have date badges (colored chips)
- No floating decorative elements
- Grid alternates left/right on desktop

**Issues:**
- No single "hero moment" - all four moments feel equal in weight
- Photos are consistently sized (`aspectRatio: '3 / 4'`) but text blocks vary in length, creating uneven visual rhythm
- Missing a decorative anchor (like a small doodle or washi tape element) to tie the section together

**Breathing Room:** Good vertical spacing (`space-y-20 md:space-y-28 lg:space-y-32`), but the alternating layout can feel slightly chaotic on first scroll.

### The Celebration Section
**Focal Element:** Venue card (left) + Timeline (right)

**Current State:**
- Venue card has photo, palm tree icon, and description
- Timeline has 6 events with icon circles
- Watercolor background provides subtle texture

**Issues:**
- Venue card and timeline feel balanced, but the venue card's `rotate-1` and parallax effects might compete with the timeline's visual weight
- Timeline icon circles are prominent but the connecting line is implied (no visual line between circles)
- The section feels like two equal halves rather than one dominant focal point

**Breathing Room:** Good. The grid layout (`lg:grid-cols-2`) provides clear separation.

### Travel & Stay Section
**Focal Element:** Two-card pair (Boarding Pass ticket + Base Camp notepad)

**Current State:**
- Ticket card has distinctive left strip (`w-16 bg-[#D88D66]`) with "GOA EXPRESS" text
- Base camp card has gradient background and subtle decorative blurs
- Both cards have hover effects

**Issues:**
- **This is the strongest "set piece"** - the ticket design is unique and memorable
- Base camp card is hidden on mobile (`hidden md:block`), which breaks the pair on small screens
- Ticket card's custom padding (`pl-24`) creates visual weight, but the base camp card's standard padding feels lighter in comparison
- The two cards don't feel like a unified "moment" - they're adjacent but not visually connected

**Breathing Room:** Good spacing between cards, but they could benefit from a subtle visual connector (like a dashed line or small icon) to reinforce they're a pair.

### RSVP Section
**Focal Element:** Postcard-form hybrid

**Current State:**
- Uses `Postcard` component wrapper
- Form is `max-w-3xl` (narrower than other sections, intentional)
- Radio buttons use `sketchy-border`
- Success/error modals are postcard-styled

**Issues:**
- The form feels functional but not as "set piece" as Travel & Stay
- Missing a decorative anchor (like a small stamp icon or washi tape corner) to reinforce the postcard metaphor
- The section divider (`SectionDivider`) provides separation, but the RSVP section itself doesn't have a distinctive visual moment

**Breathing Room:** Adequate, but the section could use a subtle visual flourish to make it feel more like a crafted invitation card.

### Other Sections
- **Dress Code:** Two-card layout (wardrobe image + guidance cards). Feels balanced but not a "set piece."
- **Explore Goa:** Two-column collapsible cards. Functional but not visually distinctive.
- **FAQ:** Grid of question cards. Consistent but not a focal moment.
- **Kidena House / Family Itinerary:** Feature cards with photos. Informative but not "set piece" level.

---

## Summary of Visual Cohesion Issues

### High Priority
1. **Max-width alignment:** Hero (`max-w-4xl`) and Story (`max-w-5xl`) don't align with nav (`max-w-6xl`). Kidena House (`max-w-7xl`) breaks the grid entirely.
2. **Card weight inconsistency:** Kidena House and Family Itinerary use `border-2` while others use `border` (1px). Shadow strengths vary (peach-tinted vs ink-tinted, different intensities).
3. **Travel & Stay set piece:** The ticket/base camp pair is strong but could be more visually connected. Base camp hidden on mobile breaks the pair.

### Medium Priority
4. **Decorative system:** Palm trees appear in multiple sections (could feel repetitive). Icon sizes vary. Story, Explore Goa, and RSVP lack decorative anchors.
5. **Section heading alignment:** Headings are centered but content blocks don't share consistent left-edge alignment.
6. **Grid gap consistency:** Gaps vary (`gap-6` to `gap-16`), affecting vertical rhythm.

### Low Priority
7. **Card padding:** Travel ticket uses custom padding that doesn't match base camp. Story photos use `p-3` (smaller than system).
8. **RSVP postcard feel:** Could use a subtle decorative element (stamp, washi tape corner) to reinforce the stationery metaphor.

---

**Next Step:** Create a Plan with specific, minimal refinements to address these issues while maintaining visual integrity.


