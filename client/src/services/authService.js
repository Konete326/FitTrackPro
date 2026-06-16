import API from './api';

export const register = (formData) =>
  API.post('/auth/register', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const login = (email, password) =>
  API.post('/auth/login', { email, password });

export const logout = () => API.post('/auth/logout');

export const getCurrentUser = () => API.get('/auth/me');

export const updateProfile = (formData) =>
  API.put('/auth/update-profile', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const updatePassword = (currentPassword, newPassword) =>
  API.put('/auth/update-password', { currentPassword, newPassword });

export const forgotPassword = (email) =>
  API.post('/auth/forgot-password', { email });

export const resetPassword = (resetToken, password) =>
  API.put(`/auth/reset-password/${resetToken}`, { password });

export const deleteAccount = () => API.delete('/auth/delete-account');
