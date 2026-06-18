import React from 'react';

function Card({ children, className = '', padding = true, hover = false }) {
  return (
    <div className={`bg-gray-50 dark:bg-gray-900 shadow-xs rounded-xl ${padding ? 'p-5' : ''} ${hover ? 'hover:shadow-md transition-shadow duration-200' : ''} ${className}`}>
      {children}
    </div>
  );
}

function CardHeader({ children, className = '' }) {
  return (
    <div className={`px-5 py-4 border-b border-gray-100 dark:border-gray-700/60 ${className}`}>
      {children}
    </div>
  );
}

function CardBody({ children, className = '' }) {
  return (
    <div className={`px-5 py-4 ${className}`}>
      {children}
    </div>
  );
}

function CardFooter({ children, className = '' }) {
  return (
    <div className={`px-5 py-4 border-t border-gray-100 dark:border-gray-700/60 ${className}`}>
      {children}
    </div>
  );
}

Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;

export default Card;
