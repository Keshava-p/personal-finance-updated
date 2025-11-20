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
