import React, { useState, useEffect } from 'react';
import TrainerLayout from '../../layouts/TrainerLayout';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import StatCard from '../../components/common/StatCard';
import Skeleton from '../../components/common/Skeleton';
import { useAuth } from '../../contexts/AuthContext';
import { getClients, getDashboardStats } from '../../services/trainerService';
import { useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiCalendar, FiEdit2, FiUsers, FiClipboard } from 'react-icons/fi';
import { format } from 'date-fns';

function TrainerProfile() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [clientCount, setClientCount] = useState(0);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [clientsRes, statsRes] = await Promise.allSettled([getClients(), getDashboardStats()]);
        if (clientsRes.status === 'fulfilled') setClientCount(clientsRes.value.data?.count || 0);
        if (statsRes.status === 'fulfilled') setStats(statsRes.value.data?.data || null);
      } catch {
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (!user) return null;
  const profile = user.Profile || {};

  return (
    <TrainerLayout pageTitle="My Profile">
      <div className="flex justify-end mb-6">
        <Button variant="secondary" icon={<FiEdit2 className="w-4 h-4" />} onClick={() => navigate('/trainer/settings')}>Edit Profile</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="flex flex-col items-center text-center py-8">
          <div className="w-28 h-28 rounded-full bg-violet-500/10 flex items-center justify-center overflow-hidden mb-4 ring-4 ring-violet-500/20">
            {profile.ProfilePicture ? (
              <img src={profile.ProfilePicture} alt={profile.Name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-4xl font-bold text-violet-500">{(profile.Name || user.Username || 'T')[0].toUpperCase()}</span>
            )}
          </div>
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">{profile.Name || user.Username}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">@{user.Username}</p>
          {profile.Bio && <p className="text-sm text-gray-600 dark:text-gray-400 mt-3 max-w-xs">{profile.Bio}</p>}
          <div className="flex flex-wrap gap-2 mt-4 justify-center">
            <Badge variant="violet">Trainer</Badge>
            {profile.FitnessLevel && <Badge variant="sky">{profile.FitnessLevel}</Badge>}
          </div>
          <div className="mt-6 space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-2"><FiMail className="w-4 h-4" />{user.Email}</div>
            {profile.Age && <div className="flex items-center gap-2"><FiUser className="w-4 h-4" />{profile.Age} years old</div>}
            <div className="flex items-center gap-2"><FiCalendar className="w-4 h-4" />Joined {format(new Date(user.createdAt), 'MMM yyyy')}</div>
          </div>
        </Card>

        <div className="lg:col-span-2 space-y-6">
          {loading ? (
            <div className="grid grid-cols-2 gap-4">{[...Array(4)].map((_, i) => <Skeleton key={i} type="card" />)}</div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <StatCard title="Clients" value={stats?.totalClients || clientCount} icon={<FiUsers className="w-5 h-5" />} color="violet" />
              <StatCard title="Workouts Assigned" value={stats?.assignedWorkouts || 0} icon={<FiClipboard className="w-5 h-5" />} color="sky" />
              <StatCard title="Total Workouts" value={user.Stats?.TotalWorkouts || 0} icon={<FiClipboard className="w-5 h-5" />} color="green" />
            </div>
          )}

          {(profile.Gender || profile.Height || profile.Weight || profile.FitnessLevel) && (
            <Card className="!p-0">
              <Card.Header>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Physical Info</h3>
              </Card.Header>
              <div className="p-5 grid grid-cols-2 sm:grid-cols-4 gap-4">
                {profile.Gender && <div className="text-center p-3 bg-gray-100 dark:bg-gray-900 rounded-lg"><p className="text-lg font-bold text-gray-800 dark:text-gray-100">{profile.Gender}</p><p className="text-xs text-gray-500 dark:text-gray-400">Gender</p></div>}
                {profile.Height && <div className="text-center p-3 bg-gray-100 dark:bg-gray-900 rounded-lg"><p className="text-lg font-bold text-gray-800 dark:text-gray-100">{profile.Height} cm</p><p className="text-xs text-gray-500 dark:text-gray-400">Height</p></div>}
                {profile.Weight && <div className="text-center p-3 bg-gray-100 dark:bg-gray-900 rounded-lg"><p className="text-lg font-bold text-gray-800 dark:text-gray-100">{profile.Weight} kg</p><p className="text-xs text-gray-500 dark:text-gray-400">Weight</p></div>}
                {profile.FitnessLevel && <div className="text-center p-3 bg-gray-100 dark:bg-gray-900 rounded-lg"><p className="text-lg font-bold text-gray-800 dark:text-gray-100">{profile.FitnessLevel}</p><p className="text-xs text-gray-500 dark:text-gray-400">Level</p></div>}
              </div>
            </Card>
          )}

          {profile.Goals && (
            <Card>
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Specialization & Goals</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">{profile.Goals}</p>
            </Card>
          )}
        </div>
      </div>
    </TrainerLayout>
  );
}

export default TrainerProfile;

