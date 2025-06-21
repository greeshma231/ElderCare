import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  message = 'Loading...' 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div 
      className="flex flex-col items-center justify-center p-8"
      role="status"
      aria-live="polite"
    >
      <div 
        className={`
          ${sizeClasses[size]} 
          border-4 border-eldercare-primary/20 border-t-eldercare-primary 
          rounded-full animate-spin mb-4
        `}
        aria-hidden="true"
      />
      <p className="text-base font-opensans text-eldercare-text">
        {message}
      </p>
    </div>
  );
};