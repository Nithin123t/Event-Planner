// Notification Service for Event Reminders
class NotificationService {
  constructor() {
    this.checkInterval = null;
    this.isRunning = false;
  }

  // Request notification permission
  async requestPermission() {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return false;
  }

  // Show notification
  showNotification(title, options = {}) {
    if ('Notification' in window && Notification.permission === 'granted') {
      return new Notification(title, {
        icon: '/vite.svg',
        badge: '/vite.svg',
        ...options
      });
    }
  }

  // Calculate days until event
  getDaysUntilEvent(eventDate) {
    const today = new Date();
    const event = new Date(eventDate);
    const diffTime = event.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  // Check for events that need notifications
  checkEventReminders(events, rsvps, userEmail) {
    if (!userEmail || !events || !rsvps) return;

    events.forEach(event => {
      const userRsvp = rsvps[event.id]?.find(r => r.user === userEmail);
      
      // Only notify if user RSVP'd "Going"
      if (userRsvp?.status === 'Going') {
        const daysUntil = this.getDaysUntilEvent(event.date);
        const notificationKey = `notified_${event.id}_${userEmail}`;
        
        // Check if we've already notified for this event
        const notificationHistory = JSON.parse(
          localStorage.getItem('eventNotifications') || '{}'
        );

        // 3 days before notification
        if (daysUntil === 3 && !notificationHistory[`${notificationKey}_3days`]) {
          this.showNotification(
            `📅 Event Reminder - 3 Days!`,
            {
              body: `"${event.title}" is coming up in 3 days on ${event.date} at ${event.location}`,
              tag: `event-${event.id}-3days`
            }
          );
          
          // Mark as notified
          notificationHistory[`${notificationKey}_3days`] = true;
          localStorage.setItem('eventNotifications', JSON.stringify(notificationHistory));
        }

        // 1 day before notification
        if (daysUntil === 1 && !notificationHistory[`${notificationKey}_1day`]) {
          this.showNotification(
            `🚨 Event Tomorrow!`,
            {
              body: `Don't forget! "${event.title}" is tomorrow (${event.date}) at ${event.location}`,
              tag: `event-${event.id}-1day`
            }
          );
          
          // Mark as notified
          notificationHistory[`${notificationKey}_1day`] = true;
          localStorage.setItem('eventNotifications', JSON.stringify(notificationHistory));
        }

        // Day of event notification
        if (daysUntil === 0 && !notificationHistory[`${notificationKey}_today`]) {
          this.showNotification(
            `🎉 Event Today!`,
            {
              body: `"${event.title}" is happening today at ${event.location}!`,
              tag: `event-${event.id}-today`
            }
          );
          
          // Mark as notified
          notificationHistory[`${notificationKey}_today`] = true;
          localStorage.setItem('eventNotifications', JSON.stringify(notificationHistory));
        }
      }
    });
  }

  // Start the notification service
  start(events, rsvps, userEmail) {
    if (this.isRunning) return;
    
    this.isRunning = true;
    
    // Check immediately
    this.checkEventReminders(events, rsvps, userEmail);
    
    // Check every hour
    this.checkInterval = setInterval(() => {
      this.checkEventReminders(events, rsvps, userEmail);
    }, 60 * 60 * 1000); // 1 hour
  }

  // Stop the notification service
  stop() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
    this.isRunning = false;
  }

  // Clean up old notification history
  cleanupNotificationHistory() {
    const history = JSON.parse(localStorage.getItem('eventNotifications') || '{}');
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    // Remove notifications older than 30 days
    Object.keys(history).forEach(key => {
      if (history[key] === true) {
        // For simplicity, we'll keep all notifications for now
        // In a real app, you'd want to track timestamps
      }
    });
  }
}

export const notificationService = new NotificationService();
