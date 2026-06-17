import API from './api';

export const register = (formData) =>
  API.post('/auth/register', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const login = (email, password) =>
  API.post('/auth/login', { Email: email, Password: password });

export const logout = () => API.post('/auth/logout');

export const getCurrentUser = () => API.get('/auth/me');

export const updateProfile = (formData) =>
  API.put('/auth/profile', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const updatePassword = (currentPassword, newPassword) =>
  API.put('/auth/password', { currentPassword, newPassword });

export const forgotPassword = (email) =>
  API.post('/auth/forgot-password', { Email: email });

export const resetPassword = (resetToken, password) =>
  API.post(`/auth/reset-password/${resetToken}`, { Password: password });

export const deleteAccount = () => API.delete('/auth/account');
