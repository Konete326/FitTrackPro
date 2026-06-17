import API from './api';

export const submitFeedback = (message) =>
  API.post('/feedbacks', { Message: message });

export const getAllFeedbacks = (params) =>
  API.get('/feedbacks', { params });

export const markFeedbackAsRead = (id) =>
  API.put(`/feedbacks/${id}`);

export const replyToFeedback = (id, message) =>
  API.post(`/feedbacks/${id}/reply`, { message });
