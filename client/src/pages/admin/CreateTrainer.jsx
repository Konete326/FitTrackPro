import React, { useState } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
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

  const handleSubmit = async (e) => {
    e.preventDefault();
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
      <button onClick={() => navigate('/admin/trainers')} className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-violet-500 transition mb-6">
        <FiArrowLeft className="w-4 h-4" /> Back to Trainers
      </button>

      <Card className="max-w-2xl">
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
          <Input label="Full Name" value={form['Profile.Name']} onChange={(e) => setForm({ ...form, 'Profile.Name': e.target.value })} required />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Username" value={form.Username} onChange={(e) => setForm({ ...form, Username: e.target.value })} required />
            <Input label="Email" type="email" value={form.Email} onChange={(e) => setForm({ ...form, Email: e.target.value })} required />
          </div>
          <Input label="Password" type="password" value={form.Password} onChange={(e) => setForm({ ...form, Password: e.target.value })} required />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input label="Age" type="number" min="18" max="100" value={form['Profile.Age']} onChange={(e) => setForm({ ...form, 'Profile.Age': e.target.value })} />
            <Select label="Gender" value={form['Profile.Gender']} onChange={(e) => setForm({ ...form, 'Profile.Gender': e.target.value })} options={[{ value: '', label: 'Select' }, { value: 'Male', label: 'Male' }, { value: 'Female', label: 'Female' }, { value: 'Other', label: 'Other' }]} />
            <Select label="Fitness Level" value={form['Profile.FitnessLevel']} onChange={(e) => setForm({ ...form, 'Profile.FitnessLevel': e.target.value })} options={[{ value: 'Beginner', label: 'Beginner' }, { value: 'Intermediate', label: 'Intermediate' }, { value: 'Advanced', label: 'Advanced' }]} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Bio / Specialization</label>
            <textarea value={form['Profile.Bio']} onChange={(e) => setForm({ ...form, 'Profile.Bio': e.target.value })} rows={3} className="form-textarea w-full bg-white dark:bg-gray-900/30 border-gray-200 dark:border-gray-700/60 rounded-lg focus:ring-violet-500 focus:border-violet-500" placeholder="Describe the trainer's expertise and specializations..." />
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="submit" variant="primary" loading={saving}>Create Trainer</Button>
            <Button type="button" variant="secondary" onClick={() => navigate('/admin/trainers')}>Cancel</Button>
          </div>
        </form>
      </Card>
    </AdminLayout>
  );
}

export default CreateTrainer;