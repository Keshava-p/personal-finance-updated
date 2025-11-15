import React from 'react';
import { AlertTriangle, TrendingUp, Info, Sparkles } from 'lucide-react';
import { Expense } from '../types/expense';
import { generateExpenseInsights, ExpenseInsight } from '../services/aiService';
import { useCurrency } from '../hooks/useCurrency';
import { GlassCard } from './ui/GlassCard';
import { motion } from 'framer-motion';

interface InsightsPanelProps {
  expenses: Expense[];
}

export function InsightsPanel({ expenses }: InsightsPanelProps) {
  const [insights, setInsights] = React.useState<ExpenseInsight[]>([]);
  const [loading, setLoading] = React.useState(true);
  const { currency } = useCurrency();

  React.useEffect(() => {
    async function fetchInsights() {
      setLoading(true);
      const newInsights = await generateExpenseInsights(expenses, currency);
      setInsights(newInsights);
      setLoading(false);
    }

    fetchInsights();
  }, [expenses, currency]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'alert':
        return <AlertTriangle className="h-5 w-5 text-red-400" />;
      case 'warning':
        return <TrendingUp className="h-5 w-5 text-yellow-400" />;
      default:
        return <Info className="h-5 w-5 text-cyan-400" />;
    }
  };

  if (loading) {
    return (
      <GlassCard className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <Sparkles className="h-6 w-6 text-cyan-400" />
          <h2 className="text-xl font-bold text-white">AI-Powered Insights</h2>
        </div>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-cyan-400 border-t-transparent"></div>
        </div>
      </GlassCard>
    );
  }

  return (
    <GlassCard className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <Sparkles className="h-6 w-6 text-cyan-400" />
        <h2 className="text-xl font-bold text-white">AI-Powered Insights</h2>
      </div>
      <div className="space-y-3">
        {insights.map((insight, idx) => (
          <motion.div
            key={insight.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className={`flex items-start gap-3 p-4 rounded-xl border ${
              insight.type === 'alert'
                ? 'bg-red-500/10 border-red-400/30'
                : insight.type === 'warning'
                ? 'bg-yellow-500/10 border-yellow-400/30'
                : 'bg-cyan-500/10 border-cyan-400/30'
            }`}
          >
            {getIcon(insight.type)}
            <div className="flex-1">
              <p className={`text-sm ${
                insight.type === 'alert'
                  ? 'text-red-300'
                  : insight.type === 'warning'
                  ? 'text-yellow-300'
                  : 'text-cyan-300'
              }`}>
                {insight.message}
              </p>
            </div>
          </motion.div>
        ))}
        {insights.length === 0 && (
          <p className="text-sm text-white/60 text-center py-4">
            No insights available at the moment
          </p>
        )}
      </div>
    </GlassCard>
  );
}