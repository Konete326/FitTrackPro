import React, { useState, useEffect, useCallback, useMemo } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import PageHeader from '../../components/common/PageHeader';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import EmptyState from '../../components/common/EmptyState';
import ConfirmModal from '../../components/common/ConfirmModal';
import Skeleton from '../../components/common/Skeleton';
import { useValidation, validators } from '../../hooks/useValidation';
import { createGoal, getGoals, updateGoal, deleteGoal, updateGoalProgress, completeGoal, activateGoal, pauseGoal, getGoalStats } from '../../services/goalService';
import { FiTarget, FiPlus, FiTrash2, FiEdit2, FiPlay, FiPause, FiCheck, FiChevronDown, FiChevronRight } from 'react-icons/fi';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

function Goals() {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  const [progressInputs, setProgressInputs] = useState({});
  const [stats, setStats] = useState(null);
  const [formData, setFormData] = useState({
    Title: '', Description: '', Type: 'Custom', TargetValue: '', CurrentValue: 0, Unit: '',
    Frequency: 'Daily', StartDate: format(new Date(), 'yyyy-MM-dd'), EndDate: '',
  });

  const goalRules = useMemo(() => ({
    Title: [(v) => validators.required(v, 'Goal title')],
  }), []);
  const { errors: goalErrors, handleChange: goalHandleChange, handleBlur: goalHandleBlur, validateAll: goalValidateAll } = useValidation(goalRules);

  const updateGoalField = (name, value) => { setFormData({ ...formData, [name]: value }); goalHandleChange(name, value); };

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (statusFilter) params.status = statusFilter;
      if (typeFilter) params.type = typeFilter;
      const [goalsRes, statsRes] = await Promise.allSettled([getGoals(params), getGoalStats()]);
      if (goalsRes.status === 'fulfilled') setGoals(goalsRes.value.data?.data || []);
      if (statsRes.status === 'fulfilled') setStats(statsRes.value.data?.data || null);
    } catch {
    } finally {
      setLoading(false);
    }
  }, [statusFilter, typeFilter]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const resetForm = () => {
    setFormData({
      Title: '', Description: '', Type: 'Custom', TargetValue: '', CurrentValue: 0, Unit: '',
      Frequency: 'Daily', StartDate: format(new Date(), 'yyyy-MM-dd'), EndDate: '',
    });
    setEditingGoal(null);
  };

  const openCreate = () => { resetForm(); setShowModal(true); };

  const openEdit = (goal) => {
    setEditingGoal(goal);
    setFormData({
      Title: goal.Title || '', Description: goal.Description || '', Type: goal.Type || 'Custom',
      TargetValue: goal.TargetValue || '', CurrentValue: goal.CurrentValue || 0, Unit: goal.Unit || '',
      Frequency: goal.Frequency || 'Daily', StartDate: goal.StartDate ? format(new Date(goal.StartDate), 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
      EndDate: goal.EndDate ? format(new Date(goal.EndDate), 'yyyy-MM-dd') : '',
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!goalValidateAll(formData)) return;
    const payload = {
      ...formData,
      TargetValue: formData.TargetValue ? parseFloat(formData.TargetValue) : undefined,
      CurrentValue: formData.CurrentValue ? parseFloat(formData.CurrentValue) : 0,
      EndDate: formData.EndDate || undefined,
    };
    try {
      if (editingGoal) {
        await updateGoal(editingGoal._id, payload);
        toast.success('Goal updated');
      } else {
        await createGoal(payload);
        toast.success('Goal created');
      }
      setShowModal(false);
      resetForm();
      fetchData();
    } catch {
      toast.error('Failed to save goal');
    }
  };

  const handleDelete = async () => {
    try {
      await deleteGoal(deleteId);
      toast.success('Goal deleted');
      setDeleteId(null);
      fetchData();
    } catch {
      toast.error('Failed to delete');
    }
  };

  const handleProgressUpdate = async (goalId) => {
    const val = progressInputs[goalId];
    if (val === undefined || val === '') return;
    try {
      await updateGoalProgress(goalId, parseFloat(val));
      toast.success('Progress updated');
      setProgressInputs({ ...progressInputs, [goalId]: '' });
      fetchData();
    } catch {
      toast.error('Failed to update progress');
    }
  };

  const handleStatusChange = async (goalId, action) => {
    try {
      if (action === 'complete') await completeGoal(goalId);
      else if (action === 'activate') await activateGoal(goalId);
      else if (action === 'pause') await pauseGoal(goalId);
      toast.success(`Goal ${action}d`);
      fetchData();
    } catch {
      toast.error(`Failed to ${action} goal`);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'green';
      case 'Completed': return 'violet';
      case 'Paused': return 'yellow';
      case 'Failed': return 'red';
      default: return 'gray';
    }
  };

  const getTypeIcon = (type) => {
    const icons = {
      'Weight-Loss': '🏋️', 'Muscle-Building': '💪', 'Endurance': '🏃', 'Flexibility': '🧘',
      'Nutrition': '🥗', 'Hydration': '💧', 'Sleep': '😴', 'Custom': '🎯',
    };
    return icons[type] || '🎯';
  };

  const typeOptions = [
    { value: 'Weight-Loss', label: 'Weight Loss' },
    { value: 'Muscle-Building', label: 'Muscle Building' },
    { value: 'Endurance', label: 'Endurance' },
    { value: 'Flexibility', label: 'Flexibility' },
    { value: 'Nutrition', label: 'Nutrition' },
    { value: 'Hydration', label: 'Hydration' },
    { value: 'Sleep', label: 'Sleep' },
    { value: 'Custom', label: 'Custom' },
  ];

  const activeCount = stats?.byStatus?.Active?.count || goals.filter(g => g.Status === 'Active').length;
  const completedCount = stats?.byStatus?.Completed?.count || goals.filter(g => g.Status === 'Completed').length;

  return (
    <DashboardLayout>
      <PageHeader
        title="Goals"
        description="Set and track your fitness goals"
        actions={<Button variant="primary" icon={<FiPlus className="w-4 h-4" />} onClick={openCreate}>New Goal</Button>}
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Card className="text-center py-4">
          <p className="text-3xl font-bold text-green-500">{activeCount}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Active Goals</p>
        </Card>
        <Card className="text-center py-4">
          <p className="text-3xl font-bold text-violet-500">{completedCount}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Completed</p>
        </Card>
        <Card className="text-center py-4">
          <p className="text-3xl font-bold text-gray-800 dark:text-gray-100">{goals.length}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Total Goals</p>
        </Card>
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          options={[{ value: '', label: 'All Status' }, { value: 'Active', label: 'Active' }, { value: 'Completed', label: 'Completed' }, { value: 'Paused', label: 'Paused' }, { value: 'Failed', label: 'Failed' }]}
          className="w-36"
        />
        <Select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          options={[{ value: '', label: 'All Types' }, ...typeOptions]}
          className="w-40"
        />
      </div>

      {loading ? (
        <div className="space-y-4">{[...Array(3)].map((_, i) => <Skeleton key={i} type="card" />)}</div>
      ) : goals.length === 0 ? (
        <Card>
          <EmptyState
            icon={<FiTarget className="w-12 h-12" />}
            title="No goals found"
            description="Create your first goal to start tracking your fitness journey."
            action={<Button variant="primary" onClick={openCreate}>Create Goal</Button>}
          />
        </Card>
      ) : (
        <div className="space-y-4">
          {goals.map((goal) => (
            <Card key={goal._id} className="!p-0 overflow-hidden">
              <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{getTypeIcon(goal.Type)}</span>
                    <div>
                      <h3 className="font-semibold text-gray-800 dark:text-gray-100">{goal.Title}</h3>
                      {goal.Description && <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{goal.Description}</p>}
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant={getStatusColor(goal.Status)}>{goal.Status}</Badge>
                        <span className="text-xs text-gray-400">{goal.Type}</span>
                        {goal.Frequency && <span className="text-xs text-gray-400">• {goal.Frequency}</span>}
                        {goal.EndDate && <span className="text-xs text-gray-400">• Due {format(new Date(goal.EndDate), 'MMM dd, yyyy')}</span>}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {goal.Status === 'Active' && (
                      <>
                        <button onClick={() => handleStatusChange(goal._id, 'pause')} className="text-gray-400 hover:text-yellow-500 transition" title="Pause"><FiPause className="w-4 h-4" /></button>
                        <button onClick={() => handleStatusChange(goal._id, 'complete')} className="text-gray-400 hover:text-green-500 transition" title="Complete"><FiCheck className="w-4 h-4" /></button>
                      </>
                    )}
                    {goal.Status === 'Paused' && (
                      <button onClick={() => handleStatusChange(goal._id, 'activate')} className="text-gray-400 hover:text-green-500 transition" title="Activate"><FiPlay className="w-4 h-4" /></button>
                    )}
                    <button onClick={() => openEdit(goal)} className="text-gray-400 hover:text-violet-500 transition"><FiEdit2 className="w-4 h-4" /></button>
                    <button onClick={() => setDeleteId(goal._id)} className="text-gray-400 hover:text-red-500 transition"><FiTrash2 className="w-4 h-4" /></button>
                  </div>
                </div>

                {goal.TargetValue > 0 && (
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-gray-600 dark:text-gray-400">{goal.CurrentValue || 0} / {goal.TargetValue} {goal.Unit || ''}</span>
                      <span className="font-medium text-gray-800 dark:text-gray-100">{goal.Progress || 0}%</span>
                    </div>
                    <div className="w-full h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div className="h-full bg-violet-500 rounded-full transition-all duration-500" style={{ width: `${Math.min(goal.Progress || 0, 100)}%` }} />
                    </div>
                  </div>
                )}

                {goal.Status === 'Active' && goal.TargetValue > 0 && (
                  <div className="flex items-center gap-2 mt-3">
                    <input
                      type="number"
                      placeholder="New value"
                      value={progressInputs[goal._id] || ''}
                      onChange={(e) => setProgressInputs({ ...progressInputs, [goal._id]: e.target.value })}
                      className="form-input w-28 text-sm bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700/60 rounded-lg"
                    />
                    <Button size="sm" variant="secondary" onClick={() => handleProgressUpdate(goal._id)}>Update</Button>
                  </div>
                )}
              </div>

              {goal.Milestones?.length > 0 && (
                <div className="border-t border-gray-100 dark:border-gray-700/60">
                  <button
                    onClick={() => setExpandedId(expandedId === goal._id ? null : goal._id)}
                    className="w-full flex items-center gap-2 px-5 py-3 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900 transition"
                  >
                    {expandedId === goal._id ? <FiChevronDown className="w-4 h-4" /> : <FiChevronRight className="w-4 h-4" />}
                    Milestones ({goal.Milestones.filter(m => m.Achieved).length}/{goal.Milestones.length})
                  </button>
                  {expandedId === goal._id && (
                    <div className="px-5 pb-4 space-y-2">
                      {goal.Milestones.map((ms, i) => (
                        <div key={i} className="flex items-center gap-3 text-sm">
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center ${ms.Achieved ? 'bg-green-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-400'}`}>
                            {ms.Achieved && <FiCheck className="w-3 h-3" />}
                          </div>
                          <span className={ms.Achieved ? 'text-gray-500 dark:text-gray-400 line-through' : 'text-gray-700 dark:text-gray-300'}>{ms.Title}</span>
                          <span className="text-xs text-gray-400 ml-auto">{ms.TargetValue} {goal.Unit || ''}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      <Modal isOpen={showModal} onClose={() => { setShowModal(false); resetForm(); }} title={editingGoal ? 'Edit Goal' : 'Create Goal'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Title" value={formData.Title} onChange={(e) => updateGoalField('Title', e.target.value)} onBlur={(e) => goalHandleBlur('Title', e.target.value)} error={goalErrors.Title} required placeholder="e.g., Lose 10kg" />
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
            <textarea value={formData.Description} onChange={(e) => setFormData({ ...formData, Description: e.target.value })} rows={2} className="form-textarea w-full bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700/60 rounded-lg focus:ring-violet-500 focus:border-violet-500" placeholder="Optional description" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Select label="Type" value={formData.Type} onChange={(e) => setFormData({ ...formData, Type: e.target.value })} options={typeOptions} />
            <Select label="Frequency" value={formData.Frequency} onChange={(e) => setFormData({ ...formData, Frequency: e.target.value })} options={[{ value: 'Daily', label: 'Daily' }, { value: 'Weekly', label: 'Weekly' }, { value: 'Monthly', label: 'Monthly' }, { value: 'Once', label: 'Once' }]} />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <Input label="Target" type="number" step="any" value={formData.TargetValue} onChange={(e) => setFormData({ ...formData, TargetValue: e.target.value })} />
            <Input label="Current" type="number" step="any" value={formData.CurrentValue} onChange={(e) => setFormData({ ...formData, CurrentValue: e.target.value })} />
            <Input label="Unit" value={formData.Unit} onChange={(e) => setFormData({ ...formData, Unit: e.target.value })} placeholder="kg, min..." />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Start Date" type="date" value={formData.StartDate} onChange={(e) => setFormData({ ...formData, StartDate: e.target.value })} />
            <Input label="End Date" type="date" value={formData.EndDate} onChange={(e) => setFormData({ ...formData, EndDate: e.target.value })} />
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="submit" variant="primary" className="flex-1">{editingGoal ? 'Update Goal' : 'Create Goal'}</Button>
            <Button type="button" variant="secondary" onClick={() => { setShowModal(false); resetForm(); }}>Cancel</Button>
          </div>
        </form>
      </Modal>

      <ConfirmModal isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} title="Delete Goal" message="Are you sure you want to delete this goal?" />
    </DashboardLayout>
  );
}

export default Goals;
