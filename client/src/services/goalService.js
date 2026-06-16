import API from './api';

export const createGoal = (data) => API.post('/goals', data);

export const getGoals = (params) => API.get('/goals', { params });

export const getGoal = (id) => API.get(`/goals/${id}`);

export const updateGoal = (id, data) => API.put(`/goals/${id}`, data);

export const deleteGoal = (id) => API.delete(`/goals/${id}`);

export const updateGoalProgress = (id, currentValue) =>
  API.put(`/goals/${id}/progress`, { currentValue });

export const completeGoal = (id) => API.put(`/goals/${id}/complete`);

export const activateGoal = (id) => API.put(`/goals/${id}/activate`);

export const pauseGoal = (id) => API.put(`/goals/${id}/pause`);

export const getGoalStats = () => API.get('/goals/stats/summary');

export const getGoalInsights = () => API.get('/goals/insights/summary');
