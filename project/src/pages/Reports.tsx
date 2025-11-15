import React from 'react';
import { ExpenseChart } from '../components/ExpenseChart';
import { useExpenses } from '../hooks/useExpenses';
import { startOfMonth, endOfMonth, subMonths, format } from 'date-fns';
import { useCurrency } from '../hooks/useCurrency';
import { useProfile } from '../hooks/useProfile';

export function Reports() {
  const { expenses } = useExpenses();
  const [selectedMonth, setSelectedMonth] = React.useState(new Date());
  const { format: formatMoney } = useCurrency();
  const { profile } = useProfile();

  const monthlyExpenses = expenses.filter(expense => {
    const expenseDate = new Date(expense.date);
    return expenseDate >= startOfMonth(selectedMonth) && 
           expenseDate <= endOfMonth(selectedMonth);
  });

  const monthlyTotal = monthlyExpenses.reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Expense Reports</h2>
        <select
          value={selectedMonth.toISOString()}
          onChange={(e) => setSelectedMonth(new Date(e.target.value))}
          className="rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        >
          {Array.from({ length: 12 }).map((_, i) => {
            const date = subMonths(new Date(), i);
            return (
              <option key={i} value={date.toISOString()}>
                {format(date, 'MMMM yyyy')}
              </option>
            );
          })}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Monthly Overview
          </h3>
          <ExpenseChart expenses={monthlyExpenses} />
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm space-y-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Monthly Statistics
          </h3>
          <dl className="grid grid-cols-1 gap-5">
            <div className="px-4 py-5 bg-gray-50 dark:bg-gray-700 rounded-lg overflow-hidden sm:p-6">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-300 truncate">
                Total Expenses
              </dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">
                {formatMoney(monthlyTotal)}
              </dd>
            </div>
            <div className="px-4 py-5 bg-gray-50 dark:bg-gray-700 rounded-lg overflow-hidden sm:p-6">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-300 truncate">
                Average Daily Spend
              </dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">
                {formatMoney(monthlyTotal / 30)}
              </dd>
            </div>
            <div className="px-4 py-5 bg-gray-50 dark:bg-gray-700 rounded-lg overflow-hidden sm:p-6">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-300 truncate">
                Income Utilization
              </dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">
                {profile.monthlySalary > 0
                  ? `${((monthlyTotal / profile.monthlySalary) * 100).toFixed(1)}%`
                  : '—'}
              </dd>
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                Based on monthly salary of {formatMoney(profile.monthlySalary)}
              </p>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}