import React from 'react';
import { useProfile } from '../hooks/useProfile';
import { useCurrency } from '../hooks/useCurrency';
import { ProfileForm } from '../components/profile/ProfileForm';
import { GlassCard } from '../components/ui/GlassCard';
import { MetricsCard } from '../components/ui/MetricsCard';
import { DollarSign, Globe } from 'lucide-react';

export function Profile() {
  const { profile } = useProfile();
  const { format } = useCurrency();

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white">Personal Profile</h2>
          <p className="text-sm text-white/70 mt-2">
            Keep your personal and financial preferences up to date to unlock personalized budgets and accurate insights.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <MetricsCard
            title="Monthly Salary"
            value={format(profile.monthlySalary)}
            icon={<DollarSign className="h-8 w-8" />}
            gradient="from-green-500/20 to-emerald-500/20"
          />
          <MetricsCard
            title="Currency"
            value={profile.currencyPreference}
            icon={<Globe className="h-8 w-8" />}
            gradient="from-cyan-500/20 to-blue-500/20"
          />
        </div>
      </div>

      <GlassCard className="p-6">
        <ProfileForm />
      </GlassCard>
    </div>
  );
}

