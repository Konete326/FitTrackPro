import React, { useState, useEffect } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import Card from '../../components/common/Card';
import StatCard from '../../components/common/StatCard';
import Skeleton from '../../components/common/Skeleton';
import { getSystemStats } from '../../services/adminService';
import { getAllUsers } from '../../services/adminService';
import { FiUsers, FiUserCheck, FiClipboard, FiActivity } from 'react-icons/fi';

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [recentUsers, setRecentUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, usersRes] = await Promise.allSettled([
          getSystemStats(),
          getAllUsers({ limit: 5, page: 1 }),
        ]);
        if (statsRes.status === 'fulfilled') setStats(statsRes.value.data?.data || null);
        if (usersRes.status === 'fulfilled') setRecentUsers(usersRes.value.data?.data || []);
      } catch {
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <AdminLayout pageTitle="Admin Dashboard">
      {loading ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => <Skeleton key={i} type="card" />)}
          </div>
          <Skeleton type="rect" />
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard title="Total Users" value={stats?.users || 0} icon={<FiUsers className="w-5 h-5" />} color="violet" />
            <StatCard title="Trainers" value={stats?.trainers || 0} icon={<FiUserCheck className="w-5 h-5" />} color="sky" />
            <StatCard title="Total Workouts" value={stats?.workouts || 0} icon={<FiClipboard className="w-5 h-5" />} color="green" />
            <StatCard title="System Health" value="Online" icon={<FiActivity className="w-5 h-5" />} color="yellow" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="!p-0">
              <Card.Header>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Recent Users</h3>
              </Card.Header>
              {recentUsers.length === 0 ? (
                <div className="p-5 text-center">
                  <p className="text-sm text-gray-500 dark:text-gray-400">No users yet.</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100 dark:divide-gray-700/60">
                  {recentUsers.map((u) => (
                    <div key={u._id} className="flex items-center justify-between px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-violet-500/10 flex items-center justify-center overflow-hidden">
                          {u.Profile?.ProfilePicture ? (
                            <img src={u.Profile.ProfilePicture} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-sm font-bold text-violet-500">{(u.Profile?.Name || u.Username || 'U')[0].toUpperCase()}</span>
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-800 dark:text-gray-100">{u.Profile?.Name || u.Username}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{u.Email}</p>
                        </div>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        u.Role === 'Admin' ? 'bg-red-500/10 text-red-500' : u.Role === 'Trainer' ? 'bg-sky-500/10 text-sky-500' : 'bg-violet-500/10 text-violet-500'
                      }`}>{u.Role}</span>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            <Card className="!p-0">
              <Card.Header>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">System Overview</h3>
              </Card.Header>
              <div className="p-5 space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900/30 rounded-lg">
                  <span className="text-sm text-gray-600 dark:text-gray-400">User-to-Trainer Ratio</span>
                  <span className="font-bold text-gray-800 dark:text-gray-100">
                    {stats?.trainers > 0 ? `${Math.round((stats.users || 0) / stats.trainers)}:1` : 'N/A'}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900/30 rounded-lg">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Avg Workouts per User</span>
                  <span className="font-bold text-gray-800 dark:text-gray-100">
                    {stats?.users > 0 ? ((stats.workouts || 0) / stats.users).toFixed(1) : '0'}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900/30 rounded-lg">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Total Accounts</span>
                  <span className="font-bold text-gray-800 dark:text-gray-100">{(stats?.users || 0) + (stats?.trainers || 0)}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/10 rounded-lg">
                  <span className="text-sm text-green-700 dark:text-green-400">Server Status</span>
                  <span className="font-bold text-green-600">Healthy</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

export default AdminDashboard;