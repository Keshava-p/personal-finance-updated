import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Receipt,
  Target,
  PieChart,
  Wallet,
  Settings as SettingsIcon,
  UserCircle2,
  CreditCard,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { FinanceLogo } from './ui/FinanceLogo';

const getNavigation = (t: any) => [
  { name: t('nav.dashboard'), href: '/', icon: LayoutDashboard, badge: null },
  { name: t('nav.expenses'), href: '/expenses', icon: Receipt, badge: null },
  { name: t('nav.goals'), href: '/goals', icon: Target, badge: null },
  { name: t('nav.debts'), href: '/debts', icon: CreditCard, badge: null },
  { name: t('nav.reports'), href: '/reports', icon: PieChart, badge: null },
  { name: t('nav.budget'), href: '/budget', icon: Wallet, badge: null },
  { name: t('nav.stockPrediction'), href: '/stocks', icon: TrendingUp, badge: 'AI' },
  { name: t('nav.profile'), href: '/profile', icon: UserCircle2, badge: null },
  { name: t('nav.settings'), href: '/settings', icon: SettingsIcon, badge: null },
];

export function PremiumSidebar() {
  const { t } = useTranslation();
  const location = useLocation();
  const navigation = getNavigation(t);
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? '80px' : '280px' }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className="relative backdrop-blur-xl bg-white/10 dark:bg-white/5 border-r border-white/10 flex flex-col"
    >
      {/* Logo Section */}
      <div className="h-20 border-b border-white/10 flex items-center justify-center px-6 relative">
        <AnimatePresence mode="wait">
          {!isCollapsed ? (
            <motion.div
              key="full-logo"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-3"
            >
              <FinanceLogo collapsed={false} />
              <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-violet-400 bg-clip-text text-transparent">
                FinanceHub
              </span>
            </motion.div>
          ) : (
            <motion.div
              key="collapsed-logo"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <FinanceLogo collapsed={true} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Collapse Toggle */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white/10 border border-white/20 flex items-center justify-center hover:bg-white/20 transition-colors z-10"
        >
          {isCollapsed ? (
            <ChevronRight className="h-3 w-3 text-white" />
          ) : (
            <ChevronLeft className="h-3 w-3 text-white" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {navigation.map((item, index) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href;

          return (
            <Link key={item.name} to={item.href}>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ x: isCollapsed ? 0 : 4 }}
                className={`
                  relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                  ${isActive
                    ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-400/30 text-white shadow-lg'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                  }
                  ${isCollapsed ? 'justify-center' : ''}
                `}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />

                <AnimatePresence>
                  {!isCollapsed && (
                    <motion.div
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.2 }}
                      className="flex items-center justify-between flex-1 overflow-hidden"
                    >
                      <span className="font-medium whitespace-nowrap">{item.name}</span>
                      {item.badge && (
                        <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-gradient-to-r from-violet-500 to-purple-500 text-white flex items-center gap-1">
                          <Sparkles className="h-3 w-3" />
                          {item.badge}
                        </span>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Active Indicator */}
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-cyan-400 rounded-r-full"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </motion.div>
            </Link>
          );
        })}
      </nav>
    </motion.aside>
  );
}
