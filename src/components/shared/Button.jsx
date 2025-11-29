import React from 'react';
import { COLORS } from '../../constants/theme';

/**
 * Reusable Button component with sketchy aesthetic
 * Supports primary, secondary, and floating action button variants
 */
const Button = ({ 
  children, 
  variant = 'primary', // 'primary' | 'secondary' | 'floating'
  size = 'md', // 'sm' | 'md' | 'lg'
  className = '',
  disabled = false,
  onClick,
  type = 'button',
  ...props 
}) => {
  const baseClasses = 'font-hand font-bold transition-all duration-200 sketchy-border focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D88D66] focus-visible:ring-offset-2';
  
  const variantClasses = {
    primary: 'bg-[#D88D66] text-[#FDF9F4] hover:bg-[#C97452] hover:scale-[1.02] hover:-translate-y-[2px] hover:shadow-xl active:scale-[0.98] active:translate-y-[1px] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#D88D66] disabled:hover:scale-100 disabled:hover:translate-y-0',
    secondary: 'bg-[#FDF9F4] text-navy border-[#D88D66]/30 hover:border-[#D88D66]/60 hover:bg-[#D88D66]/20 hover:-translate-y-0.5',
    floating: 'bg-[#D88D66] text-[#FDF9F4] rounded-full shadow-md hover:scale-105 hover:rotate-1',
  };
  
  const sizeClasses = {
    sm: 'px-3 py-2 text-xs',
    md: 'px-6 py-2 text-sm md:text-base',
    lg: 'px-8 py-3 text-base md:text-lg',
  };
  
  const classes = [
    baseClasses,
    variantClasses[variant] || variantClasses.primary,
    sizeClasses[size] || sizeClasses.md,
    className,
  ].filter(Boolean).join(' ');
  
  return (
    <button
      type={type}
      className={classes}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;

