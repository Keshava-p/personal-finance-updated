import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface NeonButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'solid' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

export function NeonButton({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  loading = false,
  icon,
  iconPosition = 'left',
  disabled,
  ...props
}: NeonButtonProps) {
  const baseClasses = 'relative font-semibold rounded-xl transition-all duration-200 overflow-hidden inline-flex items-center justify-center gap-2';

  const variantClasses = {
    primary: 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg hover:shadow-xl hover:from-cyan-400 hover:to-blue-400',
    secondary: 'bg-gradient-to-r from-violet-500 to-purple-500 text-white shadow-lg hover:shadow-xl hover:from-violet-400 hover:to-purple-400',
    danger: 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg hover:shadow-xl hover:from-red-400 hover:to-orange-400',
    solid: 'bg-white/10 backdrop-blur-sm text-white border border-white/20 hover:bg-white/20 hover:border-white/30',
    ghost: 'text-white/80 hover:bg-white/10 hover:text-white',
  };

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  const isDisabled = disabled || loading;

  // Exclude conflicting props that have different signatures in Framer Motion
  const {
    onDragStart,
    onDragEnd,
    onDrag,
    onAnimationStart,
    onAnimationEnd,
    onAnimationIteration,
    ...restProps
  } = props;

  return (
    <motion.button
      whileHover={!isDisabled ? { scale: 1.02 } : {}}
      whileTap={!isDisabled ? { scale: 0.98 } : {}}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 17
      }}
      className={`
        ${baseClasses}
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
      disabled={isDisabled}
      {...restProps}
    >
      {/* Shimmer Effect */}
      {!isDisabled && variant !== 'ghost' && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          initial={{ x: '-100%' }}
          whileHover={{ x: '100%' }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        />
      )}

      {/* Content */}
      <span className="relative z-10 flex items-center gap-2">
        {loading && (
          <Loader2 className="h-4 w-4 animate-spin" />
        )}
        {!loading && icon && iconPosition === 'left' && icon}
        {children}
        {!loading && icon && iconPosition === 'right' && icon}
      </span>
    </motion.button>
  );
}

// Button Group Component
export function ButtonGroup({
  children,
  className = ''
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`inline-flex rounded-xl shadow-lg overflow-hidden ${className}`}>
      {children}
    </div>
  );
}
