import React, { useState, useRef } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { useAuth } from '../../contexts/AuthContext';
import { updateProfile, updatePassword } from '../../services/authService';
import { FiUser, FiLock, FiUpload, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';

function AdminSettings() {
  const { user, updateUser } = useAuth();
  const fileRef = useRef(null);
  const [activeTab, setActiveTab] = useState('profile');
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState(user?.Profile?.ProfilePicture || '');

  const [profileForm, setProfileForm] = useState({
    'Profile.Name': user?.Profile?.Name || '',
    Username: user?.Username || '',
    'Profile.Age': user?.Profile?.Age || '',
    'Profile.Gender': user?.Profile?.Gender || '',
    'Profile.Bio': user?.Profile?.Bio || '',
  });

  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { toast.error('Image must be under 5MB'); return; }
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const formData = new FormData();
      Object.entries(profileForm).forEach(([key, value]) => {
        if (value !== '' && value !== null && value !== undefined) formData.append(key, value);
      });
      if (fileRef.current?.files[0]) formData.append('profilePicture', fileRef.current.files[0]);
      const { data } = await updateProfile(formData);
      if (data.success && data.user) { updateUser(data.user); toast.success('Profile updated'); }
    } catch {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) { toast.error('Passwords do not match'); return; }
    if (passwordForm.newPassword.length < 8) { toast.error('Password must be at least 8 characters'); return; }
    setSaving(true);
    try {
      const { data } = await updatePassword(passwordForm.currentPassword, passwordForm.newPassword);
      if (data.success) { toast.success('Password changed'); setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' }); }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: <FiUser className="w-4 h-4" /> },
    { id: 'password', label: 'Password', icon: <FiLock className="w-4 h-4" /> },
  ];

  return (
    <AdminLayout pageTitle="Admin Settings">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="lg:col-span-1 !p-2 h-fit">
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition ${activeTab === tab.id ? 'bg-violet-500/10 text-violet-600 dark:text-violet-400' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900'}`}>
                {tab.icon}{tab.label}
              </button>
            ))}
          </nav>
        </Card>

        <div className="lg:col-span-3">
          {activeTab === 'profile' && (
            <Card>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-6">Profile Information</h3>
              <form onSubmit={handleProfileSubmit} className="space-y-5">
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full bg-red-500/10 flex items-center justify-center overflow-hidden ring-2 ring-red-500/20">
                      {preview ? <img src={preview} alt="Preview" className="w-full h-full object-cover" /> : <span className="text-2xl font-bold text-red-500">{(profileForm['Profile.Name'] || 'A')[0].toUpperCase()}</span>}
                    </div>
                    {preview && <button type="button" onClick={() => { setPreview(''); if (fileRef.current) fileRef.current.value = ''; }} className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center"><FiX className="w-3 h-3" /></button>}
                  </div>
                  <div>
                    <Button type="button" variant="secondary" size="sm" onClick={() => fileRef.current?.click()}><FiUpload className="w-4 h-4 mr-1" />Upload Photo</Button>
                    <input ref={fileRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                    <p className="text-xs text-gray-400 mt-1">Max 5MB</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input label="Full Name" value={profileForm['Profile.Name']} onChange={(e) => setProfileForm({ ...profileForm, 'Profile.Name': e.target.value })} required />
                  <Input label="Username" value={profileForm.Username} disabled />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input label="Age" type="number" min="13" max="120" value={profileForm['Profile.Age']} onChange={(e) => setProfileForm({ ...profileForm, 'Profile.Age': e.target.value })} />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Gender</label>
                    <select value={profileForm['Profile.Gender']} onChange={(e) => setProfileForm({ ...profileForm, 'Profile.Gender': e.target.value })} className="form-select w-full bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700/60 rounded-lg focus:ring-violet-500 focus:border-violet-500">
                      <option value="">Select</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Bio</label>
                  <textarea value={profileForm['Profile.Bio']} onChange={(e) => setProfileForm({ ...profileForm, 'Profile.Bio': e.target.value })} rows={3} maxLength={500} className="form-textarea w-full bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700/60 rounded-lg focus:ring-violet-500 focus:border-violet-500" placeholder="About yourself..." />
                  <p className="text-xs text-gray-400 mt-1">{(profileForm['Profile.Bio'] || '').length}/500</p>
                </div>
                <div className="flex justify-end">
                  <Button type="submit" variant="primary" loading={saving}>Save Changes</Button>
                </div>
              </form>
            </Card>
          )}

          {activeTab === 'password' && (
            <Card>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-6">Change Password</h3>
              <form onSubmit={handlePasswordSubmit} className="space-y-5 max-w-md">
                <Input label="Current Password" type="password" value={passwordForm.currentPassword} onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })} required />
                <Input label="New Password" type="password" value={passwordForm.newPassword} onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })} required />
                <Input label="Confirm New Password" type="password" value={passwordForm.confirmPassword} onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })} required />
                <div className="flex justify-end">
                  <Button type="submit" variant="primary" loading={saving}>Change Password</Button>
                </div>
              </form>
            </Card>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminSettings;