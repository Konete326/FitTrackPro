import React from 'react';

function Textarea({ label, error, maxLength, className = '', ...props }) {
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label}
        </label>
      )}
      <textarea
        className={`form-textarea w-full !bg-gray-50 dark:!bg-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-700/60 rounded-lg focus:ring-0 focus:border-gray-300 dark:focus:border-gray-600 transition ${error ? 'border-red-500 focus:border-red-500' : ''}`}
        maxLength={maxLength}
        {...props}
      />
      <div className="flex justify-between mt-1">
        {error ? <p className="text-sm text-red-500">{error}</p> : <span />}
        {maxLength && (
          <p className="text-xs text-gray-400 dark:text-gray-500">
            {(props.value || '').length}/{maxLength}
          </p>
        )}
      </div>
    </div>
  );
}

export default Textarea;
