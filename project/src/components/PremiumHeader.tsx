import React, { useState, useCallback } from "react";
import { Moon, Sun, LogOut, Loader2 } from "lucide-react";
import { useTheme } from "../hooks/useTheme";
import { useAuth } from "../contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

export function PremiumHeader({ title }: { title: string }) {
  const { theme, toggleTheme } = useTheme();
  const { logout } = useAuth();
  const navigate = useNavigate();
  
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogout = useCallback(async () => {
    try {
      setIsLoggingOut(true);
      setError(null);
      await new Promise(resolve => setTimeout(resolve, 500)); // Small delay for better UX
      logout();
      navigate('/login');
    } catch (err) {
      console.error('Logout failed:', err);
      setError('Failed to logout. Please try again.');
    } finally {
      setIsLoggingOut(false);
      setShowConfirm(false);
    }
  }, [logout, navigate]);

  return (
    <>
      {/* HEADER */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-white/10 dark:bg-white/5 border-b border-white/20">
        <div className="flex items-center justify-between px-6 py-4">
          <h1 className="text-2xl font-bold text-white">{title}</h1>

          <div className="flex items-center gap-4">

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl backdrop-blur-sm bg-white/10 hover:bg-white/20 border border-white/20 transition-all"
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5 text-white" />
              ) : (
                <Moon className="h-5 w-5 text-white" />
              )}
            </button>

            {/* LOGOUT BUTTON */}
            <button
              onClick={() => setShowConfirm(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl 
                         backdrop-blur-sm bg-red-500/20 hover:bg-red-500/30 
                         border border-red-400/40 text-red-200 
                         transition-all"
            >
              <LogOut className="h-5 w-5" />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* CONFIRMATION POPUP */}
      <AnimatePresence>
        {showConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white/10 dark:bg-white/5 p-6 rounded-2xl border border-white/20 backdrop-blur-xl shadow-xl text-center w-80"
            >
              <h2 className="text-xl font-semibold text-white mb-4">
                Are you sure?
              </h2>
              <p className="text-white/70 mb-6">
                Do you really want to logout?
              </p>

              <div className="flex flex-col gap-4">
                {error && (
                  <div className="text-red-300 text-sm p-2 bg-red-500/20 rounded-lg">
                    {error}
                  </div>
                )}
                <div className="flex justify-center gap-4">
                {/* CANCEL */}
                <button
                  onClick={() => setShowConfirm(false)}
                  className="px-4 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white transition-all"
                >
                  No
                </button>

                {/* YES LOGOUT */}
                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className={`px-4 py-2 rounded-xl flex items-center gap-2 ${
                    isLoggingOut 
                      ? 'bg-red-600 cursor-not-allowed' 
                      : 'bg-red-500 hover:bg-red-600'
                  } text-white transition-all`}
                >
                  {isLoggingOut ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Logging out...
                    </>
                  ) : (
                    'Yes, Logout'
                  )}
                </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
