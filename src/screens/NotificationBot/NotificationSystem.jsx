import { useState, useEffect, useRef } from 'react';
import './notifications.scss';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { Divider } from '@mui/material';
import { _base } from '../../settings/constants';

const NotificationSystem = ({
  loadNotifcation,
  setNotifications,
  notifications,
  handleReadNotification,
  handleMarkAllNotification
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('ticket');

  const [reviewerNotifications] = useState([
    // {
    //   id: 1,
    //   title: 'Welcome Message',
    //   message:
    //     'Welcome to our notification system! You can view all your important updates here.',
    //   timestamp: new Date(Date.now() - 2 * 60 * 1000), // 2 minutes ago
    //   is_read: false,
    //   type: 'info'
    // },
    // {
    //   id: 2,
    //   title: 'System Update',
    //   message:
    //     'The system has been updated with new features and improvements.',
    //   timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    //   is_read: false,
    //   type: 'success'
    // }
    // {
    //   id: 3,
    //   title: 'Reminder',
    //   message: "Don't forget to check your dashboard for important updates.",
    //   timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    //   read: true,
    //   type: 'warning'
    // },
    // {
    //   id: 4,
    //   title: 'New Feature Available',
    //   message:
    //     "We've added a new notification system with improved animations and accessibility.",
    //   timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    //   read: true,
    //   type: 'info'
    // },
    // {
    //   id: 5,
    //   title: 'Maintenance Notice',
    //   message: 'Scheduled maintenance will occur this weekend from 2-4 AM EST.',
    //   timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    //   read: true,
    //   type: 'warning'
    // }
  ]);

  // const [ticketNotifications] = useState([
  //   {
  //     id: 1,
  //     ticketId: 'KO20726',
  //     message: 'Some changes have been made by ticket owner Amreen Shaikh',
  //     date: '2025-06-11',
  //     time: '11:00:14',
  //     is_read: false
  //   },
  //   {
  //     id: 2,
  //     ticketId: 'KO20726',
  //     message: 'Some changes have been made by ticket owner Amreen Shaikh',
  //     date: '2025-06-11',
  //     time: '11:00:14',
  //     is_read: false
  //   },
  //   {
  //     id: 3,
  //     ticketId: 'KO20726',
  //     message: 'Some changes have been made by ticket owner Amreen Shaikh',
  //     date: '2025-06-11',
  //     time: '11:00:14',
  //     is_read: true
  //   }
  // ]);

  const notificationRef = useRef(null);
  const buttonRef = useRef(null);

  const reviewerUnreadCount = reviewerNotifications.filter(
    (n) => !n.read
  ).length;
  // const ticketUnreadCount = ticketNotifications.filter((n) => !n.read).length;
  const totalUnreadCount = 0;

  const toggleNotifications = () => {
    loadNotifcation();
    setIsOpen(!isOpen);
  };

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) {
      return `${minutes}m ago`;
    } else if (hours < 24) {
      return `${hours}h ago`;
    } else {
      return `${days}d ago`;
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'success':
        return '✓';
      case 'warning':
        return '⚠';
      case 'error':
        return '✗';
      default:
        return 'ℹ';
    }
  };
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target) &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleKeyDown = (event) => {
    if (event.key === 'Escape') {
      setIsOpen(false);
      buttonRef.current.focus();
    }
  };

  const currentNotifications =
    activeTab === 'reviewer' ? reviewerNotifications : notifications;

  return (
    <div className="notification-system">
      <button
        ref={buttonRef}
        style={{ background: '#484c7f' }}
        className={`notification-button ${
          notifications?.length > 0 ? 'has-notifications' : ''
        }`}
        onClick={toggleNotifications}
        aria-label={`Notifications ${
          notifications?.length > 0 ? `(${notifications?.length} unread)` : ''
        }`}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <div className="bell-icon">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
          </svg>
        </div>
        {notifications?.length > 0 && (
          <span
            className="notification-badge"
            aria-label={`${notifications?.length} unread notifications`}
          >
            {notifications?.length > 99 ? '99+' : notifications?.length}
          </span>
        )}
      </button>

      <div
        ref={notificationRef}
        className={`notification-panel ${isOpen ? 'open' : ''}`}
        role="dialog"
        aria-labelledby="notifications-title"
        onKeyDown={handleKeyDown}
        tabIndex={-1}
      >
        <div className="notification-header">
          <h3 id="notifications-title">Notifications</h3>
          <button
            className="close-button"
            onClick={() => setIsOpen(false)}
            aria-label="Close notifications"
          >
            ×
          </button>
        </div>

        <div className="notification-tabs">
          {/* <button
            className={`tab-button ${activeTab === 'reviewer' ? 'active' : ''}`}
            onClick={() => setActiveTab('reviewer')}
          >
            Reviewer
            {reviewerUnreadCount > 0 && (
              <span className="tab-badge">{reviewerUnreadCount}</span>
            )}
          </button> */}
          <button
            className={`tab-button ${activeTab === 'ticket' ? 'active' : ''}`}
            onClick={() => setActiveTab('ticket')}
          >
            Ticket
            {notifications?.length >= 0 && (
              <span className="tab-badge">{notifications?.length}</span>
            )}
          </button>
        </div>

        <div className="notification-list">
          {notifications?.length === 0 ? (
            <div className="empty-state">
              <p>No notifications yet</p>
            </div>
          ) : (
            currentNotifications?.map((notification) => {
              const date = notification?.created_at?.split(' ')[0];
              const time = notification?.created_at?.split(' ')[1];
              return (
                <div
                  key={notification.id}
                  className={`notification-item ${
                    !notification.is_read ? 'unread' : ''
                  } ${activeTab === 'reviewer' ? notification.type : 'ticket'}`}
                  role="listitem"
                >
                  {activeTab === 'reviewer' ? (
                    <>
                      <div className="notification-icon">
                        {getTypeIcon(notification.type)}
                      </div>
                      <div
                        onClick={() => navigate(`${_base}/CustomerFeedback`)}
                        className="notification-content"
                      >
                        <div className="notification-title">
                          {notification.title}
                        </div>
                        <div className="notification-message">
                          {notification.message}
                        </div>
                        <div className="notification-timestamp">
                          {formatTimestamp(notification.timestamp)}
                        </div>
                      </div>
                      {!notification.is_read && (
                        <div className="unread-indicator"></div>
                      )}
                    </>
                  ) : (
                    <>
                      <div className="notification-icon ticket-icon">🎫</div>
                      {
                        notification?.url ? (
                          <Link to={`/${_base}/${notification?.url}`}>
                            <div
                              onClick={(e) => {
                                handleReadNotification(e, notification?.id);
                                setIsOpen(false);
                              }}
                              className="notification-content"
                            >
                              <div className="ticket-info">
                                <span className="ticket-date">
                                  Date: {date}
                                </span>
                                <span className="ticket-time">
                                  Time: {time}
                                </span>
                              </div>
                              <div className="notification-message">
                                <Link to={`/${_base}/${notification?.url}`}>
                                  {notification?.message}
                                </Link>
                              </div>
                            </div>
                          </Link>
                        ) : (
                          //  <Link to={`/${_base}/${notification?.url}`}>
                          <div
                            onClick={(e) => {
                              handleReadNotification(e, notification?.id);
                              setIsOpen(false);
                            }}
                            className="notification-content"
                          >
                            <div className="ticket-info">
                              <span className="ticket-date">Date: {date}</span>
                              {/* <span className="ticket-time">Time: {time}</span> */}
                            </div>
                            <div className="notification-message">
                              {notification?.message}
                            </div>
                          </div>
                        )
                        // </Link>
                      }
                      {!notification.is_read && (
                        <div className="unread-indicator"></div>
                      )}
                    </>
                  )}
                </div>
              );
            })
          )}
        </div>

        {currentNotifications.length > 0 && (
          <div className="notification-footer">
            <div className="footer-buttons">
              {
                <button
                  onClick={() => {
                    navigate(`/${_base}/Notification`);
                    setIsOpen(false);
                  }}
                  className="view-all-button"
                >
                  View All Notifications
                </button>
              }
              <button
                onClick={(e) => {
                  handleMarkAllNotification(e);
                }}
                className="mark-all-read"
              >
                Mark All As Read
              </button>
            </div>
          </div>
        )}
      </div>

      {isOpen && (
        <div
          className="notification-overlay"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default NotificationSystem;
