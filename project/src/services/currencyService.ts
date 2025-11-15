// Using a free currency conversion API
const API_BASE_URL = 'https://api.exchangerate-api.com/v4/latest/USD';

let ratesCache: {
  rates: Record<string, number>;
  timestamp: number;
} | null = null;

const CACHE_DURATION = 1000 * 60 * 60; // 1 hour

export async function convertCurrency(
  amount: number,
  from: string,
  to: string
): Promise<number> {
  try {
    // Check if we need to fetch new rates
    const now = Date.now();
    if (!ratesCache || now - ratesCache.timestamp > CACHE_DURATION) {
      const response = await fetch(API_BASE_URL);
      const data = await response.json();
      ratesCache = {
        rates: data.rates,
        timestamp: now,
      };
    }

    // Convert to USD first (base currency)
    const amountInUSD = from === 'USD' ? amount : amount / ratesCache.rates[from];
    
    // Convert from USD to target currency
    return to === 'USD' ? amountInUSD : amountInUSD * ratesCache.rates[to];
  } catch (error) {
    console.error('Currency conversion failed:', error);
    return amount; // Return original amount if conversion fails
  }
}