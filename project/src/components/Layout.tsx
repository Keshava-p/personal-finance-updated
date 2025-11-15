import React from 'react';
import { useLocation } from 'react-router-dom';
import { FinanceBackground } from './ui/FinanceBackground';
import { PremiumSidebar } from './PremiumSidebar';
import { PremiumHeader } from './PremiumHeader';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation();

  const getPageTitle = () => {
    const titles: Record<string, string> = {
      '/': 'Dashboard',
      '/expenses': 'Expenses',
      '/goals': 'Goals',
      '/debts': 'Debts',
      '/reports': 'Reports',
      '/budget': 'Budget',
      '/profile': 'Profile',
      '/settings': 'Settings',
    };
    return titles[location.pathname] || 'Dashboard';
  };

  return (
    <FinanceBackground>
      <div className="flex h-screen">
        <PremiumSidebar />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <PremiumHeader title={getPageTitle()} />
          
          <main className="flex-1 overflow-y-auto p-6" style={{ maxHeight: 'calc(100vh - 80px)' }}>
            {children}
          </main>
        </div>
      </div>
    </FinanceBackground>
  );
}