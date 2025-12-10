/**
 * Design Tokens
 * Single source of truth for typography, spacing, and design system values
 */

export const TYPE_SCALE = {
  xs: 'text-xs',           // 12px
  sm: 'text-sm',           // 14px  
  base: 'text-base',       // 16px
  lg: 'text-lg',           // 18px
  xl: 'text-xl',           // 20px
  '2xl': 'text-2xl',       // 24px
  '3xl': 'text-3xl',       // 30px
  '4xl': 'text-4xl',       // 36px
  '5xl': 'text-5xl',       // 48px
  '6xl': 'text-6xl',       // 60px
  '7xl': 'text-7xl',       // 72px
};

export const LINE_HEIGHT = {
  tight: 'leading-tight',      // 1.25
  normal: 'leading-normal',    // 1.5
  relaxed: 'leading-relaxed',  // 1.625
  loose: 'leading-loose',       // 2
};

export const LETTER_SPACING = {
  tighter: 'tracking-tighter',  // -0.05em
  tight: 'tracking-tight',       // -0.025em
  normal: 'tracking-normal',     // 0em
  wide: 'tracking-wide',         // 0.025em
  wider: 'tracking-wider',       // 0.05em
  widest: 'tracking-widest',     // 0.1em
};

export const SPACING = {
  // Section vertical spacing (8px base unit)
  section: 'py-16 md:py-24 lg:py-32',  // 64px / 96px / 128px
  
  // Section horizontal padding
  sectionPadding: 'px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20',  // 16px / 24px / 32px / 48px / 64px / 80px
  
  // Card padding (8px base unit)
  card: {
    sm: 'p-4',   // 16px
    md: 'p-6',   // 24px
    lg: 'p-8',   // 32px
  },
  
  // Gap spacing (8px base unit)
  gap: {
    xs: 'gap-2',   // 8px
    sm: 'gap-4',   // 16px
    md: 'gap-6',   // 24px
    lg: 'gap-8',   // 32px
    xl: 'gap-12',  // 48px
  },
  // Vertical spacing between elements (for flex-col or space-y)
  spaceY: {
    xs: 'space-y-2',   // 8px
    sm: 'space-y-4',   // 16px
    md: 'space-y-6',   // 24px
    lg: 'space-y-8',   // 32px
    xl: 'space-y-12',  // 48px
    // Additional common values
    '2': 'space-y-2',  // 8px
    '3': 'space-y-3',  // 12px
    '4': 'space-y-4',  // 16px
    '5': 'space-y-5',  // 20px
    '6': 'space-y-6',  // 24px
    '8': 'space-y-8',  // 32px
    '10': 'space-y-10', // 40px
    '14': 'space-y-14', // 56px
    '20': 'space-y-20', // 80px
  },
  
  // Margin spacing (8px base unit)
  margin: {
    xs: 'm-2',    // 8px
    sm: 'm-4',    // 16px
    md: 'm-6',    // 24px
    lg: 'm-8',    // 32px
    xl: 'm-12',   // 48px
  },
};

export const BORDER_RADIUS = {
  none: 'rounded-none',
  sm: 'rounded-lg',      // 8px
  md: 'rounded-xl',       // 12px
  lg: 'rounded-2xl',      // 16px
  full: 'rounded-full',   // 999px
  sketchy: 'sketchy-border', // Custom organic border
};

export const SHADOWS = {
  none: 'shadow-none',
  sm: 'shadow-sm',   // 0 1px 2px rgba(0,0,0,0.05)
  md: 'shadow-md',   // 0 4px 6px rgba(0,0,0,0.1)
  lg: 'shadow-lg',   // 0 10px 15px rgba(0,0,0,0.1)
  xl: 'shadow-xl',   // 0 20px 25px rgba(0,0,0,0.1)
};

export const TRANSITIONS = {
  fast: 'transition-all duration-150 ease-out',      // 150ms - micro-interactions
  normal: 'transition-all duration-200 ease-in-out', // 200ms - buttons/hovers
  slow: 'transition-all duration-300 ease-out',       // 300ms - entrances
};

export const OPACITY = {
  // Text opacity (for accessibility - minimum 70% for body text)
  text: {
    primary: 'text-navy',      // 100% - primary text
    secondary: 'text-navy/70', // 70% - secondary text (WCAG AA compliant)
    tertiary: 'text-navy/60',  // 60% - decorative only
    disabled: 'text-navy/50',  // 50% - disabled states
  },
  // Background opacity
  bg: {
    subtle: 'bg-opacity-10',
    light: 'bg-opacity-20',
    medium: 'bg-opacity-30',
  },
};

/**
 * Typography Hierarchy
 * Strict type scale for consistent heading hierarchy
 */
export const TYPOGRAPHY = {
  // H1 - Hero titles only
  h1: {
    mobile: `${TYPE_SCALE['4xl']} font-hand font-bold ${LETTER_SPACING.tight}`, // 36px
    tablet: `${TYPE_SCALE['5xl']} font-hand font-bold ${LETTER_SPACING.tight}`, // 48px
    desktop: `${TYPE_SCALE['6xl']} font-hand font-bold ${LETTER_SPACING.tight}`, // 60px
    full: `${TYPE_SCALE['4xl']} md:${TYPE_SCALE['5xl']} lg:${TYPE_SCALE['6xl']} font-hand font-bold ${LETTER_SPACING.tight}`,
  },
  
  // H2 - Section headings
  h2: {
    mobile: `${TYPE_SCALE['2xl']} font-hand font-bold ${LETTER_SPACING.tight}`, // 24px
    tablet: `${TYPE_SCALE['3xl']} font-hand font-bold ${LETTER_SPACING.tight}`, // 30px
    desktop: `${TYPE_SCALE['4xl']} font-hand font-bold ${LETTER_SPACING.tight}`, // 36px
    full: `${TYPE_SCALE['2xl']} md:${TYPE_SCALE['3xl']} lg:${TYPE_SCALE['4xl']} font-hand font-bold ${LETTER_SPACING.tight}`,
  },
  
  // H3 - Card titles, subsection headings
  h3: {
    mobile: `${TYPE_SCALE.xl} font-hand font-semibold ${LETTER_SPACING.normal}`, // 20px
    tablet: `${TYPE_SCALE['2xl']} font-hand font-semibold ${LETTER_SPACING.normal}`, // 24px
    desktop: `${TYPE_SCALE['3xl']} font-hand font-semibold ${LETTER_SPACING.normal}`, // 30px
    full: `${TYPE_SCALE.xl} md:${TYPE_SCALE['2xl']} lg:${TYPE_SCALE['3xl']} font-hand font-semibold ${LETTER_SPACING.normal}`,
  },
  
  // H4 - Small headings, labels
  h4: {
    mobile: `${TYPE_SCALE.base} font-hand font-semibold ${LETTER_SPACING.normal}`, // 16px
    tablet: `${TYPE_SCALE.lg} font-hand font-semibold ${LETTER_SPACING.normal}`, // 18px
    desktop: `${TYPE_SCALE.xl} font-hand font-semibold ${LETTER_SPACING.normal}`, // 20px
    full: `${TYPE_SCALE.base} md:${TYPE_SCALE.lg} lg:${TYPE_SCALE.xl} font-hand font-semibold ${LETTER_SPACING.normal}`,
  },
  
  // Body - Standard text
  body: {
    mobile: `${TYPE_SCALE.base} font-normal ${LINE_HEIGHT.relaxed}`, // 16px
    tablet: `${TYPE_SCALE.lg} font-normal ${LINE_HEIGHT.relaxed}`, // 18px
    desktop: `${TYPE_SCALE.xl} font-normal ${LINE_HEIGHT.relaxed}`, // 20px
    full: `${TYPE_SCALE.base} md:${TYPE_SCALE.lg} lg:${TYPE_SCALE.xl} font-normal ${LINE_HEIGHT.relaxed}`,
  },
  
  // Small - Captions, helper text
  small: {
    mobile: `${TYPE_SCALE.sm} font-normal ${LINE_HEIGHT.normal}`, // 14px
    tablet: `${TYPE_SCALE.base} font-normal ${LINE_HEIGHT.normal}`, // 16px
    full: `${TYPE_SCALE.sm} md:${TYPE_SCALE.base} font-normal ${LINE_HEIGHT.normal}`,
  },
};

