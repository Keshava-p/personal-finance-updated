import React from 'react';
import { useTranslation } from 'react-i18next';

export const LanguageSelector: React.FC<{ value: string; onChange?: (val: string) => void }> = ({ value, onChange }) => {
  const { i18n } = useTranslation();
  
  const handleChange = (v: string) => {
    i18n.changeLanguage(v);
    onChange?.(v);
  };

  const languages = [
    { code: 'en', name: 'English' },
  ];

  return (
    <select 
      value={value} 
      onChange={(e) => handleChange(e.target.value)}
      className="w-full rounded-lg border border-white/20 bg-white/10 backdrop-blur-sm text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400"
    >
      {languages.map((lang) => (
        <option key={lang.code} value={lang.code} className="bg-[#0a0f1f] text-white">
          {lang.name}
        </option>
      ))}
    </select>
  );
};
