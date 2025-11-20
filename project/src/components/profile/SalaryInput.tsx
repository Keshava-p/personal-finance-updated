import React, { useEffect, useState } from 'react';
import { useCurrency } from '../../hooks/useCurrency';
import { useProfile } from '../../hooks/useProfile';
import { NeonButton } from '../ui/NeonButton';
import { DollarSign, Edit2, Check, X, Trash2 } from 'lucide-react';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const SalaryInput: React.FC<{ initial?: number; currency?: string; onUpdate?: (val: number) => void }> = ({ initial = 0, currency = 'INR', onUpdate }) => {
  const { format } = useCurrency();
  const { profile, updateSalary } = useProfile();
  const [salary, setSalary] = useState<number>(initial);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const currentSalary = initial || profile.monthlySalary || 0;
    if (currentSalary !== salary && !editing) {
      setSalary(currentSalary);
    }
  }, [initial, profile.monthlySalary]);

  const save = async () => {
    if (!salary || salary <= 0) {
      alert('Please enter a valid salary amount greater than 0');
      return;
    }

    try {
      setSaving(true);
      const salaryValue = Number(salary);

      console.log("Saving salary:", salaryValue, "to:", `${API_BASE}/salary`);

      const response = await axios.put(
        `${API_BASE}/salary`,
        { salary: salaryValue },   // ✅ FIXED FIELD NAME
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Backend response:", response.data);

      const updatedSalary = response.data?.user?.salary || salaryValue; // ✅ FIXED FIELD NAME

      updateSalary(updatedSalary);
      if (onUpdate) onUpdate(updatedSalary);
      setEditing(false);
      setSalary(updatedSalary);

      console.log("Salary updated successfully:", updatedSalary);

    } catch (error: any) {
      console.error("Error updating salary:", error);

      let errorMessage = error.response?.data?.message || error.message;

      if (error.code === "ERR_NETWORK") {
        errorMessage = "Cannot connect to backend server: " + API_BASE;
      }

      alert("Failed to update salary: " + errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete/reset your salary?")) return;

    try {
      setSaving(true);

      const response = await axios.put(
        `${API_BASE}/salary`,
        { salary: 0 },   // ✅ FIXED FIELD NAME
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      const updatedSalary = response.data?.user?.salary || 0;  // ✅ FIXED FIELD NAME
      updateSalary(updatedSalary);

      if (onUpdate) onUpdate(updatedSalary);
      setSalary(0);

      console.log("Salary deleted/reset successfully");

    } catch (error) {
      console.error("Error deleting salary:", error);
      alert("Failed to delete salary.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-white/80 mb-2">
        Monthly Salary
      </label>

      {!editing ? (
        <div className="flex items-center justify-between p-4 rounded-lg border border-white/20 bg-white/5">
          <div className="flex items-center gap-3">
            <DollarSign className="h-5 w-5 text-cyan-400" />
            <span className="text-2xl font-bold text-white">{format(salary)}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setEditing(true)}
              className="p-2 text-cyan-400 hover:bg-cyan-400/20 rounded-lg transition-colors"
              title="Edit salary"
            >
              <Edit2 className="h-5 w-5" />
            </button>

            {salary > 0 && (
              <button
                onClick={handleDelete}
                className="p-2 text-red-400 hover:bg-red-400/20 rounded-lg transition-colors"
                title="Delete/Reset salary"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <input
            type="number"
            value={salary}
            onChange={(e) => setSalary(Number(e.target.value))}
            className="w-full rounded-lg border border-white/20 bg-white/10 text-white px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-cyan-400"
            placeholder="Enter monthly salary"
            autoFocus
          />

          <div className="flex gap-3">
            <NeonButton onClick={save} disabled={saving} size="sm">
              <Check className="h-4 w-4 mr-2" />
              {saving ? "Saving..." : "Save"}
            </NeonButton>

            <button
              onClick={() => {
                setEditing(false);
                setSalary(initial || profile.monthlySalary || 0);
              }}
              className="px-4 py-2 rounded-xl text-white/80 bg-white/10 hover:bg-white/20 border border-white/20 transition-all flex items-center gap-2"
            >
              <X className="h-4 w-4" />
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
