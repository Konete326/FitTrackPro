import API from './api';

export const logSleep = (data) => API.post('/sleep', data);

export const getSleepLogs = (params) => API.get('/sleep', { params });

export const getSleepEntry = (id) => API.get(`/sleep/${id}`);

export const updateSleep = (id, data) => API.put(`/sleep/${id}`, data);

export const deleteSleep = (id) => API.delete(`/sleep/${id}`);

export const getDailySummary = (date) =>
  API.get(`/sleep/daily-summary/${date || ''}`);

export const getSleepStats = () => API.get('/sleep/stats/summary');

export const getSleepTrends = () => API.get('/sleep/trends');

export const getSleepRecommendations = () => API.get('/sleep/recommendations');
