const mongoose = require('mongoose');

const Exercise_Schema = new mongoose.Schema({
  Name: { type: String, required: true },
  Category: { type: String },
  MuscleGroups: [String],
  Sets: { type: Number },
  Reps: { type: Number },
  Weight: { type: Number },
  Duration: { type: Number },
  Notes: { type: String },
  Completed: { type: Boolean, default: false },
}, { _id: false });

const Workout_Schema = new mongoose.Schema({
  UserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  Title: { type: String, required: [true, 'Title is required'] },
  Description: { type: String },
  Type: {
    type: String,
    required: true,
    enum: ['Weightlifting', 'Cardio', 'HIIT', 'Yoga', 'CrossFit', 'Strength', 'Flexibility', 'Sports', 'Other'],
  },
  Difficulty: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    default: 'Beginner',
  },
  Exercises: [Exercise_Schema],
  Duration: { type: Number, default: 0 },
  Location: { type: String },
  Tags: [String],
  Status: {
    type: String,
    enum: ['Planned', 'In-Progress', 'Completed'],
    default: 'Planned',
  },
  CompletionRate: { type: Number, default: 0 },
  CaloriesBurned: { type: Number, default: 0 },
  IsFavorite: { type: Boolean, default: false },
  IsTemplate: { type: Boolean, default: false },
  IsPublic: { type: Boolean, default: false },
  StartedAt: { type: Date },
  CompletedAt: { type: Date },
  MoodBefore: { type: Number, min: 1, max: 10 },
  MoodAfter: { type: Number, min: 1, max: 10 },
}, { timestamps: true });

Workout_Schema.index({ UserId: 1, createdAt: -1 });
Workout_Schema.index({ Type: 1 });
Workout_Schema.index({ Difficulty: 1 });
Workout_Schema.index({ IsPublic: 1 });

Workout_Schema.pre('save', function (next) {
  if (this.Exercises && this.Exercises.length > 0) {
    const completed = this.Exercises.filter(e => e.Completed).length;
    this.CompletionRate = Math.round((completed / this.Exercises.length) * 100);
  }
  next();
});

module.exports = mongoose.model('Workout', Workout_Schema);
