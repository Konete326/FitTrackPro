import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import toast from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';

const schema = yup.object({
  Email: yup.string().required('Email is required').email('Invalid email'),
  Password: yup.string().required('Password is required'),
});

function Login() {
  const navigate = useNavigate();
  const { loginUser, user, loading: authLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: yupResolver(schema) });

  useEffect(() => {
    if (!authLoading && user) {
      const routes = { User: '/dashboard', Trainer: '/trainer/dashboard', Admin: '/admin/dashboard' };
      navigate(routes[user.Role] || '/home');
    }
  }, [user, authLoading, navigate]);

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      const result = await loginUser(data.Email, data.Password);
      toast.success('Welcome back!');
      const routes = { User: '/dashboard', Trainer: '/trainer/dashboard', Admin: '/admin/dashboard' };
      navigate(routes[result.user.Role] || '/home');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-950 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/home" className="inline-flex items-center gap-2 mb-6">
            <img src="/logo.svg" alt="FitTrack Pro" className="w-10 h-10" />
            <span className="text-xl font-bold text-gray-800 dark:text-gray-100">FitTrack Pro</span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">Welcome Back</h1>
          <p className="text-gray-500 dark:text-gray-400">Sign in to continue your fitness journey</p>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl shadow-xs p-6 md:p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Input
              label="Email"
              type="email"
              placeholder="your@email.com"
              icon={<FiMail className="w-4 h-4" />}
              {...register('Email')}
              error={errors.Email?.message}
            />

            <div>
              <div className="relative">
                <Input
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  icon={<FiLock className="w-4 h-4" />}
                  {...register('Password')}
                  error={errors.Password?.message}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-9 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition"
                >
                  {showPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-end">
              <Link to="/forgot-password" className="text-sm text-violet-500 hover:text-violet-600 dark:hover:text-violet-400 transition">
                Forgot password?
              </Link>
            </div>

            <Button type="submit" loading={submitting} className="w-full">Sign In</Button>
          </form>
        </div>

        <p className="text-center mt-6 text-sm text-gray-500 dark:text-gray-400">
          Don't have an account?{' '}
          <Link to="/register" className="text-violet-500 hover:text-violet-600 dark:hover:text-violet-400 font-medium transition">
            Create Account
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
