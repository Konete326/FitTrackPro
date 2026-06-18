import React, { useState, useEffect, useCallback } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import PageHeader from '../../components/common/PageHeader';
import Card from '../../components/common/Card';
import Select from '../../components/common/Select';
import Badge from '../../components/common/Badge';
import StatCard from '../../components/common/StatCard';
import Skeleton from '../../components/common/Skeleton';
import EmptyState from '../../components/common/EmptyState';
import { getAchievements, getAchievementStats, getLeaderboard } from '../../services/achievementService';
import { FiAward, FiStar, FiTrendingUp, FiUsers, FiSearch } from 'react-icons/fi';
import { format } from 'date-fns';

function Achievements() {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPoints, setTotalPoints] = useState(0);
  const [leaderboard, setLeaderboard] = useState([]);
  const [typeFilter, setTypeFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('achievements');

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (typeFilter) params.type = typeFilter;
      const [achRes, statsRes, lbRes] = await Promise.allSettled([
        getAchievements(params),
        getAchievementStats(),
        getLeaderboard(),
      ]);
      if (achRes.status === 'fulfilled') {
        setAchievements(achRes.value.data?.data || []);
        setTotalPoints(achRes.value.data?.totalPoints || 0);
      }
      if (lbRes.status === 'fulfilled') setLeaderboard(lbRes.value.data?.data || []);
    } catch {
    } finally {
      setLoading(false);
    }
  }, [typeFilter]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const getTypeColor = (type) => {
    const colors = { Workout: 'violet', Nutrition: 'green', Progress: 'sky', Consistency: 'yellow', Community: 'red', Challenge: 'violet', Milestone: 'yellow' };
    return colors[type] || 'gray';
  };

  const getTypeEmoji = (type) => {
    const emojis = { Workout: '🏋️', Nutrition: '🥗', Progress: '📈', Consistency: '🔥', Community: '👥', Challenge: '⚡', Milestone: '🏆' };
    return emojis[type] || '🎯';
  };

  const typeOptions = [
    { value: 'Workout', label: 'Workout' }, { value: 'Nutrition', label: 'Nutrition' },
    { value: 'Progress', label: 'Progress' }, { value: 'Consistency', label: 'Consistency' },
    { value: 'Community', label: 'Community' }, { value: 'Challenge', label: 'Challenge' },
    { value: 'Milestone', label: 'Milestone' },
  ];

  const tabs = [
    { id: 'achievements', label: 'My Achievements', icon: <FiAward className="w-4 h-4" /> },
    { id: 'leaderboard', label: 'Leaderboard', icon: <FiUsers className="w-4 h-4" /> },
  ];

  const filteredAchievements = achievements.filter((a) => {
    const matchesSearch = !searchTerm ||
      a.Title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.Description?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <DashboardLayout>
      <PageHeader title="Achievements" description="Your badges, points, and rankings" />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard title="Total Points" value={totalPoints} icon={<FiStar className="w-5 h-5" />} color="yellow" />
        <StatCard title="Achievements Earned" value={achievements.length} icon={<FiAward className="w-5 h-5" />} color="violet" />
        <StatCard title="Types Unlocked" value={new Set(achievements.map(a => a.Type)).size} icon={<FiTrendingUp className="w-5 h-5" />} color="green" />
      </div>

      <div className="flex gap-1 mb-6 border-b border-gray-200 dark:border-gray-700">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition border-b-2 -mb-px ${
              activeTab === tab.id
                ? 'border-violet-500 text-violet-600 dark:text-violet-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            {tab.icon}{tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'achievements' && (
        <>
          <div className="grid grid-cols-12 gap-3 mb-6">
            <div className="col-span-10 relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search achievements..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-input w-full pl-10 !bg-gray-50 dark:!bg-gray-800 dark:text-gray-100 border-gray-200 dark:border-gray-700/60 rounded-lg focus:ring-0 focus:border-gray-300 dark:focus:border-gray-600 transition"
              />
            </div>
            <div className="col-span-2">
              <Select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} options={[{ value: '', label: 'All Types' }, ...typeOptions]} className="w-full" />
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => <Skeleton key={i} type="card" />)}
            </div>
          ) : filteredAchievements.length === 0 ? (
            <Card>
              <EmptyState icon={<FiAward className="w-12 h-12" />} title={achievements.length === 0 ? "No achievements yet" : "No results found"} description={achievements.length === 0 ? "Keep working out, logging nutrition, and hitting goals to earn achievements!" : "Try adjusting your search or filter."} />
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredAchievements.map((ach) => (
                <Card key={ach._id} className="hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 bg-violet-500/10 dark:bg-violet-500/20 rounded-xl flex items-center justify-center text-2xl shrink-0">
                      {getTypeEmoji(ach.Type)}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-gray-800 dark:text-gray-100 truncate">{ach.Title}</h3>
                      {ach.Description && <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{ach.Description}</p>}
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant={getTypeColor(ach.Type)}>{ach.Type}</Badge>
                        <span className="text-xs font-medium text-yellow-500">+{ach.Points} pts</span>
                      </div>
                      <p className="text-xs text-gray-400 mt-2">{format(new Date(ach.EarnedAt), 'MMM dd, yyyy')}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </>
      )}

      {activeTab === 'leaderboard' && (
        <Card className="!p-0">
          <Card.Header>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Top 20 Users</h3>
          </Card.Header>
          {loading ? (
            <div className="p-5"><Skeleton type="table" /></div>
          ) : leaderboard.length === 0 ? (
            <div className="p-5">
              <EmptyState icon={<FiUsers className="w-12 h-12" />} title="No leaderboard data" description="Earn achievements to climb the leaderboard!" />
            </div>
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-gray-700/60">
              {leaderboard.map((entry, i) => (
                <div key={i} className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 dark:hover:bg-gray-900 transition">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    i === 0 ? 'bg-yellow-500 text-white' : i === 1 ? 'bg-gray-300 text-gray-700' : i === 2 ? 'bg-amber-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                  }`}>
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-800 dark:text-gray-100 truncate">{entry.user?.Profile?.Name || entry.user?.Username || 'Unknown'}</p>
                    <p className="text-xs text-gray-400">@{entry.user?.Username}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-violet-500">{entry.totalPoints}</p>
                    <p className="text-xs text-gray-400">points</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}
    </DashboardLayout>
  );
}

export default Achievements;