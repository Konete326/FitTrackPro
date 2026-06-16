import React, { useState, useEffect, useCallback } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import PageHeader from '../../components/common/PageHeader';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import StatCard from '../../components/common/StatCard';
import Skeleton from '../../components/common/Skeleton';
import { getWaterIntake, logWater, deleteWater, getDailySummary, getHydrationStats, getHydrationStreak } from '../../services/waterService';
import { FiDroplet, FiPlus, FiTrash2, FiAward } from 'react-icons/fi';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

function WaterLog() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [todayTotal, setTodayTotal] = useState(0);
  const [stats, setStats] = useState(null);
  const [streak, setStreak] = useState(0);

  const GOAL = 2000;

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [entriesRes, summaryRes, statsRes, streakRes] = await Promise.allSettled([
        getWaterIntake({ date: selectedDate }),
        getDailySummary(selectedDate),
        getHydrationStats(),
        getHydrationStreak(),
      ]);
      if (entriesRes.status === 'fulfilled') setEntries(entriesRes.value.data?.data || []);
      if (summaryRes.status === 'fulfilled') setTodayTotal(summaryRes.value.data?.data?.totalAmount || 0);
      if (statsRes.status === 'fulfilled') setStats(statsRes.value.data?.data || null);
      if (streakRes.status === 'fulfilled') setStreak(streakRes.value.data?.data?.streak || 0);
    } catch {
    } finally {
      setLoading(false);
    }
  }, [selectedDate]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleQuickAdd = async (amount) => {
    try {
      await logWater({ Amount: { Value: amount, Unit: 'ml' }, Date: selectedDate, Time: format(new Date(), 'HH:mm') });
      toast.success(`Added ${amount}ml`);
      fetchData();
    } catch { toast.error('Failed to log water'); }
  };

  const handleDelete = async (id) => {
    try {
      await deleteWater(id);
      toast.success('Entry deleted');
      fetchData();
    } catch { toast.error('Failed to delete'); }
  };

  const progress = Math.min((todayTotal / GOAL) * 100, 100);
  const circumference = 2 * Math.PI * 70;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <DashboardLayout>
      <PageHeader
        title="Water Intake"
        description="Track your daily hydration"
        actions={<input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="form-input bg-white dark:bg-gray-900/30 border-gray-200 dark:border-gray-700/60 rounded-lg" />}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card className="flex flex-col items-center justify-center py-8">
          <div className="relative w-44 h-44">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
              <circle cx="80" cy="80" r="70" fill="none" stroke="currentColor" strokeWidth="8" className="text-gray-200 dark:text-gray-700" />
              <circle cx="80" cy="80" r="70" fill="none" stroke="currentColor" strokeWidth="8" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round" className="text-sky-500 transition-all duration-700" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-gray-800 dark:text-gray-100">{todayTotal}</span>
              <span className="text-sm text-gray-500 dark:text-gray-400">/ {GOAL} ml</span>
              <span className="text-xs text-sky-500 font-medium mt-1">{Math.round(progress)}%</span>
            </div>
          </div>
          <div className="flex gap-2 mt-6">
            {[250, 500, 1000].map((amount) => (
              <Button key={amount} variant="secondary" size="sm" onClick={() => handleQuickAdd(amount)}>
                <FiDroplet className="w-3 h-3 mr-1" />{amount}ml
              </Button>
            ))}
          </div>
        </Card>

        <div className="space-y-4 lg:col-span-2">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <StatCard title="Today" value={`${todayTotal}ml`} icon={<FiDroplet className="w-5 h-5" />} color="sky" />
            <StatCard title="Streak" value={`${streak} days`} icon={<FiAward className="w-5 h-5" />} color="green" />
            <StatCard title="Avg (30d)" value={`${Math.round(stats?.summary?.avgDaily || 0)}ml`} icon={<FiDroplet className="w-5 h-5" />} color="violet" />
          </div>

          {loading ? (
            <Skeleton type="rect" />
          ) : (
            <Card className="!p-0">
              <div className="px-5 py-3 border-b border-gray-100 dark:border-gray-700/60">
                <h3 className="font-semibold text-gray-800 dark:text-gray-100">Today's Entries</h3>
              </div>
              <div className="divide-y divide-gray-100 dark:divide-gray-700/60 max-h-48 overflow-y-auto">
                {entries.length === 0 ? (
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-8">No entries yet. Add water to get started!</p>
                ) : entries.map((entry) => (
                  <div key={entry._id} className="flex items-center justify-between px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-sky-500/10 text-sky-500 rounded-full flex items-center justify-center">
                        <FiDroplet className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800 dark:text-gray-100">
                          {entry.Amount?.Value || 0} {entry.Amount?.Unit || 'ml'}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{entry.Time}</p>
                      </div>
                    </div>
                    <button onClick={() => handleDelete(entry._id)} className="text-gray-400 hover:text-red-500 transition">
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default WaterLog;
