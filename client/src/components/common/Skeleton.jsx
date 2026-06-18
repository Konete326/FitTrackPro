import React from 'react';

function Skeleton({ type = 'text', count = 1, className = '' }) {
  const base = 'animate-pulse bg-gray-200 dark:bg-gray-700 rounded';

  const types = {
    text: <div className={`${base} h-4 w-full ${className}`} />,
    title: <div className={`${base} h-7 w-3/4 ${className}`} />,
    circle: <div className={`${base} rounded-full w-12 h-12 ${className}`} />,
    rect: <div className={`${base} h-40 w-full ${className}`} />,
    card: (
      <div className={`bg-gray-50 dark:bg-gray-900 rounded-xl p-5 shadow-xs ${className}`}>
        <div className={`${base} h-4 w-1/3 mb-4`} />
        <div className={`${base} h-8 w-1/2 mb-4`} />
        <div className={`${base} h-3 w-full mb-2`} />
        <div className={`${base} h-3 w-4/5`} />
      </div>
    ),
    table: (
      <div className={`bg-gray-50 dark:bg-gray-900 rounded-xl shadow-xs overflow-hidden ${className}`}>
        <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
          <div className={`${base} h-4 w-1/4`} />
        </div>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="px-5 py-3 flex gap-4 border-b border-gray-100 dark:border-gray-700/60">
            <div className={`${base} h-4 w-1/4`} />
            <div className={`${base} h-4 w-1/3`} />
            <div className={`${base} h-4 w-1/5`} />
          </div>
        ))}
      </div>
    ),
  };

  if (count > 1 && type !== 'card' && type !== 'table') {
    return (
      <div className="space-y-3">
        {[...Array(count)].map((_, i) => (
          <React.Fragment key={i}>{types[type]}</React.Fragment>
        ))}
      </div>
    );
  }

  return types[type] || types.text;
}

export default Skeleton;
