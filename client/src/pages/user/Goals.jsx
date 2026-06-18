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
import { FiTarget, FiPlus, FiTrash2, FiEdit2, FiPlay, FiPause, FiCheck, FiChevronDown, FiChevronRight, FiChevronLeft, FiTrendingUp, FiActivity, FiZap, FiWind, FiHeart, FiDroplet, FiMoon, FiAward, FiSearch } from 'react-icons/fi';
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
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  const [progressInputs, setProgressInputs] = useState({});
  const [stats, setStats] = useState(null);
  const [step, setStep] = useState(0);
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
    setStep(0);
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

  const getUnitSuggestion = (type) => {
    const units = {
      'Weight-Loss': 'kg',
      'Muscle-Building': 'kg',
      'Endurance': 'min',
      'Flexibility': 'min',
      'Nutrition': 'cal',
      'Hydration': 'ml',
      'Sleep': 'hrs',
      'Custom': '',
    };
    return units[type] || '';
  };

  const activeCount = stats?.byStatus?.Active?.count || goals.filter(g => g.Status === 'Active').length;
  const completedCount = stats?.byStatus?.Completed?.count || goals.filter(g => g.Status === 'Completed').length;

  const filteredGoals = useMemo(() => {
    return goals.filter((goal) => {
      const matchesSearch = !searchTerm || 
        goal.Title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        goal.Description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = !statusFilter || goal.Status === statusFilter;
      const matchesType = !typeFilter || goal.Type === typeFilter;
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [goals, searchTerm, statusFilter, typeFilter]);

  const steps = ['Goal Info', 'Target & Schedule', 'Review & Create'];

  const canNext = () => {
    if (step === 0) return formData.Title.trim().length > 0;
    return true;
  };

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

      <div className="grid grid-cols-12 gap-3 mb-6">
        <div className="col-span-8 relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search goals..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-input w-full pl-10 !bg-gray-50 dark:!bg-gray-800 dark:text-gray-100 border-gray-200 dark:border-gray-700/60 rounded-lg focus:ring-0 focus:border-gray-300 dark:focus:border-gray-600 transition"
          />
        </div>
        <div className="col-span-2">
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={[{ value: '', label: 'All Status' }, { value: 'Active', label: 'Active' }, { value: 'Completed', label: 'Completed' }, { value: 'Paused', label: 'Paused' }, { value: 'Failed', label: 'Failed' }]}
            className="w-full"
          />
        </div>
        <div className="col-span-2">
          <Select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            options={[{ value: '', label: 'All Types' }, ...typeOptions]}
            className="w-full"
          />
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">{[...Array(3)].map((_, i) => <Skeleton key={i} type="card" />)}</div>
      ) : filteredGoals.length === 0 ? (
        <Card>
          <EmptyState
            icon={<FiTarget className="w-12 h-12" />}
            title={goals.length === 0 ? "No goals yet" : "No goals found"}
            description={goals.length === 0 ? "Create your first goal to start tracking your fitness journey." : "Try adjusting your filters or search term."}
            action={goals.length === 0 ? <Button variant="primary" onClick={openCreate}>Create Goal</Button> : null}
          />
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredGoals.map((goal) => (
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

      <Modal isOpen={showModal} onClose={() => { setShowModal(false); resetForm(); }} title={editingGoal ? 'Edit Goal' : 'Create Goal'} size="lg">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Step Indicators */}
          <div className="flex items-center gap-2 mb-2">
            {steps.map((s, i) => (
              <button
                key={i}
                type="button"
                onClick={() => { if (i <= step || canNext()) setStep(i); }}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                  i === step
                    ? 'bg-violet-500 text-white shadow-sm'
                    : i < step
                    ? 'bg-violet-500/10 text-violet-600 dark:text-violet-400'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500'
                }`}
              >
                {i < step ? <FiCheck className="w-3 h-3" /> : <span className="w-4 h-4 rounded-full border border-current flex items-center justify-center text-[10px]">{i + 1}</span>}
                <span className="hidden sm:inline">{s}</span>
              </button>
            ))}
          </div>

          {/* ═══ Step 1: Goal Info ═══ */}
          {step === 0 && (
            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-violet-100 dark:bg-violet-500/20 flex items-center justify-center">
                  <FiTarget className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                </div>
                <div className="flex-1">
                  <Input value={formData.Title} onChange={(e) => updateGoalField('Title', e.target.value)} onBlur={(e) => goalHandleBlur('Title', e.target.value)} error={goalErrors.Title} required placeholder="e.g., Lose 10kg in 3 months" className="!mb-0" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Goal Type</label>
                <div className="grid grid-cols-4 gap-2">
                  {typeOptions.map((opt) => {
                    const iconMap = {
                      'Weight-Loss': <FiTrendingUp className="w-4 h-4" />,
                      'Muscle-Building': <FiActivity className="w-4 h-4" />,
                      'Endurance': <FiZap className="w-4 h-4" />,
                      'Flexibility': <FiWind className="w-4 h-4" />,
                      'Nutrition': <FiHeart className="w-4 h-4" />,
                      'Hydration': <FiDroplet className="w-4 h-4" />,
                      'Sleep': <FiMoon className="w-4 h-4" />,
                      'Custom': <FiAward className="w-4 h-4" />,
                    };
                    const isSelected = formData.Type === opt.value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => { setFormData({ ...formData, Type: opt.value, Unit: getUnitSuggestion(opt.value) }); }}
                        className={`relative flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all duration-200 ${
                          isSelected
                            ? 'border-violet-500 bg-violet-50 dark:bg-violet-500/10 shadow-sm'
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-800'
                        }`}
                      >
                        <span className={isSelected ? 'text-violet-600 dark:text-violet-400' : 'text-gray-500 dark:text-gray-400'}>
                          {iconMap[opt.value]}
                        </span>
                        <span className={`text-xs font-medium ${isSelected ? 'text-violet-700 dark:text-violet-300' : 'text-gray-600 dark:text-gray-400'}`}>
                          {opt.label}
                        </span>
                        {isSelected && (
                          <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-violet-500 flex items-center justify-center">
                            <FiCheck className="w-2.5 h-2.5 text-white" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ═══ Step 2: Target & Schedule ═══ */}
          {step === 1 && (
            <div className="space-y-5">
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 space-y-3">
                <div className="flex items-center gap-2 mb-1">
                  <FiTarget className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Target & Progress</span>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Target</label>
                    <Input type="number" step="any" value={formData.TargetValue} onChange={(e) => setFormData({ ...formData, TargetValue: e.target.value })} placeholder="100" className="!mb-0" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Current</label>
                    <Input type="number" step="any" value={formData.CurrentValue} onChange={(e) => setFormData({ ...formData, CurrentValue: e.target.value })} placeholder="0" className="!mb-0" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Unit</label>
                    <Input value={formData.Unit} onChange={(e) => setFormData({ ...formData, Unit: e.target.value })} placeholder="kg, min..." className="!mb-0" />
                  </div>
                </div>
                {formData.TargetValue && Number(formData.TargetValue) > 0 && (
                  <div className="pt-2">
                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                      <span>Progress Preview</span>
                      <span>{Math.min(100, Math.round((Number(formData.CurrentValue) / Number(formData.TargetValue)) * 100))}%</span>
                    </div>
                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-violet-500 to-purple-500 rounded-full transition-all duration-500" style={{ width: `${Math.min(100, (Number(formData.CurrentValue) / Number(formData.TargetValue)) * 100)}%` }} />
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Frequency</label>
                  <div className="flex gap-2">
                    {['Daily', 'Weekly', 'Monthly', 'Once'].map((freq) => (
                      <button key={freq} type="button" onClick={() => setFormData({ ...formData, Frequency: freq })}
                        className={`flex-1 py-2 px-3 text-xs font-medium rounded-lg border transition-all ${
                          formData.Frequency === freq ? 'border-violet-500 bg-violet-50 dark:bg-violet-500/10 text-violet-700 dark:text-violet-300' : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600'
                        }`}
                      >{freq}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Duration</label>
                  <div className="flex gap-2 items-center">
                    <Input type="date" value={formData.StartDate} onChange={(e) => setFormData({ ...formData, StartDate: e.target.value })} className="!mb-0 flex-1" />
                    <span className="text-gray-400 text-xs">to</span>
                    <Input type="date" value={formData.EndDate} onChange={(e) => setFormData({ ...formData, EndDate: e.target.value })} className="!mb-0 flex-1" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ═══ Step 3: Review & Create ═══ */}
          {step === 2 && (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Notes <span className="text-gray-400 font-normal">(optional)</span></label>
                <textarea value={formData.Description} onChange={(e) => setFormData({ ...formData, Description: e.target.value })} rows={2} className="form-textarea w-full bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700/60 rounded-lg focus:ring-violet-500 focus:border-violet-500" placeholder="Why is this goal important to you?" />
              </div>

              {/* Summary */}
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 space-y-3">
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <FiCheck className="w-4 h-4 text-violet-500" /> Summary
                </h4>
                <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Title</span>
                    <span className="font-medium text-gray-800 dark:text-gray-200">{formData.Title || '—'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Type</span>
                    <span className="font-medium text-gray-800 dark:text-gray-200">{typeOptions.find(t => t.value === formData.Type)?.label}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Target</span>
                    <span className="font-medium text-gray-800 dark:text-gray-200">{formData.TargetValue || '—'} {formData.Unit || ''}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Frequency</span>
                    <span className="font-medium text-gray-800 dark:text-gray-200">{formData.Frequency}</span>
                  </div>
                  {formData.EndDate && (
                    <div className="flex justify-between col-span-2">
                      <span className="text-gray-500 dark:text-gray-400">Duration</span>
                      <span className="font-medium text-gray-800 dark:text-gray-200">{format(new Date(formData.StartDate), 'MMM d')} → {format(new Date(formData.EndDate), 'MMM d, yyyy')}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex gap-3 pt-2">
            {step > 0 && (
              <Button type="button" variant="secondary" onClick={() => setStep(step - 1)} icon={<FiChevronLeft className="w-4 h-4" />}>Back</Button>
            )}
            {step < steps.length - 1 ? (
              <Button type="button" variant="primary" className="flex-1" onClick={() => setStep(step + 1)} iconRight={<FiChevronRight className="w-4 h-4" />} disabled={!canNext()}>
                Next
              </Button>
            ) : (
              <Button type="submit" variant="primary" className="flex-1" icon={<FiTarget className="w-4 h-4" />}>
                {editingGoal ? 'Update Goal' : 'Create Goal'}
              </Button>
            )}
            <Button type="button" variant="secondary" onClick={() => { setShowModal(false); resetForm(); }}>Cancel</Button>
          </div>
        </form>
      </Modal>

      <ConfirmModal isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} title="Delete Goal" message="Are you sure you want to delete this goal?" />
    </DashboardLayout>
  );
}

export default Goals;
