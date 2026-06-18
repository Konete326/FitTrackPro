import React from 'react';

function Select({ label, error, options = [], placeholder, className = '', ...props }) {
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label}
        </label>
      )}
      <select
        className={`form-select w-full !bg-gray-50 dark:!bg-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-700/60 rounded-lg focus:ring-0 focus:border-gray-300 dark:focus:border-gray-600 transition ${error ? 'border-red-500 focus:border-red-500' : ''}`}
        {...props}
      >
        {placeholder && <option value="" className="bg-gray-50 dark:bg-gray-900">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-gray-50 dark:bg-gray-900">{opt.label}</option>
        ))}
      </select>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
}

export default Select;
