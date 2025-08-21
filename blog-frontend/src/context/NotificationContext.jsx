import React, { createContext, useContext, useState } from 'react';
import Notification from '../components/Notification';

const NotificationContext = createContext();

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = (message, type = 'success', duration = 4000) => {
    const id = Date.now() + Math.random();
    const notification = { id, message, type, duration };
    
    setNotifications(prev => [...prev, notification]);
    
    // Auto remove after duration + 500ms (for animation)
    setTimeout(() => {
      removeNotification(id);
    }, duration + 500);
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const showSuccess = (message, duration) => addNotification(message, 'success', duration);
  const showError = (message, duration) => addNotification(message, 'error', duration);
  const showWarning = (message, duration) => addNotification(message, 'warning', duration);

  return (
    <NotificationContext.Provider value={{
      addNotification,
      showSuccess,
      showError,
      showWarning,
      removeNotification
    }}>
      {children}
      
      {/* Render notifications */}
      <div className="notifications-container">
        {notifications.map((notification, index) => (
          <div 
            key={notification.id}
            style={{ 
              position: 'fixed',
              top: `${20 + (index * 80)}px`,
              right: '20px',
              zIndex: 1000 + index
            }}
          >
            <Notification
              message={notification.message}
              type={notification.type}
              duration={notification.duration}
              onClose={() => removeNotification(notification.id)}
            />
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
};

export default NotificationContext;
