import { useState, useEffect } from 'react';
import { Goal } from '../types/expense';

export function useGoals() {
  const [goals, setGoals] = useState<Goal[]>(() => {
    const saved = localStorage.getItem('goals');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('goals', JSON.stringify(goals));
  }, [goals]);

  const addGoal = (goal: Omit<Goal, 'id'>) => {
    const newGoal: Goal = {
      ...goal,
      id: crypto.randomUUID(),
    };
    setGoals((prev) => [...prev, newGoal]);
  };

  const updateGoalProgress = (id: string, currentAmount: number) => {
    setGoals((prev) =>
      prev.map((g) => (g.id === id ? { ...g, currentAmount } : g))
    );
  };

  const deleteGoal = (id: string) => {
    setGoals((prev) => prev.filter((g) => g.id !== id));
  };

  return { goals, addGoal, updateGoalProgress, deleteGoal };
}