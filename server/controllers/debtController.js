import Debt from "../models/Debt.js";
import User from "../models/User.js";
import {
  calculateDebtPayoff,
  calculateDTI,
  getDTIRecommendation,
} from "../utils/debtCalculator.js";

export const getDebts = async (req, res) => {
  try {
    const userId = req.user.id;

    const debts = await Debt.find({ userId }).sort({ createdAt: -1 });
    const user = await User.findById(userId);

    const debtsWithProjections = debts.map((debt) => {
      const projection = calculateDebtPayoff(
        debt.principal,
        debt.monthlyPayment,
        debt.apr / 100
      );
      return {
        ...debt.toObject(),
        projection,
      };
    });

    const totalDebt = debts.reduce((sum, d) => sum + d.principal, 0);
    const totalMonthlyPayment = debts.reduce(
      (sum, d) => sum + d.monthlyPayment,
      0
    );

    // Use NEW salary field
    const monthlyIncome = user?.salary || 0;

    const dti = calculateDTI(totalMonthlyPayment, monthlyIncome);
    const recommendation = getDTIRecommendation(dti);

    res.json({
      debts: debtsWithProjections,
      summary: {
        totalDebt,
        totalMonthlyPayment,
        monthlyIncome,
        dti,
        recommendation,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const createDebt = async (req, res) => {
  try {
    const userId = req.user.id;

    const debt = await Debt.create({
      ...req.body,
      userId,
    });

    const projection = calculateDebtPayoff(
      debt.principal,
      debt.monthlyPayment,
      debt.apr / 100
    );

    res.status(201).json({
      success: true,
      ...debt.toObject(),
      projection,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const updateDebt = async (req, res) => {
  try {
    const userId = req.user.id;

    const debt = await Debt.findOneAndUpdate(
      { _id: req.params.id, userId },
      { $set: req.body },
      { new: true }
    );

    if (!debt) {
      return res.status(404).json({ success: false, error: "Debt not found" });
    }

    const projection = calculateDebtPayoff(
      debt.principal,
      debt.monthlyPayment,
      debt.apr / 100
    );

    res.json({
      success: true,
      ...debt.toObject(),
      projection,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const deleteDebt = async (req, res) => {
  try {
    const userId = req.user.id;

    const debt = await Debt.findOneAndDelete({
      _id: req.params.id,
      userId,
    });

    if (!debt) {
      return res.status(404).json({ success: false, error: "Debt not found" });
    }

    res.json({ success: true, message: "Debt deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Record a payment for a debt
export const recordPayment = async (req, res) => {
  try {
    const userId = req.user.id;
    const { amount, principalPaid, interestPaid, notes } = req.body;

    const debt = await Debt.findOne({ _id: req.params.id, userId });

    if (!debt) {
      return res.status(404).json({ success: false, error: "Debt not found" });
    }

    // Add payment to history
    debt.paymentHistory.push({
      amount,
      principalPaid: principalPaid || amount,
      interestPaid: interestPaid || 0,
      notes,
      date: new Date()
    });

    // Update current balance
    if (debt.currentBalance) {
      debt.currentBalance -= (principalPaid || amount);
      if (debt.currentBalance <= 0) {
        debt.currentBalance = 0;
        debt.status = 'paid_off';
      }
    }

    await debt.save();

    res.json({ success: true, debt });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get debt payoff strategies (snowball vs avalanche)
export const getPayoffStrategies = async (req, res) => {
  try {
    const userId = req.user.id;
    const debts = await Debt.find({ userId, status: 'active' }).sort({ createdAt: -1 });

    if (debts.length === 0) {
      return res.json({ success: true, message: "No active debts found" });
    }

    // Snowball: Sort by balance (smallest first)
    const snowball = [...debts].sort((a, b) =>
      (a.currentBalance || a.principal) - (b.currentBalance || b.principal)
    );

    // Avalanche: Sort by APR (highest first)
    const avalanche = [...debts].sort((a, b) => b.apr - a.apr);

    // Calculate total interest for each strategy
    const calculateTotalInterest = (sortedDebts) => {
      let totalInterest = 0;
      sortedDebts.forEach(debt => {
        const balance = debt.currentBalance || debt.principal;
        const projection = calculateDebtPayoff(balance, debt.monthlyPayment, debt.apr / 100);
        totalInterest += projection.totalInterest || 0;
      });
      return totalInterest;
    };

    const snowballInterest = calculateTotalInterest(snowball);
    const avalancheInterest = calculateTotalInterest(avalanche);

    res.json({
      success: true,
      strategies: {
        snowball: {
          method: 'Pay smallest balance first',
          order: snowball.map(d => ({ id: d._id, name: d.name, balance: d.currentBalance || d.principal })),
          totalInterest: snowballInterest,
          recommended: snowballInterest > avalancheInterest ? false : true
        },
        avalanche: {
          method: 'Pay highest interest rate first',
          order: avalanche.map(d => ({ id: d._id, name: d.name, apr: d.apr })),
          totalInterest: avalancheInterest,
          recommended: avalancheInterest <= snowballInterest ? true : false
        },
        interestSaved: Math.abs(snowballInterest - avalancheInterest)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
