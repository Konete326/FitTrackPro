import API from './api';

export const getAchievements = (params) => API.get('/achievements', { params });

export const getAchievement = (id) => API.get(`/achievements/${id}`);

export const getAchievementStats = () => API.get('/achievements/stats/summary');

export const getLeaderboard = () => API.get('/achievements/leaderboard');

export const checkNewAchievements = (checkType, checkData) =>
  API.post('/achievements/check', { checkType, checkData });
