import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorMessageProps {
  title: string;
  message: string;
  onRetry?: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  title,
  message,
  onRetry,
}) => {
  return (
    <div 
      className="bg-red-50 border-2 border-red-200 rounded-xl p-8 text-center"
      role="alert"
      aria-live="assertive"
    >
      <div className="flex justify-center mb-4">
        <AlertCircle size={48} className="text-red-500" aria-hidden="true" />
      </div>
      
      <h3 className="text-2xl font-nunito font-bold text-red-700 mb-2">
        {title}
      </h3>
      
      <p className="text-base font-opensans text-red-600 mb-6 leading-relaxed">
        {message}
      </p>
      
      {onRetry && (
        <button
          onClick={onRetry}
          className="
            inline-flex items-center space-x-2 px-6 py-3 rounded-lg
            bg-red-500 hover:bg-red-600 text-white font-opensans font-semibold text-base
            min-h-touch transition-all duration-300
            focus:outline-none focus:ring-3 focus:ring-red-500 focus:ring-offset-2
          "
        >
          <RefreshCw size={20} aria-hidden="true" />
          <span>Try Again</span>
        </button>
      )}
    </div>
  );
};