import React, { useState, useEffect, useCallback } from 'react';
import TrainerLayout from '../../layouts/TrainerLayout';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Textarea from '../../components/common/Textarea';
import Badge from '../../components/common/Badge';
import Skeleton from '../../components/common/Skeleton';
import Modal from '../../components/common/Modal';
import EmptyState from '../../components/common/EmptyState';
import ConfirmModal from '../../components/common/ConfirmModal';
import { getWorkoutTemplates, createWorkoutTemplate, deleteWorkoutTemplate } from '../../services/trainerService';
import { FiClipboard, FiPlus, FiTrash2 } from 'react-icons/fi';
import toast from 'react-hot-toast';

function WorkoutTemplates() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    Title: '', Type: 'Strength', Difficulty: 'Intermediate',
    EstimatedDuration: 45, Description: '', Exercises: [],
  });
  const [exForm, setExForm] = useState({ Name: '', Sets: '', Reps: '', RestSeconds: '' });

  const fetchTemplates = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await getWorkoutTemplates();
      setTemplates(data?.data || []);
    } catch {
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchTemplates(); }, [fetchTemplates]);

  const addExercise = () => {
    if (!exForm.Name) return;
    setFormData({
      ...formData,
      Exercises: [...formData.Exercises, {
        Name: exForm.Name,
        Sets: parseInt(exForm.Sets) || 3,
        Reps: exForm.Reps || '10',
        RestSeconds: parseInt(exForm.RestSeconds) || 60,
      }],
    });
    setExForm({ Name: '', Sets: '', Reps: '', RestSeconds: '' });
  };

  const removeExercise = (index) => {
    setFormData({ ...formData, Exercises: formData.Exercises.filter((_, i) => i !== index) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.Exercises.length === 0) {
      toast.error('Add at least one exercise');
      return;
    }
    setSaving(true);
    try {
      await createWorkoutTemplate({
        ...formData,
        EstimatedDuration: parseInt(formData.EstimatedDuration) || 45,
        IsTemplate: true,
      });
      toast.success('Template created');
      setShowModal(false);
      setFormData({ Title: '', Type: 'Strength', Difficulty: 'Intermediate', EstimatedDuration: 45, Description: '', Exercises: [] });
      fetchTemplates();
    } catch {
      toast.error('Failed to create template');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteWorkoutTemplate(deleteId);
      toast.success('Template deleted');
      setDeleteId(null);
      fetchTemplates();
    } catch {
      toast.error('Failed to delete');
    }
  };

  return (
    <TrainerLayout pageTitle="Workout Templates">
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-gray-500 dark:text-gray-400">{templates.length} template{templates.length !== 1 ? 's' : ''}</p>
        <Button variant="primary" icon={<FiPlus className="w-4 h-4" />} onClick={() => setShowModal(true)}>New Template</Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => <Skeleton key={i} type="card" />)}
        </div>
      ) : templates.length === 0 ? (
        <Card>
          <EmptyState
            icon={<FiClipboard className="w-12 h-12" />}
            title="No templates"
            description="Create reusable workout templates to assign to clients."
            action={<Button variant="primary" onClick={() => setShowModal(true)}>Create Template</Button>}
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((t) => (
            <Card key={t._id} className="hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-gray-100">{t.Title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="violet">{t.Type}</Badge>
                    <Badge variant="sky">{t.Difficulty}</Badge>
                  </div>
                </div>
                <button onClick={() => setDeleteId(t._id)} className="text-gray-400 hover:text-red-500 transition"><FiTrash2 className="w-4 h-4" /></button>
              </div>
              {t.Description && <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">{t.Description}</p>}
              <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                <span>{t.Exercises?.length || 0} exercises</span>
                <span>{t.EstimatedDuration || 0} min</span>
              </div>
              {t.Exercises?.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700/60">
                  <div className="space-y-1">
                    {t.Exercises.slice(0, 3).map((ex, i) => (
                      <p key={i} className="text-xs text-gray-600 dark:text-gray-400">{ex.Name} - {ex.Sets}x{ex.Reps}</p>
                    ))}
                    {t.Exercises.length > 3 && <p className="text-xs text-gray-400">+{t.Exercises.length - 3} more</p>}
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Create Template">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Title" value={formData.Title} onChange={(e) => setFormData({ ...formData, Title: e.target.value })} required />
            <Input label="Duration (min)" type="number" min="1" value={formData.EstimatedDuration} onChange={(e) => setFormData({ ...formData, EstimatedDuration: e.target.value })} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select label="Type" value={formData.Type} onChange={(e) => setFormData({ ...formData, Type: e.target.value })} options={[{ value: 'Strength', label: 'Strength' }, { value: 'Cardio', label: 'Cardio' }, { value: 'HIIT', label: 'HIIT' }, { value: 'Yoga', label: 'Yoga' }, { value: 'Flexibility', label: 'Flexibility' }, { value: 'Mixed', label: 'Mixed' }]} />
            <Select label="Difficulty" value={formData.Difficulty} onChange={(e) => setFormData({ ...formData, Difficulty: e.target.value })} options={[{ value: 'Beginner', label: 'Beginner' }, { value: 'Intermediate', label: 'Intermediate' }, { value: 'Advanced', label: 'Advanced' }]} />
          </div>
          <Textarea label="Description" value={formData.Description} onChange={(e) => setFormData({ ...formData, Description: e.target.value })} rows={2} maxLength={500} placeholder="Template description" />

          <div className="border-t border-gray-100 dark:border-gray-700/60 pt-4">
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Exercises</h4>
            <div className="grid grid-cols-12 gap-2 mb-3">
              <Input className="col-span-5" value={exForm.Name} onChange={(e) => setExForm({ ...exForm, Name: e.target.value })} placeholder="Exercise name" />
              <Input className="col-span-2" value={exForm.Sets} onChange={(e) => setExForm({ ...exForm, Sets: e.target.value })} placeholder="Sets" type="number" />
              <Input className="col-span-2" value={exForm.Reps} onChange={(e) => setExForm({ ...exForm, Reps: e.target.value })} placeholder="Reps" />
              <div className="col-span-3 flex items-end">
                <Button type="button" variant="secondary" size="sm" className="w-full" onClick={addExercise}><FiPlus className="w-3 h-3 mr-1" />Add</Button>
              </div>
            </div>
            {formData.Exercises.length > 0 && (
              <div className="space-y-1.5">
                {formData.Exercises.map((ex, i) => (
                  <div key={i} className="flex items-center justify-between px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700/60 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-medium text-gray-400 dark:text-gray-500 w-5">{i + 1}.</span>
                      <span className="text-sm text-gray-700 dark:text-gray-300">{ex.Name}</span>
                      <Badge>{ex.Sets}x{ex.Reps}</Badge>
                    </div>
                    <button type="button" onClick={() => removeExercise(i)} className="text-gray-400 hover:text-red-500 transition"><FiTrash2 className="w-3.5 h-3.5" /></button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="submit" variant="primary" className="flex-1" loading={saving}>Create Template</Button>
            <Button type="button" variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
          </div>
        </form>
      </Modal>

      <ConfirmModal isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} title="Delete Template" message="Are you sure you want to delete this template?" />
    </TrainerLayout>
  );
}

export default WorkoutTemplates;

