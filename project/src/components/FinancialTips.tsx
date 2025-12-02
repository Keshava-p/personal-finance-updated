import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, RefreshCw } from 'lucide-react';
import { GlassCard } from './ui/GlassCard';

const financialTips = [
    "Save at least 20% of your income every month.",
    "Avoid increasing expenses when income increases - save the difference instead.",
    "Start an emergency fund equal to 3–6 months of expenses.",
    "Pay yourself first - automate your savings before spending.",
    "Track every expense to understand where your money goes.",
    "Avoid high-interest debt like credit cards whenever possible.",
    "Invest early to benefit from compound interest over time.",
    "Review and adjust your budget monthly to stay on track.",
    "Don't keep all your eggs in one basket - diversify investments.",
    "Set clear financial goals and create a plan to achieve them.",
    "Cook at home more often to reduce food expenses significantly.",
    "Use the 50/30/20 rule: 50% needs, 30% wants, 20% savings.",
    "Negotiate bills and subscriptions to lower monthly costs.",
    "Build good credit by paying bills on time consistently.",
    "Avoid lifestyle inflation - maintain your standard of living as income grows.",
];

export function FinancialTips() {
    const [currentTip, setCurrentTip] = useState('');
    const [isRefreshing, setIsRefreshing] = useState(false);

    const getRandomTip = () => {
        const randomIndex = Math.floor(Math.random() * financialTips.length);
        return financialTips[randomIndex];
    };

    const refreshTip = () => {
        setIsRefreshing(true);
        setTimeout(() => {
            setCurrentTip(getRandomTip());
            setIsRefreshing(false);
        }, 300);
    };

    useEffect(() => {
        setCurrentTip(getRandomTip());
    }, []);

    return (
        <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-400/30">
                        <Lightbulb className="h-5 w-5 text-yellow-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-white">Daily Financial Tip</h3>
                </div>
                <button
                    onClick={refreshTip}
                    disabled={isRefreshing}
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/20 transition-all duration-200 disabled:opacity-50"
                    aria-label="Refresh tip"
                >
                    <RefreshCw className={`h-4 w-4 text-cyan-400 ${isRefreshing ? 'animate-spin' : ''}`} />
                </button>
            </div>

            <motion.div
                key={currentTip}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="p-4 rounded-xl bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-400/20"
            >
                <p className="text-white/90 leading-relaxed">{currentTip}</p>
            </motion.div>

            <div className="mt-4 text-xs text-white/40 text-center">
                Tip {financialTips.indexOf(currentTip) + 1} of {financialTips.length}
            </div>
        </GlassCard>
    );
}
