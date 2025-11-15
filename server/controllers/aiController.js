import OpenAI from 'openai';
import User from '../models/User.js';
import Goal from '../models/Goal.js';
import Debt from '../models/Debt.js';
import Transaction from '../models/Transaction.js';

const getAIProvider = () => {
  const provider = process.env.AI_PROVIDER || 'openai';
  const apiKey = process.env.AI_API_KEY;
  if (!apiKey) {
    throw new Error('AI_API_KEY not configured');
  }

  if (provider === 'openai') {
    return new OpenAI({ apiKey });
  }
  
  throw new Error(`Unsupported AI provider: ${provider}`);
};

export const getInsights = async (req, res) => {
  try {
    const { userId, context } = req.body;
    const targetUserId = userId || req.userId;

    // Fetch user data
    const user = await User.findById(targetUserId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Fetch related data
    const [goals, debts, transactions] = await Promise.all([
      Goal.find({ userId: targetUserId }),
      Debt.find({ userId: targetUserId }),
      Transaction.find({ userId: targetUserId }).sort({ date: -1 }).limit(100),
    ]);

    // Calculate financial metrics
    const totalDebt = debts.reduce((sum, d) => sum + d.principal, 0);
    const totalMonthlyDebtPayments = debts.reduce((sum, d) => sum + d.monthlyPayment, 0);
    const monthlyExpenses = transactions
      .filter(t => {
        const tDate = new Date(t.date);
        const now = new Date();
        return tDate.getMonth() === now.getMonth() && tDate.getFullYear() === now.getFullYear();
      })
      .reduce((sum, t) => sum + t.amount, 0);
    
    const monthlyIncome = user.monthlySalary || 0;
    const netSavings = monthlyIncome - monthlyExpenses - totalMonthlyDebtPayments;
    const totalGoals = goals.reduce((sum, g) => sum + g.targetAmount, 0);
    const totalSaved = goals.reduce((sum, g) => sum + g.currentSaved, 0);

    // Build prompt
    const prompt = `You are a financial advisor analyzing a user's financial situation. Provide insights in JSON format only.

User Profile:
- Monthly Income: ${user.currencyPreference} ${monthlyIncome}
- Monthly Expenses: ${user.currencyPreference} ${monthlyExpenses}
- Monthly Debt Payments: ${user.currencyPreference} ${totalMonthlyDebtPayments}
- Net Monthly Savings: ${user.currencyPreference} ${netSavings}
- Total Debt: ${user.currencyPreference} ${totalDebt}
- Emergency Fund Target: ${user.currencyPreference} ${user.emergencyFundTarget || 0}
- Goals: ${goals.length} goals, Total Target: ${user.currencyPreference} ${totalGoals}, Current Saved: ${user.currencyPreference} ${totalSaved}

Debts:
${debts.map(d => `- ${d.name}: ${d.principal} ${d.currency} at ${d.apr}% APR, Monthly: ${d.monthlyPayment}`).join('\n')}

Goals:
${goals.map(g => `- ${g.name}: ${g.currentSaved}/${g.targetAmount} ${g.currency} (Deadline: ${g.deadline || 'No deadline'})`).join('\n')}

Recent Expenses (Top 5 categories):
${Object.entries(
  transactions.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + t.amount;
    return acc;
  }, {})
)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 5)
  .map(([cat, amt]) => `- ${cat}: ${user.currencyPreference} ${amt}`)
  .join('\n')}

Provide a JSON response with this exact structure:
{
  "summary": "A concise 2-3 sentence summary of their financial health",
  "actions": [
    {
      "title": "Action title",
      "description": "Detailed description",
      "priority": 1
    }
  ],
  "confidence": 0.85
}

Priority: 1 = high, 2 = medium, 3 = low
Confidence: 0-1 scale
Focus on: debt management, savings goals, emergency fund, budgeting, investment opportunities, risk assessment.`;

    try {
      const ai = getAIProvider();
      const completion = await ai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are a financial advisor. Always respond with valid JSON only.' },
          { role: 'user', content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      });

      const content = completion.choices[0]?.message?.content || '{}';
      let insights;
      
      try {
        // Try to parse JSON (might be wrapped in markdown code blocks)
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        insights = JSON.parse(jsonMatch ? jsonMatch[0] : content);
      } catch (parseError) {
        // Fallback if parsing fails
        insights = {
          summary: 'Unable to parse AI response. Please try again.',
          actions: [],
          confidence: 0,
        };
      }

      // Validate and sanitize
      if (!insights.summary) insights.summary = 'No summary available';
      if (!Array.isArray(insights.actions)) insights.actions = [];
      if (typeof insights.confidence !== 'number') insights.confidence = 0.5;

      res.json(insights);
    } catch (aiError) {
      console.error('AI service error:', aiError);
      // Return fallback insights instead of error
      res.json({
        summary: aiError.message.includes('API') 
          ? 'AI insights are temporarily unavailable. Please check your API key configuration in server/.env file.'
          : 'AI insights are temporarily unavailable. Please try again later.',
        actions: [
          {
            title: 'Check Configuration',
            description: 'Verify AI_API_KEY is set correctly in server/.env file',
            priority: 2,
          },
        ],
        confidence: 0,
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

