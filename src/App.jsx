import React, { useState, useRef, useEffect, useMemo, memo } from 'react';

import { Menu, X, ArrowDown, ArrowUp, CheckCircle, Lock, Unlock, Phone, Calendar, Home, PawPrint, Music, Heart, Sun, Anchor, Coffee, MapPin, Clock, ChevronLeft, ChevronRight, ChevronDown, ChevronUp, Palette } from 'lucide-react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

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
    inset: 0;
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

    background: white;

    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);

    transition: transform 0.3s ease, box-shadow 0.3s ease;

  }

  .photo-frame:hover {

    transform: scale(1.02) rotate(0deg) !important;

    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.15), 0 10px 10px -5px rgba(0, 0, 0, 0.1);

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
    color: white;
    text-shadow: 1px 1px 2px rgba(0,0,0,0.2);
  }

  @media (min-width: 768px) {
    .signboard__text {
      font-size: 1.25rem;
    }
  }

  .signboard--dark .signboard__text {
    color: #EDEDE3;
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
const VENUE_APPLE_MAPS_URL = 'http://maps.apple.com/?address=Fondvem,Ribandar,Goa,India&q=Blu+Missel+by+the+River';
// Consistent spacing scale for better visual rhythm - reduced for seamless sections
const SECTION_PADDING = 'px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16';
const SECTION_SPACING = 'py-8 md:py-12 lg:py-16 xl:py-20';

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

const FadeInWhenVisible = memo(({ children, delay = 0, className = '' }) => {

  const controls = useAnimation();

  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1, rootMargin: '100px' });



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

        hidden: { opacity: 0, y: 40 },

        visible: { opacity: 1, y: 0 }

      }}

      initial="hidden"

      animate={controls}

      transition={{ duration: 0.9, ease: 'easeOut', delay }}

    >

      {children}

    </motion.div>

  );

});

FadeInWhenVisible.displayName = 'FadeInWhenVisible';



const ParallaxWrapper = memo(({ children, offset = 50, className = '', hoverEffect = false }) => {

  const ref = useRef(null);

  const { scrollYProgress } = useScroll({

    target: ref,

    offset: ['start end', 'end start']

  });



  const y = useTransform(scrollYProgress, [0, 1], [offset, -offset]);

  const smoothY = useSpring(y, { stiffness: 120, damping: 20, mass: 0.2 });



  return (

    <motion.div 
      ref={ref} 
      style={{ y: smoothY }} 
      className={className}
      whileHover={hoverEffect ? { scale: 1.02, rotate: 0 } : undefined}
      whileTap={hoverEffect ? { scale: 0.98 } : undefined}
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

    <nav className="fixed top-0 left-0 right-0 z-50 py-4 px-6">

      <div className="max-w-6xl mx-auto nav-shell px-6 py-3 flex justify-between items-center">

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

        {/* Tablet/Mobile Navigation - below lg, family mode with More dropdown */}
        {isFamilyMode && (
          <div className="lg:hidden flex gap-4 md:gap-6 items-center">
            {mainLinks.map(link => (
              <a 
                key={link.name} 
                href={link.href} 
                onClick={(e) => handleLinkClick(e, link.href)}
                className="text-sm md:text-base font-hand font-bold nav-link hover:rotate-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D88D66] focus-visible:ring-offset-2 focus-visible:rounded"
                aria-label={`Navigate to ${link.name} section`}
              >
                {link.name}
              </a>
            ))}
            
            {/* More Dropdown */}
            {moreLinks.length > 0 && (
              <div className="relative" ref={moreDropdownRef}>
                <button
                  onClick={() => setIsMoreOpen(!isMoreOpen)}
                  className="text-sm md:text-base font-hand font-bold nav-link hover:rotate-2 transition-all flex items-center gap-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D88D66] focus-visible:ring-offset-2"
                  aria-label="More navigation options"
                  aria-expanded={isMoreOpen}
                >
                  More
                  {isMoreOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                
                {isMoreOpen && (
                  <div className="absolute top-full right-0 mt-2 nav-panel p-3 flex flex-col gap-2 min-w-[120px] z-50 shadow-lg">
                    {moreLinks.map(link => (
                      <a 
                        key={link.name} 
                        href={link.href} 
                        onClick={(e) => handleLinkClick(e, link.href, true)}
                        className="text-sm font-hand font-semibold nav-link text-center py-1 border-b border-gray-100 last:border-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D88D66] focus-visible:ring-offset-2"
                        aria-label={`Navigate to ${link.name} section`}
                      >
                        {link.name}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        

        {/* Hamburger menu - only show when NOT in family mode on mobile/tablet */}
        {!isFamilyMode && (
          <button 
            onClick={() => setIsOpen(!isOpen)} 
            className="lg:hidden text-espresso focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D88D66] focus-visible:ring-offset-2 focus-visible:rounded" 
            aria-label="Toggle navigation menu" 
            aria-expanded={isOpen}
          >
            {isOpen ? <X /> : <Menu />}
          </button>
        )}

      </div>

      

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
      className="countdown-box rounded-3xl bg-gradient-to-br from-[#FDF9F4] to-[#EDEDE3] border border-[#D4CDC2] px-8 py-6"
      style={{ boxShadow: '0 18px 32px rgba(59, 47, 42, 0.12)' }}
    >
      <div className="text-center mb-4">
        <p className="text-xs md:text-sm font-hand text-[#3B2F2A]/70 uppercase tracking-wider mb-2">
          Counting down to
        </p>
        <p className="text-sm md:text-base font-hand text-[#3B2F2A] font-semibold">
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
            <span className="countdown-label text-[#3B2F2A]/60 text-xs uppercase tracking-widest mt-1 block">{unit.label}</span>
          </motion.div>
        ))}
      </div>
      {timeLeft.days <= 1 && timeLeft.days > 0 && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center mt-3 text-xs font-hand text-[#EBBA9A] font-bold"
        >
          Almost there! 🎉
        </motion.p>
      )}
    </motion.div>
  );
};

const Hero = ({ onScrollToSection }) => (

  <section className={`min-h-screen flex flex-col ${SECTION_PADDING} pt-16 md:pt-24 pb-4 md:pb-12 bg-[#FDF9F4] relative`} aria-label="Hero section">

    <div className="watercolor-bg"></div>

    {/* Doodles - Hidden on mobile to reduce clutter */}
    <ParallaxWrapper offset={30} className="absolute top-24 left-10 hidden md:block">
      <Sun className="w-12 h-12 text-[#D88D66] opacity-60 rotate-12 animate-float" />
    </ParallaxWrapper>

    <ParallaxWrapper offset={-30} className="absolute bottom-32 right-8 hidden md:block">
      <Heart className="w-8 h-8 text-[#EBBA9A] opacity-60 -rotate-6 animate-float" />
    </ParallaxWrapper>

    <FadeInWhenVisible className="w-full max-w-4xl mx-auto relative z-10 flex flex-col md:flex-col">
      
      {/* Mobile: Photo First */}
      <div className="order-1 md:order-2 mb-4 md:mb-0">
        <ParallaxWrapper offset={80} hoverEffect className="relative w-full max-w-xl mx-auto rotate-1 hover:rotate-0 transition-transform duration-500">
          <div className="bg-white p-2 md:p-4 sketchy-border shadow-xl">
            <motion.div 
              className="w-full bg-[#EDEDE3] overflow-hidden relative" 
              style={{ minHeight: '280px', maxHeight: '400px' }}
              initial={{ scale: 1.05 }}
              whileHover={{ scale: 1.02 }}
            >
               <motion.img 
                 src="/images/hero.jpg" 
                 alt="Shubs and Alysha" 
                 className="w-full h-full object-cover"
                style={{ objectPosition: 'center' }}
                width={1024}
                height={890}
                 initial={{ scale: 1.2 }}
                 animate={{ scale: 1 }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
                 loading="eager"
              />
            </motion.div>
          </div>
        </ParallaxWrapper>
      </div>

      {/* Mobile: Text Content Second */}
      <div className="order-2 md:order-1 text-center space-y-4 md:space-y-6 mt-6 md:mt-0">
        {/* Opening Message - Smaller on mobile */}
        <p className="text-lg md:text-xl lg:text-2xl xl:text-3xl font-hand text-navy/80 leading-relaxed max-w-2xl mx-auto px-2">
          After seven years of choosing each other,<br className="hidden md:block" />
          <span className="md:hidden"> </span>we're making it forever.
        </p>

        {/* S&A Logo */}
        <motion.h1 
          className="text-[4rem] md:text-[5rem] lg:text-[6rem] leading-[0.9] text-navy font-hand select-none relative z-10 sketchy-text inline-block" 
          style={{ textShadow: '2px 2px 0px rgba(212, 165, 165, 0.2)' }}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 120, damping: 14 }}
        >
          S<span className="text-[#D88D66]">&</span>A
        </motion.h1>

        {/* Names and Invitation */}
        <div className="flex flex-col items-center gap-3 md:gap-4 mt-1 md:mt-2 rotate-[-1deg]">
          <h2 className="text-2xl md:text-3xl lg:text-5xl font-hand text-navy relative">
            Shubs & Alysha
            <svg className="absolute -bottom-2 md:-bottom-3 left-0 w-full h-2 md:h-2.5" viewBox="0 0 100 10" preserveAspectRatio="none">
               <path d="M0,5 Q50,10 100,5" stroke="#D88D66" strokeWidth="2" fill="none" />
            </svg>
          </h2>

          <p className="text-base md:text-lg font-hand text-navy/80 max-w-xl mx-auto px-2">
            invite you to witness our wedding
          </p>

          <p className="text-sm md:text-lg font-hand text-navy/70 mt-1 md:mt-2 italic px-2">
            Your presence would mean the world to us.
          </p>
         </div>

        {/* Event Details - Compact on mobile */}
        <div className="max-w-2xl mx-auto mt-4 md:mt-6 lg:mt-8">
          <div className="sketchy-border border-2 border-[#D88D66]/30 bg-white/80 backdrop-blur-sm rounded-lg md:rounded-xl px-4 py-3 md:px-5 md:py-4 text-navy/80 font-hand shadow-md">
            <div className="flex flex-col md:flex-row md:flex-wrap items-center justify-center gap-3 md:gap-3 text-sm md:text-base lg:text-lg">
              <div className="flex items-center gap-1.5 md:gap-1.5">
                <Calendar size={14} className="md:w-[16px] md:h-[16px] text-[#D88D66] flex-shrink-0" />
                <span className="font-semibold text-navy text-base md:text-lg">Friday, March 20, 2026</span>
              </div>
              <span className="hidden md:block text-[#D88D66] text-xs">·</span>
              <div className="flex items-center gap-1.5 md:gap-1.5">
                <Clock size={14} className="md:w-[16px] md:h-[16px] text-[#D88D66] flex-shrink-0" />
                <span className="font-medium text-navy text-base md:text-lg">3:30 PM onwards</span>
              </div>
              <span className="hidden md:block text-[#D88D66] text-xs">·</span>
              <div className="flex items-center gap-1.5 md:gap-1.5 text-center">
                <MapPin size={14} className="md:w-[16px] md:h-[16px] text-[#D88D66] flex-shrink-0" />
                <span className="font-medium text-navy text-base md:text-lg">Blu Missel, Ribandar</span>
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

    <FadeInWhenVisible className="max-w-5xl mx-auto">

      <div className="text-center mb-10">
        <SignboardHeading>Our Story</SignboardHeading>
      </div>



      <div className="mb-12 md:mb-20"></div>

      

      <div className="space-y-16 md:space-y-24 lg:space-y-28 relative pt-8 md:pt-0">



        {/* 2015 */}

        <FadeInWhenVisible delay={0.1}>

          <div className="grid md:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center mb-20 md:mb-32">

            <ParallaxWrapper offset={15} hoverEffect={false} className="sketchy-border p-3 bg-white rotate-2 order-2 md:order-1 photo-frame">

            <div className="overflow-hidden relative rounded-[24px] bg-[#EDEDE3]/30 flex items-center justify-center" style={{ aspectRatio: '3 / 4' }}>
               <img src="/images/firsttime.jpg" className="w-full h-full object-contain sepia-[.3]" alt="The First Time" style={{ objectPosition: 'center bottom' }} loading="lazy" width={696} height={1024} fetchPriority="low" decoding="async" />
            </div>

            <p className="text-center font-hand text-navy/50 mt-2">Hello, goodbye, sea you in three years</p>

            </ParallaxWrapper>

          <div className="order-1 md:order-2">

              <span className="inline-block bg-[#D88D66] text-white px-3 md:px-4 py-1 font-hand text-lg md:text-xl mb-3 md:mb-4 rotate-[-2deg] shadow-sm">2015</span>

              <h3 className="text-2xl md:text-3xl lg:text-4xl font-hand font-bold text-navy mb-3 md:mb-4">The First Time</h3>

              <div className="text-base md:text-lg text-navy/80 space-y-2 md:space-y-3 leading-relaxed">

              <p>House party in Bangalore. Her place. His friend insisted he come along.</p>

              <p>They talked for hours that night. Bengali boy from Assam meets Goan girl from Abu Dhabi. The conversation came easy.</p>
              <p>They talked for hours that night. Bengali boy from Assam meets Goan girl from Abu Dhabi. The conversation came easy.</p>

              <p>Then the party ended. They didn't exchange numbers. Three years of complete radio silence.</p>

            </div>

          </div>

        </div>

        </FadeInWhenVisible>



        {/* 2018 */}

        <FadeInWhenVisible delay={0.15}>

          <div className="grid md:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center mb-20 md:mb-32">

          <div>

              <span className="inline-block bg-[#EBBA9A] text-white px-3 md:px-4 py-1 font-hand text-lg md:text-xl mb-3 md:mb-4 rotate-[2deg] shadow-sm">July 2018</span>

              <h3 className="text-2xl md:text-3xl lg:text-4xl font-hand font-bold text-navy mb-3 md:mb-4">The Reunion</h3>

              <div className="text-base md:text-lg text-navy/80 space-y-2 md:space-y-3 leading-relaxed">

              <p>She starts new job, walks down office corridor, there he is.</p>

              <p>Coffee runs became a daily thing. Then late nights at the office turned into dinners after work. Felt like really good friendship.</p>

              <p>Then someone threw him a half-hearted birthday party. She showed up and realized something had shifted. She cared way more than friends should care about someone's birthday.</p>

              <p>Two weeks later, he kissed her. They were official by the end of July.</p>

            </div>

          </div>

            <ParallaxWrapper offset={-15} hoverEffect={false} className="sketchy-border p-3 bg-white -rotate-2 photo-frame">

            <div className="overflow-hidden relative rounded-[24px] bg-[#EDEDE3]/30 flex items-center justify-center" style={{ aspectRatio: '3 / 4' }}>
               <img src="/images/office.jpg" className="w-full h-full object-contain sepia-[.3]" alt="The Reunion" style={{ objectPosition: 'center bottom' }} loading="lazy" width={666} height={1024} fetchPriority="low" decoding="async" />
            </div>

             <p className="text-center font-hand text-navy/50 mt-2">From slack DMs to slacking off together</p>

            </ParallaxWrapper>

        </div>

        </FadeInWhenVisible>



        {/* GOA Years */}

        <FadeInWhenVisible delay={0.2}>

          <div className="grid md:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center mb-20 md:mb-32">

            <ParallaxWrapper offset={15} hoverEffect={false} className="sketchy-border p-3 bg-white rotate-1 order-2 md:order-1 photo-frame">

            <div className="overflow-hidden relative rounded-[24px] bg-[#EDEDE3]/30 flex items-center justify-center w-full" style={{ aspectRatio: '3 / 4' }}>
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

            <p className="text-center font-hand text-navy/50 mt-2">Goa, dogs & growing together</p>

            </ParallaxWrapper>

          <div className="order-1 md:order-2">

              <span className="inline-block bg-[#D88D66] text-white px-3 md:px-4 py-1 font-hand text-lg md:text-xl mb-3 md:mb-4 rotate-[-1deg] shadow-sm">2018-2025</span>

              <h3 className="text-2xl md:text-3xl lg:text-4xl font-hand font-bold text-navy mb-3 md:mb-4">Building a Life</h3>

              <div className="text-base md:text-lg text-navy/80 space-y-2 md:space-y-3 leading-relaxed">

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

              <span className="inline-block bg-[#EBBA9A] text-white px-3 md:px-4 py-1 font-hand text-lg md:text-xl mb-3 md:mb-4 rotate-[2deg] shadow-sm">January 6, 2025</span>

              <h3 className="text-2xl md:text-3xl lg:text-4xl font-hand font-bold text-navy mb-3 md:mb-4">The Question</h3>

              <div className="text-base md:text-lg text-navy/80 space-y-2 md:space-y-3 leading-relaxed">

              <p>Back at Palolem Beach. He'd made plans. Plan A: underwater proposal (ring might sink, she might panic). Plan B: Kakolem Beach at sunset (neither wanted the trek that day).</p>

              <p>Plan C won. Keep it simple. Wing it.</p>

              <p>They were walking between Palolem and Colomb, where the two beaches meet. They swam in Palolem, lived in Colomb. This stretch was theirs.</p>

              <p>He stopped. She turned around.</p>

              <p>He was on his knees. Ring in hand. She said yes before he finished asking.</p>

            </div>

          </div>

            <ParallaxWrapper offset={-15} hoverEffect={false} className="sketchy-border p-3 bg-white -rotate-1 photo-frame">
             <div className="overflow-hidden relative rounded-[24px] bg-[#EDEDE3]/30 flex items-center justify-center" style={{ aspectRatio: '3 / 4' }}>
                <img src="/images/proposal.jpg" className="w-full h-full object-contain" alt="The Proposal" style={{ objectPosition: 'center bottom' }} loading="lazy" width={696} height={1024} fetchPriority="low" decoding="async" />
             </div>
             <p className="text-center font-hand text-navy/50 mt-2">Ring. Sand. Forever.</p>
            </ParallaxWrapper>

      </div>

        </FadeInWhenVisible>

    </div>

    </FadeInWhenVisible>

  </section>

);



const CookieChaseGame = ({ isOpen: externalIsOpen, onClose }) => {
  const LANES = 4;
  const isOpen = externalIsOpen || false;
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    try {
      return parseInt(localStorage.getItem('cookieGameHighScore') || '0', 10);
    } catch {
      return 0;
    }
  });
  const [level, setLevel] = useState(1);
  const [speed, setSpeed] = useState(500);
  const [cookieLane, setCookieLane] = useState(1);
  const [obstacles, setObstacles] = useState([]);
  const [showDialogue, setShowDialogue] = useState(null);
  const [groundOffset, setGroundOffset] = useState(0);
  const [isInvincible, setIsInvincible] = useState(false);
  const [invincibleUntil, setInvincibleUntil] = useState(0);
  const [buttonPressed, setButtonPressed] = useState(null);
  const gameIntervalRef = useRef(null);
  const groundIntervalRef = useRef(null);
  const obstacleIdRef = useRef(0);
  const cookieImageRef = useRef(null);
  const touchStartY = useRef(0);
  const touchEndY = useRef(0);

  // Level names
  const levelNames = {
    1: 'Beach Training',
    2: 'Market Madness',
    3: 'Wedding Day Chaos',
    4: 'Rehearsal Dinner Rush',
  };

  // Dialogue system
  const dialogues = {
    gameStart: [
      "Oh look, the humans are back. WHERE'S MY FOOD?",
      "Another guest? sigh Fine, let's do this.",
      "Susegaad? Not when I'm HUNGRY.",
      "I've been doing this for 12 years. You're new here.",
      "They see me rolling, they better be feeding.",
    ],
    collectingFood: [
      "FINALLY! Was that so hard?",
      "Now we're talking, human.",
      "This is why I tolerate you people.",
      "ONE fish? That's it? Cheap.",
      "About damn time.",
      "Nom nom... okay, MORE.",
    ],
    hittingKids: [
      "MOVE IT, tiny human!",
      "Kids these days have NO respect.",
      "Watch where you're going!",
      "This is MY beach!",
      "Seriously?? I'm WORKING here!",
    ],
    hittingScooters: [
      "DUDE. Where's my treat, not your scooter!",
      "That's not edible, genius.",
      "Wrong lane, buddy!",
      "Vroom vroom yourself outta here.",
      "Tourists. eye roll",
    ],
    losingLife: [
      "ARE YOU KIDDING ME RIGHT NOW?",
      "I'm too old for this nonsense.",
      "12 years of service and THIS is how you repay me?",
      "Unacceptable. Do better.",
      "You're lucky you're getting married.",
    ],
    gameOver: [
      "Well THAT was embarrassing for you.",
      "I've seen better from the cat. THE CAT.",
      "And they wonder why I bark at ceremonies...",
      "Maybe stick to planning weddings, yeah?",
      "I'm going back to my nap.",
    ],
    highScore: [
      "Not bad, human. Not bad.",
      "FINALLY someone who gets it.",
      "This calls for extra treats later.",
      "You may pet me. Once.",
      "Okay fine, you can stay.",
    ],
    midGame: [
      "Faster! The fish curry won't catch itself!",
      "Palolem Beach energy, let's GO!",
      "Channel your inner Goan!",
      "Susegaad is NOT an option right now!",
      "Focus! There's prawn balchão at stake!",
    ],
    weddingSpecific: [
      "Just practicing for the ceremony. I WILL bark.",
      "Hope the guests are ready for THIS energy.",
      "Bailey's better at this, don't tell Shubs.",
      "March 20th better have THIS much food.",
      "If there's no fish at the wedding, we're done.",
    ],
    easterEgg: [
      "Okay fine, I won't bark at the ceremony. JK I ABSOLUTELY WILL.",
    ],
  };

  // Better food items with points
  const foodItems = [
    { emoji: '🐟', name: 'Fish Curry', type: 'catch', points: 3, dialogue: "THE GOOD STUFF!" },
    { emoji: '🍤', name: 'Prawn Balchão', type: 'catch', points: 2, dialogue: "Spicy! I LIKE it!" },
    { emoji: '🐟', name: 'Kingfish', type: 'catch', points: 5, dialogue: "JACKPOT!" },
    { emoji: '🍰', name: 'Bebinca', type: 'catch', points: 1, dialogue: "Don't tell Alysha..." },
    { emoji: '🍷', name: 'Feni', type: 'powerup', points: 0, dialogue: "Woah, easy there!", effect: 'invincible' },
    { emoji: '🍗', name: 'Chicken Xacuti', type: 'catch', points: 2, dialogue: "About time!" },
    { emoji: '🥥', name: 'Coconut', type: 'catch', points: 1, dialogue: "Refreshing!" },
  ];

  // Better obstacles
  const obstacleItems = [
    { emoji: '👶', name: 'Goan Kid', type: 'avoid', dialogue: "MOVE IT, tiny human!" },
    { emoji: '🏍️', name: 'Scooter', type: 'avoid', dialogue: "Wrong lane, buddy!" },
    { emoji: '📸', name: 'Tourist with Selfie Stick', type: 'avoid', dialogue: "NOT NOW, KAREN!" },
    { emoji: '🛒', name: 'Beach Vendor', type: 'avoid', dialogue: "Selling what? Where's MY cut?" },
    { emoji: '🦀', name: 'Crab', type: 'avoid', dialogue: "Nope nope nope!" },
    { emoji: '🐕', name: 'Other Dog', type: 'avoid', dialogue: "This is MY territory!" },
  ];

  // Get random dialogue
  const getDialogue = (category) => {
    const arr = dialogues[category] || [];
    return arr[Math.floor(Math.random() * arr.length)];
  };

  // Haptic feedback
  const triggerHaptic = () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(10);
    }
  };

  // Save high score
  const saveHighScore = (newScore) => {
    try {
      localStorage.setItem('cookieGameHighScore', newScore.toString());
      setHighScore(newScore);
    } catch (e) {
      console.error('Failed to save high score:', e);
    }
  };

  // Share score
  const shareScore = async () => {
    const text = `I scored ${score} points in Cookie's Goan Chase! 🐕 Can you beat my score?`;
    if (navigator.share) {
      try {
        await navigator.share({ text, url: window.location.href });
      } catch (e) {
        // User cancelled or error
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(text + ' ' + window.location.href);
        alert('Score copied to clipboard!');
      } catch (e) {
        console.error('Failed to share:', e);
      }
    }
  };

  // Reset game state when closed
  useEffect(() => {
    if (!isOpen) {
      setIsPlaying(false);
      setIsGameOver(false);
      setIsPaused(false);
      if (gameIntervalRef.current) {
        clearInterval(gameIntervalRef.current);
        gameIntervalRef.current = null;
      }
      if (groundIntervalRef.current) {
        clearInterval(groundIntervalRef.current);
        groundIntervalRef.current = null;
      }
    }
  }, [isOpen]);

  const moveCookie = (direction) => {
    if (!isPlaying || isGameOver || isPaused) return;
    triggerHaptic();
    setCookieLane(prev => {
      const newLane = direction === 'up' 
        ? Math.max(0, prev - 1)
        : Math.min(LANES - 1, prev + 1);
      return newLane;
    });
  };

  const startGame = () => {
    if (gameIntervalRef.current) {
      clearInterval(gameIntervalRef.current);
      gameIntervalRef.current = null;
    }
    if (groundIntervalRef.current) {
      clearInterval(groundIntervalRef.current);
      groundIntervalRef.current = null;
    }
    setScore(0);
    setLevel(1);
    setSpeed(500);
    setCookieLane(1);
    setObstacles([]);
    setIsGameOver(false);
    setIsPlaying(true);
    setIsPaused(false);
    setShowDialogue(null);
    setGroundOffset(0);
    setIsInvincible(false);
    setInvincibleUntil(0);
    obstacleIdRef.current = 0;
    
    // Show start dialogue
    const startDialogue = getDialogue('gameStart');
    setShowDialogue(startDialogue);
    setTimeout(() => setShowDialogue(null), 2000);
  };

  // Ground animation
  useEffect(() => {
    if (!isPlaying || isGameOver || isPaused) {
      if (groundIntervalRef.current) {
        clearInterval(groundIntervalRef.current);
        groundIntervalRef.current = null;
      }
      return;
    }

    const groundSpeed = Math.max(2, 8 - level);
    groundIntervalRef.current = setInterval(() => {
      setGroundOffset(prev => (prev + groundSpeed) % 40);
    }, 16); // ~60fps

    return () => {
      if (groundIntervalRef.current) {
        clearInterval(groundIntervalRef.current);
        groundIntervalRef.current = null;
      }
    };
  }, [isPlaying, isGameOver, isPaused, level]);

  // Invincibility timer
  useEffect(() => {
    if (isInvincible && invincibleUntil > Date.now()) {
      const timer = setTimeout(() => {
        if (Date.now() >= invincibleUntil) {
          setIsInvincible(false);
        }
      }, invincibleUntil - Date.now());
      return () => clearTimeout(timer);
    }
  }, [isInvincible, invincibleUntil]);

  // Game loop
  useEffect(() => {
    if (!isPlaying || isGameOver || isPaused) {
      if (gameIntervalRef.current) {
        clearInterval(gameIntervalRef.current);
        gameIntervalRef.current = null;
      }
      return;
    }

    if (gameIntervalRef.current) {
      clearInterval(gameIntervalRef.current);
    }

    gameIntervalRef.current = setInterval(() => {
      setObstacles(prev => {
        const moveSpeed = Math.max(0.5, 2 - (level * 0.1));
        const moved = prev.map(obs => ({
          ...obs,
          position: obs.position - moveSpeed
        }));

        const toRemove = new Set();
        moved.forEach(obs => {
          if (obs.lane === cookieLane && obs.position <= 1.5 && obs.position >= -0.5) {
            if (obs.type === 'avoid' && !isInvincible) {
              setIsGameOver(true);
              setIsPlaying(false);
              const finalScore = score;
              if (finalScore > highScore) {
                saveHighScore(finalScore);
              }
              const gameOverDialogue = getDialogue('gameOver');
              setShowDialogue(gameOverDialogue);
            } else if (obs.type === 'catch' || obs.type === 'powerup') {
              toRemove.add(obs.id);
              const points = obs.points || 1;
              setScore(s => {
                const newScore = s + points;
                
                // Easter egg at 100 points
                if (newScore === 100) {
                  const easterEgg = getDialogue('easterEgg');
                  setShowDialogue(easterEgg);
                  setTimeout(() => setShowDialogue(null), 3000);
                }
                
                setLevel(prevLevel => {
                  const newLevel = Math.floor(newScore / 10) + 1;
                  if (newLevel > prevLevel) {
                    setSpeed(prevSpeed => Math.max(200, prevSpeed - 30));
                    const levelUpDialogue = `Level ${newLevel}: ${levelNames[newLevel] || 'Goan Master'}`;
                    setShowDialogue(levelUpDialogue);
                    setTimeout(() => setShowDialogue(null), 2000);
                    return newLevel;
                  }
                  return prevLevel;
                });
                return newScore;
              });
              
              // Handle power-ups
              if (obs.effect === 'invincible') {
                setIsInvincible(true);
                setInvincibleUntil(Date.now() + 5000); // 5 seconds
              }
              
              const dialogue = obs.dialogue || getDialogue('collectingFood');
              setShowDialogue(dialogue);
              setTimeout(() => setShowDialogue(null), 1500);
            }
          }
        });

        const filtered = moved.filter(obs => obs.position > -2 && !toRemove.has(obs.id));

        // Spawn rate based on level
        const spawnRate = Math.min(0.75, 0.5 + (level * 0.05));
        if (Math.random() < spawnRate) {
          const allItems = [...foodItems, ...obstacleItems];
          const randomItem = allItems[Math.floor(Math.random() * allItems.length)];
          filtered.push({
            id: obstacleIdRef.current++,
            lane: Math.floor(Math.random() * LANES),
            position: 10,
            type: randomItem.type,
            emoji: randomItem.emoji,
            name: randomItem.name,
            points: randomItem.points || (randomItem.type === 'catch' ? 1 : 0),
            dialogue: randomItem.dialogue,
            effect: randomItem.effect,
          });
        }

        return filtered;
      });
    }, speed);

    return () => {
      if (gameIntervalRef.current) {
        clearInterval(gameIntervalRef.current);
        gameIntervalRef.current = null;
      }
    };
  }, [speed, isPlaying, isGameOver, isPaused, cookieLane, level, score, highScore, isInvincible]);

  // Keyboard controls
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event) => {
      if (event.key === 'ArrowUp' || event.key === 'w' || event.key === 'W') {
        event.preventDefault();
        if (isGameOver) {
          startGame();
        } else {
          moveCookie('up');
        }
      } else if (event.key === 'ArrowDown' || event.key === 's' || event.key === 'S') {
        event.preventDefault();
        moveCookie('down');
      } else if (event.key === ' ' || event.key === 'Enter') {
        event.preventDefault();
        if (isGameOver || (!isPlaying && !isGameOver)) {
          startGame();
        } else if (isPlaying) {
          setIsPaused(prev => !prev);
        }
      } else if (event.key === 'Escape') {
        event.preventDefault();
        if (isPaused) {
          setIsPaused(false);
        } else if (isPlaying) {
          setIsPaused(true);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isPlaying, isGameOver, isPaused]);

  // Swipe gestures
  const handleTouchStart = (e) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e) => {
    touchEndY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = () => {
    if (!touchStartY.current || !touchEndY.current) return;
    const diff = touchStartY.current - touchEndY.current;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        moveCookie('up');
      } else {
        moveCookie('down');
      }
    }
    touchStartY.current = 0;
    touchEndY.current = 0;
  };

  const handleButtonPress = (direction) => {
    setButtonPressed(direction);
    triggerHaptic();
    moveCookie(direction);
    setTimeout(() => setButtonPressed(null), 150);
  };

  const closeGame = () => {
    setIsPlaying(false);
    setIsGameOver(false);
    setIsPaused(false);
    if (gameIntervalRef.current) {
      clearInterval(gameIntervalRef.current);
      gameIntervalRef.current = null;
    }
    if (groundIntervalRef.current) {
      clearInterval(groundIntervalRef.current);
      groundIntervalRef.current = null;
    }
    if (onClose) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[150] flex items-center justify-center bg-gradient-to-b from-[#EBBA9A]/20 to-[#EDEDE3] px-4"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="relative w-full max-w-2xl game-sketchy-border overflow-hidden" style={{ height: '85vh', maxHeight: '600px', minHeight: '500px' }}>
        <div className="game-texture-overlay"></div>
        
        <button
          onClick={closeGame}
          className="absolute top-4 right-4 z-30 w-10 h-10 rounded-full bg-white/95 hover:bg-white shadow-lg flex items-center justify-center text-navy/60 hover:text-navy transition-all sketchy-border"
          aria-label="Close game"
        >
          <X size={20} />
        </button>

        {/* Score Display */}
        <div className="absolute top-4 left-4 right-4 z-20 flex justify-between items-start">
          <div className="bg-white/95 backdrop-blur-sm px-4 py-2 rounded-lg shadow-md sketchy-border">
            <div className="text-2xl font-bold text-navy font-mono tabular-nums">{score.toString().padStart(4, '0')}</div>
            <div className="text-xs text-navy/60 font-hand">{levelNames[level] || `Level ${level}`}</div>
          </div>
          {highScore > 0 && (
            <div className="bg-white/95 backdrop-blur-sm px-3 py-2 rounded-lg shadow-md text-right sketchy-border">
              <div className="text-xs text-navy/50 font-hand">HI</div>
              <div className="text-lg font-bold text-navy/70 font-mono tabular-nums">{highScore.toString().padStart(4, '0')}</div>
            </div>
          )}
        </div>

        {/* Cookie Dialogue Bubble */}
        <AnimatePresence>
          {showDialogue && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.8 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="absolute top-16 md:top-20 left-1/2 -translate-x-1/2 z-40 cookie-dialogue max-w-[90%] md:max-w-none"
            >
              {showDialogue}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Invincibility indicator */}
        {isInvincible && (
          <motion.div
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ repeat: Infinity, duration: 0.5 }}
            className="absolute top-16 left-1/2 -translate-x-1/2 z-30 bg-[#D88D66] text-white px-3 py-1 rounded-full text-xs font-hand font-bold sketchy-border"
          >
            INVINCIBLE!
          </motion.div>
        )}

        {/* Start Screen */}
        {!isPlaying && !isGameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-[#EDEDE3] to-white z-10 p-8">
            <div className="mb-8">
              <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-white border-4 border-white shadow-2xl p-1 flex items-center justify-center overflow-hidden sketchy-border">
                <img
                  ref={cookieImageRef}
                  src="/images/cookie.png"
                  alt="Cookie"
                  className="w-full h-full object-cover rounded-full"
                  style={{ objectPosition: 'center' }}
                  onError={(e) => {
                    e.target.src = '/images/cookie.jpg';
                    e.target.style.objectPosition = 'center';
                  }}
                />
              </div>
            </div>
            <h4 className="text-4xl font-hand text-navy mb-3 font-bold">Cookie's Goan Chase</h4>
            <p className="text-sm text-navy/70 mb-2 text-center max-w-md font-hand">
              Catch Goan food • Avoid obstacles • Survive the chaos!
            </p>
            <p className="text-xs text-navy/60 mb-8 text-center font-hand">
              Use ↑↓ or W/S keys • Swipe on mobile
            </p>
            <button
              onClick={startGame}
              className="px-8 py-3 bg-[#D88D66] text-white font-bold rounded-lg shadow-lg hover:bg-[#C97452] transition-all transform hover:scale-105 sketchy-border font-hand"
            >
              Press ↑ or Space to Start
            </button>
          </div>
        )}

        {/* Game Over Screen */}
        {isGameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/95 backdrop-blur-sm z-20 p-8">
            <div className="text-center">
              <h4 className="text-5xl font-bold text-navy mb-4 font-hand">Game Over</h4>
              <div className="text-6xl font-mono font-bold text-[#D88D66] mb-2 tabular-nums">{score.toString().padStart(4, '0')}</div>
              <p className="text-sm text-navy/60 mb-2 font-hand">{levelNames[level] || `Level ${level}`}</p>
              {score >= highScore && score > 0 && (
                <p className="text-xs text-[#D88D66] font-bold mb-4 font-hand">NEW HIGH SCORE!</p>
              )}
              <div className="flex gap-3 justify-center">
                <button
                  onClick={startGame}
                  className="px-6 py-2 bg-[#D88D66] text-white font-bold rounded-lg shadow-lg hover:bg-[#C97452] transition-all transform hover:scale-105 sketchy-border font-hand"
                >
                  Play Again
                </button>
                {score > 0 && (
                  <button
                    onClick={shareScore}
                    className="px-6 py-2 bg-[#D88D66] text-white font-bold rounded-lg shadow-lg hover:bg-[#EBBA9A] transition-all transform hover:scale-105 sketchy-border font-hand"
                  >
                    Share Score
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Pause Screen */}
        {isPaused && isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-20">
            <div className="bg-white rounded-xl px-8 py-6 shadow-2xl text-center sketchy-border">
              <h4 className="text-3xl font-bold text-navy mb-4 font-hand">Paused</h4>
              <p className="text-sm text-navy/60 mb-4 font-hand">Press Space or Esc to resume</p>
              <button
                onClick={() => setIsPaused(false)}
                className="px-6 py-2 bg-[#D88D66] text-white font-bold rounded-lg hover:bg-[#C97452] transition-all sketchy-border font-hand"
              >
                Resume
              </button>
            </div>
          </div>
        )}

        {/* Game Area */}
        {isPlaying && (
          <div className="relative w-full h-full game-beach-bg overflow-hidden">
            {/* Palm trees in background */}
            <div className="absolute top-10 left-10 palm-tree opacity-30"></div>
            <div className="absolute top-20 right-20 palm-tree opacity-20" style={{ transform: 'scaleX(-1)' }}></div>
            
            {/* Animated Ground */}
            <div 
              className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#3B2F2A] to-[#D4CDC2] border-t-4 border-[#3B2F2A]"
              style={{
                backgroundImage: `repeating-linear-gradient(90deg, transparent, transparent 39px, rgba(255,255,255,0.1) 40px)`,
                backgroundPosition: `${groundOffset}px 0`
              }}
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
            </div>

            {/* Game lanes */}
            {Array.from({ length: LANES }).map((_, laneIndex) => (
              <div
                key={laneIndex}
                className="absolute left-0 right-0"
                style={{
                  top: `${(laneIndex + 1) * (100 / (LANES + 1))}%`,
                  height: `${100 / (LANES + 1)}%`,
                  borderBottom: laneIndex < LANES - 1 ? '1px dashed rgba(58, 49, 43, 0.1)' : 'none'
                }}
              >
                {/* Cookie sticker */}
                {cookieLane === laneIndex && (
                  <motion.div
                    className="absolute left-8 z-10"
                    style={{ top: '50%', transform: 'translateY(-50%)' }}
                    animate={{ 
                      y: [0, -3, 0],
                      scale: isInvincible ? [1, 1.1, 1] : 1
                    }}
                    transition={{ 
                      y: { repeat: Infinity, duration: 0.5, ease: 'easeInOut' },
                      scale: { repeat: Infinity, duration: 0.3 }
                    }}
                  >
                    <div className={`w-24 h-24 rounded-full bg-white border-4 border-white shadow-2xl p-0.5 flex items-center justify-center overflow-hidden sketchy-border ${isInvincible ? 'ring-4 ring-[#D88D66]' : ''}`}>
                      <img
                        src="/images/cookie.png"
                        alt="Cookie"
                        className="w-full h-full object-cover rounded-full"
                        style={{ objectPosition: 'center' }}
                        onError={(e) => {
                          e.target.src = '/images/cookie.jpg';
                          e.target.style.objectPosition = 'center';
                        }}
                      />
                    </div>
                  </motion.div>
                )}

                {/* Obstacles */}
                {obstacles
                  .filter(obs => obs.lane === laneIndex)
                  .map(obs => (
                    <motion.div
                      key={obs.id}
                      className="absolute z-5"
                      style={{
                        left: `${obs.position * 10}%`,
                        top: '50%',
                        transform: 'translateY(-50%)'
                      }}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ 
                        opacity: 1, 
                        scale: 1,
                        rotate: obs.type === 'catch' || obs.type === 'powerup' ? [0, 5, -5, 0] : 0
                      }}
                      transition={{ 
                        rotate: { repeat: Infinity, duration: 0.5 },
                        opacity: { duration: 0.2 }
                      }}
                    >
                      <div className="w-16 h-16 rounded-full flex items-center justify-center text-4xl shadow-xl">
                        {obs.emoji}
                      </div>
                    </motion.div>
                  ))}
              </div>
            ))}
          </div>
        )}

        {/* Mobile controls - Paw print buttons */}
        {isPlaying && (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 md:hidden z-20">
            <button
              onClick={() => handleButtonPress('up')}
              className={`paw-button ${buttonPressed === 'up' ? 'pressed' : ''}`}
              aria-label="Move up"
            >
              <PawPrint size={32} className="text-[#D88D66]" />
            </button>
            <button
              onClick={() => handleButtonPress('down')}
              className={`paw-button ${buttonPressed === 'down' ? 'pressed' : ''}`}
              aria-label="Move down"
            >
              <PawPrint size={32} className="text-[#EBBA9A]" />
            </button>
          </div>
        )}
          </div>
        </div>
  );
};




/* --- NEW COMPONENTS (Missing in original) --- */

// Kidena House Image Carousel Component (defined first since KidenaHouse uses it)
const KidenaHouseCarousel = memo(() => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const images = useMemo(() => [
    { src: '/images/kidena-house.jpg', alt: 'Kidena House - Main View' },
    { src: '/images/kidena-house2.jpg', alt: 'Kidena House - View 2' },
    { src: '/images/kidena-house3.jpg', alt: 'Kidena House - View 3' },
    { src: '/images/kidena-house4.jpg', alt: 'Kidena House - View 4' },
    { src: '/images/kidena-house5.jpg', alt: 'Kidena House - View 5' },
  ], []);

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToImage = (index) => {
    setCurrentIndex(index);
  };

  // Auto-advance carousel every 5 seconds (pauses on hover)
  useEffect(() => {
    if (isPaused) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, [images.length, isPaused]);

  return (
    <div className="relative w-full max-w-5xl md:max-w-6xl mx-auto">
      {/* Carousel Container */}
      <div 
        className="relative w-full overflow-hidden rounded-lg"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div 
          className="flex w-full transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {images.map((image, index) => (
            <div key={index} className="min-w-full flex-shrink-0 w-full">
              <ParallaxWrapper offset={25} hoverEffect className="sketchy-border p-3 bg-white rotate-1 shadow-2xl">
                <div 
                  className="relative bg-white w-full overflow-hidden"
                  style={{ maxHeight: '70vh' }}
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
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToImage(index)}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                index === currentIndex
                  ? 'bg-white w-8'
                  : 'bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`Go to image ${index + 1}`}
              type="button"
            />
          ))}
                        </div>
      </div>
    </div>
  );
});

KidenaHouseCarousel.displayName = 'KidenaHouseCarousel';

const KidenaHouse = () => (

  <section id="kidena-house" className={`${SECTION_SPACING} ${SECTION_PADDING} bg-[#FDF9F4] text-[#3B2F2A] relative overflow-hidden`} aria-label="Kidena House">

    {/* Subtle background decoration */}
    <div className="absolute inset-0 opacity-5 pointer-events-none">
        <SketchIcon type="palm" className="absolute top-20 right-20 w-96 h-96 text-white" />
                        </div>

    <FadeInWhenVisible className="max-w-7xl mx-auto relative z-10">

      <div className="grid lg:grid-cols-[1fr,1.35fr] gap-10 lg:gap-14 items-start">
        {/* Left intro */}
        <div className="space-y-6 text-center lg:text-left">
          <div className="space-y-4">
            <div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-hand font-bold text-[#3B2F2A] leading-tight mb-2">
                Where You'll Stay
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-[#D88D66] to-[#EBBA9A] mb-4"></div>
            </div>
            <div className="space-y-1">
              <p className="text-2xl md:text-3xl lg:text-4xl font-hand font-bold text-[#D88D66] leading-tight">
                Kidena House
              </p>
              <p className="text-lg md:text-xl font-hand text-[#3B2F2A]/70 leading-relaxed">
                Gancim, Maina, Goa Velha
              </p>
            </div>
          </div>

        </div>

        {/* Photo Carousel - wider on desktop */}
        <div className="relative">
          <FadeInWhenVisible>
            <KidenaHouseCarousel />
          </FadeInWhenVisible>
        </div>
      </div>

        {/* Features Grid - 2x2 Layout */}
        <div className="grid md:grid-cols-2 gap-6 md:gap-8 mt-14 mb-14">
            
            <div className="bg-white text-navy p-6 md:p-8 sketchy-border border-2 border-[#D88D66] shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-[#D88D66]/20 flex items-center justify-center flex-shrink-0">
                        <Home className="w-6 h-6 text-[#D88D66]" />
                    </div>
                    <div className="flex-1">
                        <h3 className="font-hand font-bold text-2xl md:text-3xl mb-3" style={{ color: '#D88D66' }}>The House</h3>
                        <p className="text-navy/80 font-hand text-lg md:text-xl leading-relaxed">6 bedrooms, 9 bathrooms. Private pool and private lake. Three acres. Enough room for everyone.</p>
                    </div>
                </div>
        </div>

            <div className="bg-white text-navy p-6 md:p-8 sketchy-border border-2 border-[#EBBA9A] shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-[#EBBA9A]/20 flex items-center justify-center flex-shrink-0">
                        <SketchIcon type="plate" className="w-6 h-6 text-[#EBBA9A]" />
                    </div>
                    <div className="flex-1">
                        <h3 className="font-hand font-bold text-2xl md:text-3xl mb-3" style={{ color: '#D88D66' }}>No Cooking, No Cleaning</h3>
                        <p className="text-navy/80 font-hand text-lg md:text-xl leading-relaxed">Personal chefs cook whatever you're craving - breakfast, lunch, dinner, midnight snacks. Meals get billed to your room. Butlers handle everything else.</p>
                    </div>
                </div>
            </div>

            <div className="bg-white text-navy p-6 md:p-8 sketchy-border border-2 border-[#D88D66] shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-[#D88D66]/20 flex items-center justify-center flex-shrink-0">
                        <Sun className="w-6 h-6 text-[#D88D66]" />
                    </div>
                    <div className="flex-1">
                        <h3 className="font-hand font-bold text-2xl md:text-3xl mb-3" style={{ color: '#D88D66' }}>Spa & Steam Room</h3>
                        <p className="text-navy/80 font-hand text-lg md:text-xl leading-relaxed">There's a spa room and steam room. Book a massage with advance notice - we'll arrange it.</p>
                    </div>
                </div>
        </div>

            <div className="bg-white text-navy p-6 md:p-8 sketchy-border border-2 border-[#EBBA9A] shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-[#EBBA9A]/20 flex items-center justify-center flex-shrink-0">
                        <Music className="w-6 h-6 text-[#EBBA9A]" />
                    </div>
                    <div className="flex-1">
                        <h3 className="font-hand font-bold text-2xl md:text-3xl mb-3" style={{ color: '#D88D66' }}>Keep Busy (or Don't)</h3>
                        <p className="text-navy/80 font-hand text-lg md:text-xl leading-relaxed">Pool table, PlayStation, bicycles, coracles on the private lake. Or just lounge by the pool all day.</p>
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

        <SketchIcon type="palm" className="absolute top-20 right-20 w-96 h-96 text-navy rotate-12" />

    </div>

     <FadeInWhenVisible className="max-w-5xl mx-auto relative z-10">

        <div className="text-center mb-16">

            <SignboardHeading>The Family Plan</SignboardHeading>

            <p className="text-navy/70 font-hand text-xl md:text-2xl mt-4">Your guide to four days in Goa</p>

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

                    <div className="bg-white sketchy-border p-6 md:p-8 shadow-lg hover:shadow-xl transition-shadow border-2" style={{ borderColor: item.color }}>

                        <div className="flex flex-col md:flex-row md:items-start gap-5 md:gap-8">

                            {/* Icon and date column */}
                            <div className="flex-shrink-0 flex items-start gap-4 md:w-64 lg:w-72">

                                <div className="w-16 h-16 rounded-full flex items-center justify-center border-4 flex-shrink-0" style={{ backgroundColor: `${item.color}20`, borderColor: item.color }}>

                                    <item.icon className="w-8 h-8" style={{ color: item.color }} />

                                </div>

                                <div className="flex-1 space-y-1 text-left">

                                    <div className="font-hand font-bold text-navy text-lg md:text-xl">{item.day}</div>

                                    {item.time && (

                                        <div className="font-hand text-sm text-navy/60">{item.time}</div>

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

                                <p className="font-hand text-base md:text-lg text-navy/70 leading-relaxed">{item.desc}</p>

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



      <div className="grid lg:grid-cols-2 gap-12 md:gap-16 items-start">

        <ParallaxWrapper
          offset={25}
          hoverEffect
          className="sketchy-border p-4 bg-gradient-to-br from-white/95 via-[#FDF9F4] to-[#FDF9F4] rotate-1 shadow-xl border border-white/30"
        >

            <div className="w-full overflow-hidden border-2 border-navy rounded-[24px] bg-white">

               <img 

                 src="/images/blu-missel.jpeg" 

                 alt="Blu Missel by the River" 

                 loading="lazy" 

                 className="w-full h-auto block"
                 width={1024}
                 height={683}

               />


            </div>

             <div className="p-6 md:p-8 space-y-6">

                <h3 className="text-3xl md:text-4xl font-hand font-bold text-navy">Friday, March 20, 2026</h3>

                <div className="flex items-start gap-4">

                   <SketchIcon type="palm" className="w-8 h-8 md:w-10 md:h-10 text-[#D88D66] flex-shrink-0" />

                   <div className="font-hand text-xl md:text-2xl leading-tight">

                     <p className="font-bold text-navy">Blu Missel by the River</p>

                     <p className="text-navy/70">Fondvem, Ribandar, Goa</p>

                     <a
                       href={VENUE_GOOGLE_MAPS_URL}
                       target="_blank"
                       rel="noreferrer"
                       className="inline-flex items-center gap-2 mt-2 text-sm md:text-base text-[#D88D66] hover:text-navy transition-colors"
                       aria-label="Open Blu Missel location in Google Maps"
                     >
                       <MapPin size={16} />
                       <span>View on Map</span>
                     </a>

                   </div>

                </div>

              <div className="bg-white/85 backdrop-blur-sm p-5 md:p-6 rounded-2xl border border-[#D88D66]/20 shadow-inner">
                <p className="text-base md:text-lg text-navy/80 leading-relaxed font-bold">A ceremony, a celebration</p>
                <p className="text-base md:text-lg text-navy/80 leading-relaxed mt-3">
                  We'll take our vows with God at the center and our loved ones by our side. Then we feast, dance, and stay until the stars come out.
                </p>
              </div>

             </div>

        </ParallaxWrapper>



        <div className="relative pt-4 md:pt-8 pl-8 md:pl-12">

           <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-navy" style={{ filter: 'url(#roughen)' }}></div>

           

           <div className="space-y-8 md:space-y-12">

              {[

                  { time: '3:30 PM', event: 'Ceremony', note: 'Witness us exchange our vows and commit to forever, surrounded by the people we love most.', icon: Heart },

                  { time: '4:30 PM onwards', event: 'Hi-Tea & Photos', note: "We'll be hunting for good light with the photographers. You? Grab refreshments, snap some Polaroids, stick them in our album. We'll be back before you know it.", icon: SketchIcon, type: 'wine' },

                  { time: '6:00 PM', event: 'Cocktails', note: "The bar opens. We'll join you soon. Save some energy for dancing.", icon: SketchIcon, type: 'wine' },

                  { time: '7:15 PM', event: 'Dance Floor', note: "Come dance with us. That's where we'll be most of the night.", icon: Music },

                  { time: '9:00 PM', event: 'Dinner', note: 'Dinner opens, we\'ll keep it open post 10 PM.', icon: SketchIcon, type: 'plate' },

                  { time: '10:00 PM', event: 'Last Call', note: "The music stops. The night doesn't have to.", icon: Sun }

              ].map((item, i) => (

                  <FadeInWhenVisible key={item.event} delay={i * 0.05} className="relative pl-8 md:pl-10 group">

                      <div className="absolute -left-[26px] md:-left-[30px] top-0 w-12 h-12 md:w-14 md:h-14 bg-white border-3 border-navy rounded-full flex items-center justify-center z-10 group-hover:scale-125 transition-transform shadow-lg hover:shadow-xl">

                         {item.type ? 

                            <SketchIcon type={item.type} className="w-5 h-5 text-navy" /> : 

                            <item.icon className="w-5 h-5 text-navy" />

                         }

                      </div>

                      <h4 className="font-hand font-bold text-2xl md:text-3xl text-navy mb-2">{item.event}</h4>

                      <p className="font-hand text-[#D88D66] text-lg md:text-xl font-bold mb-3">{item.time}</p>

                      <p className="font-hand text-navy/70 text-base md:text-lg leading-relaxed">{item.note}</p>

                  </FadeInWhenVisible>

              ))}

           </div>

        </div>

      </div>

      <div className="mt-12 flex flex-wrap gap-3">
        <a
          href={GOOGLE_CALENDAR_URL}
          target="_blank"
          rel="noreferrer"
          className="sketchy-border border border-[#D88D66]/40 bg-white/90 text-navy text-sm font-semibold tracking-wide px-5 py-3 rounded-xl flex items-center justify-center gap-2 shadow-sm hover:-translate-y-0.5 transition-all"
          aria-label="Add wedding to Google Calendar"
        >
          <Calendar size={18} />
          Add to Google Calendar
        </a>
        <a
          href={VENUE_GOOGLE_MAPS_URL}
          target="_blank"
          rel="noreferrer"
          className="sketchy-border border border-[#D88D66]/30 bg-white/90 text-navy text-sm font-semibold tracking-wide px-5 py-3 rounded-xl flex items-center justify-center gap-2 shadow-sm hover:-translate-y-0.5 transition-all"
          aria-label="Open venue in Google Maps"
        >
          <MapPin size={18} />
          Google Maps Pin
        </a>
        <a
          href={VENUE_APPLE_MAPS_URL}
          target="_blank"
          rel="noreferrer"
          className="sketchy-border border border-[#EBBA9A]/40 bg-white/90 text-navy text-sm font-semibold tracking-wide px-5 py-3 rounded-xl flex items-center justify-center gap-2 shadow-sm hover:-translate-y-0.5 transition-all"
          aria-label="Open venue in Apple Maps"
        >
          <MapPin size={18} />
          Apple Maps Pin
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

        <div className="text-center mb-6 md:mb-8">

          <SignboardHeading>What to Wear</SignboardHeading>

          <div className="w-32 h-1 bg-gradient-to-r from-transparent via-[#EBBA9A] to-transparent mx-auto mb-3"></div>

          <p className="text-navy/70 font-hand text-base md:text-lg max-w-2xl mx-auto">Beach formal, but make it yours.</p>

        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-[0.95fr,1.05fr] gap-5 md:gap-8 lg:gap-10 items-start">
          
          {/* Wardrobe Image */}
          <FadeInWhenVisible className="flex justify-center md:justify-start mb-6">
            <ParallaxWrapper 
              offset={18} 
              hoverEffect 
              className="relative max-w-lg w-full"
            >
              <div className="rounded-[32px] overflow-hidden flex items-center justify-center" style={{ aspectRatio: '2 / 3' }}>
                <img 
                  src="/images/warddrobe.jpg" 
                  alt="Wedding wardrobe inspiration"
                  className="w-full h-full object-contain"
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
            <FadeInWhenVisible className="bg-[#FDF9F4]/95 border border-[#D4CDC2] rounded-[28px] p-6 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-[#EBBA9A]/35 flex items-center justify-center">
                  <Sun className="w-5 h-5 text-[#D88D66]" />
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-[#3B2F2A] font-hand">Beach Formal</h3>
              </div>
              <p className="font-hand text-base md:text-lg text-navy/80 leading-relaxed mb-3">
                Flowing dresses, mid-length skirts, linen suits, easy sandals. We’re on grass,
                sand, and dance floors - pick pieces that breathe and move.
              </p>
            </FadeInWhenVisible>

            <FadeInWhenVisible delay={0.1} className="bg-[#FDF9F4]/95 border border-[#D4CDC2] rounded-[28px] p-6 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-[#D88D66]/30 flex items-center justify-center">
                  <Palette className="w-5 h-5 text-[#3B2F2A]" />
                </div>
                <h3 className="text-2xl md:text-3xl font-hand font-bold text-[#3B2F2A]">Palette Notes</h3>
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
              <p className="text-xs text-navy/70 font-hand italic text-center mt-4">
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

    <SectionDivider />

    <FadeInWhenVisible className="max-w-6xl mx-auto">

        <div className="text-center mb-12 md:mb-16">

          <SignboardHeading>Explore Goa</SignboardHeading>

          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-[#D88D66] to-transparent mx-auto mb-6"></div>

          <p className="text-navy/60 text-lg md:text-xl max-w-2xl mx-auto">
            Come for the wedding, stay for the food and feni.
            <br className="hidden md:block" />
            Here's how to spend your time.
          </p>

        </div>

        <div className="grid md:grid-cols-2 gap-8 md:gap-12">

          {recommendations.map((section, idx) => {
            const isExpanded = expandedSection === section.category;
            
            return (
              <FadeInWhenVisible key={section.category} delay={idx * 0.1}>
                <div className="bg-white/80 backdrop-blur-sm sketchy-border p-8 md:p-10 shadow-lg hover:shadow-xl transition-all">
                  
                  {/* Mobile: Collapsible button header */}
                  <button
                    onClick={() => setExpandedSection(isExpanded ? null : section.category)}
                    className="md:hidden w-full flex items-center justify-between text-2xl font-bold text-navy pb-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D88D66] focus-visible:ring-offset-2 transition-all group"
                    aria-expanded={isExpanded}
                    aria-label={`${isExpanded ? 'Collapse' : 'Expand'} ${section.category} section`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full border-2 border-navy flex items-center justify-center transition-all ${isExpanded ? 'bg-[#D88D66] border-[#D88D66]' : 'bg-white group-hover:bg-[#D88D66]/10'}`}>
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
                  <h3 className="hidden md:block text-2xl md:text-3xl font-bold text-navy border-b-2 border-[#D88D66]/40 pb-4 mb-6">
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
                          <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-white border-2 border-navy/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[#D88D66] group-hover:text-white group-hover:border-[#D88D66] transition-all shadow-md group-hover:shadow-lg">
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
                                  className="flex-shrink-0 text-[#D88D66] hover:text-navy transition-colors"
                                  aria-label={`Open ${item.name} in Google Maps`}
                                  title="Open in Google Maps"
                                >
                                  <MapPin size={18} />
                                </a>
                              )}
                            </div>
                            {item.location && <p className="text-xs md:text-sm text-navy/50 mb-2 italic">{item.location}</p>}
                            <p className="text-sm md:text-base text-navy/70 leading-relaxed">{item.desc}</p>
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
          <p className="text-navy/80 italic font-hand text-lg md:text-xl leading-relaxed">
            Colomb Bay is where they learned to slow down together.<br className="hidden md:block" />
            Palolem is where they spent most of their time in the water.<br className="hidden md:block" />
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

    <FadeInWhenVisible className="max-w-5xl mx-auto">

      <div className="text-center mb-12 md:mb-16">

        <SignboardHeading variant="dark">Travel & Stay</SignboardHeading>

        <p className="text-lg opacity-80 font-hand max-w-lg mx-auto mt-4">Pack your sunscreen and sunglasses. We're taking care of the vibes.</p>

      </div>



      <div className="grid md:grid-cols-2 gap-8">

        {/* Card 1: Journey - Ticket Style */}

        <FadeInWhenVisible
          className="bg-gradient-to-br from-[#FDF9F4] to-[#EDEDE3] text-[#3B2F2A] relative group hover:-translate-y-1 transition-transform duration-300 border border-[#D4CDC2]"
          style={{
            clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
            maskImage: 'radial-gradient(circle at left center, transparent 10px, black 10px)',
            boxShadow: '0 18px 30px rgba(59, 47, 42, 0.08)'
          }}
        >

          <div className="absolute left-0 top-0 bottom-0 w-16 bg-[#D88D66] flex items-center justify-center border-r-2 border-dashed border-[#D4CDC2]">

             <div className="-rotate-90 font-hand font-bold text-xl text-white whitespace-nowrap tracking-widest">GOA EXPRESS</div>

          </div>

          <div className="pl-24 pr-8 py-8 relative">

             <div className="absolute top-4 right-4 opacity-30">

                <Anchor className="w-16 h-16 text-[#D4CDC2]" />

             </div>

             <h3 className="text-2xl font-bold mb-1 font-hand uppercase tracking-wider">Boarding Pass</h3>

             <p className="text-xs uppercase tracking-widest opacity-50 mb-6">Ticket to Paradise</p>

             

             <div className="space-y-4 font-hand text-lg">

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

        </FadeInWhenVisible>

        

        {/* Card 2: Base Camp - Notepad Style */}

        <FadeInWhenVisible
          delay={0.1}
          className="bg-gradient-to-br from-[#EDEDE3] via-[#FDF9F4] to-[#EDEDE3] text-[#3B2F2A] p-6 md:p-8 lg:p-10 relative shadow-2xl rounded-[28px] overflow-hidden border border-[#D4CDC2]"
        >

          <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-36 h-10 bg-[#EBBA9A]/50 rounded-full blur-[2px] opacity-80"></div>
          <div className="absolute top-4 right-4 w-20 h-20 bg-[#FDF9F4]/70 rounded-full blur-3xl pointer-events-none"></div>

          

          {isFamilyMode ? (

            <div className="space-y-6 relative z-10">
              <div className="space-y-3 text-left">
                <p className="text-xs uppercase tracking-[0.3em] text-navy/60">Your Stay</p>
                <h3 className="text-3xl md:text-4xl font-hand font-bold text-[#D88D66]">Kidena House</h3>
                <p className="text-base md:text-lg text-navy/80 leading-relaxed">
                  You're with us for the full four days. Rooms are assigned. Fridge is stocked. Pool is ready. Just show up.
                </p>
              </div>

              <div className="bg-[#FDF9F4]/85 border border-[#D4CDC2] rounded-2xl px-4 py-3 text-sm text-navy/75 leading-relaxed shadow-sm">
                Six bedrooms, nine bathrooms. Private pool, private lake. Personal chefs, butlers, stocked pantry. Lawns for the kids. Space for every cousin. Just arrive - everything else is sorted.
              </div>

              <div className="flex flex-wrap items-center gap-4 justify-between bg-[#FDF9F4]/90 border border-[#D4CDC2] rounded-2xl px-5 py-4 shadow-sm">
                <div>
                  <p className="text-xs uppercase tracking-[0.25em] text-navy/60">Check-in window</p>
                  <p className="font-hand text-xl text-navy">12:00 PM • March 18–22</p>
                </div>
                <a
                  href="https://maps.app.goo.gl/hZuyKOIhNYSXhZtwo"
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
              <h3 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8 font-hand text-center">Our Recommendations</h3>

            <ul className="font-hand text-lg space-y-5">

               <li className="flex gap-3 items-start border-b border-[#D4CDC2] pb-4">

                 <div className="flex-1">

                    <div className="flex items-start justify-between gap-2 mb-1">
                      <p className="font-bold">The Crown Goa</p>
                      <a
                        href="https://www.google.com/maps/search/?api=1&query=The+Crown+Goa+Panaji"
                        target="_blank"
                        rel="noreferrer"
                        className="flex-shrink-0 text-[#D88D66] hover:text-navy transition-colors"
                        aria-label="Open The Crown Goa in Google Maps"
                        title="Open in Google Maps"
                      >
                        <MapPin size={18} />
                      </a>
            </div>

                    <p className="text-sm opacity-70"><span className="font-bold text-base opacity-90">15 minutes from the venue.</span> Boutique 5-star perched on a hill in Panaji. River Mandovi views, rooftop pool, spa to decompress the next morning.</p>

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
                        className="flex-shrink-0 text-[#D88D66] hover:text-navy transition-colors"
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
                        className="flex-shrink-0 text-[#D88D66] hover:text-navy transition-colors"
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
                  <div className="max-w-sm mx-auto bg-white/90 border-2 border-[#D4CDC2] rounded-2xl px-4 py-3 shadow-inner text-center">
                    <p className="font-hand text-sm md:text-base text-[#3B2F2A] leading-relaxed">
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

    <FadeInWhenVisible className="max-w-5xl mx-auto">

        <div className="text-center mb-16 md:mb-20">

          <SignboardHeading>FAQ</SignboardHeading>
          
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-[#D88D66] to-transparent mx-auto mt-4"></div>

        </div>



        <div className="grid md:grid-cols-2 gap-6 md:gap-8">

          {questions.map((item, i) => (

          <FadeInWhenVisible key={item.q} delay={i * 0.05} className="sketchy-border p-6 md:p-8 bg-white shadow-md hover:shadow-xl rotate-1 hover:rotate-0 transition-all duration-300">

               <h4 className="font-bold text-xl md:text-2xl font-hand text-navy mb-3 flex items-start gap-3">

                 <span className="text-[#D88D66] text-2xl md:text-3xl leading-none flex-shrink-0">?</span> 
                 <span>{item.q}</span>

               </h4>

               <p className="text-base md:text-lg text-navy/80 leading-relaxed">{item.a}</p>

          </FadeInWhenVisible>

          ))}

        <FadeInWhenVisible delay={questions.length * 0.05} className="sketchy-border p-8 md:p-10 bg-gradient-to-br from-[#D88D66]/10 to-[#EBBA9A]/10 border-2 border-[#D88D66]/30 -rotate-1 hover:rotate-0 transition-all shadow-lg md:col-span-2">

             <h4 className="font-bold text-xl md:text-2xl font-hand text-navy mb-4 flex items-start gap-3">

                 <Phone size={24} className="text-[#D88D66] flex-shrink-0" />

                 Real Questions?

             </h4>

             <div className="text-base md:text-lg text-navy/80 ml-8 space-y-2 leading-relaxed">

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

  const FORMSPREE_ENDPOINT = "https://formspree.io/f/mnnwwold";

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Trim and validate all fields
    const trimmedName = (formData.name || '').trim();
    const trimmedEmail = (formData.email || '').trim();
    const trimmedPhone = (formData.phone || '').trim();
    
    // Validate required fields
    if (!trimmedName || !trimmedEmail || !trimmedPhone || !formData.attending) {
      alert('Please fill in all required fields.');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      alert('Please enter a valid email address.');
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
          alert('Error: ' + responseData.error);
        } else if (responseData.errors) {
          const errorMessages = Array.isArray(responseData.errors) 
            ? responseData.errors.map(e => e.message || e).join(', ')
            : JSON.stringify(responseData.errors);
          alert('Error: ' + errorMessages);
        } else {
          alert('Something went wrong. Status: ' + response.status + '. Check console (F12) for details.');
        }
      }
    } catch (error) {
      setIsSubmitting(false);
      console.error('Submission error:', error);
      alert('Network error. Please check your connection and try again.');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (

  <section id="rsvp" className={`${SECTION_SPACING} ${SECTION_PADDING} bg-[#FDF9F4] relative`} aria-label="RSVP">

      <SectionDivider />

      <FadeInWhenVisible className="max-w-3xl mx-auto relative">

        <Postcard>
          <div className="text-center mb-8">
          <h2 className="text-4xl md:text-5xl text-navy mb-4 font-hand">R.S.V.P.</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-[#D88D66] to-transparent mx-auto mb-4"></div>
          <p className="text-navy/70 text-base md:text-lg font-hand mb-2">We want you there.</p>
          <p className="text-navy/60 text-sm md:text-base font-hand">Please let us know if you can make it by January 20, 2026.</p>
        </div>

        {!submitted ? (
                        <form id="rsvp-form" action={FORMSPREE_ENDPOINT} method="POST" onSubmit={handleSubmit} className="space-y-6">
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
              className="w-full bg-[#D88D66] text-[#FDF9F4] font-bold text-lg py-4 mt-2 sketchy-border font-hand hover:bg-[#C97452] transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 duration-200 hover:rotate-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#D88D66] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#EBBA9A] focus-visible:ring-offset-2"
              aria-label="Submit RSVP form"
            >
                {isSubmitting ? 'Sending...' : 'Submit RSVP'}
            </button>
          </form>

        ) : (

          submittedAttendance === 'Count Me In' ? (
            <div className="text-center py-12 animate-in fade-in zoom-in duration-500 space-y-4">
              <CheckCircle size={64} className="mx-auto text-[#D88D66]" />
              <h3 className="text-3xl font-bold text-navy font-hand">RSVP Sent!</h3>
              <p className="text-navy/60">We can't wait to celebrate with you.</p>
              <button
                type="button"
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#D88D66] hover:text-navy transition-colors"
                onClick={() => {
                  setSubmitted(false);
                  setSubmittedAttendance(null);
                }}
              >
                Update my response
              </button>
            </div>
          ) : (
            <div className="text-center py-12 animate-in fade-in zoom-in duration-500 space-y-4">
              <X size={56} className="mx-auto text-navy/50" />
              <h3 className="text-3xl font-bold text-navy font-hand">We'll Miss You</h3>
              <p className="text-navy/70 max-w-md mx-auto">
                Thank you for letting us know. We'll share photos and stories after the festivities so you can celebrate from afar.
              </p>
              <p className="text-sm text-navy/60">If plans change, just resubmit the form - we'll make room.</p>
              <button
                type="button"
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#D88D66] hover:text-navy transition-colors"
                onClick={() => {
                  setSubmitted(false);
                  setSubmittedAttendance(null);
                }}
              >
                Send a different RSVP
              </button>
            </div>
          )

        )}
        </Postcard>
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

    <div className="relative z-10 max-w-4xl mx-auto space-y-8 md:space-y-12 lg:space-y-16 px-2">

      {/* Main message */}
      <FadeInWhenVisible>
        <div className="space-y-5 md:space-y-6 lg:space-y-8 max-w-3xl mx-auto px-4">
          <p className="text-lg md:text-xl lg:text-2xl xl:text-3xl font-hand leading-relaxed text-[#3B2F2A] text-center">
            Seven years ago, we found each other again.<br /> Every day since, we've chosen each other.
          </p>
          <p className="text-xl md:text-2xl lg:text-3xl xl:text-4xl font-hand font-bold text-[#D88D66] mt-6 md:mt-8 text-center leading-tight">
            Now we're making it official —<br className="hidden md:block" />
            and we want you there<br className="hidden md:block" />
            when we say it out loud.
          </p>
          <div className="pt-6 md:pt-8 space-y-2">
            <p className="text-lg md:text-xl lg:text-2xl font-hand text-[#3B2F2A] text-center">
              Shubs & Alysha
            </p>
            <p className="text-base md:text-lg lg:text-xl font-hand text-[#3B2F2A]/80 text-center">
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
        <div className="flex flex-col items-center">
          <button
            onClick={onOpenGame}
            className="flex items-center gap-2 md:gap-4 bg-[#EDEDE3] px-4 md:px-8 py-3 md:py-5 sketchy-border border-[3px] border-[#D4CDC2] rounded-lg hover:bg-[#FDF9F4] transition-all group shadow-md cursor-pointer active:scale-95 max-w-full"
            aria-label="Cookie & Bailey"
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

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white sketchy-border p-8 md:p-10 max-w-md w-full shadow-2xl"
        >
          <h3 className="text-2xl md:text-3xl font-hand font-bold text-navy mb-4 text-center">
            Family Mode
          </h3>
          <p className="text-navy/70 text-center mb-6 font-hand">
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
                className="flex-1 bg-[#D88D66] text-white font-hand font-bold py-3 px-4 rounded-lg hover:bg-[#C97452] transition-colors"
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

            whileHover={{ scale: 1.2 }}

          whileTap={{ scale: 0.9 }}

          aria-label={section.name || section.id}

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



        <section id="footer" className="scroll-section">

        <Footer 
          isFamilyMode={isFamilyMode}
          onOpenGame={() => setIsGameOpen(true)}
        />

          <CookieChaseGame isOpen={isGameOpen} onClose={() => setIsGameOpen(false)} />

        </section>

      </div>

    </>

  );

};



export default App;


