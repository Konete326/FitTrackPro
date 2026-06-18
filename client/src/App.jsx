import React, { useEffect } from 'react';
import { Agentation } from 'agentation';
import {
  Routes,
  Route,
  useLocation
} from 'react-router-dom';

import './css/style.css';

import ProtectedRoute from './components/ProtectedRoute';

import Splash from './pages/public/Splash';
import Home from './pages/public/Home';
import About from './pages/public/About';
import Contact from './pages/public/Contact';
import FAQ from './pages/public/FAQ';
import Login from './pages/public/Login';
import Register from './pages/public/Register';
import ForgotPassword from './pages/public/ForgotPassword';
import ResetPassword from './pages/public/ResetPassword';

import UserDashboard from './pages/user/UserDashboard';
import WorkoutList from './pages/user/WorkoutList';
import LogWorkout from './pages/user/LogWorkout';
import WorkoutDetails from './pages/user/WorkoutDetails';
import NutritionLog from './pages/user/NutritionLog';
import WaterLog from './pages/user/WaterLog';
import ProgressTracking from './pages/user/ProgressTracking';
import SleepLog from './pages/user/SleepLog';
import BrowseTrainers from './pages/user/BrowseTrainers';
import TrainerPublicProfile from './pages/user/TrainerPublicProfile';
import Goals from './pages/user/Goals';
import Achievements from './pages/user/Achievements';
import Profile from './pages/user/Profile';
import Settings from './pages/user/Settings';

import TrainerDashboard from './pages/trainer/TrainerDashboard';
import MyClients from './pages/trainer/MyClients';
import ClientDetails from './pages/trainer/ClientDetails';
import ClientMealPlans from './pages/trainer/ClientMealPlans';
import WorkoutTemplates from './pages/trainer/WorkoutTemplates';
import TrainerProfile from './pages/trainer/TrainerProfile';
import TrainerProfileEdit from './pages/trainer/TrainerProfileEdit';
import TrainerSettings from './pages/trainer/TrainerSettings';

import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import TrainerManagement from './pages/admin/TrainerManagement';
import CreateTrainer from './pages/admin/CreateTrainer';
import TrainerRequests from './pages/admin/TrainerRequests';
import AssignedTrainers from './pages/admin/AssignedTrainers';
import Feedbacks from './pages/admin/Feedbacks';
import AdminProfile from './pages/admin/AdminProfile';
import AdminSettings from './pages/admin/AdminSettings';

function App() {

  const location = useLocation();

  useEffect(() => {
    document.querySelector('html').style.scrollBehavior = 'auto'
    window.scroll({ top: 0 })
    document.querySelector('html').style.scrollBehavior = ''
  }, [location.pathname]);

  return (
    <>
      <Routes>
        <Route path="/" element={<Splash />} />
        <Route path="/home" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        <Route path="/dashboard" element={<ProtectedRoute roles={['User']}><UserDashboard /></ProtectedRoute>} />
        <Route path="/workouts" element={<ProtectedRoute roles={['User']}><WorkoutList /></ProtectedRoute>} />
        <Route path="/workouts/log" element={<ProtectedRoute roles={['User']}><LogWorkout /></ProtectedRoute>} />
        <Route path="/workouts/:id" element={<ProtectedRoute roles={['User']}><WorkoutDetails /></ProtectedRoute>} />
        <Route path="/nutrition" element={<ProtectedRoute roles={['User']}><NutritionLog /></ProtectedRoute>} />
        <Route path="/water" element={<ProtectedRoute roles={['User']}><WaterLog /></ProtectedRoute>} />
        <Route path="/progress" element={<ProtectedRoute roles={['User']}><ProgressTracking /></ProtectedRoute>} />
        <Route path="/sleep" element={<ProtectedRoute roles={['User']}><SleepLog /></ProtectedRoute>} />
        <Route path="/browse-trainers" element={<ProtectedRoute roles={['User']}><BrowseTrainers /></ProtectedRoute>} />
        <Route path="/trainer-profile/:id" element={<ProtectedRoute roles={['User']}><TrainerPublicProfile /></ProtectedRoute>} />
        <Route path="/goals" element={<ProtectedRoute roles={['User']}><Goals /></ProtectedRoute>} />
        <Route path="/achievements" element={<ProtectedRoute roles={['User']}><Achievements /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute roles={['User']}><Profile /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute roles={['User']}><Settings /></ProtectedRoute>} />

        <Route path="/trainer/dashboard" element={<ProtectedRoute roles={['Trainer']}><TrainerDashboard /></ProtectedRoute>} />
        <Route path="/trainer/clients" element={<ProtectedRoute roles={['Trainer']}><MyClients /></ProtectedRoute>} />
        <Route path="/trainer/clients/:id" element={<ProtectedRoute roles={['Trainer']}><ClientDetails /></ProtectedRoute>} />
        <Route path="/trainer/clients/:id/meal-plans" element={<ProtectedRoute roles={['Trainer']}><ClientMealPlans /></ProtectedRoute>} />
        <Route path="/trainer/templates" element={<ProtectedRoute roles={['Trainer']}><WorkoutTemplates /></ProtectedRoute>} />
        <Route path="/trainer/profile" element={<ProtectedRoute roles={['Trainer']}><TrainerProfile /></ProtectedRoute>} />
        <Route path="/trainer/profile/edit" element={<ProtectedRoute roles={['Trainer']}><TrainerProfileEdit /></ProtectedRoute>} />
        <Route path="/trainer/settings" element={<ProtectedRoute roles={['Trainer']}><TrainerSettings /></ProtectedRoute>} />

        <Route path="/admin/dashboard" element={<ProtectedRoute roles={['Admin']}><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/users" element={<ProtectedRoute roles={['Admin']}><UserManagement /></ProtectedRoute>} />
        <Route path="/admin/trainers" element={<ProtectedRoute roles={['Admin']}><TrainerManagement /></ProtectedRoute>} />
        <Route path="/admin/create-trainer" element={<ProtectedRoute roles={['Admin']}><CreateTrainer /></ProtectedRoute>} />
        <Route path="/admin/trainer-requests" element={<ProtectedRoute roles={['Admin']}><TrainerRequests /></ProtectedRoute>} />
        <Route path="/admin/assigned-trainers" element={<ProtectedRoute roles={['Admin']}><AssignedTrainers /></ProtectedRoute>} />
        <Route path="/admin/feedbacks" element={<ProtectedRoute roles={['Admin']}><Feedbacks /></ProtectedRoute>} />
        <Route path="/admin/profile" element={<ProtectedRoute roles={['Admin']}><AdminProfile /></ProtectedRoute>} />
        <Route path="/admin/settings" element={<ProtectedRoute roles={['Admin']}><AdminSettings /></ProtectedRoute>} />
      </Routes>
      {import.meta.env.DEV && <Agentation />}
    </>
  );
}

export default App;
