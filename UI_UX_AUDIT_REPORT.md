# Wedding Website UI/UX Audit Report

**Date:** Generated from codebase analysis  
**Scope:** Single-page wedding website (`src/App.jsx` and `src/components/*`)  
**Purpose:** Structured design audit for UX review

---

## 1. Sections & Layout

### Visual Order of Sections

1. **Navigation Bar** (`Nav` component, line 1022)
   - Layout: Horizontal pill-shaped nav bar (rounded-full, `border-radius: 999px`)
   - Components: Logo, menu items, family mode toggle
   - Visual motif: Floating nav with gradient background, sketchy border

2. **Hero Section** (`Hero`, line 1344, `id="hero"`)
   - Layout: Single-column centered, responsive flex (photo/text order swaps on mobile)
   - Components: 
     - Hero image (max-w-xl, aspect ratio constrained)
     - Main title "S&A" (4rem/5rem/6rem responsive)
     - Subtitle "Shubs & Alysha"
     - Event details card (sketchy-border, rounded-lg/xl)
     - Countdown timer card
   - Visual motifs: Watercolor background, floating decorative icons (Sun, Heart), scroll indicator arrow

3. **The Celebration** (`Celebration`, line 3031, `id="the-celebration"`)
   - Layout: Two-column grid (lg:grid-cols-2), left side card, right side timeline
   - Components:
     - Venue card (sketchy-border, gradient bg, image wrapper)
     - Vertical timeline with circular icon nodes
     - Action buttons (Calendar, Maps)
   - Visual motifs: Watercolor background (inverted), sketchy borders, timeline circles

4. **Travel & Stay** (`Travel`, line 3522, `id="travel"`)
   - Layout: Two-column grid (md:grid-cols-2)
   - Components:
     - "Boarding Pass" ticket-style card (perforated edge visual, left border accent)
     - "Base Camp" notepad-style card (rounded-[28px], gradient bg)
     - Hotel recommendations list (when not family mode)
   - Visual motifs: Ticket perforation effect, dashed borders, anchor icon decoration

5. **Kidena House** (`KidenaHouse`, line 2818, `id="kidena-house"`) - *Family mode only*
   - Layout: Single column with 2x2 feature grid
   - Components:
     - Image carousel (with navigation arrows)
     - Four feature cards (The House, No Cooking, Spa, Keep Busy)
   - Visual motifs: Dotted background pattern, sketchy borders

6. **Family Itinerary** (`FamilyItinerary`, line 2897, `id="family-itinerary"`) - *Family mode only*
   - Layout: Single column timeline
   - Components:
     - Day cards with time slots
     - Color-coded event items
   - Visual motifs: Timeline structure, color-coded events

7. **RSVP** (`RSVP`, line 3871, `id="rsvp"`)
   - Layout: Single column, centered form
   - Components:
     - Postcard-style form container
     - Form inputs (text, email, phone, select, textarea)
     - Attendance toggle buttons
     - Success/error modals
   - Visual motifs: Postcard component, sketchy borders

8. **Dress Code** (`DressCode`, line 3203, `id="dress-code"`)
   - Layout: Two-column grid (md:grid-cols-2, lg:grid-cols-[0.95fr,1.05fr])
   - Components:
     - Wardrobe inspiration image
     - "Beach Formal" guidance card
     - "Palette Notes" color swatches (3x1 grid)
   - Visual motifs: Rounded image containers, color palette circles

9. **Our Story** (`Story`, line 1458, `id="our-story"`)
   - Layout: Alternating two-column grid (md:grid-cols-2)
   - Components:
     - Photo frames with images (rotated, sketchy borders)
     - Year tags (rotated pills: 2015, July 2018, 2018-2025, January 6, 2025)
     - Story text blocks
   - Visual motifs: Photo frames with rotation, year badge pills, sepia image effects

10. **Explore Goa** (`ExploreGoa`, line 3346, `id="explore-goa"`)
    - Layout: Two-column grid (md:grid-cols-2), collapsible on mobile
    - Components:
      - Recommendation cards (North Goa, South Goa)
      - Expandable item lists with icons
      - Icon circles (wine, plate, sun, music)
    - Visual motifs: Collapsible sections, icon-based categorization

11. **FAQ** (`QnA`, line 3788, `id="q-a"`)
    - Layout: Two-column grid (md:grid-cols-2), last item spans full width
    - Components:
      - Question cards with "?" prefix
      - "Real Questions?" contact card (full-width, gradient bg)
    - Visual motifs: Rotated cards (rotate-1), question mark accents

12. **Footer** (`Footer`, line 4215, `id="footer"`)
    - Layout: Single column, centered
    - Components:
      - Closing message text
      - Countdown timer
      - "Cookie & Bailey" button (opens game)
      - Bottom credits
    - Visual motifs: Decorative circles, gradient background

### Sticky/Floating Controls

- **Dot Navigation** (`DotNav`, line 4587): Vertical dot indicators (xl screens only)
- **Floating RSVP Button** (`FloatingRSVPButton`, line 4374): Fixed bottom-right button
- **Music Player** (`MusicPlayer`, line 4293): Floating audio controls
- **Floating Decorative Elements**: Palm tree, music notes (background animations)

---

## 2. Typography System

### Font Families

- **Primary Body**: `'Inter', sans-serif` (line 133)
- **Headings/Handwritten**: `'Crimson Pro', serif` (line 147) - applied via `.font-hand`
- **Script/Decorative**: `'Kalam', cursive` (line 161) - applied via `.font-script`
- **Monospace**: System mono (for countdown numbers)

### Font Sizes & Hierarchy

#### H1 / Main Hero Title
- **Size**: `4rem` (64px) mobile → `5rem` (80px) md → `6rem` (96px) lg
- **Weight**: 600 (default), 700 with `.font-bold`
- **Line-height**: `0.9` (tight)
- **Usage**: Hero "S&A" logo (line 1391)
- **Font**: Crimson Pro (font-hand)

#### H2 / Section Headings
- **Size**: `text-2xl` (1.5rem/24px) → `text-3xl` (1.875rem/30px) md → `text-5xl` (3rem/48px) lg
- **Weight**: 600 default, 700 with `.font-bold`
- **Line-height**: Default (1.5)
- **Usage**: "Shubs & Alysha" subtitle (line 1402), section headings
- **Font**: Crimson Pro (font-hand)

#### H3 / Card Titles
- **Size**: `text-2xl` (1.5rem/24px) → `text-3xl` (1.875rem/30px) md → `text-4xl` (2.25rem/36px) lg
- **Weight**: 700 (font-bold)
- **Line-height**: Default
- **Usage**: Story section titles (line 1492), Celebration date (line 3076), card headings
- **Font**: Crimson Pro (font-hand)

#### H4 / Subsection Titles
- **Size**: `text-xl` (1.25rem/20px) → `text-2xl` (1.5rem/24px) md
- **Weight**: 700 (font-bold)
- **Line-height**: Default
- **Usage**: FAQ questions (line 3826), timeline events (line 3150)
- **Font**: Crimson Pro (font-hand)

#### Body Text
- **Size**: `text-base` (1rem/16px) → `text-lg` (1.125rem/18px) md → `text-xl` (1.25rem/20px) lg
- **Weight**: 400 (regular)
- **Line-height**: `leading-relaxed` (1.625)
- **Usage**: Story paragraphs (line 1494), card descriptions, form labels
- **Font**: Inter (default)

#### Small Labels/Badges
- **Size**: `text-xs` (0.75rem/12px) → `text-sm` (0.875rem/14px) md
- **Weight**: 600 (semibold) or 700 (bold)
- **Line-height**: Default
- **Usage**: Countdown labels (line 1327), uppercase tracking labels, year tags (line 1490)
- **Font**: Crimson Pro (font-hand) or Inter

#### Extra Small / Micro Text
- **Size**: `text-xs` (0.75rem/12px)
- **Weight**: 400-600
- **Usage**: Footer credits, form helper text, tracking labels

### Typography Inconsistencies

1. **Multiple "heading" sizes for same purpose**: 
   - Section headings vary: `text-2xl`, `text-3xl`, `text-4xl`, `text-5xl` all used for section-level content
   - Card titles range from `text-2xl` to `text-4xl` without clear hierarchy

2. **Random font-weight usage**:
   - Some body text uses `font-semibold` (line 1424) while others use `font-medium` (line 1429)
   - Inconsistent bold usage in similar contexts

3. **Line-height variations**:
   - Hero title uses `leading-[0.9]` (very tight)
   - Body uses `leading-relaxed` (1.625)
   - Some headings use default (1.5)
   - No consistent system

4. **Font family mixing**:
   - Countdown numbers use `font-mono` (line 1324) while labels use `font-hand`
   - Some buttons use `font-hand`, others use default Inter

---

## 3. Component Patterns

### Buttons

#### Primary Buttons
- **Background**: `bg-[#D88D66]` (deep peach)
- **Text**: White
- **Border**: `sketchy-border` class (hand-drawn style)
- **Border radius**: `rounded-lg` (0.5rem)
- **Shadow**: `shadow-lg` (default black)
- **Padding**: `px-8 py-3` or `px-6 py-2`
- **Hover**: `hover:bg-[#C97452]` (darker), `hover:scale-105`
- **Usage**: Game buttons, form submit (when styled as primary)
- **Location**: Lines 2202, 2222, 2229

#### Secondary Buttons
- **Background**: `bg-white/90` or `bg-[#FDF9F4]`
- **Text**: `text-navy` (ink color)
- **Border**: `sketchy-border border border-[#D88D66]/30` or `/40`
- **Border radius**: `rounded-lg`
- **Shadow**: `shadow-sm`
- **Padding**: `px-3 py-2`
- **Hover**: `hover:-translate-y-0.5`
- **Usage**: Calendar/Maps links (line 3171, 3181), small action buttons
- **Location**: Lines 3167-3193

#### Floating Action Button
- **Background**: `bg-[#D88D66]` with white text
- **Shape**: Circular (`rounded-full`)
- **Position**: Fixed bottom-right
- **Size**: `w-16 h-16` (64px)
- **Shadow**: `shadow-2xl`
- **Usage**: RSVP floating button (line 4374)

#### Toggle/Selection Buttons
- **Background**: Conditional (selected: `bg-[#D88D66]`, unselected: `bg-[#EDEDE3]`)
- **Text**: White when selected, navy when not
- **Border**: `sketchy-border`
- **Border radius**: `rounded-lg` or `rounded-full`
- **Usage**: RSVP attendance selection (line 3997+)

### Chips/Pills

#### Year Tags (Story Section)
- **Background**: `bg-[#D88D66]` or `bg-[#EBBA9A]` (peach variants)
- **Text**: White
- **Border radius**: `rounded-sm`
- **Rotation**: `rotate-[-2deg]` or `rotate-[2deg]`
- **Padding**: `px-3 md:px-4 py-1`
- **Font**: `font-hand text-lg md:text-xl`
- **Shadow**: `shadow-sm`
- **Usage**: Story timeline years (lines 1490, 1521, 1592, 1622)

#### Signboard Heading
- **Background**: Gradient `linear-gradient(135deg, #EBBA9A, #D88D66)`
- **Text**: White with text-shadow
- **Border radius**: `rounded-full` (999px)
- **Padding**: `0.6rem 1.8rem` → `0.75rem 2.5rem` md
- **Shadow**: `box-shadow: 0 6px 0 rgba(58, 49, 43, 0.35)`
- **Decorative**: Circular dots on sides (::before, ::after)
- **Font**: `font-hand font-bold text-base md:text-xl uppercase`
- **Usage**: Section headings (line 837)

#### Family Mode Badge
- **Background**: `bg-[#D88D66]`
- **Text**: White, `text-xs`
- **Border radius**: `rounded-sm`
- **Rotation**: `rotate-3`
- **Usage**: Nav indicator (line 1117)

### Cards

#### Travel Boarding Pass Card
- **Background**: Gradient `from-[#FDF9F4] to-[#EDEDE3]`
- **Border**: `border border-[#D4CDC2] border-t-[#D88D66]/30`
- **Border radius**: None (polygon clip-path for ticket effect)
- **Shadow**: `0 18px 30px rgba(216, 141, 102, 0.12)` (peach-tinted)
- **Special**: Left border accent (16px wide, deep peach), perforated edge visual
- **Padding**: `pl-24 pr-8 py-8`
- **Usage**: Travel section (line 3544)

#### Travel Base Camp Card
- **Background**: Gradient `from-[#EDEDE3] via-[#FDF9F4] to-[#EDEDE3]`
- **Border**: `border border-[#D4CDC2] border-l-[#EBBA9A]/30`
- **Border radius**: `rounded-[28px]`
- **Shadow**: `0 20px 40px rgba(216, 141, 102, 0.15)` (peach-tinted)
- **Padding**: `p-6 md:p-8 lg:p-10`
- **Special**: Decorative blur circles on top
- **Usage**: Travel section (line 3639)

#### Kidena House Feature Cards
- **Background**: `bg-[#FDF9F4]`
- **Border**: `border-2 border-[#D88D66]` or `border-[#EBBA9A]`
- **Border radius**: Inherited from sketchy-border
- **Shadow**: Peach-tinted via inline styles (`rgba(216, 141, 102, 0.12)`)
- **Padding**: `p-6 md:p-8`
- **Usage**: Kidena House section (lines 2839, 2851, 2863, 2875)

#### Explore Goa Cards
- **Background**: `bg-[#FDF9F4]/90`
- **Border**: `sketchy-border`
- **Border radius**: Inherited from sketchy-border
- **Shadow**: Peach-tinted via inline styles
- **Padding**: `p-8 md:p-10`
- **Usage**: Explore Goa section (line 3420)

#### FAQ Cards
- **Background**: `bg-[#FDF9F4]`
- **Border**: `sketchy-border`
- **Border radius**: Inherited from sketchy-border
- **Shadow**: Peach-tinted via inline styles
- **Padding**: `p-6 md:p-8`
- **Rotation**: `rotate-1 hover:rotate-0`
- **Usage**: FAQ section (line 3824)

#### Celebration Venue Card
- **Background**: Gradient `from-[#FDF9F4] via-[#FDF9F4] to-[#EDEDE3]`
- **Border**: `border border-[#EBBA9A]/30`
- **Border radius**: Inherited from sketchy-border
- **Shadow**: `shadow-xl` (default)
- **Padding**: `p-4` (outer), `p-6 md:p-8` (inner content)
- **Rotation**: `rotate-1`
- **Usage**: Celebration section (line 3049)

#### Photo Frames (Story Section)
- **Background**: `var(--canvas)` / `#FDF9F4` (via CSS class)
- **Border**: `sketchy-border`
- **Border radius**: Inherited from sketchy-border
- **Shadow**: Peach-tinted `rgba(216, 141, 102, 0.1)` base, `0.15` hover
- **Padding**: `p-3` (12px)
- **Rotation**: Various (`rotate-2`, `-rotate-2`, `rotate-1`, `-rotate-1`)
- **Usage**: Story section photos (lines 1478, 1539, 1561, 1642)

#### Countdown Card
- **Background**: Gradient `from-[#FDF9F4] to-[#EDEDE3]`
- **Border**: `border border-[#D4CDC2]`
- **Border radius**: `rounded-3xl` (1.75rem)
- **Shadow**: `0 18px 32px rgba(59, 47, 42, 0.12)` (dark navy, not peach)
- **Padding**: `px-8 py-6`
- **Usage**: Hero and Footer (line 1299)

#### RSVP Modals
- **Background**: `bg-[#FDF9F4]`
- **Border**: `sketchy-border` or `rounded-2xl`
- **Border radius**: `rounded-2xl` (1rem)
- **Shadow**: `0 25px 50px -12px rgba(216, 141, 102, 0.15)` (peach-tinted)
- **Padding**: `p-8 md:p-10`
- **Usage**: Success/error modals (lines 4148, 4431)

### Component Inconsistencies

1. **Shadow colors**: Mix of black shadows (`shadow-lg`, `shadow-xl`) and peach-tinted shadows (inline styles). Countdown card still uses dark navy shadow.

2. **Border radius**: Cards use various values:
   - `rounded-lg` (0.5rem)
   - `rounded-xl` (0.75rem)
   - `rounded-2xl` (1rem)
   - `rounded-3xl` (1.5rem)
   - `rounded-[28px]` (custom)
   - `rounded-[32px]` (custom)
   - Sketchy-border inherits organic shape

3. **Card backgrounds**: Mix of solid `bg-[#FDF9F4]`, gradients, and semi-transparent variants (`/90`, `/95`, `/85`)

4. **Button styles**: Primary buttons use deep peach, but secondary buttons still use `bg-white/90` in some places (line 3171, 3181)

---

## 4. Spacing & Rhythm

### Section Spacing Constants

- **SECTION_PADDING**: `px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16` (horizontal)
- **SECTION_SPACING**: `py-8 md:py-12 lg:py-16 xl:py-20` (vertical)
- **Location**: Lines 832-833

### Section-by-Section Spacing

#### Hero
- **Vertical**: `pt-16 md:pt-24 pb-4 md:pb-12` (custom, not using SECTION_SPACING)
- **Internal**: `space-y-4 md:space-y-6` between elements
- **Card padding**: `px-4 py-3 md:px-5 md:py-4` (event details)

#### The Celebration
- **Vertical**: Uses `SECTION_SPACING` (`py-8 md:py-12 lg:py-16 xl:py-20`)
- **Grid gap**: `gap-12 md:gap-16` (between columns)
- **Timeline spacing**: `space-y-8 md:space-y-12` (between events)
- **Card padding**: `p-6 md:p-8` (inner content)

#### Travel & Stay
- **Vertical**: Uses `SECTION_SPACING`
- **Grid gap**: `gap-8` (between cards)
- **Card padding**: `pl-24 pr-8 py-8` (boarding pass), `p-6 md:p-8 lg:p-10` (base camp)

#### Kidena House
- **Vertical**: Uses `SECTION_SPACING`
- **Grid gap**: `gap-6 md:gap-8` (feature cards)
- **Card padding**: `p-6 md:p-8`

#### RSVP
- **Vertical**: Uses `SECTION_SPACING`
- **Form spacing**: `space-y-6` (between form fields)
- **Modal padding**: `p-8 md:p-10`

#### Dress Code
- **Vertical**: Uses `SECTION_SPACING`
- **Grid gap**: `gap-5 md:gap-8 lg:gap-10`
- **Card padding**: `p-6`

#### Story
- **Vertical**: Uses `SECTION_SPACING`
- **Grid gap**: `gap-8 md:gap-12 lg:gap-16`
- **Card padding**: `p-3` (photo frames)

#### Explore Goa
- **Vertical**: Uses `SECTION_SPACING`
- **Grid gap**: `gap-8 md:gap-12`
- **Card padding**: `p-8 md:p-10`

#### FAQ
- **Vertical**: Uses `SECTION_SPACING`
- **Grid gap**: `gap-6 md:gap-8`
- **Card padding**: `p-6 md:p-8`

#### Footer
- **Vertical**: `py-16 md:py-24 lg:py-32` (custom, larger than SECTION_SPACING)
- **Internal**: `space-y-8 md:space-y-12 lg:space-y-16`

### Spacing Issues

1. **Hero section**: Doesn't use `SECTION_SPACING`, has custom padding that may feel inconsistent

2. **Footer**: Uses much larger vertical padding (`py-32` on xl) compared to other sections

3. **Inconsistent grid gaps**: 
   - Travel: `gap-8`
   - Story: `gap-8 md:gap-12 lg:gap-16`
   - Explore Goa: `gap-8 md:gap-12`
   - FAQ: `gap-6 md:gap-8`

4. **Card padding variations**: Ranges from `p-3` (photo frames) to `p-10` (some cards), no clear system

5. **Timeline spacing**: Celebration timeline uses `space-y-8 md:space-y-12`, but other vertical lists use different values

---

## 5. Colour Usage

### Palette Definition (CSS Variables)

- **--stone**: `#EDEDE3` (light stone)
- **--stone-muted**: `#D4CDC2` (muted stone)
- **--peach-deep**: `#D88D66` (terracotta/deep peach)
- **--peach-soft**: `#EBBA9A` (blush sand/soft peach)
- **--ink**: `#3B2F2A` (navy/ink)
- **--canvas**: `#FDF9F4` (warm ivory)
- **Location**: Lines 69-75

### Background Usage by Section

#### Hero
- **Main**: `bg-[#FDF9F4]` (canvas)
- **Image container**: `bg-[#EDEDE3]` (stone)
- **Event details card**: `bg-[#FDF9F4]/90` (semi-transparent canvas)

#### The Celebration
- **Main**: `bg-[#FDF9F4]` (canvas)
- **Venue card**: Gradient `from-[#FDF9F4] via-[#FDF9F4] to-[#EDEDE3]`
- **Image wrapper**: `bg-[#FDF9F4]`
- **Content box**: `bg-[#FDF9F4]/90`
- **Timeline circles**: `bg-[#FDF9F4]`

#### Travel & Stay
- **Main**: `bg-[#FDF9F4]` (canvas)
- **Boarding pass**: Gradient `from-[#FDF9F4] to-[#EDEDE3]`
- **Base camp**: Gradient `from-[#EDEDE3] via-[#FDF9F4] to-[#EDEDE3]`
- **Important box**: `bg-[#FDF9F4]`

#### Kidena House
- **Main**: `bg-[#FDF9F4]` with `dotted-background` pattern
- **Feature cards**: `bg-[#FDF9F4]`

#### RSVP
- **Main**: `bg-[#FDF9F4]` (canvas)
- **Modals**: `bg-[#FDF9F4]`

#### Dress Code
- **Main**: `bg-[#FDF9F4]` (canvas)
- **Guidance cards**: `bg-[#FDF9F4]/95`

#### Story
- **Main**: `bg-[#FDF9F4]` (canvas)
- **Photo frames**: `var(--canvas)` / `#FDF9F4` (via CSS)

#### Explore Goa
- **Main**: `bg-[#FDF9F4]` (canvas)
- **Cards**: `bg-[#FDF9F4]/90`

#### FAQ
- **Main**: `bg-[#FDF9F4]` (canvas)
- **Cards**: `bg-[#FDF9F4]`
- **Contact card**: Gradient `from-[#D88D66]/10 to-[#EBBA9A]/10`

#### Footer
- **Main**: `var(--page-canvas)` (likely `#FDF9F4`)
- **Button**: `bg-[#EDEDE3]`

### Accent Colour Usage

#### Deep Peach (`#D88D66`)
- **Frequency**: High
- **Usage**: 
  - Primary buttons
  - Year tags (alternating with soft peach)
  - Section heading gradients
  - Borders (`border-[#D88D66]/30`, `/40`)
  - Icons and decorative elements
  - Links and hover states
  - Timeline event times
  - Countdown divider line

#### Soft Peach (`#EBBA9A`)
- **Frequency**: Medium
- **Usage**:
  - Year tags (alternating)
  - Gradient components
  - Border accents (`border-[#EBBA9A]/30`)
  - Decorative elements
  - Some icon backgrounds

#### Stone (`#EDEDE3`)
- **Frequency**: High
- **Usage**:
  - Gradient components
  - Image containers
  - Button backgrounds (footer)
  - Card backgrounds (gradients)

#### Muted Stone (`#D4CDC2`)
- **Frequency**: High
- **Usage**:
  - Borders (`border-[#D4CDC2]`)
  - Dashed borders
  - Decorative elements

### Remaining White Backgrounds

1. **Calendar/Maps buttons** (line 3171, 3181): `bg-white/90` - should be canvas
2. **Game UI elements**: Various `bg-white/95` - acceptable for game overlay
3. **Image modal controls**: `bg-white/95` - acceptable for UI overlays

### Contrast Issues

1. **Peach text on light backgrounds**: 
   - Timeline times use `text-[#D88D66]` on canvas (line 3152) - may be low contrast
   - Links use `text-[#D88D66]` on canvas backgrounds - should be acceptable but monitor

2. **Opacity variations**: 
   - Text uses various opacity levels (`text-navy/80`, `/70`, `/60`) which may affect readability
   - Some body text at `/80` opacity may be too light

---

## 6. Inconsistencies & Risks

### Visual Inconsistencies

1. **Shadow system**: Mix of default Tailwind shadows (black) and custom peach-tinted shadows. Countdown card still uses dark navy shadow instead of warm palette.

2. **Button backgrounds**: Secondary action buttons (Calendar, Maps) still use `bg-white/90` instead of canvas colors.

3. **Border radius scale**: No consistent system - uses `rounded-lg`, `rounded-xl`, `rounded-2xl`, `rounded-3xl`, and custom `rounded-[28px]`, `rounded-[32px]`.

4. **Card background variants**: Mix of solid, gradients, and semi-transparent (`/90`, `/95`, `/85`) without clear rules.

5. **Typography hierarchy**: Multiple heading sizes (`text-2xl` through `text-5xl`) used for similar-level content without clear distinction.

### Spacing Inconsistencies

1. **Hero section**: Uses custom padding instead of `SECTION_SPACING`, creating visual inconsistency with other sections.

2. **Footer**: Uses much larger vertical padding (`py-32`) than other sections, may feel disconnected.

3. **Grid gaps**: Inconsistent between sections (ranges from `gap-6` to `gap-16`).

4. **Card padding**: No clear system - ranges from `p-3` to `p-10`.

### Typography Issues

1. **Font weight inconsistency**: Mix of `font-medium`, `font-semibold`, and `font-bold` in similar contexts.

2. **Line-height variations**: Hero title uses very tight `leading-[0.9]`, body uses `leading-relaxed` (1.625), no middle ground system.

3. **Font family mixing**: Countdown uses `font-mono` for numbers but `font-hand` for labels - intentional but inconsistent with rest of site.

### Color Risks

1. **Contrast**: Peach text (`#D88D66`) on canvas (`#FDF9F4`) may not meet WCAG AA standards for body text. Should verify contrast ratios.

2. **Opacity overuse**: Heavy use of opacity variants (`/80`, `/70`, `/60`) may reduce readability, especially on mobile.

3. **White remnants**: Some buttons still use white backgrounds instead of canvas, breaking warm palette cohesion.

### Component Pattern Issues

1. **Card styles**: Multiple card patterns (ticket, notepad, standard, photo frame) without clear guidelines on when to use each.

2. **Button hierarchy**: Primary buttons are clear, but secondary buttons vary in style (some with white bg, some with canvas).

3. **Modal consistency**: RSVP modals use canvas backgrounds, but some game/modals may still use white.

### Accessibility Concerns

1. **Text contrast**: Need to verify contrast ratios for peach text on light backgrounds.

2. **Focus states**: Some buttons have focus rings (`focus-visible:ring-2`), but consistency should be verified.

3. **Touch targets**: Mobile buttons should be at least 44x44px - need to verify all interactive elements.

### Performance Considerations

1. **Inline styles**: Heavy use of inline `style` props for shadows (onMouseEnter/Leave) may impact performance with many cards.

2. **Animation complexity**: Multiple parallax effects and hover animations may impact lower-end devices.

---

## Summary

The website uses a warm, cohesive peach-stone-ink palette with hand-drawn sketchy aesthetic. Main sections follow a consistent structure with `SECTION_SPACING` and `SECTION_PADDING`, though Hero and Footer deviate. Typography uses three font families (Inter, Crimson Pro, Kalam) with responsive scaling, but lacks a clear hierarchy system. Component patterns are generally consistent but have some white background remnants and mixed shadow systems. The overall design is cohesive but would benefit from standardizing spacing scales, typography hierarchy, and completing the migration from white to canvas backgrounds.

