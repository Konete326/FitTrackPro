import API from './api';

export const createRequest = (trainerId, message) =>
  API.post('/trainer-requests', { trainerId, message });

export const getAllRequests = (params) =>
  API.get('/trainer-requests', { params });

export const getMyRequests = () => API.get('/trainer-requests/my-requests');

export const updateRequestStatus = (id, status, adminNotes) =>
  API.put(`/trainer-requests/${id}`, { status, adminNotes });

export const getAvailableTrainers = () =>
  API.get('/trainer-requests/available-trainers');
