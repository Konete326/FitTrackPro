import React from 'react';

function ComingSoon({ title, description }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="mb-6">
        <svg className="w-20 h-20 mx-auto text-violet-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-3">
        {title}
      </h2>
      <p className="text-gray-500 dark:text-gray-400 max-w-md">
        {description || 'This page is under construction and will be available soon.'}
      </p>
      <div className="mt-8">
        <span className="inline-flex items-center px-4 py-2 rounded-lg bg-violet-500/10 text-violet-500 text-sm font-medium">
          Coming Soon
        </span>
      </div>
    </div>
  );
}

export default ComingSoon;
