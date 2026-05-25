import React, { createContext, useState, useContext, useEffect } from 'react';

const NotificationContext = createContext(null);

const INITIAL_NOTIFICATIONS = [
  {
    id: 'notif-1',
    title: 'Smart Contract Executed',
    message: 'Genesis land registration block confirmed on-chain.',
    type: 'success',
    time: '2 hours ago',
    read: false
  },
  {
    id: 'notif-2',
    title: 'Verification Pending',
    message: 'Property LAND-7712 requires admin deed review.',
    type: 'warning',
    time: '1 day ago',
    read: true
  }
];

export const NotificationProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('landchain_notifications');
    if (saved) {
      setNotifications(JSON.parse(saved));
    } else {
      setNotifications(INITIAL_NOTIFICATIONS);
      localStorage.setItem('landchain_notifications', JSON.stringify(INITIAL_NOTIFICATIONS));
    }
  }, []);

  const saveNotifications = (newNotifs) => {
    setNotifications(newNotifs);
    localStorage.setItem('landchain_notifications', JSON.stringify(newNotifs));
  };

  const addToast = (title, message, type = 'info', duration = 4000) => {
    const id = `toast-${Date.now()}`;
    setToasts((prev) => [...prev, { id, title, message, type }]);

    // Add to historical notifications list as well
    const newNotif = {
      id: `notif-${Date.now()}`,
      title,
      message,
      type,
      time: 'Just now',
      read: false
    };
    saveNotifications([newNotif, ...notifications]);

    setTimeout(() => {
      removeToast(id);
    }, duration);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const markAllAsRead = () => {
    const updated = notifications.map((n) => ({ ...n, read: true }));
    saveNotifications(updated);
  };

  const clearAllNotifications = () => {
    saveNotifications([]);
  };

  return (
    <NotificationContext.Provider value={{
      toasts,
      notifications,
      addToast,
      removeToast,
      markAllAsRead,
      clearAllNotifications
    }}>
      {children}

      {/* Floating Toast Notification Container */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-3 max-w-sm w-full">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            onClick={() => removeToast(toast.id)}
            className={`cursor-pointer p-4 rounded-xl shadow-2xl glass-panel border transition-all duration-300 transform translate-y-0 scale-100 hover:scale-102 flex flex-col gap-1 relative overflow-hidden group ${
              toast.type === 'success'
                ? 'border-emerald-500/40 bg-emerald-950/20 shadow-emerald-500/10'
                : toast.type === 'error'
                ? 'border-rose-500/40 bg-rose-950/20 shadow-rose-500/10'
                : toast.type === 'warning'
                ? 'border-amber-500/40 bg-amber-950/20 shadow-amber-500/10'
                : 'border-cyber-cyan/40 bg-cyber-blue/30 shadow-cyber-cyan/10'
            }`}
          >
            {/* Ambient Background Glow Effect */}
            <div className={`absolute top-0 right-0 w-24 h-24 rounded-full filter blur-2xl opacity-20 -mr-6 -mt-6 transition-all duration-500 group-hover:scale-150 ${
              toast.type === 'success'
                ? 'bg-emerald-500'
                : toast.type === 'error'
                ? 'bg-rose-500'
                : toast.type === 'warning'
                ? 'bg-amber-500'
                : 'bg-cyber-cyan'
            }`} />

            <div className="flex items-center justify-between">
              <span className={`text-sm font-semibold tracking-wider font-display uppercase ${
                toast.type === 'success'
                  ? 'text-emerald-400'
                  : toast.type === 'error'
                  ? 'text-rose-400'
                  : toast.type === 'warning'
                  ? 'text-amber-400'
                  : 'text-cyber-cyan'
              }`}>
                {toast.title}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeToast(toast.id);
                }}
                className="text-gray-400 hover:text-white text-xs transition-colors"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-gray-300 mt-1 line-clamp-2 leading-relaxed">
              {toast.message}
            </p>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);
