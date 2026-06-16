import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import toast from 'react-hot-toast';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { forgotPassword } from '../../services/authService';
import { FiMail, FiArrowLeft } from 'react-icons/fi';

const schema = yup.object({
  email: yup.string().required('Email is required').email('Invalid email'),
});

function ForgotPassword() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      await forgotPassword(data.email);
      setSubmitted(true);
      toast.success('Reset link sent! Check your notifications.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send reset link');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/home" className="inline-flex items-center gap-2 mb-6">
            <img src="/logo.png" alt="FitTrack Pro" className="w-10 h-10" />
            <span className="text-xl font-bold text-gray-800 dark:text-gray-100">FitTrack Pro</span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">Forgot Password</h1>
          <p className="text-gray-500 dark:text-gray-400">We'll send you a link to reset your password</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xs p-6 md:p-8">
          {submitted ? (
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">Check Your Notifications</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                A password reset link has been sent. Check your notifications in the app.
              </p>
              <Link to="/login" className="text-violet-500 hover:text-violet-600 dark:hover:text-violet-400 text-sm font-medium transition">
                Back to Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <Input
                label="Email Address"
                type="email"
                placeholder="your@email.com"
                icon={<FiMail className="w-4 h-4" />}
                {...register('email')}
                error={errors.email?.message}
              />
              <Button type="submit" loading={submitting} className="w-full">Send Reset Link</Button>
            </form>
          )}
        </div>

        <Link to="/login" className="inline-flex items-center gap-2 mt-6 text-sm text-gray-500 dark:text-gray-400 hover:text-violet-500 transition">
          <FiArrowLeft className="w-4 h-4" />
          Back to Login
        </Link>
      </div>
    </div>
  );
}

export default ForgotPassword;
