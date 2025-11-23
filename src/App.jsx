import React, { useState, useRef, useEffect, useMemo, memo, Suspense, lazy } from 'react';

import { Menu, X, ArrowDown, ArrowUp, CheckCircle, Lock, Unlock, Phone, Calendar, Home, PawPrint, Music, Heart, Sun, Anchor, Coffee, MapPin, Clock, ChevronLeft, ChevronRight, ChevronDown, ChevronUp, Palette, Maximize2, ZoomIn, ZoomOut } from 'lucide-react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

// Lazy load heavy components
const CookieChaseGame = lazy(() => import('./components/CookieChaseGame'));

let confettiInstance = null;

const fireConfetti = async (options = {}) => {

  if (typeof process !== 'undefined' && process.env?.NODE_ENV === 'test') {
    return;
  }

  if (typeof window !== 'undefined') {

    const mediaQuery = typeof window.matchMedia === 'function'
      ? window.matchMedia('(prefers-reduced-motion: reduce)')
      : null;

    if (mediaQuery?.matches) {

      return;

    }

    if (typeof HTMLCanvasElement === 'undefined' || typeof HTMLCanvasElement.prototype?.getContext !== 'function') {

      return;

    }

  }

  if (!confettiInstance) {

    try {

      const importedModule = await import('canvas-confetti');

      confettiInstance = importedModule.default ?? importedModule;

    } catch (error) {

      console.error('Failed to load confetti module', error);

      return;

    }

  }

  confettiInstance?.(options);

};



/* --- CSS & FONTS --- */

const styles = `

  /* Fonts are now loaded via <link> tags in index.html for faster rendering */



  :root {

    --stone: #EDEDE3;
    --stone-muted: #D4CDC2;
    --peach-deep: #D88D66;
    --peach-soft: #EBBA9A;
    --ink: #3B2F2A;
    --ink-soft: #3B2F2A;
    --canvas: #FDF9F4;

    --paper-texture: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140' viewBox='0 0 140 140'%3E%3Cdefs%3E%3Cfilter id='grain'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.55' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='%23fdf9f4'/%3E%3Crect width='100%25' height='100%25' filter='url(%23grain)' opacity='0.07'/%3E%3Cline x1='0' y1='0' x2='0' y2='140' stroke='%23d4cdc2' stroke-width='0.35' opacity='0.23'/%3E%3Cline x1='0' y1='0' x2='140' y2='0' stroke='%23d4cdc2' stroke-width='0.35' opacity='0.2'/%3E%3C/svg%3E");

  }



  html { 
    scroll-behavior: smooth; 
  }

  .scroll-container {
    scroll-snap-type: y proximity;
    scroll-behavior: smooth;
    overflow-y: scroll;
    height: 100vh;
    -webkit-overflow-scrolling: touch;
  }

  /* Disable scroll-snap on mobile for better usability */
  @media (max-width: 768px) {
    .scroll-container {
      scroll-snap-type: none;
    }
  }

  .scroll-section {
    scroll-snap-align: start;
    scroll-snap-stop: always;
    min-height: 100vh;
    position: relative;
    display: flex;
    flex-direction: column;
  }

  /* Footer section should allow full-width backgrounds */
  #footer.scroll-section {
    display: block;
    width: 100%;
  }

  /* Remove snap-stop from long content sections for smoother scrolling */
  .scroll-section-long {
    scroll-snap-stop: normal;
    min-height: 60vh;
  }



  body {

    background-color: var(--canvas);

    background-image: var(--paper-texture);

    color: var(--ink);

    font-family: 'Inter', sans-serif;

    overflow: hidden;

    -webkit-font-smoothing: antialiased;

    -moz-osx-font-smoothing: grayscale;

  }



  h1, h2, h3, .font-hand {

    font-family: 'Crimson Pro', serif;
    font-weight: 600;

  }

  /* Allow font-bold to override the default weight */
  h1.font-bold, h2.font-bold, h3.font-bold, .font-hand.font-bold {
    font-weight: 700 !important;
  }



  .font-script {

    font-family: 'Kalam', cursive;
    font-weight: 400;

  }



  /* --- Utility Classes for Custom Colors (Fixes Contrast Issues) --- */

  .text-navy { color: var(--ink) !important; }

  .text-navy\/80 { color: rgba(59, 47, 42, 0.8) !important; }

  .text-navy\/75 { color: rgba(59, 47, 42, 0.75) !important; }

  .text-navy\/70 { color: rgba(59, 47, 42, 0.7) !important; }

  .text-navy\/60 { color: rgba(59, 47, 42, 0.6) !important; }

  .text-navy\/50 { color: rgba(59, 47, 42, 0.5) !important; }

  .text-navy\/30 { color: rgba(59, 47, 42, 0.3) !important; }

  .text-espresso { color: var(--ink-soft); }

  .bg-navy { background-color: var(--ink); }

  .bg-espresso { background-color: var(--ink-soft); }

  .text-cream { color: var(--stone); }

  .border-navy\/20 { border-color: rgba(212, 205, 194, 0.4) !important; }

  .border-navy\/10 { border-color: rgba(212, 205, 194, 0.2) !important; }

  .nav-shell {
    background: linear-gradient(180deg, rgba(253, 249, 244, 0.95), rgba(237, 237, 227, 0.95));
    border-radius: 999px;
    border: 1px solid rgba(212, 205, 194, 0.6);
    box-shadow: 0 18px 45px rgba(59, 47, 42, 0.12);
  }

  .nav-link {
    color: var(--ink);
    transition: color 0.2s ease, transform 0.2s ease;
  }

  .nav-link:hover,
  .nav-link:focus-visible {
    color: var(--peach-deep);
  }

  /* Skip link for accessibility */
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
  }

  .sr-only:focus {
    position: fixed;
    width: auto;
    height: auto;
    padding: 0.5rem 1rem;
    margin: 0;
    overflow: visible;
    clip: auto;
    white-space: normal;
    z-index: 9999;
  }

  .nav-panel {
    background: linear-gradient(180deg, rgba(253, 249, 244, 0.98), rgba(237, 237, 227, 0.96));
    border-radius: 28px;
    border: 1px solid rgba(212, 205, 194, 0.6);
    box-shadow: 0 20px 45px rgba(59, 47, 42, 0.12);
  }

  :root {
    --page-canvas: #FDF9F4;
  }

  .footer-gradient {
    background: var(--page-canvas);
  }

  

  /* --- Sketchy Effects --- */

  .sketchy-border {
    position: relative;
    isolation: isolate;
    border-radius: 18px;
    box-shadow: 2px 2px 0px rgba(58, 49, 43, 0.12);
    transition: transform 0.3s ease;
  }

  

  .sketchy-border::before {
    content: '';
    position: absolute;
    top: -4px;
    left: -4px;
    right: -4px;
    bottom: -4px;
    border: 2px solid var(--ink);
    border-radius: inherit;
    z-index: -1;
    pointer-events: none;
  }



  .sketchy-text {
    text-shadow: 2px 2px 0px rgba(216, 141, 102, 0.35);
  }



  .watercolor-bg {

    background: radial-gradient(circle at 28% 32%, rgba(216, 141, 102, 0.55) 0%, transparent 46%),

                radial-gradient(circle at 70% 72%, rgba(235, 186, 154, 0.55) 0%, transparent 50%);

    filter: blur(60px) opacity(0.38);

    position: absolute;

    top: -20%;

    left: -20%;

    right: -20%;

    bottom: -20%;

    width: 140%;

    height: 140%;

    z-index: -1;

    pointer-events: none;

  }



  .modern-input {

    width: 100%;

    border: 2px solid var(--text-navy);

    border-radius: 255px 15px 225px 15px / 15px 225px 15px 255px;

    padding: 12px 16px;

    background: rgba(255, 255, 255, 0.8);

    color: var(--text-navy);

    font-family: 'Patrick Hand', cursive;

    font-size: 1.2rem;

    transition: all 0.2s;

  }



  @media (prefers-reduced-motion: reduce) {

    html,
    .scroll-container {
      scroll-behavior: auto;
    }

    *,
    *::before,
    *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }

  }

  .modern-input:focus {
    outline: none;
    border-color: var(--accent-pink);
    transform: scale(1.01) rotate(-0.5deg);
    box-shadow: 4px 4px 0px rgba(184, 212, 232, 0.4), 0 0 0 3px rgba(212, 165, 165, 0.2);
  }

  .modern-input:focus-visible {
    outline: 2px solid var(--accent-pink);
    outline-offset: 2px;
  }



  .washi-tape {

    position: absolute;

    height: 35px;

    width: 110px;

    background-color: var(--accent-pink);

    opacity: 0.9;

    transform: rotate(-2deg);

    z-index: 10;

    mask-image: url("data:image/svg+xml,%3Csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3E%3Crect x='0' y='0' width='100%25' height='100%25' fill='black'/%3E%3C/svg%3E");

    -webkit-mask-box-image: url("data:image/svg+xml,%3Csvg width='20' height='10' viewBox='0 0 20 10' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0 L10 10 L20 0 Z' fill='black'/%3E%3C/svg%3E");

  }



  @keyframes float {

    0% { transform: translateY(0px) rotate(0deg); }

    50% { transform: translateY(-10px) rotate(2deg); }

    100% { transform: translateY(0px) rotate(0deg); }

  }

  .animate-float { animation: float 4s ease-in-out infinite; }

  

  @keyframes fadeInUp {

    from {

      opacity: 0;

      transform: translateY(30px);

    }

    to {

      opacity: 1;

      transform: translateY(0);

    }

  }

  /* --- Cookie Game Styles --- */
  .game-sketchy-border {
    border: 4px solid #3B2F2A;
    border-radius: 255px 15px 225px 15px / 15px 225px 15px 255px;
    position: relative;
    background: #EDEDE3;
  }

  .game-sketchy-border::before {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    border: 2px solid rgba(212, 165, 165, 0.3);
    border-radius: 255px 15px 225px 15px / 15px 225px 15px 255px;
    pointer-events: none;
  }

  .game-texture-overlay {
    background-image: 
      radial-gradient(circle at 2px 2px, rgba(0,0,0,0.08) 1px, transparent 0),
      radial-gradient(circle at 1px 1px, rgba(0,0,0,0.04) 1px, transparent 0);
    background-size: 8px 8px, 12px 12px;
    opacity: 0.3;
    position: absolute;
    inset: 0;
    pointer-events: none;
  }

  .dotted-background {
    background-image: 
      radial-gradient(circle at 1px 1px, rgba(59, 47, 42, 0.18) 1.5px, transparent 0);
    background-size: 20px 20px;
    background-position: 0 0;
  }

  .game-beach-bg {
    background: 
      linear-gradient(to bottom, #EBBA9A 0%, #EBBA9A 40%, #EDEDE3 40%, #EDEDE3 100%),
      radial-gradient(ellipse at bottom, rgba(255,255,255,0.3) 0%, transparent 70%);
    position: relative;
  }

  .game-beach-bg::before {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 20%;
    background: 
      repeating-linear-gradient(90deg, transparent, transparent 20px, rgba(255,255,255,0.1) 20px, rgba(255,255,255,0.1) 21px),
      linear-gradient(to top, #3B2F2A 0%, #D4CDC2 100%);
  }

  .palm-tree {
    position: absolute;
    width: 40px;
    height: 80px;
    background: #3B2F2A;
    clip-path: polygon(30% 0%, 70% 0%, 65% 100%, 35% 100%);
  }

  .palm-tree::before {
    content: '🌴';
    position: absolute;
    top: -20px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 30px;
  }

  .cookie-dialogue {
    position: relative;
    background: white;
    border: 3px solid #3B2F2A;
    border-radius: 20px 20px 20px 5px;
    padding: 10px 12px;
    font-family: 'Kalam', cursive;
    font-size: 12px;
    color: #3B2F2A;
    box-shadow: 4px 4px 0px rgba(212, 165, 165, 0.3);
    max-width: 220px;
    line-height: 1.4;
  }
  
  @media (min-width: 768px) {
    .cookie-dialogue {
      padding: 12px 16px;
      font-size: 14px;
      max-width: 250px;
    }
  }

  .cookie-dialogue::before {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 20px;
    width: 0;
    height: 0;
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    border-top: 8px solid white;
  }

  .cookie-dialogue::after {
    content: '';
    position: absolute;
    bottom: -11px;
    left: 19px;
    width: 0;
    height: 0;
    border-left: 9px solid transparent;
    border-right: 9px solid transparent;
    border-top: 9px solid #3B2F2A;
  }

  .paw-button {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background: white;
    border: 4px solid #3B2F2A;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15), 0 0 0 2px rgba(212, 165, 165, 0.3);
    transition: all 0.2s;
    position: relative;
  }

  .paw-button:active {
    transform: scale(0.9);
    box-shadow: 0 2px 6px rgba(0,0,0,0.2);
  }

  .paw-button::before {
    content: '';
    position: absolute;
    inset: 2px;
    border: 2px solid rgba(212, 165, 165, 0.2);
    border-radius: 50%;
  }

  @keyframes buttonPress {
    0% { transform: scale(1); }
    50% { transform: scale(0.85); }
    100% { transform: scale(1); }
  }

  .paw-button.pressed {
    animation: buttonPress 0.15s ease-out;
  }

  /* --- Countdown Timer Styles --- */
  .countdown-box {
    position: relative;
    border-radius: 28px;
  }

  .countdown-unit {
    display: flex;
    flex-direction: column;
    align-items: center;
    min-width: 70px;
  }

  .countdown-number {
    font-family: 'Kalam', cursive;
    font-weight: 700;
    font-size: 1.75rem;
    line-height: 1;
  }

  .countdown-label {
    font-family: 'Kalam', cursive;
    font-size: 0.65rem;
    letter-spacing: 0.05em;
    margin-top: 0.25rem;
    font-weight: 600;
    text-transform: uppercase;
  }

  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
  }

  .countdown-milestone {
    animation: pulse 0.5s ease-in-out;
  }

  .animate-fade-in {

    animation: fadeInUp 0.6s ease-out forwards;

  }

  

  .photo-frame {

    padding: 12px;

    background: var(--canvas);

    box-shadow: 0 10px 15px -3px rgba(216, 141, 102, 0.1);

    transition: transform 0.3s ease, box-shadow 0.3s ease;

  }

  .photo-frame:hover {

    transform: scale(1.02) rotate(0deg) !important;

    box-shadow: 0 20px 25px -5px rgba(216, 141, 102, 0.15), 0 10px 10px -5px rgba(216, 141, 102, 0.1);

    z-index: 10;

  }

  /* --- Game Styles --- */
  
  @keyframes gamePulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
  }

  .game-obstacle-catch {
    animation: gamePulse 0.3s ease-out;
  }

  /* --- Mario Miranda Style Components --- */
  
  .page-shell {
    min-height: 100vh;
    background-color: var(--canvas);
    background-image: var(--paper-texture);
    background-size: cover;
  }

  .section-panel {
    max-width: 960px;
    margin: 0 auto;
    padding: 3.5rem 1.75rem;
    border-radius: 20px;
    border: 2px solid rgba(58, 49, 43, 0.14);
    box-shadow: 0 12px 30px rgba(58, 49, 43, 0.12);
    background: var(--panel-bg, #FDF9F4);
    position: relative;
  }

  .section-panel::before {
    content: '';
    position: absolute;
    inset: 10px;
    border-radius: 18px;
    border: 1px dashed rgba(58, 49, 43, 0.08);
    pointer-events: none;
  }

  .section-panel--sunset { --panel-bg: #FDF9F4; }
  .section-panel--ocean { --panel-bg: #FDF9F4; }

  .signboard {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0.6rem 1.8rem;
    margin-bottom: 2rem;
    background: linear-gradient(135deg, #EBBA9A, #D88D66);
    border-radius: 999px;
    position: relative;
    box-shadow: 0 6px 0 rgba(58, 49, 43, 0.35);
    max-width: 100%;
  }

  @media (min-width: 768px) {
    .signboard {
      padding: 0.75rem 2.5rem;
      margin-bottom: 2.5rem;
    }
  }

  .signboard::before,
  .signboard::after {
    content: '';
    position: absolute;
    width: 10px;
    height: 10px;
    border-radius: 999px;
    background: var(--bg-ivory);
    top: 50%;
    transform: translateY(-50%);
  }

  .signboard::before { left: -18px; }
  .signboard::after { right: -18px; }

  @media (max-width: 768px) {
    .signboard::before,
    .signboard::after {
      display: none;
    }
  }

  .signboard__text {
    font-family: 'Kalam', system-ui, sans-serif;
    font-weight: 700;
    letter-spacing: 0.04em;
    font-size: 1rem;
    text-transform: uppercase;
    color: white !important;
    text-shadow: 1px 1px 2px rgba(0,0,0,0.2);
  }

  @media (min-width: 768px) {
    .signboard__text {
      font-size: 1.25rem;
    }
  }

  .signboard--dark .signboard__text {
    color: white;
  }

  .signboard--dark::before,
  .signboard--dark::after {
    background: var(--text-navy);
  }

  .postcard {
    background: #FDF9F4;
    border-radius: 16px;
    border: 1px solid rgba(0,0,0,0.18);
    padding: 1.75rem 1.5rem;
    position: relative;
    box-shadow: 0 10px 24px rgba(0,0,0,0.10);
    background-image: linear-gradient(90deg, rgba(0,0,0,0.04) 1px, transparent 1px);
    background-size: 12px 100%;
  }

  /* Decorative stamp removed to keep the postcard minimal */

  .section-divider {
    position: relative;
    height: 1px;
    margin: 3rem 0;
  }

  .section-divider::before {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    top: 50%;
    border-top: 1px solid rgba(58,49,43,0.12);
    transform: translateY(-50%);
  }

  @keyframes sway {
    0%, 100% { transform: rotate(-1deg); }
    50% { transform: rotate(1deg); }
  }

  .string-lights {
    transform-origin: 0 0;
    animation: sway 6s ease-in-out infinite;
  }

  .goa-mini-map {
    position: relative;
    width: 100%;
    max-width: 420px;
    aspect-ratio: 3 / 4;
    margin: 0 auto;
    border-radius: 18px;
    border: 2px solid rgba(58,49,43,0.22);
    background: linear-gradient(to bottom, #FDF9F4 55%, #FDF9F4 55%);
    overflow: hidden;
  }

  .goa-mini-map::before {
    content: '';
    position: absolute;
    left: 40%;
    top: 30%;
    width: 120%;
    height: 200%;
    background: radial-gradient(circle at 0 50%, #FDF9F4 40%, transparent 41%);
    opacity: 0.85;
  }

  .goa-mini-map__pin {
    position: absolute;
    width: 14px;
    height: 14px;
    border-radius: 999px;
    border: 2px solid var(--text-navy);
    background: var(--accent-pink);
    box-shadow: 0 0 0 3px rgba(216,141,102,0.35);
    cursor: pointer;
    transition: transform 0.2s;
  }

  .goa-mini-map__pin.is-active {
    transform: scale(1.25);
    z-index: 10;
  }

  @media (prefers-reduced-motion: reduce) {
    .string-lights {
      animation: none;
    }
  }

`;

const GOOGLE_CALENDAR_URL = 'https://calendar.google.com/calendar/render?action=TEMPLATE&text=Shubs%20%26%20Alysha%20Wedding%20Celebration&dates=20260320T140000Z/20260320T180000Z&details=Celebrate%20with%20us%20in%20Goa.%20RSVP%20and%20travel%20info%20on%20our%20site.&location=Blu%20Missel%20by%20the%20River%2C%20Fondvem%2C%20Ribandar%2C%20Goa%2C%20India';
const VENUE_GOOGLE_MAPS_URL = 'https://www.google.com/maps/search/?api=1&query=Blu+Missel+by+the+River,+Fondvem,+Ribandar,+Goa,+India';
// Consistent spacing scale for better visual rhythm - reduced for seamless sections
const SECTION_PADDING = 'px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16';
const SECTION_SPACING = 'py-8 md:py-12 lg:py-16 xl:py-20';

// Typography constants
const TYPO_H1 = 'text-3xl md:text-4xl lg:text-5xl font-hand font-bold'; // Section titles
const TYPO_H2 = 'text-2xl md:text-3xl font-hand font-bold'; // Major card titles
const TYPO_BODY = 'text-base md:text-lg font-normal leading-relaxed'; // Body text
const TYPO_LABEL = 'text-xs md:text-sm font-hand font-semibold uppercase tracking-wider'; // Labels/captions

// Card pattern constants
const CARD_PRIMARY = 'rounded-2xl border border-[#D4CDC2]'; // Primary narrative cards
const CARD_SECONDARY = 'rounded-xl border border-[#D4CDC2]'; // Secondary cards
const CARD_PHOTO = 'sketchy-border'; // Photo frames (uses CSS class)

// Spacing constants
const SPACE_GRID_SM = 'gap-6'; // Small grid gaps
const SPACE_GRID_MD = 'gap-8'; // Medium grid gaps
const SPACE_GRID_LG = 'gap-12'; // Large grid gaps
const CARD_PAD_SM = 'p-4 md:p-5'; // Small card padding
const CARD_PAD_MD = 'p-6 md:p-8'; // Medium card padding
const CARD_PAD_LG = 'p-8 md:p-10'; // Large card padding

/* --- Mario Miranda Style Components --- */

const SignboardHeading = ({ children, variant = 'light' }) => {
  return (
    <div className={`signboard ${variant === 'dark' ? 'signboard--dark' : ''}`}>
      <h2 className="signboard__text">{children}</h2>
    </div>
  );
};

const Postcard = ({ children, className = '' }) => {
  return <div className={`postcard ${className}`}>{children}</div>;
};

const SectionDivider = () => {
  return <div className="section-divider" />;
};

// Hook to detect prefers-reduced-motion
const useReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return prefersReducedMotion;
};

const FadeInWhenVisible = memo(({ children, delay = 0, className = '', variant = 'normal' }) => {

  const controls = useAnimation();
  const prefersReducedMotion = useReducedMotion();

  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1, rootMargin: '100px' });

  // Define translate distances based on variant
  const translateY = variant === 'emphasized' ? 16 : variant === 'subtle' ? 8 : 12;

  useEffect(() => {

    if (inView) {

      controls.start('visible');

    }

  }, [inView, controls]);



  return (

    <motion.div

      ref={ref}

      className={className}

      variants={{

        hidden: prefersReducedMotion 
          ? { opacity: 0 }
          : { opacity: 0, y: translateY },

        visible: prefersReducedMotion
          ? { opacity: 1 }
          : { opacity: 1, y: 0 }

      }}

      initial="hidden"

      animate={controls}

      transition={{ duration: prefersReducedMotion ? 0.2 : 0.28, ease: [0.25, 0.1, 0.25, 1], delay }}

    >

      {children}

    </motion.div>

  );

});

FadeInWhenVisible.displayName = 'FadeInWhenVisible';



const ParallaxWrapper = memo(({ children, offset = 50, className = '', hoverEffect = false }) => {

  const ref = useRef(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({

    target: ref,

    offset: ['start end', 'end start']

  });

  // Reduce parallax offset when reduced motion is preferred
  const adjustedOffset = prefersReducedMotion ? 0 : offset * 0.3; // Make parallax very subtle

  const y = useTransform(scrollYProgress, [0, 1], [adjustedOffset, -adjustedOffset]);

  const smoothY = prefersReducedMotion ? 0 : useSpring(y, { stiffness: 120, damping: 20, mass: 0.2 });



  return (

    <motion.div 
      ref={ref} 
      style={{ y: prefersReducedMotion ? 0 : smoothY }} 
      className={className}
      whileHover={hoverEffect && !prefersReducedMotion ? { scale: 1.02 } : undefined}
      whileTap={hoverEffect && !prefersReducedMotion ? { scale: 0.98 } : undefined}
      transition={hoverEffect ? { type: 'spring', stiffness: 220, damping: 18 } : undefined}
    >

      {children}

    </motion.div>

  );

});

ParallaxWrapper.displayName = 'ParallaxWrapper';



/* --- CUSTOM SKETCHY ICONS --- */

const SketchIcon = ({ type, className }) => {

  const paths = {

    wine: "M12 21v-8m0 0c-2 0-5-1-5-6 0-3 2-5 5-5s5 2 5 5c0 5-3 6-5 6zm-4 8h8",

    palm: "M12 21c0-6 0-10 0-10m0 0c-2-3-6-3-9-1m9 1c2-4 6-4 9-1m-9 1c-3 1-7 4-8 8m8-8c3 1 7 4 8 8",

    plate: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 5v14m-7-7h14",

    bed: "M2 20v-8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v8M2 20h20M4 10V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v4"

  };



  // For simple icons we use Lucide, for complex specific sketches we use these

  if (!paths[type]) return null;



  return (

    <svg 

      viewBox="0 0 24 24" 

      fill="none" 

      stroke="currentColor" 

      strokeWidth="2" 

      strokeLinecap="round" 

      strokeLinejoin="round" 

      className={className}

    >

      <path d={paths[type]} />

    </svg>

  );

};



const ApprovedStamp = () => (

  <div className="absolute -top-6 -right-6 bg-[#D88D66] text-white font-hand text-xl p-4 rounded-full rotate-12 shadow-lg animate-float z-20 border-4 border-white border-dashed transform hover:scale-110 transition-transform cursor-pointer">

    <div className="text-center leading-tight font-bold">

      Cookie &<br/>Bailey<br/>Approved<br/><PawPrint className="w-5 h-5 mx-auto mt-1" />

    </div>

  </div>

);



const Nav = ({ isFamilyMode, onFamilyModeToggle, onRequestFamilyAccess, onNavigate }) => {

  const [isOpen, setIsOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const moreDropdownRef = useRef(null);

  // Close More dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (moreDropdownRef.current && !moreDropdownRef.current.contains(event.target)) {
        setIsMoreOpen(false);
      }
    };

    if (isMoreOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isMoreOpen]);

  

  // Navigation order - change Party to Ceremony
  let allLinks = [

    { name: 'Ceremony', href: '#the-celebration' },

    { name: 'Travel', href: '#travel' },

    { name: 'RSVP', href: '#rsvp' },

    { name: 'Dress', href: '#dress-code' },

    { name: 'Story', href: '#our-story' },

    { name: 'Goa', href: '#explore-goa' },

    { name: 'Q&A', href: '#q-a' }

  ];



  if (isFamilyMode) {

    // Add Kidena House after Travel (position 2), then Family Plan after Kidena House (position 3)
    allLinks.splice(2, 0, { name: 'Kidena House', href: '#kidena-house' });
    allLinks.splice(3, 0, { name: 'Family Plan', href: '#family-itinerary' });

  }

  // For family mode on smaller screens, separate main links from "more" links
  let mainLinks = allLinks;
  let moreLinks = [];
  
  if (isFamilyMode) {
    // Main links: Ceremony, Travel, Kidena House, Family Plan, RSVP, Dress
    mainLinks = allLinks.filter(link => 
      ['Ceremony', 'Travel', 'Kidena House', 'Family Plan', 'RSVP', 'Dress'].includes(link.name)
    );
    // More links: Story, Goa, Q&A
    moreLinks = allLinks.filter(link => 
      ['Story', 'Goa', 'Q&A'].includes(link.name)
    );
  }

  // For desktop (lg and above), use all links
  const desktopLinks = allLinks;



  const handleLinkClick = (event, href, closeMenu = false) => {
    if (onNavigate) {
      event.preventDefault();
      const sectionId = href.replace('#', '');
      onNavigate(sectionId);
    }
    if (closeMenu) {
      setIsOpen(false);
      setIsMoreOpen(false);
    }
  };

  return (

    <header className="fixed top-0 left-0 right-0 z-50 py-4 px-6">
      <nav className="max-w-6xl mx-auto nav-shell px-6 py-3 flex justify-between items-center" aria-label="Main navigation">

        <a href="#" className="text-3xl text-navy font-hand font-bold tracking-wide flex items-center gap-2 sketchy-text">

          S & A 

          {isFamilyMode && <span className="text-xs bg-[#D88D66] text-white px-2 py-0.5 font-sans rotate-3 rounded-sm">FAMILY</span>}

        </a>

        

        {/* Desktop Navigation - lg and above */}
        <div className="hidden lg:flex gap-8 items-center">

          {desktopLinks.map(link => (

            <a 
              key={link.name} 
              href={link.href} 
              onClick={(e) => handleLinkClick(e, link.href)}
              className="text-lg font-hand font-bold nav-link hover:rotate-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D88D66] focus-visible:ring-offset-2 focus-visible:rounded"
              aria-label={`Navigate to ${link.name} section`}
            >

              {link.name}

            </a>

          ))}

          {/* Family Mode Button - Desktop */}
          <button
            onClick={() => {
              if (isFamilyMode) {
                onFamilyModeToggle();
              } else {
                onRequestFamilyAccess();
              }
            }}
            className="ml-4 text-lg font-hand font-bold nav-link hover:rotate-2 transition-all flex items-center gap-2 border-l border-navy/20 pl-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D88D66] focus-visible:ring-offset-2"
            aria-label={isFamilyMode ? "Switch to guest view" : "Switch to family view"}
          >
            {isFamilyMode ? (
              <>
                <Unlock size={18} />
                <span>Guest View</span>
              </>
            ) : (
              <>
                <Lock size={18} />
                <span>Family</span>
              </>
            )}
          </button>

        </div>

        {/* Hamburger menu button - show on mobile/tablet for all modes */}
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className="lg:hidden text-navy focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D88D66] focus-visible:ring-offset-2 focus-visible:rounded" 
          aria-label="Toggle navigation menu" 
          aria-expanded={isOpen}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

      {/* Mobile Hamburger Menu - only show when not in family mode or when hamburger is clicked */}
      {isOpen && (
        <div className="absolute top-24 right-6 left-6 nav-panel p-6 flex flex-col gap-4 lg:hidden rotate-1 z-50">
          {allLinks.map(link => (
            <a 
              key={link.name} 
              href={link.href} 
              onClick={(e) => handleLinkClick(e, link.href, true)} 
              className="text-2xl font-hand font-semibold nav-link text-center border-b border-gray-100 pb-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D88D66] focus-visible:ring-offset-2"
              aria-label={`Navigate to ${link.name} section`}
            >
              {link.name}
            </a>
          ))}

          {/* Family Mode Button */}
          <button
            onClick={() => {
              setIsOpen(false);
              if (isFamilyMode) {
                onFamilyModeToggle();
              } else {
                onRequestFamilyAccess();
              }
            }}
            className="mt-2 text-xl font-hand nav-link text-center border-t border-gray-100 pt-4 flex items-center justify-center gap-2"
          >
            {isFamilyMode ? (
              <>
                <Unlock size={18} />
                <span>Switch to Guest View</span>
              </>
            ) : (
              <>
                <Lock size={18} />
                <span>Family Mode</span>
              </>
            )}
          </button>
        </div>
      )}

      </nav>
    </header>

  );

};



const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [hasCelebrated, setHasCelebrated] = useState({
    100: false,
    50: false,
    30: false,
    7: false,
    1: false
  });

  useEffect(() => {
    const weddingDate = new Date('2026-03-20T15:30:00+05:30').getTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const difference = weddingDate - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });

        // Celebrate milestones
        const milestones = [100, 50, 30, 7, 1];
        milestones.forEach(milestone => {
          if (days === milestone && !hasCelebrated[milestone]) {
            setHasCelebrated(prev => ({ ...prev, [milestone]: true }));
            fireConfetti({
              particleCount: 50,
              spread: 60,
              origin: { y: 0.5 },
              colors: ['#D88D66', '#EBBA9A', '#3B2F2A']
            });
          }
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [hasCelebrated]);

  const units = [
    { value: timeLeft.days, label: 'Days' },
    { value: timeLeft.hours, label: 'Hours' },
    { value: timeLeft.minutes, label: 'Minutes' },
    { value: timeLeft.seconds, label: 'Seconds' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.6 }}
      className={`countdown-box ${CARD_PRIMARY} bg-gradient-to-br from-[#FDF9F4] to-[#EDEDE3] ${CARD_PAD_MD}`}
      style={{ boxShadow: '0 8px 16px rgba(59, 47, 42, 0.1)' }}
    >
      <div className="text-center mb-4">
        <p className={`${TYPO_LABEL} text-[#3B2F2A] mb-2`}>
          Counting down to
        </p>
        <p className={`${TYPO_BODY} text-[#3B2F2A] font-semibold`}>
          March 20, 2026
        </p>
        <div className="w-16 h-1 bg-[#D88D66] mx-auto mt-3 rounded-full opacity-60"></div>
        </div>
      <div className="flex items-center justify-center gap-2 md:gap-3">
        {units.map((unit, index) => (
          <motion.div
            key={unit.label}
            className="countdown-unit bg-[#FDF9F4] border border-[#D4CDC2] rounded-2xl px-4 py-3 text-center"
            animate={unit.value === 0 ? {} : { scale: [1, 1.05, 1] }}
            transition={{ 
              duration: 0.3, 
              delay: index * 0.05,
              repeat: Infinity,
              repeatDelay: 1
            }}
          >
            <span className="countdown-number text-[#3B2F2A] text-2xl md:text-3xl font-bold font-mono">
              {unit.value.toString().padStart(2, '0')}
            </span>
            <span className={`countdown-label ${TYPO_LABEL} text-[#3B2F2A] mt-1 block`}>{unit.label}</span>
          </motion.div>
        ))}
      </div>
      {timeLeft.days <= 1 && timeLeft.days > 0 && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`text-center mt-3 ${TYPO_LABEL} text-[#3B2F2A] font-bold`}
        >
          Almost there! 🎉
        </motion.p>
      )}
    </motion.div>
  );
};

// Hero Logo component with reduced motion support
const HeroLogo = memo(() => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.h1 
      className="text-[4rem] md:text-[5rem] lg:text-[6rem] leading-[0.9] text-navy font-hand select-none relative z-10 sketchy-text inline-block mt-8 md:mt-12" 
      style={{ textShadow: '2px 2px 0px rgba(212, 165, 165, 0.2)' }}
      initial={prefersReducedMotion ? { opacity: 0 } : { scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={prefersReducedMotion 
        ? { duration: 0.3, ease: 'easeOut' }
        : { type: 'spring', stiffness: 120, damping: 14 }
      }
    >
      S<span className="text-[#D88D66]">&</span>A
    </motion.h1>
  );
});

HeroLogo.displayName = 'HeroLogo';

// Venue card with subtle pulse on entry
const VenueCardWithPulse = memo(({ children }) => {
  const prefersReducedMotion = useReducedMotion();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });
  const controls = useAnimation();

  useEffect(() => {
    if (inView) {
      controls.start('visible');
      if (!prefersReducedMotion) {
        // Subtle pulse after entrance
        setTimeout(() => {
          controls.start({ scale: [1, 1.02, 1], transition: { duration: 0.6, ease: 'easeOut' } });
        }, 300);
      }
    }
  }, [inView, controls, prefersReducedMotion]);

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { opacity: 0, y: 12 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.28,
            ease: [0.25, 0.1, 0.25, 1]
          }
        }
      }}
    >
      {children}
    </motion.div>
  );
});

VenueCardWithPulse.displayName = 'VenueCardWithPulse';

const Hero = ({ onScrollToSection }) => (

  <section className={`min-h-screen flex flex-col ${SECTION_PADDING} ${SECTION_SPACING} bg-[#FDF9F4] relative`} aria-label="Hero section">

    <div className="watercolor-bg"></div>

    {/* Doodles - Hidden on mobile to reduce clutter */}
    <ParallaxWrapper offset={30} className="absolute top-24 left-10 hidden md:block">
      <Sun className="w-12 h-12 text-[#D88D66] opacity-60 rotate-12 animate-float" />
    </ParallaxWrapper>

    <ParallaxWrapper offset={-30} className="absolute bottom-32 right-8 hidden md:block">
      <Heart className="w-8 h-8 text-[#EBBA9A] opacity-60 -rotate-6 animate-float" />
    </ParallaxWrapper>

    <FadeInWhenVisible className="w-full max-w-6xl mx-auto relative z-10 flex flex-col md:flex-col">
      
      {/* Mobile: Photo First */}
      <div className="order-1 md:order-2 mb-4 md:mb-0">
        <div className="relative w-full max-w-xl mx-auto">
          <div 
            className="w-full bg-[#EDEDE3] overflow-hidden relative" 
            style={{ minHeight: '280px', maxHeight: '400px' }}
          >
             <img 
               src="/images/hero.jpg" 
               alt="Shubs and Alysha" 
               className="w-full h-full object-cover"
               style={{ objectPosition: 'center center' }}
               width={1024}
               height={890}
               loading="eager"
             />
          </div>
        </div>
      </div>

      {/* Mobile: Text Content Second */}
      <div className="order-2 md:order-1 text-center space-y-4 md:space-y-6 mt-6 md:mt-0">
        {/* Opening Message - More prominent */}
        <p className={`${TYPO_BODY} font-semibold text-navy max-w-2xl mx-auto px-2`}>
          After seven years of choosing each other,<br className="hidden md:block" />
          <span className="md:hidden"> </span>we're making it forever.
        </p>

        {/* S&A Logo */}
        <HeroLogo />

        {/* Names and Invitation */}
        <div className="flex flex-col items-center gap-3 md:gap-4 mt-1 md:mt-2 rotate-[-1deg]">
          <h1 className={`${TYPO_H1} text-navy relative`}>
            Shubs & Alysha
            <svg className="absolute -bottom-2 md:-bottom-3 left-0 w-full h-2 md:h-2.5" viewBox="0 0 100 10" preserveAspectRatio="none">
               <path d="M0,5 Q50,10 100,5" stroke="#D88D66" strokeWidth="2" fill="none" />
            </svg>
          </h1>

          <p className={`${TYPO_BODY} text-navy max-w-xl mx-auto px-2`}>
            invite you to witness our wedding
          </p>

          <p className={`${TYPO_BODY} text-navy mt-1 md:mt-2 italic px-2`}>
            Your presence would mean the world to us.
          </p>
         </div>

        {/* Event Details - More prominent */}
        <div className="max-w-2xl mx-auto mt-8 md:mt-10 lg:mt-12">
          <div className={`${CARD_SECONDARY} bg-[#FDF9F4] border-[#D88D66]/30 ${CARD_PAD_MD} md:${CARD_PAD_LG} text-navy`} style={{ boxShadow: '0 8px 16px -2px rgba(216, 141, 102, 0.15)' }}>
            <div className="flex flex-col md:flex-row md:flex-wrap items-center justify-center gap-3 md:gap-3">
              <div className="flex items-center gap-1.5 md:gap-1.5">
                <Calendar size={14} className="md:w-[16px] md:h-[16px] text-[#D88D66] flex-shrink-0" />
                <span className={`${TYPO_BODY} text-navy`}>Friday, March 20, 2026</span>
              </div>
              <span className="hidden md:block text-[#D88D66] text-xs">·</span>
              <div className="flex items-center gap-1.5 md:gap-1.5">
                <Clock size={14} className="md:w-[16px] md:h-[16px] text-[#D88D66] flex-shrink-0" />
                <span className={`${TYPO_BODY} text-navy`}>3:30 PM onwards</span>
              </div>
              <span className="hidden md:block text-[#D88D66] text-xs">·</span>
              <div className="flex items-center gap-1.5 md:gap-1.5 text-center">
                <MapPin size={14} className="md:w-[16px] md:h-[16px] text-[#D88D66] flex-shrink-0" />
                <span className={`${TYPO_BODY} text-navy`}>Blu Missel, Ribandar, Goa</span>
              </div>
            </div>
          </div>
        </div>
      </div>

    </FadeInWhenVisible>

    {/* Scroll Indicator - Smaller on mobile */}
    <motion.div 
      className="absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 text-navy/30"
      animate={{ y: [0, -10, 0] }}
      transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
    >
      <ArrowDown size={24} className="md:w-8 md:h-8" aria-hidden="true" />
    </motion.div>

  </section>

);



const Story = () => (

  <section id="our-story" className={`${SECTION_SPACING} ${SECTION_PADDING} bg-[#FDF9F4] relative`} aria-label="Our Story">

    <FadeInWhenVisible className="max-w-6xl mx-auto">

      <div className="text-center mb-3 md:mb-4">
        <SignboardHeading>Our Story</SignboardHeading>
      </div>

      {/* Decorative anchor */}
      <ParallaxWrapper offset={20} className="absolute top-32 left-8 hidden md:block pointer-events-none z-0">
        <Heart className="w-6 h-6 text-[#EBBA9A] opacity-30 animate-float" aria-hidden="true" />
      </ParallaxWrapper>

      <div className="space-y-20 md:space-y-28 lg:space-y-32 relative pt-10 md:pt-12">



        {/* 2015 */}

        <div className={`grid md:grid-cols-2 ${SPACE_GRID_MD} items-center mb-20 md:mb-32`}>

          <FadeInWhenVisible delay={0.2} variant="subtle">
            <ParallaxWrapper offset={15} hoverEffect={false} className="sketchy-border p-3 bg-[#FDF9F4] rotate-2 order-2 md:order-1 photo-frame">

            <div className={`overflow-hidden relative ${CARD_PRIMARY} bg-[#EDEDE3]/30 flex items-center justify-center`} style={{ aspectRatio: '3 / 4' }}>
               <img src="/images/firsttime.jpg" className="w-full h-full object-contain sepia-[.3]" alt="The First Time" style={{ objectPosition: 'center bottom' }} loading="lazy" width={696} height={1024} fetchPriority="low" decoding="async" />
            </div>

            <p className={`text-center font-hand text-navy mt-2 ${TYPO_LABEL}`}>Hello, goodbye, sea you in three years</p>

            </ParallaxWrapper>
          </FadeInWhenVisible>

          <div className="order-1 md:order-2">
            <FadeInWhenVisible delay={0} variant="subtle">
              <span className={`inline-block bg-[#D88D66] text-[#FDF9F4] px-3 md:px-4 py-1 ${TYPO_LABEL} mb-3 md:mb-4 rotate-[-2deg] shadow-sm`}>2015</span>
            </FadeInWhenVisible>
            <FadeInWhenVisible delay={0.12}>
              <h3 className={`${TYPO_H2} font-bold text-navy mb-3 md:mb-4`}>The First Time</h3>

              <div className={`${TYPO_BODY} text-navy space-y-2 md:space-y-3`}>

              <p>House party in Bangalore. Her place. His friend insisted he come along.</p>

              <p>They talked for hours that night. Bengali boy from Assam meets Goan girl from Abu Dhabi. The conversation came easy.</p>
              <p>They talked for hours that night. Bengali boy from Assam meets Goan girl from Abu Dhabi. The conversation came easy.</p>

              <p>Then the party ended. They didn't exchange numbers. Three years of complete radio silence.</p>

            </div>
            </FadeInWhenVisible>
          </div>

        </div>



        {/* 2018 */}

        <FadeInWhenVisible delay={0.15}>

          <div className={`grid md:grid-cols-2 ${SPACE_GRID_MD} items-center mb-20 md:mb-32`}>

          <div>

              <span className={`inline-block bg-[#EBBA9A] text-[#FDF9F4] px-3 md:px-4 py-1 ${TYPO_LABEL} mb-3 md:mb-4 rotate-[2deg] shadow-sm`}>July 2018</span>

              <h3 className={`${TYPO_H2} font-bold text-navy mb-3 md:mb-4`}>The Reunion</h3>

              <div className={`${TYPO_BODY} text-navy space-y-2 md:space-y-3`}>

              <p>She starts new job, walks down office corridor, there he is.</p>

              <p>Coffee runs became a daily thing. Then late nights at the office turned into dinners after work. Felt like really good friendship.</p>

              <p>Then someone threw him a half-hearted birthday party. She showed up and realized something had shifted. She cared way more than friends should care about someone's birthday.</p>

              <p>Two weeks later, he kissed her. They were official by the end of July.</p>

            </div>

          </div>

            <ParallaxWrapper offset={-15} hoverEffect={false} className="sketchy-border p-3 bg-[#FDF9F4] -rotate-2 photo-frame">

            <div className={`overflow-hidden relative ${CARD_PRIMARY} bg-[#EDEDE3]/30 flex items-center justify-center`} style={{ aspectRatio: '3 / 4' }}>
               <img src="/images/office.jpg" className="w-full h-full object-contain sepia-[.3]" alt="The Reunion" style={{ objectPosition: 'center bottom' }} loading="lazy" width={666} height={1024} fetchPriority="low" decoding="async" />
            </div>

             <p className={`text-center font-hand text-navy mt-2 ${TYPO_LABEL}`}>From slack DMs to slacking off together</p>

            </ParallaxWrapper>

        </div>

        </FadeInWhenVisible>



        {/* GOA Years */}

        <FadeInWhenVisible delay={0.2}>

          <div className={`grid md:grid-cols-2 ${SPACE_GRID_MD} items-center mb-20 md:mb-32`}>

            <ParallaxWrapper offset={15} hoverEffect={false} className="sketchy-border p-3 bg-[#FDF9F4] rotate-1 order-2 md:order-1 photo-frame">

            <div className={`overflow-hidden relative ${CARD_PRIMARY} bg-[#EDEDE3]/30 flex items-center justify-center w-full`} style={{ aspectRatio: '3 / 4' }}>
               <img 
                 src="/images/goa-scooter.jpg" 
                 className="w-full h-auto object-contain" 
                 alt="Goa Life" 
                 loading="lazy" 
                 width={765} 
                 height={1024} 
                 fetchPriority="low" 
                 decoding="async"
                 onError={(e) => {
                   console.error('Failed to load goa-scooter.jpg, attempting cache bust...');
                   const img = e.target;
                   const originalSrc = img.src;
                   img.src = originalSrc.split('?')[0] + '?v=' + Date.now();
                 }}
                 onLoad={() => {
                   console.log('✓ Successfully loaded goa-scooter.jpg');
                 }}
               />

            </div>

            <p className={`text-center font-hand text-navy mt-2 ${TYPO_LABEL}`}>Goa, dogs & growing together</p>

            </ParallaxWrapper>

          <div className="order-1 md:order-2">

              <span className={`inline-block bg-[#D88D66] text-[#FDF9F4] px-3 md:px-4 py-1 ${TYPO_LABEL} mb-3 md:mb-4 rotate-[-1deg] shadow-sm`}>2018-2025</span>

              <h3 className={`${TYPO_H2} font-bold text-navy mb-3 md:mb-4`}>Building a Life</h3>

              <div className={`${TYPO_BODY} text-navy space-y-2 md:space-y-3`}>

              <p>She took him to Goa. Made it a ritual. Twice a year, every single year. Palolem Beach, Colomb Bay. Their sanctuary. The place they'd go to reset and remember what mattered.</p>

              <p>He didn't trust the ocean at first. She taught him to dive, to let go underwater. He taught her how to stay calm when life felt chaotic.</p>

              <p>Then COVID hit. Bailey had puppies during lockdown. Six of them. They kept four, lost two. First of the toughest things in life they had to face together. When it was time, Shubs brought Bailey to Bangalore. Cookie and Bailey became family.</p>

            </div>

          </div>

        </div>

        </FadeInWhenVisible>



        {/* Proposal */}

        <FadeInWhenVisible delay={0.25}>

          <div className="grid md:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center">

          <div>

              <span className={`inline-block bg-[#EBBA9A] text-[#FDF9F4] px-4 md:px-5 py-1 ${TYPO_LABEL} mb-3 md:mb-4 rotate-[2deg] shadow-sm`}>January 6, 2025</span>

              <h3 className={`${TYPO_H2} font-bold text-navy mb-3 md:mb-4`}>The Question</h3>

              <div className={`${TYPO_BODY} text-navy space-y-2 md:space-y-3`}>

              <p>Back at Palolem Beach. He'd made plans. Plan A: underwater proposal (ring might sink, she might panic). Plan B: Kakolem Beach at sunset (neither wanted the trek that day).</p>

              <p>Plan C won. Keep it simple. Wing it.</p>

              <p>They were walking between Palolem and Colomb, where the two beaches meet. They swam in Palolem, lived in Colomb. This stretch was theirs.</p>

              <p>He stopped. She turned around.</p>

              <p>He was on his knees. Ring in hand. She said yes before he finished asking.</p>

            </div>

          </div>

            <ParallaxWrapper offset={-15} hoverEffect={false} className="sketchy-border p-3 bg-[#FDF9F4] -rotate-1 photo-frame">
             <div className={`overflow-hidden relative ${CARD_PRIMARY} bg-[#EDEDE3]/30 flex items-center justify-center`} style={{ aspectRatio: '3 / 4' }}>
                <img src="/images/proposal.jpg" className="w-full h-full object-contain" alt="The Proposal" style={{ objectPosition: 'center bottom' }} loading="lazy" width={696} height={1024} fetchPriority="low" decoding="async" />
             </div>
             <p className={`text-center font-hand text-navy mt-2 ${TYPO_LABEL}`}>Ring. Sand. Forever.</p>
            </ParallaxWrapper>

      </div>

        </FadeInWhenVisible>

    </div>

    </FadeInWhenVisible>

  </section>

);



// CookieChaseGame is now lazy-loaded from ./components/CookieChaseGame
// Removed inline definition to avoid redeclaration

// Image Modal Component with Zoom
const ImageModal = memo(({ isOpen, image, images, currentIndex, onClose, onNext, onPrev }) => {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const imageRef = useRef(null);
  const containerRef = useRef(null);
  const triggerRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setScale(1);
      setPosition({ x: 0, y: 0 });
      document.body.style.overflow = 'hidden';
      // Store the element that triggered the modal
      triggerRef.current = document.activeElement;
    } else {
      document.body.style.overflow = '';
      // Return focus to the trigger element
      if (triggerRef.current && typeof triggerRef.current.focus === 'function') {
        triggerRef.current.focus();
      }
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        onPrev();
      } else if (e.key === 'ArrowRight') {
        onNext();
      } else if (e.key === '+' || e.key === '=') {
        setScale(prev => Math.min(prev + 0.25, 3));
      } else if (e.key === '-') {
        setScale(prev => Math.max(prev - 0.25, 0.5));
      } else if (e.key === 'Tab') {
        // Focus trap
        const focusableElements = containerRef.current?.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (!focusableElements || focusableElements.length === 0) return;
        
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    // Focus first element when modal opens
    const focusableElements = containerRef.current?.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (focusableElements && focusableElements.length > 0) {
      focusableElements[0].focus();
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, onNext, onPrev]);

  const handleWheel = (e) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      setScale(prev => Math.max(0.5, Math.min(3, prev + delta)));
    }
  };

  const handleMouseDown = (e) => {
    if (scale > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging && scale > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e) => {
    if (e.touches.length === 2) {
      // Pinch zoom
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const distance = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY
      );
      e.touchDistance = distance;
      e.touchScale = scale;
    } else if (scale > 1) {
      setIsDragging(true);
      setDragStart({ x: e.touches[0].clientX - position.x, y: e.touches[0].clientY - position.y });
    }
  };

  const handleTouchMove = (e) => {
    if (e.touches.length === 2) {
      e.preventDefault();
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const distance = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY
      );
      if (e.touchDistance) {
        const newScale = (distance / e.touchDistance) * e.touchScale;
        setScale(Math.max(0.5, Math.min(3, newScale)));
      }
    } else if (isDragging && scale > 1) {
      setPosition({
        x: e.touches[0].clientX - dragStart.x,
        y: e.touches[0].clientY - dragStart.y
      });
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const resetZoom = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  if (!isOpen || !image) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
        onWheel={handleWheel}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        ref={containerRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="image-modal-title"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-[201] w-12 h-12 rounded-full bg-white/95 hover:bg-white shadow-lg flex items-center justify-center text-navy/60 hover:text-navy transition-all"
          aria-label="Close"
        >
          <X size={24} />
        </button>

        {/* Zoom Controls */}
        <div className="absolute top-4 left-4 z-[201] flex gap-2">
          <button
            onClick={() => setScale(prev => Math.min(prev + 0.25, 3))}
            className="w-12 h-12 rounded-full bg-white/95 hover:bg-white shadow-lg flex items-center justify-center text-navy/60 hover:text-navy transition-all"
            aria-label="Zoom in"
          >
            <ZoomIn size={20} />
          </button>
          <button
            onClick={() => setScale(prev => Math.max(prev - 0.25, 0.5))}
            className="w-12 h-12 rounded-full bg-white/95 hover:bg-white shadow-lg flex items-center justify-center text-navy/60 hover:text-navy transition-all"
            aria-label="Zoom out"
          >
            <ZoomOut size={20} />
          </button>
          {scale > 1 && (
            <button
              onClick={resetZoom}
              className="w-12 h-12 rounded-full bg-white/95 hover:bg-white shadow-lg flex items-center justify-center text-navy/60 hover:text-navy transition-all"
              aria-label="Reset zoom"
            >
              <Maximize2 size={20} />
            </button>
          )}
        </div>

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={onPrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-[201] w-12 h-12 rounded-full bg-white/95 hover:bg-white shadow-lg flex items-center justify-center text-navy/60 hover:text-navy transition-all"
              aria-label="Previous image"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={onNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-[201] w-12 h-12 rounded-full bg-white/95 hover:bg-white shadow-lg flex items-center justify-center text-navy/60 hover:text-navy transition-all"
              aria-label="Next image"
            >
              <ChevronRight size={24} />
            </button>
          </>
        )}

        {/* Image Counter */}
        {images.length > 1 && (
          <div id="image-modal-title" className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[201] bg-white/95 px-4 py-2 rounded-full shadow-lg text-navy text-sm">
            {currentIndex + 1} / {images.length}
          </div>
        )}

        {/* Image */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative max-w-full max-h-full"
          style={{
            cursor: scale > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default',
            touchAction: 'none'
          }}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          onClick={(e) => e.stopPropagation()}
        >
          <img
            ref={imageRef}
            src={image.src}
            alt={image.alt}
            className="max-w-full max-h-[90vh] object-contain select-none"
            style={{
              transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
              transition: isDragging ? 'none' : 'transform 0.1s ease-out'
            }}
            draggable={false}
          />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
});

ImageModal.displayName = 'ImageModal';

// Kidena House Image Carousel Component (defined first since KidenaHouse uses it)
const KidenaHouseCarousel = memo(() => {
  const [currentIndex, setCurrentIndex] = useState(1); // Start at 1 because we duplicate first image at start
  const [isPaused, setIsPaused] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [modalImageIndex, setModalImageIndex] = useState(null);
  const images = useMemo(() => [
    { src: '/images/kidena-house.jpg', alt: 'Kidena House - Main View' },
    { src: '/images/kidena-house2.jpg', alt: 'Kidena House - View 2' },
    { src: '/images/kidena-house3.jpg', alt: 'Kidena House - View 3' },
    { src: '/images/kidena-house4.jpg', alt: 'Kidena House - View 4' },
    { src: '/images/kidena-house5.jpg', alt: 'Kidena House - View 5' },
    { src: '/images/hall.jpg', alt: 'Kidena House - Hall' },
    { src: '/images/top.jpg', alt: 'Kidena House - Top View' },
    { src: '/images/spa.jpg', alt: 'Kidena House - Spa' },
    { src: '/images/boat.jpg', alt: 'Kidena House - Boat' },
  ], []);

  // Create endless carousel by duplicating first and last images
  const endlessImages = useMemo(() => [
    images[images.length - 1], // Clone last image at start
    ...images,
    images[0], // Clone first image at end
  ], [images]);

  const nextImage = () => {
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev + 1);
  };

  const prevImage = () => {
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev - 1);
  };

  const goToImage = (index) => {
    setIsTransitioning(true);
    setCurrentIndex(index + 1); // +1 because of the cloned first image
  };

  // Modal handlers
  const openModal = (index) => {
    // Convert carousel index to actual image index
    const actualIndex = index === 0 ? images.length - 1 : index === endlessImages.length - 1 ? 0 : index - 1;
    setModalImageIndex(actualIndex);
  };

  const closeModal = () => {
    setModalImageIndex(null);
  };

  const nextModalImage = () => {
    setModalImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevModalImage = () => {
    setModalImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const currentModalImage = modalImageIndex !== null ? images[modalImageIndex] : null;

  // Handle seamless looping
  useEffect(() => {
    if (!isTransitioning) return;

    const timer = setTimeout(() => {
      // If at the cloned last image (index = endlessImages.length - 1), jump to real first image (index = 1)
      if (currentIndex === endlessImages.length - 1) {
        setIsTransitioning(false);
        setCurrentIndex(1);
      }
      // If at the cloned first image (index = 0), jump to real last image (index = images.length)
      else if (currentIndex === 0) {
        setIsTransitioning(false);
        setCurrentIndex(images.length);
      } else {
        setIsTransitioning(false);
      }
    }, 500); // Match transition duration

    return () => clearTimeout(timer);
  }, [currentIndex, isTransitioning, endlessImages.length, images.length]);

  // Auto-advance carousel every 5 seconds (pauses on hover)
  useEffect(() => {
    if (isPaused) return;
    
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setCurrentIndex((prev) => prev + 1);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, [isPaused]);

  return (
    <div className="relative w-full max-w-5xl md:max-w-6xl mx-auto">
      {/* Carousel Container */}
      <div 
        className="relative w-full"
        style={{ 
          overflow: 'hidden',
          paddingTop: '28px',
          paddingBottom: '28px',
          paddingLeft: '28px',
          paddingRight: '28px'
        }}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div 
          className="flex w-full"
          style={{ 
            transform: `translateX(-${currentIndex * 100}%)`,
            transition: isTransitioning ? 'transform 0.5s ease-in-out' : 'none'
          }}
        >
          {endlessImages.map((image, index) => (
            <div key={index} className="min-w-full flex-shrink-0 w-full">
              <ParallaxWrapper offset={25} hoverEffect className="sketchy-border p-3 bg-white rotate-1 shadow-2xl">
                <div 
                  className="relative bg-white w-full overflow-hidden cursor-pointer"
                  style={{ maxHeight: '70vh' }}
                  onClick={() => openModal(index)}
                >
                  <img 
                    src={image.src} 
                    alt={image.alt} 
                    className="w-full h-auto object-contain block"
                    loading={index === 0 ? "eager" : "lazy"}
                    width={1024}
                    height={768}
                    decoding="async"
                    onError={(e) => {
                      console.error(`Failed to load image: ${image.src}`);
                      console.error('Attempting to reload with cache bust...');
                      const img = e.target;
                      const originalSrc = img.src;
                      // Try reloading with cache bust parameter
                      img.src = originalSrc.split('?')[0] + '?v=' + Date.now();
                    }}
                    onLoad={() => {
                      if (image.src.includes('kidena-house5')) {
                        console.log(`✓ Successfully loaded: ${image.src}`);
                      }
                    }}
                  />
                </div>
              </ParallaxWrapper>
            </div>
          ))}
        </div>

        {/* Navigation Arrows - Only one set */}
        <button
          onClick={prevImage}
          className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 z-30 bg-white hover:bg-white backdrop-blur-sm rounded-full p-3 md:p-4 shadow-xl border-2 border-[#3B2F2A] transition-all hover:scale-110"
          aria-label="Previous image"
          type="button"
        >
          <ChevronLeft size={28} className="md:w-8 md:h-8 text-[#3B2F2A]" />
        </button>
        <button
          onClick={nextImage}
          className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 z-30 bg-white hover:bg-white backdrop-blur-sm rounded-full p-3 md:p-4 shadow-xl border-2 border-[#3B2F2A] transition-all hover:scale-110"
          aria-label="Next image"
          type="button"
        >
          <ChevronRight size={28} className="md:w-8 md:h-8 text-[#3B2F2A]" />
        </button>

        {/* Dots Indicator - Only one set */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex gap-2">
          {images.map((_, index) => {
            // Map to actual index (currentIndex - 1 because of cloned first image)
            const actualIndex = currentIndex === 0 ? images.length - 1 : currentIndex === endlessImages.length - 1 ? 0 : currentIndex - 1;
            return (
              <button
                key={index}
                onClick={() => goToImage(index)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  index === actualIndex
                    ? 'bg-white w-8'
                    : 'bg-white/50 hover:bg-white/75'
                }`}
                aria-label={`Go to image ${index + 1}`}
                type="button"
              />
            );
          })}
                        </div>
      </div>

      {/* Image Modal */}
      <ImageModal
        isOpen={modalImageIndex !== null}
        image={currentModalImage}
        images={images}
        currentIndex={modalImageIndex || 0}
        onClose={closeModal}
        onNext={nextModalImage}
        onPrev={prevModalImage}
      />
    </div>
  );
});

KidenaHouseCarousel.displayName = 'KidenaHouseCarousel';

const KidenaHouse = () => (

  <section id="kidena-house" className={`${SECTION_SPACING} ${SECTION_PADDING} bg-[#FDF9F4] dotted-background text-[#3B2F2A] relative overflow-hidden`} aria-label="Kidena House">

    {/* Subtle background decoration */}
    <div className="absolute inset-0 opacity-5 pointer-events-none">
        <SketchIcon type="palm" className="absolute top-20 right-20 w-96 h-96 text-white" />
                        </div>

    <FadeInWhenVisible className="max-w-6xl mx-auto relative z-10">

      {/* Photo Carousel */}
      <div className="relative">
        <FadeInWhenVisible>
          <KidenaHouseCarousel />
        </FadeInWhenVisible>
      </div>

        {/* Features Grid - 2x2 Layout */}
        <div className="grid md:grid-cols-2 gap-8 mt-14 mb-14">
            
            <div className={`bg-[#FDF9F4] text-navy ${CARD_SECONDARY} border border-[#D88D66] ${CARD_PAD_MD} transition-shadow`} style={{ boxShadow: '0 4px 6px -1px rgba(59, 47, 42, 0.08)' }}>
                <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-[#D88D66]/20 flex items-center justify-center flex-shrink-0">
                        <Home className="w-5 h-5 text-[#D88D66]" />
                    </div>
                    <div className="flex-1">
                        <h3 className={`font-hand ${TYPO_H2} mb-3 text-[#D88D66]`}>The House</h3>
                        <p className={`font-hand ${TYPO_BODY} text-navy`}>6 bedrooms, 9 bathrooms. Private pool and private lake. Three acres. Enough room for everyone.</p>
                    </div>
                </div>
        </div>

            <div className={`bg-[#FDF9F4] text-navy ${CARD_SECONDARY} border border-[#EBBA9A] ${CARD_PAD_MD} transition-shadow`} style={{ boxShadow: '0 4px 6px -1px rgba(59, 47, 42, 0.08)' }}>
                <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-[#EBBA9A]/20 flex items-center justify-center flex-shrink-0">
                        <SketchIcon type="plate" className="w-5 h-5 text-[#EBBA9A]" />
                    </div>
                    <div className="flex-1">
                        <h3 className={`font-hand ${TYPO_H2} mb-3 text-[#D88D66]`}>No Cooking, No Cleaning</h3>
                        <p className={`font-hand ${TYPO_BODY} text-navy`}>Personal chefs cook whatever you're craving - breakfast, lunch, dinner, midnight snacks. Meals get billed to your room. Butlers handle everything else.</p>
                    </div>
                </div>
            </div>

            <div className={`bg-[#FDF9F4] text-navy ${CARD_SECONDARY} border border-[#D88D66] ${CARD_PAD_MD} transition-shadow`} style={{ boxShadow: '0 4px 6px -1px rgba(59, 47, 42, 0.08)' }}>
                <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-[#D88D66]/20 flex items-center justify-center flex-shrink-0">
                        <Sun className="w-5 h-5 text-[#D88D66]" />
                    </div>
                    <div className="flex-1">
                        <h3 className={`font-hand ${TYPO_H2} mb-3 text-[#D88D66]`}>Spa & Steam Room</h3>
                        <p className={`font-hand ${TYPO_BODY} text-navy`}>There's a spa room and steam room. Book a massage with advance notice - we'll arrange it.</p>
                    </div>
                </div>
        </div>

            <div className={`bg-[#FDF9F4] text-navy ${CARD_SECONDARY} border border-[#EBBA9A] ${CARD_PAD_MD} transition-shadow`} style={{ boxShadow: '0 4px 6px -1px rgba(59, 47, 42, 0.08)' }}>
                <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-[#EBBA9A]/20 flex items-center justify-center flex-shrink-0">
                        <Music className="w-5 h-5 text-[#EBBA9A]" />
                    </div>
                    <div className="flex-1">
                        <h3 className={`font-hand ${TYPO_H2} mb-3 text-[#D88D66]`}>Keep Busy (or Don't)</h3>
                        <p className={`font-hand ${TYPO_BODY} text-navy`}>Pool table, PlayStation, bicycles, coracles on the private lake. Or just lounge by the pool all day.</p>
                    </div>
                </div>
            </div>

      </div>

    </FadeInWhenVisible>

  </section>

);



const FamilyItinerary = () => (

  <section id="family-itinerary" className={`${SECTION_SPACING} ${SECTION_PADDING} bg-[#FDF9F4] relative`} aria-label="Family Itinerary">

    <div className="absolute inset-0 opacity-5 pointer-events-none">
    </div>

     <FadeInWhenVisible className="max-w-6xl mx-auto relative z-10">

        <div className="text-center mb-3 md:mb-4">

            <SignboardHeading>The Family Plan</SignboardHeading>

            <p className={`${TYPO_BODY} font-hand text-navy mt-2`}>Your guide to four days in Goa</p>

        </div>

        

        <div className="space-y-8 md:space-y-10">

            {[

                { 
                    day: "Thursday, March 19", 
                    time: "All Day",
                    title: "Arrival & Pool Party", 
                    desc: "Cars will be waiting at the airport. Unpack at your own pace. We'll be serving the best Goan food while everyone hits the pool. Later that night, some of us are heading to Panjim for a pub crawl - Joseph's Bar, Miguel's, all our old haunts. Come along or stay back by the pool.",
                    icon: Home,
                    color: "#D88D66"
                },

                { 
                    day: "Friday, March 20", 
                    time: "Morning",
                    title: "Rehearsal Day", 
                    desc: "Breakfast together at the house. Slow morning, good coffee, no rush. Then the ceremony crew heads to Blu Missel for rehearsal. Kids stay back at Kidena with the pool.",
                    icon: Sun,
                    color: "#D88D66"
                },

                { 
                    day: "Friday, March 20", 
                    time: "Afternoon",
                    title: "The Wedding", 
                    desc: "The wedding. Cars leave Kidena House at 2:30 PM sharp. We'll sort out the mix of rentals and cabs closer to the date. Just be ready on time. (Yes, we're talking to specific family members who are always fashionably late.)",
                    icon: Heart,
                    color: "#D88D66"
                },

                { 
                    day: "Saturday, March 21", 
                    time: "All Day",
                    title: "Recovery & Chill", 
                    desc: "Sleep as late as you want. No agenda. No schedule. Pool, spa, naps - whatever. Later in the evening, we'll meet at Bar Outrigger. Gorgeous spot by the beach with a little cove, perfect for sunset. We'll have drinks and watch the day end together.",
                    icon: Anchor,
                    color: "#D88D66"
                },

                { 
                    day: "Sunday, March 22", 
                    time: "All Day",
                    title: "Rest & Goodbyes", 
                    desc: "Leave whenever your flight leaves. Take your time checking out. We'll be around all day to say proper goodbyes and squeeze in a few more hours together. Thank you for being here for all of this.",
                    icon: Coffee,
                    color: "#D88D66"
                }

            ].map((item, i) => (

                <FadeInWhenVisible key={`${item.day}-${i}`} delay={i * 0.1}>

                    <div className={`bg-[#FDF9F4] ${CARD_SECONDARY} ${CARD_PAD_MD} shadow-sm transition-shadow border-2`} style={{ borderColor: item.color }}>

                        <div className="flex flex-col md:flex-row md:items-start gap-5 md:gap-8">

                            {/* Icon and date column */}
                            <div className="flex-shrink-0 flex items-start gap-4 md:w-64 lg:w-72">

                                <div className="w-16 h-16 rounded-full flex items-center justify-center border-4 flex-shrink-0" style={{ backgroundColor: `${item.color}20`, borderColor: item.color }}>

                                    <item.icon className="w-8 h-8" style={{ color: item.color }} />

                                </div>

                                <div className="flex-1 space-y-1 text-left">

                                    <div className="font-hand font-bold text-navy text-lg md:text-xl">{item.day}</div>

                                    {item.time && (

                                        <div className={`font-hand ${TYPO_LABEL} text-navy`}>{item.time}</div>

                                    )}

                                </div>

                            </div>

                            {/* Content column */}
                            <div className="flex-1 text-left space-y-3">

                                <h3 className="font-hand font-bold text-2xl md:text-3xl" style={{ color: item.color }}>{item.title}</h3>

                                {/* Bold one-liner summary */}
                                {item.summary && (
                                    <p className="font-hand font-bold text-lg md:text-xl text-navy leading-tight">{item.summary}</p>
                                )}

                                <p className={`font-hand ${TYPO_BODY} text-navy`}>{item.desc}</p>

                            </div>

                        </div>

                </div>

                </FadeInWhenVisible>

            ))}

        </div>

     </FadeInWhenVisible>

  </section>

);



const Celebration = ({ isFamilyMode }) => (

  <section id="the-celebration" className={`${SECTION_SPACING} ${SECTION_PADDING} bg-[#FDF9F4] relative`} aria-label="The Celebration">

    <div className="watercolor-bg" style={{ transform: 'scaleY(-1)' }}></div>

    <SectionDivider />

    <FadeInWhenVisible className="max-w-6xl mx-auto">

      <div className="text-center mb-10">
        <SignboardHeading>The Celebration</SignboardHeading>
      </div>



      <div className={`grid lg:grid-cols-2 ${SPACE_GRID_LG} items-start`}>

        <VenueCardWithPulse>
          <ParallaxWrapper
            offset={25}
            hoverEffect
            className={`${CARD_PRIMARY} bg-gradient-to-br from-[#FDF9F4] via-[#FDF9F4] to-[#EDEDE3] border-[#EBBA9A]/30 ${CARD_PAD_MD} rotate-1`}
            style={{ boxShadow: '0 8px 16px rgba(216, 141, 102, 0.15)' }}
          >

            <div className={`w-full overflow-hidden border-2 border-navy ${CARD_PRIMARY} bg-[#FDF9F4]`}>

               <img 

                 src="/images/blu-missel.jpeg" 

                 alt="Blu Missel by the River" 

                 loading="lazy" 

                 className="w-full h-auto block"
                 width={1024}
                 height={683}

               />


            </div>

             <div className={`${CARD_PAD_MD} space-y-6`}>

                <h3 className={`${TYPO_H2} text-navy`}>Friday, March 20, 2026</h3>

                <div className="flex items-start gap-4">

                   <SketchIcon type="palm" className="w-8 h-8 md:w-10 md:h-10 text-[#D88D66] flex-shrink-0" />

                   <div className={`font-hand ${TYPO_BODY} leading-tight`}>

                     <p className="font-bold text-navy">Blu Missel by the River</p>

                     <p className="text-navy">Fondvem, Ribandar, Goa</p>

                     <a
                       href={VENUE_GOOGLE_MAPS_URL}
                       target="_blank"
                       rel="noreferrer"
                       className={`inline-flex items-center gap-2 mt-2 ${TYPO_BODY} text-navy hover:text-[#D88D66] transition-colors`}
                       aria-label="Open Blu Missel location in Google Maps"
                     >
                       <MapPin size={16} />
                       <span>View on Map</span>
                     </a>

                   </div>

                </div>

              <div className={`bg-[#FDF9F4] ${CARD_SECONDARY} border-[#D88D66]/20 ${CARD_PAD_SM}`}>
                <p className={`${TYPO_BODY} text-navy font-bold`}>A ceremony, a celebration</p>
                <p className={`${TYPO_BODY} text-navy mt-3`}>
                  We'll take our vows with God at the center and our loved ones by our side. Then we feast, dance, and stay until the stars come out.
                </p>
              </div>

             </div>

          </ParallaxWrapper>
        </VenueCardWithPulse>



        <div className="relative pt-4 md:pt-8 pl-8 md:pl-12">

           <div className="space-y-14 md:space-y-16">

              {[

                  { time: '3:30 PM', event: 'Ceremony', note: 'Witness us exchange our vows and commit to forever, surrounded by the people we love most.', icon: Heart },

                  { time: '4:30 PM onwards', event: 'Hi-Tea & Photos', note: "We'll be hunting for good light with the photographers. You? Grab refreshments, snap some Polaroids, stick them in our album. We'll be back before you know it.", icon: SketchIcon, type: 'wine' },

                  { time: '6:00 PM', event: 'Cocktails', note: "The bar opens. We'll join you soon. Save some energy for dancing.", icon: SketchIcon, type: 'wine' },

                  { time: '7:15 PM', event: 'Dance Floor', note: "Come dance with us. That's where we'll be most of the night.", icon: Music },

                  { time: '9:00 PM', event: 'Dinner', note: 'Dinner opens, we\'ll keep it open post 10 PM.', icon: SketchIcon, type: 'plate' },

                  { time: '10:00 PM', event: 'Last Call', note: "The music stops. The night doesn't have to.", icon: Sun }

              ].map((item, i) => (

                  <FadeInWhenVisible key={item.event} delay={i * 0.05} className="relative pl-10 md:pl-12 group">

                      <div className="absolute -left-[28px] md:-left-[34px] top-0 w-14 h-14 md:w-16 md:h-16 bg-[#FDF9F4] border-[3px] border-navy rounded-full flex items-center justify-center z-10 group-hover:scale-110 transition-all duration-200" style={{ boxShadow: '0 10px 15px -3px rgba(216, 141, 102, 0.15)' }} onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 15px 20px -3px rgba(216, 141, 102, 0.2)'} onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(216, 141, 102, 0.15)'}>

                         {item.type ? 

                            <SketchIcon type={item.type} className="w-5 h-5 text-navy" /> : 

                            <item.icon className="w-5 h-5 text-navy" />

                         }

                      </div>

                      <h3 className={`font-hand ${TYPO_H2} text-navy mb-2`}>{item.event}</h3>

                      <p className={`font-hand ${TYPO_BODY} text-navy font-bold mb-3`}>{item.time}</p>

                      <p className={`font-hand ${TYPO_BODY} text-navy`}>{item.note}</p>

                  </FadeInWhenVisible>

              ))}

           </div>

        </div>

      </div>

      <div className="mt-10 md:mt-12 flex flex-wrap gap-3 justify-center">
        <a
          href={GOOGLE_CALENDAR_URL}
          target="_blank"
          rel="noreferrer"
          className={`${CARD_SECONDARY} border-[#D88D66]/40 bg-[#FDF9F4] text-navy text-xs font-semibold tracking-wide px-3 py-2 flex items-center justify-center gap-1.5 shadow-sm hover:scale-[1.02] hover:-translate-y-[2px] hover:shadow-md active:scale-[0.98] active:translate-y-[1px] transition-all duration-200`}
          aria-label="Add wedding to Google Calendar"
        >
          <Calendar size={14} />
          Add to Calendar
        </a>
        <a
          href={VENUE_GOOGLE_MAPS_URL}
          target="_blank"
          rel="noreferrer"
          className={`${CARD_SECONDARY} border-[#D88D66]/30 bg-[#FDF9F4] text-navy text-xs font-semibold tracking-wide px-3 py-2 flex items-center justify-center gap-1.5 shadow-sm hover:scale-[1.02] hover:-translate-y-[2px] hover:shadow-md active:scale-[0.98] active:translate-y-[1px] transition-all duration-200`}
          aria-label="Open venue in Google Maps"
        >
          {/* Google/Android logo - simple G icon */}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          <span className="hidden sm:inline">Google</span> Maps
        </a>
      </div>

    </FadeInWhenVisible>

  </section>

);



const DressCode = () => {
  const [copiedColor, setCopiedColor] = useState(null);

  const colors = [
    { name: 'Terracotta', hex: '#D88D66', bg: '#D88D66' },
    { name: 'Blush Sand', hex: '#EBBA9A', bg: '#EBBA9A' },
    { name: 'Linen Ivory', hex: '#EDEDE3', bg: '#EDEDE3' }
  ];

  const copyColorCode = async (hex, colorName) => {
    try {
      await navigator.clipboard.writeText(hex);
      setCopiedColor(colorName);
      setTimeout(() => setCopiedColor(null), 2000);
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = hex;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        setCopiedColor(colorName);
        setTimeout(() => setCopiedColor(null), 2000);
      } catch (fallbackErr) {
        console.error('Failed to copy color code:', fallbackErr);
      }
      document.body.removeChild(textArea);
    }
  };

  return (

    <section className={`${SECTION_SPACING} ${SECTION_PADDING} bg-[#FDF9F4] relative`} aria-label="Dress Code">

      <SectionDivider />

      <FadeInWhenVisible className="max-w-6xl mx-auto relative z-10">

        <div className="text-center mb-3 md:mb-4">

          <SignboardHeading>What to Wear</SignboardHeading>

          <p className={`${TYPO_BODY} font-hand text-navy max-w-2xl mx-auto mt-2`}>Beach formal, but make it yours.</p>

        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-[0.95fr,1.05fr] gap-5 md:gap-8 lg:gap-10 items-start">
          
          {/* Wardrobe Image */}
          <FadeInWhenVisible className="flex justify-center md:justify-start mb-2">
            <ParallaxWrapper 
              offset={18} 
              hoverEffect 
              className="relative max-w-lg w-full"
            >
              <div className={`${CARD_PRIMARY} overflow-hidden`}>
                <img 
                  src="/images/warddrobe.jpg" 
                  alt="Wedding wardrobe inspiration"
                  className="w-full h-auto object-cover"
                  style={{ objectPosition: 'center top' }}
                  loading="lazy"
                  width={400}
                  height={533}
                />
              </div>
            </ParallaxWrapper>
          </FadeInWhenVisible>

          {/* Guidance + Palette */}
          <div className="space-y-5">
            <FadeInWhenVisible className={`bg-[#FDF9F4] ${CARD_SECONDARY} ${CARD_PAD_MD} shadow-sm`}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-[#EBBA9A]/35 flex items-center justify-center">
                  <Sun className="w-5 h-5 text-[#D88D66]" />
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-[#3B2F2A] font-hand">Beach Formal</h3>
              </div>
              <p className={`font-hand ${TYPO_BODY} text-navy mb-3`}>
                Flowing dresses, mid-length skirts, linen suits, easy sandals. We’re on grass,
                sand, and dance floors - pick pieces that breathe and move.
              </p>
            </FadeInWhenVisible>

            <FadeInWhenVisible delay={0.1} className={`bg-[#FDF9F4] ${CARD_SECONDARY} ${CARD_PAD_MD} shadow-sm`}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-[#D88D66]/30 flex items-center justify-center">
                  <Palette className="w-5 h-5 text-[#3B2F2A]" />
                </div>
                <h3 className={`${TYPO_H2} font-hand text-[#3B2F2A]`}>Palette Notes</h3>
              </div>
              <div className="grid grid-cols-3 gap-3 md:gap-4">
                {colors.map((color) => (
                  <motion.div 
                    key={color.name}
                    className="text-center cursor-pointer group"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => copyColorCode(color.hex, color.name)}
                  >
                    <motion.div 
                      className="w-16 h-16 md:w-20 md:h-20 rounded-full shadow-lg border border-[#FDF9F4] mx-auto mb-1.5 relative" 
                      style={{ 
                        backgroundColor: color.bg,
                        boxShadow: `0 6px 18px ${color.bg}55`
                      }}
                    >
                      {copiedColor === color.name && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute inset-0 flex items-center justify-center bg-[#3B2F2A]/20 rounded-full"
                        >
                          <CheckCircle size={20} className="text-white" />
                        </motion.div>
                      )}
                    </motion.div>
                    <h4 className="font-bold text-sm font-hand text-[#3B2F2A] mb-0.5">{color.name}</h4>
                    <p className="font-mono text-xs text-navy/60">{color.hex.toUpperCase()}</p>
                  </motion.div>
                ))}
              </div>
              <p className="text-xs text-navy font-hand italic text-center mt-4">
                Click to copy colors • Or don't. Wear what feels right.
              </p>
            </FadeInWhenVisible>
          </div>

        </div>

      </FadeInWhenVisible>

    </section>

  );

};



const ExploreGoa = () => {
  // On mobile, start with both sections collapsed. On desktop, they're always visible via CSS
  const [expandedSection, setExpandedSection] = useState(null);

  const recommendations = [

    {

      category: "North Goa",

      items: [

        { name: "Joseph's Bar", type: "drink", location: "Fontainhas, Panjim", desc: "Tiny tavern run by Gundu, pouring Tambde Rosa (feni + kokum) in clay cups with old jazz crackling in the background. Ten seats, tons of stories.", mapUrl: "https://maps.app.goo.gl/4QUDG3gTQzyw3MPL6" },

        { name: "Miguel's", type: "drink", location: "Fontainhas, Panjim", desc: "Art deco cocktail room inside a heritage home. Feni old-fashioneds, Burma teak, and small plates that taste like Goa + Lisbon had a chat.", mapUrl: "https://maps.app.goo.gl/8rU2f6Vg1JqZFShcA" },

        { name: "Bombil", type: "food", location: "Campal, Panjim", desc: "Lunch-only thali joint with clam stir fry, dried bombil, giant rice mounds, ceiling fans and grandma-level cooking. Loud, sweaty, perfect.", mapUrl: "https://maps.app.goo.gl/woeqeypdMobEHExQ7" },

        { name: "Kokum Curry", type: "food", location: "Candolim (also in Panjim)", desc: "Saraswat Brahmin home food: coconut-rich curries, six versions of kokum, zero vinegar. A rare peek into Goan Hindu kitchens.", mapUrl: "https://maps.app.goo.gl/iNEK8NQGHXGa9XT48" },

        { name: "Bar Outrigger", type: "drink", location: "Dona Paula", desc: "Rum den hidden in a fishing village. You literally get a treasure map, then 100+ rums, tiki glassware, and waves smacking the rocks.", mapUrl: "https://maps.app.goo.gl/Ui7Q6Ds1WzgrH71d7" }

      ]

    },

    {

      category: "South Goa",

      items: [

        { name: "Tejas Bar", type: "food", location: "Talpona Beach", desc: "Beach shack legends for kalwa sukka (oysters in coconut masala). Eat with your hands, chase with cold beer, lick the spice off.", mapUrl: "https://maps.app.goo.gl/Km7FEL987PiJXUMa6" },

        { name: "Kala Bahia", type: "party", location: "Colomb Bay", desc: "Euro-Goan house party vibes. DJs, espresso martinis, great gigs. Dancing, partying, and good times. Nobody judges your dance face.", mapUrl: "https://maps.app.goo.gl/HiKQ1DyQM28Y9tZc8" },

        { name: "Kakolem Beach", type: "beach", location: "Tiger Beach", desc: "15-minute scramble down a private staircase to a hidden horseshoe bay with a freshwater fall. Bring water, leave nothing.", mapUrl: "https://maps.app.goo.gl/mSfg3UnLz28dPdVV9" },

        { name: "Palolem Beach", type: "beach", location: "South Goa", desc: "The postcard crescent. Hit sunrise before the boat guys wake up - mirror water, palms silhouetted, just you.", mapUrl: "https://maps.app.goo.gl/oTJGboCKsGPkTmCs5" },

        { name: "Le Petit Patnem", type: "party", location: "Patnem Beach", desc: "Daytime grilled fish + rosé, nighttime house/techno and barefoot dancing. Turns into a secret party pad after sunset.", mapUrl: "https://maps.app.goo.gl/cmcbjYpNst3scLet8" }

      ]

    }

  ];



  return (

  <section id="explore-goa" className={`${SECTION_SPACING} ${SECTION_PADDING} bg-[#FDF9F4]`} aria-label="Explore Goa">

    <FadeInWhenVisible className="max-w-6xl mx-auto relative">

        {/* Decorative anchor */}
        <ParallaxWrapper offset={-20} className="absolute top-20 right-8 hidden md:block pointer-events-none z-0">
          <Anchor className="w-6 h-6 text-[#D88D66] opacity-30 animate-float" aria-hidden="true" />
        </ParallaxWrapper>

        <div className="text-center mb-3 md:mb-4">

          <SignboardHeading>Explore Goa</SignboardHeading>

          <p className={`${TYPO_BODY} font-hand text-navy max-w-2xl mx-auto mt-4 md:mt-6`}>
            Come for the wedding, stay for the food and feni. <br className="hidden md:block" />
            Here's how to spend your time.
          </p>

        </div>

        <div className="grid md:grid-cols-2 gap-8 md:gap-12">

          {recommendations.map((section, idx) => {
            const isExpanded = expandedSection === section.category;
            
            return (
              <FadeInWhenVisible key={section.category} delay={idx * 0.1}>
                <div className={`bg-[#FDF9F4] ${CARD_SECONDARY} ${CARD_PAD_LG} transition-all`} style={{ boxShadow: '0 4px 6px -1px rgba(59, 47, 42, 0.08)' }}>
                  
                  {/* Mobile: Collapsible button header */}
                  <button
                    onClick={() => setExpandedSection(isExpanded ? null : section.category)}
                    className="md:hidden w-full flex items-center justify-between text-2xl font-bold text-navy pb-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D88D66] focus-visible:ring-offset-2 transition-all group"
                    aria-expanded={isExpanded}
                    aria-label={`${isExpanded ? 'Collapse' : 'Expand'} ${section.category} section`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full border-2 border-navy flex items-center justify-center transition-all ${isExpanded ? 'bg-[#D88D66] border-[#D88D66]' : 'bg-[#FDF9F4] group-hover:bg-[#D88D66]/10'}`}>
                        {section.category === 'North Goa' ? (
                          <ArrowUp size={14} className={isExpanded ? 'text-white' : 'text-navy'} />
                        ) : (
                          <ArrowDown size={14} className={isExpanded ? 'text-white' : 'text-navy'} />
                        )}
                      </div>
                      <span>{section.category}</span>
                    </div>
                    {isExpanded ? <ChevronUp size={20} className="text-[#D88D66]" /> : <ChevronDown size={20} className="text-navy/60" />}
                  </button>

                  {/* Desktop: Static header */}
                  <h3 className={`hidden md:block ${TYPO_H2} text-navy border-b-2 border-[#D88D66]/40 pb-4 mb-6`}>
                    {section.category}
                  </h3>
                  
                  {/* Mobile divider - only show when expanded */}
                  {isExpanded && (
                    <div className="md:hidden border-b-2 border-[#D88D66]/40 pb-4 mb-6"></div>
                  )}

                  {/* Content area - always visible on desktop, collapsible on mobile */}
                  <motion.div
                    initial={false}
                    animate={{ 
                      height: isExpanded ? 'auto' : 0,
                      opacity: isExpanded ? 1 : 0
                    }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="overflow-hidden md:!h-auto md:!opacity-100"
                  >
                    <div className="space-y-5 md:space-y-6 pt-0 md:pt-0">
                      {section.items.map((item, i) => (
                        <motion.div key={item.name} className="flex gap-4 md:gap-5 items-start group p-3 rounded-lg hover:bg-[#EDEDE3]/50 transition-colors" whileHover={{ x: 6 }}>
                          <div className="w-10 h-10 md:w-12 h-12 rounded-full bg-[#FDF9F4] border-2 border-[#D4CDC2] flex items-center justify-center flex-shrink-0 group-hover:bg-[#D88D66] group-hover:text-[#FDF9F4] group-hover:border-[#D88D66] transition-all shadow-sm group-hover:shadow-md">
                            {item.type === 'drink' && <SketchIcon type="wine" className="w-5 h-5" />}
                            {item.type === 'food' && <SketchIcon type="plate" className="w-5 h-5" />}
                            {item.type === 'beach' && <Sun className="w-5 h-5" />}
                            {item.type === 'party' && <Music className="w-5 h-5" />}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <h4 className="font-bold text-lg md:text-xl text-navy">{item.name}</h4>
                              {item.mapUrl && (
                                <a
                                  href={item.mapUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="flex-shrink-0 text-navy hover:text-[#D88D66] transition-colors"
                                  aria-label={`Open ${item.name} in Google Maps`}
                                  title="Open in Google Maps"
                                >
                                  <MapPin size={18} />
                                </a>
                              )}
                            </div>
                            {item.location && <p className="text-xs md:text-sm text-navy/50 mb-2 italic">{item.location}</p>}
                            <p className={`${TYPO_BODY} text-navy`}>{item.desc}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>

                </div>
              </FadeInWhenVisible>
            );
          })}

            </div>



        <div className="mt-16 md:mt-20 p-8 md:p-10 bg-gradient-to-br from-[#EBBA9A]/20 to-[#D88D66]/10 sketchy-border text-center border-2 border-navy/10 max-w-3xl mx-auto shadow-lg">
          <p className={`${TYPO_BODY} italic font-hand text-navy`}>
            Colomb Bay is where they learned to slow down together. <br className="hidden md:block" />
            Palolem is where they spent most of their time in the water. <br className="hidden md:block" />
            He proposed at Colomb. Go if you can.
          </p>
        </div>

      </FadeInWhenVisible>

    </section>

  );

};



const Travel = ({ isFamilyMode }) => (

  <section id="travel" className={`${SECTION_SPACING} ${SECTION_PADDING} bg-[#FDF9F4] text-[#3B2F2A]`} aria-label="Travel & Stay">

    <SectionDivider />

    <FadeInWhenVisible className="max-w-6xl mx-auto">

      <div className="text-center mb-3 md:mb-4">

        <SignboardHeading variant="dark">Travel & Stay</SignboardHeading>

          <p className={`${TYPO_BODY} font-hand text-navy max-w-lg mx-auto mt-2`}>Pack your sunscreen and sunglasses. We're taking care of the vibes.</p>

      </div>



      <div className="grid md:grid-cols-2 gap-8 md:gap-10 lg:gap-12">

        {/* Card 1: Journey - Ticket Style */}

        <FadeInWhenVisible
          className={`${CARD_PRIMARY} bg-gradient-to-br from-[#FDF9F4] to-[#EDEDE3] text-[#3B2F2A] border-t-[#D88D66]/30 relative group hover:-translate-y-1 transition-transform duration-300`}
          style={{
            clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
            maskImage: 'radial-gradient(circle at left center, transparent 10px, black 10px)',
            boxShadow: '0 8px 16px rgba(216, 141, 102, 0.15)'
          }}
        >

          <div className="absolute left-0 top-0 bottom-0 w-16 bg-[#D88D66] flex items-center justify-center border-r-2 border-dashed border-[#D4CDC2]">

             <div className="-rotate-90 font-hand font-bold text-xl text-white whitespace-nowrap tracking-widest">GOA EXPRESS</div>

          </div>

          <div className={`pl-24 pr-8 py-6 md:py-10 relative`}>

             <div className="absolute top-4 right-4 opacity-30">

                <Anchor className="w-16 h-16 text-[#D4CDC2]" />

             </div>

             <h3 className={`${TYPO_H2} mb-1 font-hand uppercase tracking-wider`}>Boarding Pass</h3>

             <p className={`${TYPO_LABEL} opacity-50 mb-6`}>Ticket to Paradise</p>

             

             <div className={`space-y-4 font-hand ${TYPO_BODY}`}>

                <div className="border-b border-dashed border-[#D4CDC2] pb-3 mb-3">
                    <div className="flex justify-between pb-2">
                    <span className="opacity-60">DESTINATION</span>
                    </div>
                    <div className="space-y-2">
                       <div className="flex justify-between">
                    <span className="font-bold text-lg">Dabolim (GOI)</span>
                          <span className="text-sm opacity-70 font-semibold">28.1 km</span>
                       </div>
                       <div className="flex justify-between">
                          <span className="font-bold text-lg">Mopa (GOX)</span>
                          <span className="text-sm opacity-70 font-semibold">34 km</span>
                       </div>
                    </div>
                 </div>

                <div className="border-b border-dashed border-[#D4CDC2] pb-3 mb-3">
                    <div className="flex justify-between pb-2">
                    <span className="opacity-60">TRANSFER</span>
                    </div>
                    <div className="space-y-2">
                       <div className="flex justify-between">
                          <span className="font-bold text-lg">Dabolim</span>
                          <span className="text-sm opacity-90 font-semibold">35–50 min</span>
                       </div>
                       <div className="flex justify-between">
                          <span className="font-bold text-lg">Mopa</span>
                          <span className="text-sm opacity-90 font-semibold">45 min–1 hr 15 min</span>
                       </div>
                    </div>
                 </div>

                 

                 {isFamilyMode ? (

                     <div className="bg-[#EBBA9A]/30 p-3 rounded-sm mt-4 text-base transform -rotate-1">

                       <p className="font-bold">Family pickup:</p>

                       <p>We're coordinating airport pickups for everyone arriving on March 18. We'll send details closer to the date.</p>

                     </div>

                 ) : (

                     <p className="text-base pt-2 opacity-80">Pre-book a taxi before you land, or use GoaMiles app when you arrive.</p>

                 )}

             </div>

          </div>

          {/* Perforated edge visual */}

          <div className="absolute left-16 top-0 bottom-0 w-[2px] border-l-2 border-dashed border-[#D4CDC2]/80"></div>

          {/* Subtle visual connector to base camp */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full w-8 h-[1px] border-t border-dashed border-[#D4CDC2]/30 hidden md:block"></div>

        </FadeInWhenVisible>

        

        {/* Card 2: Base Camp - Notepad Style */}

        <FadeInWhenVisible
          delay={0.15}
          className={`${CARD_PRIMARY} bg-gradient-to-br from-[#EDEDE3] via-[#FDF9F4] to-[#EDEDE3] text-[#3B2F2A] border-l-[#EBBA9A]/30 ${CARD_PAD_LG} relative overflow-hidden md:hover:-translate-y-1 md:hover:shadow-lg md:hover:rotate-[0.5deg] transition-all duration-250`}
          style={{ boxShadow: '0 8px 16px rgba(216, 141, 102, 0.15)' }}
        >

          <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-36 h-10 bg-[#EBBA9A]/50 rounded-full blur-[2px] opacity-80"></div>
          <div className="absolute top-4 right-4 w-20 h-20 bg-[#FDF9F4]/70 rounded-full blur-3xl pointer-events-none"></div>

          

          {isFamilyMode ? (

            <div className="space-y-6 relative z-10">
              <div className="space-y-3 text-left">
                  <p className={`${TYPO_LABEL} text-navy`}>Your Stay</p>
                <h3 className={`${TYPO_H2} text-[#D88D66]`}>Kidena House</h3>
                <p className={`${TYPO_BODY} text-navy`}>
                  You're with us for the full four days. Rooms are assigned. Fridge is stocked. Pool is ready. Just show up.
                </p>
              </div>

              <div className={`bg-[#FDF9F4] ${CARD_SECONDARY} ${CARD_PAD_SM} ${TYPO_BODY} text-navy shadow-sm`}>
                Six bedrooms, nine bathrooms. Private pool, private lake. Personal chefs, butlers, stocked pantry. Lawns for the kids. Space for every cousin. Just arrive - everything else is sorted.
              </div>

              <div className={`flex flex-wrap items-center gap-4 justify-between bg-[#FDF9F4] ${CARD_SECONDARY} ${CARD_PAD_SM} shadow-sm`}>
                <div>
                  <p className="text-xs uppercase tracking-[0.25em] text-navy">Check-in window</p>
                  <p className="font-hand text-xl text-navy">12:00 PM • March 18–22</p>
                </div>
                <a
                  href="https://maps.app.goo.gl/jftGUT8cBxf2zH1X8"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-[#D88D66] hover:text-navy transition-colors"
                  aria-label="View Kidena House on Google Maps"
                >
                  <MapPin size={18} />
                  Kidena on Maps
                </a>
              </div>
            </div>

          ) : (

            <>
              <h3 className={`${TYPO_H2} mb-6 md:mb-8 font-hand text-center`}>Our Recommendations</h3>

            <ul className={`font-hand ${TYPO_BODY} space-y-5`}>

               <li className="flex gap-3 items-start border-b border-[#D4CDC2] pb-4">

                 <div className="flex-1">

                    <div className="flex items-start justify-between gap-2 mb-1">
                      <p className="font-bold">The Crown Goa</p>
                      <a
                        href="https://www.google.com/maps/search/?api=1&query=The+Crown+Goa+Panaji"
                        target="_blank"
                        rel="noreferrer"
                        className="flex-shrink-0 text-navy hover:text-[#D88D66] transition-colors"
                        aria-label="Open The Crown Goa in Google Maps"
                        title="Open in Google Maps"
                      >
                        <MapPin size={18} />
                      </a>
            </div>

                    <p className={`${TYPO_BODY} text-navy`}><span className="font-bold">15 minutes from the venue.</span> Boutique 5-star perched on a hill in Panaji. River Mandovi views, rooftop pool, spa to decompress the next morning.</p>

                 </div>

               </li>

               <li className="flex gap-3 items-start border-b border-[#D4CDC2] pb-4">

                 <div className="flex-1">

                    <div className="flex items-start justify-between gap-2 mb-1">
                      <p className="font-bold">DoubleTree by Hilton Goa – Panaji</p>
                      <a
                        href="https://www.google.com/maps/search/?api=1&query=DoubleTree+by+Hilton+Goa+Panaji"
                        target="_blank"
                        rel="noreferrer"
                        className="flex-shrink-0 text-navy hover:text-[#D88D66] transition-colors"
                        aria-label="Open DoubleTree by Hilton Goa in Google Maps"
                        title="Open in Google Maps"
                      >
                        <MapPin size={18} />
                      </a>
                    </div>

                    <p className="text-sm opacity-70"><span className="font-bold text-base opacity-90">20 minutes from the venue.</span> Riverside resort, infinity pool, warm cookies at check-in. Good base if you're staying longer to explore Old Goa.</p>

                 </div>

               </li>

               <li className="flex gap-3 items-start border-b border-[#D4CDC2] pb-4">

                 <div className="flex-1">

                    <div className="flex items-start justify-between gap-2 mb-1">
                      <p className="font-bold">The Fern Kadamba Hotel</p>
                      <a
                        href="https://www.google.com/maps/search/?api=1&query=The+Fern+Kadamba+Hotel+Old+Goa"
                        target="_blank"
                        rel="noreferrer"
                        className="flex-shrink-0 text-navy hover:text-[#D88D66] transition-colors"
                        aria-label="Open The Fern Kadamba Hotel in Google Maps"
                        title="Open in Google Maps"
                      >
                        <MapPin size={18} />
                      </a>
                    </div>

                    <p className="text-sm opacity-70"><span className="font-bold text-base opacity-90">10 minutes from the venue.</span> Heritage hotel near Old Goa, best value for families. Lush greenery, pool, spa. Staff will remember your kids' names by day two.</p>

                 </div>

               </li>

               <li className="pt-4">
                  <div className={`max-w-sm mx-auto bg-[#FDF9F4] ${CARD_SECONDARY} border-[#D88D66]/30 ${CARD_PAD_SM} shadow-sm text-center`}>
                    <p className={`font-hand ${TYPO_BODY} text-[#3B2F2A]`}>
                      <span className="font-bold text-[#D88D66] block">Important</span>
                      Book early — March is peak wedding season in Goa.
                    </p>
                  </div>
               </li>

            </ul>
            </>

          )}

        </FadeInWhenVisible>

      </div>

    </FadeInWhenVisible>

  </section>

);



const QnA = () => {

  const questions = [

    { q: "Are kids invited?", a: "Yes! Cookie & Bailey are demanding playmates. Bring the little ones." },

    { q: "What about plus ones?", a: "If your invitation says 'and guest', bring them. If not, we're keeping it intimate." },

    { q: "Open bar?", a: "Yes. We want you celebrating with us all night." },

    { q: "What about gifts?", a: "Just show up. That's enough." },

    { q: "Dietary restrictions?", a: "We'll have vegetarian and non-vegetarian food. Let us know your specific restrictions or allergies in the RSVP form." }

  ];



  return (

  <section id="q-a" className={`${SECTION_SPACING} ${SECTION_PADDING} bg-[#FDF9F4]`} aria-label="Questions & Answers">

    <FadeInWhenVisible className="max-w-6xl mx-auto">

        <div className="text-center mb-3 md:mb-4">

          <SignboardHeading>FAQ</SignboardHeading>

        </div>



        <div className="grid md:grid-cols-2 gap-8">

          {questions.map((item, i) => (

          <FadeInWhenVisible key={item.q} delay={i * 0.05} className={`${CARD_SECONDARY} bg-[#FDF9F4] ${CARD_PAD_MD} rotate-1 hover:rotate-0 transition-all duration-300`} style={{ boxShadow: '0 4px 6px -1px rgba(59, 47, 42, 0.08)' }}>

               <h4 className={`font-bold ${TYPO_H2} font-hand text-navy mb-3 flex items-start gap-3`}>

                 <span className="text-[#D88D66] text-2xl md:text-3xl leading-none flex-shrink-0">?</span> 
                 <span>{item.q}</span>

               </h4>

               <p className={`${TYPO_BODY} text-navy`}>{item.a}</p>

          </FadeInWhenVisible>

          ))}

        <FadeInWhenVisible delay={questions.length * 0.05} className={`${CARD_SECONDARY} bg-gradient-to-br from-[#D88D66]/10 to-[#EBBA9A]/10 border-2 border-[#D88D66]/30 ${CARD_PAD_LG} -rotate-1 hover:rotate-0 transition-all shadow-sm md:col-span-2`}>

             <h4 className={`font-bold ${TYPO_H2} font-hand text-navy mb-4 flex items-start gap-3`}>

                 <Phone size={24} className="text-[#D88D66] flex-shrink-0" />

                 Real Questions?

             </h4>

             <div className={`${TYPO_BODY} text-navy ml-8 space-y-2`}>

                <p className="font-bold text-navy">Contact our coordinator Priya Sharma</p>
                <p>+91 98765 43210</p>
                <p>events@blumissel.com</p>

          </div>

        </FadeInWhenVisible>

      </div>

    </FadeInWhenVisible>

    </section>

  );

};



const RSVP = () => {

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    guests: '1',
    attending: '',
    dietary: '',
    song: ''
  });
  const [submittedAttendance, setSubmittedAttendance] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const modalRef = useRef(null);
  const submitButtonRef = useRef(null);

  const FORMSPREE_ENDPOINT = "https://formspree.io/f/mnnwwold";

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Trim and validate all fields
    const trimmedName = (formData.name || '').trim();
    const trimmedEmail = (formData.email || '').trim();
    const trimmedPhone = (formData.phone || '').trim();
    
    // Clear any previous errors
    setErrorMessage(null);

    // Validate required fields
    if (!trimmedName || !trimmedEmail || !trimmedPhone || !formData.attending) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Create FormData object (native form data format)
      const formDataToSend = new FormData();
      formDataToSend.append('name', trimmedName);
      formDataToSend.append('email', trimmedEmail); // Must be valid email
      formDataToSend.append('phone', trimmedPhone);
      formDataToSend.append('guests', formData.guests);
      formDataToSend.append('attending', formData.attending);
      if (formData.dietary && formData.dietary.trim()) {
        formDataToSend.append('dietary', formData.dietary.trim());
      }
      if (formData.song && formData.song.trim()) {
        formDataToSend.append('song', formData.song.trim());
      }
      formDataToSend.append('_subject', 'Wedding RSVP from ' + trimmedName);
      formDataToSend.append('_format', 'json'); // Request JSON response

      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
        },
        body: formDataToSend, // FormData automatically sets Content-Type with boundary
      });

      const responseData = await response.json();

      if (response.ok) {
        setSubmittedAttendance(formData.attending);
        setSubmitted(true);
        setIsSubmitting(false);
        if (formData.attending === 'Count Me In') {
          fireConfetti({
            particleCount: 120,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#D88D66', '#EBBA9A', '#3B2F2A', '#EDEDE3']
          });
        }
      } else {
        setIsSubmitting(false);
        
        if (responseData.error) {
          setErrorMessage('Error: ' + responseData.error);
        } else if (responseData.errors) {
          const errorMessages = Array.isArray(responseData.errors) 
            ? responseData.errors.map(e => e.message || e).join(', ')
            : JSON.stringify(responseData.errors);
          setErrorMessage('Error: ' + errorMessages);
        } else {
          setErrorMessage('Something went wrong. Please try again or check your connection.');
        }
      }
    } catch (error) {
      setIsSubmitting(false);
      console.error('Submission error:', error);
      setErrorMessage('Network error. Please check your connection and try again.');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error when user starts typing
    if (errorMessage) {
      setErrorMessage(null);
    }
  };

  // Scroll lock for RSVP modals
  useEffect(() => {
    if (submitted) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [submitted]);

  return (

  <section id="rsvp" className={`${SECTION_SPACING} ${SECTION_PADDING} bg-[#FDF9F4] relative`} aria-label="RSVP">

      <SectionDivider />

      {/* Decorative anchor */}
      <ParallaxWrapper offset={15} className="absolute top-16 right-12 hidden md:block pointer-events-none z-0">
        <Heart className="w-6 h-6 text-[#EBBA9A] opacity-30 animate-float" aria-hidden="true" />
      </ParallaxWrapper>

      <FadeInWhenVisible className="max-w-3xl mx-auto relative">

        <Postcard>
          {!submitted && (
            <div className="text-center mb-12 md:mb-14">
              <h2 className={`${TYPO_H1} text-navy mb-4`}>R.S.V.P.</h2>
              <div className="w-24 h-1 bg-gradient-to-r from-transparent via-[#D88D66] to-transparent mx-auto mb-4"></div>
              <p className={`${TYPO_BODY} text-navy font-hand mb-2`}>We want you there.</p>
              <p className="text-navy/60 text-sm md:text-base font-hand">Please let us know if you can make it by January 20, 2026.</p>
            </div>
          )}

        {!submitted && (
          <form id="rsvp-form" action={FORMSPREE_ENDPOINT} method="POST" onSubmit={handleSubmit} className="space-y-7 md:space-y-8">
            {errorMessage && (
              <div className="bg-[#D88D66]/10 border border-[#D88D66] text-navy px-4 py-3 rounded-lg text-sm font-hand">
                {errorMessage}
              </div>
            )}
            <div>
                <label htmlFor="rsvp-name" className="block text-xs font-bold uppercase tracking-widest text-navy/50 mb-2">Full Name(s)</label>
              <input 
                  id="rsvp-name"
                type="text" 
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="modern-input" 
                placeholder="Who are we celebrating with?" 
                required
                maxLength={100}
              />
            </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="rsvp-email" className="block text-xs font-bold uppercase tracking-widest text-navy/50 mb-2">Email</label>
                   <input 
                    id="rsvp-email"
                     type="email" 
                     name="email"
                     value={formData.email}
                     onChange={handleChange}
                     className="modern-input" 
                     placeholder="name@email.com" 
                     required
                     maxLength={254}
                   />
                </div>
                <div>
                  <label htmlFor="rsvp-phone" className="block text-xs font-bold uppercase tracking-widest text-navy/50 mb-2">Phone</label>
                   <input 
                    id="rsvp-phone"
                     type="tel" 
                     name="phone"
                     value={formData.phone}
                     onChange={handleChange}
                     className="modern-input" 
                     placeholder="+91..." 
                     required
                     maxLength={20}
                   />
                </div>
            </div>

              <div className="grid md:grid-cols-2 gap-6">
            <div>
                  <label htmlFor="rsvp-guests" className="block text-xs font-bold uppercase tracking-widest text-navy/50 mb-2">Number of Guests</label>
                <select 
                    id="rsvp-guests"
                  name="guests"
                  value={formData.guests}
                  onChange={handleChange}
                  className="modern-input bg-white"
                >
                  <option value="1">1 Guest</option>
                  <option value="2">2 Guests</option>
                  <option value="3">3 Guests</option>
                  <option value="4">4 Guests</option>
                </select>
                </div>
                <div>
                  <label htmlFor="rsvp-dietary" className="block text-xs font-bold uppercase tracking-widest text-navy/50 mb-2">Dietary Restrictions</label>
                  <input 
                    id="rsvp-dietary"
                    type="text" 
                    name="dietary"
                    value={formData.dietary}
                    onChange={handleChange}
                    className="modern-input" 
                    placeholder="Allergies, vegetarian preferences, etc."
                    maxLength={200}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="rsvp-song" className="block text-xs font-bold uppercase tracking-widest text-navy/50 mb-2 flex items-center gap-2">Song Request</label>
                <input 
                  id="rsvp-song"
                  type="text" 
                  name="song"
                  value={formData.song}
                  onChange={handleChange}
                  className="modern-input" 
                  placeholder="What will guarantee you on the dance floor?"
                  maxLength={100}
                />
            </div>

              <div className="grid md:grid-cols-2 gap-4 pt-2">
              <label className="cursor-pointer group">
                <input 
                  type="radio" 
                  name="attending" 
                  value="Count Me In"
                  checked={formData.attending === 'Count Me In'}
                  onChange={handleChange}
                  className="hidden peer" 
                  required
                />
                <div className="border border-navy/20 sketchy-border p-4 text-center peer-checked:border-navy peer-checked:bg-[#EBBA9A]/20 transition-all hover:bg-gray-50">
                  <Heart className="w-8 h-8 mx-auto mb-2 text-[#D88D66]" />
                  <span className="font-bold text-navy text-sm font-hand">Count Me In</span>
                </div>
              </label>
              <label className="cursor-pointer group">
                <input 
                  type="radio" 
                  name="attending" 
                  value="Cannot Attend"
                  checked={formData.attending === 'Cannot Attend'}
                  onChange={handleChange}
                  className="hidden peer" 
                  required
                />
                <div className="border border-navy/20 sketchy-border p-4 text-center peer-checked:border-navy peer-checked:bg-[#D88D66]/20 transition-all hover:bg-gray-50">
                  <X className="w-8 h-8 mx-auto mb-2 text-navy/60" />
                  <span className="font-bold text-navy text-sm font-hand">Cannot Attend</span>
                </div>
              </label>
            </div>

            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#D88D66] text-[#FDF9F4] font-bold text-lg py-4 mt-2 sketchy-border font-hand hover:bg-[#C97452] transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-[1.02] hover:-translate-y-[2px] active:scale-[0.98] active:translate-y-[1px] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#D88D66] disabled:hover:scale-100 disabled:hover:translate-y-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#EBBA9A] focus-visible:ring-offset-2"
              aria-label="Submit RSVP form"
              ref={submitButtonRef}
            >
                {isSubmitting ? 'Sending...' : 'Submit RSVP'}
            </button>
          </form>
        )}
        </Postcard>

        {/* Success Modal Popup */}
        <AnimatePresence>
          {submitted && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
              onClick={() => {
                setSubmitted(false);
                setSubmittedAttendance(null);
              }}
              ref={modalRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="rsvp-modal-title"
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                onClick={(e) => e.stopPropagation()}
                className={`relative bg-[#FDF9F4] ${CARD_PRIMARY} max-w-md w-full ${CARD_PAD_LG}`}
                style={{ boxShadow: '0 8px 16px rgba(59, 47, 42, 0.1)' }}
              >
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setSubmittedAttendance(null);
                  }}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white hover:bg-gray-100 shadow-md flex items-center justify-center text-navy/60 hover:text-navy transition-all"
                  aria-label="Close"
                >
                  <X size={18} />
                </button>
                <Postcard>
                  <div className="text-center space-y-6">
                    {submittedAttendance === 'Count Me In' ? (
                      <>
                        <CheckCircle size={64} className="mx-auto text-[#D88D66]" />
                        <h3 id="rsvp-modal-title" className="text-3xl font-bold text-navy font-hand">RSVP Sent!</h3>
                        <p className="text-navy">We can't wait to celebrate with you.</p>
                        <button
                          type="button"
                          className="inline-flex items-center gap-2 text-sm font-semibold text-[#D88D66] hover:text-navy transition-colors underline"
                          onClick={() => {
                            setSubmitted(false);
                            setSubmittedAttendance(null);
                          }}
                        >
                          Update my response
                        </button>
                      </>
                    ) : (
                      <>
                        <X size={56} className="mx-auto text-navy/50" />
                        <h3 id="rsvp-modal-title" className="text-3xl font-bold text-navy font-hand">We'll Miss You</h3>
                        <p className={`${TYPO_BODY} text-navy max-w-md mx-auto`}>
                          Thank you for letting us know. We'll share photos and stories after the festivities so you can celebrate from afar.
                        </p>
                        <p className="text-sm text-navy">If plans change, just resubmit the form - we'll make room.</p>
                        <button
                          type="button"
                          className="inline-flex items-center gap-2 text-sm font-semibold text-[#D88D66] hover:text-navy transition-colors underline"
                          onClick={() => {
                            setSubmitted(false);
                            setSubmittedAttendance(null);
                          }}
                        >
                          Send a different RSVP
                        </button>
                      </>
                    )}
                  </div>
                </Postcard>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </FadeInWhenVisible>

    </section>

  );

};



const Footer = ({ isFamilyMode, onOpenGame }) => (

  <footer className="relative text-[#3B2F2A] text-center overflow-hidden py-16 md:py-24 lg:py-32 w-full" style={{ backgroundColor: 'var(--page-canvas)' }}>

    {/* Decorative background elements */}
    <div className="absolute inset-0 opacity-10">
      <div className="absolute top-10 left-10 w-32 h-32 border-2 border-[#EBBA9A]/60 rounded-full transform rotate-12"></div>
      <div className="absolute bottom-20 right-20 w-24 h-24 border-2 border-[#D4CDC2]/70 rounded-full transform -rotate-6"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 border border-[#D4CDC2]/40 rounded-full"></div>
    </div>

    <div className="absolute inset-0 footer-gradient w-full" style={{ backgroundColor: 'var(--page-canvas)' }}></div>

    <div className="relative z-10 max-w-6xl mx-auto space-y-10 md:space-y-14 lg:space-y-18 px-2">

      {/* Main message */}
      <FadeInWhenVisible>
        <div className="space-y-5 md:space-y-6 lg:space-y-8 max-w-3xl mx-auto px-4">
          <p className={`${TYPO_BODY} font-hand text-[#3B2F2A] text-center`}>
            Seven years ago, we found each other again.<br /> Every day since, we've chosen each other.
          </p>
          <p className={`${TYPO_H1} font-hand text-[#3B2F2A] mt-6 md:mt-8 text-center`}>
            Now we're making it official — and we want you there when we say it out loud.
          </p>
          <div className="pt-6 md:pt-8 space-y-2">
            <p className={`${TYPO_BODY} font-hand text-[#3B2F2A] text-center`}>
              Shubs & Alysha
            </p>
            <p className={`${TYPO_BODY} font-hand text-[#3B2F2A] text-center`}>
              March 20, 2026
            </p>
          </div>
        </div>
      </FadeInWhenVisible>

      {/* Countdown Timer */}
      <FadeInWhenVisible delay={0.1}>
        <div className="flex justify-center p-4">
          <CountdownTimer />
        </div>
      </FadeInWhenVisible>

      {/* Cookie & Bailey section */}
      <FadeInWhenVisible delay={0.15}>
        <div className="flex flex-col items-center mt-6 md:mt-8">
          <button
            onClick={onOpenGame}
            className="flex items-center gap-2 md:gap-4 bg-[#EDEDE3] px-4 md:px-8 py-3 md:py-5 sketchy-border border-[3px] border-[#D4CDC2] rounded-lg hover:bg-[#FDF9F4] transition-all group shadow-md cursor-pointer active:scale-95 max-w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D88D66] focus-visible:ring-offset-2"
            aria-label="Play the Cookie & Bailey game"
          >
            <PawPrint size={20} className="md:w-7 md:h-7 text-[#3B2F2A] group-hover:scale-110 transition-transform fill-current flex-shrink-0" /> 
            <span className="text-base md:text-xl lg:text-2xl font-hand font-bold text-[#3B2F2A] whitespace-nowrap">Cookie & Bailey</span>
            <PawPrint size={20} className="md:w-7 md:h-7 text-[#3B2F2A] group-hover:scale-110 transition-transform fill-current flex-shrink-0" />
          </button>
        </div>
      </FadeInWhenVisible>

      {/* Bottom section */}
      <FadeInWhenVisible delay={0.25}>
        <div className="border-t border-[#D4CDC2] pt-8 md:pt-10 lg:pt-12 space-y-3 md:space-y-4 px-2" style={{ backgroundColor: 'var(--page-canvas)' }}>
          <p className="text-sm md:text-base lg:text-lg uppercase tracking-widest text-[#3B2F2A] font-hand font-semibold">
            Made with love, momos & feni
          </p>
          <p className="text-xs md:text-sm lg:text-base text-[#3B2F2A]/80 font-medium">
            Goa 2026
          </p>
        </div>
      </FadeInWhenVisible>


    </div>

  </footer>

);



const MusicPlayer = () => {

  const [playing, setPlaying] = useState(false);
      
  const audioRef = useRef(null);



  useEffect(() => {

    return () => {

      if (audioRef.current) {

        audioRef.current.pause();

      }

    };

  }, []);



  const togglePlayback = () => {

    const audio = audioRef.current;

    if (!audio) return;



    if (playing) {

      audio.pause();

    } else {

      audio.play().catch(() => {});

    }



    setPlaying(!playing);

  };



  return (

    <>

      <button 

        onClick={togglePlayback}

        className="fixed bottom-6 left-6 z-[100] w-16 h-16 md:w-20 md:h-20 bg-[#EDEDE3] sketchy-border border-[3px] border-[#D4CDC2] shadow-md flex flex-col items-center justify-center hover:scale-105 hover:rotate-1 transition-all font-hand font-semibold group"
        style={{ position: 'fixed' }}

        aria-label={playing ? 'Pause background music' : 'Play background music'}

      >

        <Music className="w-6 h-6 text-[#3B2F2A] group-hover:text-[#D88D66] transition-colors" />

        <span className="text-[9px] mt-0.5 tracking-tight text-[#3B2F2A] group-hover:text-[#D88D66] transition-colors">music</span>

      </button>

      <audio ref={audioRef} src="/music/goa-mix.mp3" loop preload="none" />

    </>

  );

};



const FloatingRSVPButton = ({ onScrollToRSVP }) => {

  return (

      <button

      onClick={() => onScrollToRSVP('rsvp')}

      className="fixed bottom-6 right-6 z-[100] bg-[#D88D66] text-[#FDF9F4] sketchy-border border-[3px] border-[#FDF9F4] shadow-md px-6 py-3 flex items-center gap-2 hover:scale-105 hover:rotate-1 transition-all font-hand font-bold text-sm md:text-base group"
      style={{ position: 'fixed' }}

      aria-label="Go to RSVP"

    >

      <Heart className="w-5 h-5 md:w-6 md:h-6 group-hover:scale-110 transition-transform fill-current" />

      <span className="font-bold">RSVP</span>

    </button>

  );

};

const PasswordModal = ({ isOpen, onClose, onConfirm }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const containerRef = useRef(null);
  const triggerRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === 'march20') {
      setError('');
      onConfirm();
      setPassword('');
      onClose();
    } else {
      setError('Incorrect password. Please try again.');
      setPassword('');
    }
  };

  useEffect(() => {
    if (isOpen) {
      triggerRef.current = document.activeElement;
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      if (triggerRef.current && typeof triggerRef.current.focus === 'function') {
        triggerRef.current.focus();
      }
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'Tab') {
        const focusableElements = containerRef.current?.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (!focusableElements || focusableElements.length === 0) return;
        
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    const focusableElements = containerRef.current?.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (focusableElements && focusableElements.length > 0) {
      focusableElements[0].focus();
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        ref={containerRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="password-modal-title"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className={`bg-[#FDF9F4] ${CARD_SECONDARY} ${CARD_PAD_LG} max-w-md w-full`}
          style={{ boxShadow: '0 4px 6px -1px rgba(59, 47, 42, 0.08)' }}
        >
          <h3 id="password-modal-title" className={`${TYPO_H2} font-hand text-navy mb-4 text-center`}>
            Family Mode
          </h3>
          <p className={`${TYPO_BODY} text-navy text-center mb-6 font-hand`}>
            Enter the password to access family-only content
          </p>
          <form onSubmit={handleSubmit}>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              className="modern-input w-full mb-4 text-center font-hand"
              placeholder="Enter password"
              autoFocus
            />
            {error && (
              <p className="text-red-600 text-sm mb-4 text-center font-hand">{error}</p>
            )}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-[#EDEDE3] text-[#3B2F2A] font-hand font-bold py-3 px-4 rounded-lg border border-[#D4CDC2] hover:bg-[#D4CDC2] transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`flex-1 bg-[#D88D66] text-[#FDF9F4] font-hand font-bold py-3 px-4 ${CARD_SECONDARY} hover:bg-[#C97452] transition-colors`}
              >
                Enter
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};







/* --- FLOATING DECORATIVE ELEMENTS --- */

const FloatingPalmTree = () => {

  const { scrollY } = useScroll();

  const y = useTransform(scrollY, [0, 2000], [0, -200]);

  const rotate = useTransform(scrollY, [0, 2000], [0, 15]);



  return (

    <motion.div

      className="fixed bottom-0 right-0 w-24 md:w-32 lg:w-48 h-auto z-30 pointer-events-none opacity-10 md:opacity-20"

      style={{ y, rotate }}

    >

      <SketchIcon type="palm" className="w-full h-full text-[#EBBA9A]" />

    </motion.div>

  );

};



const FloatingMusicNotes = () => {

  const { scrollY } = useScroll();

  const notes = [0, 1, 2];

  const [windowWidth, setWindowWidth] = useState(1200);



  useEffect(() => {

    setWindowWidth(window.innerWidth);

    const handleResize = () => setWindowWidth(window.innerWidth);

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);

  }, []);



  return (

    <>

      {notes.map((i) => {

        const x = useTransform(scrollY, [0, 3000], [windowWidth + 100, -100]);

        const y = useTransform(scrollY, [0, 3000], [100 + i * 150, 100 + i * 150]);

        const rotate = useTransform(scrollY, [0, 3000], [i * 20, i * 20 + 360]);



        return (

          <motion.div

            key={i}

            className="fixed z-30 pointer-events-none opacity-5 md:opacity-10"

            style={{ x, y, rotate }}

          >

            <Music className="w-8 h-8 text-[#D88D66]" />

          </motion.div>

        );

      })}

    </>

  );

};






/* --- DOT NAVIGATION --- */

const DotNav = ({ sections, activeSection, onSectionClick }) => {

  return (

    <div className="fixed right-4 xl:right-10 top-1/2 -translate-y-1/2 z-40 space-y-3 hidden xl:flex flex-col">

      {sections.map((section, i) => {

        const isActive = activeSection === i;

        return (

        <motion.button

          key={section.id}

          onClick={() => onSectionClick(section.id)}

            className={`w-2.5 h-2.5 rounded-full border transition-all relative group focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#D88D66]/60 ${

              isActive

                ? 'border-[#D88D66] bg-[#D88D66]'

                : 'border-navy/20 bg-white/80 hover:border-[#D88D66]/60 hover:bg-[#D88D66]/20'

          }`}

            whileHover={{ scale: 1.1 }}

          whileTap={{ scale: 1.15 }}

          aria-label={`Go to ${section.name || section.id} section`}
          aria-current={isActive ? "true" : undefined}

        >

            <span

              className={`absolute -right-2 top-1/2 -translate-y-1/2 translate-x-full bg-navy text-white text-xs px-2 py-1 rounded font-hand whitespace-nowrap pointer-events-none transition-all duration-200 ${

                isActive

                  ? 'opacity-100'

                  : 'opacity-0 group-hover:opacity-100'

              }`}

            >

              {section.name || section.id}

            </span>

        </motion.button>

        );

      })}

    </div>

  );

};



const App = () => {

  const [isFamilyMode, setIsFamilyMode] = useState(false);

  const [activeSection, setActiveSection] = useState(0);

  const [isGameOpen, setIsGameOpen] = useState(false);

  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const containerRef = useRef(null);

  const handleFamilyModeToggle = () => {
    if (isFamilyMode) {
      setIsFamilyMode(false);
    } else {
      setShowPasswordModal(true);
    }
  };

  const handlePasswordConfirm = () => {
    setIsFamilyMode(true);
  };



  // Define sections for navigation
  const sections = useMemo(() => [

    { id: 'hero', name: 'Home', component: Hero },

    { id: 'the-celebration', name: 'Ceremony', component: Celebration },

    { id: 'travel', name: 'Travel', component: Travel },

    ...(isFamilyMode ? [

      { id: 'kidena-house', name: 'Kidena', component: KidenaHouse },

      { id: 'family-itinerary', name: 'Itinerary', component: FamilyItinerary }

    ] : []),

    { id: 'rsvp', name: 'RSVP', component: RSVP },

    { id: 'dress-code', name: 'Dress', component: DressCode },

    { id: 'our-story', name: 'Story', component: Story },

    { id: 'explore-goa', name: 'Goa', component: ExploreGoa },

    { id: 'q-a', name: 'Q&A', component: QnA }

  ], [isFamilyMode]);



  // Track active section on scroll

  useEffect(() => {

    const container = containerRef.current;

    if (!container) return;

    const handleScroll = () => {

      const scrollTop = container.scrollTop;

      const viewportCenter = scrollTop + container.clientHeight / 2;

      

      // Find which section is currently in view (check which section's center is closest to viewport center)

      let closestSection = 0;

      let closestDistance = Infinity;

      

      for (let i = 0; i < sections.length; i++) {

        const element = document.getElementById(sections[i].id);

        if (element) {

          // Element position relative to container (offsetTop is already relative to container)

          const elementTop = element.offsetTop;

          const elementCenter = elementTop + element.offsetHeight / 2;

          const distance = Math.abs(viewportCenter - elementCenter);

          

          if (distance < closestDistance) {

            closestDistance = distance;

            closestSection = i;

          }

        }

      }

      

      setActiveSection(closestSection);

    };



    container.addEventListener('scroll', handleScroll, { passive: true });

    handleScroll(); // Initial check

    return () => container.removeEventListener('scroll', handleScroll);

  }, [sections]);



  // Scroll to section

  const scrollToSection = (sectionId) => {

    const element = document.getElementById(sectionId);

    const container = containerRef.current;

    if (element && container) {

      // offsetTop is already relative to the container's content area

      const elementTop = element.offsetTop;

      // Scroll the container to the element position

      container.scrollTo({

        top: elementTop,

        behavior: 'smooth'

      });

    }

  };



  return (

    <>

      <style>{styles}</style>

      {/* Floating Action Buttons - Outside scroll container for proper fixed positioning */}
      <MusicPlayer />
      <FloatingRSVPButton onScrollToRSVP={scrollToSection} />
      <PasswordModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        onConfirm={handlePasswordConfirm}
      />

      <div ref={containerRef} className="scroll-container page-shell relative">

        <Nav 
          isFamilyMode={isFamilyMode}
          onFamilyModeToggle={handleFamilyModeToggle}
          onRequestFamilyAccess={handleFamilyModeToggle}
          onNavigate={scrollToSection}
        />

        <DotNav 

          sections={sections} 

          activeSection={activeSection} 

          onSectionClick={scrollToSection}

        />



        {/* Floating Decorative Elements */}

        <FloatingPalmTree />

        <FloatingMusicNotes />



        <main id="main-content">
        <section id="hero" className="scroll-section flex items-center justify-center">

        <Hero onScrollToSection={scrollToSection} />

        </section>



        <section id="the-celebration" className="scroll-section">

        <Celebration isFamilyMode={isFamilyMode} />

        </section>



        <section id="travel" className="scroll-section">

        <Travel isFamilyMode={isFamilyMode} />

        </section>



        {isFamilyMode && (

          <>

            <section id="kidena-house" className="scroll-section">

            <KidenaHouse />

        </section>



            <section id="family-itinerary" className="scroll-section">

            <FamilyItinerary />

        </section>

          </>

        )}



        <section id="rsvp" className="scroll-section">

        <RSVP />

        </section>



        <section id="dress-code" className="scroll-section">

        <DressCode />

        </section>

        

        <section id="our-story" className="scroll-section scroll-section-long">

        <Story />

        </section>



        <section id="explore-goa" className="scroll-section scroll-section-long">

        <ExploreGoa />

            </section>



        <section id="q-a" className="scroll-section scroll-section-long">

        <QnA />

        </section>

        </main>



        <section id="footer" className="scroll-section">

        <Footer 
          isFamilyMode={isFamilyMode}
          onOpenGame={() => setIsGameOpen(true)}
        />

          <Suspense fallback={
            isGameOpen ? (
              <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm">
                <div className="text-center text-navy font-hand">
                  <div className="inline-block w-8 h-8 border-2 border-[#D88D66] border-t-transparent rounded-full animate-spin mb-2"></div>
                  <p className="text-sm">Loading Cookie & Bailey...</p>
                </div>
              </div>
            ) : null
          }>
            <CookieChaseGame isOpen={isGameOpen} onClose={() => setIsGameOpen(false)} />
          </Suspense>

        </section>

      </div>

    </>

  );

};



export default App;


