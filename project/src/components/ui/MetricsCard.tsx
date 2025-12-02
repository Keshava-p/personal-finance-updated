import React, { useEffect, useState } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';
import { GlassCard } from './GlassCard';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface MetricsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  icon?: React.ReactNode;
  gradient?: string;
  animateValue?: boolean;
  prefix?: string;
  suffix?: string;
}

export function MetricsCard({
  title,
  value,
  subtitle,
  trend,
  trendValue,
  icon,
  gradient = 'from-cyan-500/20 to-blue-500/20',
  animateValue = false,
  prefix = '',
  suffix = ''
}: MetricsCardProps) {
  const [displayValue, setDisplayValue] = useState(0);

  // Animate number counting
  useEffect(() => {
    if (animateValue && typeof value === 'number') {
      const duration = 1000;
      const steps = 60;
      const stepValue = value / steps;
      let current = 0;

      const timer = setInterval(() => {
        current += stepValue;
        if (current >= value) {
          setDisplayValue(value);
          clearInterval(timer);
        } else {
          setDisplayValue(Math.floor(current));
        }
      }, duration / steps);

      return () => clearInterval(timer);
    }
  }, [value, animateValue]);

  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4" />;
      case 'down':
        return <TrendingDown className="h-4 w-4" />;
      case 'neutral':
        return <Minus className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return 'text-emerald-400 bg-emerald-500/10';
      case 'down':
        return 'text-red-400 bg-red-500/10';
      case 'neutral':
        return 'text-white/60 bg-white/5';
      default:
        return '';
    }
  };

  return (
    <GlassCard hover={true} noPadding>
      <div className={`p-6 bg-gradient-to-br ${gradient} rounded-xl h-full`}>
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-sm font-medium text-white/70 mb-2"
            >
              {title}
            </motion.p>

            <motion.h3
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                delay: 0.2,
                type: "spring",
                stiffness: 200,
                damping: 15
              }}
              className="text-4xl font-bold text-white mb-2 tracking-tight"
            >
              {prefix}
              {animateValue && typeof value === 'number' ? displayValue : value}
              {suffix}
            </motion.h3>

            {subtitle && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-xs text-white/60"
              >
                {subtitle}
              </motion.p>
            )}
          </div>

          {icon && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{
                delay: 0.2,
                type: "spring",
                stiffness: 200
              }}
              className="text-white/30"
            >
              {icon}
            </motion.div>
          )}
        </div>

        {trend && trendValue && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium ${getTrendColor()}`}
          >
            {getTrendIcon()}
            <span>{trendValue}</span>
          </motion.div>
        )}
      </div>
    </GlassCard>
  );
}

// Compact Metrics Card for smaller spaces
export function CompactMetricsCard({
  label,
  value,
  icon,
  color = 'cyan'
}: {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  color?: 'cyan' | 'violet' | 'emerald' | 'amber';
}) {
  const colorClasses = {
    cyan: 'from-cyan-500/10 to-cyan-600/10 text-cyan-400',
    violet: 'from-violet-500/10 to-violet-600/10 text-violet-400',
    emerald: 'from-emerald-500/10 to-emerald-600/10 text-emerald-400',
    amber: 'from-amber-500/10 to-amber-600/10 text-amber-400',
  };

  return (
    <div className={`p-4 rounded-xl bg-gradient-to-br ${colorClasses[color].split(' ')[0]} ${colorClasses[color].split(' ')[1]} border border-white/10`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-white/60 mb-1">{label}</p>
          <p className={`text-2xl font-bold ${colorClasses[color].split(' ')[2]}`}>{value}</p>
        </div>
        {icon && (
          <div className="opacity-30">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
