import React, { useMemo } from 'react';
import { useExpenses } from '../hooks/useExpenses';
import { startOfMonth, endOfMonth } from 'date-fns';
import { useProfile } from '../hooks/useProfile';
import { useCurrency } from '../hooks/useCurrency';

const BUDGET_ALLOCATION: Record<string, number> = {
  food: 0.25,
  transport: 0.15,
  entertainment: 0.1,
  utilities: 0.25,
  shopping: 0.25,
};

export function Budget() {
  const { expenses } = useExpenses();
  const { profile } = useProfile();
  const { format } = useCurrency();

  const budgets = useMemo(() => {
    const salary = profile.monthlySalary || 0;
    const calculated: Record<string, number> = {};
    Object.entries(BUDGET_ALLOCATION).forEach(([category, ratio]) => {
      calculated[category] = salary * ratio;
    });
    return calculated;
  }, [profile.monthlySalary]);

  const currentMonthExpenses = expenses.filter(expense => {
    const expenseDate = new Date(expense.date);
    return expenseDate >= startOfMonth(new Date()) && 
           expenseDate <= endOfMonth(new Date());
  });

  const categoryTotals = currentMonthExpenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Monthly Budget</h2>
      </div>

      <div className="grid gap-6">
        {Object.entries(budgets).map(([category, budget]) => {
          const spent = categoryTotals[category] || 0;
          const percentage = budget > 0 ? (spent / budget) * 100 : 0;

          return (
            <div key={category} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-medium capitalize text-gray-900 dark:text-white">
                  {category}
                </h3>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {format(spent)} / {format(budget)}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                <div
                  className={`h-2.5 rounded-full ${
                    percentage > 90 ? 'bg-red-600' :
                    percentage > 75 ? 'bg-yellow-400' :
                    'bg-green-600'
                  }`}
                  style={{ width: `${Math.min(percentage, 100)}%` }}
                ></div>
              </div>
              <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                {percentage > 100 ? (
                  <span className="text-red-600 dark:text-red-400">
                    Over budget by {format(spent - budget)}
                  </span>
                ) : (
                  <span>
                    {format(budget - spent)} remaining
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}