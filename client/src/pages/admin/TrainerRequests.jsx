import React, { useState, useEffect, useCallback } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Skeleton from '../../components/common/Skeleton';
import EmptyState from '../../components/common/EmptyState';
import Modal from '../../components/common/Modal';
import { getAllRequests, updateRequestStatus } from '../../services/trainerRequestService';
import { FiCheck, FiX, FiMessageSquare, FiClock } from 'react-icons/fi';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

function TrainerRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [reviewModal, setReviewModal] = useState(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await getAllRequests();
      setRequests(data?.data || []);
    } catch {
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchRequests(); }, [fetchRequests]);

  const handleDecision = async (status) => {
    setSaving(true);
    try {
      await updateRequestStatus(reviewModal._id, status, adminNotes);
      toast.success(`Request ${status.toLowerCase()}`);
      setReviewModal(null);
      setAdminNotes('');
      fetchRequests();
    } catch {
      toast.error('Failed to update request');
    } finally {
      setSaving(false);
    }
  };

  const filtered = statusFilter ? requests.filter(r => r.Status === statusFilter) : requests;
  const pendingCount = requests.filter(r => r.Status === 'Pending').length;

  return (
    <AdminLayout pageTitle="Trainer Requests">
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-3">
          {['', 'Pending', 'Approved', 'Rejected'].map(s => (
            <button key={s} onClick={() => setStatusFilter(s)} className={`px-3 py-1.5 text-sm rounded-lg transition ${statusFilter === s ? 'bg-violet-500 text-white' : 'bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'}`}>
              {s || 'All'} {s === 'Pending' && pendingCount > 0 && `(${pendingCount})`}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <Skeleton type="table" />
      ) : filtered.length === 0 ? (
        <Card>
          <EmptyState icon={<FiMessageSquare className="w-12 h-12" />} title="No requests" description={statusFilter ? `No ${statusFilter.toLowerCase()} requests.` : 'No trainer requests have been submitted yet.'} />
        </Card>
      ) : (
        <div className="space-y-4">
          {filtered.map((req) => (
            <Card key={req._id} className="!p-0">
              <div className="flex items-center justify-between p-5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-violet-500/10 rounded-full flex items-center justify-center overflow-hidden">
                    {req.UserId?.Profile?.ProfilePicture ? (
                      <img src={req.UserId.Profile.ProfilePicture} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-lg font-bold text-violet-500">{(req.UserId?.Profile?.Name || 'U')[0].toUpperCase()}</span>
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800 dark:text-gray-100">{req.UserId?.Profile?.Name || 'User'}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Wants <span className="font-medium text-sky-500">{req.TrainerId?.Profile?.Name || 'Trainer'}</span> as trainer
                    </p>
                    {req.message && <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 italic">"{req.message}"</p>}
                    <div className="flex items-center gap-2 mt-1">
                      <FiClock className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-gray-400">{format(new Date(req.createdAt), 'MMM dd, yyyy HH:mm')}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={req.Status === 'Approved' ? 'green' : req.Status === 'Rejected' ? 'red' : 'yellow'}>{req.Status}</Badge>
                  {req.Status === 'Pending' && (
                    <Button size="sm" variant="primary" onClick={() => setReviewModal(req)}>Review</Button>
                  )}
                </div>
              </div>
              {req.AdminNotes && (
                <div className="px-5 py-3 bg-gray-100 dark:bg-gray-900 border-t border-gray-100 dark:border-gray-700/60">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Admin notes: {req.AdminNotes}</p>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      <Modal isOpen={!!reviewModal} onClose={() => { setReviewModal(null); setAdminNotes(''); }} title="Review Request">
        {reviewModal && (
          <div className="space-y-4">
            <div className="p-4 bg-gray-100 dark:bg-gray-900 rounded-lg">
              <p className="text-sm text-gray-700 dark:text-gray-300"><span className="font-medium">User:</span> {reviewModal.UserId?.Profile?.Name}</p>
              <p className="text-sm text-gray-700 dark:text-gray-300"><span className="font-medium">Requested Trainer:</span> {reviewModal.TrainerId?.Profile?.Name}</p>
              {reviewModal.message && <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 italic">"{reviewModal.message}"</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Admin Notes</label>
              <textarea value={adminNotes} onChange={(e) => setAdminNotes(e.target.value)} rows={2} className="form-textarea w-full bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700/60 rounded-lg focus:ring-violet-500 focus:border-violet-500" placeholder="Optional notes..." />
            </div>
            <div className="flex gap-3">
              <Button variant="primary" className="flex-1" onClick={() => handleDecision('Approved')} loading={saving}><FiCheck className="w-4 h-4 mr-1" />Approve</Button>
              <Button variant="danger" className="flex-1" onClick={() => handleDecision('Rejected')} loading={saving}><FiX className="w-4 h-4 mr-1" />Reject</Button>
            </div>
          </div>
        )}
      </Modal>
    </AdminLayout>
  );
}

export default TrainerRequests;