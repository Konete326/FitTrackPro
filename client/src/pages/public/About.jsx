import React from 'react';
import PublicLayout from '../../layouts/PublicLayout';
import { FiHeart, FiShield, FiZap, FiGlobe } from 'react-icons/fi';

function About() {
  const values = [
    { icon: <FiHeart className="w-6 h-6" />, title: 'Health First', desc: 'We prioritize your well-being with evidence-based tracking and personalized insights.' },
    { icon: <FiShield className="w-6 h-6" />, title: 'Privacy & Security', desc: 'Your health data is encrypted and stored securely. We never share your information.' },
    { icon: <FiZap className="w-6 h-6" />, title: 'Performance', desc: 'Built with modern technology for fast, reliable tracking that keeps up with your routine.' },
    { icon: <FiGlobe className="w-6 h-6" />, title: 'Accessibility', desc: 'Designed to work on any device, anywhere, with full responsive support and dark mode.' },
  ];

  return (
    <PublicLayout>
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 dark:text-gray-100 tracking-tighter mb-6">About FitTrack Pro</h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              FitTrack Pro was built with a simple mission: to make fitness tracking comprehensive, 
              accessible, and enjoyable for everyone — from beginners to fitness professionals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4">Our Mission</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Most fitness apps are fragmented — requiring separate tools for workouts, nutrition, sleep, and hydration. 
                FitTrack Pro unifies all tracking in one platform with role-based panels for users, trainers, and administrators.
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                We believe that understanding your body through data is the first step towards meaningful health improvements. 
                Our platform provides the tools, insights, and professional support you need to reach your goals.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xs p-8">
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-6">What We Offer</h3>
              <ul className="space-y-4">
                {['Comprehensive workout logging with exercise tracking', 'Nutrition tracking with food database search', 'Sleep quality monitoring with recommendations', 'Water intake tracking with hydration streaks', 'Body measurement and progress photo tracking', 'Goal setting with milestone tracking', 'Professional trainer integration', 'Achievement system with gamification'].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm text-gray-600 dark:text-gray-400">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4">Our Values</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-xs text-center">
                <div className="w-12 h-12 bg-violet-500/10 text-violet-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                  {v.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">{v.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}

export default About;
