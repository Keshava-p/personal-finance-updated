import React from 'react';
import { ExpenseChart } from '../components/ExpenseChart';
import { InsightsPanel } from '../components/InsightsPanel';
import { RecentTransactions } from '../components/RecentTransactions';
import { useExpenses } from '../hooks/useExpenses';
import { useCurrency } from '../hooks/useCurrency';
import { useProfile } from '../hooks/useProfile';
import { MetricsCard } from '../components/ui/MetricsCard';
import { GlassCard } from '../components/ui/GlassCard';
import { TrendingUp, TrendingDown, DollarSign, Wallet } from 'lucide-react';

export function Dashboard() {
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

  return (
    <div className="space-y-6">
      {/* Hero Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricsCard
          title="Monthly Salary"
          value={format(monthlySalary)}
          icon={<DollarSign className="h-8 w-8" />}
          gradient="from-green-500/20 to-emerald-500/20"
        />
        <MetricsCard
          title="Monthly Expenses"
          value={format(monthlyTotal)}
          subtitle={`${((monthlyTotal / monthlySalary) * 100).toFixed(1)}% of income`}
          icon={<Wallet className="h-8 w-8" />}
          gradient="from-orange-500/20 to-red-500/20"
        />
        <MetricsCard
          title="Net Savings"
          value={format(netSavings)}
          trend={netSavings >= 0 ? 'up' : 'down'}
          trendValue={`${savingsRate >= 0 ? '+' : ''}${savingsRate.toFixed(1)}%`}
          icon={<TrendingUp className="h-8 w-8" />}
          gradient={netSavings >= 0 ? "from-cyan-500/20 to-blue-500/20" : "from-red-500/20 to-orange-500/20"}
        />
        <MetricsCard
          title="Total Expenses"
          value={format(totalExpenses)}
          subtitle="All time"
          icon={<TrendingDown className="h-8 w-8" />}
          gradient="from-purple-500/20 to-pink-500/20"
        />
      </div>

      {/* Charts and Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <GlassCard className="lg:col-span-2 p-6">
          <ExpenseChart expenses={expenses} />
        </GlassCard>
        <GlassCard className="p-6">
          <InsightsPanel expenses={expenses} />
        </GlassCard>
      </div>

      {/* Recent Transactions */}
      <GlassCard className="p-6">
        <RecentTransactions expenses={expenses.slice(0, 5)} />
      </GlassCard>
    </div>
  );
}