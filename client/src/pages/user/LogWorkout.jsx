import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import PageHeader from '../../components/common/PageHeader';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Button from '../../components/common/Button';
import { useValidation, validators } from '../../hooks/useValidation';
import { createWorkout } from '../../services/workoutService';
import { FiPlus, FiTrash2, FiX, FiActivity, FiClock, FiMapPin, FiTag, FiTarget, FiZap } from 'react-icons/fi';
import toast from 'react-hot-toast';

const exerciseTypes = ['Strength', 'Cardio', 'Flexibility', 'Balance', 'Plyometric', 'Other'];
const muscleGroups = ['Chest', 'Back', 'Shoulders', 'Biceps', 'Triceps', 'Legs', 'Core', 'Full Body'];
const workoutLocations = ['Home Gym', 'Commercial Gym', 'Outdoor', 'Park', 'Sports Field', 'Swimming Pool', 'Studio', 'Other'];

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

  const toggleMuscleGroup = (exIndex, group) => {
    const current = exercises[exIndex].MuscleGroups;
    const updated = current.includes(group) ? current.filter((g) => g !== group) : [...current, group];
    updateExercise(exIndex, 'MuscleGroups', updated);
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
      toast.success('Workout logged successfully!');
      navigate('/workouts');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to log workout');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <PageHeader title="Log Workout" breadcrumbs={[{ label: 'Workouts', to: '/workouts' }, { label: 'Log Workout' }]} />
      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {/* Workout Details Card */}
          <Card>
            <div className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center">
                <FiActivity className="w-4 h-4 text-violet-500" />
              </div>
              <h3 className="text-base font-semibold text-gray-800 dark:text-gray-100">Workout Details</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Title" placeholder="e.g., Morning Upper Body" value={form.Title} onChange={(e) => updateField('Title', e.target.value)} onBlur={(e) => handleBlur('Title', e.target.value)} error={errors.Title} required icon={<FiTarget className="w-4 h-4" />} />
              <Select label="Type" options={['Weightlifting', 'Cardio', 'HIIT', 'Yoga', 'CrossFit', 'Strength', 'Flexibility', 'Sports', 'Other'].map((v) => ({ value: v, label: v }))} value={form.Type} onChange={(e) => updateField('Type', e.target.value)} />
              <Select label="Difficulty" options={['Beginner', 'Intermediate', 'Advanced'].map((v) => ({ value: v, label: v }))} value={form.Difficulty} onChange={(e) => updateField('Difficulty', e.target.value)} />
              <Input label="Duration" type="number" placeholder="45" value={form.Duration} onChange={(e) => updateField('Duration', e.target.value)} onBlur={(e) => handleBlur('Duration', e.target.value)} error={errors.Duration} helperText="0-1440 minutes" icon={<FiClock className="w-4 h-4" />} />
              <Select label="Location" options={[{ value: '', label: 'Select location' }, ...workoutLocations.map((v) => ({ value: v, label: v }))]} value={form.Location} onChange={(e) => updateField('Location', e.target.value)} icon={<FiMapPin className="w-4 h-4" />} />
              <Input label="Tags (optional)" placeholder="e.g., strength, upper body" value={form.Tags} onChange={(e) => updateField('Tags', e.target.value)} helperText="Separate with commas" icon={<FiTag className="w-4 h-4" />} />
            </div>
          </Card>

          {/* Exercises Card */}
          <Card>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                  <FiZap className="w-4 h-4 text-emerald-500" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-800 dark:text-gray-100">Exercises</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{exercises.length} exercise{exercises.length !== 1 ? 's' : ''} added</p>
                </div>
              </div>
              <Button variant="secondary" size="sm" icon={<FiPlus className="w-4 h-4" />} onClick={addExercise}>Add Exercise</Button>
            </div>
            <div className="space-y-4">
              {exercises.map((ex, i) => (
                <div key={i} className="border border-gray-200 dark:border-gray-700/60 rounded-xl p-4 bg-gray-50/50 dark:bg-gray-900/30">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-violet-500/10 text-violet-500 text-xs font-semibold flex items-center justify-center">{i + 1}</span>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Exercise</span>
                    </div>
                    {exercises.length > 1 && (
                      <button type="button" onClick={() => removeExercise(i)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition" title="Remove exercise">
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
                  {/* Muscle Groups */}
                  <div className="mt-3">
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Target Muscles</label>
                    <div className="flex flex-wrap gap-1.5">
                      {muscleGroups.map((group) => (
                        <button
                          key={group}
                          type="button"
                          onClick={() => toggleMuscleGroup(i, group)}
                          className={`px-2.5 py-1 rounded-full text-xs font-medium transition ${
                            ex.MuscleGroups.includes(group)
                              ? 'bg-violet-500 text-white'
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                          }`}
                        >
                          {group}
                        </button>
                      ))}
                    </div>
                  </div>
                  {/* Notes */}
                  <div className="mt-3">
                    <Input placeholder="Add notes (optional)" value={ex.Notes} onChange={(e) => updateExercise(i, 'Notes', e.target.value)} />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end">
            <Button variant="secondary" onClick={() => navigate('/workouts')}>Cancel</Button>
            <Button type="submit" variant="primary" loading={submitting} icon={<FiPlus className="w-4 h-4" />}>Log Workout</Button>
          </div>
        </div>
      </form>
    </DashboardLayout>
  );
}

export default LogWorkout;
