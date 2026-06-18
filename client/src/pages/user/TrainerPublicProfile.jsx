import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import { getTrainerPublicProfile } from '../../services/trainerService';
import { createRequest, removeTrainer } from '../../services/trainerRequestService';
import { useAuth } from '../../contexts/AuthContext';
import { FiArrowLeft, FiSend, FiCheck, FiTrash2, FiTarget, FiBriefcase, FiAward, FiImage, FiMapPin, FiStar, FiClock, FiUsers } from 'react-icons/fi';
import { motion, useInView } from 'framer-motion';
import toast from 'react-hot-toast';

function AnimatedImage({ src, alt, ratio, index }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const [loaded, setLoaded] = useState(false);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className="rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-900"
      style={{ aspectRatio: ratio }}
    >
      <img
        src={src}
        alt={alt}
        className={`w-full h-full object-cover transition-opacity duration-700 ${loaded ? 'opacity-100' : 'opacity-0'}`}
        onLoad={() => setLoaded(true)}
        loading="lazy"
      />
    </motion.div>
  );
}

function TrainerPublicProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, loadUser } = useAuth();
  const [trainer, setTrainer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);
  const [lightboxImage, setLightboxImage] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const res = await getTrainerPublicProfile(id);
        if (res.data?.success) {
          setTrainer(res.data.data);
        } else {
          toast.error('Trainer not found');
          navigate('/browse-trainers');
        }
      } catch {
        toast.error('Failed to load trainer profile');
        navigate('/browse-trainers');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id, navigate]);

  const handleSendRequest = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      await createRequest(id, message);
      toast.success('Request sent!');
      setShowRequestModal(false);
      setMessage('');
    } catch {
      toast.error('Failed to send request');
    } finally {
      setSending(false);
    }
  };

  const handleRemoveTrainer = async () => {
    try {
      await removeTrainer();
      await loadUser();
      toast.success('Trainer removed');
      setShowRemoveConfirm(false);
    } catch {
      toast.error('Failed to remove trainer');
    }
  };

  const isAssigned = user?.TrainerId === id;

  const galleryImages = trainer?.Profile?.Gallery || [];
  const galleryColumns = [[], [], []];
  galleryImages.forEach((img, idx) => {
    const col = idx % 3;
    const isPortrait = idx % 2 === 0;
    galleryColumns[col].push({ src: img, ratio: isPortrait ? 3 / 4 : 4 / 3, index: idx });
  });

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin w-10 h-10 border-4 border-violet-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-500 dark:text-gray-400">Loading profile...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!trainer) return null;

  const name = trainer.Profile?.Name || trainer.Username || 'Trainer';
  const bio = trainer.Profile?.Bio || 'Professional fitness trainer';
  const image = trainer.Profile?.ProfilePicture;
  const bgImage = trainer.Profile?.BackgroundImage;
  const experience = trainer.Profile?.Experience || 0;
  const specialties = trainer.Profile?.Specialties || [];
  const services = trainer.Profile?.Services || [];
  const certifications = trainer.Profile?.Certifications || [];

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 mb-6 transition"
        >
          <FiArrowLeft className="w-4 h-4" /> Back
        </button>

        <Card className="!p-0 overflow-hidden mb-6">
          <div className="relative h-48 sm:h-64 bg-gradient-to-r from-violet-500 to-purple-600">
            {bgImage && (
              <img src={bgImage} alt="Cover" className="w-full h-full object-cover" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          </div>

          <div className="px-6 sm:px-8 pb-6 -mt-16 relative">
            <div className="flex flex-col sm:flex-row sm:items-end gap-4 mb-6">
              <div className="w-28 h-28 rounded-2xl bg-white dark:bg-gray-900 flex items-center justify-center overflow-hidden ring-4 ring-white dark:ring-gray-800 shadow-lg">
                {image ? (
                  <img src={image} alt={name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-3xl font-bold text-violet-500">{name[0].toUpperCase()}</span>
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{name}</h1>
                  {specialties.length > 0 && (
                    <span className="w-5 h-5 rounded-full bg-green-500 text-white flex items-center justify-center">
                      <FiCheck className="w-3 h-3" />
                    </span>
                  )}
                </div>
                <p className="text-gray-500 dark:text-gray-400">@{trainer.Username}</p>
              </div>
              <div className="flex gap-2">
                {isAssigned ? (
                  <div className="flex gap-2">
                    <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-green-500/10 text-green-600 dark:text-green-400 font-medium text-sm border border-green-500/20">
                      <FiCheck className="w-4 h-4" /> Your Trainer
                    </span>
                    <Button variant="secondary" size="sm" className="text-red-500 hover:text-red-600" onClick={() => setShowRemoveConfirm(true)}>
                      <FiTrash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <Button variant="primary" onClick={() => setShowRequestModal(true)}>
                    <FiSend className="w-4 h-4 mr-1.5" /> Send Request
                  </Button>
                )}
              </div>
            </div>

            <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">{bio}</p>

            <div className="flex flex-wrap gap-4 mb-6">
              {experience > 0 && (
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-900 px-3 py-1.5 rounded-lg">
                  <FiBriefcase className="w-4 h-4 text-violet-500" />
                  <span>{experience} years experience</span>
                </div>
              )}
              {trainer.Stats?.TotalClients > 0 && (
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-900 px-3 py-1.5 rounded-lg">
                  <FiUsers className="w-4 h-4 text-blue-500" />
                  <span>{trainer.Stats.TotalClients} clients</span>
                </div>
              )}
              {trainer.Stats?.TotalWorkouts > 0 && (
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-900 px-3 py-1.5 rounded-lg">
                  <FiTarget className="w-4 h-4 text-green-500" />
                  <span>{trainer.Stats.TotalWorkouts} workouts</span>
                </div>
              )}
            </div>

            {specialties.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <FiTarget className="w-4 h-4 text-violet-500" />
                  <h3 className="font-semibold text-gray-800 dark:text-gray-100">Specialties</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {specialties.map((s) => (
                    <Badge key={s} variant="violet" size="lg">{s}</Badge>
                  ))}
                </div>
              </div>
            )}

            {services.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <FiBriefcase className="w-4 h-4 text-sky-500" />
                  <h3 className="font-semibold text-gray-800 dark:text-gray-100">Services</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {services.map((s) => (
                    <Badge key={s} variant="info" size="lg">{s}</Badge>
                  ))}
                </div>
              </div>
            )}

            {certifications.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <FiAward className="w-4 h-4 text-amber-500" />
                  <h3 className="font-semibold text-gray-800 dark:text-gray-100">Certifications</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {certifications.map((c) => (
                    <Badge key={c} variant="warning" size="lg">{c}</Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>

        {galleryImages.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <FiImage className="w-5 h-5 text-violet-500" />
              <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">Gallery</h2>
              <span className="text-sm text-gray-500 dark:text-gray-400">({galleryImages.length} photos)</span>
            </div>
            <div className="grid grid-cols-3 gap-3 sm:gap-4">
              {galleryColumns.map((column, colIdx) => (
                <div key={colIdx} className="flex flex-col gap-3 sm:gap-4">
                  {column.map((item) => (
                    <div
                      key={item.index}
                      className="cursor-pointer"
                      onClick={() => setLightboxImage(item.src)}
                    >
                      <AnimatedImage
                        src={item.src}
                        alt={`Gallery ${item.index + 1}`}
                        ratio={item.ratio}
                        index={item.index}
                      />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <Modal isOpen={showRequestModal} onClose={() => setShowRequestModal(false)} title={`Request ${name}`}>
        <form onSubmit={handleSendRequest} className="space-y-4">
          <div className="flex items-center gap-3 p-3 bg-gray-100 dark:bg-gray-900 rounded-lg">
            <div className="w-12 h-12 rounded-full bg-violet-500/10 flex items-center justify-center overflow-hidden shrink-0">
              {image ? (
                <img src={image} alt="" className="w-full h-full object-cover" />
              ) : (
                <span className="text-lg font-bold text-violet-500">{name[0].toUpperCase()}</span>
              )}
            </div>
            <div>
              <p className="font-medium text-gray-800 dark:text-gray-100">{name}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">@{trainer.Username}</p>
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
            <Button type="button" variant="secondary" onClick={() => setShowRequestModal(false)}>Cancel</Button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={!!lightboxImage} onClose={() => setLightboxImage(null)} title="" className="!p-0" size="lg">
        {lightboxImage && (
          <img src={lightboxImage} alt="Gallery" className="w-full h-auto rounded-lg" />
        )}
      </Modal>

      {showRemoveConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <Card className="max-w-sm w-full">
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-2">Remove Trainer</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Are you sure you want to remove your assigned trainer? You can request a new trainer anytime.</p>
            <div className="flex gap-3">
              <Button variant="danger" className="flex-1" onClick={handleRemoveTrainer}>Remove</Button>
              <Button variant="secondary" onClick={() => setShowRemoveConfirm(false)}>Cancel</Button>
            </div>
          </Card>
        </div>
      )}
    </DashboardLayout>
  );
}

export default TrainerPublicProfile;
