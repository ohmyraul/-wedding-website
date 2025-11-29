/**
 * Design System Constants
 * Centralized theme values for consistency across the application
 */

export const COLORS = {
  // Primary Palette
  peach: {
    deep: '#D88D66',
    soft: '#EBBA9A',
  },
  stone: {
    light: '#EDEDE3',
    muted: '#D4CDC2',
  },
  ink: '#3B2F2A',
  canvas: '#FDF9F4',
  
  // Semantic Colors
  primary: '#D88D66',      // Deep peach
  secondary: '#EBBA9A',    // Soft peach
  background: '#FDF9F4',   // Canvas
  surface: '#EDEDE3',      // Stone light
  text: {
    primary: '#3B2F2A',   // Ink
    secondary: 'rgba(59, 47, 42, 0.7)',
    muted: 'rgba(59, 47, 42, 0.6)',
  },
  border: {
    default: '#D4CDC2',   // Stone muted
    accent: 'rgba(216, 141, 102, 0.3)',
  },
};

export const SPACING = {
  // Section spacing
  section: {
    padding: 'px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16',
    vertical: 'py-8 md:py-12 lg:py-16 xl:py-20',
  },
  // Card padding
  card: {
    sm: 'p-3',
    md: 'p-6 md:p-8',
    lg: 'p-8 md:p-10',
  },
  // Grid gaps
  gap: {
    sm: 'gap-6 md:gap-8',
    md: 'gap-8 md:gap-12',
    lg: 'gap-12 md:gap-16',
  },
};

export const TYPOGRAPHY = {
  font: {
    body: "'Inter', sans-serif",
    heading: "'Crimson Pro', serif",
    script: "'Kalam', cursive",
  },
  size: {
    xs: 'text-xs',
    sm: 'text-sm',
    base: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl',
    '3xl': 'text-3xl',
    '4xl': 'text-4xl',
    '5xl': 'text-5xl',
  },
  weight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
};

export const BORDER_RADIUS = {
  sm: 'rounded-lg',        // 8px
  md: 'rounded-xl',        // 12px
  lg: 'rounded-2xl',       // 16px
  xl: 'rounded-3xl',       // 24px
  full: 'rounded-full',    // 999px
  sketchy: 'rounded-[255px_15px_225px_15px/15px_225px_15px_255px]', // Organic sketchy
};

export const SHADOWS = {
  // Warm-tinted shadows matching the design system
  sm: '0 2px 4px rgba(216, 141, 102, 0.1)',
  md: '0 4px 8px rgba(216, 141, 102, 0.12)',
  lg: '0 8px 16px rgba(216, 141, 102, 0.15)',
  xl: '0 12px 24px rgba(216, 141, 102, 0.18)',
  '2xl': '0 18px 32px rgba(216, 141, 102, 0.2)',
  // Card shadows
  card: '0 18px 30px rgba(216, 141, 102, 0.12)',
  cardHover: '0 20px 40px rgba(216, 141, 102, 0.15)',
  // Modal shadows
  modal: '0 25px 50px -12px rgba(216, 141, 102, 0.15)',
};

export const TIMING = {
  transition: {
    fast: '0.15s ease',
    normal: '0.3s ease',
    slow: '0.5s ease',
  },
  animation: {
    float: '4s ease-in-out infinite',
  },
};

export const Z_INDEX = {
  base: 0,
  dropdown: 100,
  sticky: 200,
  overlay: 300,
  modal: 400,
  popover: 500,
};

// CSS Variable names (for reference)
export const CSS_VARS = {
  stone: '--stone',
  stoneMuted: '--stone-muted',
  peachDeep: '--peach-deep',
  peachSoft: '--peach-soft',
  ink: '--ink',
  canvas: '--canvas',
  paperTexture: '--paper-texture',
};

