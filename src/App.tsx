import React from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AuthForm } from './components/AuthForm';
import { SkipLink } from './components/SkipLink';
import { Sidebar } from './components/Sidebar';
import { MainContent } from './components/MainContent';
import { ChatAssistant } from './components/ChatAssistant';
import { MedicationTracker } from './components/MedicationTracker';
import { HealthWellbeing } from './components/HealthWellbeing';
import { EmotionalWellbeing } from './components/EmotionalWellbeing';
import { VoiceAssistant } from './components/VoiceAssistant';
import { Caregivers } from './components/Caregivers';
import { SettingsProfile } from './components/SettingsProfile';
import { Emergency } from './components/Emergency';
import { LoadingSpinner } from './components/LoadingSpinner';

const AppContent: React.FC = () => {
  const { user, loading } = useAuth();
  const [activeSection, setActiveSection] = React.useState('home');

  if (loading) {
    return (
      <div className="min-h-screen bg-eldercare-background flex items-center justify-center">
        <LoadingSpinner size="lg" message="Loading ElderCare..." />
      </div>
    );
  }

  if (!user) {
    return <AuthForm />;
  }

  const renderMainContent = () => {
    switch (activeSection) {
      case 'chat-assistant':
        return <ChatAssistant />;
      case 'medications':
        return <MedicationTracker />;
      case 'health-wellbeing':
        return <HealthWellbeing />;
      case 'emotional-wellbeing':
        return <EmotionalWellbeing />;
      case 'caregivers':
        return <Caregivers />;
      case 'settings':
        return <SettingsProfile />;
      case 'emergency':
        return <Emergency />;
      default:
        return <MainContent activeSection={activeSection} />;
    }
  };

  return (
    <div className="min-h-screen bg-eldercare-background font-opensans">
      {/* Skip Links for Screen Readers */}
      <SkipLink href="#main-content">Skip to main content</SkipLink>
      <SkipLink href="#navigation">Skip to navigation</SkipLink>
      
      {/* Sidebar Navigation */}
      <div id="navigation">
        <Sidebar 
          activeSection={activeSection}
          onSectionChange={setActiveSection}
        />
      </div>
      
      {/* Main Content Area */}
      <div id="main-content">
        {renderMainContent()}
      </div>
      
      {/* Screen Reader Announcements */}
      <div 
        id="aria-live-region" 
        aria-live="polite" 
        aria-atomic="true" 
        className="sr-only"
      />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;