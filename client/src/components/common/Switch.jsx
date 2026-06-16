import React from 'react';

function Switch({ label, checked, onChange, disabled, className = '', id, name }) {
  const inputId = id || name;
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="form-switch">
        <input
          type="checkbox"
          id={inputId}
          name={name}
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className="sr-only"
        />
        <label
          htmlFor={inputId}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
            checked ? 'bg-violet-500' : 'bg-gray-400 dark:bg-gray-700'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <span
            className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform ${
              checked ? 'translate-x-5' : 'translate-x-0.5'
            }`}
          />
        </label>
      </div>
      {label && (
        <label htmlFor={inputId} className="text-sm text-gray-600 dark:text-gray-400 cursor-pointer">
          {label}
        </label>
      )}
    </div>
  );
}

export default Switch;
