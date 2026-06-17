import React from 'react';

function StatCard({ title, value, icon, trend, trendValue, trendLabel, color = 'violet', className = '' }) {
  const colors = {
    violet: 'bg-violet-500/10 text-violet-500',
    sky: 'bg-sky-500/10 text-sky-500',
    green: 'bg-green-500/10 text-green-500',
    red: 'bg-red-500/10 text-red-500',
    yellow: 'bg-yellow-500/10 text-yellow-500',
  };

  return (
    <div className={`bg-gray-50 dark:bg-gray-800 shadow-xs rounded-xl p-5 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colors[color]}`}>
          {icon}
        </div>
        {trendValue !== undefined && (
          <div className={`flex items-center text-sm font-medium ${trend === 'up' ? 'text-green-500' : trend === 'down' ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'}`}>
            {trend === 'up' && (
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
              </svg>
            )}
            {trend === 'down' && (
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
              </svg>
            )}
            {trendValue}
            {trendLabel && <span className="ml-1 text-gray-400 dark:text-gray-500 font-normal">{trendLabel}</span>}
          </div>
        )}
      </div>
      <div className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-1">{value}</div>
      <div className="text-sm text-gray-500 dark:text-gray-400">{title}</div>
    </div>
  );
}

export default StatCard;
