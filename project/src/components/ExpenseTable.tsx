import React from 'react';
import { format } from 'date-fns';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  SortingState,
} from '@tanstack/react-table';
import { Expense } from '../types/expense';
import { ArrowUpDown, Trash2 } from 'lucide-react';
import { useCurrency } from '../hooks/useCurrency';

interface ExpenseTableProps {
  expenses: Expense[];
  onDelete: (id: string) => void;
}

export function ExpenseTable({ expenses, onDelete }: ExpenseTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const columnHelper = createColumnHelper<Expense>();
  const { format: formatMoney } = useCurrency();

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      onDelete(id);
    }
  };

  const columns = [
    columnHelper.accessor('date', {
      header: ({ column }) => (
        <button
          className="flex items-center text-gray-900 dark:text-white font-semibold hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </button>
      ),
      cell: info => (
        <span className="text-gray-900 dark:text-white font-medium">
          {format(new Date(info.getValue()), 'MMM d, yyyy')}
        </span>
      ),
    }),
    columnHelper.accessor('description', {
      header: () => (
        <span className="text-gray-900 dark:text-white font-semibold">Description</span>
      ),
      cell: info => (
        <span className="text-gray-900 dark:text-white">{info.getValue()}</span>
      ),
    }),
    columnHelper.accessor('category', {
      header: () => (
        <span className="text-gray-900 dark:text-white font-semibold">Category</span>
      ),
      cell: info => (
        <span className="capitalize text-gray-900 dark:text-white bg-cyan-100 dark:bg-cyan-900/30 px-3 py-1 rounded-full text-sm">
          {info.getValue()}
        </span>
      ),
    }),
    columnHelper.accessor('amount', {
      header: ({ column }) => (
        <button
          className="flex items-center text-gray-900 dark:text-white font-semibold hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Amount
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </button>
      ),
      cell: info => (
        <span className={`font-semibold ${info.getValue() > 100 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
          {formatMoney(info.getValue())}
        </span>
      ),
    }),
    columnHelper.display({
      id: 'actions',
      header: () => (
        <span className="text-gray-900 dark:text-white font-semibold">Actions</span>
      ),
      cell: info => (
        <button
          onClick={() => handleDelete(info.row.original.id)}
          className="inline-flex items-center px-3 py-1.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 rounded-lg transition-colors font-medium"
          title="Delete expense"
        >
          <Trash2 className="h-4 w-4 mr-1" />
          Delete
        </button>
      ),
    }),
  ];

  const table = useReactTable({
    data: expenses,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  if (expenses.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400 text-lg">
          No expenses yet. Add your first expense to get started!
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-100 dark:bg-gray-700/50">
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th
                  key={header.id}
                  className="px-6 py-4 text-left text-xs uppercase tracking-wider"
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="bg-white dark:bg-gray-800/50 divide-y divide-gray-200 dark:divide-gray-700">
          {table.getRowModel().rows.map(row => (
            <tr key={row.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
              {row.getVisibleCells().map(cell => (
                <td
                  key={cell.id}
                  className="px-6 py-4 whitespace-nowrap text-sm"
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}