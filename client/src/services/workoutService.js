import API from './api';

export const createWorkout = (data) => API.post('/workouts', data);

export const getWorkouts = (params) => API.get('/workouts', { params });

export const getWorkout = (id) => API.get(`/workouts/${id}`);

export const updateWorkout = (id, data) => API.put(`/workouts/${id}`, data);

export const deleteWorkout = (id) => API.delete(`/workouts/${id}`);

export const startWorkout = (id) => API.put(`/workouts/${id}/start`);

export const completeExercise = (id, exerciseIndex) =>
  API.put(`/workouts/${id}/complete-exercise`, { exerciseIndex });

export const toggleFavorite = (id) => API.put(`/workouts/${id}/favorite`);

export const getFavorites = () => API.get('/workouts/favorites/mine');

export const getPublicTemplates = () => API.get('/workouts/templates/public');

export const cloneWorkout = (id) => API.post(`/workouts/${id}/clone`);

export const searchWorkouts = (params) => API.get('/workouts/search', { params });

export const getWorkoutAnalytics = () => API.get('/workouts/analytics/summary');
