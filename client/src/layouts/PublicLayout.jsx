import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ThemeToggle from '../components/ThemeToggle';

function PublicLayout({ children }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useAuth();
  const location = useLocation();

  const navLinks = [
    { label: 'Home', to: '/home' },
    { label: 'About', to: '/about' },
    { label: 'Contact', to: '/contact' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900">
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-700/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/home" className="flex items-center gap-2">
              <img src="/logo.png" alt="FitTrack Pro" className="w-8 h-8" />
              <span className="text-lg font-bold text-gray-800 dark:text-gray-100">FitTrack Pro</span>
            </Link>

            <nav className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`text-sm font-medium transition ${
                    isActive(link.to)
                      ? 'text-violet-500'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-3">
              <ThemeToggle />
              {user ? (
                <Link
                  to={user.Role === 'Admin' ? '/admin/dashboard' : user.Role === 'Trainer' ? '/trainer/dashboard' : '/dashboard'}
                  className="btn bg-violet-500 text-white hover:bg-violet-600 text-sm px-4 py-2 rounded-lg hidden sm:inline-flex"
                >
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition hidden sm:inline-flex"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="btn bg-violet-500 text-white hover:bg-violet-600 text-sm px-4 py-2 rounded-lg hidden sm:inline-flex"
                  >
                    Get Started
                  </Link>
                </>
              )}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden text-gray-500 hover:text-gray-600 dark:hover:text-gray-400 transition"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {mobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-700/60">
              <nav className="flex flex-col gap-3">
                {navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`text-sm font-medium py-2 transition ${
                      isActive(link.to) ? 'text-violet-500' : 'text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                <hr className="border-gray-200 dark:border-gray-700/60" />
                {user ? (
                  <Link
                    to={user.Role === 'Admin' ? '/admin/dashboard' : user.Role === 'Trainer' ? '/trainer/dashboard' : '/dashboard'}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-sm font-medium py-2 text-violet-500"
                  >
                    Dashboard
                  </Link>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium py-2 text-gray-600 dark:text-gray-400">Sign In</Link>
                    <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium py-2 text-violet-500">Get Started</Link>
                  </>
                )}
              </nav>
            </div>
          )}
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <img src="/logo.png" alt="FitTrack Pro" className="w-8 h-8" />
                <span className="text-lg font-bold text-gray-800 dark:text-gray-100">FitTrack Pro</span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Your comprehensive fitness tracking platform for workouts, nutrition, sleep, and more.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-4">Quick Links</h4>
              <div className="flex flex-col gap-2">
                {navLinks.map((link) => (
                  <Link key={link.to} to={link.to} className="text-sm text-gray-500 dark:text-gray-400 hover:text-violet-500 transition">
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-4">Get Started</h4>
              <div className="flex flex-col gap-2">
                <Link to="/register" className="text-sm text-gray-500 dark:text-gray-400 hover:text-violet-500 transition">Create Account</Link>
                <Link to="/login" className="text-sm text-gray-500 dark:text-gray-400 hover:text-violet-500 transition">Sign In</Link>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700/60 text-center">
            <p className="text-sm text-gray-400 dark:text-gray-500">
              &copy; {new Date().getFullYear()} FitTrack Pro. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default PublicLayout;
