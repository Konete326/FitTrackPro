import React from 'react';
import { Link } from 'react-router-dom';

function PageHeader({ title, description, breadcrumbs, actions, className = '' }) {
  return (
    <div className={`mb-8 ${className}`}>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="flex items-center gap-2 text-sm mb-4">
          {breadcrumbs.map((crumb, i) => (
            <React.Fragment key={i}>
              {i > 0 && <span className="text-gray-400 dark:text-gray-500">/</span>}
              {crumb.to ? (
                <Link to={crumb.to} className="text-violet-500 hover:text-violet-600 dark:hover:text-violet-400 transition">
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-gray-500 dark:text-gray-400">{crumb.label}</span>
              )}
            </React.Fragment>
          ))}
        </nav>
      )}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100">{title}</h1>
          {description && <p className="mt-1 text-gray-500 dark:text-gray-400">{description}</p>}
        </div>
        {actions && (
          <div className="flex items-center gap-3">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}

export default PageHeader;
