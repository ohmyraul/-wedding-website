import React from 'react';
import { COLORS } from '../../constants/theme';

/**
 * Reusable Card component with sketchy aesthetic
 * Supports multiple variants matching the design system
 */
const Card = ({ 
  children, 
  variant = 'primary', // 'primary' | 'secondary' | 'photo' | 'feature'
  padding = 'md', // 'sm' | 'md' | 'lg'
  className = '',
  style = {},
  hover = false,
  rotation = 0, // -2, -1, 0, 1, 2
  ...props 
}) => {
  const baseClasses = 'bg-[#FDF9F4]';
  
  const variantClasses = {
    primary: 'rounded-2xl border border-[#D4CDC2]',
    secondary: 'rounded-xl border border-[#D4CDC2]',
    photo: 'sketchy-border',
    feature: 'rounded-xl border-2',
  };
  
  const paddingClasses = {
    sm: 'p-4 md:p-5',
    md: 'p-6 md:p-8',
    lg: 'p-8 md:p-10',
  };
  
  const rotationClasses = {
    '-2': '-rotate-2',
    '-1': '-rotate-1',
    '0': '',
    '1': 'rotate-1',
    '2': 'rotate-2',
  };
  
  const shadowStyle = {
    boxShadow: '0 8px 16px rgba(216, 141, 102, 0.15)',
  };
  
  const classes = [
    baseClasses,
    variantClasses[variant] || variantClasses.primary,
    paddingClasses[padding] || paddingClasses.md,
    rotationClasses[rotation] || '',
    hover ? 'hover:-translate-y-1 hover:shadow-lg transition-all duration-300' : '',
    className,
  ].filter(Boolean).join(' ');
  
  return (
    <div 
      className={classes}
      style={{ ...shadowStyle, ...style }}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;

