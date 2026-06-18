import React, { useState, useEffect, useCallback } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Skeleton from '../../components/common/Skeleton';
import EmptyState from '../../components/common/EmptyState';
import { getAllFeedbacks, markFeedbackAsRead, replyToFeedback } from '../../services/feedbackService';
import { FiMessageSquare, FiCheck, FiMail, FiEye, FiSend, FiShield } from 'react-icons/fi';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

function Feedbacks() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [selected, setSelected] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [sending, setSending] = useState(false);

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

  const handleMarkRead = async (e, id) => {
    e.stopPropagation();
    try {
      await markFeedbackAsRead(id);
      toast.success('Marked as read');
      fetchFeedbacks();
    } catch {
      toast.error('Failed to update');
    }
  };

  const handleReply = async () => {
    if (!replyText.trim() || !selected) return;
    setSending(true);
    try {
      const { data } = await replyToFeedback(selected._id, replyText.trim());
      if (data.success) {
        setSelected(data.data);
        setFeedbacks(prev => prev.map(f => f._id === selected._id ? data.data : f));
        setReplyText('');
        toast.success(data.emailSent ? 'Reply sent via email!' : 'Reply saved (email not configured)');
      }
    } catch {
      toast.error('Failed to send reply');
    } finally {
      setSending(false);
    }
  };

  const handleSelect = (fb) => {
    setSelected(fb);
    setReplyText('');
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
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
          {/* Left: Feedback list */}
          <div className="xl:col-span-2 space-y-3 max-h-[calc(100vh-200px)] overflow-y-auto pr-1">
            {filtered.map((fb) => (
              <div
                key={fb._id}
                onClick={() => handleSelect(fb)}
                className={`p-4 rounded-xl cursor-pointer transition border ${selected?._id === fb._id
                  ? 'border-gray-400 dark:border-gray-500 bg-gray-100 dark:bg-gray-700/50'
                  : 'border-gray-200 dark:border-gray-700/60 bg-gray-50 dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600'
                } ${!fb.IsRead ? 'border-l-4 border-l-blue-500' : ''}`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${!fb.IsRead ? 'bg-blue-500/10 text-blue-500' : 'bg-gray-100 dark:bg-gray-700 text-gray-400'}`}>
                    {!fb.IsRead ? <FiMail className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="font-medium text-sm text-gray-800 dark:text-gray-100 truncate">{fb.Name || 'User'}</p>
                      {!fb.IsRead && <Badge variant="blue">New</Badge>}
                      {fb.Replies?.length > 0 && (
                        <span className="text-xs bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-1.5 py-0.5 rounded-full">{fb.Replies.length}</span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">{fb.Message}</p>
                    <div className="flex items-center justify-between mt-1.5">
                      <span className="text-xs text-gray-400 dark:text-gray-500">{format(new Date(fb.createdAt), 'MMM dd, HH:mm')}</span>
                      {!fb.IsRead && (
                        <button onClick={(e) => handleMarkRead(e, fb._id)} className="text-xs text-blue-500 hover:text-blue-600 dark:text-blue-400">
                          <FiCheck className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right: Detail + Replies */}
          <div className="xl:col-span-3">
            {!selected ? (
              <Card>
                <EmptyState icon={<FiMessageSquare className="w-10 h-10" />} title="Select a feedback" description="Click on a feedback to view details and reply." />
              </Card>
            ) : (
              <Card className="!p-0">
                {/* Feedback Detail */}
                <div className="p-5 border-b border-gray-200 dark:border-gray-700/60">
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${!selected.IsRead ? 'bg-violet-500/10 text-violet-500' : 'bg-gray-100 dark:bg-gray-700 text-gray-400'}`}>
                      {!selected.IsRead ? <FiMail className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium text-gray-800 dark:text-gray-100">{selected.Name || 'User'}</p>
                        {!selected.IsRead && <Badge variant="violet">New</Badge>}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{selected.Message}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-xs text-gray-400">{selected.Email}</span>
                        <span className="text-xs text-gray-400">{format(new Date(selected.createdAt), 'MMM dd, yyyy HH:mm')}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Replies */}
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <FiShield className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                      Replies ({selected.Replies?.length || 0})
                    </h3>
                  </div>

                  {selected.Replies?.length > 0 ? (
                    <div className="space-y-3 mb-5">
                      {selected.Replies.map((reply) => (
                        <div key={reply._id} className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/60 rounded-lg p-3.5">
                          <div className="flex items-center gap-2 mb-1.5">
                            <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                              <FiShield className="w-3 h-3 text-gray-500 dark:text-gray-400" />
                            </div>
                            <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">FitTrack Pro</span>
                            <span className="text-xs text-gray-400 dark:text-gray-500">{format(new Date(reply.createdAt), 'MMM dd, yyyy HH:mm')}</span>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{reply.Message}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400 dark:text-gray-500 mb-5">No replies yet. Send the first reply below.</p>
                  )}

                  {/* Reply Form */}
                  <div className="border-t border-gray-200 dark:border-gray-700/60 pt-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Reply as FitTrack Pro</label>
                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Type your reply... It will be sent to the user's email as FitTrack Pro."
                      rows={3}
                      maxLength={2000}
                      className="form-textarea w-full !bg-gray-50 dark:!bg-gray-800 dark:text-gray-100 border-gray-200 dark:border-gray-700/60 rounded-lg focus:ring-0 focus:border-gray-300 dark:focus:border-gray-600 transition text-sm"
                    />
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-gray-400 dark:text-gray-500">{replyText.length}/2000</span>
                      <Button
                        size="sm"
                        onClick={handleReply}
                        loading={sending}
                        disabled={!replyText.trim()}
                        icon={<FiSend className="w-3.5 h-3.5" />}
                      >
                        Send Reply
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

export default Feedbacks;