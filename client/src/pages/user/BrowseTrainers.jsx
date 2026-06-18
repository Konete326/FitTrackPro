import React, { useState, useEffect, useCallback } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import PageHeader from '../../components/common/PageHeader';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Skeleton from '../../components/common/Skeleton';
import EmptyState from '../../components/common/EmptyState';
import ConfirmModal from '../../components/common/ConfirmModal';
import Modal from '../../components/common/Modal';
import TrainerCard from '../../components/TrainerCard';
import { getAvailableTrainers, createRequest, getMyRequests, removeTrainer } from '../../services/trainerRequestService';
import { getTrainerPublicProfile } from '../../services/trainerService';
import { useAuth } from '../../contexts/AuthContext';
import { FiUsers, FiSend, FiCheck, FiClock, FiX, FiMessageSquare, FiAward, FiBriefcase, FiTarget, FiImage, FiTrash2 } from 'react-icons/fi';
import toast from 'react-hot-toast';

function BrowseTrainers() {
  const { user, loadUser } = useAuth();
  const [trainers, setTrainers] = useState([]);
  const [myRequests, setMyRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedTrainerProfile, setSelectedTrainerProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [trainersRes, requestsRes] = await Promise.allSettled([
        getAvailableTrainers(),
        getMyRequests(),
      ]);
      if (trainersRes.status === 'fulfilled') setTrainers(trainersRes.value.data?.data || []);
      if (requestsRes.status === 'fulfilled') setMyRequests(requestsRes.value.data?.data || []);
    } catch {
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const openRequest = (trainer) => {
    setSelectedTrainer(trainer);
    setMessage('');
    setShowModal(true);
  };

  const handleSendRequest = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      await createRequest(selectedTrainer._id, message);
      toast.success('Request sent!');
      setShowModal(false);
      fetchData();
    } catch {
      toast.error('Failed to send request');
    } finally {
      setSending(false);
    }
  };

  const getRequestStatus = (trainerId) => {
    const req = myRequests.find(r => r.TrainerId?._id === trainerId || r.TrainerId === trainerId);
    return req?.Status || null;
  };

  const openTrainerProfile = async (trainer) => {
    setProfileLoading(true);
    setSelectedTrainerProfile(trainer);
    try {
      const res = await getTrainerPublicProfile(trainer._id);
      if (res.data?.success) {
        setSelectedTrainerProfile(res.data.data);
      }
    } catch {
      toast.error('Failed to load trainer profile');
    } finally {
      setProfileLoading(false);
    }
  };

  const currentTrainer = user?.TrainerId;
  const assignedTrainer = trainers.find(t => t._id === currentTrainer);

  const handleRemoveTrainer = async () => {
    try {
      await removeTrainer();
      await loadUser();
      toast.success('Trainer removed');
      setShowRemoveConfirm(false);
      fetchData();
    } catch {
      toast.error('Failed to remove trainer');
    }
  };

  const filteredTrainers = trainers.filter(t => {
    const name = (t.Profile?.Name || t.Username || '').toLowerCase();
    return name.includes(search.toLowerCase());
  });

  return (
    <DashboardLayout>
      <PageHeader title="Browse Trainers" description="Find and connect with a personal trainer" />

      {currentTrainer && assignedTrainer && (
        <Card className="mb-6 border-green-200 dark:border-green-800/40 bg-green-50 dark:bg-green-900/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-500 text-white rounded-full flex items-center justify-center shrink-0">
                <FiCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="font-medium text-green-700 dark:text-green-400">Assigned Trainer: {assignedTrainer.Profile?.Name || assignedTrainer.Username}</p>
                <p className="text-sm text-green-600 dark:text-green-500">@{assignedTrainer.Username}{assignedTrainer.Profile?.Specialties?.length > 0 ? ` • ${assignedTrainer.Profile.Specialties.slice(0, 2).join(', ')}` : ''}</p>
              </div>
            </div>
            <Button variant="secondary" className="!py-1.5 !px-3 !text-xs text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20" onClick={() => setShowRemoveConfirm(true)}>
              <FiTrash2 className="w-3.5 h-3.5 mr-1" /> Remove
            </Button>
          </div>
        </Card>
      )}

      {myRequests.length > 0 && (
        <Card className="!p-0 mb-6">
          <Card.Header>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">My Requests</h3>
          </Card.Header>
          <div className="divide-y divide-gray-100 dark:divide-gray-700/60">
            {myRequests.map((req) => (
              <div key={req._id} className="flex items-center justify-between px-5 py-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-violet-500/10 text-violet-500 rounded-full flex items-center justify-center">
                    <FiUsers className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-100">{req.TrainerId?.Profile?.Name || req.TrainerId?.Username || 'Trainer'}</p>
                    {req.Message && <p className="text-xs text-gray-500 dark:text-gray-400">{req.Message}</p>}
                  </div>
                </div>
                <Badge
                  variant={req.Status === 'Approved' ? 'green' : req.Status === 'Rejected' ? 'red' : 'yellow'}
                >
                  {req.Status}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      )}

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search trainers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="form-input w-full bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700/60 rounded-lg focus:ring-violet-500 focus:border-violet-500"
        />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => <Skeleton key={i} type="card" />)}
        </div>
      ) : filteredTrainers.length === 0 ? (
        <Card>
          <EmptyState
            icon={<FiUsers className="w-12 h-12" />}
            title="No trainers available"
            description="No trainers match your search. Check back later!"
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTrainers.map((trainer) => (
            <TrainerCard
              key={trainer._id}
              trainer={trainer}
              isAssigned={currentTrainer === trainer._id}
              requestStatus={getRequestStatus(trainer._id)}
              onSendRequest={() => openRequest(trainer)}
              onViewProfile={() => openTrainerProfile(trainer)}
              onRemove={() => setShowRemoveConfirm(true)}
            />
          ))}
        </div>
      )}

      <ConfirmModal isOpen={showRemoveConfirm} onClose={() => setShowRemoveConfirm(false)} onConfirm={handleRemoveTrainer} title="Remove Trainer" message="Are you sure you want to remove your assigned trainer? You can request a new trainer anytime." />

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={`Request ${selectedTrainer?.Profile?.Name || selectedTrainer?.Username || 'Trainer'}`}>
        <form onSubmit={handleSendRequest} className="space-y-4">
          <div className="flex items-center gap-3 p-3 bg-gray-100 dark:bg-gray-900 rounded-lg">
            <div className="w-12 h-12 rounded-full bg-violet-500/10 flex items-center justify-center overflow-hidden shrink-0">
              {selectedTrainer?.Profile?.ProfilePicture ? (
                <img src={selectedTrainer.Profile.ProfilePicture} alt="" className="w-full h-full object-cover" />
              ) : (
                <span className="text-lg font-bold text-violet-500">{(selectedTrainer?.Profile?.Name || 'T')[0].toUpperCase()}</span>
              )}
            </div>
            <div>
              <p className="font-medium text-gray-800 dark:text-gray-100">{selectedTrainer?.Profile?.Name || selectedTrainer?.Username}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">@{selectedTrainer?.Username}</p>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Message (optional)</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              className="form-textarea w-full bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700/60 rounded-lg focus:ring-violet-500 focus:border-violet-500"
              placeholder="Tell the trainer why you'd like to work with them..."
            />
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="submit" variant="primary" className="flex-1" loading={sending}>
              <FiSend className="w-4 h-4 mr-1" /> Send Request
            </Button>
            <Button type="button" variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
          </div>
        </form>
      </Modal>

      {/* Trainer Profile Modal */}
      <Modal isOpen={!!selectedTrainerProfile} onClose={() => setSelectedTrainerProfile(null)} title="" size="lg" className="!p-0">
        {profileLoading ? (
          <div className="p-8 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full mx-auto mb-3"></div>
            <p className="text-gray-500">Loading profile...</p>
          </div>
        ) : selectedTrainerProfile && (
          <div className="-mt-4">
            {/* Background Image */}
            <div className="relative h-40 bg-gradient-to-r from-violet-500 to-purple-600 rounded-t-xl overflow-hidden">
              {selectedTrainerProfile.Profile?.BackgroundImage && (
                <img src={selectedTrainerProfile.Profile.BackgroundImage} alt="Cover" className="w-full h-full object-cover" />
              )}
            </div>
            {/* Profile Info */}
            <div className="px-6 pb-6 -mt-10">
              <div className="flex items-end gap-4 mb-4">
                <div className="w-20 h-20 rounded-xl bg-violet-500/10 flex items-center justify-center overflow-hidden ring-4 ring-white dark:ring-gray-800">
                  {selectedTrainerProfile.Profile?.ProfilePicture ? (
                    <img src={selectedTrainerProfile.Profile.ProfilePicture} alt={selectedTrainerProfile.Profile?.Name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-2xl font-bold text-violet-500">{(selectedTrainerProfile.Profile?.Name || 'T')[0].toUpperCase()}</span>
                  )}
                </div>
                <div className="flex-1 pb-1">
                  <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">{selectedTrainerProfile.Profile?.Name || selectedTrainerProfile.Username}</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">@{selectedTrainerProfile.Username}</p>
                </div>
              </div>

              {/* Bio */}
              {selectedTrainerProfile.Profile?.Bio && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{selectedTrainerProfile.Profile.Bio}</p>
              )}

              {/* Stats */}
              <div className="flex gap-4 mb-4 text-sm">
                {selectedTrainerProfile.Profile?.Experience > 0 && (
                  <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                    <FiBriefcase className="w-4 h-4" />
                    <span>{selectedTrainerProfile.Profile.Experience} years experience</span>
                  </div>
                )}
              </div>

              {/* Specialties */}
              {selectedTrainerProfile.Profile?.Specialties?.length > 0 && (
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <FiTarget className="w-4 h-4 text-violet-500" />
                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Specialties</h4>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedTrainerProfile.Profile.Specialties.map((s) => (
                      <Badge key={s} variant="violet">{s}</Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Services */}
              {selectedTrainerProfile.Profile?.Services?.length > 0 && (
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <FiBriefcase className="w-4 h-4 text-sky-500" />
                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Services</h4>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedTrainerProfile.Profile.Services.map((s) => (
                      <Badge key={s} variant="sky">{s}</Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Certifications */}
              {selectedTrainerProfile.Profile?.Certifications?.length > 0 && (
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <FiAward className="w-4 h-4 text-amber-500" />
                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Certifications</h4>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedTrainerProfile.Profile.Certifications.map((c) => (
                      <Badge key={c} variant="amber">{c}</Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Gallery */}
              {selectedTrainerProfile.Profile?.Gallery?.length > 0 && (
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <FiImage className="w-4 h-4 text-green-500" />
                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Gallery</h4>
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {selectedTrainerProfile.Profile.Gallery.map((img, idx) => (
                      <div key={idx} className="aspect-square rounded-lg overflow-hidden">
                        <img src={img} alt={`Work ${idx + 1}`} className="w-full h-full object-cover hover:scale-110 transition-transform" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Button */}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                {currentTrainer === selectedTrainerProfile._id ? (
                  <div className="space-y-2">
                    <Badge variant="green" className="w-full justify-center py-2">Your Trainer</Badge>
                    <button onClick={() => { setSelectedTrainerProfile(null); setShowRemoveConfirm(true); }} className="w-full text-xs text-red-500 hover:text-red-600 flex items-center justify-center gap-1 py-1">
                      <FiTrash2 className="w-3 h-3" /> Remove trainer
                    </button>
                  </div>
                ) : (
                  <Button variant="primary" className="w-full" onClick={() => { setSelectedTrainerProfile(null); openRequest(selectedTrainerProfile); }}>
                    <FiSend className="w-4 h-4 mr-1" /> Send Request
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </DashboardLayout>
  );
}

export default BrowseTrainers;