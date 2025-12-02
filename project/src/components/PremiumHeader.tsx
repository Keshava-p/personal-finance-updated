import React, { useState, useCallback, useEffect } from "react";
import { Moon, Sun, LogOut, Loader2, Bell, Search } from "lucide-react";
import { useTheme } from "../hooks/useTheme";
import { useAuth } from "../contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { SearchBar } from "./SearchBar";
import { NotificationDropdown } from "./NotificationDropdown";

export function PremiumHeader({ title }: { title: string }) {
  const { theme, toggleTheme } = useTheme();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSearch, setShowSearch] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const handleLogout = useCallback(async () => {
    try {
      setIsLoggingOut(true);
      setError(null);
      await new Promise(resolve => setTimeout(resolve, 500));
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

  // Keyboard shortcut for search (Cmd/Ctrl + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowSearch(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      {/* HEADER */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-white/10 dark:bg-white/5 border-b border-white/10 shadow-fintech-sm">
        <div className="flex items-center justify-between px-8 py-4">
          {/* Title */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-3xl font-bold text-white tracking-tight">{title}</h1>
          </motion.div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* Search */}
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowSearch(true)}
              className="p-3 rounded-xl backdrop-blur-sm bg-white/10 hover:bg-white/15 border border-white/10 transition-all group"
              title="Search (⌘K)"
            >
              <Search className="h-5 w-5 text-white/70 group-hover:text-white transition-colors" />
            </motion.button>

            {/* Notifications */}
            <motion.div className="relative">
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.15 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-3 rounded-xl backdrop-blur-sm bg-white/10 hover:bg-white/15 border border-white/10 transition-all group"
                title="Notifications"
              >
                <Bell className="h-5 w-5 text-white/70 group-hover:text-white transition-colors" />
                {/* Notification Badge */}
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white/20" />
              </motion.button>

              <NotificationDropdown
                isOpen={showNotifications}
                onClose={() => setShowNotifications(false)}
              />
            </motion.div>

            {/* Theme Toggle */}
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              className="p-3 rounded-xl backdrop-blur-sm bg-white/10 hover:bg-white/15 border border-white/10 transition-all"
              title={theme === "dark" ? "Light Mode" : "Dark Mode"}
            >
              <AnimatePresence mode="wait">
                {theme === "dark" ? (
                  <motion.div
                    key="sun"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Sun className="h-5 w-5 text-amber-400" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="moon"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Moon className="h-5 w-5 text-indigo-400" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>

            {/* Divider */}
            <div className="w-px h-8 bg-white/10" />

            {/* LOGOUT BUTTON */}
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.25 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowConfirm(true)}
              className="flex items-center gap-2 px-5 py-3 rounded-xl 
                         backdrop-blur-sm bg-red-500/20 hover:bg-red-500/30 
                         border border-red-400/30 hover:border-red-400/50 text-red-200 
                         transition-all font-medium"
            >
              <LogOut className="h-5 w-5" />
              <span className="hidden sm:inline">Logout</span>
            </motion.button>
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
            className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4"
            onClick={() => setShowConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white/10 dark:bg-white/5 p-8 rounded-2xl border border-white/20 backdrop-blur-xl shadow-2xl text-center max-w-md w-full"
            >
              {/* Icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-500/20 border-2 border-red-400/50 flex items-center justify-center"
              >
                <LogOut className="h-8 w-8 text-red-400" />
              </motion.div>

              <h2 className="text-2xl font-bold text-white mb-3">
                Confirm Logout
              </h2>
              <p className="text-white/70 mb-8">
                Are you sure you want to logout from your account?
              </p>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 bg-red-500/20 border border-red-400/30 rounded-xl text-red-300 text-sm"
                >
                  {error}
                </motion.div>
              )}

              <div className="flex gap-4">
                {/* CANCEL */}
                <button
                  onClick={() => setShowConfirm(false)}
                  className="flex-1 px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium transition-all border border-white/10 hover:border-white/20"
                >
                  Cancel
                </button>

                {/* YES LOGOUT */}
                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className={`flex-1 px-6 py-3 rounded-xl flex items-center justify-center gap-2 font-medium transition-all ${isLoggingOut
                    ? 'bg-red-600 cursor-not-allowed opacity-70'
                    : 'bg-red-500 hover:bg-red-600 hover:shadow-lg'
                    } text-white`}
                >
                  {isLoggingOut ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Logging out...
                    </>
                  ) : (
                    'Yes, Logout'
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search Bar */}
      <SearchBar isOpen={showSearch} onClose={() => setShowSearch(false)} />
    </>
  );
}
