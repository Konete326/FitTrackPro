import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as authService from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadUser = useCallback(async () => {
    try {
      const { data } = await authService.getCurrentUser();
      if (data.success && data.user) {
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const loginUser = async (email, password) => {
    setError(null);
    try {
      const { data } = await authService.login(email, password);
      if (data.success) {
        setUser(data.user);
        return data;
      }
      throw new Error(data.message || 'Login failed');
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Login failed';
      setError(msg);
      throw new Error(msg);
    }
  };

  const registerUser = async (formData) => {
    setError(null);
    try {
      const { data } = await authService.register(formData);
      if (data.success) {
        setUser(data.user);
        return data;
      }
      throw new Error(data.message || 'Registration failed');
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Registration failed';
      setError(msg);
      throw new Error(msg);
    }
  };

  const logoutUser = async () => {
    try {
      await authService.logout();
    } catch {
    } finally {
      setUser(null);
    }
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
  };

  const clearError = () => setError(null);

  const value = {
    user,
    loading,
    error,
    loginUser,
    registerUser,
    logoutUser,
    loadUser,
    updateUser,
    clearError,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
