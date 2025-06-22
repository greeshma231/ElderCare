import React, { useState } from 'react';
import { 
  User, 
  Edit3, 
  Volume2,
  VolumeX,
  Bell,
  BellOff,
  Info,
  X,
  Settings as SettingsIcon,
  LogOut
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface AppSettings {
  voiceAssistant: boolean;
  medicationAlerts: boolean;
  appointmentAlerts: boolean;
}

export const SettingsProfile: React.FC = () => {
  const { signOut } = useAuth();
  const [settings, setSettings] = useState<AppSettings>({
    voiceAssistant: true,
    medicationAlerts: true,
    appointmentAlerts: true
  });

  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleSettingChange = (key: keyof AppSettings, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleLogout = async () => {
    try {
      await signOut();
      setShowLogoutConfirm(false);
      // The AuthContext will handle redirecting to the login page
    } catch (error) {
      console.error('Logout error:', error);
      // Still close the modal even if there's an error
      setShowLogoutConfirm(false);
    }
  };

  return (
    <main className="flex-1 ml-70 p-6 bg-eldercare-background" role="main" aria-label="Settings and Profile">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <header className="text-center mb-6">
          <div className="flex items-center justify-center space-x-3 mb-3">
            <div className="p-2 bg-eldercare-primary/10 rounded-full">
              <SettingsIcon size={24} className="text-eldercare-primary" aria-hidden="true" />
            </div>
            <h1 className="text-2xl font-nunito font-bold text-eldercare-secondary">
              Settings & Profile
            </h1>
          </div>
          <p className="text-base font-opensans text-eldercare-text">
            Customize your ElderCare experience
          </p>
        </header>

        {/* User Profile Section */}
        <section className="bg-white rounded-xl shadow-md border border-eldercare-primary/10 p-6" aria-labelledby="profile-section">
          <div className="flex items-center justify-between mb-4">
            <h2 id="profile-section" className="text-xl font-nunito font-bold text-eldercare-secondary">
              Your Profile
            </h2>
            <button
              onClick={() => setShowEditProfile(true)}
              className="flex items-center space-x-2 px-3 py-2 bg-eldercare-primary hover:bg-eldercare-primary-dark text-white rounded-lg font-opensans font-medium text-sm transition-all duration-300 focus:outline-none focus:ring-3 focus:ring-eldercare-primary focus:ring-offset-2"
            >
              <Edit3 size={16} aria-hidden="true" />
              <span>Edit</span>
            </button>
          </div>

          <div className="flex items-center space-x-4">
            {/* Profile Avatar */}
            <div className="w-16 h-16 bg-eldercare-primary/10 rounded-full flex items-center justify-center">
              <span className="text-lg font-nunito font-bold text-eldercare-primary">
                ST
              </span>
            </div>
            
            {/* Profile Info */}
            <div className="flex-1">
              <h3 className="text-lg font-nunito font-bold text-eldercare-secondary mb-1">
                Shelly Thompson, Age 72, Female
              </h3>
              <div>
                <span className="text-sm font-opensans font-medium text-eldercare-text-light">Primary Caregiver:</span>
                <span className="text-sm font-opensans text-eldercare-secondary ml-2">Sarah Johnson</span>
              </div>
            </div>
          </div>
        </section>

        {/* Voice Assistant */}
        <section className="bg-white rounded-xl shadow-md border border-eldercare-primary/10 p-6" aria-labelledby="voice-section">
          <h2 id="voice-section" className="text-xl font-nunito font-bold text-eldercare-secondary mb-4">
            Voice Assistant
          </h2>
          
          <div className="flex items-center justify-between p-4 bg-eldercare-background/30 rounded-xl">
            <div className="flex items-center space-x-3">
              {settings.voiceAssistant ? (
                <Volume2 size={20} className="text-eldercare-primary" aria-hidden="true" />
              ) : (
                <VolumeX size={20} className="text-gray-500" aria-hidden="true" />
              )}
              <div>
                <p className="font-opensans font-medium text-eldercare-secondary">
                  Enable voice interaction with Mitra
                </p>
                <p className="text-sm font-opensans text-eldercare-text-light">
                  Talk to Mitra using your voice
                </p>
              </div>
            </div>
            <button
              onClick={() => handleSettingChange('voiceAssistant', !settings.voiceAssistant)}
              className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-3 focus:ring-eldercare-primary focus:ring-offset-2 ${
                settings.voiceAssistant ? 'bg-eldercare-primary' : 'bg-gray-300'
              }`}
              role="switch"
              aria-checked={settings.voiceAssistant}
              aria-label="Toggle voice assistant"
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform duration-300 ${
                  settings.voiceAssistant ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </section>

        {/* Notifications */}
        <section className="bg-white rounded-xl shadow-md border border-eldercare-primary/10 p-6" aria-labelledby="notifications-section">
          <h2 id="notifications-section" className="text-xl font-nunito font-bold text-eldercare-secondary mb-4">
            Notifications
          </h2>

          <div className="space-y-3">
            {/* Medication Alerts */}
            <div className="flex items-center justify-between p-4 bg-eldercare-background/30 rounded-xl">
              <div className="flex items-center space-x-3">
                {settings.medicationAlerts ? (
                  <Bell size={20} className="text-eldercare-primary" aria-hidden="true" />
                ) : (
                  <BellOff size={20} className="text-gray-500" aria-hidden="true" />
                )}
                <div>
                  <p className="font-opensans font-medium text-eldercare-secondary">
                    Medication Alerts
                  </p>
                  <p className="text-sm font-opensans text-eldercare-text-light">
                    Get reminders for your medications
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleSettingChange('medicationAlerts', !settings.medicationAlerts)}
                className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-3 focus:ring-eldercare-primary focus:ring-offset-2 ${
                  settings.medicationAlerts ? 'bg-eldercare-primary' : 'bg-gray-300'
                }`}
                role="switch"
                aria-checked={settings.medicationAlerts}
                aria-label="Toggle medication alerts"
              >
                <span
                  className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform duration-300 ${
                    settings.medicationAlerts ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Appointment Alerts */}
            <div className="flex items-center justify-between p-4 bg-eldercare-background/30 rounded-xl">
              <div className="flex items-center space-x-3">
                {settings.appointmentAlerts ? (
                  <Bell size={20} className="text-eldercare-primary" aria-hidden="true" />
                ) : (
                  <BellOff size={20} className="text-gray-500" aria-hidden="true" />
                )}
                <div>
                  <p className="font-opensans font-medium text-eldercare-secondary">
                    Appointment Alerts
                  </p>
                  <p className="text-sm font-opensans text-eldercare-text-light">
                    Get reminders for your appointments
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleSettingChange('appointmentAlerts', !settings.appointmentAlerts)}
                className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-3 focus:ring-eldercare-primary focus:ring-offset-2 ${
                  settings.appointmentAlerts ? 'bg-eldercare-primary' : 'bg-gray-300'
                }`}
                role="switch"
                aria-checked={settings.appointmentAlerts}
                aria-label="Toggle appointment alerts"
              >
                <span
                  className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform duration-300 ${
                    settings.appointmentAlerts ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </section>

        {/* App Info & Account */}
        <section className="bg-white rounded-xl shadow-md border border-eldercare-primary/10 p-6" aria-labelledby="app-info-section">
          <h2 id="app-info-section" className="text-xl font-nunito font-bold text-eldercare-secondary mb-4">
            App Information & Account
          </h2>
          
          <div className="space-y-3">
            {/* App Version */}
            <div className="flex items-center justify-between p-4 bg-eldercare-background/30 rounded-xl">
              <div className="flex items-center space-x-3">
                <Info size={20} className="text-eldercare-primary" aria-hidden="true" />
                <span className="font-opensans font-medium text-eldercare-secondary">
                  App Version
                </span>
              </div>
              <span className="font-opensans text-eldercare-text">v2.1.0</span>
            </div>

            {/* Logout Button */}
            <button
              onClick={() => setShowLogoutConfirm(true)}
              className="flex items-center justify-center space-x-3 w-full p-4 bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 rounded-xl font-opensans font-medium text-lg min-h-touch transition-all duration-300 focus:outline-none focus:ring-3 focus:ring-red-500 focus:ring-offset-2"
            >
              <LogOut size={24} aria-hidden="true" />
              <span>Log Out</span>
            </button>
          </div>
        </section>

        {/* Edit Profile Modal (Non-functional) */}
        {showEditProfile && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-profile-title"
          >
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 id="edit-profile-title" className="text-xl font-nunito font-bold text-eldercare-secondary">
                  Edit Profile
                </h3>
                <button
                  onClick={() => setShowEditProfile(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-eldercare-primary focus:ring-offset-1"
                  aria-label="Close dialog"
                >
                  <X size={24} className="text-eldercare-text" aria-hidden="true" />
                </button>
              </div>

              <div className="text-center py-8">
                <User size={48} className="text-eldercare-primary mx-auto mb-4" aria-hidden="true" />
                <p className="text-base font-opensans text-eldercare-text">
                  Profile editing feature coming soon!
                </p>
              </div>

              <button
                onClick={() => setShowEditProfile(false)}
                className="w-full px-6 py-3 bg-eldercare-primary hover:bg-eldercare-primary-dark text-white rounded-lg font-opensans font-semibold text-base min-h-touch transition-all duration-300 focus:outline-none focus:ring-3 focus:ring-eldercare-primary focus:ring-offset-2"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Logout Confirmation Modal */}
        {showLogoutConfirm && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            role="dialog"
            aria-modal="true"
            aria-labelledby="logout-confirm-title"
          >
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 id="logout-confirm-title" className="text-xl font-nunito font-bold text-eldercare-secondary">
                  Confirm Logout
                </h3>
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-eldercare-primary focus:ring-offset-1"
                  aria-label="Close dialog"
                >
                  <X size={24} className="text-eldercare-text" aria-hidden="true" />
                </button>
              </div>

              <div className="text-center mb-6">
                <LogOut size={48} className="text-red-500 mx-auto mb-4" aria-hidden="true" />
                <p className="text-base font-opensans text-eldercare-text">
                  Are you sure you want to log out of ElderCare?
                </p>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-eldercare-secondary rounded-lg font-opensans font-semibold text-base min-h-touch transition-all duration-300 focus:outline-none focus:ring-3 focus:ring-gray-300 focus:ring-offset-2 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  className="flex-1 px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-opensans font-semibold text-base min-h-touch transition-all duration-300 focus:outline-none focus:ring-3 focus:ring-red-500 focus:ring-offset-2"
                >
                  Log Out
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};