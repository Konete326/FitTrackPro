import API from './api';

export const getAllUsers = (params) => API.get('/admin/users', { params });

export const getUserById = (id) => API.get(`/admin/users/${id}`);

export const createUser = (data) => API.post('/admin/users', data);

export const updateUser = (id, data) => API.put(`/admin/users/${id}`, data);

export const updateUserRole = (id, role) =>
  API.put(`/admin/users/${id}/role`, { role });

export const assignTrainer = (userId, trainerId) =>
  API.put(`/admin/assign-trainer/${userId}/${trainerId}`);

export const toggleUserActive = (id) =>
  API.put(`/admin/users/${id}/toggle-active`);

export const deleteUser = (id) => API.delete(`/admin/users/${id}`);

export const bulkActions = (data) =>
  API.post('/admin/users/bulk-actions', data);

export const getSystemStats = () => API.get('/admin/stats');

export const getActivityLogs = (params) =>
  API.get('/admin/activity-logs', { params });

export const getCoachingAssignments = () => API.get('/admin/assignments');
