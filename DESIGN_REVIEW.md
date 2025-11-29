# Design Review: Wedding Website
**Reviewer:** Senior Design Lead (Apple → Stripe → Linear)
**Date:** November 29, 2025
**Rating:** 6.5/10

---

## VISUAL HIERARCHY

### Issues Found:

**1. Competing Primary Actions**
- **What's wrong:** Three floating elements fight for attention: countdown timer, music button (bottom-left), RSVP button (bottom-right). Plus hero CTA buttons. No clear primary action.
- **Why it matters:** Users don't know where to look first. Violates F-pattern scanning and visual weight principles.
- **How to fix:** Demote music button to footer or make it smaller/less prominent. Keep RSVP as primary CTA. Countdown should be secondary visual element, not competing button.

**2. Inconsistent Card Hierarchy**
- **What's wrong:** Story section cards use same visual weight as Ceremony card. Travel section "Boarding Pass" card has heavy left border (16px) competing with content.
- **Why it matters:** All cards feel equally important, so nothing stands out. The boarding pass border creates visual noise.
- **How to fix:** Establish 3-tier card system: Primary (ceremony/venue) = heavier shadow + border, Secondary (story) = lighter, Tertiary (info) = subtle. Reduce boarding pass left border to 8px or use background color instead.

**3. Typography Weight Confusion**
- **What's wrong:** Section headings use `font-bold` but many subheadings also use `font-bold`, creating equal weight.
- **Why it matters:** No clear information hierarchy. Everything shouts.
- **How to fix:** Use weight scale: H1 = 700, H2 = 600, H3 = 500, body = 400. Reserve bold for emphasis only.

---

## TYPOGRAPHY

### Issues Found:

**1. Inconsistent Type Scale**
- **What's wrong:** While constants exist (TYPO_H1, TYPO_H2, etc.), many elements use inline sizes: `text-sm`, `text-base`, `text-lg`, `text-xl`, `text-2xl` scattered throughout. Line 2662 uses `text-sm md:text-base` while TYPO_BODY is `text-base md:text-lg`.
- **Why it matters:** Creates visual noise and feels arbitrary. No systematic approach.
- **How to fix:** Audit all text sizes. Map to type scale: xs (12px), sm (14px), base (16px), lg (18px), xl (20px), 2xl (24px), 3xl (30px), 4xl (36px), 5xl (48px). Use constants everywhere.

**2. Line Length Issues**
- **What's wrong:** RSVP form inputs and some body text exceed 75 characters (optimal reading width). Story section paragraphs are too wide on desktop.
- **Why it matters:** Reduces readability. Eyes get tired scanning long lines.
- **How to fix:** Constrain body text to `max-w-prose` (65ch) or `max-w-2xl` (672px). Form inputs should be max 400px wide.

**3. Letter-Spacing Inconsistency**
- **What's wrong:** TYPO_LABEL uses `tracking-wider` but some labels use `tracking-tight` or default. No system.
- **Why it matters:** Labels feel inconsistent. Some feel cramped, others too spaced.
- **How to fix:** Define tracking scale: labels = 0.05em, uppercase = 0.1em, display = 0.02em. Apply consistently.

**4. Line-Height Defaults**
- **What's wrong:** TYPO_BODY uses `leading-relaxed` (1.625) but many paragraphs use default (1.5) or `leading-tight` (1.25).
- **Why it matters:** Inconsistent reading rhythm. Some text feels cramped.
- **How to fix:** Use `leading-relaxed` for all body text. Headings can use `leading-tight` (1.2) for compactness.

---

## SPACING & RHYTHM

### Issues Found:

**1. Arbitrary Spacing Values**
- **What's wrong:** While constants exist (CARD_PAD_MD, SECTION_SPACING), many elements use arbitrary values: `mt-1 md:mt-2`, `gap-3 md:gap-3`, `mb-12 md:mb-14`, `space-y-7 md:space-y-8`. No 4px/8px grid system visible.
- **Why it matters:** Feels uncoordinated. Elements don't align to invisible grid.
- **How to fix:** Use 8px base unit. All spacing should be multiples: 8px, 16px, 24px, 32px, 48px, 64px. Replace arbitrary values with system tokens.

**2. Inconsistent Vertical Rhythm**
- **What's wrong:** Section spacing jumps: `py-8 md:py-12 lg:py-16 xl:py-20` but some sections have `mt-8 md:mt-10 lg:mt-12` or `mb-12 md:mb-14`. No consistent baseline.
- **Why it matters:** Page doesn't breathe uniformly. Some sections feel cramped, others float.
- **How to fix:** Standardize section spacing: Mobile = 64px (py-16), Tablet = 96px (py-24), Desktop = 128px (py-32). Remove arbitrary top/bottom margins.

**3. Card Internal Spacing**
- **What's wrong:** Cards use `p-6 md:p-8` but some have `p-4 md:p-5` or `p-8 md:p-10`. Inconsistent internal rhythm.
- **Why it matters:** Cards feel disconnected. No unified card language.
- **How to fix:** Standardize: Small cards = 16px (p-4), Medium = 24px (p-6), Large = 32px (p-8). Apply consistently.

---

## COLOR & CONTRAST

### Issues Found:

**1. Low Contrast Text**
- **What's wrong:** `text-navy/60` (40% opacity) used for secondary text (line 2662). WCAG requires 4.5:1 for body text, this likely fails.
- **Why it matters:** Accessibility violation. Hard to read, especially for users with visual impairments.
- **How to fix:** Use `text-navy/70` minimum for body text. Reserve `/60` for disabled states only. Test with contrast checker.

**2. Decorative Color Usage**
- **What's wrong:** Peach color (`#D88D66`) used for icons, borders, backgrounds, text, buttons - everywhere. No semantic meaning.
- **Why it matters:** Color loses meaning. Doesn't guide user attention meaningfully.
- **How to fix:** Reserve peach for: Primary CTAs, active states, key information (date/time). Use navy for text, stone for backgrounds.

**3. Border Color Inconsistency**
- **What's wrong:** Borders use `border-[#D88D66]/30`, `border-[#D4CDC2]`, `border-navy/20`, `border-navy/10` - no system.
- **Why it matters:** Feels arbitrary. Some borders disappear, others compete.
- **How to fix:** Define border system: Primary = navy at 20% opacity, Secondary = stone-muted, Accent = peach at 30% opacity.

---

## INTERACTION & MOTION

### Issues Found:

**1. Inconsistent Hover Behaviors**
- **What's wrong:** Some buttons scale (`hover:scale-105`), some translate (`hover:-translate-y-[2px]`), some rotate (`hover:rotate-1`), some combine all three. No pattern.
- **Why it matters:** Feels chaotic. Users can't predict interactions.
- **How to fix:** Standardize: Primary buttons = scale 1.02 + lift 2px, Secondary = lift 2px only, Decorative = rotate 1deg. One behavior per element type.

**2. Motion Timing Inconsistency**
- **What's wrong:** Transitions use `duration-200`, `duration-250`, `duration-300`, `transition-all`, `ease`, `ease-out` - no timing system.
- **Why it matters:** Animations feel disconnected. Some feel sluggish, others too fast.
- **How to fix:** Define timing scale: Fast = 150ms (micro-interactions), Normal = 200ms (buttons/hovers), Slow = 300ms (entrances). Use `ease-out` for entrances, `ease-in-out` for hovers.

**3. Gratuitous Animations**
- **What's wrong:** Floating hearts, parallax on decorative elements, pulse animations on countdown. Distracts from content.
- **Why it matters:** Motion should enhance understanding, not decorate. Violates "invisible design" principle.
- **How to fix:** Remove decorative parallax. Keep entrance animations subtle (fade + 8px translate). Remove pulse - use static state.

---

## POLISH & DETAILS

### Issues Found:

**1. Border Radius Inconsistency**
- **What's wrong:** Multiple radius values: `rounded-2xl` (16px), `rounded-xl` (12px), `rounded-lg` (8px), `rounded-full` (999px), `sketchy-border` (18px), custom `255px 15px...` for inputs. No system.
- **Why it matters:** Feels uncoordinated. Some elements feel sharp, others too round.
- **How to fix:** Standardize: Cards = 12px (rounded-xl), Buttons = 8px (rounded-lg), Inputs = sketchy (keep for character), Icons = full. Remove arbitrary values.

**2. Shadow Inconsistency**
- **What's wrong:** Shadows use arbitrary values: `shadow-sm`, `shadow-md`, `shadow-lg`, `shadow-xl`, custom `0 8px 16px -2px rgba(...)`, `0 18px 45px rgba(...)`. No elevation system.
- **Why it matters:** No sense of depth hierarchy. Some elements float, others feel flat.
- **How to fix:** Define 3-level elevation: Level 1 (cards) = `0 2px 8px rgba(0,0,0,0.08)`, Level 2 (hovered) = `0 4px 16px rgba(0,0,0,0.12)`, Level 3 (modals) = `0 8px 32px rgba(0,0,0,0.16)`.

**3. Icon Size Inconsistency**
- **What's wrong:** Icons use `size={14}`, `size={16}`, `size={18}`, `size={20}`, `w-5 h-5`, `w-6 h-6`, `md:w-7 md:h-7` - no system.
- **Why it matters:** Icons feel disconnected. Some too small, others compete with text.
- **How to fix:** Standardize: Small = 16px, Medium = 20px, Large = 24px. Use consistently with text size (icon = text size or 1.25x).

**4. Alignment Issues**
- **What's wrong:** Event details card uses `items-center` but text doesn't align with icons. Some cards have inconsistent internal padding causing misalignment.
- **Why it matters:** Feels sloppy. Professional design requires pixel-perfect alignment.
- **How to fix:** Use flexbox with consistent gap values. Align icons to text baseline. Use CSS Grid for complex layouts.

---

## MOBILE EXPERIENCE

### Issues Found:

**1. Touch Target Sizes**
- **What's wrong:** Navigation links and some buttons may be below 44x44px minimum. Music button is 64px (good) but RSVP button text might be cramped.
- **Why it matters:** Hard to tap accurately. Frustrating on mobile.
- **How to fix:** Ensure all interactive elements are minimum 44x44px. Add padding to text buttons. Test on actual device.

**2. Horizontal Scroll**
- **What's wrong:** Potential overflow issues with wide content (countdown timer, event details card) on small screens.
- **Why it matters:** Breaks mobile experience. Users expect vertical scroll only.
- **How to fix:** Add `overflow-x-hidden` to body. Constrain all content to viewport width. Use `min-w-0` on flex children.

**3. Text Size on Mobile**
- **What's wrong:** Some text uses same size on mobile/desktop (like labels), making it hard to read.
- **Why it matters:** Mobile users need larger text for readability at arm's length.
- **How to fix:** Ensure minimum 16px base text on mobile. Scale up proportionally.

---

## EMOTIONAL RESONANCE

### Issues Found:

**1. Surface-Level Goan Aesthetic**
- **What's wrong:** Sketchy borders and hand-drawn fonts feel applied, not integrated. The "Mario Miranda" style is mentioned but not deeply felt. Could be any wedding website with decorative borders.
- **Why it matters:** Lacks authenticity. Doesn't feel like THIS couple's story.
- **How to fix:** Integrate Goan elements meaningfully: Use Goan patterns in backgrounds (subtle), incorporate local color references in copy, add cultural context to story section. Make it feel like Goa, not just "tropical wedding."

**2. Generic Warmth**
- **What's wrong:** Colors are warm (peach, cream) but the overall feel is polished/corporate rather than personal/intimate.
- **Why it matters:** Could be any couple. Missing personal voice and character.
- **How to fix:** Add more personal touches: Handwritten-style notes in margins, personal photos with captions, casual language in some sections. Let personality show through.

**3. Over-Polished**
- **What's wrong:** Everything feels too perfect. Smooth animations, perfect alignment, corporate-level polish. Lacks human imperfection.
- **Why it matters:** Feels cold. Wedding websites should feel warm and inviting, not like a SaaS product.
- **How to fix:** Introduce subtle imperfections: Slight rotation on some cards (-1deg, 1deg), varied spacing (not perfectly uniform), hand-drawn elements that aren't perfectly aligned. Make it feel crafted, not manufactured.

---

## OVERALL RATING: 6.5/10

**Strengths:**
- Solid color palette foundation
- Good use of typography constants (when followed)
- Responsive structure in place
- Accessibility considerations (reduced motion, focus states)

**Weaknesses:**
- Inconsistent execution of design system
- Too many competing elements
- Lacks emotional authenticity
- Over-polished, feels corporate

---

## TOP 5 PRIORITIZED FIXES (Maximum Impact, Minimum Effort)

### 1. **Fix Typography Scale** (2 hours)
- **Impact:** High - affects entire site readability and hierarchy
- **Effort:** Low - mostly find/replace
- **Action:** Audit all text sizes, map to type scale, replace inline sizes with constants. Standardize line-height and letter-spacing.

### 2. **Standardize Spacing System** (3 hours)
- **Impact:** High - creates visual harmony and rhythm
- **Effort:** Medium - requires systematic replacement
- **Action:** Replace all arbitrary spacing with 8px grid system. Standardize section spacing, card padding, gaps.

### 3. **Fix Visual Hierarchy** (2 hours)
- **Impact:** High - guides user attention effectively
- **Effort:** Low - mostly CSS changes
- **Action:** Demote music button, establish card hierarchy (3 tiers), reduce competing elements. Make RSVP primary CTA.

### 4. **Standardize Interactions** (2 hours)
- **Impact:** Medium - creates predictable, polished feel
- **Effort:** Low - CSS updates
- **Action:** Define hover behavior system (scale/lift/rotate rules), standardize transition timing, remove gratuitous animations.

### 5. **Improve Contrast & Accessibility** (1 hour)
- **Impact:** Medium - legal/compliance + usability
- **Effort:** Low - color value changes
- **Action:** Fix low-contrast text (navy/60 → navy/70), test all text meets WCAG AA, ensure touch targets are 44px minimum.

---

**Estimated Total Time:** 10 hours
**Expected Improvement:** 6.5/10 → 8/10

---

## Additional Recommendations (Lower Priority)

- **Polish:** Standardize border-radius and shadows (2 hours)
- **Emotional:** Add personal touches and Goan cultural integration (4 hours)
- **Mobile:** Test and fix horizontal scroll, optimize touch targets (2 hours)

**Total for 9/10:** ~18 hours additional work

