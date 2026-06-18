import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import toast from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { FiMail, FiLock, FiUser, FiEye, FiEyeOff } from 'react-icons/fi';

const schema = yup.object({
  Username: yup.string().required('Username is required').min(3).max(30).matches(/^[a-zA-Z0-9_]+$/, 'Only letters, numbers, and underscores'),
  Email: yup.string().required('Email is required').email('Invalid email'),
  Password: yup.string().required('Password is required').min(8, 'Min 8 characters'),
  'Profile[Name]': yup.string().required('Name is required'),
});

function Register() {
  const navigate = useNavigate();
  const { registerUser, user, loading: authLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: yupResolver(schema), mode: 'onBlur' });

  useEffect(() => {
    if (!authLoading && user) {
      navigate('/dashboard');
    }
  }, [user, authLoading, navigate]);

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value);
      });
      await registerUser(formData);
      toast.success('Account created! You can complete your profile in Settings.');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-950 px-4 py-12">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <Link to="/home" className="inline-flex items-center gap-2 mb-6">
            <img src="/logo.svg" alt="FitTrack Pro" className="w-10 h-10" />
            <span className="text-xl font-bold text-gray-800 dark:text-gray-100">FitTrack Pro</span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">Create Account</h1>
          <p className="text-gray-500 dark:text-gray-400">Start your fitness journey today</p>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl shadow-xs p-6 md:p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Username" placeholder="john_doe" icon={<FiUser className="w-4 h-4" />} {...register('Username')} error={errors.Username?.message} />
              <Input label="Full Name" placeholder="John Doe" {...register('Profile[Name]')} error={errors['Profile[Name]']?.message} />
            </div>

            <Input label="Email" type="email" placeholder="your@email.com" icon={<FiMail className="w-4 h-4" />} {...register('Email')} error={errors.Email?.message} />

            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Min 8 characters"
                icon={<FiLock className="w-4 h-4" />}
                {...register('Password')}
                error={errors.Password?.message}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-9 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition">
                {showPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
              </button>
            </div>

            <Button type="submit" loading={submitting} className="w-full">Create Account</Button>
          </form>
          <p className="text-xs text-center text-gray-400 dark:text-gray-500 mt-4">You can add more details like age, height, weight, and fitness level later in your profile settings.</p>
        </div>

        <p className="text-center mt-6 text-sm text-gray-500 dark:text-gray-400">
          Already have an account?{' '}
          <Link to="/login" className="text-violet-500 hover:text-violet-600 dark:hover:text-violet-400 font-medium transition">Sign In</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
