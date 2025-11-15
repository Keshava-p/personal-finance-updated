import { convertCurrency } from '../utils/currencyConverter.js';

export const convert = async (req, res) => {
  try {
    const { from, to, amount } = req.query;
    
    if (!from || !to || !amount) {
      return res.status(400).json({ 
        error: 'Missing required parameters: from, to, amount' 
      });
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount)) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    const converted = await convertCurrency(numAmount, from.toUpperCase(), to.toUpperCase());
    
    res.json({
      from: from.toUpperCase(),
      to: to.toUpperCase(),
      originalAmount: numAmount,
      convertedAmount: converted,
      rate: converted / numAmount,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

