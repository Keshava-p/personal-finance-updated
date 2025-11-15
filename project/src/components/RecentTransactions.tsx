import React from 'react';
import { format } from 'date-fns';
import { Expense } from '../types/expense';
import { useCurrency } from '../hooks/useCurrency';
import { motion } from 'framer-motion';

interface RecentTransactionsProps {
  expenses: Expense[];
}

export function RecentTransactions({ expenses }: RecentTransactionsProps) {
  const { format: formatMoney } = useCurrency();

  return (
    <div className="overflow-hidden">
      <div className="px-6 py-4 border-b border-white/20">
        <h3 className="text-xl font-bold text-white">Recent Transactions</h3>
      </div>
      <ul role="list" className="divide-y divide-white/10">
        {expenses.map((expense, idx) => (
          <motion.li
            key={expense.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="px-6 py-4 hover:bg-white/5 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white">{expense.description}</p>
                <p className="text-sm text-white/60">
                  {format(new Date(expense.date), 'MMM d, yyyy')} • {expense.category}
                </p>
              </div>
              <div className="flex items-center">
                <span className={`text-sm font-bold ${
                  expense.amount > 100 ? 'text-red-400' : 'text-green-400'
                }`}>
                  {formatMoney(expense.amount)}
                </span>
              </div>
            </div>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}