import React from 'react';
import { Link } from 'react-router-dom';
import PublicLayout from '../../layouts/PublicLayout';
import { FiActivity, FiTarget, FiTrendingUp, FiDroplet, FiMoon, FiUsers } from 'react-icons/fi';

function Home() {
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
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-extrabold text-gray-800 dark:text-gray-100 tracking-tighter mb-6">
              Your Fitness Journey,{' '}
              <span className="text-violet-500">Unified</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
              Track workouts, nutrition, sleep, hydration, and progress all in one place. 
              Connect with trainers and achieve your fitness goals with FitTrack Pro.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/register"
                className="btn bg-violet-500 text-white hover:bg-violet-600 text-sm px-6 py-3 rounded-lg shadow-lg shadow-violet-500/25"
              >
                Get Started Free
              </Link>
              <Link
                to="/about"
                className="btn bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700/60 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600 text-sm px-6 py-3 rounded-lg"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-100 mb-4">Everything You Need</h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
              A comprehensive fitness platform designed to help you track, analyze, and improve your health.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <div key={i} className="bg-gray-100 dark:bg-gray-900 rounded-xl p-6 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-violet-500/10 text-violet-500 rounded-lg flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">{feature.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: '10+', label: 'Tracking Modules' },
              { value: '3', label: 'Role Panels' },
              { value: '100%', label: 'Responsive' },
              { value: '24/7', label: 'Cloud Access' },
            ].map((stat, i) => (
              <div key={i}>
                <div className="text-3xl md:text-4xl font-bold text-violet-500 mb-2">{stat.value}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-violet-500/5 dark:bg-violet-500/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-100 mb-4">
            Ready to Start Your Fitness Journey?
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
            Join FitTrack Pro today and take control of your health with comprehensive tracking tools and professional trainer support.
          </p>
          <Link
            to="/register"
            className="btn bg-violet-500 text-white hover:bg-violet-600 text-sm px-8 py-3 rounded-lg shadow-lg shadow-violet-500/25"
          >
            Create Free Account
          </Link>
        </div>
      </section>
    </PublicLayout>
  );
}

export default Home;
