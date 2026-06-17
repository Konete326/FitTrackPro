import React from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiCalendar, FiEdit2, FiShield } from 'react-icons/fi';
import { format } from 'date-fns';

function AdminProfile() {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;
  const profile = user.Profile || {};

  return (
    <AdminLayout pageTitle="Admin Profile">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-end mb-6">
          <Button variant="secondary" icon={<FiEdit2 className="w-4 h-4" />} onClick={() => navigate('/admin/settings')}>Edit Profile</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        <Card className="flex flex-col items-center text-center py-8">
          <div className="w-28 h-28 rounded-full bg-red-500/10 flex items-center justify-center overflow-hidden mb-4 ring-4 ring-red-500/20">
            {profile.ProfilePicture ? (
              <img src={profile.ProfilePicture} alt={profile.Name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-4xl font-bold text-red-500">{(profile.Name || user.Username || 'A')[0].toUpperCase()}</span>
            )}
          </div>
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">{profile.Name || user.Username}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">@{user.Username}</p>
          <div className="flex flex-wrap gap-2 mt-4 justify-center">
            <Badge variant="red">Admin</Badge>
            {user.IsVerified && <Badge variant="green">Verified</Badge>}
          </div>
          <div className="mt-6 space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-2"><FiMail className="w-4 h-4" />{user.Email}</div>
            {profile.Age && <div className="flex items-center gap-2"><FiUser className="w-4 h-4" />{profile.Age} years old</div>}
            <div className="flex items-center gap-2"><FiCalendar className="w-4 h-4" />Joined {format(new Date(user.createdAt), 'MMM yyyy')}</div>
          </div>
        </Card>

        <Card className="flex flex-col">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center">
              <FiShield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 dark:text-gray-100">Administrator</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Full system access and management</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 flex-1">
            <div className="p-3 bg-gray-100 dark:bg-gray-900 rounded-lg text-center">
              <p className="text-sm font-medium text-gray-800 dark:text-gray-100">User Management</p>
              <p className="text-xs text-gray-400">CRUD operations</p>
            </div>
            <div className="p-3 bg-gray-100 dark:bg-gray-900 rounded-lg text-center">
              <p className="text-sm font-medium text-gray-800 dark:text-gray-100">Trainer Management</p>
              <p className="text-xs text-gray-400">Assign & manage trainers</p>
            </div>
            <div className="p-3 bg-gray-100 dark:bg-gray-900 rounded-lg text-center">
              <p className="text-sm font-medium text-gray-800 dark:text-gray-100">System Stats</p>
              <p className="text-xs text-gray-400">Analytics & monitoring</p>
            </div>
            <div className="p-3 bg-gray-100 dark:bg-gray-900 rounded-lg text-center">
              <p className="text-sm font-medium text-gray-800 dark:text-gray-100">Feedback Review</p>
              <p className="text-xs text-gray-400">User submissions</p>
            </div>
          </div>
          {profile.Bio && (
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700/60">
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Bio</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">{profile.Bio}</p>
            </div>
          )}
        </Card>
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminProfile;