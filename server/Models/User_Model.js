const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User_Schema = new mongoose.Schema({
  Username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters'],
    maxlength: [30, 'Username cannot exceed 30 characters'],
    match: [/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'],
  },
  Email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
  },
  Password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters'],
    select: false,
  },
  Role: {
    type: String,
    enum: ['User', 'Trainer', 'Admin'],
    default: 'User',
  },
  IsActive: {
    type: Boolean,
    default: true,
  },
  IsVerified: {
    type: Boolean,
    default: false,
  },
  TrainerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  Profile: {
    Name: { type: String, required: [true, 'Name is required'] },
    Age: { type: Number, min: [13, 'Must be at least 13'], max: [120, 'Invalid age'] },
    Gender: { type: String, enum: ['Male', 'Female', 'Other'] },
    Height: { type: Number },
    Weight: { type: Number },
    FitnessLevel: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'] },
    Goals: { type: String },
    Bio: { type: String, maxlength: 500 },
    ProfilePicture: { type: String, default: '' },
    // Trainer-specific fields
    BackgroundImage: { type: String, default: '' },
    Specialties: [{ type: String }],
    Services: [{ type: String }],
    Certifications: [{ type: String }],
    Experience: { type: Number, default: 0 },
    Gallery: [{ type: String }],
  },
  Settings: {
    MeasurementUnit: { type: String, enum: ['metric', 'imperial'], default: 'metric' },
    Theme: { type: String, enum: ['light', 'dark'], default: 'dark' },
    Notifications: { type: Boolean, default: true },
    WaterGoal: { type: Number, default: 2000 },
  },
  Stats: {
    TotalWorkouts: { type: Number, default: 0 },
    TotalCaloriesBurned: { type: Number, default: 0 },
    CurrentStreak: { type: Number, default: 0 },
    LongestStreak: { type: Number, default: 0 },
  },
  TrainerNotes: [{
    TrainerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    TrainerName: { type: String },
    Note: { type: String },
    CreatedAt: { type: Date, default: Date.now },
  }],
  ResetPasswordToken: String,
  ResetPasswordExpire: Date,
  LastLogin: { type: Date },
}, { timestamps: true });

User_Schema.index({ Role: 1 });
User_Schema.index({ TrainerId: 1 });
User_Schema.index({ 'Profile.Name': 'text' });

User_Schema.pre('save', async function (next) {
  if (!this.isModified('Password')) return next();
  this.Password = await bcrypt.hash(this.Password, 12);
  next();
});

User_Schema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.Password);
};

User_Schema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id, role: this.Role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

User_Schema.methods.getSafeUser = function () {
  const user = this.toObject();
  delete user.Password;
  delete user.ResetPasswordToken;
  delete user.ResetPasswordExpire;
  return user;
};

User_Schema.virtual('Clients', {
  ref: 'User',
  localField: '_id',
  foreignField: 'TrainerId',
});

User_Schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('User', User_Schema);
