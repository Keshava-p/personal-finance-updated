import React, { useState } from 'react';
import { formatCurrency } from '../../utils/currency';
import { useTranslation } from 'react-i18next';

export interface GoalCardData {
  id: string;
  goalName: string;
  targetAmount: number;
  currentSaved: number;
  deadline?: string;
}

interface GoalCardProps {
  goal: GoalCardData;
  currency?: string;
  onUpdated?: (goal: GoalCardData) => void;
}

export const GoalCard: React.FC<GoalCardProps> = ({ goal, currency = 'INR', onUpdated }) => {
  const { t } = useTranslation();
  const [editing, setEditing] = useState(false);
  const [targetAmount, setTargetAmount] = useState(goal.targetAmount);
  const [currentSaved, setCurrentSaved] = useState(goal.currentSaved);

  const progress = Math.min(100, targetAmount > 0 ? Math.round((currentSaved / targetAmount) * 100) : 0);

  const handleSave = () => {
    const updatedGoal: GoalCardData = {
      ...goal,
      targetAmount,
      currentSaved,
    };
    onUpdated?.(updatedGoal);
    alert(t('goal.goalUpdated'));
    setEditing(false);
  };

  return (
    <div className="goal-card p-3">
      <h4>{goal.goalName}</h4>
      <div>
        <strong>{formatCurrency(currentSaved, currency)}</strong> / <span>{formatCurrency(targetAmount, currency)}</span>
      </div>
      <div aria-hidden style={{ width: '100%', background: '#eee', height: 10, marginTop: 8 }}>
        <div style={{ width: `${progress}%`, height: '100%', background: '#4caf50' }} />
      </div>
      <div>{t('goal.progressText', { percent: progress })}</div>

      {editing ? (
        <>
          <div>
            <label>Target</label>
            <input
              type="number"
              value={targetAmount}
              onChange={(e) => setTargetAmount(Number(e.target.value))}
            />
          </div>
          <div>
            <label>Saved</label>
            <input
              type="number"
              value={currentSaved}
              onChange={(e) => setCurrentSaved(Number(e.target.value))}
            />
          </div>
          <button onClick={handleSave}>Save</button>
          <button onClick={() => setEditing(false)}>Cancel</button>
        </>
      ) : (
        <button onClick={() => setEditing(true)}>Edit Goal</button>
      )}
    </div>
  );
};
