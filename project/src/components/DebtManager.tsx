import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit2, Trash2, TrendingUp, AlertTriangle, Info, X } from 'lucide-react';
import { useProfile } from '../hooks/useProfile';
import { useCurrency } from '../hooks/useCurrency';
import { format } from 'date-fns';
import { GlassCard } from './ui/GlassCard';
import { NeonButton } from './ui/NeonButton';
import { MetricsCard } from './ui/MetricsCard';
import { AnimatedProgressBar } from './ui/AnimatedProgressBar';
import { motion, AnimatePresence } from 'framer-motion';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface Debt {
  _id: string;
  name: string;
  principal: number;
  monthlyPayment: number;
  apr: number;
  startDate: string;
  currency: string;
  notes?: string;
  projection?: {
    monthsToPayoff: number;
    totalInterest: number;
    totalPaid: number;
    projectedPayoffDate: string;
    warning?: string;
  };
}

interface DebtSummary {
  totalDebt: number;
  totalMonthlyPayment: number;
  monthlyIncome: number;
  dti: number;
  recommendation: {
    level: 'healthy' | 'moderate' | 'caution' | 'urgent';
    message: string;
    suggestions: string[];
  };
}

export function DebtManager() {
  const { profile } = useProfile();
  const { format: formatMoney, currency } = useCurrency();
  const [debts, setDebts] = useState<Debt[]>([]);
  const [summary, setSummary] = useState<DebtSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingDebt, setEditingDebt] = useState<Debt | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    principal: '',
    monthlyPayment: '',
    apr: '',
    notes: '',
  });

  useEffect(() => {
    fetchDebts();
  }, []);

  const fetchDebts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE}/debts`, {
        headers: { 'x-user-id': profile.email || 'test@example.com' },
      });
      setDebts(response.data.debts || []);
      setSummary(response.data.summary || null);
    } catch (error) {
      console.error('Error fetching debts:', error);
      setDebts([]);
      setSummary(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        name: formData.name,
        principal: parseFloat(formData.principal),
        monthlyPayment: parseFloat(formData.monthlyPayment),
        apr: parseFloat(formData.apr),
        currency: currency,
        notes: formData.notes,
      };

      if (editingDebt) {
        await axios.put(`${API_BASE}/debts/${editingDebt._id}`, payload, {
          headers: { 'x-user-id': profile.email || 'test@example.com' },
        });
      } else {
        await axios.post(`${API_BASE}/debts`, payload, {
          headers: { 'x-user-id': profile.email || 'test@example.com' },
        });
      }

      setShowForm(false);
      setEditingDebt(null);
      setFormData({ name: '', principal: '', monthlyPayment: '', apr: '', notes: '' });
      fetchDebts();
    } catch (error) {
      console.error('Error saving debt:', error);
      alert('Failed to save debt. Please check your connection and try again.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this debt?')) return;
    try {
      await axios.delete(`${API_BASE}/debts/${id}`, {
        headers: { 'x-user-id': profile.email || 'test@example.com' },
      });
      fetchDebts();
    } catch (error) {
      console.error('Error deleting debt:', error);
      alert('Failed to delete debt');
    }
  };

  const handleEdit = (debt: Debt) => {
    setEditingDebt(debt);
    setFormData({
      name: debt.name,
      principal: debt.principal.toString(),
      monthlyPayment: debt.monthlyPayment.toString(),
      apr: debt.apr.toString(),
      notes: debt.notes || '',
    });
    setShowForm(true);
  };

  // 🚀 ADD PAYMENT FUNCTION
  const addPayment = async (id: string) => {
    const amount = prompt("Enter amount paid:");

    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      return alert("Enter a valid amount");
    }

    try {
      await axios.put(`${API_BASE}/debts/${id}/pay`,
        { amountPaid: Number(amount) },
        { headers: { 'x-user-id': profile.email || 'test@example.com' } }
      );
      fetchDebts();
    } catch (err) {
      console.error(err);
      alert("Failed to update payment");
    }
  };

  // 🚀 MARK AS PAID FUNCTION
  const markAsPaid = async (id: string) => {
    try {
      await axios.put(`${API_BASE}/debts/${id}/paid`, {}, {
        headers: { 'x-user-id': profile.email || 'test@example.com' }
      });
      fetchDebts();
    } catch (err) {
      console.error(err);
      alert("Failed to mark as paid");
    }
  };

  const getRecommendationColor = (level: string) => {
    switch (level) {
      case 'healthy': return 'text-green-400';
      case 'moderate': return 'text-yellow-400';
      case 'caution': return 'text-orange-400';
      case 'urgent': return 'text-red-400';
      default: return 'text-white/60';
    }
  };

  const getRecommendationIcon = (level: string) => {
    switch (level) {
      case 'healthy': return <TrendingUp className="h-5 w-5" />;
      case 'moderate': return <Info className="h-5 w-5" />;
      case 'caution': return <AlertTriangle className="h-5 w-5" />;
      case 'urgent': return <AlertTriangle className="h-5 w-5" />;
      default: return <Info className="h-5 w-5" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-cyan-400 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-white">Debt Manager</h2>
        <NeonButton
          onClick={() => {
            setShowForm(!showForm);
            setEditingDebt(null);
            setFormData({ name: '', principal: '', monthlyPayment: '', apr: '', notes: '' });
          }}
        >
          <Plus className="h-5 w-5 mr-2" />
          {showForm ? 'Cancel' : 'Add Debt'}
        </NeonButton>
      </div>

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <MetricsCard title="Total Debt" value={formatMoney(summary.totalDebt)} gradient="from-red-500/20 to-orange-500/20" />
          <MetricsCard title="Monthly Payments" value={formatMoney(summary.totalMonthlyPayment)} gradient="from-orange-500/20 to-yellow-500/20" />
          <MetricsCard title="Monthly Income" value={formatMoney(summary.monthlyIncome)} gradient="from-green-500/20 to-emerald-500/20" />
          <MetricsCard title="Debt-to-Income" value={`${summary.dti.toFixed(1)}%`} subtitle={summary.recommendation.level} />
        </div>
      )}

      {/* Recommendation */}
      {summary && (
        <GlassCard className="p-6">
          <div className="flex items-start gap-4 p-4 rounded-xl border-2">
            <div>{getRecommendationIcon(summary.recommendation.level)}</div>
            <div className="flex-1">
              <h4 className="text-xl font-bold mb-2">{summary.recommendation.level.toUpperCase()}</h4>
              <p className="text-white/80 mb-3">{summary.recommendation.message}</p>
            </div>
          </div>
        </GlassCard>
      )}

      {/* Debt List */}
      <div className="space-y-4">
        {debts.map((debt, idx) => (
          <motion.div key={debt._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <GlassCard className="p-6">

              {/* Header */}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">{debt.name}</h3>
                  <p className="text-sm text-white/60">Started: {format(new Date(debt.startDate), 'MMM d, yyyy')}</p>
                </div>

                <div className="flex gap-2">
                  <button onClick={() => handleEdit(debt)} className="p-2 text-cyan-400 hover:bg-cyan-400/20 rounded-lg transition-colors">
                    <Edit2 className="h-5 w-5" />
                  </button>
                  <button onClick={() => handleDelete(debt._id)} className="p-2 text-red-400 hover:bg-red-400/20 rounded-lg transition-colors">
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div>
                  <p className="text-sm text-white/60 mb-1">Principal</p>
                  <p className="text-xl font-bold text-white">{formatMoney(debt.principal)}</p>
                </div>
                <div>
                  <p className="text-sm text-white/60 mb-1">Monthly Payment</p>
                  <p className="text-xl font-bold text-white">{formatMoney(debt.monthlyPayment)}</p>
                </div>
                <div>
                  <p className="text-sm text-white/60 mb-1">APR</p>
                  <p className="text-xl font-bold text-white">{debt.apr}%</p>
                </div>
                {debt.projection && (
                  <div>
                    <p className="text-sm text-white/60 mb-1">Payoff Time</p>
                    <p className="text-xl font-bold text-white">
                      {debt.projection.monthsToPayoff === Infinity ? '∞' : `${debt.projection.monthsToPayoff} months`}
                    </p>
                  </div>
                )}
              </div>

              {/* Projection */}
              {debt.projection && (
                <GlassCard className="p-4 bg-white/5">
                  <h4 className="text-sm font-semibold text-white mb-3">Payoff Projection</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-white/60">Total Interest</p>
                      <p className="font-semibold text-white">{formatMoney(debt.projection.totalInterest)}</p>
                    </div>
                    <div>
                      <p className="text-white/60">Total Paid</p>
                      <p className="font-semibold text-white">{formatMoney(debt.projection.totalPaid)}</p>
                    </div>
                    <div>
                      <p className="text-white/60">Projected Payoff</p>
                      <p className="font-semibold text-white">
                        {format(new Date(debt.projection.projectedPayoffDate), 'MMM yyyy')}
                      </p>
                    </div>
                    <div>
                      <p className="text-white/60">Remaining</p>
                      <p className="font-semibold text-white">{formatMoney(debt.projection.remainingPrincipal || debt.principal)}</p>
                    </div>
                  </div>
                </GlassCard>
              )}

              {/* Notes */}
              {debt.notes && (
                <div className="mt-4 p-3 bg-cyan-500/10 rounded-lg border border-cyan-400/20">
                  <p className="text-sm text-white/80">{debt.notes}</p>
                </div>
              )}

              {/* 🚀 ACTION BUTTONS (FINAL ADDED BLOCK) */}
              <div className="mt-6 flex gap-3">

                <button
                  onClick={() => addPayment(debt._id)}
                  className="px-4 py-2 bg-cyan-600/30 text-cyan-300 border border-cyan-400/40 rounded-lg hover:bg-cyan-600/50 transition-all"
                >
                  Add Payment
                </button>

                <button
                  onClick={() => markAsPaid(debt._id)}
                  className="px-4 py-2 bg-green-600/30 text-green-300 border border-green-400/40 rounded-lg hover:bg-green-600/50 transition-all"
                >
                  Mark as Paid
                </button>

                <button
                  onClick={() => handleDelete(debt._id)}
                  className="px-4 py-2 bg-red-600/30 text-red-300 border border-red-400/40 rounded-lg hover:bg-red-600/50 transition-all"
                >
                  Delete Debt
                </button>
              </div>

            </GlassCard>
          </motion.div>
        ))}
      </div>

      {debts.length === 0 && !showForm && (
        <GlassCard className="p-12 text-center">
          <p className="text-white/60 text-lg">No debts recorded. Add your first debt to get started.</p>
        </GlassCard>
      )}
    </div>
  );
}
