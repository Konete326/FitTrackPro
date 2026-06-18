import React, { useState, useEffect, useCallback } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import PageHeader from '../../components/common/PageHeader';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Badge from '../../components/common/Badge';
import StatCard from '../../components/common/StatCard';
import Skeleton from '../../components/common/Skeleton';
import Modal from '../../components/common/Modal';
import EmptyState from '../../components/common/EmptyState';
import ConfirmModal from '../../components/common/ConfirmModal';
import { logSleep, getSleepLogs, updateSleep, deleteSleep, getSleepTrends, getSleepRecommendations } from '../../services/sleepService';
import { FiMoon, FiPlus, FiTrash2, FiEdit2, FiStar, FiClock, FiTrendingUp, FiInfo } from 'react-icons/fi';
import { format, subDays } from 'date-fns';
import toast from 'react-hot-toast';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

function SleepLog() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [trends, setTrends] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [formData, setFormData] = useState({
    Date: format(new Date(), 'yyyy-MM-dd'),
    SleepTime: '22:00',
    WakeTime: '06:00',
    Quality: 7,
    DeepSleep: 0,
    LightSleep: 0,
    RemSleep: 0,
    AwakeCount: 0,
    Notes: '',
  });

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [logsRes, trendsRes, recsRes] = await Promise.allSettled([
        getSleepLogs({ limit: 30 }),
        getSleepTrends(),
        getSleepRecommendations(),
      ]);
      if (logsRes.status === 'fulfilled') setEntries(logsRes.value.data?.data || []);
      if (trendsRes.status === 'fulfilled') setTrends(trendsRes.value.data?.data || null);
      if (recsRes.status === 'fulfilled') setRecommendations(recsRes.value.data?.data || []);
    } catch {
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const resetForm = () => {
    setFormData({
      Date: format(new Date(), 'yyyy-MM-dd'),
      SleepTime: '22:00',
      WakeTime: '06:00',
      Quality: 7,
      DeepSleep: 0,
      LightSleep: 0,
      RemSleep: 0,
      AwakeCount: 0,
      Notes: '',
    });
    setEditingEntry(null);
  };

  const openCreate = () => {
    resetForm();
    setShowModal(true);
  };

  const openEdit = (entry) => {
    setEditingEntry(entry);
    setFormData({
      Date: entry.Date ? format(new Date(entry.Date), 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
      SleepTime: entry.SleepTime || '22:00',
      WakeTime: entry.WakeTime || '06:00',
      Quality: entry.Quality || 7,
      DeepSleep: entry.DeepSleep || 0,
      LightSleep: entry.LightSleep || 0,
      RemSleep: entry.RemSleep || 0,
      AwakeCount: entry.AwakeCount || 0,
      Notes: entry.Notes || '',
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingEntry) {
        await updateSleep(editingEntry._id, formData);
        toast.success('Sleep entry updated');
      } else {
        await logSleep(formData);
        toast.success('Sleep logged');
      }
      setShowModal(false);
      resetForm();
      fetchData();
    } catch {
      toast.error(editingEntry ? 'Failed to update' : 'Failed to log sleep');
    }
  };

  const handleDelete = async () => {
    try {
      await deleteSleep(deleteId);
      toast.success('Entry deleted');
      setDeleteId(null);
      fetchData();
    } catch {
      toast.error('Failed to delete');
    }
  };

  const formatDuration = (minutes) => {
    if (!minutes) return '0h 0m';
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h}h ${m}m`;
  };

  const getQualityColor = (q) => {
    if (q >= 8) return 'green';
    if (q >= 5) return 'yellow';
    return 'red';
  };

  const getQualityLabel = (q) => {
    if (q >= 8) return 'Excellent';
    if (q >= 6) return 'Good';
    if (q >= 4) return 'Fair';
    return 'Poor';
  };

  const avgDuration = entries.length > 0
    ? Math.round(entries.reduce((sum, e) => sum + (e.Duration || 0), 0) / entries.length)
    : 0;
  const avgQuality = entries.length > 0
    ? (entries.reduce((sum, e) => sum + (e.Quality || 0), 0) / entries.length).toFixed(1)
    : 0;
  const lastNight = entries.length > 0 ? entries[0] : null;

  const chartData = {
    labels: (trends?.dailyData || []).slice(-7).map(d => format(new Date(d.date), 'MMM dd')),
    datasets: [
      {
        label: 'Duration (hours)',
        data: (trends?.dailyData || []).slice(-7).map(d => ((d.avgDuration || 0) / 60).toFixed(1)),
        borderColor: '#8470ff',
        backgroundColor: 'rgba(132, 112, 255, 0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Quality',
        data: (trends?.dailyData || []).slice(-7).map(d => d.avgQuality || 0),
        borderColor: '#67bfff',
        backgroundColor: 'rgba(103, 191, 255, 0.1)',
        fill: true,
        tension: 0.4,
        yAxisID: 'y1',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: 'top' } },
    scales: {
      y: { beginAtZero: true, title: { display: true, text: 'Hours' } },
      y1: { beginAtZero: true, max: 10, position: 'right', title: { display: true, text: 'Quality' }, grid: { drawOnChartArea: false } },
    },
  };

  return (
    <DashboardLayout>
      <PageHeader
        title="Sleep Log"
        description="Track your sleep patterns and quality"
        actions={<Button variant="primary" icon={<FiPlus className="w-4 h-4" />} onClick={openCreate}>Log Sleep</Button>}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Last Night"
          value={lastNight ? formatDuration(lastNight.Duration) : 'No data'}
          icon={<FiMoon className="w-5 h-5" />}
          color="violet"
        />
        <StatCard
          title="Avg Duration"
          value={formatDuration(avgDuration)}
          icon={<FiClock className="w-5 h-5" />}
          color="sky"
        />
        <StatCard
          title="Avg Quality"
          value={`${avgQuality}/10`}
          icon={<FiStar className="w-5 h-5" />}
          color="green"
        />
        <StatCard
          title="Total Entries"
          value={entries.length}
          icon={<FiTrendingUp className="w-5 h-5" />}
          color="yellow"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card className="lg:col-span-2 !p-0">
          <Card.Header>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Sleep Trends (7 days)</h3>
          </Card.Header>
          <div className="p-5 h-64">
            {trends?.dailyData?.length > 0 ? (
              <Line data={chartData} options={chartOptions} />
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-sm text-gray-500 dark:text-gray-400">No trend data yet. Start logging sleep!</p>
              </div>
            )}
          </div>
        </Card>

        {recommendations.length > 0 && (
          <Card className="!p-0">
            <Card.Header>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                <FiInfo className="w-4 h-4 text-violet-500" /> Recommendations
              </h3>
            </Card.Header>
            <div className="p-5 space-y-3">
              {recommendations.map((rec, i) => (
                <div key={i} className="p-3 bg-violet-500/5 dark:bg-violet-500/10 rounded-lg">
                  <p className="text-sm text-gray-700 dark:text-gray-300">{typeof rec === 'string' ? rec : rec.message || rec.text || JSON.stringify(rec)}</p>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>

      <Card className="!p-0">
        <Card.Header>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Recent Entries</h3>
        </Card.Header>
        {loading ? (
          <div className="p-5"><Skeleton type="table" /></div>
        ) : entries.length === 0 ? (
          <div className="p-5">
            <EmptyState
              icon={<FiMoon className="w-12 h-12" />}
              title="No sleep entries"
              description="Start logging your sleep to see trends and recommendations."
              action={<Button variant="primary" onClick={openCreate}>Log Sleep</Button>}
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-700/60">
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Date</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Sleep</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Wake</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Duration</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Quality</th>
                  <th className="px-5 py-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700/60">
                {entries.map((entry) => (
                  <tr key={entry._id} className="hover:bg-gray-50 dark:hover:bg-gray-900 transition">
                    <td className="px-5 py-3 text-sm text-gray-800 dark:text-gray-200">{format(new Date(entry.Date), 'MMM dd, yyyy')}</td>
                    <td className="px-5 py-3 text-sm text-gray-600 dark:text-gray-400">{entry.SleepTime}</td>
                    <td className="px-5 py-3 text-sm text-gray-600 dark:text-gray-400">{entry.WakeTime}</td>
                    <td className="px-5 py-3 text-sm font-medium text-gray-800 dark:text-gray-200">{formatDuration(entry.Duration)}</td>
                    <td className="px-5 py-3">
                      <Badge variant={getQualityColor(entry.Quality)}>{entry.Quality}/10 - {getQualityLabel(entry.Quality)}</Badge>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openEdit(entry)} className="text-gray-400 hover:text-violet-500 transition"><FiEdit2 className="w-4 h-4" /></button>
                        <button onClick={() => setDeleteId(entry._id)} className="text-gray-400 hover:text-red-500 transition"><FiTrash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Modal isOpen={showModal} onClose={() => { setShowModal(false); resetForm(); }} title={editingEntry ? 'Edit Sleep Entry' : 'Log Sleep'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Date" type="date" value={formData.Date} onChange={(e) => setFormData({ ...formData, Date: e.target.value })} required />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Sleep Time" type="time" value={formData.SleepTime} onChange={(e) => setFormData({ ...formData, SleepTime: e.target.value })} required />
            <Input label="Wake Time" type="time" value={formData.WakeTime} onChange={(e) => setFormData({ ...formData, WakeTime: e.target.value })} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Quality: {formData.Quality}/10 - {getQualityLabel(formData.Quality)}
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={formData.Quality}
              onChange={(e) => setFormData({ ...formData, Quality: parseInt(e.target.value) })}
              className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-violet-500"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>Poor</span>
              <span>Excellent</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Notes</label>
            <textarea
              value={formData.Notes}
              onChange={(e) => setFormData({ ...formData, Notes: e.target.value })}
              rows={2}
              className="form-textarea w-full bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700/60 rounded-lg focus:ring-violet-500 focus:border-violet-500"
              placeholder="How did you feel?"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="submit" variant="primary" className="flex-1">{editingEntry ? 'Update' : 'Log Sleep'}</Button>
            <Button type="button" variant="secondary" onClick={() => { setShowModal(false); resetForm(); }}>Cancel</Button>
          </div>
        </form>
      </Modal>

      <ConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Entry"
        message="Are you sure you want to delete this sleep entry?"
      />
    </DashboardLayout>
  );
}

export default SleepLog;
