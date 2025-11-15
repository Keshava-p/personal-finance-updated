const currencyLocaleMap: Record<string, string> = {
  INR: 'en-IN',
  USD: 'en-US',
  EUR: 'de-DE',
  GBP: 'en-GB',
  AED: 'ar-AE',
  CAD: 'en-CA',
  AUD: 'en-AU',
  SGD: 'en-SG',
  JPY: 'ja-JP',
  CHF: 'de-CH',
  CNY: 'zh-CN',
};

export function getLocaleForCurrency(currency: string) {
  return currencyLocaleMap[currency] || 'en-US';
}

export function formatCurrency(value: number | string, currency = 'INR', locale?: string) {
  const val = typeof value === 'string' ? parseFloat(value) || 0 : value || 0;
  const resolvedLocale = locale || getLocaleForCurrency(currency);
  try {
    return new Intl.NumberFormat(resolvedLocale, { style: 'currency', currency }).format(val);
  } catch {
    return `${currency} ${val.toFixed(2)}`;
  }
}
