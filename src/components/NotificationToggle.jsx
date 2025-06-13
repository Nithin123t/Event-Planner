import React from 'react';
import { useNotifications } from '../notifications/NotificationContext';
import './NotificationToggle.css';

export default function NotificationToggle() {
  const {
    notificationsEnabled,
    permissionStatus,
    requestNotificationPermission,
    disableNotifications,
    testNotification
  } = useNotifications();

  const handleToggle = async () => {
    if (!notificationsEnabled) {
      const granted = await requestNotificationPermission();
      if (granted) {
        testNotification();
      }
    } else {
      disableNotifications();
    }
  };

  if (permissionStatus === 'denied') {
    return (
      <div className="notification-toggle denied">
        <p>
          Notifications are blocked. Please enable them in your browser settings to receive event reminders.
        </p>
      </div>
    );
  }

  return (
    <div className="notification-toggle">
      <div className="toggle-container">
        <label className="toggle-switch">
          <input
            type="checkbox"
            checked={notificationsEnabled}
            onChange={handleToggle}
          />
          <span className="toggle-slider"></span>
        </label>
        <span className="toggle-label">
          {notificationsEnabled ? 'Event notifications enabled' : 'Enable event notifications'}
        </span>
      </div>
      {notificationsEnabled && (
        <p className="notification-info">
          You'll receive reminders 3 days and 1 day before events you're attending.
        </p>
      )}
    </div>
  );
}
