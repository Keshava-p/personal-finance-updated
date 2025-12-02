import React from 'react';
import { useTranslation } from 'react-i18next';
import { ExpenseForm } from '../components/ExpenseForm';
import { ExpenseTable } from '../components/ExpenseTable';
import { useExpenses } from '../hooks/useExpenses';
import { Plus } from 'lucide-react';

export function Expenses() {
  const { t } = useTranslation();
  const { expenses, addExpense, deleteExpense } = useExpenses();
  const [showForm, setShowForm] = React.useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">{t('expenses.title')}</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transition-all"
        >
          <Plus className="h-4 w-4 mr-2" />
          {t('expenses.addExpense')}
        </button>
      </div>

      {showForm && (
        <div className="bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <ExpenseForm onSubmit={(data) => {
            addExpense(data);
            setShowForm(false);
          }} />
        </div>
      )}

      <div className="bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
        <ExpenseTable expenses={expenses} onDelete={deleteExpense} />
      </div>
    </div>
  );
}