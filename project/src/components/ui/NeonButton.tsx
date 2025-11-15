import React from 'react';
import { motion } from 'framer-motion';

interface NeonButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export function NeonButton({ 
  variant = 'primary', 
  size = 'md', 
  children, 
  className = '',
  ...props 
}: NeonButtonProps) {
  const baseClasses = 'relative font-semibold rounded-xl transition-all duration-300 overflow-hidden';
  
  const variantClasses = {
    primary: 'bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 text-white',
    secondary: 'bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white',
    danger: 'bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 text-white',
  };

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`
        ${baseClasses}
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${className}
        shadow-[0_0_20px_rgba(59,130,246,0.5)]
        hover:shadow-[0_0_30px_rgba(59,130,246,0.8)]
      `}
      {...props}
    >
      <span className="relative z-10">{children}</span>
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0"
        initial={{ x: '-100%' }}
        whileHover={{ x: '100%' }}
        transition={{ duration: 0.6 }}
      />
    </motion.button>
  );
}

