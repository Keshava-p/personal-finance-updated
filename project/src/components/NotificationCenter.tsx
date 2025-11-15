import React from 'react';
import { Bell, BellOff } from 'lucide-react';
import { useNotifications } from '../hooks/useNotifications';

export function NotificationCenter() {
  const { notifications, notificationsEnabled, markAsRead, toggleNotifications } = useNotifications();
  const [showNotifications, setShowNotifications] = React.useState(false);
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="relative">
      <button
        onClick={() => setShowNotifications(!showNotifications)}
        className="relative p-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 rounded-full"
      >
        {notificationsEnabled ? (
          <Bell className="h-5 w-5" />
        ) : (
          <BellOff className="h-5 w-5" />
        )}
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {showNotifications && (
        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-50">
          <div className="p-4 border-b dark:border-gray-700">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Notifications</h3>
              <button
                onClick={toggleNotifications}
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              >
                {notificationsEnabled ? 'Disable' : 'Enable'}
              </button>
            </div>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="p-4 text-gray-500 dark:text-gray-400 text-center">No notifications</p>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border-b dark:border-gray-700 ${
                    notification.read ? 'bg-gray-50 dark:bg-gray-700' : 'bg-white dark:bg-gray-800'
                  } cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex items-start">
                    <div
                      className={`w-2 h-2 mt-2 mr-3 rounded-full ${
                        notification.type === 'alert'
                          ? 'bg-red-500'
                          : notification.type === 'warning'
                          ? 'bg-yellow-500'
                          : 'bg-blue-500'
                      }`}
                    />
                    <div>
                      <p className="text-sm text-gray-900 dark:text-white">{notification.message}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {new Date(notification.date).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}