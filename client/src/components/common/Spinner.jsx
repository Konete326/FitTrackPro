import React from 'react';

function Spinner({ size = 'md', fullscreen = false, className = '' }) {
  const sizes = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  const spinner = (
    <div className={`${sizes[size]} border-4 border-violet-500 border-t-transparent rounded-full animate-spin ${className}`} />
  );

  if (fullscreen) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        {spinner}
      </div>
    );
  }

  return spinner;
}

export default Spinner;
