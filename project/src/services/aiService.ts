import { GoogleGenerativeAI } from "@google/generative-ai";
import { Expense } from "../types/expense";
import { startOfMonth, endOfMonth, format } from "date-fns";
import { formatCurrency } from "../utils/currency";

const AI_KEY_STORAGE = "pfm_ai_key";

export interface ExpenseInsight {
  id: string;
  type: "info" | "warning" | "alert";
  message: string;
  priority: number;
}

// -----------------------------
// STRONG JSON EXTRACTOR
// -----------------------------
function extractJson(text: string): string {
  if (!text) return "[]";

  // Remove fences
  let clean = text
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  // Extract JSON array even if Gemini adds text above/below
  const match = clean.match(/\[[\s\S]*\]/);
  return match ? match[0] : "[]";
}

// -----------------------------
// MAIN AI FUNCTION
// -----------------------------
export async function generateExpenseInsights(
  expenses: Expense[],
  currency = "INR"
): Promise<ExpenseInsight[]> {
  try {
    // Use hardcoded API key (fallback to localStorage if available)
    const apiKey = localStorage.getItem(AI_KEY_STORAGE) || "AIzaSyC5V9YKja7yXjX1nqmzotyXRKQIOb5n1L0";

    const genAI = new GoogleGenerativeAI(apiKey);

    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash", // Latest stable
    });

    // -----------------------------
    // Prepare Data
    // -----------------------------
    const currentMonthExpenses = expenses.filter((e) => {
      const date = new Date(e.date);
      return (
        date >= startOfMonth(new Date()) &&
        date <= endOfMonth(new Date())
      );
    });

    const summary = {
      total: expenses.reduce((sum, e) => sum + e.amount, 0),
      monthlyTotal: currentMonthExpenses.reduce((sum, e) => sum + e.amount, 0),
      categories: Object.entries(
        expenses.reduce((acc, e) => {
          acc[e.category] = (acc[e.category] || 0) + e.amount;
          return acc;
        }, {} as Record<string, number>)
      ),
      month: format(new Date(), "MMMM yyyy"),
    };

    const prompt = `
You are an advanced AI financial advisor with expertise in 
personal finance, behavioral psychology, and habit analytics.

Your job is NOT to restate the data or summarize it.
Your job is to uncover hidden patterns, risks, and opportunities,
and convert them into powerful, short, actionable insights.

STRICT RULES:
- DO NOT restate the data in any form.
- DO NOT mention obvious things (like category totals or obvious comparisons).
- DO NOT output anything except actionable recommendations.
- 3 to 4 insights only.
- Keep each insight short but impactful.
- Think like a smart financial coach.
- Use behavior analysis, pattern detection, and future predictions.
- Each insight must feel personal and helpful.
- OUTPUT MUST BE A CLEAN JSON ARRAY. No text outside JSON.

----------------------------------------
USER EXPENSE DATA
----------------------------------------
Total Expenses: ${formatCurrency(summary.total, currency)}
Monthly Total (${summary.month}): ${formatCurrency(summary.monthlyTotal, currency)}

Categories:
${summary.categories
        .map(([cat, amount]) => `${cat}: ${formatCurrency(amount, currency)}`)
        .join("\n")}

----------------------------------------
GENERATE INSIGHTS BASED ON THESE CONCEPTS:
----------------------------------------

1) Hidden Money Leaks  
   - Many small purchases stacking up  
   - Late-night orders, weekend spikes  
   - Emotional spending bursts  

2) Overspending Red Flags  
   - Categories rising faster than typical  
   - Lifestyle inflation  

3) Subscription / Recurring Pattern Detection  
   - Identify repeating monthly charges  
   - Suggest removing unused services  

4) Smart Replacement Advice  
   - Recommend cheaper alternatives (meal prep, travel pass, bulk buying, etc.)  

5) Budget Misalignment  
   - Spending that contradicts user's likely goals  
   - Overshooting pace for the month  

6) Predictive Forecast  
   - Will they overshoot the month at current pace?  
   - Expected future spikes  

7) Savings Optimization  
   - Concrete steps to reduce monthly costs  
   - Small habits that save money  

8) Mental / Emotional Spending  
   - Impulse purchase patterns  
   - Retail therapy days  
   - Overspending after salary credit  

9) Lifestyle Pattern Recognition  
   - Commute-heavy, food-heavy, weekend-heavy spending  
   - Work-life correlation  

----------------------------------------
RETURN FORMAT — STRICT JSON:
----------------------------------------
[
  {
    "type": "alert" | "warning" | "info",
    "message": "Short, powerful, actionable recommendation only.",
    "priority": 1 | 2 | 3
  }
]
----------------------------------------

Now generate ONLY the JSON array with insights.
`;


    // -----------------------------
    // Gemini Request
    // -----------------------------
    let result;
    try {
      result = await model.generateContent(prompt);
    } catch (apiError: any) {
      console.error("Gemini API error:", apiError);

      if (apiError.message?.includes("429")) {
        return [
          {
            id: crypto.randomUUID(),
            type: "warning",
            message:
              "Gemini is temporarily rate-limited. Please try again later.",
            priority: 2,
          },
        ];
      }

      return [
        {
          id: crypto.randomUUID(),
          type: "warning",
          message: "Failed to connect to Gemini API. Check your API key.",
          priority: 2,
        },
      ];
    }

    const text = await result.response.text();

    // -----------------------------
    // JSON Extract + Parse
    // -----------------------------
    const jsonText = extractJson(text);

    let parsed: any[] = [];
    try {
      parsed = JSON.parse(jsonText);
    } catch (err) {
      console.error("JSON parsing failed:", jsonText);
      parsed = [];
    }

    // -----------------------------
    // Filter empty/invalid objects
    // -----------------------------
    const cleaned = parsed.filter(
      (x) => x && typeof x === "object" && Object.keys(x).length > 0
    );

    if (cleaned.length === 0) {
      return [
        {
          id: crypto.randomUUID(),
          type: "info",
          message: "AI could not analyze spending patterns.",
          priority: 3,
        },
      ];
    }

    // -----------------------------
    // Final Output
    // -----------------------------
    return cleaned.map((insight) => ({
      id: crypto.randomUUID(),
      type: insight.type ?? "info",
      message: insight.message ?? "AI could not generate message.",
      priority: Number(insight.priority ?? 3),
    }));
  } catch (err) {
    console.error("Final AI error:", err);

    return [
      {
        id: crypto.randomUUID(),
        type: "warning",
        message: "AI insights unavailable. Please try again.",
        priority: 2,
      },
    ];
  }
}
