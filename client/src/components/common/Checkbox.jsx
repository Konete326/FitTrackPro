import React from 'react';

function Checkbox({ label, error, className = '', id, ...props }) {
  const inputId = id || props.name;
  return (
    <div className={className}>
      <label htmlFor={inputId} className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          id={inputId}
          className="form-checkbox text-violet-500 border-gray-300 dark:border-gray-700/60 rounded-sm focus:ring-0 focus:ring-offset-0 focus-visible:ring-2 focus-visible:ring-violet-500/50"
          {...props}
        />
        {label && <span className="text-sm text-gray-600 dark:text-gray-400">{label}</span>}
      </label>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
}

export default Checkbox;
