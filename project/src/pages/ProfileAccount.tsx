import React from 'react';
import { motion } from 'framer-motion';
import { useProfile } from '../../hooks/useProfile';
import { useTheme } from '../../hooks/useTheme';
import { GlassCard } from '../ui/GlassCard';
import { PremiumInput } from '../ui/PremiumInput';
import { NeonButton } from '../ui/NeonButton';
import {
    User,
    Mail,
    DollarSign,
    Globe,
    Shield,
    CreditCard,
    Moon,
    Sun,
    Bell,
    Lock,
    Key,
    Crown
} from 'lucide-react';

export function ProfileAccount() {
    const { profile, updateProfile } = useProfile();
    const { theme, toggleTheme } = useTheme();
    const [isEditing, setIsEditing] = React.useState(false);

    return (
        <div className="space-y-8">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start justify-between"
            >
                <div>
                    <h1 className="text-4xl font-bold text-white mb-2">Profile & Account</h1>
                    <p className="text-white/60 text-lg">Manage your personal information and preferences</p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-400/30">
                    <Crown className="h-5 w-5 text-amber-400" />
                    <span className="text-amber-300 font-semibold">Premium Plan</span>
                </div>
            </motion.div>

            {/* Profile Information */}
            <GlassCard>
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-xl bg-cyan-500/20 border border-cyan-400/30">
                        <User className="h-6 w-6 text-cyan-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">Profile Information</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <PremiumInput
                        label="Full Name"
                        value={profile.name || ''}
                        onChange={(e) => updateProfile({ name: e.target.value })}
                        leftIcon={<User className="h-5 w-5" />}
                        placeholder="John Doe"
                    />
                    <PremiumInput
                        label="Email Address"
                        type="email"
                        value={profile.email || ''}
                        leftIcon={<Mail className="h-5 w-5" />}
                        placeholder="john@example.com"
                        disabled
                    />
                    <PremiumInput
                        label="Monthly Salary"
                        type="number"
                        value={profile.monthlySalary || ''}
                        onChange={(e) => updateProfile({ monthlySalary: parseFloat(e.target.value) })}
                        leftIcon={<DollarSign className="h-5 w-5" />}
                        placeholder="5000"
                    />
                    <div>
                        <label className="block text-sm font-medium text-white/80 mb-2">
                            Currency Preference
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Globe className="h-5 w-5 text-white/40" />
                            </div>
                            <select
                                value={profile.currencyPreference || 'USD'}
                                onChange={(e) => updateProfile({ currencyPreference: e.target.value })}
                                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/50 transition-all"
                            >
                                <option value="USD">USD - US Dollar</option>
                                <option value="EUR">EUR - Euro</option>
                                <option value="GBP">GBP - British Pound</option>
                                <option value="INR">INR - Indian Rupee</option>
                                <option value="JPY">JPY - Japanese Yen</option>
                            </select>
                        </div>
                    </div>
                </div>
            </GlassCard>

            {/* Subscription Details */}
            <GlassCard>
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-xl bg-violet-500/20 border border-violet-400/30">
                        <CreditCard className="h-6 w-6 text-violet-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">Subscription</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-4 rounded-xl bg-gradient-to-br from-amber-500/10 to-yellow-500/10 border border-amber-400/20">
                        <p className="text-sm text-white/60 mb-1">Current Plan</p>
                        <p className="text-2xl font-bold text-amber-400">Premium</p>
                    </div>
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                        <p className="text-sm text-white/60 mb-1">Billing Cycle</p>
                        <p className="text-2xl font-bold text-white">Monthly</p>
                    </div>
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                        <p className="text-sm text-white/60 mb-1">Next Billing</p>
                        <p className="text-2xl font-bold text-white">Dec 30, 2025</p>
                    </div>
                </div>

                <div className="mt-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-400/20">
                    <div className="flex items-start gap-3">
                        <Shield className="h-5 w-5 text-emerald-400 mt-0.5" />
                        <div>
                            <p className="font-semibold text-emerald-300 mb-1">Premium Benefits</p>
                            <ul className="text-sm text-white/70 space-y-1">
                                <li>• Unlimited stock predictions</li>
                                <li>• Advanced AI insights</li>
                                <li>• Priority support</li>
                                <li>• Export reports</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </GlassCard>

            {/* Account Settings */}
            <GlassCard>
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-xl bg-blue-500/20 border border-blue-400/30">
                        <Bell className="h-6 w-6 text-blue-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">Preferences</h2>
                </div>

                <div className="space-y-6">
                    {/* Theme Toggle */}
                    <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
                        <div className="flex items-center gap-3">
                            {theme === 'dark' ? (
                                <Moon className="h-5 w-5 text-indigo-400" />
                            ) : (
                                <Sun className="h-5 w-5 text-amber-400" />
                            )}
                            <div>
                                <p className="font-semibold text-white">Theme</p>
                                <p className="text-sm text-white/60">Choose your preferred theme</p>
                            </div>
                        </div>
                        <button
                            onClick={toggleTheme}
                            className={`relative w-14 h-7 rounded-full transition-colors ${theme === 'dark' ? 'bg-indigo-500' : 'bg-amber-500'
                                }`}
                        >
                            <motion.div
                                className="absolute top-1 w-5 h-5 bg-white rounded-full shadow-lg"
                                animate={{ left: theme === 'dark' ? '4px' : '32px' }}
                                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                            />
                        </button>
                    </div>

                    {/* Notifications */}
                    <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
                        <div className="flex items-center gap-3">
                            <Bell className="h-5 w-5 text-cyan-400" />
                            <div>
                                <p className="font-semibold text-white">Email Notifications</p>
                                <p className="text-sm text-white/60">Receive updates via email</p>
                            </div>
                        </div>
                        <button className="relative w-14 h-7 rounded-full bg-cyan-500">
                            <div className="absolute top-1 right-1 w-5 h-5 bg-white rounded-full shadow-lg" />
                        </button>
                    </div>
                </div>
            </GlassCard>

            {/* Security Settings */}
            <GlassCard>
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-xl bg-red-500/20 border border-red-400/30">
                        <Lock className="h-6 w-6 text-red-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">Security</h2>
                </div>

                <div className="space-y-4">
                    <button className="w-full flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all group">
                        <div className="flex items-center gap-3">
                            <Key className="h-5 w-5 text-amber-400" />
                            <div className="text-left">
                                <p className="font-semibold text-white">Change Password</p>
                                <p className="text-sm text-white/60">Update your account password</p>
                            </div>
                        </div>
                        <div className="text-white/40 group-hover:text-white transition-colors">→</div>
                    </button>

                    <button className="w-full flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all group">
                        <div className="flex items-center gap-3">
                            <Shield className="h-5 w-5 text-emerald-400" />
                            <div className="text-left">
                                <p className="font-semibold text-white">Two-Factor Authentication</p>
                                <p className="text-sm text-white/60">Add an extra layer of security</p>
                            </div>
                        </div>
                        <div className="px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 text-sm font-medium">
                            Recommended
                        </div>
                    </button>
                </div>
            </GlassCard>

            {/* Save Button */}
            <div className="flex justify-end">
                <NeonButton
                    variant="primary"
                    size="lg"
                    onClick={() => {
                        // Save logic here
                        alert('Profile updated successfully!');
                    }}
                >
                    Save Changes
                </NeonButton>
            </div>
        </div>
    );
}
