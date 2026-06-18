import React, { useState, useEffect } from 'react';
import TrainerLayout from '../../layouts/TrainerLayout';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import { useAuth } from '../../contexts/AuthContext';
import { updateTrainerProfile, uploadTrainerImage, removeGalleryImage } from '../../services/trainerService';
import { FiCamera, FiPlus, FiX, FiImage, FiAward, FiTarget, FiBriefcase } from 'react-icons/fi';
import toast from 'react-hot-toast';

function TrainerProfileEdit() {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(null);
  const [formData, setFormData] = useState({
    Bio: user?.Profile?.Bio || '',
    Specialties: user?.Profile?.Specialties || [],
    Services: user?.Profile?.Services || [],
    Certifications: user?.Profile?.Certifications || [],
    Experience: user?.Profile?.Experience || 0,
  });
  const [newSpecialty, setNewSpecialty] = useState('');
  const [newService, setNewService] = useState('');
  const [newCertification, setNewCertification] = useState('');
  const [showImageModal, setShowImageModal] = useState(false);
  const [imageType, setImageType] = useState('');

  const profile = user?.Profile || {};

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await updateTrainerProfile(formData);
      if (res.data?.success) {
        updateUser(res.data.data);
        toast.success('Profile updated!');
      }
    } catch {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(imageType);
    const fd = new FormData();
    fd.append('image', file);
    fd.append('type', imageType);
    try {
      const res = await uploadTrainerImage(fd);
      if (res.data?.success) {
        updateUser(res.data.data);
        toast.success('Image uploaded!');
        setShowImageModal(false);
      }
    } catch {
      toast.error('Upload failed');
    } finally {
      setUploading(null);
    }
  };

  const handleRemoveGalleryImage = async (imageUrl) => {
    try {
      const res = await removeGalleryImage(imageUrl);
      if (res.data?.success) {
        updateUser(res.data.data);
        toast.success('Image removed');
      }
    } catch {
      toast.error('Failed to remove image');
    }
  };

  const addSpecialty = () => {
    if (newSpecialty.trim() && !formData.Specialties.includes(newSpecialty.trim())) {
      setFormData({ ...formData, Specialties: [...formData.Specialties, newSpecialty.trim()] });
      setNewSpecialty('');
    }
  };

  const removeSpecialty = (item) => {
    setFormData({ ...formData, Specialties: formData.Specialties.filter(s => s !== item) });
  };

  const addService = () => {
    if (newService.trim() && !formData.Services.includes(newService.trim())) {
      setFormData({ ...formData, Services: [...formData.Services, newService.trim()] });
      setNewService('');
    }
  };

  const removeService = (item) => {
    setFormData({ ...formData, Services: formData.Services.filter(s => s !== item) });
  };

  const addCertification = () => {
    if (newCertification.trim() && !formData.Certifications.includes(newCertification.trim())) {
      setFormData({ ...formData, Certifications: [...formData.Certifications, newCertification.trim()] });
      setNewCertification('');
    }
  };

  const removeCertification = (item) => {
    setFormData({ ...formData, Certifications: formData.Certifications.filter(c => c !== item) });
  };

  return (
    <TrainerLayout pageTitle="Edit Profile">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Cover Image */}
        <Card className="!p-0 overflow-hidden">
          <div className="relative h-48 bg-gradient-to-r from-violet-500 to-purple-600">
            {profile.BackgroundImage && (
              <img src={profile.BackgroundImage} alt="Cover" className="w-full h-full object-cover" />
            )}
            <button
              onClick={() => { setImageType('background'); setShowImageModal(true); }}
              className="absolute bottom-3 right-3 p-2 bg-black/50 hover:bg-black/70 text-white rounded-lg transition"
            >
              <FiCamera className="w-5 h-5" />
            </button>
          </div>
          <div className="px-6 pb-6 -mt-12 flex items-end gap-4">
            <div className="relative">
              <div className="w-24 h-24 rounded-xl bg-violet-500/10 flex items-center justify-center overflow-hidden ring-4 ring-white dark:ring-gray-800">
                {profile.ProfilePicture ? (
                  <img src={profile.ProfilePicture} alt={profile.Name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-3xl font-bold text-violet-500">{(profile.Name || 'T')[0].toUpperCase()}</span>
                )}
              </div>
              <button
                onClick={() => { setImageType('profile'); setShowImageModal(true); }}
                className="absolute -bottom-1 -right-1 p-1.5 bg-violet-500 hover:bg-violet-600 text-white rounded-lg transition"
              >
                <FiCamera className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 pb-1">
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">{profile.Name || user?.Username}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">@{user?.Username}</p>
            </div>
          </div>
        </Card>

        {/* Bio */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">About You</h3>
          <textarea
            value={formData.Bio}
            onChange={(e) => setFormData({ ...formData, Bio: e.target.value })}
            rows={4}
            maxLength={500}
            className="form-textarea w-full bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700/60 rounded-lg focus:ring-violet-500 focus:border-violet-500"
            placeholder="Tell clients about yourself, your training philosophy, and what makes you unique..."
          />
          <p className="text-xs text-gray-400 mt-1">{formData.Bio.length}/500</p>
        </Card>

        {/* Specialties */}
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <FiTarget className="w-5 h-5 text-violet-500" />
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Specialties</h3>
          </div>
          <div className="flex flex-wrap gap-2 mb-3">
            {formData.Specialties.map((s) => (
              <Badge key={s} variant="violet" className="gap-1">
                {s}
                <button onClick={() => removeSpecialty(s)} className="hover:text-red-500">
                  <FiX className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              value={newSpecialty}
              onChange={(e) => setNewSpecialty(e.target.value)}
              placeholder="e.g., Weight Loss, Muscle Building"
              className="flex-1 !mb-0"
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSpecialty())}
            />
            <Button variant="secondary" onClick={addSpecialty} icon={<FiPlus className="w-4 h-4" />}>Add</Button>
          </div>
        </Card>

        {/* Services */}
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <FiBriefcase className="w-5 h-5 text-sky-500" />
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Services Offered</h3>
          </div>
          <div className="flex flex-wrap gap-2 mb-3">
            {formData.Services.map((s) => (
              <Badge key={s} variant="sky" className="gap-1">
                {s}
                <button onClick={() => removeService(s)} className="hover:text-red-500">
                  <FiX className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              value={newService}
              onChange={(e) => setNewService(e.target.value)}
              placeholder="e.g., Personal Training, Nutrition Coaching"
              className="flex-1 !mb-0"
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addService())}
            />
            <Button variant="secondary" onClick={addService} icon={<FiPlus className="w-4 h-4" />}>Add</Button>
          </div>
        </Card>

        {/* Certifications */}
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <FiAward className="w-5 h-5 text-amber-500" />
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Certifications</h3>
          </div>
          <div className="flex flex-wrap gap-2 mb-3">
            {formData.Certifications.map((c) => (
              <Badge key={c} variant="amber" className="gap-1">
                {c}
                <button onClick={() => removeCertification(c)} className="hover:text-red-500">
                  <FiX className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              value={newCertification}
              onChange={(e) => setNewCertification(e.target.value)}
              placeholder="e.g., NASM-CPT, ACE Certified"
              className="flex-1 !mb-0"
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCertification())}
            />
            <Button variant="secondary" onClick={addCertification} icon={<FiPlus className="w-4 h-4" />}>Add</Button>
          </div>
        </Card>

        {/* Experience */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Years of Experience</h3>
          <Input
            type="number"
            min="0"
            max="50"
            value={formData.Experience}
            onChange={(e) => setFormData({ ...formData, Experience: parseInt(e.target.value) || 0 })}
            className="!mb-0 w-32"
          />
        </Card>

        {/* Gallery */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <FiImage className="w-5 h-5 text-green-500" />
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Gallery</h3>
            </div>
            <span className="text-sm text-gray-500">{profile.Gallery?.length || 0}/10</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {(profile.Gallery || []).map((img, idx) => (
              <div key={idx} className="relative aspect-square rounded-lg overflow-hidden group">
                <img src={img} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover" />
                <button
                  onClick={() => handleRemoveGalleryImage(img)}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition"
                >
                  <FiX className="w-3 h-3" />
                </button>
              </div>
            ))}
            {(profile.Gallery?.length || 0) < 10 && (
              <button
                onClick={() => { setImageType('gallery'); setShowImageModal(true); }}
                className="aspect-square rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 flex flex-col items-center justify-center gap-2 text-gray-500 hover:border-violet-500 hover:text-violet-500 transition"
              >
                <FiPlus className="w-6 h-6" />
                <span className="text-xs">Add Photo</span>
              </button>
            )}
          </div>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button variant="primary" onClick={handleSave} loading={loading}>
            Save Profile
          </Button>
        </div>
      </div>

      {/* Image Upload Modal */}
      <Modal isOpen={showImageModal} onClose={() => setShowImageModal(false)} title={`Upload ${imageType === 'profile' ? 'Profile' : imageType === 'background' ? 'Background' : 'Gallery'} Image`}>
        <div className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 text-center">
            <FiImage className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              {uploading ? 'Uploading...' : 'Click to select an image'}
            </p>
            <label className="cursor-pointer">
              <span className="inline-flex items-center px-4 py-2 bg-violet-500 text-white rounded-lg hover:bg-violet-600 transition">
                {uploading ? 'Uploading...' : 'Choose File'}
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                disabled={uploading !== null}
              />
            </label>
          </div>
          <p className="text-xs text-gray-500 text-center">
            Max file size: 5MB. Formats: JPG, PNG, WebP, GIF
          </p>
        </div>
      </Modal>
    </TrainerLayout>
  );
}

export default TrainerProfileEdit;
