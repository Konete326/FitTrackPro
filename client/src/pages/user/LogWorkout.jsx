import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import PageHeader from '../../components/common/PageHeader';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Textarea from '../../components/common/Textarea';
import Button from '../../components/common/Button';
import { useValidation, validators } from '../../hooks/useValidation';
import { createWorkout } from '../../services/workoutService';
import { FiPlus, FiTrash2, FiArrowLeft } from 'react-icons/fi';
import toast from 'react-hot-toast';

const exerciseTypes = ['Strength', 'Cardio', 'Flexibility', 'Balance', 'Plyometric', 'Other'];
const muscleGroups = ['Chest', 'Back', 'Shoulders', 'Biceps', 'Triceps', 'Legs', 'Core', 'Full Body', 'Other'];

function LogWorkout() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    Title: '', Type: 'Weightlifting', Difficulty: 'Intermediate', Duration: '', Location: '', Tags: '',
  });
  const [exercises, setExercises] = useState([{ Name: '', Category: 'Strength', MuscleGroups: [], Sets: '', Reps: '', Weight: '', Duration: '', Notes: '' }]);

  const updateField = (field, value) => { setForm((prev) => ({ ...prev, [field]: value })); handleChange(field, value); };

  const rules = useMemo(() => ({
    Title: [(v) => validators.required(v, 'Workout title')],
    Duration: [(v) => validators.numberRange(v, 0, 1440, 'Duration')],
  }), []);
  const { errors, handleChange, handleBlur, validateAll } = useValidation(rules);

  const updateExercise = (index, field, value) => {
    const updated = [...exercises];
    updated[index] = { ...updated[index], [field]: value };
    setExercises(updated);
  };

  const addExercise = () => {
    setExercises([...exercises, { Name: '', Category: 'Strength', MuscleGroups: [], Sets: '', Reps: '', Weight: '', Duration: '', Notes: '' }]);
  };

  const removeExercise = (index) => {
    if (exercises.length === 1) return;
    setExercises(exercises.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateAll(form)) return;
    setSubmitting(true);
    try {
      const payload = {
        ...form,
        Duration: Number(form.Duration) || 0,
        Tags: form.Tags ? form.Tags.split(',').map((t) => t.trim()) : [],
        Exercises: exercises.filter((ex) => ex.Name).map((ex) => ({
          ...ex,
          Sets: Number(ex.Sets) || 0,
          Reps: Number(ex.Reps) || 0,
          Weight: Number(ex.Weight) || 0,
          Duration: Number(ex.Duration) || 0,
        })),
      };
      await createWorkout(payload);
      toast.success('Workout created!');
      navigate('/workouts');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create workout');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <PageHeader title="Log Workout" breadcrumbs={[{ label: 'Workouts', to: '/workouts' }, { label: 'Log Workout' }]} />
      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          <Card>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Workout Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Title" placeholder="e.g., Morning Upper Body" value={form.Title} onChange={(e) => updateField('Title', e.target.value)} onBlur={(e) => handleBlur('Title', e.target.value)} error={errors.Title} required />
              <Select label="Type" options={['Weightlifting', 'Cardio', 'HIIT', 'Yoga', 'Sports', 'Other'].map((v) => ({ value: v, label: v }))} value={form.Type} onChange={(e) => updateField('Type', e.target.value)} />
              <Select label="Difficulty" options={['Beginner', 'Intermediate', 'Advanced'].map((v) => ({ value: v, label: v }))} value={form.Difficulty} onChange={(e) => updateField('Difficulty', e.target.value)} />
              <Input label="Duration (minutes)" type="number" placeholder="45" value={form.Duration} onChange={(e) => updateField('Duration', e.target.value)} onBlur={(e) => handleBlur('Duration', e.target.value)} error={errors.Duration} helperText="0-1440 minutes" />
              <Input label="Location" placeholder="e.g., Home Gym" value={form.Location} onChange={(e) => updateField('Location', e.target.value)} />
              <Input label="Tags (comma separated)" placeholder="e.g., strength, upper body" value={form.Tags} onChange={(e) => updateField('Tags', e.target.value)} />
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Exercises</h3>
              <Button variant="secondary" size="sm" icon={<FiPlus className="w-4 h-4" />} onClick={addExercise}>Add Exercise</Button>
            </div>
            <div className="space-y-4">
              {exercises.map((ex, i) => (
                <div key={i} className="border border-gray-200 dark:border-gray-700/60 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Exercise #{i + 1}</span>
                    {exercises.length > 1 && (
                      <button type="button" onClick={() => removeExercise(i)} className="text-red-500 hover:text-red-600 transition">
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    <Input placeholder="Exercise name" value={ex.Name} onChange={(e) => updateExercise(i, 'Name', e.target.value)} />
                    <Select options={exerciseTypes.map((v) => ({ value: v, label: v }))} value={ex.Category} onChange={(e) => updateExercise(i, 'Category', e.target.value)} />
                    <Input placeholder="Sets" type="number" value={ex.Sets} onChange={(e) => updateExercise(i, 'Sets', e.target.value)} />
                    <Input placeholder="Reps" type="number" value={ex.Reps} onChange={(e) => updateExercise(i, 'Reps', e.target.value)} />
                    <Input placeholder="Weight (kg)" type="number" value={ex.Weight} onChange={(e) => updateExercise(i, 'Weight', e.target.value)} />
                    <Input placeholder="Duration (min)" type="number" value={ex.Duration} onChange={(e) => updateExercise(i, 'Duration', e.target.value)} />
                  </div>
                  <Input placeholder="Notes" value={ex.Notes} onChange={(e) => updateExercise(i, 'Notes', e.target.value)} className="mt-3" />
                </div>
              ))}
            </div>
          </Card>

          <div className="flex gap-3 justify-end">
            <Button variant="secondary" onClick={() => navigate('/workouts')}>Cancel</Button>
            <Button type="submit" loading={submitting}>Create Workout</Button>
          </div>
        </div>
      </form>
    </DashboardLayout>
  );
}

export default LogWorkout;
