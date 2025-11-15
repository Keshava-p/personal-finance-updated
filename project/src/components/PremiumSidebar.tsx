import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Receipt,
  Target,
  PieChart,
  Wallet,
  Settings as SettingsIcon,
  UserCircle2,
  CreditCard,
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Expenses', href: '/expenses', icon: Receipt },
  { name: 'Goals', href: '/goals', icon: Target },
  { name: 'Debts', href: '/debts', icon: CreditCard },
  { name: 'Reports', href: '/reports', icon: PieChart },
  { name: 'Budget', href: '/budget', icon: Wallet },
  { name: 'Profile', href: '/profile', icon: UserCircle2 },
  { name: 'Settings', href: '/settings', icon: SettingsIcon },
];

export function PremiumSidebar() {
  const location = useLocation();

  return (
    <aside className="w-64 backdrop-blur-xl bg-white/10 dark:bg-white/5 border-r border-white/20">
      <div className="flex items-center justify-center h-20 border-b border-white/20">
        <Wallet className="h-10 w-10 text-cyan-400" />
        <span className="ml-3 text-2xl font-bold text-white">FinanceHub</span>
      </div>
      
      <nav className="mt-8 px-4">
        {navigation.map((item, index) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href;
          
          return (
            <Link key={item.name} to={item.href}>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ x: 4 }}
                className={`
                  flex items-center px-4 py-3 mb-2 rounded-xl transition-all duration-300
                  ${isActive 
                    ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-400/30 text-white' 
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                  }
                `}
              >
                <Icon className="h-5 w-5 mr-3" />
                <span className="font-medium">{item.name}</span>
              </motion.div>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

