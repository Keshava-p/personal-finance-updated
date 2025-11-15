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
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Add Expense</h2>
        <VoiceInput onVoiceInput={handleVoiceInput} />
      </div>

      <div>
        <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
          Amount
        </label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="block w-full rounded-md border-gray-300 pl-7 pr-12 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="0.00"
            required
          />
          <div className="absolute inset-y-0 right-0 flex items-center">
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="h-full rounded-md border-transparent bg-transparent py-0 pl-2 pr-7 text-gray-500 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
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
        <label htmlFor="category" className="block text-sm font-medium text-gray-700">
          Category
        </label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
          required
        >
          <option value="">Select a category</option>
          <option value="food">Food</option>
          <option value="transport">Transport</option>
          <option value="entertainment">Entertainment</option>
          <option value="utilities">Utilities</option>
          <option value="shopping">Shopping</option>
        </select>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <input
          type="text"
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          required
        />
      </div>

      <button
        type="submit"
        disabled={isConverting}
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
      >
        <PlusCircle className="mr-2 h-4 w-4" />
        {isConverting ? 'Converting Currency...' : 'Add Expense'}
      </button>
    </form>
  );
}