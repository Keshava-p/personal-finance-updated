import React, { useMemo } from 'react';
import type { TooltipItem } from 'chart.js';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { Expense } from '../types/expense';
import { useCurrency } from '../hooks/useCurrency';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface ExpenseChartProps {
  expenses: Expense[];
}

export function ExpenseChart({ expenses }: ExpenseChartProps) {
  const { format, currency } = useCurrency();
  const categoryTotals = useMemo(() => {
    return expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
    }, {} as Record<string, number>);
  }, [expenses]);

  const data = useMemo(() => ({
    labels: Object.keys(categoryTotals),
    datasets: [
      {
        label: `Expenses (${currency})`,
        data: Object.values(categoryTotals),
        backgroundColor: [
          'rgba(6, 182, 212, 0.6)',
          'rgba(59, 130, 246, 0.6)',
          'rgba(139, 92, 246, 0.6)',
          'rgba(236, 72, 153, 0.6)',
          'rgba(251, 146, 60, 0.6)',
        ],
        borderColor: [
          'rgba(6, 182, 212, 1)',
          'rgba(59, 130, 246, 1)',
          'rgba(139, 92, 246, 1)',
          'rgba(236, 72, 153, 1)',
          'rgba(251, 146, 60, 1)',
        ],
        borderWidth: 1,
      },
    ],
  }), [categoryTotals, currency]);

  const options = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: 'rgba(255, 255, 255, 0.8)',
        },
      },
      title: {
        display: true,
        text: 'Expenses by Category',
        color: 'rgba(255, 255, 255, 0.9)',
        font: {
          size: 18,
          weight: 'bold',
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'rgba(255, 255, 255, 0.9)',
        bodyColor: 'rgba(255, 255, 255, 0.8)',
        callbacks: {
          label: (context: TooltipItem<'bar'>) => {
            const label = context.dataset.label ?? '';
            const value = context.parsed.y ?? 0;
            return `${label}: ${format(value)}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: 'rgba(255, 255, 255, 0.6)',
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
      },
      x: {
        ticks: {
          color: 'rgba(255, 255, 255, 0.6)',
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
      },
    },
  }), [format]);

  return (
    <div className="h-80">
      <Bar data={data} options={options} />
    </div>
  );
}