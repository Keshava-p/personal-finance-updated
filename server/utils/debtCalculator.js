/**
 * Calculate debt payoff projection using simple amortization
 * @param {number} principal - Initial debt amount
 * @param {number} monthlyPayment - Monthly payment amount
 * @param {number} apr - Annual Percentage Rate (as decimal, e.g., 0.10 for 10%)
 * @returns {Object} Payoff projection
 */
export function calculateDebtPayoff(principal, monthlyPayment, apr) {
  const monthlyRate = apr / 12;
  let remainingPrincipal = principal;
  let totalPaid = 0;
  let months = 0;
  const maxMonths = 600; // 50 years max

  if (monthlyPayment <= remainingPrincipal * monthlyRate) {
    // Payment is less than or equal to interest - debt will never be paid off
    return {
      monthsToPayoff: Infinity,
      totalInterest: Infinity,
      totalPaid: Infinity,
      projectedPayoffDate: null,
      warning: 'Monthly payment is too low to cover interest. Debt will not be paid off.',
    };
  }

  while (remainingPrincipal > 0.01 && months < maxMonths) {
    const interestPayment = remainingPrincipal * monthlyRate;
    const principalPayment = Math.min(monthlyPayment - interestPayment, remainingPrincipal);
    
    remainingPrincipal -= principalPayment;
    totalPaid += monthlyPayment;
    months++;
  }

  const totalInterest = totalPaid - principal;
  const projectedPayoffDate = new Date();
  projectedPayoffDate.setMonth(projectedPayoffDate.getMonth() + months);

  return {
    monthsToPayoff: months,
    totalInterest,
    totalPaid,
    projectedPayoffDate,
    remainingPrincipal: remainingPrincipal > 0.01 ? remainingPrincipal : 0,
  };
}

/**
 * Calculate Debt-to-Income ratio
 * @param {number} totalMonthlyDebtPayments - Sum of all monthly debt payments
 * @param {number} monthlyIncome - Monthly income
 * @returns {number} DTI ratio as percentage
 */
export function calculateDTI(totalMonthlyDebtPayments, monthlyIncome) {
  if (!monthlyIncome || monthlyIncome === 0) return 0;
  return (totalMonthlyDebtPayments / monthlyIncome) * 100;
}

/**
 * Get DTI recommendation based on ratio
 * @param {number} dti - Debt-to-Income ratio percentage
 * @returns {Object} Recommendation object
 */
export function getDTIRecommendation(dti) {
  if (dti <= 20) {
    return {
      level: 'healthy',
      message: 'Your debt-to-income ratio is healthy. Maintain good financial habits.',
      suggestions: [
        'Continue building emergency fund',
        'Consider investing surplus income',
        'Maintain current payment schedule',
      ],
    };
  } else if (dti <= 35) {
    return {
      level: 'moderate',
      message: 'Your debt-to-income ratio is moderate. Focus on budgeting and building emergency fund.',
      suggestions: [
        'Create a strict monthly budget',
        'Build 3-6 months emergency fund',
        'Consider increasing debt payments if possible',
        'Track expenses closely',
      ],
    };
  } else if (dti <= 50) {
    return {
      level: 'caution',
      message: 'Your debt-to-income ratio requires caution. Consider debt consolidation or refinancing.',
      suggestions: [
        'Implement debt snowball or avalanche method',
        'Explore debt consolidation options',
        'Negotiate lower interest rates with creditors',
        'Cut non-essential spending',
        'Consider balance transfer cards with 0% APR',
      ],
    };
  } else {
    return {
      level: 'urgent',
      message: 'Your debt-to-income ratio is critical. Immediate action required.',
      suggestions: [
        'Contact creditors to negotiate payment plans',
        'Consider debt consolidation or settlement',
        'Pause all non-essential spending',
        'Seek professional financial counseling',
        'Explore debt management programs',
        'Consider bankruptcy as last resort (consult attorney)',
      ],
    };
  }
}

