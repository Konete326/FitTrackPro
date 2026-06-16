import React, { useState, useEffect, useCallback } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Skeleton from '../../components/common/Skeleton';
import EmptyState from '../../components/common/EmptyState';
import { getAllUsers, toggleUserActive, deleteUser } from '../../services/adminService';
import { useNavigate } from 'react-router-dom';
import { FiUserCheck, FiPlus, FiTrash2, FiUserX, FiSearch } from 'react-icons/fi';
import toast from 'react-hot-toast';

function TrainerManagement() {
  const navigate = useNavigate();
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchTrainers = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await getAllUsers({ role: 'Trainer', limit: 50 });
      setTrainers(data?.data || []);
    } catch {
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchTrainers(); }, [fetchTrainers]);

  const handleToggle = async (id) => {
    try {
      await toggleUserActive(id);
      toast.success('Status toggled');
      fetchTrainers();
    } catch {
      toast.error('Failed to toggle');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this trainer?')) return;
    try {
      await deleteUser(id);
      toast.success('Trainer deleted');
      fetchTrainers();
    } catch {
      toast.error('Failed to delete');
    }
  };

  const filtered = trainers.filter(t => {
    const name = (t.Profile?.Name || t.Username || '').toLowerCase();
    return name.includes(search.toLowerCase());
  });

  return (
    <AdminLayout pageTitle="Trainer Management">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Search trainers..." value={search} onChange={(e) => setSearch(e.target.value)} className="form-input pl-10 w-52 bg-white dark:bg-gray-900/30 border-gray-200 dark:border-gray-700/60 rounded-lg" />
        </div>
        <Button variant="primary" icon={<FiPlus className="w-4 h-4" />} onClick={() => navigate('/admin/create-trainer')}>Add Trainer</Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => <Skeleton key={i} type="card" />)}
        </div>
      ) : filtered.length === 0 ? (
        <Card>
          <EmptyState icon={<FiUserCheck className="w-12 h-12" />} title="No trainers" description="Add your first trainer to get started." action={<Button variant="primary" onClick={() => navigate('/admin/create-trainer')}>Add Trainer</Button>} />
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((t) => (
            <Card key={t._id} className="hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-full bg-sky-500/10 flex items-center justify-center overflow-hidden shrink-0">
                  {t.Profile?.ProfilePicture ? <img src={t.Profile.ProfilePicture} alt="" className="w-full h-full object-cover" /> : <span className="text-xl font-bold text-sky-500">{(t.Profile?.Name || t.Username || 'T')[0].toUpperCase()}</span>}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-gray-800 dark:text-gray-100 truncate">{t.Profile?.Name || t.Username}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t.Email}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant={t.IsActive ? 'green' : 'red'}>{t.IsActive ? 'Active' : 'Inactive'}</Badge>
                    {t.Stats?.TotalWorkouts !== undefined && <span className="text-xs text-gray-400">{t.Stats.TotalWorkouts} workouts</span>}
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700/60 flex gap-2">
                <Button size="sm" variant="secondary" className="flex-1" onClick={() => handleToggle(t._id)}>
                  {t.IsActive ? <><FiUserX className="w-3 h-3 mr-1" />Deactivate</> : <><FiUserCheck className="w-3 h-3 mr-1" />Activate</>}
                </Button>
                <Button size="sm" variant="secondary" onClick={() => handleDelete(t._id)}>
                  <FiTrash2 className="w-3 h-3" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}

export default TrainerManagement;