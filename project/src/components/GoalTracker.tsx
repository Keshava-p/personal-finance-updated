import React, { useEffect } from 'react';
import { Goal } from '../types/expense';
import { Target, Trash2, Edit2, Check, X, Plus } from 'lucide-react';
import { useProfile } from '../hooks/useProfile';
import { useCurrency } from '../hooks/useCurrency';

interface GoalTrackerProps {
  goals: Goal[];
  onAddGoal: (goal: Omit<Goal, 'id'>) => void;
  onDeleteGoal?: (id: string) => void;
  onUpdateProgress?: (id: string, currentAmount: number) => void;
}

export function GoalTracker({ goals, onAddGoal, onDeleteGoal, onUpdateProgress }: GoalTrackerProps) {
  const [showForm, setShowForm] = React.useState(false);
  const { profile } = useProfile();
  const { format: formatMoney } = useCurrency();
  const [newGoal, setNewGoal] = React.useState({
    name: '',
    targetAmount: 0,
    currentAmount: 0,
    deadline: '',
    category: '',
    currency: profile.currencyPreference,
  });

  useEffect(() => {
    setNewGoal((prev) => ({ ...prev, currency: profile.currencyPreference }));
  }, [profile.currencyPreference]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddGoal(newGoal);
    setShowForm(false);
    setNewGoal({
      name: '',
      targetAmount: 0,
      currentAmount: 0,
      deadline: '',
      category: '',
      currency: profile.currencyPreference,
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Savings Goals</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transition-all shadow-md"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Goal
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 space-y-4 p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg border border-gray-200 dark:border-gray-600">
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
              Goal Name
            </label>
            <input
              type="text"
              placeholder="e.g., Emergency Fund, Vacation, New Car"
              value={newGoal.name}
              onChange={(e) => setNewGoal({ ...newGoal, name: e.target.value })}
              className="block w-full h-11 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-4 focus:border-cyan-500 dark:focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
              Target Amount
            </label>
            <input
              type="number"
              placeholder="0.00"
              value={newGoal.targetAmount || ''}
              onChange={(e) => setNewGoal({ ...newGoal, targetAmount: Number(e.target.value) })}
              className="block w-full h-11 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-4 focus:border-cyan-500 dark:focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500"
              step="0.01"
              min="0"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
              Current Amount / Progress
            </label>
            <input
              type="number"
              placeholder="0.00"
              value={newGoal.currentAmount || ''}
              onChange={(e) => setNewGoal({ ...newGoal, currentAmount: Number(e.target.value) })}
              className="block w-full h-11 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-4 focus:border-cyan-500 dark:focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500"
              step="0.01"
              min="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
              Target Deadline
            </label>
            <input
              type="date"
              value={newGoal.deadline}
              onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
              className="block w-full h-11 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-4 focus:border-cyan-500 dark:focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 transition-all"
              required
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="flex-1 inline-flex justify-center items-center px-4 py-2.5 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transition-all shadow-md"
            >
              <Check className="h-4 w-4 mr-2" />
              Save Goal
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2.5 border-2 border-gray-300 dark:border-gray-600 text-sm font-medium rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {goals.length === 0 ? (
        <div className="text-center py-12">
          <Target className="h-16 w-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            No savings goals yet. Create your first goal to start tracking your progress!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {goals.map((goal) => {
            return <GoalCardItem
              key={goal.id}
              goal={goal}
              onDeleteGoal={onDeleteGoal}
              onUpdateProgress={onUpdateProgress}
              formatMoney={formatMoney}
            />;
          })}
        </div>
      )}
    </div>
  );
}

interface GoalCardItemProps {
  goal: Goal;
  onDeleteGoal?: (id: string) => void;
  onUpdateProgress?: (id: string, currentAmount: number) => void;
  formatMoney: (amount: number) => string;
}

function GoalCardItem({ goal, onDeleteGoal, onUpdateProgress, formatMoney }: GoalCardItemProps) {
  const [editingProgress, setEditingProgress] = React.useState(false);
  const [currentAmount, setCurrentAmount] = React.useState(goal.currentAmount);

  React.useEffect(() => {
    setCurrentAmount(goal.currentAmount);
  }, [goal.currentAmount]);

  const progressPercent = goal.targetAmount > 0 ? (goal.currentAmount / goal.targetAmount) * 100 : 0;
  const isCompleted = progressPercent >= 100;

  const handleSaveProgress = () => {
    if (onUpdateProgress && currentAmount >= 0) {
      onUpdateProgress(goal.id, currentAmount);
      setEditingProgress(false);
    }
  };

  const handleCancel = () => {
    setCurrentAmount(goal.currentAmount);
    setEditingProgress(false);
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${goal.name}"?`)) {
      onDeleteGoal?.(goal.id);
    }
  };

  return (
    <div className="border-2 border-gray-200 dark:border-gray-700 rounded-lg p-5 bg-white dark:bg-gray-800/30 hover:shadow-lg transition-all">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1">{goal.name}</h3>
          <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
            <Target className="h-3.5 w-3.5" />
            Due {new Date(goal.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
        </div>
        {onDeleteGoal && (
          <button
            onClick={handleDelete}
            className="inline-flex items-center px-3 py-1.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 rounded-lg transition-colors font-medium text-sm"
            title="Delete goal"
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Delete
          </button>
        )}
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-3 overflow-hidden">
        <div
          className={`h-3 rounded-full transition-all duration-500 ${isCompleted
              ? 'bg-gradient-to-r from-green-500 to-emerald-500'
              : 'bg-gradient-to-r from-cyan-500 to-blue-500'
            }`}
          style={{ width: `${Math.min(progressPercent, 100)}%` }}
        ></div>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex-1">
          {editingProgress ? (
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={currentAmount}
                onChange={(e) => setCurrentAmount(Number(e.target.value))}
                className="w-36 h-9 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 focus:border-cyan-500 dark:focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                min="0"
                step="0.01"
                autoFocus
              />
              <button
                onClick={handleSaveProgress}
                className="p-1.5 text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 bg-green-100 dark:bg-green-900/30 rounded-lg transition-colors"
                title="Save progress"
              >
                <Check className="h-4 w-4" />
              </button>
              <button
                onClick={handleCancel}
                className="p-1.5 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 bg-gray-100 dark:bg-gray-700 rounded-lg transition-colors"
                title="Cancel"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                {formatMoney(goal.currentAmount)} <span className="text-gray-500 dark:text-gray-400">of</span> {formatMoney(goal.targetAmount)}
              </span>
              {onUpdateProgress && (
                <button
                  onClick={() => setEditingProgress(true)}
                  className="p-1.5 text-cyan-600 hover:text-cyan-800 dark:text-cyan-400 dark:hover:text-cyan-300 bg-cyan-100 dark:bg-cyan-900/30 rounded-lg transition-colors"
                  title="Update progress"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
              )}
            </div>
          )}
        </div>
        <span className={`text-lg font-bold ${isCompleted
            ? 'text-green-600 dark:text-green-400'
            : 'text-cyan-600 dark:text-cyan-400'
          }`}>
          {progressPercent.toFixed(1)}%
        </span>
      </div>

      {isCompleted && (
        <div className="mt-3 p-2 bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg">
          <p className="text-sm font-medium text-green-800 dark:text-green-300 text-center">
            🎉 Goal Completed! Congratulations!
          </p>
        </div>
      )}
    </div>
  );
}