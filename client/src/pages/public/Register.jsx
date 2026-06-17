import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import toast from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Button from '../../components/common/Button';
import { FiMail, FiLock, FiUser, FiEye, FiEyeOff, FiUpload } from 'react-icons/fi';

const schema = yup.object({
  Username: yup.string().required('Username is required').min(3).max(30).matches(/^[a-zA-Z0-9_]+$/, 'Only letters, numbers, and underscores'),
  Email: yup.string().required('Email is required').email('Invalid email'),
  Password: yup.string().required('Password is required').min(8, 'Min 8 characters'),
  'Profile[Name]': yup.string().required('Name is required'),
  'Profile[Age]': yup.number().required('Age is required').min(13).max(120).typeError('Age must be a number'),
  'Profile[Gender]': yup.string().required('Gender is required').oneOf(['Male', 'Female', 'Other']),
  'Profile[Height]': yup.number().required('Height is required').positive().typeError('Must be a number'),
  'Profile[Weight]': yup.number().required('Weight is required').positive().typeError('Must be a number'),
  'Profile[FitnessLevel]': yup.string().required('Fitness level is required').oneOf(['Beginner', 'Intermediate', 'Advanced']),
});

function Register() {
  const navigate = useNavigate();
  const { registerUser, user, loading: authLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [profilePic, setProfilePic] = useState(null);
  const [preview, setPreview] = useState(null);
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: yupResolver(schema), mode: 'onBlur' });

  useEffect(() => {
    if (!authLoading && user) {
      navigate('/dashboard');
    }
  }, [user, authLoading, navigate]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image must be less than 5MB');
        return;
      }
      setProfilePic(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value);
      });
      if (profilePic) formData.append('ProfilePicture', profilePic);
      await registerUser(formData);
      toast.success('Account created successfully!');
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
            <div className="flex flex-col items-center mb-6">
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                  {preview ? (
                    <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <FiUser className="w-8 h-8 text-gray-400" />
                  )}
                </div>
                <label className="absolute -bottom-1 -right-1 w-8 h-8 bg-violet-500 text-white rounded-full flex items-center justify-center cursor-pointer hover:bg-violet-600 transition">
                  <FiUpload className="w-3.5 h-3.5" />
                  <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                </label>
              </div>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">Profile picture (optional, max 5MB)</p>
            </div>

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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Age" type="number" placeholder="25" {...register('Profile[Age]')} error={errors['Profile[Age]']?.message} />
              <Select label="Gender" options={[{ value: 'Male', label: 'Male' }, { value: 'Female', label: 'Female' }, { value: 'Other', label: 'Other' }]} placeholder="Select gender" {...register('Profile[Gender]')} error={errors['Profile[Gender]']?.message} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Height (cm)" type="number" placeholder="175" {...register('Profile[Height]')} error={errors['Profile[Height]']?.message} />
              <Input label="Weight (kg)" type="number" placeholder="70" {...register('Profile[Weight]')} error={errors['Profile[Weight]']?.message} />
            </div>

            <Select label="Fitness Level" options={[{ value: 'Beginner', label: 'Beginner' }, { value: 'Intermediate', label: 'Intermediate' }, { value: 'Advanced', label: 'Advanced' }]} placeholder="Select fitness level" {...register('Profile[FitnessLevel]')} error={errors['Profile[FitnessLevel]']?.message} />

            <Button type="submit" loading={submitting} className="w-full">Create Account</Button>
          </form>
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
