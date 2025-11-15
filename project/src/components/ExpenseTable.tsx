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

  const columns = [
    columnHelper.accessor('date', {
      header: ({ column }) => (
        <button
          className="flex items-center"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </button>
      ),
      cell: info => format(new Date(info.getValue()), 'MMM d, yyyy'),
    }),
    columnHelper.accessor('description', {
      header: 'Description',
    }),
    columnHelper.accessor('category', {
      header: 'Category',
      cell: info => (
        <span className="capitalize">{info.getValue()}</span>
      ),
    }),
    columnHelper.accessor('amount', {
      header: ({ column }) => (
        <button
          className="flex items-center"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Amount
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </button>
      ),
      cell: info => (
        <span className={info.getValue() > 100 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}>
          {formatMoney(info.getValue())}
        </span>
      ),
    }),
    columnHelper.display({
      id: 'actions',
      cell: info => (
        <button
          onClick={() => onDelete(info.row.original.id)}
          className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
        >
          <Trash2 className="h-4 w-4" />
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

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-700">
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th
                  key={header.id}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
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
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          {table.getRowModel().rows.map(row => (
            <tr key={row.id}>
              {row.getVisibleCells().map(cell => (
                <td
                  key={cell.id}
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100"
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