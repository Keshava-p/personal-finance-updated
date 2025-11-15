import React, { useEffect } from 'react';
import { Goal } from '../types/expense';
import { Target, Trash2, Edit2, Check, X } from 'lucide-react';
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
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Savings Goals</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-indigo-600 bg-indigo-100 hover:bg-indigo-200"
        >
          <Target className="h-4 w-4 mr-1" />
          Add Goal
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 space-y-4">
          <input
            type="text"
            placeholder="Goal Name"
            value={newGoal.name}
            onChange={(e) => setNewGoal({ ...newGoal, name: e.target.value })}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
          />
          <input
            type="number"
            placeholder="Target Amount"
            value={newGoal.targetAmount}
            onChange={(e) => setNewGoal({ ...newGoal, targetAmount: Number(e.target.value) })}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
          />
          <input
            type="number"
            placeholder="Current Amount / Progress"
            value={newGoal.currentAmount}
            onChange={(e) => setNewGoal({ ...newGoal, currentAmount: Number(e.target.value) })}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            min="0"
          />
          <input
            type="date"
            value={newGoal.deadline}
            onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
          />
          <button
            type="submit"
            className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Save Goal
          </button>
        </form>
      )}

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

  return (
    <div className="border rounded-lg p-4 dark:border-gray-700">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-medium text-gray-900 dark:text-white">{goal.name}</h3>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Due {new Date(goal.deadline).toLocaleDateString()}
          </span>
          {onDeleteGoal && (
            <button
              onClick={() => {
                if (window.confirm(`Are you sure you want to delete "${goal.name}"?`)) {
                  onDeleteGoal(goal.id);
                }
              }}
              className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 p-1 rounded transition-colors"
              title="Delete goal"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-3">
        <div
          className="bg-indigo-600 h-2.5 rounded-full"
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
                className="w-32 rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-2 py-1"
                min="0"
                step="0.01"
                autoFocus
              />
              <button
                onClick={handleSaveProgress}
                className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 p-1 rounded transition-colors"
                title="Save progress"
              >
                <Check className="h-4 w-4" />
              </button>
              <button
                onClick={handleCancel}
                className="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 p-1 rounded transition-colors"
                title="Cancel"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {formatMoney(goal.currentAmount)} of {formatMoney(goal.targetAmount)}
              </span>
              {onUpdateProgress && (
                <button
                  onClick={() => setEditingProgress(true)}
                  className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 p-1 rounded transition-colors"
                  title="Update progress"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
              )}
            </div>
          )}
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {progressPercent.toFixed(1)}%
        </span>
      </div>
    </div>
  );
}