import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

function Splash() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!loading) {
        if (user) {
          const routes = { User: '/dashboard', Trainer: '/trainer/dashboard', Admin: '/admin/dashboard' };
          navigate(routes[user.Role] || '/home');
        } else {
          navigate('/home');
        }
      }
    }, 2500);
    return () => clearTimeout(timer);
  }, [navigate, user, loading]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-violet-500/10 via-gray-100 to-sky-500/10 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900">
      <div className="flex flex-col items-center animate-fade-in">
        <img src="/logo.svg" alt="FitTrack Pro" className="w-20 h-20 mb-6 animate-pulse" />
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-100 tracking-tighter mb-2">
          FitTrack Pro
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">Your Fitness Journey, Unified</p>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-violet-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 bg-violet-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 bg-violet-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  );
}

export default Splash;
