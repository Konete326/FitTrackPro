import React, { useState, useEffect, useCallback } from 'react';
import TrainerLayout from '../../layouts/TrainerLayout';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Skeleton from '../../components/common/Skeleton';
import EmptyState from '../../components/common/EmptyState';
import ConfirmModal from '../../components/common/ConfirmModal';
import { getClients, removeClient } from '../../services/trainerService';
import { useNavigate } from 'react-router-dom';
import { FiUsers, FiSearch, FiUserX } from 'react-icons/fi';
import toast from 'react-hot-toast';

function MyClients() {
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [removeId, setRemoveId] = useState(null);

  const fetchClients = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await getClients();
      setClients(data?.data || []);
    } catch {
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchClients(); }, [fetchClients]);

  const handleRemove = async () => {
    try {
      await removeClient(removeId);
      toast.success('Client removed');
      setRemoveId(null);
      fetchClients();
    } catch {
      toast.error('Failed to remove client');
    }
  };

  const filtered = clients.filter(c => {
    const name = (c.Profile?.Name || c.Username || '').toLowerCase();
    return name.includes(search.toLowerCase());
  });

  return (
    <TrainerLayout pageTitle="My Clients">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search clients..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-input pl-10 w-full sm:w-72 bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700/60 rounded-lg focus:ring-violet-500 focus:border-violet-500"
          />
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">{clients.length} client{clients.length !== 1 ? 's' : ''}</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => <Skeleton key={i} type="card" />)}
        </div>
      ) : filtered.length === 0 ? (
        <Card>
          <EmptyState
            icon={<FiUsers className="w-12 h-12" />}
            title={search ? 'No clients match your search' : 'No clients assigned'}
            description={search ? 'Try a different search term.' : 'Clients will appear here once assigned by admin.'}
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((client) => (
            <Card key={client._id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate(`/trainer/clients/${client._id}`)}>
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-full bg-violet-500/10 flex items-center justify-center overflow-hidden shrink-0">
                  {client.Profile?.ProfilePicture ? (
                    <img src={client.Profile.ProfilePicture} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xl font-bold text-violet-500">{(client.Profile?.Name || client.Username || 'U')[0].toUpperCase()}</span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-gray-800 dark:text-gray-100 truncate">{client.Profile?.Name || client.Username}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">@{client.Username}</p>
                  <div className="flex items-center gap-2 mt-2">
                    {client.Profile?.FitnessLevel && <Badge variant="sky">{client.Profile.FitnessLevel}</Badge>}
                    <Badge variant={client.IsActive ? 'green' : 'red'}>{client.IsActive ? 'Active' : 'Inactive'}</Badge>
                  </div>
                  {(client.Profile?.Height || client.Profile?.Weight) && (
                    <div className="flex gap-3 mt-2 text-xs text-gray-500 dark:text-gray-400">
                      {client.Profile.Height && <span>{client.Profile.Height} cm</span>}
                      {client.Profile.Weight && <span>{client.Profile.Weight} kg</span>}
                      {client.Profile.Age && <span>{client.Profile.Age} yrs</span>}
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700/60 flex gap-2">
                <Button size="sm" variant="primary" className="flex-1" onClick={(e) => { e.stopPropagation(); navigate(`/trainer/clients/${client._id}`); }}>
                  View Details
                </Button>
                <Button size="sm" variant="secondary" onClick={(e) => { e.stopPropagation(); setRemoveId(client._id); }}>
                  <FiUserX className="w-3 h-3" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <ConfirmModal
        isOpen={!!removeId}
        onClose={() => setRemoveId(null)}
        onConfirm={handleRemove}
        title="Remove Client"
        message="Are you sure you want to remove this client from your roster?"
      />
    </TrainerLayout>
  );
}

export default MyClients;
