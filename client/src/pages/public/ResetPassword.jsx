import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import toast from 'react-hot-toast';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { resetPassword } from '../../services/authService';
import { FiLock, FiEye, FiEyeOff } from 'react-icons/fi';

const schema = yup.object({
  Password: yup.string().required('Password is required').min(8, 'Min 8 characters'),
  ConfirmPassword: yup.string().required('Confirm your password').oneOf([yup.ref('Password')], 'Passwords must match'),
});

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: yupResolver(schema), mode: 'onBlur' });

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      await resetPassword(token, data.Password);
      toast.success('Password reset successful! Please login.');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reset password');
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
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">Reset Password</h1>
          <p className="text-gray-500 dark:text-gray-400">Enter your new password below</p>
        </div>

        <div className="bg-gray-50 dark:bg-gray-900 rounded-xl shadow-xs p-6 md:p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="relative">
              <Input
                label="New Password"
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

            <Input
              label="Confirm Password"
              type="password"
              placeholder="Confirm new password"
              icon={<FiLock className="w-4 h-4" />}
              {...register('ConfirmPassword')}
              error={errors.ConfirmPassword?.message}
            />

            <Button type="submit" loading={submitting} className="w-full">Reset Password</Button>
          </form>
        </div>

        <p className="text-center mt-6 text-sm text-gray-500 dark:text-gray-400">
          Remember your password?{' '}
          <Link to="/login" className="text-violet-500 hover:text-violet-600 dark:hover:text-violet-400 font-medium transition">Sign In</Link>
        </p>
      </div>
    </div>
  );
}

export default ResetPassword;
