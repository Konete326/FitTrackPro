import React, { useState, useEffect, useCallback } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import PageHeader from '../../components/common/PageHeader';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Badge from '../../components/common/Badge';
import StatCard from '../../components/common/StatCard';
import Skeleton from '../../components/common/Skeleton';
import Modal from '../../components/common/Modal';
import EmptyState from '../../components/common/EmptyState';
import ConfirmModal from '../../components/common/ConfirmModal';
import { createProgress, getProgress, deleteProgress, getProgressTrends, getMeasurementsSummary, getMilestones } from '../../services/progressService';
import { FiTrendingUp, FiPlus, FiTrash2, FiCamera, FiAward, FiActivity, FiTarget } from 'react-icons/fi';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

function ProgressTracking() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [trends, setTrends] = useState(null);
  const [measurements, setMeasurements] = useState(null);
  const [milestones, setMilestones] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedMetric, setSelectedMetric] = useState('Weight');
  const [formData, setFormData] = useState({
    Date: format(new Date(), 'yyyy-MM-dd'),
    Weight: '',
    BodyFatPercentage: '',
    MuscleMass: '',
    EnergyLevel: 7,
    SleepQuality: 7,
    StressLevel: 5,
    Notes: '',
    IsMilestone: false,
    'BodyMeasurements.Chest': '',
    'BodyMeasurements.Waist': '',
    'BodyMeasurements.Hips': '',
    'BodyMeasurements.Arms': '',
    'BodyMeasurements.Thighs': '',
    'BodyMeasurements.Neck': '',
    'BodyMeasurements.Unit': 'cm',
  });

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [entriesRes, trendsRes, measureRes, milestonesRes] = await Promise.allSettled([
        getProgress({ limit: 30 }),
        getProgressTrends(selectedMetric),
        getMeasurementsSummary(),
        getMilestones(),
      ]);
      if (entriesRes.status === 'fulfilled') setEntries(entriesRes.value.data?.data || []);
      if (trendsRes.status === 'fulfilled') setTrends(trendsRes.value.data?.data || null);
      if (measureRes.status === 'fulfilled') setMeasurements(measureRes.value.data?.data || null);
      if (milestonesRes.status === 'fulfilled') setMilestones(milestonesRes.value.data?.data || []);
    } catch {
    } finally {
      setLoading(false);
    }
  }, [selectedMetric]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      Date: formData.Date,
      Weight: formData.Weight ? parseFloat(formData.Weight) : undefined,
      BodyFatPercentage: formData.BodyFatPercentage ? parseFloat(formData.BodyFatPercentage) : undefined,
      MuscleMass: formData.MuscleMass ? parseFloat(formData.MuscleMass) : undefined,
      EnergyLevel: formData.EnergyLevel,
      SleepQuality: formData.SleepQuality,
      StressLevel: formData.StressLevel,
      Notes: formData.Notes || undefined,
      IsMilestone: formData.IsMilestone,
      BodyMeasurements: {
        Chest: formData['BodyMeasurements.Chest'] ? parseFloat(formData['BodyMeasurements.Chest']) : undefined,
        Waist: formData['BodyMeasurements.Waist'] ? parseFloat(formData['BodyMeasurements.Waist']) : undefined,
        Hips: formData['BodyMeasurements.Hips'] ? parseFloat(formData['BodyMeasurements.Hips']) : undefined,
        Arms: formData['BodyMeasurements.Arms'] ? parseFloat(formData['BodyMeasurements.Arms']) : undefined,
        Thighs: formData['BodyMeasurements.Thighs'] ? parseFloat(formData['BodyMeasurements.Thighs']) : undefined,
        Neck: formData['BodyMeasurements.Neck'] ? parseFloat(formData['BodyMeasurements.Neck']) : undefined,
        Unit: formData['BodyMeasurements.Unit'],
      },
    };
    try {
      await createProgress(payload);
      toast.success(formData.IsMilestone ? 'Milestone recorded!' : 'Progress logged');
      setShowModal(false);
      fetchData();
    } catch {
      toast.error('Failed to log progress');
    }
  };

  const handleDelete = async () => {
    try {
      await deleteProgress(deleteId);
      toast.success('Entry deleted');
      setDeleteId(null);
      fetchData();
    } catch {
      toast.error('Failed to delete');
    }
  };

  const latestEntry = entries.length > 0 ? entries[0] : null;
  const previousEntry = entries.length > 1 ? entries[1] : null;
  const weightChange = latestEntry && previousEntry ? (latestEntry.Weight - previousEntry.Weight).toFixed(1) : null;

  const metricOptions = ['Weight', 'BodyFatPercentage', 'MuscleMass', 'EnergyLevel', 'SleepQuality', 'StressLevel'];

  const chartData = {
    labels: (trends?.dailyData || []).slice(-14).map(d => format(new Date(d.date), 'MMM dd')),
    datasets: [{
      label: selectedMetric,
      data: (trends?.dailyData || []).slice(-14).map(d => d.value || d.avgValue || 0),
      borderColor: '#8470ff',
      backgroundColor: 'rgba(132, 112, 255, 0.1)',
      fill: true,
      tension: 0.4,
    }],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: 'top' } },
    scales: { y: { beginAtZero: false } },
  };

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'measurements', label: 'Measurements' },
    { id: 'milestones', label: 'Milestones' },
  ];

  return (
    <DashboardLayout>
      <PageHeader
        title="Progress Tracking"
        description="Track body measurements, performance, and milestones"
        actions={<Button variant="primary" icon={<FiPlus className="w-4 h-4" />} onClick={() => setShowModal(true)}>Log Progress</Button>}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Current Weight"
          value={latestEntry?.Weight ? `${latestEntry.Weight} kg` : 'No data'}
          icon={<FiActivity className="w-5 h-5" />}
          color="violet"
          trend={weightChange !== null ? (weightChange > 0 ? 'up' : weightChange < 0 ? 'down' : undefined) : undefined}
          trendValue={weightChange !== null ? `${weightChange > 0 ? '+' : ''}${weightChange} kg` : undefined}
        />
        <StatCard
          title="Body Fat"
          value={latestEntry?.BodyFatPercentage ? `${latestEntry.BodyFatPercentage}%` : 'No data'}
          icon={<FiTarget className="w-5 h-5" />}
          color="sky"
        />
        <StatCard
          title="Energy Level"
          value={latestEntry?.EnergyLevel ? `${latestEntry.EnergyLevel}/10` : 'No data'}
          icon={<FiTrendingUp className="w-5 h-5" />}
          color="green"
        />
        <StatCard
          title="Milestones"
          value={milestones.length}
          icon={<FiAward className="w-5 h-5" />}
          color="yellow"
        />
      </div>

      <div className="flex gap-1 mb-6 border-b border-gray-200 dark:border-gray-700">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-sm font-medium transition border-b-2 -mb-px ${
              activeTab === tab.id
                ? 'border-violet-500 text-violet-600 dark:text-violet-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-6">
          <Card className="!p-0">
            <Card.Header>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Trend Chart</h3>
                <Select
                  value={selectedMetric}
                  onChange={(e) => setSelectedMetric(e.target.value)}
                  options={metricOptions.map(m => ({ value: m, label: m.replace(/([A-Z])/g, ' $1').trim() }))}
                  className="w-40"
                />
              </div>
            </Card.Header>
            <div className="p-5 h-72">
              {trends?.dailyData?.length > 0 ? (
                <Line data={chartData} options={chartOptions} />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-sm text-gray-500 dark:text-gray-400">No trend data yet. Start logging progress!</p>
                </div>
              )}
            </div>
          </Card>

          <Card className="!p-0">
            <Card.Header>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Recent Entries</h3>
            </Card.Header>
            {loading ? (
              <div className="p-5"><Skeleton type="table" /></div>
            ) : entries.length === 0 ? (
              <div className="p-5">
                <EmptyState
                  icon={<FiTrendingUp className="w-12 h-12" />}
                  title="No progress entries"
                  description="Log your body measurements and metrics to track your fitness journey."
                  action={<Button variant="primary" onClick={() => setShowModal(true)}>Log Progress</Button>}
                />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100 dark:border-gray-700/60">
                      <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Date</th>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Weight</th>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Body Fat</th>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Energy</th>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Sleep</th>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Stress</th>
                      <th className="px-5 py-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-700/60">
                    {entries.map((entry) => (
                      <tr key={entry._id} className="hover:bg-gray-50 dark:hover:bg-gray-900 transition">
                        <td className="px-5 py-3 text-sm text-gray-800 dark:text-gray-200">
                          <div className="flex items-center gap-2">
                            {format(new Date(entry.Date), 'MMM dd, yyyy')}
                            {entry.IsMilestone && <FiAward className="w-3 h-3 text-yellow-500" />}
                          </div>
                        </td>
                        <td className="px-5 py-3 text-sm text-gray-600 dark:text-gray-400">{entry.Weight ? `${entry.Weight} kg` : '-'}</td>
                        <td className="px-5 py-3 text-sm text-gray-600 dark:text-gray-400">{entry.BodyFatPercentage ? `${entry.BodyFatPercentage}%` : '-'}</td>
                        <td className="px-5 py-3 text-sm text-gray-600 dark:text-gray-400">{entry.EnergyLevel || '-'}/10</td>
                        <td className="px-5 py-3 text-sm text-gray-600 dark:text-gray-400">{entry.SleepQuality || '-'}/10</td>
                        <td className="px-5 py-3 text-sm text-gray-600 dark:text-gray-400">{entry.StressLevel || '-'}/10</td>
                        <td className="px-5 py-3 text-right">
                          <button onClick={() => setDeleteId(entry._id)} className="text-gray-400 hover:text-red-500 transition"><FiTrash2 className="w-4 h-4" /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </div>
      )}

      {activeTab === 'measurements' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {['Chest', 'Waist', 'Hips', 'Arms', 'Thighs', 'Neck'].map((part) => {
            const latestVal = latestEntry?.BodyMeasurements?.[part];
            const unit = latestEntry?.BodyMeasurements?.Unit || 'cm';
            return (
              <Card key={part}>
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase mb-2">{part}</p>
                  <p className="text-3xl font-bold text-gray-800 dark:text-gray-100">{latestVal || '-'}</p>
                  <p className="text-sm text-gray-400 mt-1">{latestVal ? unit : 'No data'}</p>
                </div>
              </Card>
            );
          })}
          {latestEntry?.Notes && (
            <Card className="md:col-span-2 lg:col-span-3">
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Latest Notes</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">{latestEntry.Notes}</p>
            </Card>
          )}
        </div>
      )}

      {activeTab === 'milestones' && (
        <div className="space-y-4">
          {milestones.length === 0 ? (
            <Card>
              <EmptyState
                icon={<FiAward className="w-12 h-12" />}
                title="No milestones yet"
                description="Mark a progress entry as a milestone to celebrate your achievements!"
              />
            </Card>
          ) : (
            milestones.map((entry) => (
              <Card key={entry._id}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-yellow-500/10 text-yellow-500 rounded-full flex items-center justify-center">
                      <FiAward className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 dark:text-gray-100">{format(new Date(entry.Date), 'MMMM dd, yyyy')}</p>
                      {entry.Weight && <p className="text-sm text-gray-500 dark:text-gray-400">Weight: {entry.Weight} kg</p>}
                      {entry.Notes && <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{entry.Notes}</p>}
                    </div>
                  </div>
                  <Badge variant="yellow">Milestone</Badge>
                </div>
              </Card>
            ))
          )}
        </div>
      )}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Log Progress">
        <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
          <Input label="Date" type="date" value={formData.Date} onChange={(e) => setFormData({ ...formData, Date: e.target.value })} required />

          <div className="grid grid-cols-3 gap-3">
            <Input label="Weight (kg)" type="number" step="0.1" min="0" value={formData.Weight} onChange={(e) => setFormData({ ...formData, Weight: e.target.value })} />
            <Input label="Body Fat (%)" type="number" step="0.1" min="0" max="100" value={formData.BodyFatPercentage} onChange={(e) => setFormData({ ...formData, BodyFatPercentage: e.target.value })} />
            <Input label="Muscle (kg)" type="number" step="0.1" min="0" value={formData.MuscleMass} onChange={(e) => setFormData({ ...formData, MuscleMass: e.target.value })} />
          </div>

          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 pt-2">Body Measurements</h4>
          <div className="grid grid-cols-3 gap-3">
            <Input label="Chest" type="number" step="0.1" min="0" value={formData['BodyMeasurements.Chest']} onChange={(e) => setFormData({ ...formData, 'BodyMeasurements.Chest': e.target.value })} />
            <Input label="Waist" type="number" step="0.1" min="0" value={formData['BodyMeasurements.Waist']} onChange={(e) => setFormData({ ...formData, 'BodyMeasurements.Waist': e.target.value })} />
            <Input label="Hips" type="number" step="0.1" min="0" value={formData['BodyMeasurements.Hips']} onChange={(e) => setFormData({ ...formData, 'BodyMeasurements.Hips': e.target.value })} />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <Input label="Arms" type="number" step="0.1" min="0" value={formData['BodyMeasurements.Arms']} onChange={(e) => setFormData({ ...formData, 'BodyMeasurements.Arms': e.target.value })} />
            <Input label="Thighs" type="number" step="0.1" min="0" value={formData['BodyMeasurements.Thighs']} onChange={(e) => setFormData({ ...formData, 'BodyMeasurements.Thighs': e.target.value })} />
            <Input label="Neck" type="number" step="0.1" min="0" value={formData['BodyMeasurements.Neck']} onChange={(e) => setFormData({ ...formData, 'BodyMeasurements.Neck': e.target.value })} />
          </div>

          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 pt-2">Wellness</h4>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Energy: {formData.EnergyLevel}/10</label>
            <input type="range" min="1" max="10" value={formData.EnergyLevel} onChange={(e) => setFormData({ ...formData, EnergyLevel: parseInt(e.target.value) })} className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-green-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Sleep Quality: {formData.SleepQuality}/10</label>
            <input type="range" min="1" max="10" value={formData.SleepQuality} onChange={(e) => setFormData({ ...formData, SleepQuality: parseInt(e.target.value) })} className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-violet-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Stress Level: {formData.StressLevel}/10</label>
            <input type="range" min="1" max="10" value={formData.StressLevel} onChange={(e) => setFormData({ ...formData, StressLevel: parseInt(e.target.value) })} className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-red-500" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Notes</label>
            <textarea value={formData.Notes} onChange={(e) => setFormData({ ...formData, Notes: e.target.value })} rows={2} className="form-textarea w-full bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700/60 rounded-lg focus:ring-violet-500 focus:border-violet-500" placeholder="How are you feeling?" />
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={formData.IsMilestone} onChange={(e) => setFormData({ ...formData, IsMilestone: e.target.checked })} className="rounded border-gray-300 dark:border-gray-600 text-violet-500 focus:ring-violet-500" />
            <span className="text-sm text-gray-700 dark:text-gray-300">Mark as milestone</span>
          </label>

          <div className="flex gap-3 pt-2">
            <Button type="submit" variant="primary" className="flex-1">Log Progress</Button>
            <Button type="button" variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
          </div>
        </form>
      </Modal>

      <ConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Entry"
        message="Are you sure you want to delete this progress entry?"
      />
    </DashboardLayout>
  );
}

export default ProgressTracking;
