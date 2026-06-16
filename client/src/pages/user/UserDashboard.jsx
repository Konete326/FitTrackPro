import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { useAuth } from '../../contexts/AuthContext';
import StatCard from '../../components/common/StatCard';
import Card from '../../components/common/Card';
import Skeleton from '../../components/common/Skeleton';
import { getWorkoutAnalytics } from '../../services/workoutService';
import { getGoals } from '../../services/goalService';
import { getDailySummary as getWaterSummary } from '../../services/waterService';
import { getDailySummary as getSleepSummary } from '../../services/sleepService';
import { getNutritionStats } from '../../services/nutritionService';
import { FiActivity, FiTarget, FiDroplet, FiMoon, FiFlame, FiCalendar } from 'react-icons/fi';
import { format, subDays } from 'date-fns';

function UserDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [workouts, goals, water, sleep, nutrition] = await Promise.allSettled([
          getWorkoutAnalytics(),
          getGoals({ status: 'Active' }),
          getWaterSummary(format(new Date(), 'yyyy-MM-dd')),
          getSleepSummary(format(new Date(), 'yyyy-MM-dd')),
          getNutritionStats(),
        ]);

        setStats({
          workouts: workouts.status === 'fulfilled' ? workouts.value.data : null,
          goals: goals.status === 'fulfilled' ? goals.value.data : null,
          water: water.status === 'fulfilled' ? water.value.data : null,
          sleep: sleep.status === 'fulfilled' ? sleep.value.data : null,
          nutrition: nutrition.status === 'fulfilled' ? nutrition.value.data : null,
        });
      } catch {
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const workoutCount = stats?.workouts?.totalWorkouts || 0;
  const totalDuration = stats?.workouts?.totalDuration || 0;
  const totalCalories = stats?.workouts?.totalCalories || 0;
  const activeGoals = stats?.goals?.stats?.byStatus?.Active?.count || 0;
  const waterToday = stats?.water?.todayTotal?.totalAmount || 0;
  const sleepDuration = stats?.sleep?.duration || 0;

  return (
    <DashboardLayout pageTitle={`Welcome back, ${user?.Profile?.Name || user?.Username}!`}>
      {loading ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => <Skeleton key={i} type="card" />)}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Skeleton type="rect" />
            <Skeleton type="rect" />
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <StatCard
              title="Total Workouts"
              value={workoutCount}
              icon={<FiActivity className="w-5 h-5" />}
              color="violet"
              trendValue={stats?.workouts?.dailyData?.length > 1 ? `${stats.workouts.dailyData.length} this week` : undefined}
            />
            <StatCard
              title="Calories Burned"
              value={totalCalories > 999 ? `${(totalCalories / 1000).toFixed(1)}K` : totalCalories}
              icon={<FiFlame className="w-5 h-5" />}
              color="red"
            />
            <StatCard
              title="Duration (min)"
              value={totalDuration}
              icon={<FiCalendar className="w-5 h-5" />}
              color="sky"
            />
            <StatCard
              title="Active Goals"
              value={activeGoals}
              icon={<FiTarget className="w-5 h-5" />}
              color="green"
            />
            <StatCard
              title="Water Today (ml)"
              value={waterToday}
              icon={<FiDroplet className="w-5 h-5" />}
              color="sky"
              trend={waterToday >= 2000 ? 'up' : waterToday > 0 ? 'down' : undefined}
              trendValue={waterToday >= 2000 ? 'Goal met!' : `${2000 - waterToday}ml to go`}
            />
            <StatCard
              title="Sleep Last Night"
              value={sleepDuration > 0 ? `${(sleepDuration / 60).toFixed(1)}h` : 'No data'}
              icon={<FiMoon className="w-5 h-5" />}
              color="violet"
              trend={sleepDuration >= 420 ? 'up' : sleepDuration > 0 ? 'down' : undefined}
              trendValue={sleepDuration >= 420 ? 'Great!' : sleepDuration > 0 ? 'Need more' : undefined}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="!p-0">
              <Card.Header>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Recent Workout Activity</h3>
              </Card.Header>
              <div className="p-5">
                {stats?.workouts?.dailyData?.length > 0 ? (
                  <div className="space-y-3">
                    {stats.workouts.dailyData.slice(-7).map((day, i) => (
                      <div key={i} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700/60 last:border-0">
                        <span className="text-sm text-gray-600 dark:text-gray-400">{day.date}</span>
                        <div className="flex items-center gap-4">
                          <span className="text-sm font-medium text-gray-800 dark:text-gray-100">{day.count} workouts</span>
                          <span className="text-xs text-gray-400">{day.totalDuration || 0} min</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-8">No workout data yet. Start logging workouts!</p>
                )}
              </div>
            </Card>

            <Card className="!p-0">
              <Card.Header>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Nutrition Summary (7-day)</h3>
              </Card.Header>
              <div className="p-5">
                {stats?.nutrition?.summary ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 dark:bg-gray-900/30 rounded-lg p-3 text-center">
                        <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{Math.round(stats.nutrition.summary.avgDailyCalories || 0)}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Avg Calories</p>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-900/30 rounded-lg p-3 text-center">
                        <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{Math.round(stats.nutrition.summary.avgDailyProtein || 0)}g</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Avg Protein</p>
                      </div>
                    </div>
                    {stats.nutrition.frequentFoods?.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Top Foods</p>
                        <div className="flex flex-wrap gap-2">
                          {stats.nutrition.frequentFoods.slice(0, 5).map((food, i) => (
                            <span key={i} className="px-2 py-1 bg-violet-500/10 text-violet-600 dark:text-violet-400 text-xs rounded-full">{food.name}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-8">No nutrition data yet. Start logging meals!</p>
                )}
              </div>
            </Card>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

export default UserDashboard;
