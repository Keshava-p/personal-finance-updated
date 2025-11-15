export async function categorizeExpense(description: string, amount: number): Promise<string> {
  // Simple categorization based on keywords and amount ranges
  const keywords = {
    food: ['restaurant', 'grocery', 'food', 'meal'],
    transport: ['uber', 'taxi', 'bus', 'train', 'gas'],
    entertainment: ['movie', 'game', 'concert', 'netflix'],
    utilities: ['electricity', 'water', 'internet', 'phone'],
    shopping: ['amazon', 'walmart', 'target', 'store'],
  };

  const desc = description.toLowerCase();
  for (const [category, words] of Object.entries(keywords)) {
    if (words.some(word => desc.includes(word))) {
      return category;
    }
  }

  // Fallback to amount-based categorization
  if (amount < 20) return 'food';
  if (amount < 50) return 'transport';
  if (amount < 100) return 'entertainment';
  if (amount < 200) return 'shopping';
  return 'utilities';
}