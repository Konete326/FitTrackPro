import API from './api';
import { format } from 'date-fns';

export const logWater = (data) => API.post('/water', data);

export const getWaterIntake = (params) => API.get('/water', { params });

export const getWaterEntry = (id) => API.get(`/water/${id}`);

export const updateWater = (id, data) => API.put(`/water/${id}`, data);

export const deleteWater = (id) => API.delete(`/water/${id}`);

export const getDailySummary = (date) =>
  API.get(`/water/daily-summary/${date || format(new Date(), 'yyyy-MM-dd')}`);

export const getHydrationStats = () => API.get('/water/stats/summary');

export const getHydrationStreak = () => API.get('/water/streak');
