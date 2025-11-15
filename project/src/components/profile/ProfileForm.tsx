import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useProfile, Profile, IncomeType, TaxRegime, ThemePreference } from '../../hooks/useProfile';
import { CurrencySelector } from './CurrencySelector';
import { SalaryInput } from './SalaryInput';

export const ProfileForm: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { profile, updateProfile } = useProfile();
  const [formState, setFormState] = useState<Profile>(profile);

  useEffect(() => {
    setFormState(profile);
  }, [profile]);

  const handleInput =
    <K extends keyof Profile>(key: K) =>
    (value: Profile[K]) => {
      setFormState((prev) => ({ ...prev, [key]: value }));
    };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    updateProfile(formState);
    alert(t('profile.detailsSaved'));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-white">Complete Your Profile</h3>
        <p className="mt-2 text-sm text-white/70">
          Keep your personal and financial preferences up to date to unlock personalized budgets and accurate insights.
        </p>
      </div>

      <section>
        <h4 className="text-sm font-semibold text-white/80 uppercase tracking-wide mb-3">Basic Information</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="flex flex-col text-sm font-medium text-white/80">
            Name
            <input
              value={formState.name}
              onChange={(e) => handleInput('name')(e.target.value)}
              className="mt-1 rounded-lg border border-white/20 bg-white/10 backdrop-blur-sm text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              placeholder="Full name"
              required
            />
          </label>
          <label className="flex flex-col text-sm font-medium text-white/80">
            Email
            <input
              type="email"
              value={formState.email}
              onChange={(e) => handleInput('email')(e.target.value)}
              className="mt-1 rounded-lg border border-white/20 bg-white/10 backdrop-blur-sm text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              placeholder="you@example.com"
              required
            />
          </label>
          <label className="flex flex-col text-sm font-medium text-white/80">
            Phone
            <input
              value={formState.phone || ''}
              onChange={(e) => handleInput('phone')(e.target.value)}
              className="mt-1 rounded-lg border border-white/20 bg-white/10 backdrop-blur-sm text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              placeholder="+91 98765 43210"
            />
          </label>
          <label className="flex flex-col text-sm font-medium text-white/80">
            Date of Birth
            <input
              type="date"
              value={formState.dob || ''}
              onChange={(e) => handleInput('dob')(e.target.value)}
              className="mt-1 rounded-lg border border-white/20 bg-white/10 backdrop-blur-sm text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
          </label>
        </div>
      </section>

      <section>
        <h4 className="text-sm font-semibold text-white/80 uppercase tracking-wide mb-3">Financial Details</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-3">
            <SalaryInput
              initial={formState.monthlySalary}
              currency={formState.currencyPreference}
              onUpdate={(salary) => {
                handleInput('monthlySalary')(salary);
                setFormState((prev) => ({ ...prev, monthlySalary: salary }));
              }}
            />
          </div>
          <label className="flex flex-col text-sm font-medium text-white/80">
            Income Type
            <select
              value={formState.incomeType}
              onChange={(e) => handleInput('incomeType')(e.target.value as IncomeType)}
              className="mt-1 rounded-lg border border-white/20 bg-white/10 backdrop-blur-sm text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            >
              <option value="salary" className="bg-[#0a0f1f]">Salary</option>
              <option value="business" className="bg-[#0a0f1f]">Business</option>
            </select>
          </label>
          <label className="flex flex-col text-sm font-medium text-white/80">
            Tax Regime
            <select
              value={formState.taxRegime}
              onChange={(e) => handleInput('taxRegime')(e.target.value as TaxRegime)}
              className="mt-1 rounded-lg border border-white/20 bg-white/10 backdrop-blur-sm text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            >
              <option value="none" className="bg-[#0a0f1f]">Select</option>
              <option value="old" className="bg-[#0a0f1f]">Old</option>
              <option value="new" className="bg-[#0a0f1f]">New</option>
            </select>
          </label>
          <label className="flex flex-col text-sm font-medium text-white/80">
            Emergency Fund Target
            <input
              type="number"
              min={0}
              value={formState.emergencyFundTarget || 0}
              onChange={(e) => handleInput('emergencyFundTarget')(Number(e.target.value))}
              className="mt-1 rounded-lg border border-white/20 bg-white/10 backdrop-blur-sm text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              placeholder="100000"
            />
          </label>
        </div>
      </section>

      <section>
        <h4 className="text-sm font-semibold text-white/80 uppercase tracking-wide mb-3">Preferences</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <label className="flex flex-col text-sm font-medium text-white/80">
            Preferred Currency
            <CurrencySelector
              value={formState.currencyPreference}
              onChange={(val) => handleInput('currencyPreference')(val)}
            />
          </label>
          <label className="flex flex-col text-sm font-medium text-white/80">
            Theme Preference
            <select
              value={formState.themePreference}
              onChange={(e) => handleInput('themePreference')(e.target.value as ThemePreference)}
              className="mt-1 rounded-lg border border-white/20 bg-white/10 backdrop-blur-sm text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            >
              <option value="system" className="bg-[#0a0f1f]">System</option>
              <option value="light" className="bg-[#0a0f1f]">Light</option>
              <option value="dark" className="bg-[#0a0f1f]">Dark</option>
            </select>
          </label>
        </div>
      </section>

      <section>
        <h4 className="text-sm font-semibold text-white/80 uppercase tracking-wide mb-3">Security</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <label className="flex flex-col text-sm font-medium text-white/80">
            Password
            <input
              type="password"
              value={formState.password || ''}
              onChange={(e) => handleInput('password')(e.target.value)}
              className="mt-1 rounded-lg border border-white/20 bg-white/10 backdrop-blur-sm text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              placeholder="Set a secure password"
            />
          </label>
          <label className="flex items-center text-sm font-medium text-white/80 mt-6">
            <input
              type="checkbox"
              checked={formState.twoFactorEnabled}
              onChange={(e) => handleInput('twoFactorEnabled')(e.target.checked)}
              className="mr-2 rounded border-white/20 text-cyan-400 shadow-sm focus:border-cyan-400 focus:ring-cyan-400"
            />
            Enable Two-Factor Authentication
          </label>
        </div>
      </section>

      <section>
        <h4 className="text-sm font-semibold text-white/80 uppercase tracking-wide mb-3">Optional Details</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="flex flex-col text-sm font-medium text-white/80">
            Savings Account Details
            <input
              value={formState.savingsAccountDetails || ''}
              onChange={(e) => handleInput('savingsAccountDetails')(e.target.value)}
              className="mt-1 rounded-lg border border-white/20 bg-white/10 backdrop-blur-sm text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              placeholder="Bank name & account"
            />
          </label>
          <label className="flex flex-col text-sm font-medium text-white/80">
            PAN
            <input
              value={formState.pan || ''}
              onChange={(e) => handleInput('pan')(e.target.value)}
              className="mt-1 uppercase tracking-wide rounded-lg border border-white/20 bg-white/10 backdrop-blur-sm text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              placeholder="ABCDE1234F"
              maxLength={10}
            />
          </label>
        </div>
      </section>

      <div className="flex justify-end">
        <button
          type="submit"
          className="inline-flex items-center px-6 py-3 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all"
        >
          Save Profile
        </button>
      </div>
    </form>
  );
};
