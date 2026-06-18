const User = require('../Models/User_Model');
const Workout = require('../Models/Workout_Model');
const Goal = require('../Models/Goal_Model');
const Notification = require('../Models/Notification_Model');
const { uploadToCloudinary, deleteFromCloudinary } = require('../Utils/Cloudinary');

const getClients = async (req, res, next) => {
  try {
    const clients = await User.find({ TrainerId: req.user._id }).lean();
    res.status(200).json({ success: true, count: clients.length, data: clients });
  } catch (error) { next(error); }
};

const getClientDetails = async (req, res, next) => {
  try {
    const client = await User.findById(req.params.id);
    if (!client || client.TrainerId.toString() !== req.user._id.toString()) {
      return res.status(404).json({ success: false, message: 'Client not found' });
    }
    res.status(200).json({ success: true, data: client });
  } catch (error) { next(error); }
};

const assignWorkout = async (req, res, next) => {
  try {
    const client = await User.findById(req.params.id);
    if (!client || client.TrainerId.toString() !== req.user._id.toString()) {
      return res.status(404).json({ success: false, message: 'Client not found' });
    }
    const workout = await Workout.create({ ...req.body, UserId: client._id });
    await Notification.create({ UserId: client._id, Type: 'Workout', Title: 'New Workout Assigned', Message: `Your trainer assigned "${workout.Title}".`, Link: '/workouts' });
    res.status(201).json({ success: true, data: workout });
  } catch (error) { next(error); }
};

const setClientGoal = async (req, res, next) => {
  try {
    const client = await User.findById(req.params.id);
    if (!client || client.TrainerId.toString() !== req.user._id.toString()) {
      return res.status(404).json({ success: false, message: 'Client not found' });
    }
    const goal = await Goal.create({ ...req.body, UserId: client._id });
    await Notification.create({ UserId: client._id, Type: 'Goal', Title: 'New Goal Set', Message: `Your trainer set a goal: "${goal.Title}".`, Link: '/goals' });
    res.status(201).json({ success: true, data: goal });
  } catch (error) { next(error); }
};

const addClientNote = async (req, res, next) => {
  try {
    const client = await User.findById(req.params.id);
    if (!client || client.TrainerId.toString() !== req.user._id.toString()) {
      return res.status(404).json({ success: false, message: 'Client not found' });
    }
    client.TrainerNotes.push({ TrainerId: req.user._id, TrainerName: req.user.Profile.Name, Note: req.body.note });
    await client.save({ validateBeforeSave: false });
    res.status(200).json({ success: true, data: client });
  } catch (error) { next(error); }
};

const sendMessageToClient = async (req, res, next) => {
  try {
    const client = await User.findById(req.params.id);
    if (!client || client.TrainerId.toString() !== req.user._id.toString()) {
      return res.status(404).json({ success: false, message: 'Client not found' });
    }
    await Notification.create({ UserId: client._id, Type: 'Message', Title: 'Message from Trainer', Message: req.body.message, Data: { trainerName: req.user.Profile.Name }, Link: '/dashboard' });
    res.status(201).json({ success: true, message: 'Message sent' });
  } catch (error) { next(error); }
};

const removeClient = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.params.id, { TrainerId: null });
    await Notification.create({ UserId: req.params.id, Type: 'System', Title: 'Trainer Removed', Message: 'Your trainer assignment has been removed.', Link: '/browse-trainers' });
    res.status(200).json({ success: true, message: 'Client removed' });
  } catch (error) { next(error); }
};

const createWorkoutTemplate = async (req, res, next) => {
  try {
    const template = await Workout.create({ ...req.body, UserId: req.user._id, IsTemplate: true });
    res.status(201).json({ success: true, data: template });
  } catch (error) { next(error); }
};

const getWorkoutTemplates = async (req, res, next) => {
  try {
    const data = await Workout.find({ UserId: req.user._id, IsTemplate: true }).sort({ createdAt: -1 }).lean();
    res.status(200).json({ success: true, count: data.length, data });
  } catch (error) { next(error); }
};

const deleteWorkoutTemplate = async (req, res, next) => {
  try {
    await Workout.findOneAndDelete({ _id: req.params.id, UserId: req.user._id, IsTemplate: true });
    res.status(200).json({ success: true, message: 'Template deleted' });
  } catch (error) { next(error); }
};

const getTrainerDashboardStats = async (req, res, next) => {
  try {
    const totalClients = await User.countDocuments({ TrainerId: req.user._id });
    const assignedWorkouts = await Workout.countDocuments({ UserId: { $in: (await User.find({ TrainerId: req.user._id }).select('_id')).map(u => u._id) } });
    res.status(200).json({ success: true, data: { totalClients, assignedWorkouts } });
  } catch (error) { next(error); }
};

const updateTrainerProfile = async (req, res, next) => {
  try {
    const trainer = await User.findById(req.user._id);
    if (!trainer || trainer.Role !== 'Trainer') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const { Bio, Specialties, Services, Certifications, Experience, BackgroundImage } = req.body;
    
    if (Bio !== undefined) trainer.Profile.Bio = Bio;
    if (Specialties !== undefined) trainer.Profile.Specialties = Specialties;
    if (Services !== undefined) trainer.Profile.Services = Services;
    if (Certifications !== undefined) trainer.Profile.Certifications = Certifications;
    if (Experience !== undefined) trainer.Profile.Experience = Experience;
    if (BackgroundImage !== undefined) trainer.Profile.BackgroundImage = BackgroundImage;

    await trainer.save({ validateBeforeSave: false });
    res.status(200).json({ success: true, data: trainer });
  } catch (error) { next(error); }
};

const uploadTrainerImage = async (req, res, next) => {
  try {
    const trainer = await User.findById(req.user._id);
    if (!trainer || trainer.Role !== 'Trainer') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const { type } = req.body;
    const folder = 'fittrack-pro/trainers';
    const publicId = `${trainer._id}-${type}-${Date.now()}`;
    const imageUrl = await uploadToCloudinary(req.file.buffer, folder, publicId);

    if (type === 'profile') {
      if (trainer.Profile.ProfilePicture) {
        await deleteFromCloudinary(trainer.Profile.ProfilePicture);
      }
      trainer.Profile.ProfilePicture = imageUrl;
    } else if (type === 'background') {
      if (trainer.Profile.BackgroundImage) {
        await deleteFromCloudinary(trainer.Profile.BackgroundImage);
      }
      trainer.Profile.BackgroundImage = imageUrl;
    } else if (type === 'gallery') {
      if (trainer.Profile.Gallery.length >= 10) {
        return res.status(400).json({ success: false, message: 'Gallery limit reached (10 images max)' });
      }
      trainer.Profile.Gallery.push(imageUrl);
    } else {
      return res.status(400).json({ success: false, message: 'Invalid image type' });
    }

    await trainer.save({ validateBeforeSave: false });
    res.status(200).json({ success: true, data: trainer, imageUrl });
  } catch (error) { next(error); }
};

const removeGalleryImage = async (req, res, next) => {
  try {
    const trainer = await User.findById(req.user._id);
    if (!trainer || trainer.Role !== 'Trainer') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const { imageUrl } = req.body;
    await deleteFromCloudinary(imageUrl);
    trainer.Profile.Gallery = trainer.Profile.Gallery.filter(img => img !== imageUrl);
    await trainer.save({ validateBeforeSave: false });

    res.status(200).json({ success: true, data: trainer });
  } catch (error) { next(error); }
};

const getTrainerPublicProfile = async (req, res, next) => {
  try {
    const trainer = await User.findById(req.params.id).select('-Password -ResetPasswordToken -ResetPasswordExpire');
    if (!trainer || trainer.Role !== 'Trainer') {
      return res.status(404).json({ success: false, message: 'Trainer not found' });
    }

    const publicProfile = {
      _id: trainer._id,
      Username: trainer.Username,
      Profile: {
        Name: trainer.Profile.Name,
        Bio: trainer.Profile.Bio,
        ProfilePicture: trainer.Profile.ProfilePicture,
        BackgroundImage: trainer.Profile.BackgroundImage,
        Specialties: trainer.Profile.Specialties,
        Services: trainer.Profile.Services,
        Certifications: trainer.Profile.Certifications,
        Experience: trainer.Profile.Experience,
        Gallery: trainer.Profile.Gallery,
      },
      Stats: trainer.Stats,
    };

    res.status(200).json({ success: true, data: publicProfile });
  } catch (error) { next(error); }
};

module.exports = { getClients, getClientDetails, assignWorkout, setClientGoal, addClientNote, sendMessageToClient, removeClient, createWorkoutTemplate, getWorkoutTemplates, deleteWorkoutTemplate, getTrainerDashboardStats, updateTrainerProfile, uploadTrainerImage, removeGalleryImage, getTrainerPublicProfile };
