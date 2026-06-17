import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Transition from '../utils/Transition';
import { useAuth } from '../contexts/AuthContext';

function ModalSearch({ id, searchId, modalOpen, setModalOpen, align }) {

  const [searchValue, setSearchValue] = useState('');
  const navigate = useNavigate();
  const modalContent = useRef(null);
  const { user } = useAuth();

  const quickLinks = useMemo(() => {
    const role = user?.Role;
    if (role === 'Admin') {
      return [
        { label: 'Dashboard', path: '/admin/dashboard' },
        { label: 'User Management', path: '/admin/users' },
        { label: 'Trainer Management', path: '/admin/trainers' },
        { label: 'Trainer Requests', path: '/admin/trainer-requests' },
        { label: 'Assigned Trainers', path: '/admin/assigned-trainers' },
        { label: 'Feedbacks', path: '/admin/feedbacks' },
      ];
    }
    if (role === 'Trainer') {
      return [
        { label: 'Dashboard', path: '/trainer/dashboard' },
        { label: 'My Clients', path: '/trainer/clients' },
        { label: 'Workout Templates', path: '/trainer/templates' },
        { label: 'Profile', path: '/trainer/profile' },
      ];
    }
    return [
      { label: 'Dashboard', path: '/dashboard' },
      { label: 'Workouts', path: '/workouts' },
      { label: 'Nutrition Log', path: '/nutrition' },
      { label: 'Progress Tracking', path: '/progress' },
      { label: 'Goals', path: '/goals' },
      { label: 'Browse Trainers', path: '/browse-trainers' },
    ];
  }, [user]);

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (!modalContent.current) return;
      if (!modalOpen || modalContent.current.contains(target)) return;
      setModalOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!modalOpen || keyCode !== 27) return;
      setModalOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  });

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchValue.trim()) {
      navigate(`/workouts?query=${encodeURIComponent(searchValue.trim())}`);
      setSearchValue('');
      setModalOpen(false);
    }
  };

  return (
    <>
      {/* Modal backdrop */}
      <Transition
        className="fixed inset-0 bg-gray-900/30 dark:bg-gray-900/60 z-50 transition-opacity"
        show={modalOpen}
        enter="transition ease-out duration-200"
        enterStart="opacity-0"
        enterEnd="opacity-100"
        leave="transition ease-out duration-100"
        leaveStart="opacity-100"
        leaveEnd="opacity-0"
        aria-hidden="true"
      />
      {/* Modal dialog */}
      <Transition
        id={id}
        className="fixed inset-0 z-50 overflow-hidden flex items-start top-20 mb-4 justify-center px-4 sm:px-6"
        role="dialog"
        aria-modal="true"
        show={modalOpen}
        enter="transition ease-in-out duration-200"
        enterStart="opacity-0 translate-y-4"
        enterEnd="opacity-100 translate-y-0"
        leave="transition ease-in-out duration-200"
        leaveStart="opacity-100 translate-y-0"
        leaveEnd="opacity-0 translate-y-4"
      >
        <div
          ref={modalContent}
          className="bg-gray-50 dark:bg-gray-800 border border-transparent dark:border-gray-700/60 rounded-lg shadow-lg overflow-hidden max-w-2xl w-full mx-auto"
        >
          {/* Search form */}
          <form onSubmit={handleSearch} className="border-b border-gray-200 dark:border-gray-700/60">
            <div className="flex items-center">
              <label htmlFor={searchId} className="sr-only">Search</label>
              <input
                id={searchId}
                className="w-full dark:text-gray-100 dark:bg-gray-800 border-0 focus:ring-transparent dark:focus:ring-transparent placeholder-gray-400 dark:placeholder-gray-500 appearance-none py-3 pl-4 pr-4"
                type="search"
                placeholder="Search workouts, meals, goals..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
              <button
                className="flex items-center justify-center px-4 py-2 mr-2 text-sm font-medium text-violet-500 hover:text-violet-600 dark:hover:text-violet-400"
                type="submit"
              >
                <svg className="fill-current text-gray-400 dark:text-gray-500 shrink-0 mr-2" width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7 14c-3.86 0-7-3.14-7-7s3.14-7 7-7 7 3.14 7 7-3.14 7-7 7zM7 2C4.243 2 2 4.243 2 7s2.243 5 5 5 5-2.243 5-5-2.243-5-5-5z" />
                  <path d="M15.707 14.293L13.314 11.9a8.019 8.019 0 01-1.414 1.414l2.393 2.393a.997.997 0 001.414 0 .999.999 0 000-1.414z" />
                </svg>
                Search
              </button>
            </div>
          </form>
          {/* Quick links */}
          <div className="py-4 px-2">
            <div className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase px-2 mb-2">Quick Links</div>
            <ul className="text-sm">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    className="flex items-center p-2 text-gray-800 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700/20 rounded-lg"
                    to={link.path}
                    onClick={() => setModalOpen(false)}
                  >
                    <svg className="fill-current text-gray-400 dark:text-gray-500 shrink-0 mr-3" width="16" height="16" viewBox="0 0 16 16">
                      <path d="M15.707 14.293v.001a1 1 0 01-1.414 1.414L11.185 12.6A6.935 6.935 0 017 14a7.016 7.016 0 01-5.173-2.308l-1.537 1.3L0 8l4.873 1.12-1.521 1.285a4.971 4.971 0 008.59-2.835l1.979.454a6.971 6.971 0 01-1.321 3.157l3.107 3.112zM14 6L9.127 4.88l1.521-1.28a4.971 4.971 0 00-8.59 2.83L.084 5.976a6.977 6.977 0 0112.089-3.668l1.537-1.3L14 6z" />
                    </svg>
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Transition>
    </>
  );
}

export default ModalSearch;
