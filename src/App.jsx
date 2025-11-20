import React, { useState, useRef, useEffect } from 'react';

import { Menu, X, ArrowDown, CheckCircle, Lock, Unlock, Phone, MapPin, Calendar, Home, PawPrint, Music, Heart, Sun, Anchor, Coffee } from 'lucide-react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import confetti from 'canvas-confetti';



/* --- CSS & FONTS --- */

const styles = `

  @import url('https://fonts.googleapis.com/css2?family=Patrick+Hand&family=Quicksand:wght@300;400;500;600;700&family=La+Belle+Aurore&display=swap');



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
    scroll-snap-type: y mandatory;
    scroll-behavior: smooth;
    overflow-y: scroll;
    height: 100vh;
    -webkit-overflow-scrolling: touch;
  }

  .scroll-section {
    scroll-snap-align: start;
    scroll-snap-stop: always;
    min-height: 100vh;
    position: relative;
    display: flex;
    flex-direction: column;
  }



  body {

    background-color: var(--bg-cream);

    background-image: var(--paper-texture);

    color: var(--text-navy);

    font-family: 'Quicksand', sans-serif;

    overflow: hidden;

    -webkit-font-smoothing: antialiased;

    -moz-osx-font-smoothing: grayscale;

  }



  h1, h2, h3, .font-hand {

    font-family: 'Patrick Hand', cursive;

  }



  .font-script {

    font-family: 'La Belle Aurore', cursive;

  }



  /* --- Utility Classes for Custom Colors (Fixes Contrast Issues) --- */

  .text-navy { color: var(--text-navy); }

  .bg-navy { background-color: var(--text-navy); }

  .text-cream { color: var(--bg-cream); }

  

  /* --- Sketchy Effects --- */

  .sketchy-border {

    position: relative;

    background: white;

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

    filter: drop-shadow(2px 2px 0px rgba(212, 165, 165, 0.4));

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



const FadeInWhenVisible = ({ children, delay = 0, className = '' }) => {

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

};



const ParallaxWrapper = ({ children, offset = 50, className = '', hoverEffect = false }) => {

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

};



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

        

        <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden text-navy">

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



const Hero = () => (

  <section className="min-h-screen flex flex-col items-center justify-center px-4 pt-20 md:pt-24 pb-8 md:pb-12 relative">

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

        className="text-[6rem] md:text-[12rem] leading-[0.8] text-navy font-hand select-none relative inline-block sketchy-text" 

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

                 initial={{ scale: 1.2 }}

                 animate={{ scale: 1 }}

                 transition={{ duration: 1.2, ease: 'easeOut' }}

               />



               {/* Interactive Hotspots */}

               <InteractiveHotspot

                 position={{ top: '45%', left: '30%' }}

                 tooltip="Cookie - Queen of the ceremony!"

                 onClick={() => {}}

               >

                 <PawPrint className="w-6 h-6 text-[#D4A5A5]" />

               </InteractiveHotspot>



               <InteractiveHotspot

                 position={{ top: '50%', right: '25%' }}

                 tooltip="Bailey - The two-faced beauty!"

                 onClick={() => {}}

               >

                 <PawPrint className="w-6 h-6 text-[#B8D4E8]" />

               </InteractiveHotspot>



               <InteractiveHotspot

                 position={{ bottom: '20%', left: '50%', transform: 'translateX(-50%)' }}

                 tooltip="Click to see our story!"

                 onClick={() => {

                   document.getElementById('our-story')?.scrollIntoView({ behavior: 'smooth' });

                 }}

               >

                 <Heart className="w-6 h-6 text-[#D4A5A5]" />

               </InteractiveHotspot>

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

      <ArrowDown size={32} />

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



      <div className="mb-8 md:mb-16"></div>

      

      <div className="space-y-12 md:space-y-16 lg:space-y-20 relative pt-8 md:pt-0">

        <Music className="absolute -top-4 md:top-0 left-0 w-12 h-12 md:w-16 md:h-16 text-navy/5 -rotate-12 z-0" />

        <SketchIcon type="palm" className="absolute bottom-0 right-0 w-16 md:w-24 text-navy/5 rotate-12 z-0" />



        {/* 2015 */}

        <FadeInWhenVisible delay={0.1}>

          <div className="grid md:grid-cols-2 gap-6 md:gap-8 lg:gap-12 items-center">

            <ParallaxWrapper offset={25} hoverEffect className="sketchy-border p-3 bg-white rotate-2 order-2 md:order-1 photo-frame">

            <div className="overflow-hidden relative" style={{ minHeight: '300px', maxHeight: '500px' }}>

               <img src="/images/firsttime.jpg" className="w-full h-full object-cover sepia-[.3]" alt="The First Time" style={{ maxHeight: '100%' }} />

            </div>

            <p className="text-center font-hand text-navy/50 mt-2">Alysha (The Host)</p>

            </ParallaxWrapper>

          <div className="order-1 md:order-2">

              <span className="inline-block bg-[#D4A5A5] text-white px-3 md:px-4 py-1 font-hand text-lg md:text-xl mb-3 md:mb-4 rotate-[-2deg] shadow-sm">2015</span>

              <h3 className="text-2xl md:text-3xl lg:text-4xl font-hand font-bold text-navy mb-3 md:mb-4">The First Time</h3>

              <div className="font-hand text-lg md:text-xl text-navy/80 space-y-2 md:space-y-3">

              <p>Her house party. Bangalore. A friend dragged him along.</p>

              <p>They talked for hours. Bengali boy from Assam meets Goan girl from Abu Dhabi. Easy conversation, good vibes.</p>

              <p>Then the party ended. Three years of radio silence.</p>

            </div>

          </div>

        </div>

        </FadeInWhenVisible>



        {/* 2018 */}

        <FadeInWhenVisible delay={0.15}>

          <div className="grid md:grid-cols-2 gap-6 md:gap-8 lg:gap-12 items-center">

          <div>

              <span className="inline-block bg-[#B8D4E8] text-white px-3 md:px-4 py-1 font-hand text-lg md:text-xl mb-3 md:mb-4 rotate-[2deg] shadow-sm">June 2018</span>

              <h3 className="text-2xl md:text-3xl lg:text-4xl font-hand font-bold text-navy mb-3 md:mb-4">The Reunion</h3>

              <div className="font-hand text-lg md:text-xl text-navy/80 space-y-2 md:space-y-3">

              <p>New job, same office corridor. There he was.</p>

              <p>Coffee runs became late nights. Friendship felt safe. Then a friend threw him a half-hearted birthday, and she realized: she cared more than friends should.</p>

              <p>Two weeks later, he kissed her. By month's end, official.</p>

            </div>

          </div>

            <ParallaxWrapper offset={-20} hoverEffect className="sketchy-border p-3 bg-white -rotate-2 photo-frame">

            <div className="overflow-hidden relative" style={{ minHeight: '300px', maxHeight: '500px' }}>

               <img src="/images/office.jpg" className="w-full h-full object-cover sepia-[.3]" alt="The Reunion" style={{ maxHeight: '100%' }} />

            </div>

             <p className="text-center font-hand text-navy/50 mt-2">Shubs (The Coworker)</p>

            </ParallaxWrapper>

        </div>

        </FadeInWhenVisible>



        {/* GOA Years */}

        <FadeInWhenVisible delay={0.2}>

          <div className="grid md:grid-cols-2 gap-6 md:gap-8 lg:gap-12 items-center">

            <ParallaxWrapper offset={30} hoverEffect className="sketchy-border p-3 bg-white rotate-1 order-2 md:order-1 photo-frame">

            <div className="overflow-hidden relative" style={{ minHeight: '300px', maxHeight: '500px' }}>

               <img src="/images/goa-scooter.jpg" className="w-full h-full object-cover" alt="Goa Life" style={{ maxHeight: '100%' }} />

            </div>

            <p className="text-center font-hand text-navy/50 mt-2">Chaos & Love</p>

            </ParallaxWrapper>

          <div className="order-1 md:order-2">

              <span className="inline-block bg-[#D4A5A5] text-white px-3 md:px-4 py-1 font-hand text-lg md:text-xl mb-3 md:mb-4 rotate-[-1deg] shadow-sm">2018-2021</span>

              <h3 className="text-2xl md:text-3xl lg:text-4xl font-hand font-bold text-navy mb-3 md:mb-4">Building a Life</h3>

              <div className="font-hand text-lg md:text-xl text-navy/80 space-y-2 md:space-y-3">

              <p>She took him to Goa. Twice a year, every year. Palolem, Colomb Bay—their sanctuary.</p>

              <p>He learned to trust the ocean. She taught him to dive. He taught her calm in chaos.</p>

              <p>COVID hit. Bailey had puppies. They rescued four, lost two. The hardest, most beautiful thing. Shubs brought Bailey to Bangalore. Cookie and Bailey: family.</p>

            </div>

          </div>

        </div>

        </FadeInWhenVisible>



        {/* Proposal */}

        <FadeInWhenVisible delay={0.25}>

          <div className="grid md:grid-cols-2 gap-6 md:gap-8 lg:gap-12 items-center">

          <div>

              <span className="inline-block bg-[#B8D4E8] text-white px-3 md:px-4 py-1 font-hand text-lg md:text-xl mb-3 md:mb-4 rotate-[2deg] shadow-sm">January 6, 2025</span>

              <h3 className="text-2xl md:text-3xl lg:text-4xl font-hand font-bold text-navy mb-3 md:mb-4">The Question</h3>

              <div className="font-hand text-lg md:text-xl text-navy/80 space-y-2 md:space-y-3">

              <p>Back at Palolem Beach. He had plans: underwater proposal (ring might float away), Kakolim beach (she was too lazy).</p>

              <p>So, Plan C. They were walking. He stopped. She turned around.</p>

              <p>He was on his knees. YES. Immediate. No hesitation.</p>

            </div>

          </div>

            <ParallaxWrapper offset={-25} hoverEffect className="sketchy-border p-4 bg-white -rotate-1">

             <div className="overflow-hidden relative" style={{ minHeight: '300px', maxHeight: '500px' }}>

                <img src="/images/proposal.jpg" className="w-full h-full object-cover" alt="The Proposal" style={{ maxHeight: '100%' }} />

             </div>

            </ParallaxWrapper>

        </div>

        </FadeInWhenVisible>

    </div>

    </FadeInWhenVisible>

  </section>

);



const CookieAndBailey = () => (

  <section className="py-12 md:py-16 lg:py-20 px-4 md:px-6 relative border-y-4 border-dashed border-navy/10">

    <FadeInWhenVisible className="max-w-4xl mx-auto text-center">

      <h3 className="text-5xl font-hand text-navy mb-12">The Real Bosses</h3>

      

      <div className="grid md:grid-cols-2 gap-16">

        {/* Cookie */}

        <FadeInWhenVisible delay={0.1} className="relative group">

            <div className="absolute inset-0 bg-[#D4A5A5] transform rotate-3 rounded-lg opacity-20"></div>

            <motion.div 

              className="sketchy-border bg-white p-8 relative transform -rotate-2 transition-transform group-hover:rotate-0"

              whileHover={{ rotate: 0, scale: 1.02 }}

            >

                <div className="w-48 h-48 mx-auto mb-6 border-4 border-navy rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">

                    <motion.img src="/images/cookie.jpg" alt="Cookie" className="w-full h-full object-cover" whileHover={{ scale: 1.05 }} />

                </div>

                <h4 className="font-bold text-3xl text-navy font-hand">Cookie</h4>

                <p className="font-hand text-xl mt-2">Alysha's first love. 12 years old. Will absolutely bark at you during the ceremony. We're not sorry.</p>

            </motion.div>

        </FadeInWhenVisible>



        {/* Bailey */}

        <FadeInWhenVisible delay={0.15} className="relative group">

            <div className="absolute inset-0 bg-[#B8D4E8] transform -rotate-3 rounded-lg opacity-20"></div>

            <motion.div 

              className="sketchy-border bg-white p-8 relative transform rotate-2 transition-transform group-hover:rotate-0"

              whileHover={{ rotate: 0, scale: 1.02 }}

            >

                <div className="w-48 h-48 mx-auto mb-6 border-4 border-navy rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">

                   <motion.img src="/images/bailey.jpg" alt="Bailey" className="w-full h-full object-cover" whileHover={{ scale: 1.05 }} />

                </div>

                <h4 className="font-bold text-3xl text-navy font-hand">Bailey</h4>

                <p className="font-hand text-xl mt-2">Our rescue. Two faced (literally). Had six puppies during COVID—we saved four. Shubs brought her to Bangalore, making her family.</p>

            </motion.div>

        </FadeInWhenVisible>

      </div>

    </FadeInWhenVisible>

  </section>

);



const WhatWeAreExcitedAbout = () => (

  <section className="py-12 md:py-16 px-4 md:px-6 bg-[#F5F0E8]">

    <FadeInWhenVisible className="max-w-4xl mx-auto text-center">

      <h3 className="text-3xl font-hand text-navy mb-8">What We Can't Wait For</h3>

      <div className="grid md:grid-cols-3 gap-8 font-hand text-xl text-navy/80">

        {[
          { icon: <SketchIcon type="palm" className="mx-auto text-[#D4A5A5] mb-3 w-10 h-10" />, text: 'The Ocean at Sunset' },
          { icon: <SketchIcon type="plate" className="mx-auto text-[#D4A5A5] mb-3 w-10 h-10" />, text: 'Kalwa Sukka for Everyone' },
          { icon: <Music className="mx-auto text-[#D4A5A5] mb-3 w-10 h-10" />, text: 'Dancing Until Our Feet Hurt' }
        ].map((item, idx) => (
          <FadeInWhenVisible key={item.text} delay={0.1 * idx}>
            <motion.div 
              className={`p-4 bg-white sketchy-border ${idx === 1 ? '-rotate-1' : 'rotate-1'}`}
              whileHover={{ scale: 1.03 }}
            >
              {item.icon}
              <p className="font-bold">{item.text}</p>
            </motion.div>
          </FadeInWhenVisible>
        ))}

        </div>

    </FadeInWhenVisible>

  </section>

);



/* --- NEW COMPONENTS (Missing in original) --- */

const KidenaHouse = () => (

  <section id="kidena-house" className="py-16 md:py-24 lg:py-32 px-4 md:px-6 bg-[#1B3A57] text-[#F5F0E8] relative overflow-hidden">

    {/* Subtle background decoration */}
    <div className="absolute inset-0 opacity-5 pointer-events-none">
        <SketchIcon type="palm" className="absolute top-20 right-20 w-96 h-96 text-white" />
    </div>

    <FadeInWhenVisible className="max-w-7xl mx-auto relative z-10">

        {/* Header Section */}
        <div className="text-center mb-16 md:mb-20">
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-hand mb-6 text-[#F5F0E8] leading-tight">Where You'll Stay</h2>
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
                        <p className="text-navy/80 font-hand text-lg md:text-xl leading-relaxed">6 bedrooms, 9 bathrooms. Private pool and a private lake. Plenty of space to spread out.</p>
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
                        <p className="text-navy/80 font-hand text-lg md:text-xl leading-relaxed">Chefs will make whatever you're craving—breakfast, lunch, midnight snacks. Butlers handle the rest.</p>
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
                        <p className="text-navy/80 font-hand text-lg md:text-xl leading-relaxed">There's an on-site spa if you need to unwind before the chaos.</p>
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
                        <p className="text-navy/80 font-hand text-lg md:text-xl leading-relaxed">Pool table, PlayStation, fishing in the lake, cycling around. Or just lounge by the pool.</p>
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
                <p className="font-hand text-xl md:text-2xl text-navy/80 leading-relaxed">This is home base. Where we'll all be together before the big day.</p>
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

            <h2 className="text-5xl md:text-6xl font-hand text-navy mb-4">The Family Plan</h2>

            <p className="text-navy/70 font-hand text-xl md:text-2xl">Your guide to four days in Goa</p>

                    </div>

        

        <div className="space-y-8 md:space-y-10">

            {[

                { 
                    day: "Thursday, March 19", 
                    time: "All Day",
                    title: "Arrival & Pool Party", 
                    desc: "You're here! We'll have cars waiting to bring you to Kidena House. Unpack, settle in, and we'll order the best Goan food we can find. Then—pool party. Later that night, we're hitting Panjim for a pub crawl. Joseph's, Miguel's, all our favorite spots. Come along or stay back and relax—whatever feels right.",
                    icon: Home,
                    color: "#D4A5A5"
                },

                { 
                    day: "Friday, March 20", 
                    time: "Morning",
                    title: "Rehearsal Day", 
                    desc: "Breakfast together at the house. Then those of us in the ceremony head to Blu Missel for rehearsal. Kids can stay back and enjoy the pool—no need to drag them along.",
                    icon: Sun,
                    color: "#B8D4E8"
                },

                { 
                    day: "Friday, March 20", 
                    time: "Afternoon",
                    title: "The Wedding", 
                    desc: "This is it! Cars leave Kidena at 2:30 PM. We're sorting rentals and cabs, but please be ready on time. (We're talking to you, family members who are always fashionably late.)",
                    icon: Heart,
                    color: "#D4A5A5"
                },

                { 
                    day: "Saturday, March 21", 
                    time: "All Day",
                    title: "Recovery & Chill", 
                    desc: "Sleep in. No agenda. Pool, spa, whatever you need. Later in the evening, let's meet at Bar Outrigger—it's this beautiful spot by the beach with a little cove. Sunset drinks, good company.",
                    icon: Anchor,
                    color: "#B8D4E8"
                },

                { 
                    day: "Sunday, March 22", 
                    time: "All Day",
                    title: "Rest & Goodbyes", 
                    desc: "Take your time. Leave when you need to. We'll be around to say proper goodbyes and soak in these last moments together. Thanks for being here. It means everything.",
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

  <section id="the-celebration" className="py-12 md:py-16 lg:py-20 px-4 md:px-6 relative">

    <div className="watercolor-bg" style={{ transform: 'scaleY(-1)' }}></div>

    <FadeInWhenVisible className="max-w-6xl mx-auto">

      <StickyHeader>

        <div className="text-center">

          <h2 className="text-4xl md:text-6xl font-hand text-navy inline-block border-b-4 border-[#D4A5A5] pb-2" style={{ borderRadius: '50% 20% / 10% 40%' }}>The Big Party</h2>

      </div>

      </StickyHeader>



      <div className="mb-8 md:mb-12 lg:mb-16"></div>



      <div className="grid lg:grid-cols-2 gap-12 items-start">

        <ParallaxWrapper offset={25} hoverEffect className="sketchy-border p-2 bg-white rotate-1">

             <div className="bg-gray-100 h-80 w-full overflow-hidden border-b-2 border-navy relative">

                <img 

                  src="/images/blu-missel.jpeg" 

                  alt="Blu Missel by the River" 

                  className="absolute inset-0 w-full h-full object-cover"

                />


             </div>

             <div className="p-6">

                <h3 className="text-3xl font-hand font-bold text-navy mb-4">Friday, March 20, 2026</h3>

                <div className="flex items-start gap-4 mb-4">

                   <SketchIcon type="palm" className="w-8 h-8 text-[#D4A5A5]" />

                   <div className="font-hand text-xl leading-tight">

                     <p className="font-bold">Blu Missel by the River</p>

                     <p>Betul, Goa 403713</p>

                   </div>

                </div>

                <div className="bg-[#F5F0E8] p-3 rounded-sm border-2 border-navy/20 transform -rotate-1">

                   <p className="font-hand text-lg">Expect Goan specialties, fresh seafood, and surprises from Alysha's home state!</p>

                </div>

             </div>

        </ParallaxWrapper>



        <div className="relative pt-12 pl-8">

           <div className="absolute left-0 top-0 bottom-0 w-1 bg-navy" style={{ filter: 'url(#roughen)' }}></div>

           

           <div className="space-y-12">

              {[

                  { time: '3:30 PM', event: 'Wedding Ceremony', note: 'Riverside vows (Cookie & Bailey ringbearers)', icon: Heart },

                  { time: '4:30 PM', event: 'Hi-Tea & Photos', note: "Golden hour. We'll be posing, you mingle", icon: SketchIcon, type: 'wine' },

                  { time: '6:00 PM', event: 'Cocktails', note: 'Bar opens. Signature drinks on deck', icon: SketchIcon, type: 'wine' },

                  { time: '6:45 PM', event: 'Reception', note: 'Grand entrance, toasts, cake cutting', icon: Anchor },

                  { time: '7:15 PM', event: 'Dance Floor', note: 'DJ starts. Get ready', icon: Music },

                  { time: '9:00 PM', event: 'Dinner', note: 'Goan feast buffet style', icon: SketchIcon, type: 'plate' },

                  { time: '10:00 PM', event: 'Last Call', note: "Music ends, but the party doesn't", icon: Sun }

              ].map((item, i) => (

                  <FadeInWhenVisible key={item.event} delay={i * 0.05} className="relative pl-8 group">

                      <div className="absolute -left-[22px] top-1 w-10 h-10 bg-white border-2 border-navy rounded-full flex items-center justify-center z-10 group-hover:scale-110 transition-transform shadow-sm">

                         {item.type ? 

                            <SketchIcon type={item.type} className="w-5 h-5 text-navy" /> : 

                            <item.icon className="w-5 h-5 text-navy" />

                         }

                      </div>

                      <h4 className="font-hand font-bold text-2xl text-navy">{item.event}</h4>

                      <p className="font-hand text-[#D4A5A5] text-lg font-bold">{item.time}</p>

                      <p className="font-hand text-navy/60 text-lg">{item.note}</p>

                  </FadeInWhenVisible>

              ))}

           </div>

        </div>

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

    <section className="py-12 md:py-16 lg:py-20 px-4 md:px-6 bg-gradient-to-b from-white to-[#F5F0E8]/30 relative">

      {/* Decorative elements */}
      <Sun className="absolute top-10 right-10 w-16 h-16 text-[#ffbd7b]/20 rotate-12 animate-float" />
      <Heart className="absolute bottom-10 left-10 w-12 h-12 text-[#B8D4E8]/20 -rotate-6 animate-float" />

      <FadeInWhenVisible className="max-w-6xl mx-auto relative z-10">

        <div className="text-center mb-16">

          <h2 className="text-6xl font-hand text-navy mb-4 sketchy-text">What to Wear</h2>

          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-[#ffbd7b] to-transparent mx-auto mb-6"></div>

          <p className="text-navy/60 font-hand text-lg max-w-2xl mx-auto">Dress code inspiration for our special day</p>

        </div>

        <div className="grid md:grid-cols-2 gap-16 items-start">

          <FadeInWhenVisible className="space-y-6 bg-white/80 backdrop-blur-sm sketchy-border p-8 rotate-[-1deg] hover:rotate-0 transition-transform duration-300">

            <div className="flex items-center gap-3 mb-4">

              <Music className="w-8 h-8 text-[#ffbd7b]" />

              <h3 className="text-3xl font-bold text-navy font-hand">Beach Formal</h3>

            </div>

            <div className="space-y-4 font-hand text-xl text-navy/80 leading-relaxed">

              <p>Think flowy dresses, linen suits, and comfortable shoes (we'll be on grass!). We want you to feel beautiful but relaxed.</p>

              <div className="flex items-start gap-2 pt-2 border-t border-navy/10">

                <Sun className="w-5 h-5 text-[#ffbd7b] mt-1 flex-shrink-0" />

                <p className="font-hand text-lg text-navy/60 italic">March in Goa is warm. Pack light.</p>

              </div>

            </div>

          </FadeInWhenVisible>

          <FadeInWhenVisible delay={0.1} className="bg-gradient-to-br from-[#F5F0E8] via-white to-[#F5F0E8]/50 sketchy-border p-10 rotate-1 hover:rotate-0 transition-transform duration-300 shadow-lg">

            <div className="text-center mb-8">

              <h3 className="text-3xl font-hand mb-2 text-navy font-bold">Our Color Palette</h3>

              <p className="text-navy/60 font-hand text-sm">Feel free to incorporate these hues</p>

            </div>

            <div className="space-y-6">

              {colors.map((color, idx) => (

                <FadeInWhenVisible key={color.name} delay={idx * 0.08} className="group">

                  <motion.div className="flex items-center gap-6 p-4 bg-white/60 sketchy-border border-2 border-transparent hover:border-navy/20 transition-all duration-300 hover:shadow-md" whileHover={{ scale: 1.01 }}>

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

            <div className="mt-8 pt-6 border-t border-navy/10 text-center">

              <p className="text-xs text-navy/50 font-hand italic">These colors are suggestions, not requirements</p>

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

      category: "In Panjim",

      items: [

        { name: "Joseph's Bar", type: "drink", desc: "Old Goa charm, cold beer, locals" },

        { name: "Miguel's", type: "drink", desc: "Wine, conversation, ambiance" },

        { name: "Bar Outrigger", type: "drink", desc: "Sunset views by the river" },

        { name: "Bombil", type: "food", desc: "Fresh seafood, Goan classics" },

        { name: "Kokum Curry", type: "food", desc: "Authentic home-style cooking" }

      ]

    },

    {

      category: "South Goa Adventures",

      items: [

        { name: "Kakolim Beach Trek", type: "beach", desc: "Hidden cove, worth the walk" },

        { name: "Colomb Bay", type: "beach", desc: "Our sanctuary. Quiet, beautiful." },

        { name: "Palolem Beach", type: "beach", desc: "Perfect for a swim, best at sunrise" },

        { name: "Tejas Bar", type: "food", desc: "The BEST kalwa sukka. Trust us." },

        { name: "Kala Bahia", type: "party", desc: "Dance until dawn" }

      ]

    }

  ];



  return (

  <section id="explore-goa" className="py-12 md:py-16 lg:py-20 px-4 md:px-6 bg-white border-t border-navy/10">

    <FadeInWhenVisible className="max-w-5xl mx-auto">

        <div className="text-center mb-16">

          <h2 className="text-5xl font-hand text-navy mb-4"><span className="text-[#D4A5A5]">Explore</span> Goa</h2>

          <p className="text-navy/60 max-w-2xl mx-auto">

            Our favorite spots. The places we go back to, year after year.

          </p>

        </div>



        <div className="grid md:grid-cols-2 gap-12">

          {recommendations.map((section, idx) => (

          <FadeInWhenVisible key={section.category} delay={idx * 0.1} className="space-y-6 bg-[#F5F0E8]/50 p-8 rounded-lg border border-navy/5">

              <h3 className="text-2xl font-bold text-navy border-b border-[#D4A5A5]/30 pb-4">

                {section.category}

              </h3>

              <div className="space-y-6">

                {section.items.map((item, i) => (

                <motion.div key={item.name} className="flex gap-4 items-start group" whileHover={{ x: 4 }}>

                    <div className="w-10 h-10 rounded-full bg-white border border-navy/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[#D4A5A5] group-hover:text-white transition-colors shadow-sm">

                      {item.type === 'drink' && <SketchIcon type="wine" className="w-5 h-5" />}

                      {item.type === 'food' && <SketchIcon type="plate" className="w-5 h-5" />}

                      {item.type === 'beach' && <Sun className="w-5 h-5" />}

                      {item.type === 'party' && <Music className="w-5 h-5" />}

                    </div>

                    <div>

                      <h4 className="font-bold text-navy">{item.name}</h4>

                      <p className="text-sm text-navy/60">{item.desc}</p>

                    </div>

                </motion.div>

                ))}

              </div>

          </FadeInWhenVisible>

          ))}

        </div>



        <div className="mt-12 p-6 bg-[#B8D4E8]/10 rounded-lg text-center border border-navy/5 max-w-3xl mx-auto">

          <p className="text-navy/70 italic font-hand text-lg">

            Palolem is where we got engaged. Colomb Bay is where we learned to dive. 

            These places are ours—now they're yours too.

          </p>

        </div>

    </FadeInWhenVisible>

    </section>

  );

};



const Travel = ({ isFamilyMode }) => (

  <section id="travel" className="py-12 md:py-16 lg:py-20 px-4 md:px-6 bg-[#1B3A57] text-[#F5F0E8]">

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

                       <p className="font-bold">Family Pickup:</p>

                       <p>We're coordinating rides for March 18 arrivals!</p>

                     </div>

                 ) : (

                     <p className="text-base pt-2 opacity-80">Tip: Pre-book a taxi or use GoaMiles. Window seat mandatory.</p>

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

                   <p className="text-base mt-2">You're with us! Rooms assigned, fridge stocked, pool ready.</p>

               </div>

               <p className="text-sm opacity-60">Check-in: March 18, 12:00 PM</p>

            </div>

          ) : (

            <ul className="font-hand text-lg space-y-4">

               <li className="flex gap-3 items-start border-b border-navy/10 pb-2">

                 <span className="text-[#D4A5A5] mt-1">★</span>

                 <div>

                    <p className="font-bold">Alila Diwa Goa</p>

                    <p className="text-sm opacity-70">Closest to venue (20 min). Luxury.</p>

                 </div>

               </li>

               <li className="flex gap-3 items-start border-b border-navy/10 pb-2">

                 <span className="text-navy mt-1">★</span>

                 <div>

                    <p className="font-bold">Airbnb / Villas</p>

                    <p className="text-sm opacity-70">Look in Cavelossim or Betul.</p>

                 </div>

               </li>

               <li className="text-center pt-2">

                  <span className="bg-white px-3 py-1 border border-navy rounded-full text-sm">Book Early!</span>

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

    { q: "Are kids invited?", a: "Yes! Cookie & Bailey insist on having playmates." },

    { q: "Plus ones?", a: "If your invite says 'and guest', bring them! Otherwise, we're keeping it intimate." },

    { q: "Open bar?", a: "Absolutely. We're not monsters." },

    { q: "Gifts?", a: "Your presence > presents. But if you insist, a contribution to our honeymoon fund works!" },

    { q: "Dietary restrictions?", a: "We'll have veg and non-veg options. Let us know in the RSVP." }

  ];



  return (

  <section id="q-a" className="py-12 md:py-16 lg:py-20 px-4 md:px-6 bg-white">

    <FadeInWhenVisible className="max-w-4xl mx-auto">

        <div className="text-center mb-12">

          <h2 className="text-5xl font-hand text-navy">FAQ</h2>

        </div>



        <div className="grid md:grid-cols-2 gap-6">

          {questions.map((item, i) => (

          <FadeInWhenVisible key={item.q} delay={i * 0.05} className="sketchy-border p-6 bg-[#F5F0E8] rotate-1 hover:rotate-0 transition-transform">

               <h4 className="font-bold text-xl font-hand text-navy mb-2 flex items-start gap-2">

                 <span className="text-[#D4A5A5]">?</span> {item.q}

               </h4>

               <p className="font-hand text-xl text-navy/80 ml-5">{item.a}</p>

          </FadeInWhenVisible>

          ))}

        <FadeInWhenVisible delay={questions.length * 0.05} className="sketchy-border p-6 bg-[#F5F0E8] -rotate-1">

             <h4 className="font-bold text-xl font-hand text-navy mb-2 flex items-start gap-2">

                 <Phone size={18} className="mt-1 text-[#D4A5A5] flex-shrink-0" />

                 Real Questions?

             </h4>

             <p className="font-hand text-xl text-navy/80 ml-5">

                Contact Priya Sharma (Coordinator)<br/>

                +91 98765 43210<br/>

                events@blumissel.com

             </p>

        </FadeInWhenVisible>

        </div>

    </FadeInWhenVisible>

    </section>

  );

};



const RSVP = () => {

  const [submitted, setSubmitted] = useState(false);
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
    
    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          guests: formData.guests,
          attending: formData.attending,
          dietary: formData.dietary,
          song: formData.song,
          _subject: 'Wedding RSVP from ' + formData.name
        }),
      });

      if (response.ok) {
        setSubmitted(true);
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#D4A5A5', '#B8D4E8', '#1B3A57', '#F5F0E8']
        });
      } else {
        alert('Something went wrong. Please try again or contact us directly.');
      }
    } catch (error) {
      alert('Something went wrong. Please try again or contact us directly.');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (

    <section id="rsvp" className="py-12 md:py-16 lg:py-20 px-4 md:px-6 bg-[#F5F0E8] relative">

      <div className="section-divider"></div>

      <FadeInWhenVisible className="max-w-xl mx-auto bg-white border border-navy/10 sketchy-border p-8 md:p-12 shadow-sm relative">

        <div className="washi-tape -top-4 left-1/2 -translate-x-1/2 bg-[#B8D4E8]"></div>



        <div className="text-center mb-10 mt-2">

          <h2 className="text-5xl text-navy mb-2 font-hand">R.S.V.P.</h2>

          <p className="text-navy/50 text-sm uppercase tracking-widest">Please respond by Jan 20th</p>

        </div>



        {!submitted ? (

          <form onSubmit={handleSubmit} className="space-y-6">

            <div>

              <label className="block text-xs font-bold uppercase tracking-widest text-navy/50 mb-2">Full Name(s)</label>

              <input 
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

                   <label className="block text-xs font-bold uppercase tracking-widest text-navy/50 mb-2">Email</label>

                   <input 
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

                   <label className="block text-xs font-bold uppercase tracking-widest text-navy/50 mb-2">Phone</label>

                   <input 
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

                <label className="block text-xs font-bold uppercase tracking-widest text-navy/50 mb-2">Number of Guests</label>

                <select 
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

               <label className="block text-xs font-bold uppercase tracking-widest text-navy/50 mb-2">Dietary Restrictions</label>

               <input 
                 type="text" 
                 name="dietary"
                 value={formData.dietary}
                 onChange={handleChange}
                 className="modern-input" 
                 placeholder="Allergies, vegetarian, etc." 
               />

            </div>



            <div>

               <label className="block text-xs font-bold uppercase tracking-widest text-navy/50 mb-2 flex items-center gap-2">Song Request</label>

               <input 
                 type="text" 
                 name="song"
                 value={formData.song}
                 onChange={handleChange}
                 className="modern-input" 
                 placeholder="I promise to dance to..." 
               />

            </div>

            

            <button 
              type="submit"
              className="w-full bg-[#1B3A57] text-white font-bold text-lg py-4 mt-6 sketchy-border font-hand hover:bg-[#2c5378] transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 duration-200 hover:rotate-1"
            >

              Send RSVP

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

  <footer className="relative text-blue-100/60 text-center px-4 md:px-6 overflow-hidden" style={{ minHeight: '300px' }}>

    {/* Kidena House Background Image */}
    <div className="absolute inset-0 opacity-20">

      <img 

        src="/images/kidena-house.jpg" 

        alt="Kidena House" 

        className="w-full h-full object-cover sepia-[.5]"

      />

            </div>

    <div className="absolute inset-0 bg-[#1B3A57]/95"></div>

    <div className="relative z-10 py-8 md:py-12 lg:py-16">

      <p className="max-w-2xl mx-auto font-light leading-relaxed mb-10 italic text-lg">

        Seven years of finding each other twice and choosing each other every day since. Now, they're saying it out loud: forever.

      </p>

      

      <div className="flex justify-center gap-8 mb-8">

         <span className="hover:text-[#D4A5A5] transition-colors cursor-pointer flex items-center gap-2">

            <PawPrint size={20} /> 

            <span className="text-sm font-hand">Cookie & Bailey</span>

         </span>

            </div>

            

      <p className="text-xs uppercase tracking-widest opacity-60 mb-8">

        Made with love, momos & feni • Goa 2026

      </p>



      <button 

        onClick={toggleFamilyMode}

        className="opacity-20 hover:opacity-100 transition-opacity text-xs border border-white/20 rounded px-2 py-1 flex items-center gap-1 mx-auto bg-white/10 backdrop-blur-sm"

      >

        {isFamilyMode ? <Unlock size={10}/> : <Lock size={10}/>}

        {isFamilyMode ? 'Switch to Guest View' : 'Family Login'}

      </button>

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

        className="fixed bottom-6 left-6 z-50 w-14 h-14 sketchy-border bg-[#D4A5A5] text-white shadow-xl flex flex-col items-center justify-center hover:scale-105 transition-transform font-hand font-semibold border-2 border-white"

        aria-label={playing ? 'Pause background music' : 'Play background music'}

      >

        <Music className="w-6 h-6" />

        <span className="text-[10px] mt-1 tracking-tight">music</span>

            </button>

      <audio ref={audioRef} src="/music/goa-mix.mp3" loop preload="auto" />

    </>

  );

};



/* --- CARD STACK SYSTEM --- */



const Card = ({ children, scrollable = false, className = '' }) => {

  const [showScrollIndicator, setShowScrollIndicator] = useState(false);

  const cardRef = useRef(null);



  useEffect(() => {

    if (!scrollable || !cardRef.current) return;



    const checkScroll = () => {

      const el = cardRef.current;

      if (el) {

        const hasScroll = el.scrollHeight > el.clientHeight;

        const isScrolled = el.scrollTop > 10;

        setShowScrollIndicator(hasScroll && !isScrolled);

      }

    };



    checkScroll();

    const el = cardRef.current;

    if (el) {

      el.addEventListener('scroll', checkScroll);

      return () => el.removeEventListener('scroll', checkScroll);

    }

  }, [scrollable]);



  return (

    <motion.div

      ref={cardRef}

      className={`h-screen w-screen ${scrollable ? 'overflow-y-auto overflow-x-hidden' : 'overflow-hidden'} ${className}`}

      initial={{ opacity: 0 }}

      animate={{ opacity: 1 }}

      exit={{ opacity: 0 }}

      transition={{ duration: 0.3 }}

    >

      <div className={scrollable ? 'min-h-screen py-6 md:py-12 px-4 md:px-6' : 'h-full flex items-center justify-center px-4 md:px-6'}>

        {children}

      </div>



      {showScrollIndicator && scrollable && (

        <motion.div

          className="fixed bottom-24 left-1/2 -translate-x-1/2 z-40"

          animate={{ y: [0, -10, 0] }}

          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}

        >

          <ArrowDown className="text-navy/30" size={32} />

        </motion.div>

      )}

    </motion.div>

  );

};



const ProgressIndicator = ({ cards, currentIndex, onCardClick }) => {

  return (

    <div className="fixed top-4 left-4 right-4 z-50 flex gap-2 max-w-6xl mx-auto">

      {cards.map((_, i) => (

        <motion.button

          key={i}

          onClick={() => onCardClick(i)}

          className="h-1 flex-1 rounded-full bg-white/30 backdrop-blur-sm cursor-pointer relative overflow-hidden"

          whileHover={{ scale: 1.05 }}

          whileTap={{ scale: 0.95 }}

        >

          <motion.div

            className="h-full bg-[#D4A5A5] rounded-full"

            initial={{ width: '0%' }}

            animate={{

              width: i < currentIndex ? '100%' : i === currentIndex ? '50%' : '0%'

            }}

            transition={{ duration: 0.3 }}

          />

        </motion.button>

      ))}

    </div>

  );

};



const CardStack = ({ cards, isFamilyMode, fullContent }) => {

  const [currentIndex, setCurrentIndex] = useState(0);

  const [viewMode, setViewMode] = useState('cards'); // 'cards' or 'scroll'

  const touchStartX = useRef(0);

  const touchStartY = useRef(0);

  const isScrolling = useRef(false);



  const goToCard = (index) => {

    if (index >= 0 && index < cards.length) {

      setCurrentIndex(index);

    }

  };



  const nextCard = () => {

    if (currentIndex < cards.length - 1) {

      setCurrentIndex(currentIndex + 1);

    }

  };



  const prevCard = () => {

    if (currentIndex > 0) {

      setCurrentIndex(currentIndex - 1);

    }

  };



  // Keyboard navigation

  useEffect(() => {

    if (viewMode !== 'cards') return;



    const handleKeyPress = (e) => {

      if (e.key === 'ArrowLeft') {

        prevCard();

      } else if (e.key === 'ArrowRight') {

        nextCard();

      }

    };



    window.addEventListener('keydown', handleKeyPress);

    return () => window.removeEventListener('keydown', handleKeyPress);

  }, [currentIndex, viewMode]);



  // Swipe gestures

  const handleTouchStart = (e) => {

    touchStartX.current = e.touches[0].clientX;

    touchStartY.current = e.touches[0].clientY;

    isScrolling.current = false;

  };



  const handleTouchMove = (e) => {

    const deltaX = Math.abs(e.touches[0].clientX - touchStartX.current);

    const deltaY = Math.abs(e.touches[0].clientY - touchStartY.current);



    // If vertical scroll is more than horizontal, it's a scroll, not a swipe

    if (deltaY > deltaX) {

      isScrolling.current = true;

    }

  };



  const handleTouchEnd = (e) => {

    if (isScrolling.current || viewMode !== 'cards') return;



    const touchEndX = e.changedTouches[0].clientX;

    const touchEndY = e.changedTouches[0].clientY;

    const deltaX = touchStartX.current - touchEndX;

    const deltaY = Math.abs(touchStartY.current - touchEndY);



    // Only trigger swipe if horizontal movement is greater than vertical

    if (Math.abs(deltaX) > 50 && Math.abs(deltaX) > deltaY) {

      if (deltaX > 0) {

        nextCard();

      } else {

        prevCard();

      }

    }

  };



  // Filter cards based on family mode

  const visibleCards = cards.filter(card => {

    if (card.familyOnly && !isFamilyMode) return false;

    if (card.guestOnly && isFamilyMode) return false;

    return true;

  });



  if (viewMode === 'scroll') {

    return (

      <div className="min-h-screen relative">

        <button

          onClick={() => setViewMode('cards')}

          className="fixed top-4 right-4 z-50 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full text-navy text-sm font-hand border-2 border-navy shadow-lg hover:scale-105 transition-transform"

        >

          Card View

        </button>

        {fullContent || visibleCards.map((card, i) => (

          <div key={i}>

            {card.component}

      </div>

        ))}

        <MusicPlayer />

      </div>

    );

  }



  return (

    <div

      className="h-screen w-screen overflow-hidden relative bg-[#F5F0E8]"

      onTouchStart={handleTouchStart}

      onTouchMove={handleTouchMove}

      onTouchEnd={handleTouchEnd}

    >

      <ProgressIndicator

        cards={visibleCards}

        currentIndex={currentIndex}

        onCardClick={goToCard}

      />



      <button 

        onClick={() => setViewMode('scroll')}

        className="fixed top-4 right-4 z-50 bg-white/90 backdrop-blur-sm px-3 py-1.5 sketchy-border text-navy text-xs font-hand border border-navy/20 shadow-md hover:scale-105 transition-transform opacity-70 hover:opacity-100"

      >

        View All

      </button>



      <AnimatePresence mode="wait" initial={false}>

        <motion.div

          key={currentIndex}

          initial={{ x: 100, opacity: 0 }}

          animate={{ x: 0, opacity: 1 }}

          exit={{ x: -100, opacity: 0 }}

          transition={{ type: 'tween', duration: 0.4, ease: 'easeInOut' }}

          className="absolute inset-0"

        >

          {visibleCards[currentIndex]?.component}

        </motion.div>

      </AnimatePresence>



      {/* Navigation Arrows */}

      <button

        onClick={prevCard}

        disabled={currentIndex === 0}

        className="fixed left-4 top-1/2 -translate-y-1/2 z-50 w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm border-2 border-navy shadow-lg disabled:opacity-30 disabled:cursor-not-allowed hover:scale-110 transition-transform flex items-center justify-center text-navy font-bold"

        aria-label="Previous card"

      >

        ←

      </button>



      <button

        onClick={nextCard}

        disabled={currentIndex === visibleCards.length - 1}

        className="fixed right-4 top-1/2 -translate-y-1/2 z-50 w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm border-2 border-navy shadow-lg disabled:opacity-30 disabled:cursor-not-allowed hover:scale-110 transition-transform flex items-center justify-center text-navy font-bold"

        aria-label="Next card"

      >

        →

      </button>



      <MusicPlayer />

    </div>

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



/* --- INTERACTIVE HOTSPOTS --- */

const InteractiveHotspot = ({ position, tooltip, onClick, children }) => {

  const [isHovered, setIsHovered] = useState(false);



  return (

    <motion.button

      className="absolute z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#D4A5A5]/80 backdrop-blur-sm border-2 border-white shadow-lg flex items-center justify-center text-white text-base md:text-2xl touch-manipulation"

      style={position}

      whileHover={{ scale: 1.3, rotate: 5 }}

      whileTap={{ scale: 0.9 }}

      onHoverStart={() => setIsHovered(true)}

      onHoverEnd={() => setIsHovered(false)}

      onClick={onClick}

      aria-label={tooltip}

    >

      {children}

      {isHovered && (

        <motion.div

          initial={{ opacity: 0, y: 10, scale: 0.8 }}

          animate={{ opacity: 1, y: 0, scale: 1 }}

          exit={{ opacity: 0, y: 10, scale: 0.8 }}

          className="absolute -top-12 left-1/2 -translate-x-1/2 bg-white px-4 py-2 rounded-lg shadow-xl sketchy-border whitespace-nowrap z-50"

        >

          <p className="font-hand text-sm md:text-base text-navy">{tooltip}</p>

          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white"></div>

        </motion.div>

      )}

    </motion.button>

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

  const sections = [

    { id: 'hero', name: 'Home', component: Hero },

    { id: 'our-story', name: 'Story', component: Story },

    { id: 'dogs', name: 'Dogs', component: CookieAndBailey },

    { id: 'excited', name: 'Excited', component: WhatWeAreExcitedAbout },

    ...(isFamilyMode ? [

      { id: 'kidena-house', name: 'Kidena', component: KidenaHouse },

      { id: 'family-itinerary', name: 'Itinerary', component: FamilyItinerary }

    ] : []),

    { id: 'the-celebration', name: 'Party', component: Celebration },

    { id: 'dress-code', name: 'Dress', component: DressCode },

    { id: 'explore-goa', name: 'Goa', component: ExploreGoa },

    { id: 'travel', name: 'Travel', component: Travel },

    { id: 'q-a', name: 'Q&A', component: QnA },

    { id: 'rsvp', name: 'RSVP', component: RSVP }

  ];



  // Track active section on scroll

  useEffect(() => {

    const handleScroll = () => {

      const scrollPosition = window.scrollY + window.innerHeight / 2;

      

      // Find which section is currently in view

      for (let i = sections.length - 1; i >= 0; i--) {

        const element = document.getElementById(sections[i].id);

        if (element && scrollPosition >= element.offsetTop) {

          setActiveSection(i);

          break;

        }

      }

    };



    window.addEventListener('scroll', handleScroll, { passive: true });

    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);

  }, [sections]);



  // Scroll to section

  const scrollToSection = (sectionId) => {

    const element = document.getElementById(sectionId);

    if (element) {

      element.scrollIntoView({ behavior: 'smooth', block: 'start' });

    }

  };



  return (

    <>

      <style>{styles}</style>

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

        <Hero />

        </section>



        <section id="our-story" className="scroll-section">

        <Story />

        </section>



        <section id="dogs" className="scroll-section flex items-center justify-center">

        <CookieAndBailey />

        </section>



        <section id="excited" className="scroll-section flex items-center justify-center">

        <WhatWeAreExcitedAbout />

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



        <section id="the-celebration" className="scroll-section">

        <Celebration isFamilyMode={isFamilyMode} />

        </section>



        <section id="dress-code" className="scroll-section">

        <DressCode />

        </section>



        <section id="explore-goa" className="scroll-section">

        <ExploreGoa />

        </section>



        <section id="travel" className="scroll-section">

        <Travel isFamilyMode={isFamilyMode} />

        </section>



        <section id="q-a" className="scroll-section">

        <QnA />

        </section>



        <section id="rsvp" className="scroll-section">

        <RSVP />

        </section>



        <section id="footer" className="scroll-section flex items-center justify-center">

        <Footer toggleFamilyMode={() => setIsFamilyMode(!isFamilyMode)} isFamilyMode={isFamilyMode} />

        </section>



        <MusicPlayer />

      </div>

    </>

  );

};



export default App;

