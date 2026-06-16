import API from './api';

export const getClients = () => API.get('/trainer/clients');

export const getClientDetails = (id) => API.get(`/trainer/clients/${id}`);

export const assignWorkout = (clientId, data) =>
  API.post(`/trainer/clients/${clientId}/workouts`, data);

export const setClientGoal = (clientId, data) =>
  API.post(`/trainer/clients/${clientId}/goals`, data);

export const addClientNote = (clientId, note) =>
  API.post(`/trainer/clients/${clientId}/notes`, { note });

export const getClientProgress = (clientId) =>
  API.get(`/trainer/clients/${clientId}/progress`);

export const sendMessageToClient = (clientId, message) =>
  API.post(`/trainer/clients/${clientId}/message`, { message });

export const removeClient = (clientId) =>
  API.delete(`/trainer/clients/${clientId}`);

export const createWorkoutTemplate = (data) =>
  API.post('/trainer/workout-templates', data);

export const getWorkoutTemplates = (params) =>
  API.get('/trainer/workout-templates', { params });

export const deleteWorkoutTemplate = (id) =>
  API.delete(`/trainer/workout-templates/${id}`);

export const getDashboardStats = () => API.get('/trainer/dashboard-stats');
