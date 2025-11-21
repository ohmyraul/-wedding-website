import React, { useState, useRef, useEffect, useMemo, memo } from 'react';

import { Menu, X, ArrowDown, CheckCircle, Lock, Unlock, Phone, Calendar, Home, PawPrint, Music, Heart, Sun, Anchor, Coffee, MapPin } from 'lucide-react';
import { motion, useScroll, useTransform, useSpring, useAnimation } from 'framer-motion';
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

    --bg-cream: #F5F0E8;

    --text-navy: #1B3A57;

    --accent-pink: #D4A5A5;

    --accent-blue: #B8D4E8;

    --paper-texture: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.6' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");

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

  /* Remove snap-stop from long content sections for smoother scrolling */
  .scroll-section-long {
    scroll-snap-stop: normal;
    min-height: 60vh;
  }



  body {

    background-color: var(--bg-cream);

    background-image: var(--paper-texture);

    color: var(--text-navy);

    font-family: 'Inter', sans-serif;

    overflow: hidden;

    -webkit-font-smoothing: antialiased;

    -moz-osx-font-smoothing: grayscale;

  }



  h1, h2, h3, .font-hand {

    font-family: 'Crimson Pro', serif;
    font-weight: 600;

  }



  .font-script {

    font-family: 'Kalam', cursive;
    font-weight: 400;

  }



  /* --- Utility Classes for Custom Colors (Fixes Contrast Issues) --- */

  .text-navy { color: var(--text-navy); }

  .bg-navy { background-color: var(--text-navy); }

  .text-cream { color: var(--bg-cream); }

  

  /* --- Sketchy Effects --- */

  .sketchy-border {

    position: relative;

    isolation: isolate;

    box-shadow: 2px 2px 0px rgba(27, 58, 87, 0.1);

    transition: transform 0.3s ease;

  }

  

  .sketchy-border::before {

    content: '';

    position: absolute;

    inset: -2px;

    border: 2px solid var(--text-navy);

    border-radius: 2px 255px 3px 25px / 255px 5px 225px 3px;

    z-index: -1;

    pointer-events: none;

  }



  .sketchy-text {
    text-shadow: 2px 2px 0px rgba(212, 165, 165, 0.4);
  }



  .watercolor-bg {

    background: radial-gradient(circle at 30% 30%, #D4A5A5 0%, transparent 50%),

                radial-gradient(circle at 70% 70%, #B8D4E8 0%, transparent 50%);

    filter: blur(60px) opacity(0.4);

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

    box-shadow: 4px 4px 0px rgba(184, 212, 232, 0.4);

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

`;

const GOOGLE_CALENDAR_URL = 'https://calendar.google.com/calendar/render?action=TEMPLATE&text=Shubs%20%26%20Alysha%20Wedding%20Celebration&dates=20260320T140000Z/20260320T180000Z&details=Celebrate%20with%20us%20in%20Goa.%20RSVP%20and%20travel%20info%20on%20our%20site.&location=Blu%20Missel%20by%20the%20River%2C%20Betul%2C%20Goa%20403713%2C%20India';
const ICS_CALENDAR_PATH = '/calendar/shubs-alysha-wedding.ics';
const VENUE_GOOGLE_MAPS_URL = 'https://www.google.com/maps/search/?api=1&query=Blu+Missel+by+the+River,+Betul,+Goa+403713,+India';
const VENUE_APPLE_MAPS_URL = 'http://maps.apple.com/?address=Betul,Goa,India&q=Blu+Missel+by+the+River';
const NEARBY_STAYS_URL = 'https://www.google.com/maps/search/Hotels+near+Betul+Goa';



const FadeInWhenVisible = memo(({ children, delay = 0, className = '' }) => {

  const controls = useAnimation();

  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });



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

  <div className="absolute -top-6 -right-6 bg-[#D4A5A5] text-white font-hand text-xl p-4 rounded-full rotate-12 shadow-lg animate-float z-20 border-4 border-white border-dashed transform hover:scale-110 transition-transform cursor-pointer">

    <div className="text-center leading-tight font-bold">

      Cookie &<br/>Bailey<br/>Approved<br/><PawPrint className="w-5 h-5 mx-auto mt-1" />

    </div>

  </div>

);



const Nav = ({ isFamilyMode }) => {

  const [isOpen, setIsOpen] = useState(false);

  

  let links = [

    { name: 'Story', href: '#our-story' },

    { name: 'Party', href: '#the-celebration' },

    { name: 'Goa Tips', href: '#explore-goa' },

    { name: 'Travel', href: '#travel' },

    { name: 'Q&A', href: '#q-a' },

    { name: 'RSVP', href: '#rsvp' }

  ];



  if (isFamilyMode) {

    links.splice(1, 0, { name: 'Kidena House', href: '#kidena-house' });

    links.splice(2, 0, { name: 'Family Plan', href: '#family-itinerary' });

  }



  return (

    <nav className="fixed top-0 left-0 right-0 z-50 py-4 px-6">

      <div className="max-w-6xl mx-auto bg-[#F5F0E8]/95 backdrop-blur-sm border-b-2 border-navy/10 px-6 py-3 flex justify-between items-center shadow-sm" style={{ borderRadius: '255px 15px 225px 15px / 15px 225px 15px 255px' }}>

        <a href="#" className="text-3xl text-navy font-hand font-bold tracking-wide flex items-center gap-2 sketchy-text">

          S & A 

          {isFamilyMode && <span className="text-xs bg-[#D4A5A5] text-white px-2 py-0.5 font-sans rotate-3 rounded-sm">FAMILY</span>}

        </a>

        

        <div className="hidden lg:flex gap-8">

          {links.map(link => (

            <a key={link.name} href={link.href} className="text-lg font-hand font-bold text-navy/80 hover:text-[#D4A5A5] hover:rotate-2 transition-all">

              {link.name}

            </a>

          ))}

        </div>

        

        <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden text-navy" aria-label="Toggle navigation menu" aria-expanded={isOpen}>

          {isOpen ? <X /> : <Menu />}

        </button>

      </div>

      

      {isOpen && (

        <div className="absolute top-24 right-6 left-6 bg-white border-2 border-navy shadow-lg p-6 flex flex-col gap-4 lg:hidden sketchy-border rotate-1 z-50">

          {links.map(link => (

            <a key={link.name} href={link.href} onClick={() => setIsOpen(false)} className="text-2xl font-hand text-navy hover:text-[#D4A5A5] text-center border-b border-gray-100 pb-2">

              {link.name}

            </a>

          ))}

        </div>

      )}

    </nav>

  );

};



const Hero = ({ onScrollToSection }) => (

  <section className="min-h-screen flex flex-col items-center justify-center px-4 pt-20 md:pt-24 pb-8 md:pb-12 relative" aria-label="Hero section">

    <div className="watercolor-bg"></div>

    

    {/* Doodles */}

    <ParallaxWrapper offset={30} className="absolute top-24 left-10">

      <Sun className="w-12 h-12 text-[#D4A5A5] opacity-60 rotate-12 animate-float" />

    </ParallaxWrapper>

    <ParallaxWrapper offset={-30} className="absolute bottom-32 right-8">

      <Heart className="w-8 h-8 text-[#B8D4E8] opacity-60 -rotate-6 animate-float" />

    </ParallaxWrapper>



    <FadeInWhenVisible className="max-w-5xl w-full text-center relative z-10">

      

      <motion.h1 

        className="text-[5rem] md:text-[6rem] leading-[0.8] text-navy font-hand select-none relative inline-block sketchy-text" 

        style={{ textShadow: '4px 4px 0px rgba(212, 165, 165, 0.3)' }}

        initial={{ scale: 0.8, opacity: 0 }}

        animate={{ scale: 1, opacity: 1 }}

        transition={{ type: 'spring', stiffness: 120, damping: 14 }}

      >

        S<span className="text-[#D4A5A5]">&</span>A

      </motion.h1>

      

      <div className="flex flex-col items-center gap-4 mt-6 mb-12 rotate-[-1deg]">

        <h2 className="text-3xl md:text-5xl font-hand text-navy relative">

          Shubs & Alysha

          <svg className="absolute -bottom-4 left-0 w-full h-3" viewBox="0 0 100 10" preserveAspectRatio="none">

             <path d="M0,5 Q50,10 100,5" stroke="#D4A5A5" strokeWidth="3" fill="none" />

          </svg>

        </h2>

        <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 text-navy/80 font-hand text-xl uppercase tracking-widest mt-2">

          <span>March 20, 2026</span>

          <span className="hidden md:block w-2 h-2 rounded-full bg-[#D4A5A5]"></span>

          <span>Goa, India</span>

        </div>

      </div>



      <ParallaxWrapper offset={80} hoverEffect className="relative max-w-2xl mx-auto rotate-1 hover:rotate-0 transition-transform duration-500 px-4">

         <div className="bg-white p-4 sketchy-border shadow-xl">

            <motion.div 

              className="w-full bg-[#F5F0E8] overflow-hidden relative" 

              style={{ minHeight: '400px' }}

              initial={{ scale: 1.05 }}

              whileHover={{ scale: 1.02 }}

            >

               <motion.img 

                 src="/images/hero.jpg" 

                 alt="Shubs and Alysha" 

                 className="w-full h-full object-cover"
                 width={1024}
                 height={890}

                 initial={{ scale: 1.2 }}

                 animate={{ scale: 1 }}

                 transition={{ duration: 1.2, ease: 'easeOut' }}

                 loading="eager"

               />




            </motion.div>

         </div>

         <ApprovedStamp />

      </ParallaxWrapper>

    </FadeInWhenVisible>

    

    <motion.div 

      className="absolute bottom-8 text-navy/30"

      animate={{ y: [0, -10, 0] }}

      transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}

    >

      <ArrowDown size={32} aria-hidden="true" />

    </motion.div>

  </section>

);



const Story = () => (

  <section id="our-story" className="pt-8 md:pt-12 lg:pt-16 pb-12 md:pb-16 lg:pb-20 px-4 md:px-6 relative">

    <FadeInWhenVisible className="max-w-5xl mx-auto">

      <StickyHeader>

        <div className="text-center">

          <h2 className="text-4xl md:text-6xl font-hand text-navy inline-block sketchy-text mb-2">

          How This Happened

        </h2>

        <div className="w-32 h-1 bg-gradient-to-r from-transparent via-[#D4A5A5] to-transparent mx-auto"></div>

      </div>

      </StickyHeader>



      <div className="mb-12 md:mb-20"></div>

      

      <div className="space-y-16 md:space-y-24 lg:space-y-28 relative pt-8 md:pt-0">

        <Music className="absolute -top-4 md:top-0 left-0 w-12 h-12 md:w-16 md:h-16 text-navy/20 -rotate-12 z-0" fill="currentColor" />

        <SketchIcon type="palm" className="absolute bottom-0 right-0 w-16 md:w-24 text-navy/5 rotate-12 z-0" />



        {/* 2015 */}

        <FadeInWhenVisible delay={0.1}>

          <div className="grid md:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center mb-20 md:mb-32">

            <ParallaxWrapper offset={25} hoverEffect className="sketchy-border p-3 bg-white rotate-2 order-2 md:order-1 photo-frame">

            <div className="overflow-hidden relative" style={{ minHeight: '300px', maxHeight: '500px' }}>

               <img src="/images/firsttime.jpg" className="w-full h-full object-cover sepia-[.3]" alt="The First Time" style={{ maxHeight: '100%' }} loading="lazy" width={696} height={1024} />

            </div>

            <p className="text-center font-hand text-navy/50 mt-2">Hello, goodbye, sea you in three years</p>

            </ParallaxWrapper>

          <div className="order-1 md:order-2">

              <span className="inline-block bg-[#D4A5A5] text-white px-3 md:px-4 py-1 font-hand text-lg md:text-xl mb-3 md:mb-4 rotate-[-2deg] shadow-sm">2015</span>

              <h3 className="text-2xl md:text-3xl lg:text-4xl font-hand font-bold text-navy mb-3 md:mb-4">The First Time</h3>

              <div className="text-base md:text-lg text-navy/80 space-y-2 md:space-y-3 leading-relaxed">

              <p>House party in Bangalore. Her place. His friend insisted he come along.</p>

              <p>They talked for hours that night. Bengali boy from Assam meets Goan girl from Abu Dhabi. The conversation was easy, natural. Good vibes all around.</p>

              <p>Then the party ended. They didn't exchange numbers. Three years of complete radio silence.</p>

            </div>

          </div>

        </div>

        </FadeInWhenVisible>



        {/* 2018 */}

        <FadeInWhenVisible delay={0.15}>

          <div className="grid md:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center mb-20 md:mb-32">

          <div>

              <span className="inline-block bg-[#B8D4E8] text-white px-3 md:px-4 py-1 font-hand text-lg md:text-xl mb-3 md:mb-4 rotate-[2deg] shadow-sm">June 2018</span>

              <h3 className="text-2xl md:text-3xl lg:text-4xl font-hand font-bold text-navy mb-3 md:mb-4">The Reunion</h3>

              <div className="text-base md:text-lg text-navy/80 space-y-2 md:space-y-3 leading-relaxed">

              <p>She starts new job, walks down office corridor, there he is.</p>

              <p>Coffee runs became a daily thing. Then late nights at the office turned into dinners after work. It felt comfortable, safe. Like really good friendship.</p>

              <p>Then someone threw him a half-hearted birthday party. She showed up and realized something had shifted. She cared way more than friends should care about someone's birthday.</p>

              <p>Two weeks later, he kissed her. They were official by the end of June.</p>

            </div>

          </div>

            <ParallaxWrapper offset={-20} hoverEffect className="sketchy-border p-3 bg-white -rotate-2 photo-frame">

            <div className="overflow-hidden relative" style={{ minHeight: '300px', maxHeight: '500px' }}>

               <img src="/images/office.jpg" className="w-full h-full object-cover sepia-[.3]" alt="The Reunion" style={{ maxHeight: '100%' }} loading="lazy" width={666} height={1024} />

            </div>

             <p className="text-center font-hand text-navy/50 mt-2">From slack DMs to slacking off together</p>

            </ParallaxWrapper>

        </div>

        </FadeInWhenVisible>



        {/* GOA Years */}

        <FadeInWhenVisible delay={0.2}>

          <div className="grid md:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center mb-20 md:mb-32">

            <ParallaxWrapper offset={30} hoverEffect className="sketchy-border p-3 bg-white rotate-1 order-2 md:order-1 photo-frame">

            <div className="overflow-hidden relative" style={{ minHeight: '300px', maxHeight: '500px' }}>

               <img src="/images/goa-scooter.jpg" className="w-full h-full object-cover" alt="Goa Life" style={{ maxHeight: '100%' }} loading="lazy" width={765} height={1024} />

            </div>

            <p className="text-center font-hand text-navy/50 mt-2">Goa, dogs & growing Together</p>

            </ParallaxWrapper>

          <div className="order-1 md:order-2">

              <span className="inline-block bg-[#D4A5A5] text-white px-3 md:px-4 py-1 font-hand text-lg md:text-xl mb-3 md:mb-4 rotate-[-1deg] shadow-sm">2018-2021</span>

              <h3 className="text-2xl md:text-3xl lg:text-4xl font-hand font-bold text-navy mb-3 md:mb-4">Building a Life</h3>

              <div className="text-base md:text-lg text-navy/80 space-y-2 md:space-y-3 leading-relaxed">

              <p>She took him to Goa. Made it a ritual. Twice a year, every single year. Palolem Beach, Colomb Bay. Their sanctuary. The place they'd go to reset and remember what mattered.</p>

              <p>He didn't trust the ocean at first. She taught him to dive, to let go underwater. He taught her how to stay calm when life felt chaotic.</p>

              <p>Then COVID hit. Bailey had puppies during lockdown. Six of them. They kept four, lost two. The hardest, most beautiful thing they'd ever done together. When it was time, Shubs brought Bailey to Bangalore. Cookie and Bailey became family.</p>

            </div>

          </div>

        </div>

        </FadeInWhenVisible>



        {/* Proposal */}

        <FadeInWhenVisible delay={0.25}>

          <div className="grid md:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center">

          <div>

              <span className="inline-block bg-[#B8D4E8] text-white px-3 md:px-4 py-1 font-hand text-lg md:text-xl mb-3 md:mb-4 rotate-[2deg] shadow-sm">January 6, 2025</span>

              <h3 className="text-2xl md:text-3xl lg:text-4xl font-hand font-bold text-navy mb-3 md:mb-4">The Question</h3>

              <div className="text-base md:text-lg text-navy/80 space-y-2 md:space-y-3 leading-relaxed">

              <p>Back at Palolem Beach. He'd made plans. Plan A: underwater proposal (ring might sink, she might panic). Plan B: Kakolem Beach at sunset (neither wanted the trek that day).</p>

              <p>Plan C won. Keep it simple. Wing it.</p>

              <p>They were walking between Palolem and Colomb. The midpoint where the two beaches meet. They swam in Palolem, lived in Colomb. This stretch was theirs.</p>

              <p>He stopped. She turned around.</p>

              <p>He was on his knees. Ring in hand. She said yes before he finished asking.</p>

            </div>

          </div>

            <ParallaxWrapper offset={-25} hoverEffect className="sketchy-border p-4 bg-white -rotate-1">

             <div className="overflow-hidden relative" style={{ minHeight: '300px', maxHeight: '500px' }}>

                <img src="/images/proposal.jpg" className="w-full h-full object-cover" alt="The Proposal" style={{ maxHeight: '100%' }} loading="lazy" width={696} height={1024} />

             </div>

             <p className="text-center font-hand text-navy/50 mt-2">Ring. Sand. Forever.</p>

            </ParallaxWrapper>

      </div>

        </FadeInWhenVisible>

    </div>

    </FadeInWhenVisible>

  </section>

);



const CookieAndBailey = () => (

  <section className="py-16 md:py-20 lg:py-24 px-4 md:px-6 relative bg-white">

    <FadeInWhenVisible className="max-w-5xl mx-auto text-center">

      <h3 className="text-4xl md:text-5xl font-hand text-navy mb-6">The Real Bosses</h3>

      <div className="w-24 h-1 bg-gradient-to-r from-transparent via-[#D4A5A5] to-transparent mx-auto mb-12 md:mb-16"></div>
      
      <div className="grid md:grid-cols-2 gap-12 md:gap-16">

        {/* Cookie */}

        <FadeInWhenVisible delay={0.1} className="relative group">

            <motion.div 

              className="sketchy-border bg-white p-8 md:p-10 relative transform rotate-2 transition-all group-hover:rotate-0 shadow-lg hover:shadow-xl"

              whileHover={{ rotate: 0, scale: 1.03 }}

            >

                <div className="w-48 h-48 md:w-56 md:h-56 mx-auto mb-6 md:mb-8 border-4 border-navy rounded-full overflow-hidden bg-gray-100 flex items-center justify-center shadow-md">

                   <motion.img src="/images/cookie.jpg" alt="Cookie" className="w-full h-full object-cover" whileHover={{ scale: 1.08 }} loading="lazy" width={687} height={1024} />

                </div>

                <h4 className="font-bold text-3xl md:text-4xl text-navy font-hand mb-4">Cookie</h4>

                <p className="font-hand text-lg md:text-xl mt-2 leading-relaxed text-navy/80">Alysha's first love. Been around for 12 years. Will absolutely bark at you during the ceremony. Multiple times, probably. We're not apologizing for it.</p>

            </motion.div>

        </FadeInWhenVisible>



        {/* Bailey */}

        <FadeInWhenVisible delay={0.15} className="relative group">

            <motion.div 

              className="sketchy-border bg-white p-8 md:p-10 relative transform -rotate-2 transition-all group-hover:rotate-0 shadow-lg hover:shadow-xl"

              whileHover={{ rotate: 0, scale: 1.03 }}

            >

                <div className="w-48 h-48 md:w-56 md:h-56 mx-auto mb-6 md:mb-8 border-4 border-navy rounded-full overflow-hidden bg-gray-100 flex items-center justify-center shadow-md">

                    <motion.img src="/images/bailey.jpg" alt="Bailey" className="w-full h-full object-cover" whileHover={{ scale: 1.08 }} loading="lazy" width={696} height={1024} />

                </div>

                <h4 className="font-bold text-3xl md:text-4xl text-navy font-hand mb-4">Bailey</h4>

                <p className="font-hand text-lg md:text-xl mt-2 leading-relaxed text-navy/80">Their rescue dog. She's two-faced, literally. Half her face is a different color. Shubs brought her to Bangalore after COVID. She's family now.</p>

            </motion.div>

        </FadeInWhenVisible>

      </div>

      <div className="mt-12 grid gap-4 md:grid-cols-2">
        <a 
          href={VENUE_GOOGLE_MAPS_URL} 
          target="_blank" 
          rel="noreferrer" 
          className="sketchy-border border-2 border-[#D4A5A5]/40 bg-white text-navy px-6 py-4 font-hand text-lg flex items-center justify-center gap-3 hover:-translate-y-1 transition-all"
          aria-label="Open venue in Google Maps"
        >
          <MapPin size={20} />
          Google Maps Venue Pin
        </a>
        <a 
          href={VENUE_APPLE_MAPS_URL} 
          target="_blank" 
          rel="noreferrer" 
          className="sketchy-border border-2 border-[#B8D4E8]/40 bg-white text-navy px-6 py-4 font-hand text-lg flex items-center justify-center gap-3 hover:-translate-y-1 transition-all"
          aria-label="Open venue in Apple Maps"
        >
          <MapPin size={20} />
          Apple Maps Venue Pin
        </a>
      </div>

      <div className="mt-4">
        <a 
          href={NEARBY_STAYS_URL} 
          target="_blank" 
          rel="noreferrer" 
          className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[#D4A5A5] text-white font-hand text-base uppercase tracking-wide hover:scale-105 transition-transform"
          aria-label="Open nearby stay suggestions"
        >
          <Home size={18} />
          Find Nearby Stays
        </a>
      </div>

    </FadeInWhenVisible>

  </section>

);



/* --- NEW COMPONENTS (Missing in original) --- */

const KidenaHouse = () => (

  <section id="kidena-house" className="py-20 md:py-24 lg:py-28 px-4 md:px-6 bg-[#1B3A57] text-[#F5F0E8] relative overflow-hidden">

    {/* Subtle background decoration */}
    <div className="absolute inset-0 opacity-5 pointer-events-none">
        <SketchIcon type="palm" className="absolute top-20 right-20 w-96 h-96 text-white" />
    </div>

    <FadeInWhenVisible className="max-w-7xl mx-auto relative z-10">

        {/* Header Section */}
        <div className="text-center mb-16 md:mb-20">
            <h2 className="text-4xl md:text-5xl font-hand mb-6 text-[#F5F0E8] leading-tight">Where You'll Stay</h2>
            <p className="text-xl md:text-2xl font-hand text-[#F5F0E8]/80">Kidena House • Batim Village, Goa Velha</p>
    </div>

        {/* Hero Image - Full Width */}
        <div className="mb-16 md:mb-20">
            <ParallaxWrapper offset={30} hoverEffect>
                <div className="sketchy-border bg-white p-2 shadow-2xl max-w-4xl mx-auto">
                    <img 
                        src="/images/kidena-house.jpg" 
                        alt="Kidena House" 
                        className="w-full h-[400px] md:h-[500px] lg:h-[600px] object-cover" 
                        loading="lazy"
                        width={1024}
                        height={765}
                    />
                </div>
            </ParallaxWrapper>
        </div>

        {/* Features Grid - 2x2 Layout */}
        <div className="grid md:grid-cols-2 gap-6 md:gap-8 mb-16">
            
            <div className="bg-[#F5F0E8] text-navy p-6 md:p-8 sketchy-border border-2 border-[#D4A5A5] shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-[#D4A5A5]/20 flex items-center justify-center flex-shrink-0">
                        <Home className="w-6 h-6 text-[#D4A5A5]" />
                    </div>
                    <div className="flex-1">
                        <h3 className="font-bold text-[#D4A5A5] text-2xl md:text-3xl font-hand mb-3">The House</h3>
                        <p className="text-navy/80 font-hand text-lg md:text-xl leading-relaxed">6 bedrooms, 9 bathrooms. Private pool and a private lake on the property. Three acres of space to spread out and breathe.</p>
                    </div>
                </div>
        </div>

            <div className="bg-[#F5F0E8] text-navy p-6 md:p-8 sketchy-border border-2 border-[#B8D4E8] shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-[#B8D4E8]/20 flex items-center justify-center flex-shrink-0">
                        <SketchIcon type="plate" className="w-6 h-6 text-[#B8D4E8]" />
                    </div>
                    <div className="flex-1">
                        <h3 className="font-bold text-[#B8D4E8] text-2xl md:text-3xl font-hand mb-3">No Cooking, No Cleaning</h3>
                        <p className="text-navy/80 font-hand text-lg md:text-xl leading-relaxed">Personal chefs will cook whatever you're craving. Breakfast, lunch, dinner, midnight snacks. Whatever. Butlers handle everything else. You just relax.</p>
                    </div>
                </div>
            </div>

            <div className="bg-[#F5F0E8] text-navy p-6 md:p-8 sketchy-border border-2 border-[#D4A5A5] shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-[#D4A5A5]/20 flex items-center justify-center flex-shrink-0">
                        <Sun className="w-6 h-6 text-[#D4A5A5]" />
                    </div>
                    <div className="flex-1">
                        <h3 className="font-bold text-[#D4A5A5] text-2xl md:text-3xl font-hand mb-3">Spa</h3>
                        <p className="text-navy/80 font-hand text-lg md:text-xl leading-relaxed">There's an on-site spa if you need to decompress before all the wedding chaos starts.</p>
                    </div>
                </div>
        </div>

            <div className="bg-[#F5F0E8] text-navy p-6 md:p-8 sketchy-border border-2 border-[#B8D4E8] shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-[#B8D4E8]/20 flex items-center justify-center flex-shrink-0">
                        <Music className="w-6 h-6 text-[#B8D4E8]" />
                    </div>
                    <div className="flex-1">
                        <h3 className="font-bold text-[#B8D4E8] text-2xl md:text-3xl font-hand mb-3">Keep Busy (or Don't)</h3>
                        <p className="text-navy/80 font-hand text-lg md:text-xl leading-relaxed">Pool table, PlayStation, fishing in the private lake, bicycles to ride around. Or just lounge by the pool all day. Your choice.</p>
                    </div>
                </div>
        </div>

      </div>

        {/* Dates Section - Centered */}
        <div className="max-w-2xl mx-auto">
            <div className="bg-[#F5F0E8] text-navy p-8 md:p-10 sketchy-border border-2 border-[#D4A5A5] shadow-lg text-center">
                <div className="flex items-center justify-center gap-4 mb-4">
                    <Calendar className="text-[#D4A5A5]" size={32} />
                    <h3 className="font-bold text-2xl md:text-3xl font-hand text-navy">March 18-22, 2026</h3>
                </div>
                <p className="font-hand text-xl md:text-2xl text-navy/80 leading-relaxed">This is home base for the family. Where we'll all be together in the days leading up to the wedding. The calm before the beautiful storm.</p>
            </div>
    </div>

    </FadeInWhenVisible>

  </section>

);



const FamilyItinerary = () => (

  <section id="family-itinerary" className="py-12 md:py-16 lg:py-20 px-4 md:px-6 bg-gradient-to-b from-[#F5F0E8] to-white relative">

    <div className="absolute inset-0 opacity-5 pointer-events-none">

        <SketchIcon type="palm" className="absolute top-20 right-20 w-96 h-96 text-navy rotate-12" />

    </div>

     <FadeInWhenVisible className="max-w-5xl mx-auto relative z-10">

        <div className="text-center mb-16">

            <h2 className="text-4xl md:text-5xl font-hand text-navy mb-4">The Family Plan</h2>

            <p className="text-navy/70 font-hand text-xl md:text-2xl">Your guide to four days in Goa</p>

        </div>

        

        <div className="space-y-8 md:space-y-10">

            {[

                { 
                    day: "Thursday, March 19", 
                    time: "All Day",
                    title: "Arrival & Pool Party", 
                    desc: "You're finally here. We'll have cars waiting at the airport to bring you straight to Kidena House. Take your time unpacking and settling into your rooms. We'll order the best Goan food we can find for dinner. Then: pool party. Later that evening, some of us are heading to Panjim for a pub crawl. Joseph's Bar, Miguel's, all our favorite haunts from the past seven years. Come along if you want, or stay back at the house and relax by the pool. Whatever feels right.",
                    icon: Home,
                    color: "#D4A5A5"
                },

                { 
                    day: "Friday, March 20", 
                    time: "Morning",
                    title: "Rehearsal Day", 
                    desc: "We'll all have breakfast together at the house. Slow morning, good coffee, no rush. Then those of us actually in the ceremony will head to Blu Missel for rehearsal. Kids can absolutely stay back at Kidena and enjoy the pool. No need to drag them to a boring rehearsal.",
                    icon: Sun,
                    color: "#B8D4E8"
                },

                { 
                    day: "Friday, March 20", 
                    time: "Afternoon",
                    title: "The Wedding", 
                    desc: "This is it. The day we've been planning for months. Cars leave Kidena House at 2:30 PM sharp. We're still figuring out the mix of rental cars and cabs, but we'll have it sorted. Just please be ready on time. (Yes, we're talking to specific family members who are always fashionably late.)",
                    icon: Heart,
                    color: "#D4A5A5"
                },

                { 
                    day: "Saturday, March 21", 
                    time: "All Day",
                    title: "Recovery & Chill", 
                    desc: "Sleep as late as you need to. No agenda today. No schedule. Pool, spa, naps, whatever your body is asking for after last night. Later in the evening, let's all meet up at Bar Outrigger. It's this gorgeous spot right by the beach with a little cove. Perfect for sunset. We'll have drinks, decompress together, soak in the fact that we actually pulled this off.",
                    icon: Anchor,
                    color: "#B8D4E8"
                },

                { 
                    day: "Sunday, March 22", 
                    time: "All Day",
                    title: "Rest & Goodbyes", 
                    desc: "People can leave whenever their flights are. Take your time checking out. We'll be around all day to say proper goodbyes and squeeze in a few more hours together. Thank you for being here for all of this. For showing up, for celebrating with us, for making this week exactly what we hoped it would be. It means absolutely everything.",
                    icon: Coffee,
                    color: "#D4A5A5"
                }

            ].map((item, i) => (

                <FadeInWhenVisible key={`${item.day}-${i}`} delay={i * 0.1}>

                    <div className="bg-white sketchy-border p-6 md:p-8 shadow-lg hover:shadow-xl transition-shadow border-2" style={{ borderColor: item.color }}>

                        <div className="flex flex-col md:flex-row md:items-start gap-4 md:gap-6">

                            {/* Icon and date column */}
                            <div className="flex-shrink-0 flex items-start gap-4">

                                <div className="w-16 h-16 rounded-full flex items-center justify-center border-4 flex-shrink-0" style={{ backgroundColor: `${item.color}20`, borderColor: item.color }}>

                                    <item.icon className="w-8 h-8" style={{ color: item.color }} />

                    </div>

                                <div className="flex-1 md:min-w-[140px]">

                                    <div className="font-hand font-bold text-navy text-lg md:text-xl mb-1">{item.day}</div>

                                    {item.time && (

                                        <div className="font-hand text-sm text-navy/60">{item.time}</div>

                                    )}

                    </div>

                </div>

                            {/* Content column */}
                            <div className="flex-1">

                                <h3 className="font-hand font-bold text-2xl md:text-3xl mb-3" style={{ color: item.color }}>{item.title}</h3>

                                <p className="font-hand text-lg md:text-xl text-navy/80 leading-relaxed">{item.desc}</p>

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

  <section id="the-celebration" className="py-16 md:py-20 lg:py-24 px-4 md:px-6 relative">

    <div className="watercolor-bg" style={{ transform: 'scaleY(-1)' }}></div>

    <FadeInWhenVisible className="max-w-6xl mx-auto">

      <StickyHeader>

        <div className="text-center mb-12 md:mb-16">

          <h2 className="text-4xl md:text-5xl font-hand text-navy inline-block border-b-4 border-[#D4A5A5] pb-3 mb-4" style={{ borderRadius: '50% 20% / 10% 40%' }}>The Big Party</h2>
          
          <div className="w-32 h-1 bg-gradient-to-r from-transparent via-[#D4A5A5] to-transparent mx-auto"></div>

      </div>

      </StickyHeader>



      <div className="grid lg:grid-cols-2 gap-12 md:gap-16 items-start">

        <ParallaxWrapper offset={25} hoverEffect className="sketchy-border p-3 bg-white rotate-1 shadow-lg">

             <div className="bg-gray-100 h-80 md:h-96 w-full overflow-hidden border-b-2 border-navy relative">

                <img 

                  src="/images/blu-missel.jpeg" 

                  alt="Blu Missel by the River" 

                  loading="lazy" 

                  className="absolute inset-0 w-full h-full object-cover"
                  width={1024}
                  height={683}

                />


             </div>

             <div className="p-6 md:p-8 space-y-6">

                <h3 className="text-3xl md:text-4xl font-hand font-bold text-navy">Friday, March 20, 2026</h3>

                <div className="flex items-start gap-4">

                   <SketchIcon type="palm" className="w-8 h-8 md:w-10 md:h-10 text-[#D4A5A5] flex-shrink-0 mt-1" />

                   <div className="font-hand text-xl md:text-2xl leading-tight">

                     <p className="font-bold text-navy">Blu Missel by the River</p>

                     <p className="text-navy/70">Betul, Goa 403713</p>

                   </div>

                </div>

                <div className="bg-[#F5F0E8] p-4 md:p-5 rounded-sm border-2 border-navy/20 transform -rotate-1">

                   <p className="text-base md:text-lg text-navy/80 leading-relaxed">Riverside setting. Goan feast with fresh seafood. Open bar all night. Everything you need.</p>

                </div>

             </div>

        </ParallaxWrapper>



        <div className="relative pt-4 md:pt-8 pl-8 md:pl-12">

           <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-navy" style={{ filter: 'url(#roughen)' }}></div>

           

           <div className="space-y-8 md:space-y-12">

              {[

                  { time: '3:30 PM', event: 'Wedding Ceremony', note: 'Riverside vows. Cookie & Bailey bringing the rings (or trying to).', icon: Heart },

                  { time: '4:30 PM', event: 'Hi-Tea & Photos', note: "Golden hour light. We'll be posing for photos. You grab snacks and mingle.", icon: SketchIcon, type: 'wine' },

                  { time: '6:00 PM', event: 'Cocktails', note: 'Bar officially opens. Signature drinks on the deck.', icon: SketchIcon, type: 'wine' },

                  { time: '6:45 PM', event: 'Reception', note: 'Grand entrance, toasts from people we love, cake cutting.', icon: Anchor },

                  { time: '7:15 PM', event: 'Dance Floor', note: 'DJ takes over. Time to move.', icon: Music },

                  { time: '9:00 PM', event: 'Dinner', note: 'Full Goan feast. Buffet style. Come hungry.', icon: SketchIcon, type: 'plate' },

                  { time: '10:00 PM', event: 'Last Call', note: "Music officially ends. But honestly, the party probably continues somewhere.", icon: Sun }

              ].map((item, i) => (

                  <FadeInWhenVisible key={item.event} delay={i * 0.05} className="relative pl-8 md:pl-10 group">

                      <div className="absolute -left-[26px] md:-left-[30px] top-1 w-12 h-12 md:w-14 md:h-14 bg-white border-3 border-navy rounded-full flex items-center justify-center z-10 group-hover:scale-125 transition-transform shadow-lg hover:shadow-xl">

                         {item.type ? 

                            <SketchIcon type={item.type} className="w-5 h-5 text-navy" /> : 

                            <item.icon className="w-5 h-5 text-navy" />

                         }

                      </div>

                      <h4 className="font-hand font-bold text-2xl md:text-3xl text-navy mb-2">{item.event}</h4>

                      <p className="font-hand text-[#D4A5A5] text-lg md:text-xl font-bold mb-3">{item.time}</p>

                      <p className="font-hand text-navy/70 text-base md:text-lg leading-relaxed">{item.note}</p>

                  </FadeInWhenVisible>

              ))}

           </div>

        </div>

      </div>

      <div className="mt-12 grid gap-4 md:grid-cols-2">
        <a
          href={GOOGLE_CALENDAR_URL}
          target="_blank"
          rel="noreferrer"
          className="sketchy-border border-2 border-[#D4A5A5]/40 bg-white text-navy px-6 py-4 font-hand text-lg flex items-center justify-center gap-3 hover:-translate-y-1 transition-all"
          aria-label="Add wedding to Google Calendar"
        >
          <Calendar size={20} />
          Add to Google Calendar
        </a>
        <a
          href={ICS_CALENDAR_PATH}
          download
          className="sketchy-border border-2 border-[#B8D4E8]/40 bg-white text-navy px-6 py-4 font-hand text-lg flex items-center justify-center gap-3 hover:-translate-y-1 transition-all"
          aria-label="Download ICS calendar file"
        >
          <Calendar size={20} />
          Download .ics File
        </a>
        <a
          href={VENUE_GOOGLE_MAPS_URL}
          target="_blank"
          rel="noreferrer"
          className="sketchy-border border-2 border-[#D4A5A5]/40 bg-white text-navy px-6 py-4 font-hand text-lg flex items-center justify-center gap-3 hover:-translate-y-1 transition-all"
          aria-label="Open venue in Google Maps"
        >
          <MapPin size={20} />
          Google Maps Venue Pin
        </a>
        <a
          href={VENUE_APPLE_MAPS_URL}
          target="_blank"
          rel="noreferrer"
          className="sketchy-border border-2 border-[#B8D4E8]/40 bg-white text-navy px-6 py-4 font-hand text-lg flex items-center justify-center gap-3 hover:-translate-y-1 transition-all"
          aria-label="Open venue in Apple Maps"
        >
          <MapPin size={20} />
          Apple Maps Venue Pin
        </a>
      </div>

    </FadeInWhenVisible>

  </section>

);



const DressCode = () => {

  const colors = [
    { name: 'Coral Orange', hex: '#ffbd7b', bg: '#ffbd7b' },
    { name: 'Beige', hex: '#F5F0E8', bg: '#F5F0E8' },
    { name: 'Sky Blue', hex: '#B8D4E8', bg: '#B8D4E8' }
  ];

  return (

    <section className="py-16 md:py-20 lg:py-24 px-4 md:px-6 bg-gradient-to-b from-white to-[#F5F0E8]/30 relative">

      {/* Decorative elements */}
      <Sun className="absolute top-10 right-10 w-16 h-16 text-[#ffbd7b]/20 rotate-12 animate-float" />
      <Heart className="absolute bottom-10 left-10 w-12 h-12 text-[#B8D4E8]/20 -rotate-6 animate-float" />

      <FadeInWhenVisible className="max-w-6xl mx-auto relative z-10">

        <div className="text-center mb-20 md:mb-24">

          <h2 className="text-4xl md:text-5xl font-hand text-navy mb-6 sketchy-text">What to Wear</h2>

          <div className="w-32 h-1 bg-gradient-to-r from-transparent via-[#ffbd7b] to-transparent mx-auto mb-8"></div>

          <p className="text-navy/60 font-hand text-lg md:text-xl max-w-2xl mx-auto">Dress code inspiration for our special day</p>

        </div>

        <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-start">

          <FadeInWhenVisible className="space-y-8 bg-white/90 backdrop-blur-sm sketchy-border p-10 md:p-12 rotate-[-1deg] hover:rotate-0 transition-all duration-300 shadow-lg hover:shadow-xl">

            <div className="flex items-center gap-4 mb-6">

              <div className="w-12 h-12 rounded-full bg-[#ffbd7b]/20 flex items-center justify-center">
                <Music className="w-6 h-6 text-[#ffbd7b]" />
              </div>

              <h3 className="text-3xl md:text-4xl font-bold text-navy font-hand">Beach Formal</h3>

            </div>

            <div className="space-y-6 font-hand text-lg md:text-xl text-navy/80 leading-relaxed">

              <p className="text-xl md:text-2xl">Think flowy dresses, linen suits, comfortable shoes. We're on grass, so heels will sink. We want you to feel beautiful but also relaxed enough to actually enjoy yourself.</p>

              <div className="flex items-start gap-3 pt-4 border-t-2 border-navy/10 bg-[#F5F0E8]/50 p-4 rounded-lg">

                <Sun className="w-6 h-6 text-[#ffbd7b] mt-1 flex-shrink-0" />

                <p className="font-hand text-base md:text-lg text-navy/70"><span className="font-bold text-navy">Weather check:</span> March in Goa is warm. Not unbearably hot, but definitely t-shirt weather. Pack light.</p>

              </div>

            </div>

          </FadeInWhenVisible>

          <FadeInWhenVisible delay={0.1} className="bg-gradient-to-br from-[#F5F0E8] via-white to-[#F5F0E8]/50 sketchy-border p-10 md:p-12 rotate-1 hover:rotate-0 transition-all duration-300 shadow-lg hover:shadow-xl">

            <div className="text-center mb-10">

              <h3 className="text-3xl md:text-4xl font-hand mb-3 text-navy font-bold">Our Color Palette</h3>

              <p className="text-navy/60 font-hand text-base md:text-lg">Feel free to incorporate these colors if you want</p>

            </div>

            <div className="space-y-8">

              {colors.map((color, idx) => (

                <FadeInWhenVisible key={color.name} delay={idx * 0.08} className="group">

                  <motion.div className="flex items-center gap-6 p-5 md:p-6 bg-white/70 sketchy-border border-2 border-transparent hover:border-navy/30 transition-all duration-300 hover:shadow-lg" whileHover={{ scale: 1.02, x: 4 }}>

                    <motion.div 

                      className="w-20 h-20 rounded-full shadow-lg border-3 border-white flex-shrink-0 group-hover:scale-110 transition-transform duration-300" 

                      style={{ 

                        backgroundColor: color.bg,

                        borderWidth: '3px',

                        boxShadow: `0 4px 12px ${color.bg}40, inset 0 2px 4px rgba(255,255,255,0.3)`

                      }}

                    ></motion.div>

                    <div className="flex-1">

                      <h4 className="font-bold text-lg font-hand text-navy mb-1">{color.name}</h4>

                      <p className="font-mono text-sm text-navy/60 tracking-wider font-semibold">{color.hex.toUpperCase()}</p>

                    </div>

                  </motion.div>

                </FadeInWhenVisible>

              ))}

            </div>

            <div className="mt-10 pt-8 border-t-2 border-navy/10 text-center bg-white/40 p-4 rounded-lg">

              <p className="text-sm md:text-base text-navy/60 font-hand italic">These are suggestions, not requirements. Wear what makes you happy.</p>

            </div>

          </FadeInWhenVisible>

        </div>

      </FadeInWhenVisible>

    </section>

  );

};



const ExploreGoa = () => {

  const recommendations = [

    {

      category: "North Goa",

      items: [

        { name: "Joseph's Bar", type: "drink", location: "Fontainhas, Panjim", desc: "Old Goa charm in a bar that's been pouring since the '70s. Gundu the barman knows everyone. Try the Tambde Rosa — feni, kokum, rose water in a clay pot. Ten people inside, ten more spilling onto the street. Old jazz, cold beer, real Goan tavern culture." },

        { name: "Miguel's", type: "drink", location: "Fontainhas, Panjim", desc: "Art deco cocktail bar in a heritage building. Burma teak, marble inlay, handcrafted lamps. Serious cocktails — classic 1920s recipes with Goan ingredients. Barrel-aged feni creations. Small plates that respect 450 years of Konkan-Portuguese fusion. This is where you have the conversation that matters." },

        { name: "Bombil", type: "food", location: "Campal, Panjim", desc: "Packed for lunch for a reason. Goan fish thali the way it's supposed to be — fish curry, clam stir fry, dried bombil, big Goan rice. Add your fish of choice. The bill is half what you'd pay at the fancy place next door, twice the food. No AC, lots of fans, loud and busy and exactly right. Yellow walls, vintage music, food that tastes like someone's grandmother made it." },

        { name: "Kokum Curry", type: "food", location: "Candolim (also in Panjim)", desc: "Authentic Saraswat Brahmin cuisine. The kind of Goan Hindu food that tourists never see. Six types of kokum curries. Fresh coconut, coconut oil, tamarind, no vinegar. Traditional techniques, heritage recipes. Fish thali that's different from everything else you'll eat in Goa. This is home cooking elevated, preserved, celebrated." },

        { name: "Bar Outrigger", type: "drink", location: "Dona Paula", desc: "Rum bar hidden in a fishing village. They send you a treasure map to find it. Over 100 rums, tiki cocktails, a little cove where waves hit rocks. Come at sunset. Order something rum-forward. Stay until they sing 'My Heart Will Go On' at closing." }

      ]

    },

    {

      category: "South Goa",

      items: [

        { name: "Tejas Bar", type: "food", location: "Talpona Beach", desc: "Hands down the BEST kalwa sukka in Goa. Fresh oysters in coconut masala, bold and messy and exactly right. This is beach shack cooking at its finest. Eat with your hands. Order cold beer. Trust us on this." },

        { name: "Kala Bahia", type: "party", location: "Colomb Bay", desc: "European-run spot where the music is good and the drinks are strong. Dance until sunrise catches you mid-laugh. Nobody judges. The night extends itself here." },

        { name: "Kakolem Beach", type: "beach", location: "Tiger Beach", desc: "Hidden cove at the end of a 15-minute trek down rocky stairs through private property (₹50 entry). Horseshoe bay, golden sand, aquamarine water, freshwater waterfall hitting the beach. Worth every step down. Goa's last secret. Come early, bring water, leave before sunset." },

        { name: "Colomb Bay", type: "beach", location: "Between Palolem and Patnem", desc: "Our sanctuary. Small horseshoe bay between Palolem and Patnem where fishing families still haul nets in the morning. Clean sand, calm water, a few good shacks. Quiet, beautiful, untouched. The Goa you imagine when you close your eyes." },

        { name: "Palolem Beach", type: "beach", location: "South Goa", desc: "The famous crescent bay with palm trees and perfect swimming water. Go at sunrise before the crowds — just you and that golden light that makes everything look like a memory you haven't made yet." }

      ]

    }

  ];



  return (

  <section id="explore-goa" className="py-16 md:py-20 lg:py-24 px-4 md:px-6 bg-gradient-to-b from-white to-[#F5F0E8]/30 border-t border-navy/10">

    <FadeInWhenVisible className="max-w-6xl mx-auto">

        <div className="text-center mb-16 md:mb-20">

          <h2 className="text-4xl md:text-5xl font-hand text-navy mb-6"><span className="text-[#D4A5A5]">Explore</span> Goa</h2>

          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-[#D4A5A5] to-transparent mx-auto mb-6"></div>

          <p className="text-navy/60 text-lg md:text-xl max-w-2xl mx-auto">

            Our favorite spots. The places we go back to, year after year.

          </p>

        </div>



        <div className="grid md:grid-cols-2 gap-8 md:gap-12">

          {recommendations.map((section, idx) => (

          <FadeInWhenVisible key={section.category} delay={idx * 0.1} className="space-y-8 bg-white/80 backdrop-blur-sm sketchy-border p-8 md:p-10 shadow-lg hover:shadow-xl transition-all">

              <h3 className="text-2xl md:text-3xl font-bold text-navy border-b-2 border-[#D4A5A5]/40 pb-4 mb-6">

                {section.category}

              </h3>

              <div className="space-y-5 md:space-y-6">

                {section.items.map((item, i) => (

                <motion.div key={item.name} className="flex gap-4 md:gap-5 items-start group p-3 rounded-lg hover:bg-[#F5F0E8]/50 transition-colors" whileHover={{ x: 6 }}>

                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-white border-2 border-navy/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[#D4A5A5] group-hover:text-white group-hover:border-[#D4A5A5] transition-all shadow-md group-hover:shadow-lg">

                      {item.type === 'drink' && <SketchIcon type="wine" className="w-5 h-5" />}

                      {item.type === 'food' && <SketchIcon type="plate" className="w-5 h-5" />}

                      {item.type === 'beach' && <Sun className="w-5 h-5" />}

                      {item.type === 'party' && <Music className="w-5 h-5" />}

                    </div>

                    <div className="flex-1">

                      <h4 className="font-bold text-lg md:text-xl text-navy mb-1">{item.name}</h4>
                      {item.location && <p className="text-xs md:text-sm text-navy/50 mb-2 italic">{item.location}</p>}
                      <p className="text-sm md:text-base text-navy/70 leading-relaxed">{item.desc}</p>

                    </div>

                </motion.div>

                ))}

              </div>

          </FadeInWhenVisible>

          ))}

        </div>



        <div className="mt-16 md:mt-20 p-8 md:p-10 bg-gradient-to-br from-[#B8D4E8]/20 to-[#D4A5A5]/10 sketchy-border text-center border-2 border-navy/10 max-w-3xl mx-auto shadow-lg">

          <p className="text-navy/80 italic font-hand text-lg md:text-xl leading-relaxed">

            Palolem is where we got engaged. Colomb Bay is where we learned to dive together. 

            These places belong to us. Now they're yours too.

          </p>

        </div>

    </FadeInWhenVisible>

    </section>

  );

};



const Travel = ({ isFamilyMode }) => (

  <section id="travel" className="py-16 md:py-20 lg:py-24 px-4 md:px-6 bg-[#1B3A57] text-[#F5F0E8]">

    <FadeInWhenVisible className="max-w-5xl mx-auto">

      <div className="text-center mb-16">

        <h2 className="text-5xl text-[#D4A5A5] mb-6 font-hand">Travel & Stay</h2>

        <p className="text-lg opacity-80 font-hand max-w-lg mx-auto">Pack your sunscreen and sunglasses. We're taking care of the vibes.</p>

      </div>



      <div className="grid md:grid-cols-2 gap-8">

        {/* Card 1: Journey - Ticket Style */}

        <FadeInWhenVisible className="bg-white text-navy relative group hover:-translate-y-1 transition-transform duration-300" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)', maskImage: 'radial-gradient(circle at left center, transparent 10px, black 10px)' }}>

          <div className="absolute left-0 top-0 bottom-0 w-16 bg-[#D4A5A5] flex items-center justify-center border-r-2 border-dashed border-navy/20">

             <div className="-rotate-90 font-hand font-bold text-xl text-white whitespace-nowrap tracking-widest">GOA EXPRESS</div>

          </div>

          <div className="pl-24 pr-8 py-8 relative">

             <div className="absolute top-4 right-4 opacity-20">

                <Anchor className="w-16 h-16 text-navy" />

             </div>

             <h3 className="text-2xl font-bold mb-1 font-hand uppercase tracking-wider">Boarding Pass</h3>

             <p className="text-xs uppercase tracking-widest opacity-50 mb-6">Ticket to Paradise</p>

             

             <div className="space-y-4 font-hand text-lg">

                 <div className="flex justify-between border-b border-dashed border-navy/20 pb-2">

                    <span className="opacity-60">DESTINATION</span>

                    <span className="font-bold">Dabolim (GOI)</span>

                 </div>

                 <div className="flex justify-between border-b border-dashed border-navy/20 pb-2">

                    <span className="opacity-60">TRANSFER</span>

                    <span className="font-bold">45 Min Drive</span>

                 </div>

                 

                 {isFamilyMode ? (

                     <div className="bg-[#B8D4E8]/30 p-3 rounded-sm mt-4 text-base transform -rotate-1">

                       <p className="font-bold">Family pickup:</p>

                       <p>We're coordinating airport pickups for everyone arriving on March 18. We'll send details closer to the date.</p>

                     </div>

                 ) : (

                     <p className="text-base pt-2 opacity-80">Pre-book a taxi before you land, or use GoaMiles app when you arrive.</p>

                 )}

             </div>

          </div>

          {/* Perforated edge visual */}

          <div className="absolute left-16 top-0 bottom-0 w-[2px] border-l-2 border-dashed border-white/50"></div>

        </FadeInWhenVisible>

        

        {/* Card 2: Base Camp - Notepad Style */}

        <FadeInWhenVisible delay={0.1} className="bg-[#F5F0E8] text-navy p-8 relative shadow-lg transform rotate-1 hover:rotate-0 transition-transform duration-300 border-t-8 border-[#B8D4E8]">

          <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-32 h-8 bg-[#B8D4E8]/50 transform -rotate-2"></div>

          <h3 className="text-3xl font-bold mb-6 font-hand text-center">Where to Sleep</h3>

          

          {isFamilyMode ? (

            <div className="font-hand text-xl space-y-6 text-center">

               <div className="border-2 border-navy p-4 rounded-sm bg-white transform rotate-1">

                   <p className="text-2xl font-bold text-[#D4A5A5]">Kidena House</p>

                   <p className="text-base mt-2">You're with us for the full four days. Rooms are already assigned. Fridge will be stocked. Pool will be ready.</p>

               </div>

               <p className="text-sm opacity-60">Check-in starts at 12:00 PM on March 18.</p>

            </div>

          ) : (

            <ul className="font-hand text-lg space-y-4">

               <li className="flex gap-3 items-start border-b border-navy/10 pb-2">

                 <span className="text-[#D4A5A5] mt-1">★</span>

                 <div>

                    <p className="font-bold">Alila Diwa Goa</p>

                    <p className="text-sm opacity-70">Closest to the venue (20 minutes). Luxury resort option.</p>

                 </div>

               </li>

               <li className="flex gap-3 items-start border-b border-navy/10 pb-2">

                 <span className="text-navy mt-1">★</span>

                 <div>

                    <p className="font-bold">Airbnb / Villas</p>

                    <p className="text-sm opacity-70">Look in Cavelossim or Betul areas. Great for groups.</p>

                 </div>

               </li>

               <li className="text-center pt-2">

                  <span className="bg-white px-3 py-1 border border-navy rounded-full text-sm"><span className="font-bold">Important:</span> Book early. March is peak wedding season in Goa.</span>

               </li>

            </ul>

          )}

        </FadeInWhenVisible>

      </div>

    </FadeInWhenVisible>

  </section>

);



const QnA = () => {

  const questions = [

    { q: "Are kids invited?", a: "Yes! Cookie & Bailey are demanding playmates. Bring the little ones." },

    { q: "What about plus ones?", a: "If your invitation says 'and guest', absolutely bring them. If it doesn't, we're keeping numbers intimate. Nothing personal." },

    { q: "Open bar?", a: "Of course. We're not monsters." },

    { q: "What about gifts?", a: "Honestly? Your presence means more than presents. But if you really want to give something, a contribution toward our honeymoon fund would be amazing." },

    { q: "Dietary restrictions?", a: "We'll have both vegetarian and non-vegetarian options. Let us know your specific restrictions or allergies in the RSVP form below." }

  ];



  return (

  <section id="q-a" className="py-16 md:py-20 lg:py-24 px-4 md:px-6 bg-gradient-to-b from-white to-[#F5F0E8]/20">

    <FadeInWhenVisible className="max-w-5xl mx-auto">

        <div className="text-center mb-16 md:mb-20">

          <h2 className="text-4xl md:text-5xl font-hand text-navy mb-4">FAQ</h2>
          
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-[#D4A5A5] to-transparent mx-auto"></div>

        </div>



        <div className="grid md:grid-cols-2 gap-6 md:gap-8">

          {questions.map((item, i) => (

          <FadeInWhenVisible key={item.q} delay={i * 0.05} className="sketchy-border p-6 md:p-8 bg-white shadow-md hover:shadow-xl rotate-1 hover:rotate-0 transition-all duration-300">

               <h4 className="font-bold text-xl md:text-2xl font-hand text-navy mb-3 flex items-start gap-3">

                 <span className="text-[#D4A5A5] text-2xl md:text-3xl leading-none">?</span> 
                 <span>{item.q}</span>

               </h4>

               <p className="text-base md:text-lg text-navy/80 ml-8 md:ml-10 leading-relaxed">{item.a}</p>

          </FadeInWhenVisible>

          ))}

        <FadeInWhenVisible delay={questions.length * 0.05} className="sketchy-border p-8 md:p-10 bg-gradient-to-br from-[#D4A5A5]/10 to-[#B8D4E8]/10 border-2 border-[#D4A5A5]/30 -rotate-1 hover:rotate-0 transition-all shadow-lg md:col-span-2">

             <h4 className="font-bold text-xl md:text-2xl font-hand text-navy mb-4 flex items-center gap-3">

                 <Phone size={24} className="text-[#D4A5A5] flex-shrink-0" />

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
        setSubmitted(true);
        setIsSubmitting(false);
        fireConfetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#D4A5A5', '#B8D4E8', '#1B3A57', '#F5F0E8']
        });
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

    <section id="rsvp" className="py-16 md:py-20 lg:py-24 px-4 md:px-6 bg-gradient-to-b from-[#F5F0E8] to-white relative">

      <div className="section-divider"></div>

      <FadeInWhenVisible className="max-w-3xl mx-auto bg-white border-2 border-navy/10 sketchy-border p-10 md:p-14 shadow-xl relative">

        <div className="washi-tape -top-4 left-1/2 -translate-x-1/2 bg-[#B8D4E8]"></div>



        <div className="text-center mb-12 md:mb-14 mt-2">

          <h2 className="text-4xl md:text-5xl text-navy mb-4 font-hand">R.S.V.P.</h2>

          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-[#D4A5A5] to-transparent mx-auto mb-4"></div>

          <p className="text-navy/60 text-sm md:text-base uppercase tracking-widest font-hand">Please respond by January 20, 2026</p>

        </div>



        {!submitted ? (

          <form action={FORMSPREE_ENDPOINT} method="POST" onSubmit={handleSubmit} className="space-y-8">

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



            <div className="grid grid-cols-2 gap-4">

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

            

            <div className="grid grid-cols-2 gap-4 pt-2">

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

                <div className="border border-navy/20 sketchy-border p-4 text-center peer-checked:border-navy peer-checked:bg-[#B8D4E8]/20 transition-all hover:bg-gray-50">

                  <Heart className="w-8 h-8 mx-auto mb-2 text-[#D4A5A5]" />

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

                <div className="border border-navy/20 sketchy-border p-4 text-center peer-checked:border-navy peer-checked:bg-[#D4A5A5]/20 transition-all hover:bg-gray-50">

                  <X className="w-8 h-8 mx-auto mb-2 text-navy/60" />

                  <span className="font-bold text-navy text-sm font-hand">Cannot Attend</span>

                </div>

              </label>

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

            

            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#1B3A57] text-white font-bold text-lg py-4 mt-6 sketchy-border font-hand hover:bg-[#2c5378] transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 duration-200 hover:rotate-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#1B3A57]"
            >

              {isSubmitting ? 'Sending...' : 'Submit RSVP'}

            </button>

          </form>

        ) : (

          <div className="text-center py-12 animate-in fade-in zoom-in duration-500">

            <CheckCircle size={64} className="mx-auto text-[#D4A5A5] mb-4" />

            <h3 className="text-3xl font-bold text-navy font-hand">RSVP Sent!</h3>

            <p className="text-navy/60 mt-2">We can't wait to celebrate with you.</p>

          </div>

        )}

      </FadeInWhenVisible>

    </section>

  );

};



const Footer = ({ toggleFamilyMode, isFamilyMode }) => (

  <footer className="relative text-[#F5F0E8] text-center px-4 md:px-6 overflow-hidden py-20 md:py-28 lg:py-32">

    {/* Decorative background elements */}
    <div className="absolute inset-0 opacity-5">
      <div className="absolute top-10 left-10 w-32 h-32 border-2 border-[#D4A5A5] rounded-full transform rotate-12"></div>
      <div className="absolute bottom-20 right-20 w-24 h-24 border-2 border-[#B8D4E8] rounded-full transform -rotate-6"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 border border-[#D4A5A5]/20 rounded-full"></div>
    </div>

    <div className="absolute inset-0 bg-gradient-to-b from-[#1B3A57] via-[#1B3A57] to-[#0f2538]"></div>

    <div className="relative z-10 max-w-4xl mx-auto space-y-12 md:space-y-16">

      {/* Main message */}
      <FadeInWhenVisible>
        <div className="space-y-6 md:space-y-8">
          <p className="text-xl md:text-2xl lg:text-3xl font-hand leading-relaxed text-[#F5F0E8] max-w-3xl mx-auto">
            Seven years of finding each other twice and choosing each other every day since.
          </p>
          <p className="text-2xl md:text-3xl lg:text-4xl font-hand font-bold text-[#D4A5A5]">
            Now they're saying it out loud: forever.
          </p>
        </div>
      </FadeInWhenVisible>

      {/* Cookie & Bailey section */}
      <FadeInWhenVisible delay={0.1}>
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-4 bg-white/25 backdrop-blur-md px-8 py-5 sketchy-border border-[3px] border-[#D4A5A5] rounded-lg hover:border-[#D4A5A5] hover:bg-white/35 transition-all group shadow-xl">
            <PawPrint size={28} className="text-[#D4A5A5] group-hover:scale-110 transition-transform fill-current" /> 
            <span className="text-xl md:text-2xl font-hand font-bold text-navy">Cookie & Bailey</span>
            <PawPrint size={28} className="text-[#B8D4E8] group-hover:scale-110 transition-transform fill-current" />
          </div>
        </div>
      </FadeInWhenVisible>

      {/* Bottom section */}
      <FadeInWhenVisible delay={0.2}>
        <div className="border-t-2 border-[#F5F0E8]/50 pt-10 md:pt-12 space-y-4">
          <p className="text-base md:text-lg uppercase tracking-widest text-[#F5F0E8] font-hand font-semibold">
            Made with love, momos & feni
          </p>
          <p className="text-sm md:text-base text-[#F5F0E8] font-medium">
            Goa 2026
          </p>
        </div>
      </FadeInWhenVisible>

      {/* Family Login Button */}
      <FadeInWhenVisible delay={0.3}>
        <button 

          onClick={toggleFamilyMode}

          className="mt-8 opacity-60 hover:opacity-100 transition-opacity text-xs md:text-sm border-2 border-[#F5F0E8]/40 rounded-full px-4 py-2 flex items-center gap-2 mx-auto bg-[#F5F0E8]/10 backdrop-blur-sm hover:bg-[#F5F0E8]/20 font-hand"

          aria-label={isFamilyMode ? 'Switch to guest view' : 'Switch to family view'}

        >

          {isFamilyMode ? <Unlock size={14}/> : <Lock size={14}/>}

          <span className="text-[#F5F0E8]">{isFamilyMode ? 'Switch to Guest View' : 'Family Login'}</span>

        </button>
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

        className="fixed bottom-6 left-6 z-[100] w-16 h-16 md:w-20 md:h-20 bg-white sketchy-border border-[3px] border-navy shadow-2xl flex flex-col items-center justify-center hover:scale-105 hover:rotate-1 transition-all font-hand font-semibold group"
        style={{ position: 'fixed' }}

        aria-label={playing ? 'Pause background music' : 'Play background music'}

      >

        <Music className={`w-6 h-6 ${playing ? 'text-[#D4A5A5]' : 'text-navy/60'} group-hover:text-[#D4A5A5] transition-colors`} />

        <span className={`text-[9px] mt-0.5 tracking-tight ${playing ? 'text-[#D4A5A5] font-bold' : 'text-navy/60'} group-hover:text-[#D4A5A5] transition-colors`}>music</span>

      </button>

      <audio ref={audioRef} src="/music/goa-mix.mp3" loop preload="none" />

    </>

  );

};



const FloatingRSVPButton = ({ onScrollToRSVP }) => {

  return (

      <button

      onClick={() => onScrollToRSVP('rsvp')}

      className="fixed bottom-6 right-6 z-[100] bg-navy text-white sketchy-border border-[3px] border-white shadow-2xl px-6 py-3 flex items-center gap-2 hover:scale-105 hover:rotate-1 transition-all font-hand font-bold text-sm md:text-base group"
      style={{ position: 'fixed', backgroundColor: '#1B3A57', color: '#F5F0E8' }}

      aria-label="Go to RSVP"

    >

      <Heart className="w-5 h-5 md:w-6 md:h-6 group-hover:scale-110 transition-transform fill-current" />

      <span className="font-bold">RSVP</span>

    </button>

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

      <SketchIcon type="palm" className="w-full h-full text-[#B8D4E8]" />

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

            <Music className="w-8 h-8 text-[#D4A5A5]" />

          </motion.div>

        );

      })}

    </>

  );

};






/* --- STICKY SECTION HEADERS --- */

const StickyHeader = ({ children, className = '' }) => {

  return (

    <div className={`sticky top-16 md:top-20 z-10 bg-[#F5F0E8]/95 backdrop-blur-md py-3 md:py-4 mb-6 md:mb-8 border-b-2 border-[#D4A5A5]/20 ${className}`}>

      {children}

    </div>

  );

};



/* --- DOT NAVIGATION --- */

const DotNav = ({ sections, activeSection, onSectionClick }) => {

  return (

    <div className="fixed right-6 md:right-8 top-1/2 -translate-y-1/2 z-50 space-y-3 hidden md:flex flex-col">

      {sections.map((section, i) => (

        <motion.button

          key={section.id}

          onClick={() => onSectionClick(section.id)}

          className={`w-3 h-3 rounded-full border-2 transition-all relative group ${

            activeSection === i 

              ? 'border-[#D4A5A5] bg-[#D4A5A5] scale-150' 

              : 'border-navy/30 bg-transparent hover:border-[#D4A5A5]'

          }`}

          whileHover={{ scale: 1.3 }}

          whileTap={{ scale: 0.9 }}

          aria-label={section.name || section.id}

        >

          {activeSection === i && (

            <motion.div

              className="absolute -right-8 top-1/2 -translate-y-1/2 bg-navy text-white text-xs px-2 py-1 rounded font-hand whitespace-nowrap"

              initial={{ opacity: 0, x: -10 }}

              animate={{ opacity: 1, x: 0 }}

            >

              {section.name || section.id}

            </motion.div>

          )}

        </motion.button>

      ))}

    </div>

  );

};



const App = () => {

  const [isFamilyMode, setIsFamilyMode] = useState(false);

  const [activeSection, setActiveSection] = useState(0);

  const containerRef = useRef(null);



  // Define sections for navigation

  // Memoize sections array to prevent infinite re-renders
  // Reordered: Critical info first (Celebration, Travel, RSVP), then emotional content
  const sections = useMemo(() => [

    { id: 'hero', name: 'Home', component: Hero },

    { id: 'the-celebration', name: 'Party', component: Celebration },

    { id: 'travel', name: 'Travel', component: Travel },

    { id: 'rsvp', name: 'RSVP', component: RSVP },

    { id: 'dress-code', name: 'Dress', component: DressCode },

    { id: 'our-story', name: 'Story', component: Story },

    { id: 'dogs', name: 'Dogs', component: CookieAndBailey },

    ...(isFamilyMode ? [

      { id: 'kidena-house', name: 'Kidena', component: KidenaHouse },

      { id: 'family-itinerary', name: 'Itinerary', component: FamilyItinerary }

    ] : []),

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

      <div ref={containerRef} className="scroll-container relative">

        <Nav isFamilyMode={isFamilyMode} />

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



        <section id="rsvp" className="scroll-section">

        <RSVP />

        </section>



        <section id="dress-code" className="scroll-section">

        <DressCode />

        </section>



        <section id="our-story" className="scroll-section scroll-section-long">

        <Story />

        </section>


        
        <section id="dogs" className="scroll-section flex items-center justify-center">

        <CookieAndBailey />

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



        <section id="explore-goa" className="scroll-section scroll-section-long">

        <ExploreGoa />

        </section>



        <section id="q-a" className="scroll-section scroll-section-long">

        <QnA />

        </section>



        <section id="footer" className="scroll-section flex items-center justify-center">

        <Footer toggleFamilyMode={() => setIsFamilyMode(!isFamilyMode)} isFamilyMode={isFamilyMode} />

        </section>

      </div>

    </>

  );

};



export default App;

