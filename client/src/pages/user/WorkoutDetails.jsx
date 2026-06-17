import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import PageHeader from '../../components/common/PageHeader';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Skeleton from '../../components/common/Skeleton';
import ConfirmModal from '../../components/common/ConfirmModal';
import { getWorkout, updateWorkout, deleteWorkout, startWorkout, completeExercise, toggleFavorite } from '../../services/workoutService';
import { FiArrowLeft, FiHeart, FiPlay, FiCheck, FiTrash2 } from 'react-icons/fi';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

function WorkoutDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [workout, setWorkout] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const fetchWorkout = async () => {
    try {
      const { data } = await getWorkout(id);
      setWorkout(data.data);
    } catch {
      toast.error('Failed to load workout');
      navigate('/workouts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchWorkout(); }, [id]);

  const handleStart = async () => {
    try {
      await startWorkout(id);
      toast.success('Workout started!');
      fetchWorkout();
    } catch { toast.error('Failed to start workout'); }
  };

  const handleCompleteExercise = async (index) => {
    try {
      await completeExercise(id, index);
      toast.success('Exercise completed!');
      fetchWorkout();
    } catch { toast.error('Failed to complete exercise'); }
  };

  const handleComplete = async () => {
    try {
      await updateWorkout(id, { Status: 'Completed' });
      toast.success('Workout completed!');
      fetchWorkout();
    } catch { toast.error('Failed to complete workout'); }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteWorkout(id);
      toast.success('Workout deleted');
      navigate('/workouts');
    } catch {
      toast.error('Failed to delete workout');
      setDeleting(false);
      setShowDelete(false);
    }
  };

  const handleFavorite = async () => {
    try {
      await toggleFavorite(id);
      fetchWorkout();
    } catch { toast.error('Failed to update favorite'); }
  };

  if (loading) return <DashboardLayout><Skeleton type="rect" /></DashboardLayout>;
  if (!workout) return null;

  const statusColor = { Planned: 'info', 'In-progress': 'warning', Completed: 'success' };

  return (
    <DashboardLayout>
      <PageHeader
        title={workout.Title}
        breadcrumbs={[{ label: 'Workouts', to: '/workouts' }, { label: workout.Title }]}
        actions={
          <div className="flex gap-2">
            <Button variant="ghost" onClick={handleFavorite}>
              <FiHeart className={`w-4 h-4 mr-1 ${workout.IsFavorite ? 'fill-current text-red-500' : ''}`} />
              {workout.IsFavorite ? 'Unfavorite' : 'Favorite'}
            </Button>
            <Button variant="danger" onClick={() => setShowDelete(true)} icon={<FiTrash2 className="w-4 h-4" />}>Delete</Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <Badge variant={statusColor[workout.Status] || 'default'} size="md">{workout.Status}</Badge>
              <Badge variant="violet" size="md">{workout.Type}</Badge>
              <Badge size="md">{workout.Difficulty}</Badge>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
              <div className="bg-gray-100 dark:bg-gray-900 rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{workout.Duration || 0}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Minutes</p>
              </div>
              <div className="bg-gray-100 dark:bg-gray-900 rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{workout.CaloriesBurned || 0}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Calories</p>
              </div>
              <div className="bg-gray-100 dark:bg-gray-900 rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{workout.Exercises?.length || 0}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Exercises</p>
              </div>
              <div className="bg-gray-100 dark:bg-gray-900 rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{workout.CompletionRate || 0}%</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Complete</p>
              </div>
            </div>
            {workout.Date && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {format(new Date(workout.Date), 'EEEE, MMMM dd, yyyy')}
              </p>
            )}
          </Card>

          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Exercises</h3>
              {workout.Status === 'Planned' && (
                <Button size="sm" onClick={handleStart} icon={<FiPlay className="w-4 h-4" />}>Start Workout</Button>
              )}
            </div>
            {workout.Exercises?.length > 0 ? (
              <div className="space-y-3">
                {workout.Exercises.map((ex, i) => (
                  <div key={i} className={`flex items-center justify-between p-4 rounded-lg border ${ex.Completed ? 'border-green-200 dark:border-green-500/30 bg-green-500/5' : 'border-gray-200 dark:border-gray-700/60'}`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${ex.Completed ? 'bg-green-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'}`}>
                        {ex.Completed ? <FiCheck className="w-4 h-4" /> : i + 1}
                      </div>
                      <div>
                        <p className="font-medium text-gray-800 dark:text-gray-100">{ex.Name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {ex.Sets > 0 && `${ex.Sets} sets x ${ex.Reps} reps`}
                          {ex.Weight > 0 && ` @ ${ex.Weight}kg`}
                          {ex.Duration > 0 && `${ex.Duration} min`}
                        </p>
                      </div>
                    </div>
                    {workout.Status === 'In-progress' && !ex.Completed && (
                      <Button size="xs" variant="success" onClick={() => handleCompleteExercise(i)}>Complete</Button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">No exercises added</p>
            )}
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Details</h3>
            <dl className="space-y-3">
              {workout.Location && (
                <div><dt className="text-xs text-gray-500 dark:text-gray-400 uppercase">Location</dt><dd className="text-sm text-gray-800 dark:text-gray-200">{workout.Location}</dd></div>
              )}
              {workout.MoodBefore && (
                <div><dt className="text-xs text-gray-500 dark:text-gray-400 uppercase">Mood Before</dt><dd className="text-sm text-gray-800 dark:text-gray-200">{workout.MoodBefore}/10</dd></div>
              )}
              {workout.MoodAfter && (
                <div><dt className="text-xs text-gray-500 dark:text-gray-400 uppercase">Mood After</dt><dd className="text-sm text-gray-800 dark:text-gray-200">{workout.MoodAfter}/10</dd></div>
              )}
              {workout.Tags?.length > 0 && (
                <div>
                  <dt className="text-xs text-gray-500 dark:text-gray-400 uppercase mb-1">Tags</dt>
                  <dd className="flex flex-wrap gap-1">
                    {workout.Tags.map((tag, i) => (
                      <span key={i} className="px-2 py-0.5 bg-violet-500/10 text-violet-600 dark:text-violet-400 text-xs rounded-full">{tag}</span>
                    ))}
                  </dd>
                </div>
              )}
            </dl>
          </Card>

          {workout.Status === 'In-progress' && (
            <Button className="w-full" onClick={handleComplete} icon={<FiCheck className="w-4 h-4" />}>
              Complete Workout
            </Button>
          )}
        </div>
      </div>

      <ConfirmModal
        isOpen={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete Workout"
        message={`Are you sure you want to delete "${workout.Title}"? This cannot be undone.`}
      />
    </DashboardLayout>
  );
}

export default WorkoutDetails;
