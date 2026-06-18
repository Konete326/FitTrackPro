import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import PageHeader from '../../components/common/PageHeader';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import StatCard from '../../components/common/StatCard';
import Skeleton from '../../components/common/Skeleton';
import { useAuth } from '../../contexts/AuthContext';
import { getAchievements } from '../../services/achievementService';
import { getGoals } from '../../services/goalService';
import { useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiCalendar, FiEdit2, FiActivity, FiZap, FiAward, FiTarget, FiCheckCircle } from 'react-icons/fi';
import { format } from 'date-fns';

function Profile() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [achievements, setAchievements] = useState([]);
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [achRes, goalsRes] = await Promise.allSettled([
          getAchievements({ limit: 6 }),
          getGoals({ status: 'Active', limit: 5 }),
        ]);
        if (achRes.status === 'fulfilled') setAchievements(achRes.value.data?.data || []);
        if (goalsRes.status === 'fulfilled') setGoals(goalsRes.value.data?.data || []);
      } catch {
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (!user) return null;

  const profile = user.Profile || {};
  const stats = user.Stats || {};

  return (
    <DashboardLayout>
      <PageHeader
        title="My Profile"
        actions={<Button variant="secondary" icon={<FiEdit2 className="w-4 h-4" />} onClick={() => navigate('/settings')}>Edit Profile</Button>}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="flex flex-col items-center text-center py-8">
          <div className="w-28 h-28 rounded-full bg-violet-500/10 flex items-center justify-center overflow-hidden mb-4 ring-4 ring-violet-500/20">
            {profile.ProfilePicture ? (
              <img src={profile.ProfilePicture} alt={profile.Name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-4xl font-bold text-violet-500">{(profile.Name || user.Username || 'U')[0].toUpperCase()}</span>
            )}
          </div>
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">{profile.Name || user.Username}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">@{user.Username}</p>
          {profile.Bio && <p className="text-sm text-gray-600 dark:text-gray-400 mt-3 max-w-xs">{profile.Bio}</p>}
          <div className="flex flex-wrap gap-2 mt-4 justify-center">
            <Badge variant="violet">{user.Role}</Badge>
            {profile.FitnessLevel && <Badge variant="sky">{profile.FitnessLevel}</Badge>}
            {user.IsVerified && <Badge variant="green"><FiCheckCircle className="w-3 h-3 text-blue-500 mr-1" />Verified</Badge>}
          </div>
          <div className="mt-6 space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-2"><FiMail className="w-4 h-4" />{user.Email}</div>
            {profile.Age && <div className="flex items-center gap-2"><FiUser className="w-4 h-4" />{profile.Age} years old</div>}
            <div className="flex items-center gap-2"><FiCalendar className="w-4 h-4" />Joined {format(new Date(user.createdAt), 'MMM yyyy')}</div>
          </div>
        </Card>

        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <StatCard title="Workouts" value={stats.TotalWorkouts || 0} icon={<FiActivity className="w-5 h-5" />} color="violet" />
            <StatCard title="Calories" value={stats.TotalCaloriesBurned > 999 ? `${(stats.TotalCaloriesBurned / 1000).toFixed(1)}K` : stats.TotalCaloriesBurned || 0} icon={<FiZap className="w-5 h-5" />} color="red" />
            <StatCard title="Current Streak" value={`${stats.CurrentStreak || 0} days`} icon={<FiAward className="w-5 h-5" />} color="green" />
            <StatCard title="Best Streak" value={`${stats.LongestStreak || 0} days`} icon={<FiAward className="w-5 h-5" />} color="yellow" />
          </div>

          {profile.Gender || profile.Height || profile.Weight || profile.Goals ? (
            <Card className="!p-0">
              <Card.Header>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Physical Info</h3>
              </Card.Header>
              <div className="p-5 grid grid-cols-2 sm:grid-cols-4 gap-4">
                {profile.Gender && (
                  <div className="text-center p-3 bg-gray-100 dark:bg-gray-900 rounded-lg">
                    <p className="text-lg font-bold text-gray-800 dark:text-gray-100">{profile.Gender}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Gender</p>
                  </div>
                )}
                {profile.Height && (
                  <div className="text-center p-3 bg-gray-100 dark:bg-gray-900 rounded-lg">
                    <p className="text-lg font-bold text-gray-800 dark:text-gray-100">{profile.Height} cm</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Height</p>
                  </div>
                )}
                {profile.Weight && (
                  <div className="text-center p-3 bg-gray-100 dark:bg-gray-900 rounded-lg">
                    <p className="text-lg font-bold text-gray-800 dark:text-gray-100">{profile.Weight} kg</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Weight</p>
                  </div>
                )}
                {profile.FitnessLevel && (
                  <div className="text-center p-3 bg-gray-100 dark:bg-gray-900 rounded-lg">
                    <p className="text-lg font-bold text-gray-800 dark:text-gray-100">{profile.FitnessLevel}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Level</p>
                  </div>
                )}
              </div>
            </Card>
          ) : null}

          {loading ? (
            <Skeleton type="rect" />
          ) : (
            <>
              {goals.length > 0 && (
                <Card className="!p-0">
                  <Card.Header>
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Active Goals</h3>
                      <Button variant="secondary" size="sm" onClick={() => navigate('/goals')}>View All</Button>
                    </div>
                  </Card.Header>
                  <div className="divide-y divide-gray-100 dark:divide-gray-700/60">
                    {goals.slice(0, 4).map((goal) => (
                      <div key={goal._id} className="flex items-center justify-between px-5 py-3">
                        <div className="flex items-center gap-3">
                          <FiTarget className="w-4 h-4 text-violet-500" />
                          <div>
                            <p className="text-sm font-medium text-gray-800 dark:text-gray-100">{goal.Title}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{goal.Type}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div className="h-full bg-violet-500 rounded-full" style={{ width: `${Math.min(goal.Progress || 0, 100)}%` }} />
                          </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">{goal.Progress || 0}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {achievements.length > 0 && (
                <Card className="!p-0">
                  <Card.Header>
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Recent Achievements</h3>
                      <Button variant="secondary" size="sm" onClick={() => navigate('/achievements')}>View All</Button>
                    </div>
                  </Card.Header>
                  <div className="p-5">
                    <div className="flex flex-wrap gap-3">
                      {achievements.map((ach) => (
                        <div key={ach._id} className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-900 rounded-lg" title={ach.Description || ach.Title}>
                          <span className="text-lg">🏆</span>
                          <div>
                            <p className="text-xs font-medium text-gray-800 dark:text-gray-100">{ach.Title}</p>
                            <p className="text-xs text-yellow-500">+{ach.Points} pts</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              )}

              {user.TrainerNotes?.length > 0 && (
                <Card className="!p-0">
                  <Card.Header>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Trainer Notes</h3>
                  </Card.Header>
                  <div className="divide-y divide-gray-100 dark:divide-gray-700/60">
                    {user.TrainerNotes.slice(0, 5).map((note, i) => (
                      <div key={i} className="px-5 py-3">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{note.TrainerName}</p>
                          <p className="text-xs text-gray-400">{format(new Date(note.CreatedAt), 'MMM dd, yyyy')}</p>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{note.Note}</p>
                      </div>
                    ))}
                  </div>
                </Card>
              )}
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Profile;

