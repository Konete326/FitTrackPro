import React from 'react';

const badgeVariants = {
  success: 'text-green-700 bg-green-500/20',
  warning: 'text-yellow-700 bg-yellow-500/20',
  danger: 'text-red-700 bg-red-500/20',
  info: 'text-sky-700 bg-sky-500/20',
  default: 'text-gray-700 dark:text-gray-300 bg-gray-500/20',
  violet: 'text-violet-700 bg-violet-500/20',
};

const badgeSizes = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-xs',
  lg: 'px-3 py-1 text-sm',
};

function Badge({ children, variant = 'default', size = 'md', closeable, onClose, className = '' }) {
  return (
    <span className={`inline-flex items-center font-medium rounded-full ${badgeVariants[variant]} ${badgeSizes[size]} ${className}`}>
      {children}
      {closeable && (
        <button
          onClick={onClose}
          className="ml-1 hover:opacity-70 transition"
          aria-label="Remove"
        >
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      )}
    </span>
  );
}

export default Badge;
