import { motion } from 'framer-motion';
import { TrendingUp, Target, AlertTriangle, DollarSign } from 'lucide-react';
import { GlassCard } from './ui/GlassCard';
import { useProfile } from '../hooks/useProfile';
import { useExpenses } from '../hooks/useExpenses';
import { useCurrency } from '../hooks/useCurrency';

export function InvestmentSuggestion() {
    const { profile } = useProfile();
    const { expenses } = useExpenses();
    const { format } = useCurrency();

    const monthlySalary = profile.monthlySalary || 0;
    const monthlyExpenses = expenses
        .filter(expense => new Date(expense.date).getMonth() === new Date().getMonth())
        .reduce((sum, expense) => sum + expense.amount, 0);

    const netSavings = monthlySalary - monthlyExpenses;
    const savingsRate = monthlySalary > 0 ? (netSavings / monthlySalary) * 100 : 0;

    // Calculate suggested SIP (20% of net savings)
    const suggestedSIP = netSavings > 0 ? netSavings * 0.2 : 0;

    // Determine investment horizon
    const investmentHorizon = savingsRate > 30 ? 'Long-term (5+ years)' : 'Short-term (1-3 years)';

    // Calculate risk score (0-10)
    const riskScore = Math.min(10, Math.max(0, Math.round(savingsRate / 10)));

    // Determine risk level and color
    let riskLevel = 'High Risk';
    let riskColor = 'red';
    if (riskScore >= 7) {
        riskLevel = 'Low Risk';
        riskColor = 'green';
    } else if (riskScore >= 4) {
        riskLevel = 'Moderate Risk';
        riskColor = 'yellow';
    }

    const getRiskGradient = () => {
        if (riskColor === 'green') return 'from-green-500/20 to-emerald-500/20 border-green-400/30';
        if (riskColor === 'yellow') return 'from-yellow-500/20 to-orange-500/20 border-yellow-400/30';
        return 'from-red-500/20 to-pink-500/20 border-red-400/30';
    };

    const getRiskIcon = () => {
        if (riskColor === 'green') return <Target className="h-5 w-5 text-green-400" />;
        if (riskColor === 'yellow') return <TrendingUp className="h-5 w-5 text-yellow-400" />;
        return <AlertTriangle className="h-5 w-5 text-red-400" />;
    };

    return (
        <GlassCard className="p-6">
            <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-400/30">
                    <TrendingUp className="h-5 w-5 text-purple-400" />
                </div>
                <h3 className="text-lg font-semibold text-white">Investment Suggestion</h3>
            </div>

            {monthlySalary > 0 ? (
                <div className="space-y-4">
                    {/* SIP Suggestion */}
                    <div className="p-4 rounded-xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-400/20">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-white/60">Suggested SIP Amount</span>
                            <DollarSign className="h-4 w-4 text-cyan-400" />
                        </div>
                        <p className="text-2xl font-bold text-white">{format(suggestedSIP)}</p>
                        <p className="text-xs text-white/40 mt-1">20% of monthly savings</p>
                    </div>

                    {/* Investment Horizon */}
                    <div className="p-4 rounded-xl bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border border-blue-400/20">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-white/60">Recommended Horizon</span>
                            <Target className="h-4 w-4 text-blue-400" />
                        </div>
                        <p className="text-lg font-semibold text-white">{investmentHorizon}</p>
                        <p className="text-xs text-white/40 mt-1">
                            {savingsRate > 30 ? 'Strong savings rate supports long-term growth' : 'Build emergency fund first'}
                        </p>
                    </div>

                    {/* Risk Score */}
                    <div className={`p-4 rounded-xl bg-gradient-to-br ${getRiskGradient()} border`}>
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-white/60">Risk Profile</span>
                            {getRiskIcon()}
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-lg font-semibold text-white">{riskLevel}</span>
                                    <span className="text-sm text-white/60">({riskScore}/10)</span>
                                </div>
                                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${riskScore * 10}%` }}
                                        transition={{ duration: 1, ease: 'easeOut' }}
                                        className={`h-full ${riskColor === 'green' ? 'bg-green-400' :
                                                riskColor === 'yellow' ? 'bg-yellow-400' : 'bg-red-400'
                                            }`}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Disclaimer */}
                    <p className="text-xs text-white/40 text-center mt-4">
                        These are suggestions based on your savings. Consult a financial advisor before investing.
                    </p>
                </div>
            ) : (
                <div className="text-center py-8">
                    <AlertTriangle className="h-12 w-12 text-yellow-400 mx-auto mb-3" />
                    <p className="text-white/60">Set your monthly salary in Settings to get investment suggestions</p>
                </div>
            )}
        </GlassCard>
    );
}
