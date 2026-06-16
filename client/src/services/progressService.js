import API from './api';

export const createProgress = (data) =>
  API.post('/progress', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const getProgress = (params) => API.get('/progress', { params });

export const getProgressEntry = (id) => API.get(`/progress/${id}`);

export const updateProgress = (id, data) =>
  API.put(`/progress/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const deleteProgress = (id) => API.delete(`/progress/${id}`);

export const getProgressStats = () => API.get('/progress/stats/summary');

export const getProgressTrends = (metric) =>
  API.get(`/progress/trends/${metric || ''}`);

export const getMeasurementsSummary = () =>
  API.get('/progress/measurements/summary');

export const getMilestones = () => API.get('/progress/milestones');
