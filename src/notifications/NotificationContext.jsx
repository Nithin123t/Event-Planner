import React, { createContext, useContext, useEffect, useState } from 'react';
import { notificationService } from '../utils/notificationService';
import { useEvent } from '../events/EventContext';
import { useAuth } from '../auth/AuthContext';

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState('default');
  const { events, rsvps } = useEvent();
  const { user } = useAuth();

  // Initialize notifications when component mounts
  useEffect(() => {
    checkNotificationPermission();
  }, []);

  // Start notification service when user logs in and has events
  useEffect(() => {
    if (user && events.length > 0 && notificationsEnabled) {
      notificationService.start(events, rsvps, user.email);
    }

    return () => {
      notificationService.stop();
    };
  }, [user, events, rsvps, notificationsEnabled]);

  const checkNotificationPermission = () => {
    if ('Notification' in window) {
      setPermissionStatus(Notification.permission);
      setNotificationsEnabled(Notification.permission === 'granted');
    }
  };

  const requestNotificationPermission = async () => {
    try {
      const granted = await notificationService.requestPermission();
      setNotificationsEnabled(granted);
      setPermissionStatus(granted ? 'granted' : 'denied');
      
      if (granted && user && events.length > 0) {
        notificationService.start(events, rsvps, user.email);
      }
      
      return granted;
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  };

  const disableNotifications = () => {
    setNotificationsEnabled(false);
    notificationService.stop();
  };

  const testNotification = () => {
    if (notificationsEnabled) {
      notificationService.showNotification(
        '🔔 Test Notification',
        {
          body: 'Event notifications are working correctly!',
          tag: 'test-notification'
        }
      );
    }
  };

  const value = {
    notificationsEnabled,
    permissionStatus,
    requestNotificationPermission,
    disableNotifications,
    testNotification,
    checkNotificationPermission
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
