import React, { useState, useEffect } from 'react';
import TrainerLayout from '../../layouts/TrainerLayout';
import { useAuth } from '../../contexts/AuthContext';
import Card from '../../components/common/Card';
import StatCard from '../../components/common/StatCard';
import Button from '../../components/common/Button';
import Skeleton from '../../components/common/Skeleton';
import { getClients } from '../../services/trainerService';
import { getDashboardStats } from '../../services/trainerService';
import { useNavigate } from 'react-router-dom';
import { FiUsers, FiClipboard, FiActivity, FiPlus } from 'react-icons/fi';

function TrainerDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [clientsRes, statsRes] = await Promise.allSettled([
          getClients(),
          getDashboardStats(),
        ]);
        if (clientsRes.status === 'fulfilled') setClients(clientsRes.value.data?.data || []);
        if (statsRes.status === 'fulfilled') setStats(statsRes.value.data?.data || null);
      } catch {
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <TrainerLayout pageTitle={`Welcome, ${user?.Profile?.Name || user?.Username}!`}>
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
            <StatCard title="Total Clients" value={stats?.totalClients || clients.length} icon={<FiUsers className="w-5 h-5" />} color="violet" />
            <StatCard title="Assigned Workouts" value={stats?.assignedWorkouts || 0} icon={<FiClipboard className="w-5 h-5" />} color="sky" />
            <StatCard title="Active Clients" value={clients.filter(c => c.IsActive).length} icon={<FiActivity className="w-5 h-5" />} color="green" />
            <StatCard title="This Week" value={clients.length} icon={<FiUsers className="w-5 h-5" />} color="yellow" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="!p-0">
              <Card.Header>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">My Clients</h3>
                  <Button variant="secondary" size="sm" onClick={() => navigate('/trainer/clients')}>View All</Button>
                </div>
              </Card.Header>
              {clients.length === 0 ? (
                <div className="p-5 text-center">
                  <p className="text-sm text-gray-500 dark:text-gray-400">No clients assigned yet.</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100 dark:divide-gray-700/60">
                  {clients.slice(0, 6).map((client) => (
                    <div
                      key={client._id}
                      className="flex items-center justify-between px-5 py-3 hover:bg-gray-50 dark:hover:bg-gray-900 transition cursor-pointer"
                      onClick={() => navigate(`/trainer/clients/${client._id}`)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-violet-500/10 flex items-center justify-center overflow-hidden">
                          {client.Profile?.ProfilePicture ? (
                            <img src={client.Profile.ProfilePicture} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-sm font-bold text-violet-500">{(client.Profile?.Name || client.Username || 'U')[0].toUpperCase()}</span>
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-800 dark:text-gray-100">{client.Profile?.Name || client.Username}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{client.Profile?.FitnessLevel || 'No level set'}</p>
                        </div>
                      </div>
                      <span className={`w-2 h-2 rounded-full ${client.IsActive ? 'bg-green-500' : 'bg-gray-300'}`} />
                    </div>
                  ))}
                </div>
              )}
            </Card>

            <Card className="!p-0">
              <Card.Header>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Quick Actions</h3>
              </Card.Header>
              <div className="p-5 space-y-3">
                <Button variant="primary" className="w-full justify-start" onClick={() => navigate('/trainer/templates')}>
                  <FiClipboard className="w-4 h-4 mr-2" /> Manage Workout Templates
                </Button>
                <Button variant="secondary" className="w-full justify-start" onClick={() => navigate('/trainer/clients')}>
                  <FiUsers className="w-4 h-4 mr-2" /> View All Clients
                </Button>
                <Button variant="secondary" className="w-full justify-start" onClick={() => navigate('/trainer/profile')}>
                  <FiPlus className="w-4 h-4 mr-2" /> Edit My Profile
                </Button>
              </div>
            </Card>
          </div>
        </div>
      )}
    </TrainerLayout>
  );
}

export default TrainerDashboard;

