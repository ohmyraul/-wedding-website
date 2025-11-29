import React from 'react';
import { motion } from 'framer-motion';

/**
 * Skeleton loader component matching the sketchy aesthetic
 * Used for loading states with hand-drawn border treatment
 */
const SkeletonLoader = ({ 
  variant = 'card', // 'card' | 'text' | 'image' | 'button'
  width = '100%',
  height,
  className = '',
  count = 1,
  ...props 
}) => {
  const baseClasses = 'bg-[#EDEDE3] rounded-lg';
  
  const variantClasses = {
    card: 'sketchy-border bg-[#FDF9F4] border border-[#D4CDC2]',
    text: 'h-4 rounded',
    image: 'aspect-video rounded-lg',
    button: 'h-10 rounded-lg',
  };
  
  const pulseAnimation = {
    animate: {
      opacity: [0.6, 1, 0.6],
    },
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  };
  
  const skeletonStyle = {
    width,
    height: height || (variant === 'text' ? '1rem' : variant === 'button' ? '2.5rem' : 'auto'),
  };
  
  if (count > 1) {
    return (
      <div className={`space-y-3 ${className}`} {...props}>
        {Array.from({ length: count }).map((_, i) => (
          <motion.div
            key={i}
            className={`${baseClasses} ${variantClasses[variant] || variantClasses.card}`}
            style={skeletonStyle}
            {...pulseAnimation}
          />
        ))}
      </div>
    );
  }
  
  return (
    <motion.div
      className={`${baseClasses} ${variantClasses[variant] || variantClasses.card} ${className}`}
      style={skeletonStyle}
      {...pulseAnimation}
      {...props}
    />
  );
};

export default SkeletonLoader;

