import API from './api';

export const getNotifications = (params) =>
  API.get('/notifications', { params });

export const markAsRead = (id) => API.put(`/notifications/${id}`);

export const markAllAsRead = () => API.put('/notifications/mark-all-read');

export const deleteNotification = (id) => API.delete(`/notifications/${id}`);

export const clearAllNotifications = () => API.delete('/notifications');
