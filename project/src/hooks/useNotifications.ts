import { useState, useEffect } from 'react';

export interface Notification {
  id: string;
  type: 'alert' | 'warning' | 'info';
  message: string;
  date: string;
  read: boolean;
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const saved = localStorage.getItem('notifications');
    return saved ? JSON.parse(saved) : [];
  });

  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem('notificationsEnabled');
    return saved ? JSON.parse(saved) : true;
  });

  useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('notificationsEnabled', JSON.stringify(notificationsEnabled));
  }, [notificationsEnabled]);

  const addNotification = (notification: Omit<Notification, 'id' | 'read' | 'date'>) => {
    if (!notificationsEnabled) return;

    const newNotification: Notification = {
      ...notification,
      id: crypto.randomUUID(),
      read: false,
      date: new Date().toISOString(),
    };
    setNotifications((prev) => [newNotification, ...prev]);
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const toggleNotifications = () => {
    setNotificationsEnabled((prev) => !prev);
  };

  return {
    notifications,
    notificationsEnabled,
    addNotification,
    markAsRead,
    toggleNotifications,
  };
}