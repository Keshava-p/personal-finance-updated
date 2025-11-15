import React from 'react';
import { format } from 'date-fns';
import { Trash2 } from 'lucide-react';
import { Expense } from '../types/expense';
import { useCurrency } from '../hooks/useCurrency';

interface ExpenseListProps {
  expenses: Expense[];
  onDelete: (id: string) => void;
}

export function ExpenseList({ expenses, onDelete }: ExpenseListProps) {
  const { format: formatMoney } = useCurrency();

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="flow-root">
        <ul role="list" className="divide-y divide-gray-200">
          {expenses.map((expense) => (
            <li key={expense.id} className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">{expense.description}</p>
                  <p className="text-sm text-gray-500">
                    {format(new Date(expense.date), 'MMM d, yyyy')} • {expense.category}
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-sm font-medium text-gray-900">
                  {formatMoney(expense.amount)}
                  </span>
                  <button
                    onClick={() => onDelete(expense.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}