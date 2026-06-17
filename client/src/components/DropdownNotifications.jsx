import React, { useState, useRef, useEffect, useCallback } from 'react';
import Transition from '../utils/Transition';
import { getNotifications, markAsRead, markAllAsRead } from '../services/notificationService';

const POLL_INTERVAL = 30000;
const MAX_ITEMS = 5;

function DropdownNotifications({ align }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const trigger = useRef(null);
  const dropdown = useRef(null);
  const pollRef = useRef(null);

  const fetchNotifications = useCallback(async () => {
    try {
      const { data } = await getNotifications({ limit: MAX_ITEMS });
      if (data.success) {
        setNotifications(data.data || []);
        setUnreadCount(data.unreadCount || 0);
      }
    } catch {
      // silent fail for header polling
    }
  }, []);

  // Fetch on mount and set up polling
  useEffect(() => {
    fetchNotifications();
    pollRef.current = setInterval(fetchNotifications, POLL_INTERVAL);
    return () => clearInterval(pollRef.current);
  }, [fetchNotifications]);

  // Refetch when dropdown opens
  useEffect(() => {
    if (dropdownOpen) {
      setLoading(true);
      fetchNotifications().finally(() => setLoading(false));
    }
  }, [dropdownOpen, fetchNotifications]);

  // Close on click outside
  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (!dropdown.current) return;
      if (!dropdownOpen || dropdown.current.contains(target) || trigger.current.contains(target)) return;
      setDropdownOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  });

  // Close on escape key
  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!dropdownOpen || keyCode !== 27) return;
      setDropdownOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  });

  const handleMarkAsRead = async (id) => {
    try {
      await markAsRead(id);
      setNotifications((prev) => prev.map((n) => (n._id === id ? { ...n, IsRead: true } : n)));
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch {}
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, IsRead: true })));
      setUnreadCount(0);
    } catch {}
  };

  const formatTime = (dateStr) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    if (days === 1) return 'Yesterday';
    return `${days}d ago`;
  };

  const typeColor = (type) => {
    const colors = {
      Workout: 'bg-blue-500',
      Goal: 'bg-emerald-500',
      Streak: 'bg-orange-500',
      Achievement: 'bg-violet-500',
      Feedback: 'bg-cyan-500',
      System: 'bg-gray-500',
      Message: 'bg-pink-500',
      'Password-Reset': 'bg-red-500',
    };
    return colors[type] || 'bg-gray-400';
  };

  return (
    <div className="relative inline-flex">
      <button
        ref={trigger}
        className={`w-8 h-8 flex items-center justify-center hover:bg-gray-100 lg:hover:bg-gray-200 dark:hover:bg-gray-700/50 dark:lg:hover:bg-gray-800 rounded-full relative ${dropdownOpen && 'bg-gray-200 dark:bg-gray-800'}`}
        aria-haspopup="true"
        onClick={() => setDropdownOpen(!dropdownOpen)}
        aria-expanded={dropdownOpen}
      >
        <span className="sr-only">Notifications</span>
        <svg
          className="fill-current text-gray-500/80 dark:text-gray-400/80"
          width={16}
          height={16}
          viewBox="0 0 16 16"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M7 0a7 7 0 0 0-7 7c0 1.202.308 2.33.84 3.316l-.789 2.368a1 1 0 0 0 1.265 1.265l2.595-.865a1 1 0 0 0-.632-1.898l-.698.233.3-.9a1 1 0 0 0-.104-.85A4.97 4.97 0 0 1 2 7a5 5 0 0 1 5-5 4.99 4.99 0 0 1 4.093 2.135 1 1 0 1 0 1.638-1.148A6.99 6.99 0 0 0 7 0Z" />
          <path d="M11 6a5 5 0 0 0 0 10c.807 0 1.567-.194 2.24-.533l1.444.482a1 1 0 0 0 1.265-1.265l-.482-1.444A4.962 4.962 0 0 0 16 11a5 5 0 0 0-5-5Zm-3 5a3 3 0 0 1 6 0c0 .588-.171 1.134-.466 1.6a1 1 0 0 0-.115.82 1 1 0 0 0-.82.114A2.973 2.973 0 0 1 11 14a3 3 0 0 1-3-3Z" />
        </svg>
        {unreadCount > 0 && (
          <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 border-2 border-gray-100 dark:border-gray-900 rounded-full"></div>
        )}
      </button>

      <Transition
        className={`origin-top-right z-10 absolute top-full -mr-48 sm:mr-0 min-w-80 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700/60 rounded-lg shadow-lg overflow-hidden mt-1 ${align === 'right' ? 'right-0' : 'left-0'}`}
        show={dropdownOpen}
        enter="transition ease-out duration-200 transform"
        enterStart="opacity-0 -translate-y-2"
        enterEnd="opacity-100 translate-y-0"
        leave="transition ease-out duration-200"
        leaveStart="opacity-100"
        leaveEnd="opacity-0"
      >
        <div
          ref={dropdown}
          onFocus={() => setDropdownOpen(true)}
          onBlur={() => setDropdownOpen(false)}
        >
          <div className="flex items-center justify-between pt-2 pb-2 px-4">
            <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase">Notifications</span>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-xs text-violet-500 hover:text-violet-600 dark:text-violet-400 dark:hover:text-violet-300"
              >
                Mark all read
              </button>
            )}
          </div>

          {loading ? (
            <div className="py-6 text-center text-sm text-gray-400 dark:text-gray-500">Loading...</div>
          ) : notifications.length === 0 ? (
            <div className="py-6 px-4 text-center text-sm text-gray-400 dark:text-gray-500">No notifications</div>
          ) : (
            <ul>
              {notifications.map((n) => (
                <li
                  key={n._id}
                  className={`border-b border-gray-200 dark:border-gray-700/60 last:border-0 ${!n.IsRead ? 'bg-gray-100/50 dark:bg-gray-700/10' : ''}`}
                >
                  <button
                    className="w-full text-left block py-2.5 px-4 hover:bg-gray-100 dark:hover:bg-gray-700/20 transition"
                    onClick={() => {
                      if (!n.IsRead) handleMarkAsRead(n._id);
                    }}
                  >
                    <div className="flex items-start gap-2.5">
                      <span className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${typeColor(n.Type)}`}></span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm leading-snug">
                          <span className="font-medium text-gray-800 dark:text-gray-100">{n.Title}</span>
                          {' '}{n.Message}
                        </p>
                        <span className="block text-xs text-gray-400 dark:text-gray-500 mt-1">{formatTime(n.createdAt)}</span>
                      </div>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}

        </div>
      </Transition>
    </div>
  );
}

export default DropdownNotifications;
