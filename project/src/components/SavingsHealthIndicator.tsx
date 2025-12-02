import { motion } from 'framer-motion';
import { Activity, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { GlassCard } from './ui/GlassCard';
import { useProfile } from '../hooks/useProfile';
import { useExpenses } from '../hooks/useExpenses';
import { useCurrency } from '../hooks/useCurrency';

export function SavingsHealthIndicator() {
    const { profile } = useProfile();
    const { expenses } = useExpenses();
    const { format } = useCurrency();

    const monthlySalary = profile.monthlySalary || 0;
    const monthlyExpenses = expenses
        .filter(expense => new Date(expense.date).getMonth() === new Date().getMonth())
        .reduce((sum, expense) => sum + expense.amount, 0);

    const totalSavings = monthlySalary - monthlyExpenses;
    const savingsRate = monthlySalary > 0 ? (totalSavings / monthlySalary) * 100 : 0;

    // Determine health status
    let healthStatus = 'Poor';
    let healthColor = 'red';
    let healthGradient = 'from-red-500/20 to-pink-500/20';
    let borderColor = 'border-red-400/30';
    let progressColor = 'bg-red-400';
    let icon = <TrendingDown className="h-6 w-6 text-red-400" />;

    if (savingsRate > 30) {
        healthStatus = 'Healthy';
        healthColor = 'green';
        healthGradient = 'from-green-500/20 to-emerald-500/20';
        borderColor = 'border-green-400/30';
        progressColor = 'bg-green-400';
        icon = <TrendingUp className="h-6 w-6 text-green-400" />;
    } else if (savingsRate >= 15) {
        healthStatus = 'Moderate';
        healthColor = 'yellow';
        healthGradient = 'from-yellow-500/20 to-orange-500/20';
        borderColor = 'border-yellow-400/30';
        progressColor = 'bg-yellow-400';
        icon = <Minus className="h-6 w-6 text-yellow-400" />;
    }

    const displayPercentage = Math.min(100, Math.max(0, savingsRate));

    return (
        <GlassCard className="p-6">
            <div className="flex items-center gap-3 mb-4">
                <div className={`p-2 rounded-lg bg-gradient-to-br ${healthGradient} border ${borderColor}`}>
                    <Activity className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white">Savings Health</h3>
            </div>

            {monthlySalary > 0 ? (
                <div className="space-y-4">
                    {/* Status Badge */}
                    <div className={`p-4 rounded-xl bg-gradient-to-br ${healthGradient} border ${borderColor}`}>
                        <div className="flex items-center justify-between mb-3">
                            <div>
                                <p className="text-sm text-white/60 mb-1">Current Status</p>
                                <div className="flex items-center gap-2">
                                    {icon}
                                    <span className="text-2xl font-bold text-white">{healthStatus}</span>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-white/60 mb-1">Savings Rate</p>
                                <p className="text-2xl font-bold text-white">{savingsRate.toFixed(1)}%</p>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${displayPercentage}%` }}
                                transition={{ duration: 1, ease: 'easeOut' }}
                                className={`h-full ${progressColor} relative`}
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
                            </motion.div>
                        </div>
                    </div>

                    {/* Savings Breakdown */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                            <p className="text-xs text-white/60 mb-1">Monthly Income</p>
                            <p className="text-lg font-semibold text-white">{format(monthlySalary)}</p>
                        </div>
                        <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                            <p className="text-xs text-white/60 mb-1">Total Savings</p>
                            <p className="text-lg font-semibold text-white">{format(totalSavings)}</p>
                        </div>
                    </div>

                    {/* Health Tips */}
                    <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-400/20">
                        <p className="text-xs font-medium text-blue-400 mb-1">💡 Tip</p>
                        <p className="text-xs text-white/70">
                            {savingsRate > 30 && "Excellent! You're saving over 30% of your income. Keep it up!"}
                            {savingsRate >= 15 && savingsRate <= 30 && "Good progress! Try to increase savings to 30% for better financial health."}
                            {savingsRate < 15 && "Consider reducing expenses or increasing income to improve your savings rate."}
                        </p>
                    </div>

                    {/* Benchmarks */}
                    <div className="flex items-center justify-between text-xs text-white/40">
                        <span>Poor (&lt;15%)</span>
                        <span>Moderate (15-30%)</span>
                        <span>Healthy (&gt;30%)</span>
                    </div>
                </div>
            ) : (
                <div className="text-center py-8">
                    <Activity className="h-12 w-12 text-cyan-400 mx-auto mb-3" />
                    <p className="text-white/60">Set your monthly salary in Settings to track savings health</p>
                </div>
            )}
        </GlassCard>
    );
}
