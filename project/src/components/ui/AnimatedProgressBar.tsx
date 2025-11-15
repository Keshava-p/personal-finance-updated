import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface AnimatedProgressBarProps {
  value: number; // 0-100
  label?: string;
  color?: 'cyan' | 'blue' | 'purple' | 'green' | 'pink';
  showPercentage?: boolean;
}

export function AnimatedProgressBar({ 
  value, 
  label, 
  color = 'cyan',
  showPercentage = true 
}: AnimatedProgressBarProps) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDisplayValue(value);
    }, 100);
    return () => clearTimeout(timer);
  }, [value]);

  const colorClasses = {
    cyan: 'from-cyan-400 to-cyan-600',
    blue: 'from-blue-400 to-blue-600',
    purple: 'from-purple-400 to-purple-600',
    green: 'from-green-400 to-green-600',
    pink: 'from-pink-400 to-pink-600',
  };

  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-white/80">{label}</span>
          {showPercentage && (
            <span className="text-sm font-bold text-white">{Math.round(displayValue)}%</span>
          )}
        </div>
      )}
      <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${displayValue}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className={`h-full bg-gradient-to-r ${colorClasses[color]} shadow-lg relative overflow-hidden`}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          />
        </motion.div>
      </div>
    </div>
  );
}

