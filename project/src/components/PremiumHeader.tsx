import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

export function PremiumHeader({ title }: { title: string }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-white/10 dark:bg-white/5 border-b border-white/20">
      <div className="flex items-center justify-between px-6 py-4">
        <h1 className="text-2xl font-bold text-white">{title}</h1>
        
        <div className="flex items-center gap-4">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl backdrop-blur-sm bg-white/10 hover:bg-white/20 border border-white/20 transition-all"
          >
            {theme === 'dark' ? (
              <Sun className="h-5 w-5 text-white" />
            ) : (
              <Moon className="h-5 w-5 text-white" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}

