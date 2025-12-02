import React from 'react';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { Download, Upload, FileText, FileSpreadsheet, Globe, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useNotifications } from '../hooks/useNotifications';
import { useExpenses } from '../hooks/useExpenses';
import { backupData, restoreData, exportToPDF, exportToCSV } from '../services/exportService';
import { useProfile } from '../hooks/useProfile';
import { useCurrency } from '../hooks/useCurrency';
import { GlassCard } from '../components/ui/GlassCard';
import { CurrencySelector } from '../components/profile/CurrencySelector';
import { LanguageSelector } from '../components/profile/LanguageSelector';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export function Settings() {
  const { t } = useTranslation();
  const { notificationsEnabled, toggleNotifications } = useNotifications();
  const { expenses } = useExpenses();
  const { profile, updateProfile } = useProfile();
  const { format: formatMoney, currency } = useCurrency();
  const [restoreError, setRestoreError] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleRestore = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      await restoreData(file);
      window.location.reload();
    } catch (error) {
      setRestoreError((error as Error).message);
    }
  };

  const handleCurrencyChange = async (newCurrency: string) => {
    try {
      await axios.post(`${API_BASE}/profile/preferences`, {
        currencyPreference: newCurrency,
      }, {
        headers: { 'x-user-id': profile.email || 'test@example.com' },
      });
      updateProfile({ currencyPreference: newCurrency });
    } catch (error) {
      console.error('Error updating currency:', error);
    }
  };

  const handleLanguageChange = async (newLanguage: string) => {
    try {
      await axios.post(`${API_BASE}/profile/preferences`, {
        languagePreference: newLanguage,
      }, {
        headers: { 'x-user-id': profile.email || 'test@example.com' },
      });
      updateProfile({ languagePreference: newLanguage });
    } catch (error) {
      console.error('Error updating language:', error);
    }
  };

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const estimatedSavings = Math.max(profile.monthlySalary - totalExpenses, 0);

  return (
    <div className="space-y-6 pb-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-white">{t('settings.title')}</h2>
        <span className="text-sm text-white/60">
          {t('settings.lastUpdated')} {format(new Date(), 'MMM d, yyyy')}
        </span>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <GlassCard className="p-6 lg:col-span-2">
          <h3 className="text-sm font-semibold text-white/80 uppercase tracking-wide mb-4">
            {t('settings.profileOverview')}
          </h3>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-white/70">
            <div>
              <dt className="font-medium text-white mb-1">{t('profile.name')}</dt>
              <dd>{profile.name || '—'}</dd>
            </div>
            <div>
              <dt className="font-medium text-white mb-1">{t('profile.email')}</dt>
              <dd>{profile.email || '—'}</dd>
            </div>
            <div>
              <dt className="font-medium text-white mb-1">{t('settings.preferredCurrency')}</dt>
              <dd>{currency}</dd>
            </div>
            <div>
              <dt className="font-medium text-white mb-1">{t('settings.language')}</dt>
              <dd>{profile.languagePreference?.toUpperCase() || 'EN'}</dd>
            </div>
            <div>
              <dt className="font-medium text-white mb-1">{t('settings.monthlySalary')}</dt>
              <dd>{formatMoney(profile.monthlySalary)}</dd>
            </div>
            <div>
              <dt className="font-medium text-white mb-1">{t('settings.emergencyFundTarget')}</dt>
              <dd>{formatMoney(profile.emergencyFundTarget || 0)}</dd>
            </div>
          </dl>
        </GlassCard>
        <GlassCard className="p-6 space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-white/80 uppercase tracking-wide mb-3">
              {t('settings.quickStats')}
            </h3>
            <p className="text-3xl font-bold text-white">{formatMoney(estimatedSavings)}</p>
            <p className="text-xs text-white/60">{t('settings.estimatedSavings')}</p>
          </div>
        </GlassCard>
      </div>

      <GlassCard className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-white">{t('settings.manageProfile')}</h3>
            <p className="text-sm text-white/70">
              {t('profile.updatePersonalInfo')}
            </p>
          </div>
          <Link
            to="/profile"
            className="inline-flex items-center px-4 py-2 rounded-xl border border-cyan-400/30 text-cyan-400 hover:bg-cyan-400/10 transition"
          >
            {t('settings.goToProfile')}
          </Link>
        </div>
      </GlassCard>

      <GlassCard className="p-6">
        <div className="space-y-6">
          {/* Language Selector */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <Globe className="h-5 w-5 text-cyan-400" />
              <h3 className="text-lg font-bold text-white">{t('settings.languagePreference')}</h3>
            </div>
            <p className="text-sm text-white/70 mb-3">
              {t('settings.selectLanguage')}
            </p>
            <div className="max-w-xs">
              <LanguageSelector
                value={profile.languagePreference || 'en'}
                onChange={handleLanguageChange}
              />
            </div>
          </div>

          {/* Currency Selector */}
          <div className="border-t border-white/20 pt-6">
            <div className="flex items-center gap-3 mb-3">
              <DollarSign className="h-5 w-5 text-cyan-400" />
              <h3 className="text-lg font-bold text-white">{t('settings.currencyPreference')}</h3>
            </div>
            <p className="text-sm text-white/70 mb-3">
              {t('settings.chooseCurrency')}
            </p>
            <div className="max-w-xs">
              <CurrencySelector
                value={currency}
                onChange={handleCurrencyChange}
              />
            </div>
          </div>

          {/* Notifications */}
          <div className="border-t border-white/20 pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">{t('settings.notifications')}</h3>
                <p className="text-sm text-white/70">
                  {t('settings.notificationSettings')}
                </p>
              </div>
              <button
                onClick={toggleNotifications}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 ${notificationsEnabled ? 'bg-cyan-500' : 'bg-white/20'
                  }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${notificationsEnabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                />
              </button>
            </div>
          </div>

          {/* Export & Backup */}
          <div className="border-t border-white/20 pt-6">
            <h3 className="text-lg font-bold text-white mb-4">
              {t('settings.exportBackup')}
            </h3>
            <div className="space-y-3">
              <button
                onClick={() => exportToPDF(expenses)}
                className="w-full inline-flex items-center justify-center px-4 py-2 border border-white/20 rounded-xl text-sm font-medium text-white bg-white/10 hover:bg-white/20 transition"
              >
                <FileText className="h-5 w-5 mr-2" />
                {t('settings.exportPDF')}
              </button>
              <button
                onClick={() => exportToCSV(expenses)}
                className="w-full inline-flex items-center justify-center px-4 py-2 border border-white/20 rounded-xl text-sm font-medium text-white bg-white/10 hover:bg-white/20 transition"
              >
                <FileSpreadsheet className="h-5 w-5 mr-2" />
                {t('settings.exportCSV')}
              </button>
              <button
                onClick={backupData}
                className="w-full inline-flex items-center justify-center px-4 py-2 border border-white/20 rounded-xl text-sm font-medium text-white bg-white/10 hover:bg-white/20 transition"
              >
                <Download className="h-5 w-5 mr-2" />
                {t('settings.backupData')}
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full inline-flex items-center justify-center px-4 py-2 border border-white/20 rounded-xl text-sm font-medium text-white bg-white/10 hover:bg-white/20 transition"
              >
                <Upload className="h-5 w-5 mr-2" />
                {t('settings.restoreData')}
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleRestore}
                accept=".json"
                className="hidden"
              />
              {restoreError && (
                <p className="text-sm text-red-400">{restoreError}</p>
              )}
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}