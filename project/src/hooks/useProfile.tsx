import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import i18n from '../i18n';

export type IncomeType = 'salary' | 'business';
export type TaxRegime = 'old' | 'new' | 'none';
export type ThemePreference = 'light' | 'dark' | 'system';

export interface Profile {
  name: string;
  email: string;
  phone?: string;
  dob?: string;
  monthlySalary: number;
  incomeType: IncomeType;
  taxRegime: TaxRegime;
  currencyPreference: string;
  languagePreference: string;
  themePreference: ThemePreference;
  password?: string;
  twoFactorEnabled: boolean;
  savingsAccountDetails?: string;
  pan?: string;
  emergencyFundTarget?: number;
}

interface ProfileContextValue {
  profile: Profile;
  updateProfile: (patch: Partial<Profile>) => void;
  updateSalary: (monthlySalary: number) => void;
  resetProfile: () => void;
}

const defaultProfile: Profile = {
  name: '',
  email: '',
  phone: '',
  dob: '',
  monthlySalary: 0,
  incomeType: 'salary',
  taxRegime: 'none',
  currencyPreference: 'INR',
  languagePreference: 'en',
  themePreference: 'system',
  password: '',
  twoFactorEnabled: false,
  savingsAccountDetails: '',
  pan: '',
  emergencyFundTarget: 0,
};

const STORAGE_KEY = 'pfm_profile';

const ProfileContext = createContext<ProfileContextValue | undefined>(undefined);

export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<Profile>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return { ...defaultProfile, ...JSON.parse(stored) } as Profile;
      }
    } catch (error) {
      console.error('Failed to parse profile from storage', error);
    }
    return defaultProfile;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    } catch (error) {
      console.error('Failed to persist profile', error);
    }
  }, [profile]);

  useEffect(() => {
    const preferredLanguage = profile.languagePreference || 'en';
    if (i18n.language !== preferredLanguage) {
      i18n.changeLanguage(preferredLanguage).catch((error) => {
        console.error('Failed to switch language', error);
      });
    }
  }, [profile.languagePreference]);

  useEffect(() => {
    const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
    const resolvedTheme =
      profile.themePreference === 'system'
        ? prefersDark
          ? 'dark'
          : 'light'
        : profile.themePreference;

    document.documentElement.classList.toggle('dark', resolvedTheme === 'dark');
    localStorage.setItem('theme', resolvedTheme);
  }, [profile.themePreference]);

  const updateProfile = useCallback((patch: Partial<Profile>) => {
    setProfile((prev) => ({ ...prev, ...patch }));
  }, []);

  const updateSalary = useCallback((monthlySalary: number) => {
    setProfile((prev) => ({ ...prev, monthlySalary }));
  }, []);

  const resetProfile = useCallback(() => {
    setProfile(defaultProfile);
  }, []);

  const value = useMemo(
    () => ({
      profile,
      updateProfile,
      updateSalary,
      resetProfile,
    }),
    [profile, updateProfile, updateSalary, resetProfile],
  );

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
};

export function useProfile() {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
}

