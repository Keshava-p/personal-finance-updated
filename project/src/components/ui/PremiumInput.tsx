import React, { useState, forwardRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, AlertCircle, Check } from 'lucide-react';

interface PremiumInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helperText?: string;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    success?: boolean;
    variant?: 'default' | 'filled' | 'outlined';
}

export const PremiumInput = forwardRef<HTMLInputElement, PremiumInputProps>(
    (
        {
            label,
            error,
            helperText,
            leftIcon,
            rightIcon,
            success,
            variant = 'default',
            type = 'text',
            className = '',
            ...props
        },
        ref
    ) => {
        const [isFocused, setIsFocused] = useState(false);
        const [showPassword, setShowPassword] = useState(false);
        const isPassword = type === 'password';

        const variantClasses = {
            default: 'bg-white/5 border-white/20 hover:bg-white/8',
            filled: 'bg-white/10 border-transparent hover:bg-white/15',
            outlined: 'bg-transparent border-white/30 hover:border-white/40',
        };

        const focusClasses = error
            ? 'ring-2 ring-red-400/50 border-red-400/50'
            : success
                ? 'ring-2 ring-emerald-400/50 border-emerald-400/50'
                : 'ring-2 ring-cyan-400/50 border-cyan-400/50';

        return (
            <div className="w-full">
                {/* Label */}
                {label && (
                    <motion.label
                        initial={false}
                        animate={{
                            color: isFocused
                                ? error
                                    ? 'rgb(248 113 113)'
                                    : success
                                        ? 'rgb(52 211 153)'
                                        : 'rgb(34 211 238)'
                                : 'rgba(255, 255, 255, 0.7)',
                        }}
                        className="block text-sm font-medium mb-2 transition-colors"
                    >
                        {label}
                    </motion.label>
                )}

                {/* Input Container */}
                <div className="relative">
                    {/* Left Icon */}
                    {leftIcon && (
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <div className="text-white/40">{leftIcon}</div>
                        </div>
                    )}

                    {/* Input Field */}
                    <input
                        ref={ref}
                        type={isPassword && showPassword ? 'text' : type}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        className={`
              w-full px-4 py-3 rounded-xl
              ${leftIcon ? 'pl-10' : ''}
              ${rightIcon || isPassword ? 'pr-10' : ''}
              ${variantClasses[variant]}
              backdrop-blur-sm border
              text-white placeholder-white/40
              transition-all duration-200
              focus:outline-none
              ${isFocused ? focusClasses : ''}
              ${error ? 'border-red-400/50' : success ? 'border-emerald-400/50' : ''}
              disabled:opacity-50 disabled:cursor-not-allowed
              ${className}
            `}
                        {...props}
                    />

                    {/* Right Icon / Password Toggle / Status Icons */}
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center gap-2">
                        {success && !error && (
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="text-emerald-400"
                            >
                                <Check className="h-5 w-5" />
                            </motion.div>
                        )}

                        {error && (
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="text-red-400"
                            >
                                <AlertCircle className="h-5 w-5" />
                            </motion.div>
                        )}

                        {isPassword && (
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="text-white/40 hover:text-white/70 transition-colors"
                                tabIndex={-1}
                            >
                                {showPassword ? (
                                    <EyeOff className="h-5 w-5" />
                                ) : (
                                    <Eye className="h-5 w-5" />
                                )}
                            </button>
                        )}

                        {rightIcon && !isPassword && !error && !success && (
                            <div className="text-white/40">{rightIcon}</div>
                        )}
                    </div>
                </div>

                {/* Helper Text / Error Message */}
                <AnimatePresence mode="wait">
                    {(error || helperText) && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className={`mt-2 text-sm flex items-start gap-1 ${error ? 'text-red-400' : 'text-white/60'
                                }`}
                        >
                            {error && <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />}
                            <span>{error || helperText}</span>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        );
    }
);

PremiumInput.displayName = 'PremiumInput';
