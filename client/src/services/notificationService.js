import API from './api';

export const getNotifications = (params) =>
  API.get('/notifications', { params });

export const markAsRead = (id) => API.put(`/notifications/${id}/read`);

export const markAllAsRead = () => API.put('/notifications/read-all');

export const deleteNotification = (id) => API.delete(`/notifications/${id}`);

export const clearAllNotifications = () => API.delete('/notifications');

export const getNotificationStats = () =>
  API.get('/notifications/stats/summary');
