import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ExpenseChart } from '../components/ExpenseChart';
import { InsightsPanel } from '../components/InsightsPanel';
import { RecentTransactions } from '../components/RecentTransactions';
import { useExpenses } from '../hooks/useExpenses';
import { useCurrency } from '../hooks/useCurrency';
import { useProfile } from '../hooks/useProfile';
import { MetricsCard } from '../components/ui/MetricsCard';
import { GlassCard } from '../components/ui/GlassCard';
import { InvestmentSuggestion } from '../components/InvestmentSuggestion';
import { SavingsHealthIndicator } from '../components/SavingsHealthIndicator';
import { BillReminder } from '../components/BillReminder';
import { FinancialTips } from '../components/FinancialTips';
import { TrendingUp, TrendingDown, DollarSign, Wallet, Sparkles, ArrowRight } from 'lucide-react';

export function Dashboard() {
  const { t } = useTranslation();
  const { expenses } = useExpenses();
  const { format } = useCurrency();
  const { profile } = useProfile();

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const monthlyExpenses = expenses.filter(
    expense => new Date(expense.date).getMonth() === new Date().getMonth()
  );
  const monthlyTotal = monthlyExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const monthlySalary = profile.monthlySalary || 0;
  const netSavings = monthlySalary - monthlyTotal;
  const savingsRate = monthlySalary > 0 ? (netSavings / monthlySalary) * 100 : 0;

  // Get current time for greeting
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening';

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <GlassCard className="overflow-hidden" noPadding>
          <div className="relative p-8 bg-gradient-to-br from-cyan-500/20 via-blue-500/20 to-violet-500/20">
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-cyan-500/10 to-transparent rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-violet-500/10 to-transparent rounded-full blur-3xl" />

            <div className="relative z-10 flex items-center justify-between">
              <div>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex items-center gap-2 mb-2"
                >
                  <Sparkles className="h-5 w-5 text-cyan-400" />
                  <span className="text-sm font-medium text-cyan-300">{greeting}</span>
                </motion.div>
                <motion.h2
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-4xl font-bold text-white mb-2"
                >
                  Welcome back, {profile.name || 'User'}!
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-white/70"
                >
                  Here's your financial overview for {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </motion.p>
              </div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                className="hidden lg:block"
              >
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-cyan-500/30 to-blue-500/30 border-4 border-white/10 flex items-center justify-center">
                  <Wallet className="h-16 w-16 text-cyan-400" />
                </div>
              </motion.div>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Hero Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricsCard
          title={t('settings.monthlySalary')}
          value={format(monthlySalary)}
          icon={<DollarSign className="h-8 w-8" />}
          gradient="from-emerald-500/20 to-green-500/20"
          animateValue={false}
        />
        <MetricsCard
          title={t('dashboard.totalExpenses')}
          value={format(monthlyTotal)}
          subtitle={`${((monthlyTotal / monthlySalary) * 100 || 0).toFixed(1)}% of income`}
          icon={<Wallet className="h-8 w-8" />}
          gradient="from-orange-500/20 to-red-500/20"
          animateValue={false}
        />
        <MetricsCard
          title={t('dashboard.savings')}
          value={format(netSavings)}
          trend={netSavings >= 0 ? 'up' : 'down'}
          trendValue={`${savingsRate >= 0 ? '+' : ''}${savingsRate.toFixed(1)}%`}
          icon={<TrendingUp className="h-8 w-8" />}
          gradient={netSavings >= 0 ? "from-cyan-500/20 to-blue-500/20" : "from-red-500/20 to-orange-500/20"}
          animateValue={false}
        />
        <MetricsCard
          title="All Time Expenses"
          value={format(totalExpenses)}
          subtitle="Total spending"
          icon={<TrendingDown className="h-8 w-8" />}
          gradient="from-violet-500/20 to-purple-500/20"
          animateValue={false}
        />
      </div>

      {/* New Finance Widgets Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <InvestmentSuggestion />
        <SavingsHealthIndicator />
      </div>

      {/* Charts and Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <GlassCard className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white">Expense Overview</h3>
            <button className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1">
              View Details
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
          <ExpenseChart expenses={expenses} />
        </GlassCard>

        <GlassCard>
          <h3 className="text-xl font-bold text-white mb-6">AI Insights</h3>
          <InsightsPanel expenses={expenses} />
        </GlassCard>
      </div>

      {/* Bill Reminders and Financial Tips */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <BillReminder />
        <FinancialTips />
      </div>

      {/* Recent Transactions */}
      <GlassCard>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">Recent Transactions</h3>
          <button className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1">
            View All
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
        <RecentTransactions expenses={expenses.slice(0, 5)} />
      </GlassCard>
    </div>
  );
}