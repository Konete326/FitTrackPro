import React, { useState, useEffect, useCallback, useMemo } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Badge from '../../components/common/Badge';
import Skeleton from '../../components/common/Skeleton';
import Modal from '../../components/common/Modal';
import ConfirmModal from '../../components/common/ConfirmModal';
import Pagination from '../../components/common/Pagination';
import { useValidation, validators, hints } from '../../hooks/useValidation';
import { getAllUsers, createUser, toggleUserActive, deleteUser, assignTrainer } from '../../services/adminService';
import { getAvailableTrainers } from '../../services/trainerRequestService';
import { useAuth } from '../../contexts/AuthContext';
import { FiPlus, FiSearch, FiTrash2, FiUserCheck, FiUserX, FiEdit2 } from 'react-icons/fi';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

// Check if user is online (currently logged in OR logged in within last 10 minutes)
const isUserOnline = (user, currentUserId) => {
  if (!currentUserId) return false;
  if (String(user._id) === String(currentUserId)) return true;
  if (!user.LastLogin) return false;
  const lastLoginTime = new Date(user.LastLogin).getTime();
  const tenMinutesAgo = Date.now() - 10 * 60 * 1000;
  return lastLoginTime > tenMinutesAgo;
};

function UserManagement() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [toggleId, setToggleId] = useState(null);
  const [assignModal, setAssignModal] = useState(null);
  const [trainers, setTrainers] = useState([]);
  const [selectedTrainer, setSelectedTrainer] = useState('');
  const [saving, setSaving] = useState(false);
  const [createForm, setCreateForm] = useState({ Username: '', Email: '', Password: '', Role: 'User', 'Profile.Name': '' });

  const createRules = useMemo(() => ({
    'Profile.Name': [(v) => validators.required(v, 'Full name'), (v) => validators.name(v, 'Full name')],
    Username: [(v) => validators.required(v, 'Username'), (v) => validators.username(v)],
    Email: [(v) => validators.required(v, 'Email'), (v) => validators.email(v)],
    Password: [(v) => validators.required(v, 'Password'), (v) => validators.password(v)],
  }), []);
  const { errors: createErrors, handleChange: createHandleChange, handleBlur: createHandleBlur, validateAll: createValidateAll } = useValidation(createRules);

  const updateCreateField = (name, value) => {
    setCreateForm({ ...createForm, [name]: value });
    createHandleChange(name, value);
  };

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 15 };
      if (search) params.search = search;
      if (roleFilter) params.role = roleFilter;
      if (statusFilter) params.isActive = statusFilter;
      const { data } = await getAllUsers(params);
      setUsers(data?.data || []);
      setTotal(data?.total || 0);
    } catch {
    } finally {
      setLoading(false);
    }
  }, [page, search, roleFilter, statusFilter]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const fetchTrainers = async () => {
    try {
      const { data } = await getAvailableTrainers();
      setTrainers(data?.data || []);
    } catch {}
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!createValidateAll(createForm)) return;
    setSaving(true);
    try {
      const payload = { ...createForm, Profile: { Name: createForm['Profile.Name'] } };
      delete payload['Profile.Name'];
      await createUser(payload);
      toast.success('User created');
      setShowCreate(false);
      setCreateForm({ Username: '', Email: '', Password: '', Role: 'User', 'Profile.Name': '' });
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create user');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async () => {
    try {
      await toggleUserActive(toggleId);
      toast.success('User status toggled');
      setToggleId(null);
      fetchUsers();
    } catch {
      toast.error('Failed to toggle');
    }
  };

  const handleDelete = async () => {
    try {
      await deleteUser(deleteId);
      toast.success('User deleted');
      setDeleteId(null);
      fetchUsers();
    } catch {
      toast.error('Failed to delete');
    }
  };

  const handleAssignTrainer = async () => {
    if (!selectedTrainer) { toast.error('Select a trainer'); return; }
    setSaving(true);
    try {
      await assignTrainer(assignModal, selectedTrainer);
      toast.success('Trainer assigned');
      setAssignModal(null);
      setSelectedTrainer('');
      fetchUsers();
    } catch {
      toast.error('Failed to assign');
    } finally {
      setSaving(false);
    }
  };

  const openAssign = (userId) => {
    fetchTrainers();
    setAssignModal(userId);
    setSelectedTrainer('');
  };

  const totalPages = Math.ceil(total / 15);

  return (
    <AdminLayout pageTitle="User Management">
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 mb-6">
        <div className="sm:col-span-6 relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Search users..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="form-input pl-10 w-full bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700/60 rounded-lg" />
        </div>
        <div className="sm:col-span-2">
          <Select value={roleFilter} onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }} options={[{ value: '', label: 'All Roles' }, { value: 'User', label: 'User' }, { value: 'Trainer', label: 'Trainer' }, { value: 'Admin', label: 'Admin' }]} className="w-full" />
        </div>
        <div className="sm:col-span-2">
          <Select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }} options={[{ value: '', label: 'All Status' }, { value: 'true', label: 'Active' }, { value: 'false', label: 'Inactive' }]} className="w-full" />
        </div>
        <div className="sm:col-span-2 flex sm:justify-end">
          <Button variant="primary" icon={<FiPlus className="w-4 h-4" />} onClick={() => setShowCreate(true)}>Create User</Button>
        </div>
      </div>

      {loading ? (
        <Skeleton type="table" />
      ) : (
        <Card className="!p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-700/60">
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">User</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Role</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Status</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Joined</th>
                  <th className="px-5 py-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700/60">
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-gray-50 dark:hover:bg-gray-900 transition">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative shrink-0">
                          <div className="w-8 h-8 rounded-full bg-violet-500/10 flex items-center justify-center overflow-hidden">
                            {u.Profile?.ProfilePicture ? <img src={u.Profile.ProfilePicture} alt="" className="w-full h-full object-cover" /> : <span className="text-xs font-bold text-violet-500">{(u.Profile?.Name || u.Username || 'U')[0].toUpperCase()}</span>}
                          </div>
                          <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 border-2 border-white dark:border-gray-900 rounded-full ${isUserOnline(u, currentUser?._id) ? 'bg-green-500' : 'bg-red-500'}`} />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-800 dark:text-gray-100">{u.Profile?.Name || u.Username}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{u.Email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <Badge variant={u.Role === 'Admin' ? 'red' : u.Role === 'Trainer' ? 'sky' : 'violet'}>{u.Role}</Badge>
                    </td>
                    <td className="px-5 py-3">
                      <Badge variant={u.IsActive ? 'green' : 'red'}>{u.IsActive ? 'Active' : 'Inactive'}</Badge>
                    </td>
                    <td className="px-5 py-3 text-sm text-gray-500 dark:text-gray-400">{format(new Date(u.createdAt), 'MMM dd, yyyy')}</td>
                    <td className="px-5 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {u.Role === 'User' && (
                          <button onClick={() => openAssign(u._id)} className="text-gray-400 hover:text-violet-500 transition" title="Assign Trainer"><FiUserCheck className="w-4 h-4" /></button>
                        )}
                        {currentUser?._id !== u._id && (
                          <>
                            <button onClick={() => setToggleId(u._id)} className="text-gray-400 hover:text-yellow-500 transition" title="Toggle Active">
                              {u.IsActive ? <FiUserX className="w-4 h-4" /> : <FiUserCheck className="w-4 h-4" />}
                            </button>
                            <button onClick={() => setDeleteId(u._id)} className="text-gray-400 hover:text-red-500 transition" title="Delete"><FiTrash2 className="w-4 h-4" /></button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {totalPages > 1 && (
            <div className="p-4 border-t border-gray-100 dark:border-gray-700/60">
              <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
            </div>
          )}
          <div className="px-5 py-3 border-t border-gray-100 dark:border-gray-700/60">
            <p className="text-xs text-gray-500 dark:text-gray-400">Showing {users.length} of {total} users</p>
          </div>
        </Card>
      )}

      <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="Create User">
        <form onSubmit={handleCreate} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Full Name" value={createForm['Profile.Name']} onChange={(e) => updateCreateField('Profile.Name', e.target.value)} onBlur={(e) => createHandleBlur('Profile.Name', e.target.value)} error={createErrors['Profile.Name']} helperText={hints.name} required />
            <Input label="Username" value={createForm.Username} onChange={(e) => updateCreateField('Username', e.target.value)} onBlur={(e) => createHandleBlur('Username', e.target.value)} error={createErrors.Username} helperText={hints.username} required />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Email" type="email" value={createForm.Email} onChange={(e) => updateCreateField('Email', e.target.value)} onBlur={(e) => createHandleBlur('Email', e.target.value)} error={createErrors.Email} helperText={hints.email} required />
            <Input label="Password" type="password" value={createForm.Password} onChange={(e) => updateCreateField('Password', e.target.value)} onBlur={(e) => createHandleBlur('Password', e.target.value)} error={createErrors.Password} helperText={hints.password} required />
          </div>
          <Select label="Role" value={createForm.Role} onChange={(e) => setCreateForm({ ...createForm, Role: e.target.value })} options={[{ value: 'User', label: 'User' }, { value: 'Trainer', label: 'Trainer' }, { value: 'Admin', label: 'Admin' }]} />
          <div className="flex gap-3 pt-2">
            <Button type="submit" variant="primary" className="flex-1" loading={saving}>Create User</Button>
            <Button type="button" variant="secondary" onClick={() => setShowCreate(false)}>Cancel</Button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={!!assignModal} onClose={() => setAssignModal(null)} title="Assign Trainer">
        <div className="space-y-4">
          <Select label="Select Trainer" value={selectedTrainer} onChange={(e) => setSelectedTrainer(e.target.value)} options={[{ value: '', label: 'Choose trainer...' }, ...trainers.map(t => ({ value: t._id, label: t.Profile?.Name || t.Username }))]} />
          <div className="flex gap-3">
            <Button variant="primary" className="flex-1" onClick={handleAssignTrainer} loading={saving}>Assign</Button>
            <Button variant="secondary" onClick={() => setAssignModal(null)}>Cancel</Button>
          </div>
        </div>
      </Modal>

      <ConfirmModal isOpen={!!toggleId} onClose={() => setToggleId(null)} onConfirm={handleToggleActive} title="Toggle User Status" message="Are you sure you want to toggle this user's active status?" />
      <ConfirmModal isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} title="Delete User" message="This will permanently delete the user and all their data. This action cannot be undone." />
    </AdminLayout>
  );
}

export default UserManagement;