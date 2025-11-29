import React from 'react';
import { motion } from 'framer-motion';
import { PawPrint } from 'lucide-react';

/**
 * Special loading component for Cookie Chase Game
 * Features cute loading message and sketchy aesthetic
 */
const GameLoader = ({ message = "Cookie is waking up..." }) => {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-gradient-to-b from-[#B8D4E8]/20 to-[#F5F0E8] backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-[#FDF9F4] sketchy-border border-2 border-[#3B2F2A] rounded-2xl p-8 md:p-10 text-center max-w-md mx-4"
        style={{ boxShadow: '0 18px 32px rgba(216, 141, 102, 0.2)' }}
      >
        {/* Animated paw print */}
        <motion.div
          animate={{ 
            y: [0, -10, 0],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ 
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
          className="flex justify-center mb-4"
        >
          <PawPrint 
            className="w-16 h-16 text-[#D88D66]" 
            strokeWidth={2}
          />
        </motion.div>
        
        {/* Loading message */}
        <motion.p
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ 
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
          className="font-hand text-lg md:text-xl text-navy font-semibold mb-2"
        >
          {message}
        </motion.p>
        
        {/* Loading dots */}
        <div className="flex justify-center gap-2 mt-4">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full bg-[#D88D66]"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                delay: i * 0.2,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>
        
        {/* Decorative sketchy border animation */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            border: '2px solid rgba(216, 141, 102, 0.3)',
            borderRadius: 'inherit',
            top: '-4px',
            left: '-4px',
            right: '-4px',
            bottom: '-4px',
          }}
          animate={{
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </motion.div>
    </div>
  );
};

export default GameLoader;

