import API from './api';

export const createNutrition = (data) => API.post('/nutrition', data);

export const getNutritions = (params) => API.get('/nutrition', { params });

export const getNutritionEntry = (id) => API.get(`/nutrition/${id}`);

export const updateNutrition = (id, data) => API.put(`/nutrition/${id}`, data);

export const deleteNutrition = (id) => API.delete(`/nutrition/${id}`);

export const searchFoods = (params) => API.get('/nutrition/foods/search', { params });

export const createFood = (data) => API.post('/nutrition/foods', data);

export const getNutritionStats = () => API.get('/nutrition/stats/summary');

export const getDailySummary = (date) =>
  API.get(`/nutrition/daily-summary/${date || ''}`);

export const getMyMealPlans = () => API.get('/nutrition/meal-plans');

export const getMyMealPlanById = (id) => API.get(`/nutrition/meal-plans/${id}`);
