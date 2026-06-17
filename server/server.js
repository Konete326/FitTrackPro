require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');
const rateLimit = require('express-rate-limit');

const connectDB = require('./Database/db');
const seedAdmin = require('./Database/seedAdmin');
const { errorHandler } = require('./Middleware/ErrorHandler');

const Auth_Routes = require('./Routes/Auth_Routes');
const Workout_Routes = require('./Routes/Workout_Routes');
const Nutrition_Routes = require('./Routes/Nutrition_Routes');
const Progress_Routes = require('./Routes/Progress_Routes');
const Goal_Routes = require('./Routes/Goal_Routes');
const Water_Routes = require('./Routes/Water_Routes');
const Sleep_Routes = require('./Routes/Sleep_Routes');
const Notification_Routes = require('./Routes/Notification_Routes');
const Achievement_Routes = require('./Routes/Achievement_Routes');
const Admin_Routes = require('./Routes/Admin_Routes');
const Trainer_Routes = require('./Routes/Trainer_Routes');
const TrainerRequest_Routes = require('./Routes/TrainerRequest_Routes');
const Feedback_Routes = require('./Routes/Feedback_Routes');

const app = express();

app.use(helmet());

const allowedOrigins = [
  process.env.CLIENT_URL,
  'https://fit-track-pro-gym.vercel.app',
  'http://localhost:5173',
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 900000,
  max: parseInt(process.env.RATE_LIMIT_MAX) || 200,
  message: { success: false, message: 'Too many requests, please try again later.' },
});

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(compression());
app.use(mongoSanitize());
app.use(hpp());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(limiter);

app.use('/api/auth', Auth_Routes);
app.use('/api/workouts', Workout_Routes);
app.use('/api/nutrition', Nutrition_Routes);
app.use('/api/progress', Progress_Routes);
app.use('/api/goals', Goal_Routes);
app.use('/api/water', Water_Routes);
app.use('/api/sleep', Sleep_Routes);
app.use('/api/notifications', Notification_Routes);
app.use('/api/achievements', Achievement_Routes);
app.use('/api/admin', Admin_Routes);
app.use('/api/trainer', Trainer_Routes);
app.use('/api/trainer-requests', TrainerRequest_Routes);
app.use('/api/feedbacks', Feedback_Routes);

app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, message: 'FitTrack Pro API is running' });
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;


let isConnected = false;

const ensureDB = async () => {
  if (!isConnected) {
    await connectDB();
    await seedAdmin();
    isConnected = true;
  }
};

if (process.env.VERCEL) {
  ensureDB();
  module.exports = app;
} else {
 
  const startServer = async () => {
    await connectDB();
    await seedAdmin();
    const server = app.listen(PORT, () => {
      console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    });

    process.on('unhandledRejection', (err) => {
      console.error(`Unhandled Rejection: ${err.message}`);
      server.close(() => process.exit(1));
    });

    process.on('SIGTERM', () => {
      server.close(() => {
        console.log('Server closed (SIGTERM)');
        process.exit(0);
      });
    });
  };

  startServer();
}
