import React, { useState, useRef, useMemo } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { useAuth } from '../../contexts/AuthContext';
import { useValidation, validators, hints } from '../../hooks/useValidation';
import { updateProfile, updatePassword } from '../../services/authService';
import { FiUser, FiLock, FiUpload, FiX, FiCamera } from 'react-icons/fi';
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
    Email: user?.Email || '',
    'Profile.Bio': user?.Profile?.Bio || '',
  });

  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });

  const profileRules = useMemo(() => ({
    'Profile.Name': [(v) => validators.required(v, 'Full name'), (v) => validators.name(v, 'Full name')],
  }), []);
  const { errors: profileErrors, handleChange: profileHandleChange, handleBlur: profileHandleBlur, validateAll: profileValidateAll } = useValidation(profileRules);

  const passwordRules = useMemo(() => ({
    currentPassword: [(v) => validators.required(v, 'Current password')],
    newPassword: [(v) => validators.required(v, 'New password'), (v) => validators.password(v)],
    confirmPassword: [(v) => validators.required(v, 'Confirm password'), (v) => validators.match(v, passwordForm.newPassword, 'Passwords')],
  }), [passwordForm.newPassword]);
  const { errors: passwordErrors, handleChange: passwordHandleChange, handleBlur: passwordHandleBlur, validateAll: passwordValidateAll } = useValidation(passwordRules);

  const updateProfileField = (name, value) => { setProfileForm({ ...profileForm, [name]: value }); profileHandleChange(name, value); };
  const updatePasswordField = (name, value) => { setPasswordForm({ ...passwordForm, [name]: value }); passwordHandleChange(name, value); };

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
    if (!profileValidateAll(profileForm)) return;
    setSaving(true);
    try {
      const formData = new FormData();
      Object.entries(profileForm).forEach(([key, value]) => {
        if (value !== '' && value !== null && value !== undefined) formData.append(key, value);
      });
      if (fileRef.current?.files[0]) formData.append('ProfilePicture', fileRef.current.files[0]);
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
    if (!passwordValidateAll(passwordForm)) return;
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
      <div className="max-w-6xl mx-auto">
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
                <div className="flex items-center gap-6 pb-5 border-b border-gray-100 dark:border-gray-700/60">
                  <div className="relative group">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-violet-100 to-violet-200 dark:from-violet-900/40 dark:to-violet-800/40 flex items-center justify-center overflow-hidden ring-2 ring-violet-200 dark:ring-violet-700/60">
                      {preview ? <img src={preview} alt="Preview" className="w-full h-full object-cover" /> : <span className="text-2xl font-bold text-violet-500">{(profileForm['Profile.Name'] || 'A')[0].toUpperCase()}</span>}
                    </div>
                    <button type="button" onClick={() => fileRef.current?.click()} className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                      <FiCamera className="w-5 h-5 text-white" />
                    </button>
                    {preview && <button type="button" onClick={() => { setPreview(''); if (fileRef.current) fileRef.current.value = ''; }} className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-sm transition"><FiX className="w-2.5 h-2.5" /></button>}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Profile Photo</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">JPG, PNG or GIF. Max 5MB</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Button type="button" variant="secondary" size="sm" onClick={() => fileRef.current?.click()}><FiUpload className="w-3.5 h-3.5 mr-1" />Upload</Button>
                      {preview && <Button type="button" variant="secondary" size="sm" onClick={() => { setPreview(''); if (fileRef.current) fileRef.current.value = ''; }}>Remove</Button>}
                    </div>
                    <input ref={fileRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input label="Full Name" value={profileForm['Profile.Name']} onChange={(e) => updateProfileField('Profile.Name', e.target.value)} onBlur={(e) => profileHandleBlur('Profile.Name', e.target.value)} error={profileErrors['Profile.Name']} helperText={hints.name} required />
                  <Input label="Username" value={profileForm.Username} disabled />
                </div>
                <Input label="Email" type="email" value={profileForm.Email} disabled />
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
              <form onSubmit={handlePasswordSubmit} className="space-y-5">
                <Input label="Current Password" type="password" value={passwordForm.currentPassword} onChange={(e) => updatePasswordField('currentPassword', e.target.value)} onBlur={(e) => passwordHandleBlur('currentPassword', e.target.value)} error={passwordErrors.currentPassword} required />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input label="New Password" type="password" value={passwordForm.newPassword} onChange={(e) => updatePasswordField('newPassword', e.target.value)} onBlur={(e) => passwordHandleBlur('newPassword', e.target.value)} error={passwordErrors.newPassword} helperText={hints.password} required />
                  <Input label="Confirm New Password" type="password" value={passwordForm.confirmPassword} onChange={(e) => updatePasswordField('confirmPassword', e.target.value)} onBlur={(e) => passwordHandleBlur('confirmPassword', e.target.value)} error={passwordErrors.confirmPassword} helperText={hints.confirmPassword} required />
                </div>
                <div className="flex justify-end">
                  <Button type="submit" variant="primary" loading={saving}>Change Password</Button>
                </div>
              </form>
            </Card>
          )}
        </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminSettings;