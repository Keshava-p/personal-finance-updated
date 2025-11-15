import React from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from './GlassCard';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface MetricsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  icon?: React.ReactNode;
  gradient?: string;
}

export function MetricsCard({ 
  title, 
  value, 
  subtitle, 
  trend, 
  trendValue, 
  icon,
  gradient = 'from-cyan-500/20 to-blue-500/20'
}: MetricsCardProps) {
  return (
    <GlassCard>
      <div className={`p-6 bg-gradient-to-br ${gradient} rounded-2xl`}>
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <p className="text-sm font-medium text-white/70 mb-1">{title}</p>
            <h3 className="text-3xl font-bold text-white mb-2">{value}</h3>
            {subtitle && (
              <p className="text-xs text-white/60">{subtitle}</p>
            )}
          </div>
          {icon && (
            <div className="text-white/40">
              {icon}
            </div>
          )}
        </div>
        {trend && trendValue && (
          <div className={`flex items-center gap-1 text-sm ${
            trend === 'up' ? 'text-green-400' : trend === 'down' ? 'text-red-400' : 'text-white/60'
          }`}>
            {trend === 'up' ? (
              <TrendingUp className="h-4 w-4" />
            ) : trend === 'down' ? (
              <TrendingDown className="h-4 w-4" />
            ) : null}
            <span>{trendValue}</span>
          </div>
        )}
      </div>
    </GlassCard>
  );
}

