import React, { useState } from 'react';
import { 
  Heart, 
  Activity, 
  Thermometer, 
  Clock, 
  Calendar,
  CheckCircle,
  AlertTriangle,
  Check
} from 'lucide-react';
import { LoadingSpinner } from './LoadingSpinner';
import { ErrorMessage } from './ErrorMessage';

interface MainContentProps {
  activeSection?: string;
}

interface HealthMetric {
  icon: React.ElementType;
  label: string;
  value: string;
  status: 'normal' | 'good' | 'warning';
  description: string;
}

interface ScheduleItem {
  id: string;
  time: string;
  activity: string;
  completed: boolean;
}

interface Alert {
  id: string;
  message: string;
  timeAgo: string;
  urgency: 'high' | 'medium' | 'low';
  dismissed?: boolean;
}

export const MainContent: React.FC<MainContentProps> = ({ activeSection = 'home' }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // State for interactive elements
  const [scheduleItems, setScheduleItems] = useState<ScheduleItem[]>([
    { id: '1', time: '8:00 AM', activity: 'Morning Medication', completed: true },
    { id: '2', time: '9:00 AM', activity: 'Blood Pressure Check', completed: true },
    { id: '3', time: '12:00 PM', activity: 'Lunch + Medication', completed: false },
    { id: '4', time: '3:00 PM', activity: 'Light Exercise', completed: false }
  ]);

  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: '1',
      message: 'Medication reminder: Evening dose',
      timeAgo: '5 mins ago',
      urgency: 'high',
      dismissed: false
    },
    {
      id: '2',
      message: 'Activity level lower than usual',
      timeAgo: '1 hour ago',
      urgency: 'medium',
      dismissed: false
    },
    {
      id: '3',
      message: 'Room temperature slightly high',
      timeAgo: '2 hours ago',
      urgency: 'medium',
      dismissed: false
    }
  ]);

  const healthMetrics: HealthMetric[] = [
    {
      icon: Heart,
      label: 'Heart Rate',
      value: '72 BPM',
      status: 'normal',
      description: 'normal'
    },
    {
      icon: Activity,
      label: 'Activity Level',
      value: 'Moderate',
      status: 'good',
      description: 'good'
    },
    {
      icon: Thermometer,
      label: 'Room Temperature',
      value: '23°C',
      status: 'normal',
      description: 'normal'
    },
    {
      icon: Clock,
      label: 'Last Check-in',
      value: '10 mins ago',
      status: 'good',
      description: 'good'
    }
  ];

  // Get current time of day for greeting
  const getTimeOfDayGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    if (hour < 21) return 'Good evening';
    return 'Good night';
  };

  // Get user's first name for greeting
  const getUserFirstName = () => {
    return 'Shelly';
  };

  // Get appropriate emoji for time of day
  const getTimeEmoji = () => {
    const hour = new Date().getHours();
    if (hour < 6) return '🌙'; // Late night/early morning
    if (hour < 12) return '🌅'; // Morning
    if (hour < 17) return '☀️'; // Afternoon
    if (hour < 21) return '🌆'; // Evening
    return '🌙'; // Night
  };

  const toggleScheduleItem = (id: string) => {
    setScheduleItems(prev => 
      prev.map(item => 
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const dismissAlert = (id: string) => {
    setAlerts(prev => 
      prev.map(alert => 
        alert.id === id ? { ...alert, dismissed: true } : alert
      )
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'good':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getAlertStyle = (urgency: string) => {
    switch (urgency) {
      case 'high':
        return 'bg-red-50 border-red-200 shadow-sm';
      case 'medium':
        return 'bg-yellow-50 border-yellow-200 shadow-sm';
      case 'low':
        return 'bg-blue-50 border-blue-200 shadow-sm';
      default:
        return 'bg-gray-50 border-gray-200 shadow-sm';
    }
  };

  const handleRetry = () => {
    setError(null);
  };

  if (loading) {
    return (
      <main className="flex-1 ml-70 p-8 bg-eldercare-background" role="main" aria-label="Main content">
        <LoadingSpinner size="lg" message="Loading your information..." />
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex-1 ml-70 p-8 bg-eldercare-background" role="main" aria-label="Main content">
        <ErrorMessage
          title="Something went wrong"
          message="We couldn't load your information. Please check your internet connection and try again."
          onRetry={handleRetry}
        />
      </main>
    );
  }

  const visibleAlerts = alerts.filter(alert => !alert.dismissed);

  return (
    <main className="flex-1 ml-70 p-8 bg-eldercare-background" role="main" aria-label="Main content">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Personalized Greeting Header */}
        <header className="mb-8">
          <h1 className="text-4xl font-nunito font-bold text-eldercare-secondary mb-2">
            {getTimeOfDayGreeting()}, {getUserFirstName()}! {getTimeEmoji()}
          </h1>
          <p className="text-lg font-opensans text-eldercare-text-light">
            Here's your health overview for today
          </p>
        </header>

        {/* Health Status Cards - 2x2 Grid */}
        <section aria-labelledby="health-status-heading" className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {healthMetrics.map((metric, index) => {
              const Icon = metric.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-md border border-eldercare-primary/10 p-6 min-h-[120px] w-full max-w-[280px] mx-auto lg:mx-0 hover:shadow-lg transition-all duration-300 hover:scale-105"
                  style={{ minWidth: '280px', minHeight: '120px' }}
                  role="article"
                  aria-labelledby={`metric-${index}-label`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-lg bg-eldercare-primary/10">
                        <Icon size={20} className="text-eldercare-primary" aria-hidden="true" />
                      </div>
                      <h3 
                        id={`metric-${index}-label`}
                        className="text-sm font-opensans font-medium text-eldercare-text"
                      >
                        {metric.label}
                      </h3>
                    </div>
                    <span 
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-opensans font-medium border ${getStatusColor(metric.status)}`}
                      aria-label={`Status: ${metric.description}`}
                    >
                      {metric.description}
                    </span>
                  </div>
                  <p className="text-2xl font-nunito font-bold text-eldercare-secondary">
                    {metric.value}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Two Column Layout: Daily Schedule & Recent Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Daily Schedule - Left Column */}
          <section aria-labelledby="daily-schedule-heading">
            <h2 
              id="daily-schedule-heading" 
              className="text-2xl font-nunito font-bold text-eldercare-secondary mb-6"
            >
              Daily Schedule
            </h2>
            
            <div className="bg-white rounded-xl shadow-md border border-eldercare-primary/10 p-6">
              <div className="space-y-4">
                {scheduleItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center space-x-4 p-4 rounded-lg hover:bg-eldercare-background/50 transition-all duration-200 cursor-pointer group"
                    role="listitem"
                    onClick={() => toggleScheduleItem(item.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        toggleScheduleItem(item.id);
                      }
                    }}
                    tabIndex={0}
                    aria-label={`${item.activity} at ${item.time}, ${item.completed ? 'completed' : 'not completed'}`}
                  >
                    <div className="flex-shrink-0">
                      <Calendar size={18} className="text-eldercare-primary" aria-hidden="true" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className={`text-base font-opensans font-medium transition-colors duration-200 ${
                          item.completed ? 'text-eldercare-text-light line-through' : 'text-eldercare-secondary'
                        }`}>
                          {item.activity}
                        </h3>
                        <span className="text-sm font-opensans text-eldercare-text-light">
                          {item.time}
                        </span>
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      <button
                        className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-eldercare-primary focus:ring-offset-1 ${
                          item.completed 
                            ? 'bg-eldercare-primary border-eldercare-primary hover:bg-eldercare-primary-dark' 
                            : 'border-eldercare-primary/30 bg-white hover:border-eldercare-primary hover:bg-eldercare-primary/5'
                        }`}
                        aria-label={item.completed ? 'Mark as incomplete' : 'Mark as complete'}
                      >
                        {item.completed && (
                          <Check size={14} className="text-white" aria-hidden="true" />
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Recent Alerts - Right Column */}
          <section aria-labelledby="recent-alerts-heading">
            <h2 
              id="recent-alerts-heading" 
              className="text-2xl font-nunito font-bold text-eldercare-secondary mb-6"
            >
              Recent Alerts
            </h2>
            
            <div className="space-y-4">
              {visibleAlerts.length === 0 ? (
                <div className="bg-white rounded-xl shadow-md border border-eldercare-primary/10 p-6 text-center">
                  <p className="text-eldercare-text font-opensans">No active alerts</p>
                </div>
              ) : (
                visibleAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`${getAlertStyle(alert.urgency)} border rounded-xl p-4 flex items-start space-x-3 hover:shadow-md transition-all duration-200`}
                    role="alert"
                    aria-live="polite"
                  >
                    <div className="flex-shrink-0 mt-1">
                      <AlertTriangle 
                        size={18} 
                        className={`${
                          alert.urgency === 'high' ? 'text-red-600' : 
                          alert.urgency === 'medium' ? 'text-yellow-600' : 'text-blue-600'
                        }`}
                        aria-hidden="true" 
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-base font-opensans font-medium text-eldercare-secondary mb-1">
                        {alert.message}
                      </p>
                      <p className="text-sm font-opensans text-eldercare-text-light">
                        {alert.timeAgo}
                      </p>
                    </div>
                    <button
                      onClick={() => dismissAlert(alert.id)}
                      className="flex-shrink-0 p-1 rounded-md hover:bg-white/50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-eldercare-primary focus:ring-offset-1"
                      aria-label="Dismiss alert"
                    >
                      <Check size={16} className="text-eldercare-text-light" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
};