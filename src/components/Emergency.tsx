import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Phone, 
  MessageCircle,
  Stethoscope,
  Ambulance,
  UserCheck,
  Clock,
  Shield,
  X,
  Check,
  Star
} from 'lucide-react';

interface EmergencyContact {
  id: string;
  name: string;
  relation: string;
  phone: string;
  isPrimary: boolean;
  avatar?: string;
}

export const Emergency: React.FC = () => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isEmergencyActive, setIsEmergencyActive] = useState(false);
  const [lastEmergencyTime, setLastEmergencyTime] = useState<Date | null>(null);

  const emergencyContacts: EmergencyContact[] = [
    {
      id: '1',
      name: 'Sarah Johnson',
      relation: 'Daughter',
      phone: '(555) 123-4567',
      isPrimary: true
    },
    {
      id: '2',
      name: 'Dr. Michael Chen',
      relation: 'Primary Doctor',
      phone: '(555) 987-6543',
      isPrimary: false
    },
    {
      id: '3',
      name: 'Robert Thompson',
      relation: 'Son',
      phone: '(555) 234-5678',
      isPrimary: false
    },
    {
      id: '4',
      name: 'Betty Williams',
      relation: 'Neighbor',
      phone: '(555) 345-6789',
      isPrimary: false
    }
  ];

  const handleEmergencyAlert = () => {
    setIsEmergencyActive(true);
    setLastEmergencyTime(new Date());
    setShowConfirmModal(false);
    
    // Simulate emergency alert being sent
    setTimeout(() => {
      setIsEmergencyActive(false);
      alert('Emergency alert sent to all emergency contacts!');
    }, 3000);
  };

  const handleCall = (phone: string, name: string) => {
    // In a real implementation, this would initiate a call
    console.log(`Calling ${name} at ${phone}`);
    window.location.href = `tel:${phone}`;
  };

  const handleMessage = (phone: string, name: string) => {
    // In a real implementation, this would open messaging app
    console.log(`Messaging ${name} at ${phone}`);
    window.location.href = `sms:${phone}`;
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const formatLastEmergency = (date: Date) => {
    return date.toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <main className="flex-1 ml-70 p-6 bg-eldercare-background" role="main" aria-label="Emergency Help">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="p-3 bg-red-100 rounded-full">
              <AlertTriangle size={32} className="text-red-600" aria-hidden="true" />
            </div>
            <h1 className="text-3xl font-nunito font-bold text-eldercare-secondary">
              Emergency Help
            </h1>
          </div>
          <p className="text-lg font-opensans text-eldercare-text max-w-2xl mx-auto">
            In case of urgent need, use the buttons below to contact help immediately.
          </p>
        </header>

        {/* Last Emergency Alert Info */}
        {lastEmergencyTime && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl text-center">
            <div className="flex items-center justify-center space-x-2 text-blue-700">
              <Clock size={16} aria-hidden="true" />
              <span className="text-sm font-opensans">
                Last Emergency Sent: {formatLastEmergency(lastEmergencyTime)}
              </span>
            </div>
          </div>
        )}

        {/* Primary Emergency Button */}
        <section className="mb-8" aria-labelledby="emergency-button-section">
          <div className="flex justify-center mb-6">
            <button
              onClick={() => setShowConfirmModal(true)}
              disabled={isEmergencyActive}
              className={`
                w-48 h-48 rounded-full shadow-xl flex flex-col items-center justify-center
                transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-offset-4
                ${isEmergencyActive
                  ? 'bg-orange-500 animate-pulse cursor-not-allowed focus:ring-orange-500'
                  : 'bg-red-500 hover:bg-red-600 hover:scale-105 focus:ring-red-500'
                }
              `}
              aria-label={isEmergencyActive ? 'Emergency alert being sent' : 'Send emergency alert'}
              title={isEmergencyActive ? 'Sending emergency alert...' : 'Tap to send emergency alert'}
            >
              <AlertTriangle size={40} className="text-white mb-3" aria-hidden="true" />
              <span className="text-white font-nunito font-bold text-sm text-center leading-tight px-4 max-w-full">
                {isEmergencyActive ? 'Sending Alert...' : 'Send Emergency Alert'}
              </span>
            </button>
          </div>
          
          <p className="text-center text-base font-opensans text-eldercare-text max-w-md mx-auto">
            This will immediately notify all your emergency contacts with your location and request for help.
          </p>
        </section>

        {/* Quick Access Buttons */}
        <section className="mb-8" aria-labelledby="quick-access-section">
          <h2 id="quick-access-section" className="text-xl font-nunito font-bold text-eldercare-secondary text-center mb-6">
            Quick Emergency Contacts
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
            {/* Call Doctor */}
            <button
              onClick={() => handleCall('(555) 987-6543', 'Dr. Michael Chen')}
              className="flex flex-col items-center space-y-3 p-6 bg-white border-2 border-blue-200 rounded-xl shadow-md hover:shadow-lg hover:border-blue-300 transition-all duration-300 focus:outline-none focus:ring-3 focus:ring-blue-500 focus:ring-offset-2 min-h-touch"
              aria-label="Call your doctor"
            >
              <div className="p-3 bg-blue-100 rounded-full">
                <Stethoscope size={24} className="text-blue-600" aria-hidden="true" />
              </div>
              <span className="font-opensans font-semibold text-eldercare-secondary text-center">
                Call Doctor
              </span>
              <span className="text-sm font-opensans text-eldercare-text-light">
                Dr. Michael Chen
              </span>
            </button>

            {/* Call Ambulance */}
            <button
              onClick={() => handleCall('911', 'Emergency Services')}
              className="flex flex-col items-center space-y-3 p-6 bg-white border-2 border-red-200 rounded-xl shadow-md hover:shadow-lg hover:border-red-300 transition-all duration-300 focus:outline-none focus:ring-3 focus:ring-red-500 focus:ring-offset-2 min-h-touch"
              aria-label="Call ambulance"
            >
              <div className="p-3 bg-red-100 rounded-full">
                <Ambulance size={24} className="text-red-600" aria-hidden="true" />
              </div>
              <span className="font-opensans font-semibold text-eldercare-secondary text-center">
                Call Ambulance
              </span>
              <span className="text-sm font-opensans text-eldercare-text-light">
                911
              </span>
            </button>

            {/* Call Primary Caregiver */}
            <button
              onClick={() => handleCall('(555) 123-4567', 'Sarah Johnson')}
              className="flex flex-col items-center space-y-3 p-6 bg-white border-2 border-green-200 rounded-xl shadow-md hover:shadow-lg hover:border-green-300 transition-all duration-300 focus:outline-none focus:ring-3 focus:ring-green-500 focus:ring-offset-2 min-h-touch"
              aria-label="Call primary caregiver"
            >
              <div className="p-3 bg-green-100 rounded-full">
                <UserCheck size={24} className="text-green-600" aria-hidden="true" />
              </div>
              <span className="font-opensans font-semibold text-eldercare-secondary text-center">
                Call Primary Caregiver
              </span>
              <span className="text-sm font-opensans text-eldercare-text-light">
                Sarah Johnson
              </span>
            </button>
          </div>
        </section>

        {/* Emergency Contacts List */}
        <section aria-labelledby="contacts-section">
          <h2 id="contacts-section" className="text-xl font-nunito font-bold text-eldercare-secondary mb-6">
            Emergency Contacts
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {emergencyContacts.map((contact) => (
              <div
                key={contact.id}
                className="bg-white rounded-xl shadow-md border border-eldercare-primary/10 p-6 hover:shadow-lg transition-all duration-300"
                role="article"
                aria-labelledby={`contact-${contact.id}-name`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <div className="w-12 h-12 bg-eldercare-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-sm font-nunito font-bold text-eldercare-primary">
                          {getInitials(contact.name)}
                        </span>
                      </div>
                      {contact.isPrimary && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center">
                          <Star size={10} className="text-white" aria-hidden="true" />
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <h3 
                        id={`contact-${contact.id}-name`}
                        className="font-nunito font-bold text-eldercare-secondary"
                      >
                        {contact.name}
                      </h3>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-opensans text-eldercare-text">
                          {contact.relation}
                        </span>
                        {contact.isPrimary && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-opensans font-medium bg-yellow-100 text-yellow-800">
                            Primary
                          </span>
                        )}
                      </div>
                      <p className="text-sm font-opensans text-eldercare-text-light">
                        {contact.phone}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => handleCall(contact.phone, contact.name)}
                    className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-eldercare-primary hover:bg-eldercare-primary-dark text-white rounded-lg font-opensans font-medium text-sm min-h-touch transition-all duration-300 focus:outline-none focus:ring-3 focus:ring-eldercare-primary focus:ring-offset-2"
                    aria-label={`Call ${contact.name}`}
                  >
                    <Phone size={16} aria-hidden="true" />
                    <span>Call</span>
                  </button>
                  
                  <button
                    onClick={() => handleMessage(contact.phone, contact.name)}
                    className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-white border-2 border-eldercare-primary text-eldercare-primary hover:bg-eldercare-primary hover:text-white rounded-lg font-opensans font-medium text-sm min-h-touch transition-all duration-300 focus:outline-none focus:ring-3 focus:ring-eldercare-primary focus:ring-offset-2"
                    aria-label={`Message ${contact.name}`}
                  >
                    <MessageCircle size={16} aria-hidden="true" />
                    <span>Message</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Emergency Confirmation Modal */}
        {showConfirmModal && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            role="dialog"
            aria-modal="true"
            aria-labelledby="emergency-confirm-title"
          >
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
              <div className="text-center mb-6">
                <div className="p-4 bg-red-100 rounded-full w-fit mx-auto mb-4">
                  <AlertTriangle size={48} className="text-red-600" aria-hidden="true" />
                </div>
                <h3 id="emergency-confirm-title" className="text-2xl font-nunito font-bold text-eldercare-secondary mb-2">
                  Send Emergency Alert?
                </h3>
                <p className="text-base font-opensans text-eldercare-text">
                  This will immediately notify all your emergency contacts that you need help.
                </p>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="flex-1 px-6 py-4 border-2 border-gray-300 text-eldercare-secondary rounded-xl font-opensans font-bold text-lg min-h-touch transition-all duration-300 focus:outline-none focus:ring-3 focus:ring-gray-300 focus:ring-offset-2 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEmergencyAlert}
                  className="flex-1 px-6 py-4 bg-red-500 hover:bg-red-600 text-white rounded-xl font-opensans font-bold text-lg min-h-touch transition-all duration-300 focus:outline-none focus:ring-3 focus:ring-red-500 focus:ring-offset-2"
                >
                  Yes, Send Alert
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};