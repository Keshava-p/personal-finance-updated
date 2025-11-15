import React from 'react';

interface CurrencySelectorProps {
  value: string;
  onChange?: (val: string) => void;
}

const supportedCurrencies = [
  { code: 'INR', label: 'Indian Rupee (₹)' },
  { code: 'USD', label: 'US Dollar ($)' },
  { code: 'EUR', label: 'Euro (€)' },
  { code: 'GBP', label: 'British Pound (£)' },
  { code: 'AED', label: 'UAE Dirham (د.إ)' },
  { code: 'CAD', label: 'Canadian Dollar (C$)' },
  { code: 'AUD', label: 'Australian Dollar (A$)' },
  { code: 'SGD', label: 'Singapore Dollar (S$)' },
  { code: 'JPY', label: 'Japanese Yen (¥)' },
];

export const CurrencySelector: React.FC<CurrencySelectorProps> = ({ value, onChange }) => {
  return (
    <select
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      className="w-full rounded-lg border border-white/20 bg-white/10 backdrop-blur-sm text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400"
    >
      {supportedCurrencies.map((entry) => (
        <option key={entry.code} value={entry.code} className="bg-[#0a0f1f] text-white">
          {entry.label}
        </option>
      ))}
    </select>
  );
};
