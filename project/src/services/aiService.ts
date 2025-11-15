import axios from 'axios';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Expense } from '../types/expense';
import { startOfMonth, endOfMonth, format } from 'date-fns';
import { formatCurrency } from '../utils/currency';

const AI_KEY_STORAGE = 'pfm_ai_key';

export interface ExpenseInsight {
  id: string;
  type: 'info' | 'warning' | 'alert';
  message: string;
  priority: number;
}

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export interface AIInsightResponse {
  summary: string;
  actions: Array<{ title: string; description: string; priority: number }>;
  confidence: number;
}

export async function generateExpenseInsights(expenses: Expense[], currency = 'INR'): Promise<ExpenseInsight[]> {
  try {
    // Try backend API first
    const userId = localStorage.getItem('pfm_user_id') || 'test@example.com';
    const response = await axios.post(`${API_BASE}/ai/insights`, {
      userId,
      context: { expenses, currency },
    }, {
      headers: { 'x-user-id': userId },
    });

    if (response.data && response.data.actions) {
      return response.data.actions.map((action: any, idx: number) => ({
        id: crypto.randomUUID(),
        type: action.priority === 1 ? 'alert' : action.priority === 2 ? 'warning' : 'info',
        message: `${action.title}: ${action.description}`,
        priority: action.priority,
      }));
    }
  } catch (backendError) {
    console.log('Backend AI service unavailable, falling back to client-side');
  }

  // Fallback to client-side (if backend fails)
  try {
    const apiKey = localStorage.getItem(AI_KEY_STORAGE);
    if (!apiKey) {
      return [
        {
          id: crypto.randomUUID(),
          type: 'warning',
          message: 'AI insights are disabled. Add your API key in Settings → AI Services to enable them.',
          priority: 2,
        },
      ];
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const currentMonthExpenses = expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate >= startOfMonth(new Date()) && 
             expenseDate <= endOfMonth(new Date());
    });

    const expenseData = {
      total: expenses.reduce((sum, e) => sum + e.amount, 0),
      monthlyTotal: currentMonthExpenses.reduce((sum, e) => sum + e.amount, 0),
      categories: Object.entries(
        expenses.reduce((acc, e) => {
          acc[e.category] = (acc[e.category] || 0) + e.amount;
          return acc;
        }, {} as Record<string, number>)
      ),
      month: format(new Date(), 'MMMM yyyy'),
    };

    const prompt = `
      Analyze this expense data and provide 3-4 meaningful insights:
      Total Expenses: ${formatCurrency(expenseData.total, currency)}
      Monthly Expenses (${expenseData.month}): ${formatCurrency(expenseData.monthlyTotal, currency)}
      Category Breakdown:
      ${expenseData.categories.map(([cat, amount]) => `${cat}: ${formatCurrency(amount, currency)}`).join('\n')}

      Please provide insights about:
      1. Spending patterns and trends
      2. Category-specific observations
      3. Potential areas for savings
      4. Unusual spending patterns if any

      Format each insight as a JSON object with:
      - type: "info", "warning", or "alert"
      - message: the insight message
      - priority: 1-3 (1 being highest)
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const parsed = JSON.parse(response.text() || '[]');

    const insights = Array.isArray(parsed) ? parsed : [];

    return insights
      .map((insight) => ({
        id: crypto.randomUUID(),
        type: insight.type as ExpenseInsight['type'],
        message: insight.message as string,
        priority: Number(insight.priority ?? 3),
      }))
      .filter((insight) => insight.message);
  } catch (error) {
    console.error('Error generating insights:', error);
    return [
      {
        id: crypto.randomUUID(),
        type: 'info',
        message: 'Unable to generate AI insights at this time. Please try again later.',
        priority: 3,
      },
    ];
  }
}