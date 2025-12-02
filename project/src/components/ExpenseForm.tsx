import React, { useEffect, useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { VoiceInput } from './VoiceInput';
import { convertCurrency } from '../services/currencyService';
import { useProfile } from '../hooks/useProfile';

interface ExpenseFormProps {
  onSubmit: (expense: {
    amount: number;
    category: string;
    description: string;
    date: string;
    currency: string;
  }) => void;
}

export function ExpenseForm({ onSubmit }: ExpenseFormProps) {
  const { profile } = useProfile();
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [currency, setCurrency] = useState(profile.currencyPreference || 'INR');
  const [isConverting, setIsConverting] = useState(false);

  useEffect(() => {
    setCurrency(profile.currencyPreference);
  }, [profile.currencyPreference]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let finalAmount = parseFloat(amount);

    if (currency !== profile.currencyPreference) {
      setIsConverting(true);
      try {
        finalAmount = await convertCurrency(finalAmount, currency, profile.currencyPreference);
        setCurrency(profile.currencyPreference);
      } catch (error) {
        console.error('Currency conversion failed:', error);
      }
      setIsConverting(false);
    }

    onSubmit({
      amount: finalAmount,
      category,
      description,
      date: new Date().toISOString(),
      currency: profile.currencyPreference,
    });

    setAmount('');
    setCategory('');
    setDescription('');
  };

  const handleVoiceInput = (data: { amount: number | null; category: string; description: string }) => {
    if (data.amount) setAmount(data.amount.toString());
    if (data.category) setCategory(data.category);
    if (data.description) setDescription(data.description);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Add Expense</h2>
        <VoiceInput onVoiceInput={handleVoiceInput} />
      </div>

      <div>
        <label htmlFor="amount" className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
          Amount
        </label>
        <div className="relative rounded-lg">
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="block w-full h-11 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white pl-4 pr-24 focus:border-cyan-500 dark:focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500"
            placeholder="0.00"
            step="0.01"
            required
          />
          <div className="absolute inset-y-0 right-0 flex items-center">
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="h-full rounded-r-lg border-transparent bg-gray-100 dark:bg-gray-600 text-gray-900 dark:text-white py-0 pl-3 pr-8 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 text-sm font-medium"
            >
              <option value="INR">INR</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
              <option value="AED">AED</option>
              <option value="CAD">CAD</option>
              <option value="AUD">AUD</option>
              <option value="SGD">SGD</option>
              <option value="JPY">JPY</option>
            </select>
          </div>
        </div>
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
          Category
        </label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="block w-full h-11 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-4 focus:border-cyan-500 dark:focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 transition-all"
          required
        >
          <option value="">Select a category</option>
          <option value="food">🍔 Food</option>
          <option value="transport">🚗 Transport</option>
          <option value="entertainment">🎬 Entertainment</option>
          <option value="utilities">💡 Utilities</option>
          <option value="shopping">🛍️ Shopping</option>
          <option value="healthcare">🏥 Healthcare</option>
          <option value="education">📚 Education</option>
          <option value="other">📦 Other</option>
        </select>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
          Description
        </label>
        <input
          type="text"
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="block w-full h-11 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-4 focus:border-cyan-500 dark:focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500"
          placeholder="What did you spend on?"
          required
        />
      </div>

      <button
        type="submit"
        disabled={isConverting}
        className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
      >
        <PlusCircle className="mr-2 h-5 w-5" />
        {isConverting ? 'Converting Currency...' : 'Add Expense'}
      </button>
    </form>
  );
}