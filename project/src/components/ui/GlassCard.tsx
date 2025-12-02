import React from 'react';
import { motion } from 'framer-motion';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  intensity?: 'subtle' | 'default' | 'intense';
  noPadding?: boolean;
}

export function GlassCard({
  children,
  className = '',
  hover = true,
  intensity = 'default',
  noPadding = false
}: GlassCardProps) {
  const intensityClasses = {
    subtle: 'backdrop-blur-lg bg-white/5 border-white/5',
    default: 'backdrop-blur-xl bg-white/10 border-white/10',
    intense: 'backdrop-blur-2xl bg-white/15 border-white/15',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        ease: [0.4, 0, 0.2, 1]
      }}
      whileHover={hover ? {
        y: -4,
        transition: {
          duration: 0.2,
          ease: [0.34, 1.56, 0.64, 1] // Spring easing
        }
      } : {}}
      className={`
        ${intensityClasses[intensity]}
        border rounded-xl
        shadow-fintech-lg
        ${hover ? 'hover:shadow-fintech-xl hover:bg-white/15 transition-all duration-300' : ''}
        ${!noPadding ? 'p-6' : ''}
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
}

// Specialized Glass Card Variants
export function GlassCardGradient({
  children,
  className = '',
  gradient = 'from-cyan-500/10 to-blue-500/10'
}: {
  children: React.ReactNode;
  className?: string;
  gradient?: string;
}) {
  return (
    <GlassCard className={`bg-gradient-to-br ${gradient} ${className}`} noPadding>
      <div className="p-6">
        {children}
      </div>
    </GlassCard>
  );
}

export function GlassCardHighlight({
  children,
  className = '',
  highlightColor = 'cyan'
}: {
  children: React.ReactNode;
  className?: string;
  highlightColor?: 'cyan' | 'violet' | 'pink' | 'emerald';
}) {
  const highlightClasses = {
    cyan: 'border-l-4 border-l-cyan-400',
    violet: 'border-l-4 border-l-violet-400',
    pink: 'border-l-4 border-l-pink-400',
    emerald: 'border-l-4 border-l-emerald-400',
  };

  return (
    <GlassCard className={`${highlightClasses[highlightColor]} ${className}`}>
      {children}
    </GlassCard>
  );
}
