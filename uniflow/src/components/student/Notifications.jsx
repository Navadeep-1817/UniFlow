import React, { useState, useEffect } from 'react';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    // Fetch event reminders and updates
  }, [filter]);

  const handleMarkAsRead = (notificationId) => {
    console.log('Marking notification as read:', notificationId);
  };

  return (
    <div className="notifications">
      <h2>Notifications</h2>
      <div className="filters">
        <button onClick={() => setFilter('all')}>All</button>
        <button onClick={() => setFilter('events')}>Events</button>
        <button onClick={() => setFilter('registrations')}>Registrations</button>
        <button onClick={() => setFilter('reminders')}>Reminders</button>
      </div>
      <div className="notifications-list">
        {notifications.map(notification => (
          <div key={notification.id} className={`notification-item ${notification.read ? 'read' : 'unread'}`}>
            <div className="notification-icon">
              {notification.type === 'reminder' && '⏰'}
              {notification.type === 'event' && '📅'}
              {notification.type === 'registration' && '✅'}
            </div>
            <div className="notification-content">
              <h4>{notification.title}</h4>
              <p>{notification.message}</p>
              <span className="notification-time">{notification.time}</span>
            </div>
            {!notification.read && (
              <button onClick={() => handleMarkAsRead(notification.id)}>
                Mark as Read
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notifications;
