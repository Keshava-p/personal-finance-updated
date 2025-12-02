import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Bell,
    TrendingUp,
    AlertCircle,
    CheckCircle,
    Clock,
    X,
    Target,
    Calendar
} from 'lucide-react';

// Notification types
type NotificationType = 'prediction' | 'alert' | 'reminder';

interface Notification {
    id: string;
    type: NotificationType;
    title: string;
    message: string;
    timestamp: Date;
    read: boolean;
    icon?: React.ReactNode;
    color?: string;
}

interface NotificationDropdownProps {
    isOpen: boolean;
    onClose: () => void;
}

// Mock notifications - in production, these would come from an API/state management
const MOCK_NOTIFICATIONS: Notification[] = [
    {
        id: '1',
        type: 'prediction',
        title: 'Stock Prediction Complete',
        message: 'AAPL predicted at $185.50 for Dec 15, 2025',
        timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
        read: false,
        icon: <TrendingUp className="h-5 w-5" />,
        color: 'cyan',
    },
    {
        id: '2',
        type: 'alert',
        title: 'Market Closed',
        message: 'Stock market is closed for the weekend',
        timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
        read: false,
        icon: <AlertCircle className="h-5 w-5" />,
        color: 'amber',
    },
    {
        id: '3',
        type: 'alert',
        title: 'Goal Achievement',
        message: 'You reached 75% of your savings goal!',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        read: true,
        icon: <Target className="h-5 w-5" />,
        color: 'emerald',
    },
    {
        id: '4',
        type: 'reminder',
        title: 'Bill Due Soon',
        message: 'Electricity bill due in 3 days - $125.00',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
        read: false,
        icon: <Calendar className="h-5 w-5" />,
        color: 'red',
    },
    {
        id: '5',
        type: 'prediction',
        title: 'Stock Prediction Complete',
        message: 'TSLA predicted at $245.30 for Dec 10, 2025',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
        read: true,
        icon: <TrendingUp className="h-5 w-5" />,
        color: 'cyan',
    },
];

export function NotificationDropdown({ isOpen, onClose }: NotificationDropdownProps) {
    const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
    const [filter, setFilter] = useState<'all' | NotificationType>('all');

    const unreadCount = notifications.filter(n => !n.read).length;

    const filteredNotifications = filter === 'all'
        ? notifications
        : notifications.filter(n => n.type === filter);

    const markAsRead = (id: string) => {
        setNotifications(prev =>
            prev.map(n => n.id === id ? { ...n, read: true } : n)
        );
    };

    const markAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    const clearAll = () => {
        setNotifications([]);
    };

    const getTimeAgo = (date: Date) => {
        const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

        if (seconds < 60) return 'Just now';
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
        return `${Math.floor(seconds / 86400)}d ago`;
    };

    const getColorClasses = (color: string) => {
        const colors: Record<string, string> = {
            cyan: 'text-cyan-400 bg-cyan-500/10',
            amber: 'text-amber-400 bg-amber-500/10',
            emerald: 'text-emerald-400 bg-emerald-500/10',
            red: 'text-red-400 bg-red-500/10',
            violet: 'text-violet-400 bg-violet-500/10',
        };
        return colors[color] || colors.cyan;
    };

    // Close on outside click
    useEffect(() => {
        if (!isOpen) return;

        const handleClickOutside = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (!target.closest('[data-notification-dropdown]')) {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen, onClose]);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    data-notification-dropdown
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    className="absolute right-0 top-full mt-2 w-96 max-w-[calc(100vw-2rem)] backdrop-blur-3xl bg-white/90 dark:bg-gray-900/95 border border-white/40 dark:border-white/20 rounded-2xl shadow-2xl overflow-hidden z-50"
                >
                    {/* Header */}
                    <div className="p-4 border-b border-white/20 dark:border-white/10">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                                <Bell className="h-5 w-5 text-gray-800 dark:text-white" />
                                <h3 className="text-lg font-bold text-gray-800 dark:text-white">Notifications</h3>
                                {unreadCount > 0 && (
                                    <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-red-500 text-white">
                                        {unreadCount}
                                    </span>
                                )}
                            </div>
                            <button
                                onClick={onClose}
                                className="p-1 hover:bg-black/10 dark:hover:bg-white/10 rounded-lg transition-colors"
                            >
                                <X className="h-5 w-5 text-gray-600 dark:text-white/60" />
                            </button>
                        </div>

                        {/* Filter Tabs */}
                        <div className="flex gap-2">
                            {['all', 'prediction', 'alert', 'reminder'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setFilter(tab as typeof filter)}
                                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${filter === tab
                                        ? 'bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 font-semibold'
                                        : 'text-gray-600 dark:text-white/60 hover:text-gray-800 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10'
                                        }`}
                                >
                                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Notifications List */}
                    <div className="max-h-96 overflow-y-auto">
                        {filteredNotifications.length > 0 ? (
                            <div className="p-2">
                                {filteredNotifications.map((notification, index) => (
                                    <motion.div
                                        key={notification.id}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        onClick={() => markAsRead(notification.id)}
                                        className={`p-3 rounded-xl mb-2 cursor-pointer transition-all ${notification.read
                                            ? 'bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10'
                                            : 'bg-cyan-500/10 hover:bg-cyan-500/15 border border-cyan-400/30'
                                            }`}
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className={`p-2 rounded-lg flex-shrink-0 ${getColorClasses(notification.color || 'cyan')}`}>
                                                {notification.icon}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-2 mb-1">
                                                    <h4 className={`font-semibold ${notification.read ? 'text-gray-600 dark:text-white/70' : 'text-gray-800 dark:text-white'}`}>
                                                        {notification.title}
                                                    </h4>
                                                    {!notification.read && (
                                                        <div className="w-2 h-2 rounded-full bg-cyan-400 flex-shrink-0 mt-1.5" />
                                                    )}
                                                </div>
                                                <p className="text-sm text-gray-600 dark:text-white/60 mb-2">{notification.message}</p>
                                                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-white/40">
                                                    <Clock className="h-3 w-3" />
                                                    <span>{getTimeAgo(notification.timestamp)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-8 text-center text-gray-500 dark:text-white/60">
                                <Bell className="h-12 w-12 mx-auto mb-3 opacity-40" />
                                <p>No notifications</p>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    {notifications.length > 0 && (
                        <div className="p-3 border-t border-white/20 dark:border-white/10 bg-black/5 dark:bg-white/5 flex gap-2">
                            {unreadCount > 0 && (
                                <button
                                    onClick={markAllAsRead}
                                    className="flex-1 px-4 py-2 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-700 dark:text-cyan-300 text-sm font-medium transition-all flex items-center justify-center gap-2"
                                >
                                    <CheckCircle className="h-4 w-4" />
                                    Mark all read
                                </button>
                            )}
                            <button
                                onClick={clearAll}
                                className="flex-1 px-4 py-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-600 dark:text-red-300 text-sm font-medium transition-all"
                            >
                                Clear all
                            </button>
                        </div>
                    )}
                </motion.div>
            )}
        </AnimatePresence>
    );
}
