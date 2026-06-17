import React, { useState, useMemo } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import { useValidation, validators, hints } from '../../hooks/useValidation';
import { createUser } from '../../services/adminService';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiUserCheck } from 'react-icons/fi';
import toast from 'react-hot-toast';

function CreateTrainer() {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    Username: '', Email: '', Password: '',
    'Profile.Name': '', 'Profile.Age': '', 'Profile.Gender': '',
    'Profile.FitnessLevel': 'Advanced', 'Profile.Bio': '',
  });

  const rules = useMemo(() => ({
    'Profile.Name': [
      (v) => validators.required(v, 'Full name'),
      (v) => validators.name(v, 'Full name'),
    ],
    Username: [
      (v) => validators.required(v, 'Username'),
      (v) => validators.username(v),
    ],
    Email: [
      (v) => validators.required(v, 'Email'),
      (v) => validators.email(v),
    ],
    Password: [
      (v) => validators.required(v, 'Password'),
      (v) => validators.password(v),
    ],
    'Profile.Age': [
      (v) => validators.numberRange(v, 18, 100, 'Age'),
    ],
  }), []);

  const { errors, handleChange, handleBlur, validateAll } = useValidation(rules);

  const updateField = (name, value) => {
    setForm({ ...form, [name]: value });
    handleChange(name, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateAll(form)) return;
    setSaving(true);
    try {
      const payload = {
        Username: form.Username,
        Email: form.Email,
        Password: form.Password,
        Role: 'Trainer',
        Profile: {
          Name: form['Profile.Name'],
          Age: form['Profile.Age'] ? parseInt(form['Profile.Age']) : undefined,
          Gender: form['Profile.Gender'] || undefined,
          FitnessLevel: form['Profile.FitnessLevel'],
          Bio: form['Profile.Bio'] || undefined,
        },
      };
      await createUser(payload);
      toast.success('Trainer created');
      navigate('/admin/trainers');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create trainer');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout pageTitle="Create Trainer">
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-12rem)]">
        <button onClick={() => navigate('/admin/trainers')} className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-violet-500 transition mb-6 self-start">
          <FiArrowLeft className="w-4 h-4" /> Back to Trainers
        </button>

        <Card className="max-w-2xl w-full">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-sky-500/10 text-sky-500 rounded-full flex items-center justify-center">
            <FiUserCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Register New Trainer</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Fill in the trainer's credentials</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Full Name"
            value={form['Profile.Name']}
            onChange={(e) => updateField('Profile.Name', e.target.value)}
            onBlur={(e) => handleBlur('Profile.Name', e.target.value)}
            error={errors['Profile.Name']}
            helperText={hints.name}
            required
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Username"
              value={form.Username}
              onChange={(e) => updateField('Username', e.target.value)}
              onBlur={(e) => handleBlur('Username', e.target.value)}
              error={errors.Username}
              helperText={hints.username}
              required
            />
            <Input
              label="Email"
              type="email"
              value={form.Email}
              onChange={(e) => updateField('Email', e.target.value)}
              onBlur={(e) => handleBlur('Email', e.target.value)}
              error={errors.Email}
              helperText={hints.email}
              required
            />
          </div>
          <Input
            label="Password"
            type="password"
            value={form.Password}
            onChange={(e) => updateField('Password', e.target.value)}
            onBlur={(e) => handleBlur('Password', e.target.value)}
            error={errors.Password}
            helperText={hints.password}
            required
          />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Age"
              type="number"
              min="18"
              max="100"
              value={form['Profile.Age']}
              onChange={(e) => updateField('Profile.Age', e.target.value)}
              onBlur={(e) => handleBlur('Profile.Age', e.target.value)}
              error={errors['Profile.Age']}
              helperText={hints.age}
            />
            <Select label="Gender" value={form['Profile.Gender']} onChange={(e) => setForm({ ...form, 'Profile.Gender': e.target.value })} options={[{ value: '', label: 'Select' }, { value: 'Male', label: 'Male' }, { value: 'Female', label: 'Female' }, { value: 'Other', label: 'Other' }]} />
            <Select label="Fitness Level" value={form['Profile.FitnessLevel']} onChange={(e) => setForm({ ...form, 'Profile.FitnessLevel': e.target.value })} options={[{ value: 'Beginner', label: 'Beginner' }, { value: 'Intermediate', label: 'Intermediate' }, { value: 'Advanced', label: 'Advanced' }]} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Bio / Specialization</label>
            <textarea value={form['Profile.Bio']} onChange={(e) => setForm({ ...form, 'Profile.Bio': e.target.value })} rows={3} className="form-textarea w-full !bg-gray-50 dark:!bg-gray-800 dark:text-gray-100 border-gray-200 dark:border-gray-700/60 rounded-lg focus:ring-0 focus:border-gray-300 dark:focus:border-gray-600 transition" placeholder="Describe the trainer's expertise and specializations..." />
            <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">Optional, up to 500 characters</p>
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="submit" variant="primary" loading={saving}>Create Trainer</Button>
            <Button type="button" variant="secondary" onClick={() => navigate('/admin/trainers')}>Cancel</Button>
          </div>
        </form>
        </Card>
      </div>
    </AdminLayout>
  );
}

export default CreateTrainer;
