import React, { useState, useEffect } from 'react';

const NotificationCenter = () => {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    // Fetch event updates and notifications
  }, [filter]);

  const handleMarkAsRead = (notificationId) => {
    console.log('Marking notification as read:', notificationId);
  };

  return (
    <div className="notification-center">
      <h2>Notification Center</h2>
      <div className="filters">
        <button onClick={() => setFilter('all')}>All</button>
        <button onClick={() => setFilter('events')}>Events</button>
        <button onClick={() => setFilter('assignments')}>Assignments</button>
        <button onClick={() => setFilter('alerts')}>Alerts</button>
      </div>
      <div className="notifications-list">
        {notifications.map(notification => (
          <div key={notification.id} className={`notification-item ${notification.read ? 'read' : 'unread'}`}>
            <div className="notification-header">
              <span className="notification-type">{notification.type}</span>
              <span className="notification-time">{notification.time}</span>
            </div>
            <h4>{notification.title}</h4>
            <p>{notification.message}</p>
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

export default NotificationCenter;
