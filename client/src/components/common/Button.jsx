import React from 'react';

const variants = {
  primary: 'bg-violet-600 text-white hover:bg-violet-700 dark:hover:bg-violet-700',
  secondary: 'bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600',
  danger: 'bg-red-500 text-white hover:bg-red-600 dark:hover:bg-red-600',
  ghost: 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/30',
  success: 'bg-green-500 text-white hover:bg-green-600 dark:hover:bg-green-600',
};

const sizes = {
  xs: 'px-2 py-0.5 text-xs',
  sm: 'px-2 py-1 text-sm',
  md: 'px-3 py-2 text-sm',
  lg: 'px-4 py-3 text-sm',
};

function Button({ children, variant = 'primary', size = 'md', loading, disabled, icon, iconRight, className = '', type = 'button', ...props }) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center font-medium rounded-lg shadow-xs transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/50 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {loading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      )}
      {!loading && icon && <span className="mr-2">{icon}</span>}
      {children}
      {iconRight && <span className="ml-2">{iconRight}</span>}
    </button>
  );
}

export default Button;
