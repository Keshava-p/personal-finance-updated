import React from 'react';
import { ExpenseForm } from '../components/ExpenseForm';
import { ExpenseTable } from '../components/ExpenseTable';
import { useExpenses } from '../hooks/useExpenses';
import { Plus } from 'lucide-react';

export function Expenses() {
  const { expenses, addExpense, deleteExpense } = useExpenses();
  const [showForm, setShowForm] = React.useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Manage Expenses</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Expense
        </button>
      </div>

      {showForm && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <ExpenseForm onSubmit={(data) => {
            addExpense(data);
            setShowForm(false);
          }} />
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <ExpenseTable expenses={expenses} onDelete={deleteExpense} />
      </div>
    </div>
  );
}