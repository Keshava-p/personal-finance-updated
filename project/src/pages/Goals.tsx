import { useGoals } from '../hooks/useGoals';
import { GoalTracker } from '../components/GoalTracker';

export function Goals() {
  const { goals, addGoal, updateGoalProgress, deleteGoal } = useGoals();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Savings Goals</h2>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <GoalTracker
          goals={goals}
          onAddGoal={addGoal}
          onDeleteGoal={deleteGoal}
          onUpdateProgress={updateGoalProgress}
        />
      </div>
    </div>
  );
}