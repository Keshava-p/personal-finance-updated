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
    // Validate salary
    if (!salary || salary <= 0) {
      alert('Please enter a valid salary amount greater than 0');
      return;
    }

    try {
      setSaving(true);
      const salaryValue = Number(salary); // Ensure it's a number
      
      console.log('Saving salary:', salaryValue, 'to:', `${API_BASE}/profile/salary`);
      
      const response = await axios.post(
        `${API_BASE}/profile/salary`,
        {
          monthlySalary: salaryValue,
        },
        {
          headers: { 
            'x-user-id': profile.email || 'test@example.com',
            'Content-Type': 'application/json',
          },
        }
      );
      
      console.log('Backend response:', response.data);
      
      // Update local state with the response from backend
      const updatedSalary = response.data?.user?.monthlySalary || response.data?.monthlySalary || salaryValue;
      updateSalary(updatedSalary);
      
      if (onUpdate) onUpdate(updatedSalary);
      setEditing(false);
      
      // Update local salary state to reflect the saved value
      setSalary(updatedSalary);
      
      console.log('Salary updated successfully:', updatedSalary);
    } catch (error: any) {
      console.error('Error updating salary:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        url: error.config?.url,
      });
      
      let errorMessage = 'Failed to update salary';
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      if (error.code === 'ERR_NETWORK' || error.message.includes('Network Error')) {
        errorMessage = 'Cannot connect to backend server. Please make sure the server is running on ' + API_BASE;
      }
      
      alert(`Failed to update salary: ${errorMessage}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete/reset your salary? This will set it to 0.')) {
      return;
    }

    try {
      setSaving(true);
      const response = await axios.post(
        `${API_BASE}/profile/salary`,
        {
          monthlySalary: 0,
        },
        {
          headers: { 
            'x-user-id': profile.email || 'test@example.com',
            'Content-Type': 'application/json',
          },
        }
      );
      
      const updatedSalary = response.data?.user?.monthlySalary || 0;
      updateSalary(updatedSalary);
      
      if (onUpdate) onUpdate(updatedSalary);
      setSalary(0);
      
      console.log('Salary deleted/reset successfully');
    } catch (error: any) {
      console.error('Error deleting salary:', error);
      alert('Failed to delete salary. Please try again.');
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
            className="w-full rounded-lg border border-white/20 bg-white/10 backdrop-blur-sm text-white px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-cyan-400"
            placeholder="Enter monthly salary"
            autoFocus
          />
          <div className="flex gap-3">
            <NeonButton
              onClick={save}
              disabled={saving}
              size="sm"
            >
              <Check className="h-4 w-4 mr-2" />
              {saving ? 'Saving...' : 'Save'}
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
