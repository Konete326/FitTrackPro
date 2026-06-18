import React from 'react';
import { Link } from 'react-router-dom';
import PublicLayout from '../../layouts/PublicLayout';
import { useAuth } from '../../contexts/AuthContext';
import { FiActivity, FiTarget, FiTrendingUp, FiDroplet, FiMoon, FiUsers } from 'react-icons/fi';

function Home() {
  const { user } = useAuth();
  const features = [
    { icon: <FiActivity className="w-6 h-6" />, title: 'Workout Tracking', desc: 'Log exercises, track sets and reps, monitor progress with detailed analytics.' },
    { icon: <FiTarget className="w-6 h-6" />, title: 'Goal Setting', desc: 'Set fitness goals with milestones and track your progress towards achieving them.' },
    { icon: <FiTrendingUp className="w-6 h-6" />, title: 'Progress Analytics', desc: 'Visualize your fitness journey with charts for weight, measurements, and performance.' },
    { icon: <FiDroplet className="w-6 h-6" />, title: 'Hydration Tracking', desc: 'Monitor daily water intake with quick-add buttons and hydration streaks.' },
    { icon: <FiMoon className="w-6 h-6" />, title: 'Sleep Monitoring', desc: 'Track sleep quality, duration, and get personalized recommendations.' },
    { icon: <FiUsers className="w-6 h-6" />, title: 'Trainer Integration', desc: 'Connect with trainers who can assign workouts, set goals, and monitor your progress.' },
  ];

  return (
    <PublicLayout>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-sky-500/10 dark:from-violet-500/5 dark:to-sky-500/5" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-36">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-6 leading-tight">
              Your Fitness Journey,{' '}
              <span className="text-violet-600 dark:text-violet-400">Unified</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
              Track workouts, nutrition, sleep, hydration, and progress all in one place. 
              Connect with trainers and achieve your fitness goals with FitTrack Pro.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {user ? (
                <Link
                  to="/dashboard"
                  className="w-full sm:w-auto btn bg-violet-600 text-white hover:bg-violet-700 text-base px-8 py-3.5 rounded-xl shadow-lg shadow-violet-600/30 font-semibold"
                >
                  Go to Dashboard
                </Link>
              ) : (
                <Link
                  to="/register"
                  className="w-full sm:w-auto btn bg-violet-600 text-white hover:bg-violet-700 text-base px-8 py-3.5 rounded-xl shadow-lg shadow-violet-600/30 font-semibold"
                >
                  Get Started Free
                </Link>
              )}
              <Link
                to="/about"
                className="w-full sm:w-auto btn bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:border-violet-300 dark:hover:border-violet-600 hover:text-violet-600 dark:hover:text-violet-400 text-base px-8 py-3.5 rounded-xl font-semibold"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">Everything You Need</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              A comprehensive fitness platform designed to help you track, analyze, and improve your health.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <div key={i} className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 hover:shadow-lg transition-shadow border border-gray-100 dark:border-gray-700/50">
                <div className="w-12 h-12 bg-violet-100 dark:bg-violet-500/20 text-violet-600 dark:text-violet-400 rounded-lg flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: '10+', label: 'Tracking Modules' },
              { value: '3', label: 'Role Panels' },
              { value: '100%', label: 'Responsive' },
              { value: '24/7', label: 'Cloud Access' },
            ].map((stat, i) => (
              <div key={i}>
                <div className="text-4xl md:text-5xl font-bold text-violet-600 dark:text-violet-400 mb-2">{stat.value}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-violet-50 dark:bg-violet-500/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {user ? (
            <>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Welcome Back, {user.Profile?.Name?.split(' ')[0] || user.Username}!
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto">
                Continue your fitness journey. Track workouts, check progress, and stay on top of your goals.
              </p>
              <Link
                to="/dashboard"
                className="inline-block btn bg-violet-600 text-white hover:bg-violet-700 text-base px-8 py-3.5 rounded-xl shadow-lg shadow-violet-600/30 font-semibold"
              >
                Go to Dashboard
              </Link>
            </>
          ) : (
            <>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Ready to Transform Your Fitness?
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto">
                Join thousands of users who are already tracking their workouts, nutrition, and progress with FitTrack Pro.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  to="/register"
                  className="w-full sm:w-auto btn bg-violet-600 text-white hover:bg-violet-700 text-base px-8 py-3.5 rounded-xl shadow-lg shadow-violet-600/30 font-semibold"
                >
                  Create Free Account
                </Link>
                <Link
                  to="/login"
                  className="w-full sm:w-auto btn bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:border-violet-300 dark:hover:border-violet-600 text-base px-8 py-3.5 rounded-xl font-semibold"
                >
                  Sign In
                </Link>
              </div>
            </>
          )}
        </div>
      </section>
    </PublicLayout>
  );
}

export default Home;
