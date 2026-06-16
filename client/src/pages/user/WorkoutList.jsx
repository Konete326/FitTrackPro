import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import PageHeader from '../../components/common/PageHeader';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Pagination from '../../components/common/Pagination';
import Skeleton from '../../components/common/Skeleton';
import EmptyState from '../../components/common/EmptyState';
import ConfirmModal from '../../components/common/ConfirmModal';
import { getWorkouts, deleteWorkout, toggleFavorite } from '../../services/workoutService';
import { FiPlus, FiSearch, FiHeart, FiTrash2, FiEye, FiCopy } from 'react-icons/fi';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

function WorkoutList() {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);

  const fetchWorkouts = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 10 };
      if (search) params.search = search;
      if (typeFilter) params.type = typeFilter;
      if (statusFilter) params.status = statusFilter;
      const { data } = await getWorkouts(params);
      setWorkouts(data.data || []);
      setTotalPages(data.totalPages || 1);
    } catch {
      toast.error('Failed to load workouts');
    } finally {
      setLoading(false);
    }
  }, [page, search, typeFilter, statusFilter]);

  useEffect(() => { fetchWorkouts(); }, [fetchWorkouts]);

  const handleDelete = async () => {
    try {
      await deleteWorkout(deleteTarget._id);
      toast.success('Workout deleted');
      setDeleteTarget(null);
      fetchWorkouts();
    } catch {
      toast.error('Failed to delete workout');
    }
  };

  const handleFavorite = async (id) => {
    try {
      await toggleFavorite(id);
      fetchWorkouts();
    } catch {
      toast.error('Failed to update favorite');
    }
  };

  const statusColor = { Planned: 'info', 'In-progress': 'warning', Completed: 'success' };
  const typeColors = { Weightlifting: 'violet', Cardio: 'success', HIIT: 'danger', Yoga: 'info', Sports: 'warning' };

  return (
    <DashboardLayout>
      <PageHeader
        title="My Workouts"
        description="Track and manage all your workout sessions"
        actions={<Link to="/workouts/log"><Button icon={<FiPlus className="w-4 h-4" />}>Log Workout</Button></Link>}
      />

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xs p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <Input
            placeholder="Search workouts..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            icon={<FiSearch className="w-4 h-4" />}
            className="flex-1"
          />
          <Select
            options={[
              { value: 'Weightlifting', label: 'Weightlifting' },
              { value: 'Cardio', label: 'Cardio' },
              { value: 'HIIT', label: 'HIIT' },
              { value: 'Yoga', label: 'Yoga' },
              { value: 'Sports', label: 'Sports' },
            ]}
            placeholder="All Types"
            value={typeFilter}
            onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }}
            className="sm:w-40"
          />
          <Select
            options={[
              { value: 'Planned', label: 'Planned' },
              { value: 'In-progress', label: 'In Progress' },
              { value: 'Completed', label: 'Completed' },
            ]}
            placeholder="All Status"
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="sm:w-40"
          />
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">{[...Array(5)].map((_, i) => <Skeleton key={i} type="rect" />)}</div>
      ) : workouts.length === 0 ? (
        <Card>
          <EmptyState
            icon={<FiPlus className="w-16 h-16" />}
            title="No workouts yet"
            description="Start logging your workouts to track your progress"
            action="Log Workout"
            onAction={() => window.location.href = '/workouts/log'}
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {workouts.map((workout) => (
            <Card key={workout._id} hover className="!p-0 overflow-hidden">
              <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-800 dark:text-gray-100">{workout.Title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {workout.Date ? format(new Date(workout.Date), 'MMM dd, yyyy') : 'No date'}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <Badge variant={typeColors[workout.Type] || 'default'} size="sm">{workout.Type}</Badge>
                    <Badge variant={statusColor[workout.Status] || 'default'} size="sm">{workout.Status}</Badge>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                  <span>{workout.Duration || 0} min</span>
                  <span>{workout.CaloriesBurned || 0} cal</span>
                  <span>{workout.Exercises?.length || 0} exercises</span>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700/60">
                  <div className="flex gap-2">
                    <button onClick={() => handleFavorite(workout._id)} className={`p-1.5 rounded-lg transition ${workout.IsFavorite ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}>
                      <FiHeart className={`w-4 h-4 ${workout.IsFavorite ? 'fill-current' : ''}`} />
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <Link to={`/workouts/${workout._id}`} className="p-1.5 text-gray-400 hover:text-violet-500 rounded-lg transition">
                      <FiEye className="w-4 h-4" />
                    </Link>
                    <button onClick={() => setDeleteTarget(workout)} className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg transition">
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {!loading && totalPages > 1 && (
        <div className="mt-6">
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      )}

      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Workout"
        message={`Are you sure you want to delete "${deleteTarget?.Title}"? This action cannot be undone.`}
        confirmText="Delete"
      />
    </DashboardLayout>
  );
}

export default WorkoutList;
