import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format } from 'date-fns';
import { Expense } from '../types/expense';
import { formatCurrency } from '../utils/currency';

function getCurrencyPreference() {
  try {
    const stored = localStorage.getItem('pfm_profile');
    if (!stored) return 'INR';
    const parsed = JSON.parse(stored);
    return parsed.currencyPreference || 'INR';
  } catch (error) {
    console.error('Failed to resolve currency preference for export', error);
    return 'INR';
  }
}

export function exportToPDF(expenses: Expense[]) {
  const doc = new jsPDF();

  // Add title
  doc.setFontSize(20);
  doc.text('Expense Report', 14, 22);
  doc.setFontSize(12);
  doc.text(`Generated on ${format(new Date(), 'MMMM d, yyyy')}`, 14, 32);

  // Add summary
  const currency = getCurrencyPreference();
  const total = expenses.reduce((sum, e) => sum + e.amount, 0);
  doc.text(`Total Expenses: ${formatCurrency(total, currency)}`, 14, 42);

  // Create table
  const tableData = expenses.map(expense => [
    format(new Date(expense.date), 'MMM d, yyyy'),
    expense.description,
    expense.category,
    formatCurrency(expense.amount, currency)
  ]);

  autoTable(doc, {
    head: [['Date', 'Description', 'Category', 'Amount']],
    body: tableData,
    startY: 50,
    theme: 'striped',
    headStyles: { fillColor: [63, 81, 181] }
  });

  // Save the PDF
  doc.save('expense-report.pdf');
}

export function exportToCSV(expenses: Expense[]) {
  const headers = ['Date', 'Description', 'Category', 'Amount', 'Currency'];
  const currency = getCurrencyPreference();
  const csvData = expenses.map(expense => [
    format(new Date(expense.date), 'yyyy-MM-dd'),
    expense.description,
    expense.category,
    expense.amount.toFixed(2),
    currency
  ]);

  const csvContent = [
    headers.join(','),
    ...csvData.map(row => row.join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'expense-data.csv';
  link.click();
}

export function backupData() {
  const data = {
    expenses: JSON.parse(localStorage.getItem('expenses') || '[]'),
    goals: JSON.parse(localStorage.getItem('goals') || '[]'),
    settings: {
      notifications: localStorage.getItem('notificationsEnabled'),
      theme: localStorage.getItem('theme'),
    }
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `expense-tracker-backup-${format(new Date(), 'yyyy-MM-dd')}.json`;
  link.click();
}

export function restoreData(file: File): Promise<void> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        
        if (data.expenses) localStorage.setItem('expenses', JSON.stringify(data.expenses));
        if (data.goals) localStorage.setItem('goals', JSON.stringify(data.goals));
        if (data.settings) {
          if (data.settings.notifications) {
            localStorage.setItem('notificationsEnabled', data.settings.notifications);
          }
          if (data.settings.theme) {
            localStorage.setItem('theme', data.settings.theme);
          }
        }
        
        resolve();
    } catch {
        reject(new Error('Invalid backup file'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}