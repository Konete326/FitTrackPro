import API from './api';

export const submitFeedback = (message) =>
  API.post('/feedbacks', { Message: message });

export const getAllFeedbacks = (params) =>
  API.get('/feedbacks', { params });

export const markFeedbackAsRead = (id) =>
  API.put(`/feedbacks/${id}`);
