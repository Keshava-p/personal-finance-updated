import React from 'react';
import { motion } from 'framer-motion';

interface SkeletonLoaderProps {
    variant?: 'card' | 'text' | 'circle' | 'rectangle';
    width?: string;
    height?: string;
    className?: string;
    count?: number;
}

export function SkeletonLoader({
    variant = 'rectangle',
    width,
    height,
    className = '',
    count = 1
}: SkeletonLoaderProps) {
    const getVariantClasses = () => {
        switch (variant) {
            case 'card':
                return 'w-full h-48 rounded-xl';
            case 'text':
                return 'w-full h-4 rounded';
            case 'circle':
                return 'w-12 h-12 rounded-full';
            case 'rectangle':
            default:
                return 'w-full h-20 rounded-lg';
        }
    };

    const baseClasses = `skeleton ${getVariantClasses()}`;
    const style = {
        width: width || undefined,
        height: height || undefined,
    };

    if (count > 1) {
        return (
            <div className="space-y-3">
                {Array.from({ length: count }).map((_, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className={`${baseClasses} ${className}`}
                        style={style}
                    />
                ))}
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`${baseClasses} ${className}`}
            style={style}
        />
    );
}

// Preset skeleton components for common use cases
export function SkeletonCard() {
    return (
        <div className="glass-card p-6 space-y-4">
            <div className="flex items-center gap-4">
                <SkeletonLoader variant="circle" width="48px" height="48px" />
                <div className="flex-1 space-y-2">
                    <SkeletonLoader variant="text" width="60%" height="16px" />
                    <SkeletonLoader variant="text" width="40%" height="12px" />
                </div>
            </div>
            <SkeletonLoader variant="rectangle" height="120px" />
            <div className="flex gap-2">
                <SkeletonLoader variant="rectangle" height="36px" width="100px" />
                <SkeletonLoader variant="rectangle" height="36px" width="100px" />
            </div>
        </div>
    );
}

export function SkeletonMetricsCard() {
    return (
        <div className="glass-card p-6 space-y-3">
            <SkeletonLoader variant="text" width="50%" height="14px" />
            <SkeletonLoader variant="text" width="70%" height="32px" />
            <SkeletonLoader variant="text" width="40%" height="12px" />
        </div>
    );
}

export function SkeletonTable({ rows = 5 }: { rows?: number }) {
    return (
        <div className="space-y-3">
            <SkeletonLoader variant="rectangle" height="48px" />
            {Array.from({ length: rows }).map((_, i) => (
                <SkeletonLoader key={i} variant="rectangle" height="64px" />
            ))}
        </div>
    );
}
