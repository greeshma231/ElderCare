import React, { useState } from 'react';
import { 
  Home, 
  Pill, 
  UserCheck, 
  Phone, 
  MessageCircle,
  Heart,
  Smile,
  Mic,
  Settings
} from 'lucide-react';

interface NavigationItem {
  id: string;
  label: string;
  icon: React.ElementType;
  href: string;
}

const navigationItems: NavigationItem[] = [
  { id: 'home', label: 'Home', icon: Home, href: '#home' },
  { id: 'medications', label: 'Medications', icon: Pill, href: '#medications' },
  { id: 'caregivers', label: 'Caregivers', icon: UserCheck, href: '#caregivers' },
  { id: 'emergency', label: 'Emergency', icon: Phone, href: '#emergency' },
  { id: 'chat-assistant', label: 'Chat Assistant', icon: MessageCircle, href: '#chat-assistant' },
  { id: 'health-wellbeing', label: 'Health & Wellbeing', icon: Heart, href: '#health-wellbeing' },
  { id: 'emotional-wellbeing', label: 'Emotional Wellbeing', icon: Smile, href: '#emotional-wellbeing' },
  { id: 'settings', label: 'Settings', icon: Settings, href: '#settings' },
];

interface SidebarProps {
  activeSection?: string;
  onSectionChange?: (section: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  activeSection = 'home', 
  onSectionChange 
}) => {
  const [activeItem, setActiveItem] = useState(activeSection);

  const handleNavigation = (itemId: string) => {
    setActiveItem(itemId);
    onSectionChange?.(itemId);
  };

  const handleKeyDown = (event: React.KeyboardEvent, itemId: string) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleNavigation(itemId);
    }
  };

  return (
    <aside 
      className="fixed left-0 top-0 h-full w-70 bg-eldercare-sidebar border-r border-eldercare-primary/20 z-40 overflow-y-auto"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="flex flex-col h-full">
        {/* Logo and Tagline */}
        <div className="flex flex-col items-center justify-center py-4 px-6">
          <img 
            src="/logo-Photoroom.png" 
            alt="ElderCare Logo" 
            className="w-36 h-36 object-contain mb-2"
          />
          <p className="text-sm font-opensans text-eldercare-text-light text-center italic">
            "Because our elders deserve the best."
          </p>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-4 pb-4" role="menu">
          <ul className="space-y-2" role="none">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeItem === item.id;
              
              return (
                <li key={item.id} role="none">
                  <button
                    onClick={() => handleNavigation(item.id)}
                    onKeyDown={(e) => handleKeyDown(e, item.id)}
                    className={`
                      w-full flex items-center space-x-3 px-3 py-3 rounded-lg
                      min-h-touch min-w-touch transition-all duration-300
                      font-opensans font-medium text-left text-sm
                      focus:outline-none focus:ring-3 focus:ring-eldercare-primary focus:ring-offset-2
                      ${isActive 
                        ? 'bg-eldercare-primary text-white shadow-md' 
                        : 'text-eldercare-secondary hover:bg-eldercare-primary/10 hover:text-eldercare-primary'
                      }
                    `}
                    role="menuitem"
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <Icon 
                      size={20} 
                      className="flex-shrink-0" 
                      aria-hidden="true" 
                    />
                    <span className="truncate">{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-eldercare-primary/20">
          <p className="text-xs font-opensans text-eldercare-text-light text-center">
            Need help? Call <br/>
            <a 
              href="tel:1-800-ELDERCARE" 
              className="text-eldercare-primary font-medium hover:underline focus:outline-none focus:ring-2 focus:ring-eldercare-primary rounded"
            >
              1-800-ELDERCARE
            </a>
          </p>
        </div>
      </div>
    </aside>
  );
};