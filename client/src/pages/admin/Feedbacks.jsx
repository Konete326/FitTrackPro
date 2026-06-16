import React, { useState, useEffect, useCallback } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Skeleton from '../../components/common/Skeleton';
import EmptyState from '../../components/common/EmptyState';
import { getAllFeedbacks, markFeedbackAsRead } from '../../services/feedbackService';
import { FiMessageSquare, FiCheck, FiMail, FiEye } from 'react-icons/fi';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

function Feedbacks() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  const fetchFeedbacks = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await getAllFeedbacks();
      setFeedbacks(data?.data || []);
    } catch {
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchFeedbacks(); }, [fetchFeedbacks]);

  const handleMarkRead = async (id) => {
    try {
      await markFeedbackAsRead(id);
      toast.success('Marked as read');
      fetchFeedbacks();
    } catch {
      toast.error('Failed to update');
    }
  };

  const filtered = filter === 'unread' ? feedbacks.filter(f => !f.IsRead) : filter === 'read' ? feedbacks.filter(f => f.IsRead) : feedbacks;
  const unreadCount = feedbacks.filter(f => !f.IsRead).length;

  return (
    <AdminLayout pageTitle="Feedbacks">
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-3">
          {['', 'unread', 'read'].map(s => (
            <button key={s} onClick={() => setFilter(s)} className={`px-3 py-1.5 text-sm rounded-lg transition ${filter === s ? 'bg-violet-500 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'}`}>
              {s ? s.charAt(0).toUpperCase() + s.slice(1) : 'All'} {s === 'unread' && unreadCount > 0 && `(${unreadCount})`}
            </button>
          ))}
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">{feedbacks.length} total</p>
      </div>

      {loading ? (
        <div className="space-y-4">{[...Array(3)].map((_, i) => <Skeleton key={i} type="card" />)}</div>
      ) : filtered.length === 0 ? (
        <Card>
          <EmptyState icon={<FiMessageSquare className="w-12 h-12" />} title="No feedback" description={filter ? `No ${filter} feedback.` : 'No feedback submissions yet.'} />
        </Card>
      ) : (
        <div className="space-y-4">
          {filtered.map((fb) => (
            <Card key={fb._id} className={`!p-0 ${!fb.IsRead ? 'border-l-4 border-l-violet-500' : ''}`}>
              <div className="flex items-start justify-between p-5">
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${!fb.IsRead ? 'bg-violet-500/10 text-violet-500' : 'bg-gray-100 dark:bg-gray-700 text-gray-400'}`}>
                    {!fb.IsRead ? <FiMail className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-gray-800 dark:text-gray-100">{fb.Name || fb.UserId?.Profile?.Name || 'User'}</p>
                      {!fb.IsRead && <Badge variant="violet">New</Badge>}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{fb.message || fb.Message}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-xs text-gray-400">{fb.Email || fb.UserId?.Email}</span>
                      <span className="text-xs text-gray-400">{format(new Date(fb.createdAt), 'MMM dd, yyyy HH:mm')}</span>
                    </div>
                  </div>
                </div>
                {!fb.IsRead && (
                  <Button size="sm" variant="secondary" onClick={() => handleMarkRead(fb._id)}>
                    <FiCheck className="w-3 h-3 mr-1" /> Mark Read
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}

export default Feedbacks;