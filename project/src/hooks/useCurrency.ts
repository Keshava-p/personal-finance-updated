import { useMemo } from 'react';
import { formatCurrency, getLocaleForCurrency } from '../utils/currency';
import { useProfile } from './useProfile';

export function useCurrency() {
  const {
    profile: { currencyPreference },
  } = useProfile();

  const locale = useMemo(() => getLocaleForCurrency(currencyPreference), [currencyPreference]);

  const format = useMemo(
    () => (value: number | string) => formatCurrency(value, currencyPreference, locale),
    [currencyPreference, locale],
  );

  return {
    currency: currencyPreference,
    locale,
    format,
  };
}

