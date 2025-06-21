import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface CardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  buttonText: string;
  onButtonClick: () => void;
  urgent?: boolean;
  disabled?: boolean;
}

export const Card: React.FC<CardProps> = ({
  title,
  description,
  icon: Icon,
  buttonText,
  onButtonClick,
  urgent = false,
  disabled = false,
}) => {
  return (
    <div 
      className={`
        bg-white rounded-xl shadow-md border-2 p-8 h-full flex flex-col
        transition-all duration-300 hover:shadow-lg
        ${urgent ? 'border-red-400 bg-red-50' : 'border-eldercare-primary/20'}
        ${disabled ? 'opacity-50' : ''}
      `}
      role="article"
      aria-labelledby={`card-title-${title.replace(/\s+/g, '-').toLowerCase()}`}
    >
      <div className="flex items-start space-x-4 mb-6">
        <div className={`
          p-3 rounded-lg flex-shrink-0
          ${urgent ? 'bg-red-100' : 'bg-eldercare-primary/10'}
        `}>
          <Icon 
            size={32} 
            className={urgent ? 'text-red-600' : 'text-eldercare-primary'} 
            aria-hidden="true" 
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3 
            id={`card-title-${title.replace(/\s+/g, '-').toLowerCase()}`}
            className="text-2xl font-nunito font-bold text-eldercare-secondary mb-2"
          >
            {title}
          </h3>
          <p className="text-base font-opensans text-eldercare-text leading-relaxed">
            {description}
          </p>
        </div>
      </div>
      
      <div className="mt-auto pt-4">
        <button
          onClick={onButtonClick}
          disabled={disabled}
          className={`
            w-full py-4 px-6 rounded-lg font-opensans font-semibold text-base
            min-h-touch transition-all duration-300
            focus:outline-none focus:ring-3 focus:ring-eldercare-primary focus:ring-offset-2
            ${disabled 
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
              : urgent
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : 'bg-eldercare-primary hover:bg-eldercare-primary-dark text-white'
            }
          `}
          aria-describedby={`card-title-${title.replace(/\s+/g, '-').toLowerCase()}`}
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
};