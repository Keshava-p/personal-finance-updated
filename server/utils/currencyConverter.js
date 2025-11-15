import axios from 'axios';

const RATE_CACHE = new Map();
const CACHE_DURATION = 12 * 60 * 60 * 1000; // 12 hours

/**
 * Get exchange rate from cache or API
 */
async function getExchangeRate(from, to) {
  const cacheKey = `${from}_${to}`;
  const cached = RATE_CACHE.get(cacheKey);
  
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.rate;
  }

  try {
    const apiUrl = process.env.EXCHANGE_API_URL || 'https://api.exchangerate.host';
    const response = await axios.get(`${apiUrl}/latest`, {
      params: {
        base: from,
        symbols: to,
      },
    });

    const rate = response.data.rates?.[to] || response.data.rates?.[to.toUpperCase()];
    
    if (rate) {
      RATE_CACHE.set(cacheKey, { rate, timestamp: Date.now() });
      return rate;
    }

    // Fallback: if direct conversion fails, try USD as intermediate
    if (from !== 'USD' && to !== 'USD') {
      const fromToUsd = await getExchangeRate(from, 'USD');
      const usdToTo = await getExchangeRate('USD', to);
      return fromToUsd * usdToTo;
    }

    throw new Error(`Unable to fetch exchange rate for ${from} to ${to}`);
  } catch (error) {
    console.error('Exchange rate error:', error.message);
    // Return 1 as fallback (no conversion)
    return 1;
  }
}

/**
 * Convert amount from one currency to another
 */
export async function convertCurrency(amount, from, to) {
  if (from === to) return amount;
  
  const rate = await getExchangeRate(from, to);
  return amount * rate;
}

/**
 * Get all supported currencies
 */
export function getSupportedCurrencies() {
  return ['INR', 'USD', 'EUR', 'GBP', 'AED'];
}

