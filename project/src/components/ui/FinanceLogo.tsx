import React from 'react';
import { motion } from 'framer-motion';

interface FinanceLogoProps {
    collapsed?: boolean;
}

export const FinanceLogo: React.FC<FinanceLogoProps> = ({ collapsed = false }) => {
    return (
        <div className="relative">
            {/* Animated background glow */}
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className="absolute inset-0 bg-gradient-to-br from-cyan-400/20 via-blue-500/20 to-violet-500/20 blur-xl rounded-full"
            />

            {/* Logo container */}
            <div className="relative p-2.5 rounded-2xl bg-gradient-to-br from-cyan-500/10 via-blue-500/10 to-violet-500/10 border border-cyan-400/30 backdrop-blur-sm">
                <svg
                    width={collapsed ? "28" : "32"}
                    height={collapsed ? "28" : "32"}
                    viewBox="0 0 32 32"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="relative z-10"
                >
                    {/* Coin/Circle base */}
                    <motion.circle
                        cx="16"
                        cy="16"
                        r="14"
                        stroke="url(#gradient1)"
                        strokeWidth="2"
                        fill="none"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 1.5, ease: "easeInOut" }}
                    />

                    {/* Dollar sign with modern twist */}
                    <motion.path
                        d="M16 6 L16 26 M12 10 C12 10 12 8 16 8 C20 8 20 10 20 12 C20 14 18 15 16 15 C14 15 12 16 12 18 C12 20 12 22 16 22 C20 22 20 20 20 20"
                        stroke="url(#gradient2)"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        fill="none"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 1.5, delay: 0.3, ease: "easeInOut" }}
                    />

                    {/* Sparkle effects */}
                    <motion.circle
                        cx="8"
                        cy="8"
                        r="1.5"
                        fill="url(#gradient3)"
                        animate={{
                            opacity: [0, 1, 0],
                            scale: [0.5, 1, 0.5],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            delay: 0,
                        }}
                    />
                    <motion.circle
                        cx="24"
                        cy="8"
                        r="1.5"
                        fill="url(#gradient3)"
                        animate={{
                            opacity: [0, 1, 0],
                            scale: [0.5, 1, 0.5],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            delay: 0.7,
                        }}
                    />
                    <motion.circle
                        cx="24"
                        cy="24"
                        r="1.5"
                        fill="url(#gradient3)"
                        animate={{
                            opacity: [0, 1, 0],
                            scale: [0.5, 1, 0.5],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            delay: 1.4,
                        }}
                    />

                    {/* Gradient definitions */}
                    <defs>
                        <linearGradient id="gradient1" x1="0" y1="0" x2="32" y2="32">
                            <stop offset="0%" stopColor="#22d3ee" />
                            <stop offset="50%" stopColor="#3b82f6" />
                            <stop offset="100%" stopColor="#8b5cf6" />
                        </linearGradient>
                        <linearGradient id="gradient2" x1="12" y1="6" x2="20" y2="26">
                            <stop offset="0%" stopColor="#22d3ee" />
                            <stop offset="100%" stopColor="#a78bfa" />
                        </linearGradient>
                        <linearGradient id="gradient3" x1="0" y1="0" x2="32" y2="32">
                            <stop offset="0%" stopColor="#fbbf24" />
                            <stop offset="100%" stopColor="#f59e0b" />
                        </linearGradient>
                    </defs>
                </svg>
            </div>
        </div>
    );
};
