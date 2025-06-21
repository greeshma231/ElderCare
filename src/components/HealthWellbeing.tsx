import React, { useState } from 'react';
import { 
  Heart, 
  Activity, 
  Droplets, 
  Thermometer, 
  Scale, 
  Zap,
  Plus, 
  TrendingUp,
  Calendar,
  Clock,
  X,
  Save,
  BarChart3,
  Eye,
  Download,
  Filter,
  ChevronDown,
  AlertCircle,
  CheckCircle2,
  Info,
  Target,
  Award,
  Lightbulb
} from 'lucide-react';

interface VitalReading {
  id: string;
  type: 'heart-rate' | 'blood-pressure' | 'blood-glucose' | 'oxygen-saturation' | 'temperature' | 'weight';
  value: string;
  systolic?: number;
  diastolic?: number;
  status: 'normal' | 'high' | 'low' | 'excellent' | 'warning';
  timestamp: Date;
  notes?: string;
}

interface VitalMetric {
  id: string;
  name: string;
  icon: React.ElementType;
  unit: string;
  currentValue: string;
  status: 'normal' | 'high' | 'low' | 'excellent' | 'warning';
  statusLabel: string;
  color: string;
  bgColor: string;
  borderColor: string;
  trend: 'up' | 'down' | 'stable';
  trendColor: string;
  lastReading?: Date;
  normalRange: string;
}

interface AddVitalFormData {
  type: string;
  value: string;
  systolic: string;
  diastolic: string;
  notes: string;
  useCurrentDateTime: boolean;
  customDate: string;
  customTime: string;
}

export const HealthWellbeing: React.FC = () => {
  const [activeView, setActiveView] = useState<'dashboard' | 'history' | 'insights'>('dashboard');
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);
  const [historyFilter, setHistoryFilter] = useState<'all' | 'normal' | 'warning' | 'high'>('all');
  const [formData, setFormData] = useState<AddVitalFormData>({
    type: 'heart-rate',
    value: '',
    systolic: '',
    diastolic: '',
    notes: '',
    useCurrentDateTime: true,
    customDate: new Date().toISOString().split('T')[0],
    customTime: new Date().toTimeString().slice(0, 5)
  });

  const [vitalReadings, setVitalReadings] = useState<VitalReading[]>([
    {
      id: '1',
      type: 'heart-rate',
      value: '72 BPM',
      status: 'normal',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000)
    },
    {
      id: '2',
      type: 'blood-pressure',
      value: '118/76 mmHg',
      systolic: 118,
      diastolic: 76,
      status: 'excellent',
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000)
    },
    {
      id: '3',
      type: 'blood-glucose',
      value: '95 mg/dL',
      status: 'normal',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000)
    },
    {
      id: '4',
      type: 'oxygen-saturation',
      value: '98%',
      status: 'excellent',
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000)
    },
    {
      id: '5',
      type: 'temperature',
      value: '98.4°F',
      status: 'normal',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000)
    },
    {
      id: '6',
      type: 'weight',
      value: '165 lbs',
      status: 'normal',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000)
    }
  ]);

  // Update current values based on latest readings
  const getCurrentValue = (type: string) => {
    const latestReading = vitalReadings
      .filter(reading => reading.type === type)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())[0];
    
    if (!latestReading) return { value: '--', status: 'normal' as const };
    
    // Extract numeric value for display
    const numericValue = latestReading.value.split(' ')[0];
    return { value: numericValue, status: latestReading.status };
  };

  const vitalMetrics: VitalMetric[] = [
    {
      id: 'heart-rate',
      name: 'Heart Rate',
      icon: Heart,
      unit: 'BPM',
      currentValue: getCurrentValue('heart-rate').value,
      status: getCurrentValue('heart-rate').status,
      statusLabel: getCurrentValue('heart-rate').status === 'excellent' ? 'Excellent' : 
                  getCurrentValue('heart-rate').status === 'normal' ? 'Normal' : 'Warning',
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      trend: 'stable',
      trendColor: 'text-green-500',
      lastReading: vitalReadings.find(r => r.type === 'heart-rate')?.timestamp,
      normalRange: '60-100 BPM'
    },
    {
      id: 'blood-pressure',
      name: 'Blood Pressure',
      icon: Activity,
      unit: 'mmHg',
      currentValue: getCurrentValue('blood-pressure').value,
      status: getCurrentValue('blood-pressure').status,
      statusLabel: getCurrentValue('blood-pressure').status === 'excellent' ? 'Excellent' : 
                  getCurrentValue('blood-pressure').status === 'normal' ? 'Normal' : 'Warning',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      trend: 'down',
      trendColor: 'text-green-500',
      lastReading: vitalReadings.find(r => r.type === 'blood-pressure')?.timestamp,
      normalRange: '<120/80 mmHg'
    },
    {
      id: 'blood-glucose',
      name: 'Blood Sugar',
      icon: Droplets,
      unit: 'mg/dL',
      currentValue: getCurrentValue('blood-glucose').value,
      status: getCurrentValue('blood-glucose').status,
      statusLabel: getCurrentValue('blood-glucose').status === 'excellent' ? 'Excellent' : 
                  getCurrentValue('blood-glucose').status === 'normal' ? 'Normal' : 'Warning',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      trend: 'stable',
      trendColor: 'text-green-500',
      lastReading: vitalReadings.find(r => r.type === 'blood-glucose')?.timestamp,
      normalRange: '70-140 mg/dL'
    },
    {
      id: 'oxygen-saturation',
      name: 'Oxygen Level',
      icon: Zap,
      unit: '%',
      currentValue: getCurrentValue('oxygen-saturation').value,
      status: getCurrentValue('oxygen-saturation').status,
      statusLabel: getCurrentValue('oxygen-saturation').status === 'excellent' ? 'Excellent' : 
                  getCurrentValue('oxygen-saturation').status === 'normal' ? 'Normal' : 'Warning',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      trend: 'up',
      trendColor: 'text-green-500',
      lastReading: vitalReadings.find(r => r.type === 'oxygen-saturation')?.timestamp,
      normalRange: '95-100%'
    },
    {
      id: 'temperature',
      name: 'Temperature',
      icon: Thermometer,
      unit: '°F',
      currentValue: getCurrentValue('temperature').value,
      status: getCurrentValue('temperature').status,
      statusLabel: getCurrentValue('temperature').status === 'excellent' ? 'Excellent' : 
                  getCurrentValue('temperature').status === 'normal' ? 'Normal' : 'Warning',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      trend: 'stable',
      trendColor: 'text-green-500',
      lastReading: vitalReadings.find(r => r.type === 'temperature')?.timestamp,
      normalRange: '97-99°F'
    },
    {
      id: 'weight',
      name: 'Weight',
      icon: Scale,
      unit: 'lbs',
      currentValue: getCurrentValue('weight').value,
      status: getCurrentValue('weight').status,
      statusLabel: getCurrentValue('weight').status === 'excellent' ? 'Excellent' : 
                  getCurrentValue('weight').status === 'normal' ? 'Stable' : 'Warning',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      borderColor: 'border-indigo-200',
      trend: 'stable',
      trendColor: 'text-green-500',
      lastReading: vitalReadings.find(r => r.type === 'weight')?.timestamp,
      normalRange: 'BMI 18.5-24.9'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'excellent':
        return <CheckCircle2 size={14} className="text-green-600" />;
      case 'normal':
        return <CheckCircle2 size={14} className="text-blue-600" />;
      case 'warning':
        return <AlertCircle size={14} className="text-yellow-600" />;
      case 'high':
        return <AlertCircle size={14} className="text-red-600" />;
      case 'low':
        return <Info size={14} className="text-orange-600" />;
      default:
        return <CheckCircle2 size={14} className="text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'normal':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'low':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp size={12} className="text-green-500 rotate-0" />;
      case 'down':
        return <TrendingUp size={12} className="text-green-500 rotate-180" />;
      case 'stable':
        return <div className="w-2 h-0.5 bg-green-500 rounded-full" />;
      default:
        return null;
    }
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
      return `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d ago`;
    }
  };

  const formatDateTime = (date: Date) => {
    return date.toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleAddVital = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.value && !formData.systolic && !formData.diastolic) {
      return;
    }

    let value = formData.value;
    let systolic: number | undefined;
    let diastolic: number | undefined;

    if (formData.type === 'blood-pressure') {
      if (!formData.systolic || !formData.diastolic) return;
      systolic = parseInt(formData.systolic);
      diastolic = parseInt(formData.diastolic);
      value = `${systolic}/${diastolic} mmHg`;
    } else {
      // Add unit to value if not present
      const metric = vitalMetrics.find(m => m.id === formData.type);
      if (metric && !value.includes(metric.unit)) {
        value = `${value} ${metric.unit}`;
      }
    }

    // Determine timestamp
    let timestamp = new Date();
    if (!formData.useCurrentDateTime) {
      const customDateTime = new Date(`${formData.customDate}T${formData.customTime}`);
      timestamp = customDateTime;
    }

    const newReading: VitalReading = {
      id: Date.now().toString(),
      type: formData.type as any,
      value,
      systolic,
      diastolic,
      status: 'normal', // In a real app, this would be calculated based on the values
      timestamp,
      notes: formData.notes || undefined
    };

    setVitalReadings(prev => [newReading, ...prev]);
    setFormData({
      type: 'heart-rate',
      value: '',
      systolic: '',
      diastolic: '',
      notes: '',
      useCurrentDateTime: true,
      customDate: new Date().toISOString().split('T')[0],
      customTime: new Date().toTimeString().slice(0, 5)
    });
    setShowAddForm(false);
  };

  const getVitalTypeLabel = (type: string) => {
    const metric = vitalMetrics.find(m => m.id === type);
    return metric ? metric.name : type;
  };

  const getVitalIcon = (type: string) => {
    const metric = vitalMetrics.find(m => m.id === type);
    return metric ? metric.icon : Heart;
  };

  const filteredReadings = selectedMetric 
    ? vitalReadings.filter(reading => reading.type === selectedMetric)
    : vitalReadings.filter(reading => historyFilter === 'all' || reading.status === historyFilter);

  const healthScore = Math.round(
    vitalMetrics.reduce((acc, metric) => {
      const score = metric.status === 'excellent' ? 100 : 
                   metric.status === 'normal' ? 85 : 
                   metric.status === 'warning' ? 70 : 60;
      return acc + score;
    }, 0) / vitalMetrics.length
  );

  return (
    <main className="flex-1 ml-70 bg-eldercare-background" role="main" aria-label="Health & Wellbeing">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <header className="mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-nunito font-bold text-eldercare-secondary mb-2">
                Health & Wellbeing
              </h1>
              <p className="text-base font-opensans text-eldercare-text">
                Track your daily vitals and stay informed
              </p>
            </div>
            
            {/* Health Score */}
            <div className="bg-white rounded-xl shadow-md border border-eldercare-primary/10 p-4 min-w-[160px]">
              <div className="text-center">
                <div className="text-2xl font-nunito font-bold text-eldercare-secondary mb-1">
                  {healthScore}
                </div>
                <div className="text-xs font-opensans text-eldercare-text mb-2">
                  Health Score
                </div>
                <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  healthScore >= 90 ? 'bg-green-100 text-green-800' :
                  healthScore >= 80 ? 'bg-blue-100 text-blue-800' :
                  healthScore >= 70 ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {healthScore >= 90 ? 'Excellent' :
                   healthScore >= 80 ? 'Good' :
                   healthScore >= 70 ? 'Fair' : 'Needs Attention'}
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="mb-6" role="tablist" aria-label="Health views">
            <div className="flex space-x-1 bg-white rounded-xl p-2 shadow-md border border-eldercare-primary/10 w-fit">
              {[
                { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
                { id: 'history', label: 'History', icon: Clock },
                { id: 'insights', label: 'Insights', icon: TrendingUp }
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveView(id as any)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-opensans font-medium text-sm min-h-touch transition-all duration-300 focus:outline-none focus:ring-3 focus:ring-eldercare-primary focus:ring-offset-2 ${
                    activeView === id
                      ? 'bg-eldercare-primary text-white shadow-md'
                      : 'text-eldercare-secondary hover:bg-eldercare-primary/10'
                  }`}
                  role="tab"
                  aria-selected={activeView === id}
                  aria-controls={`${id}-panel`}
                >
                  <Icon size={16} aria-hidden="true" />
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </nav>
        </header>

        {/* Dashboard View */}
        {activeView === 'dashboard' && (
          <section 
            id="dashboard-panel" 
            role="tabpanel" 
            aria-labelledby="dashboard-tab"
            className="space-y-6"
          >
            {/* Vitals Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {vitalMetrics.map((metric) => {
                const Icon = metric.icon;
                return (
                  <div
                    key={metric.id}
                    className={`${metric.bgColor} rounded-xl shadow-md border-2 ${metric.borderColor} p-4 min-h-[140px] transition-all duration-300 hover:shadow-lg hover:scale-105 cursor-pointer group`}
                    role="article"
                    aria-labelledby={`metric-${metric.id}-name`}
                    onClick={() => {
                      setSelectedMetric(metric.id);
                      setActiveView('history');
                    }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="p-2 bg-white/80 rounded-lg shadow-sm">
                        <Icon size={20} className={metric.color} aria-hidden="true" />
                      </div>
                      <div className="flex items-center space-x-1">
                        {getStatusIcon(metric.status)}
                        <span 
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-opensans font-medium border ${getStatusColor(metric.status)}`}
                          aria-label={`Status: ${metric.statusLabel}`}
                        >
                          {metric.statusLabel}
                        </span>
                      </div>
                    </div>
                    
                    <h3 
                      id={`metric-${metric.id}-name`}
                      className="text-base font-nunito font-bold text-eldercare-secondary mb-2"
                    >
                      {metric.name}
                    </h3>
                    
                    <div className="mb-3">
                      <div className="flex items-baseline space-x-1 mb-1">
                        <span className="text-2xl font-nunito font-bold text-eldercare-secondary">
                          {metric.currentValue}
                        </span>
                        <span className="text-sm font-opensans text-eldercare-text">
                          {metric.unit}
                        </span>
                      </div>
                      <p className="text-xs font-opensans text-eldercare-text-light">
                        Normal: {metric.normalRange}
                      </p>
                      {metric.lastReading && (
                        <p className="text-xs font-opensans text-eldercare-text-light">
                          {formatTimestamp(metric.lastReading)}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1">
                        {getTrendIcon(metric.trend)}
                        <span className="text-xs font-opensans text-eldercare-text">
                          {metric.trend === 'up' ? 'Trending up' :
                           metric.trend === 'down' ? 'Improving' : 'Stable'}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1 text-eldercare-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <Eye size={12} aria-hidden="true" />
                        <span className="text-xs font-opensans font-medium">
                          View
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Recent Activity */}
            <section aria-labelledby="recent-activity-heading">
              <div className="flex items-center justify-between mb-4">
                <h2 
                  id="recent-activity-heading"
                  className="text-xl font-nunito font-bold text-eldercare-secondary"
                >
                  Recent Activity
                </h2>
                <button
                  onClick={() => setActiveView('history')}
                  className="flex items-center space-x-1 px-3 py-1 text-eldercare-primary hover:text-eldercare-primary-dark font-opensans font-medium text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-eldercare-primary rounded-lg"
                >
                  <span>View All</span>
                  <ChevronDown size={14} className="rotate-[-90deg]" aria-hidden="true" />
                </button>
              </div>
              
              <div className="bg-white rounded-xl shadow-md border border-eldercare-primary/10 overflow-hidden">
                {vitalReadings.slice(0, 5).length === 0 ? (
                  <div className="p-8 text-center">
                    <Heart size={32} className="text-eldercare-primary mx-auto mb-3" aria-hidden="true" />
                    <h3 className="text-lg font-nunito font-bold text-eldercare-secondary mb-2">
                      No readings yet
                    </h3>
                    <p className="text-sm font-opensans text-eldercare-text">
                      Start tracking your health by adding your first vital reading
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-eldercare-primary/5">
                    {vitalReadings.slice(0, 5).map((reading) => {
                      const Icon = getVitalIcon(reading.type);
                      const metric = vitalMetrics.find(m => m.id === reading.type);
                      return (
                        <div
                          key={reading.id}
                          className="p-4 hover:bg-eldercare-background/30 transition-colors duration-200"
                          role="article"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className={`p-2 ${metric?.bgColor || 'bg-eldercare-primary/10'} rounded-lg`}>
                                <Icon size={18} className={metric?.color || 'text-eldercare-primary'} aria-hidden="true" />
                              </div>
                              <div>
                                <h4 className="font-opensans font-medium text-eldercare-secondary text-sm">
                                  {getVitalTypeLabel(reading.type)}
                                </h4>
                                <p className="text-xs font-opensans text-eldercare-text-light">
                                  {formatDateTime(reading.timestamp)}
                                </p>
                              </div>
                            </div>
                            <div className="text-right flex items-center space-x-3">
                              <div>
                                <p className="text-lg font-nunito font-bold text-eldercare-secondary">
                                  {reading.value}
                                </p>
                                <div className="flex items-center justify-end space-x-1 mt-1">
                                  {getStatusIcon(reading.status)}
                                  <span 
                                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-opensans font-medium border ${getStatusColor(reading.status)}`}
                                  >
                                    {reading.status}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                          {reading.notes && (
                            <p className="text-xs font-opensans text-eldercare-text italic mt-2 ml-9">
                              Note: {reading.notes}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </section>
          </section>
        )}

        {/* History View */}
        {activeView === 'history' && (
          <section 
            id="history-panel" 
            role="tabpanel" 
            aria-labelledby="history-tab"
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-nunito font-bold text-eldercare-secondary mb-1">
                  Health History
                </h2>
                {selectedMetric && (
                  <p className="text-sm font-opensans text-eldercare-text">
                    Showing history for: <strong>{getVitalTypeLabel(selectedMetric)}</strong>
                  </p>
                )}
              </div>
              
              <div className="flex items-center space-x-3">
                {selectedMetric && (
                  <button
                    onClick={() => setSelectedMetric(null)}
                    className="flex items-center space-x-1 px-3 py-2 bg-eldercare-primary/10 text-eldercare-primary rounded-lg font-opensans font-medium text-xs transition-all duration-300 focus:outline-none focus:ring-3 focus:ring-eldercare-primary focus:ring-offset-2 hover:bg-eldercare-primary/20"
                  >
                    <Eye size={14} aria-hidden="true" />
                    <span>Show All</span>
                  </button>
                )}
                
                <div className="flex items-center space-x-1">
                  <Filter size={14} className="text-eldercare-text-light" aria-hidden="true" />
                  <select
                    value={historyFilter}
                    onChange={(e) => setHistoryFilter(e.target.value as any)}
                    className="px-3 py-2 text-sm font-opensans border-2 border-eldercare-primary/20 rounded-lg focus:outline-none focus:ring-3 focus:ring-eldercare-primary focus:border-eldercare-primary transition-all duration-200 bg-white"
                    aria-label="Filter readings by status"
                  >
                    <option value="all">All Status</option>
                    <option value="excellent">Excellent</option>
                    <option value="normal">Normal</option>
                    <option value="warning">Warning</option>
                    <option value="high">High</option>
                  </select>
                </div>
                
                <button
                  className="flex items-center space-x-1 px-3 py-2 bg-eldercare-primary hover:bg-eldercare-primary-dark text-white rounded-lg font-opensans font-medium text-xs transition-all duration-300 focus:outline-none focus:ring-3 focus:ring-eldercare-primary focus:ring-offset-2"
                  onClick={() => console.log('Export functionality')}
                >
                  <Download size={14} aria-hidden="true" />
                  <span>Export</span>
                </button>
              </div>
            </div>

            {/* Filter Pills */}
            {!selectedMetric && (
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedMetric(null)}
                  className={`px-3 py-1 rounded-lg font-opensans font-medium text-xs transition-all duration-300 focus:outline-none focus:ring-3 focus:ring-eldercare-primary focus:ring-offset-2 ${
                    !selectedMetric
                      ? 'bg-eldercare-primary text-white shadow-md'
                      : 'bg-white border border-eldercare-primary/20 text-eldercare-secondary hover:bg-eldercare-primary/5'
                  }`}
                >
                  All Vitals
                </button>
                {vitalMetrics.map((metric) => (
                  <button
                    key={metric.id}
                    onClick={() => setSelectedMetric(metric.id)}
                    className={`px-3 py-1 rounded-lg font-opensans font-medium text-xs transition-all duration-300 focus:outline-none focus:ring-3 focus:ring-eldercare-primary focus:ring-offset-2 ${
                      selectedMetric === metric.id
                        ? 'bg-eldercare-primary text-white shadow-md'
                        : 'bg-white border border-eldercare-primary/20 text-eldercare-secondary hover:bg-eldercare-primary/5'
                    }`}
                  >
                    {metric.name}
                  </button>
                ))}
              </div>
            )}

            <div className="bg-white rounded-xl shadow-md border border-eldercare-primary/10">
              <div className="max-h-80 overflow-y-auto">
                {filteredReadings.length === 0 ? (
                  <div className="p-8 text-center">
                    <Calendar size={32} className="text-eldercare-primary mx-auto mb-3" aria-hidden="true" />
                    <h3 className="text-lg font-nunito font-bold text-eldercare-secondary mb-2">
                      No readings found
                    </h3>
                    <p className="text-sm font-opensans text-eldercare-text">
                      {selectedMetric 
                        ? `No ${getVitalTypeLabel(selectedMetric).toLowerCase()} readings recorded yet`
                        : 'No vital readings match your current filters'
                      }
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-eldercare-primary/5">
                    {filteredReadings.map((reading) => {
                      const Icon = getVitalIcon(reading.type);
                      const metric = vitalMetrics.find(m => m.id === reading.type);
                      return (
                        <div
                          key={reading.id}
                          className="p-4 hover:bg-eldercare-background/30 transition-colors duration-200"
                          role="article"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-3 flex-1">
                              <div className={`p-2 ${metric?.bgColor || 'bg-eldercare-primary/10'} rounded-lg flex-shrink-0`}>
                                <Icon size={18} className={metric?.color || 'text-eldercare-primary'} aria-hidden="true" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center space-x-2 mb-1">
                                  <h4 className="text-base font-nunito font-bold text-eldercare-secondary">
                                    {getVitalTypeLabel(reading.type)}
                                  </h4>
                                  <div className="flex items-center space-x-1">
                                    {getStatusIcon(reading.status)}
                                    <span 
                                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-opensans font-medium border ${getStatusColor(reading.status)}`}
                                    >
                                      {reading.status}
                                    </span>
                                  </div>
                                </div>
                                <p className="text-sm font-opensans text-eldercare-text mb-1">
                                  {formatDateTime(reading.timestamp)}
                                </p>
                                {reading.notes && (
                                  <p className="text-xs font-opensans text-eldercare-text-light italic">
                                    Note: {reading.notes}
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className="text-right ml-3">
                              <p className="text-xl font-nunito font-bold text-eldercare-secondary">
                                {reading.value}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Insights View */}
        {activeView === 'insights' && (
          <section 
            id="insights-panel" 
            role="tabpanel" 
            aria-labelledby="insights-tab"
            className="space-y-6"
          >
            <div>
              <h2 className="text-xl font-nunito font-bold text-eldercare-secondary mb-4">
                Health Insights & Recommendations
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Health Trends */}
                <div className="bg-white rounded-xl shadow-md border border-eldercare-primary/10 p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <TrendingUp size={20} className="text-blue-600" aria-hidden="true" />
                    </div>
                    <h3 className="text-lg font-nunito font-bold text-eldercare-secondary">
                      Health Trends
                    </h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <span className="text-sm font-opensans text-eldercare-secondary">Blood Pressure</span>
                      <div className="flex items-center space-x-1 text-green-600">
                        <TrendingUp size={14} className="rotate-180" />
                        <span className="text-xs font-medium">Improving</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <span className="text-sm font-opensans text-eldercare-secondary">Heart Rate</span>
                      <div className="flex items-center space-x-1 text-blue-600">
                        <div className="w-2 h-0.5 bg-blue-600 rounded-full" />
                        <span className="text-xs font-medium">Stable</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <span className="text-sm font-opensans text-eldercare-secondary">Oxygen Level</span>
                      <div className="flex items-center space-x-1 text-green-600">
                        <TrendingUp size={14} />
                        <span className="text-xs font-medium">Excellent</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Health Goals */}
                <div className="bg-white rounded-xl shadow-md border border-eldercare-primary/10 p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-2 bg-green-50 rounded-lg">
                      <Target size={20} className="text-green-600" aria-hidden="true" />
                    </div>
                    <h3 className="text-lg font-nunito font-bold text-eldercare-secondary">
                      Health Goals
                    </h3>
                  </div>
                  <div className="space-y-3">
                    <div className="p-3 bg-eldercare-background rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-opensans font-medium text-eldercare-secondary">Daily Vitals Check</span>
                        <span className="text-xs font-opensans text-green-600 font-medium">85%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                      </div>
                    </div>
                    <div className="p-3 bg-eldercare-background rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-opensans font-medium text-eldercare-secondary">Blood Pressure Target</span>
                        <span className="text-xs font-opensans text-green-600 font-medium">Achieved</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '100%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Achievements */}
                <div className="bg-white rounded-xl shadow-md border border-eldercare-primary/10 p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-2 bg-yellow-50 rounded-lg">
                      <Award size={20} className="text-yellow-600" aria-hidden="true" />
                    </div>
                    <h3 className="text-lg font-nunito font-bold text-eldercare-secondary">
                      Recent Achievements
                    </h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
                      <Award size={16} className="text-yellow-600" />
                      <div>
                        <p className="text-sm font-opensans font-medium text-eldercare-secondary">7-Day Streak</p>
                        <p className="text-xs font-opensans text-eldercare-text-light">Consistent vital tracking</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                      <CheckCircle2 size={16} className="text-green-600" />
                      <div>
                        <p className="text-sm font-opensans font-medium text-eldercare-secondary">Healthy Range</p>
                        <p className="text-xs font-opensans text-eldercare-text-light">All vitals within normal range</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Health Tips */}
                <div className="bg-white rounded-xl shadow-md border border-eldercare-primary/10 p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-2 bg-purple-50 rounded-lg">
                      <Lightbulb size={20} className="text-purple-600" aria-hidden="true" />
                    </div>
                    <h3 className="text-lg font-nunito font-bold text-eldercare-secondary">
                      Personalized Tips
                    </h3>
                  </div>
                  <div className="space-y-3">
                    <div className="p-3 bg-purple-50 rounded-lg">
                      <p className="text-sm font-opensans font-medium text-eldercare-secondary mb-1">
                        💧 Stay Hydrated
                      </p>
                      <p className="text-xs font-opensans text-eldercare-text-light">
                        Drink 8 glasses of water daily to maintain healthy blood pressure
                      </p>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm font-opensans font-medium text-eldercare-secondary mb-1">
                        🚶 Light Exercise
                      </p>
                      <p className="text-xs font-opensans text-eldercare-text-light">
                        A 15-minute walk can help improve your heart rate variability
                      </p>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg">
                      <p className="text-sm font-opensans font-medium text-eldercare-secondary mb-1">
                        😴 Quality Sleep
                      </p>
                      <p className="text-xs font-opensans text-eldercare-text-light">
                        7-8 hours of sleep helps regulate blood sugar levels
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Floating Add Button */}
        <button
          onClick={() => setShowAddForm(true)}
          className="fixed bottom-8 right-8 w-14 h-14 bg-eldercare-primary hover:bg-eldercare-primary-dark text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 focus:outline-none focus:ring-3 focus:ring-eldercare-primary focus:ring-offset-2 hover:scale-105 group"
          aria-label="Add new vital reading"
          title="Add Vital Reading"
        >
          <Plus size={24} aria-hidden="true" className="group-hover:rotate-90 transition-transform duration-300" />
        </button>

        {/* Enhanced Add Vitals Modal */}
        {showAddForm && (
          <div 
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-vitals-title"
          >
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto border border-eldercare-primary/10">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-eldercare-primary/10 rounded-lg">
                      <Plus size={20} className="text-eldercare-primary" aria-hidden="true" />
                    </div>
                    <h2 
                      id="add-vitals-title"
                      className="text-xl font-nunito font-bold text-eldercare-secondary"
                    >
                      Add Vital Reading
                    </h2>
                  </div>
                  <button
                    onClick={() => setShowAddForm(false)}
                    className="p-2 hover:bg-eldercare-background rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-eldercare-primary focus:ring-offset-1"
                    aria-label="Close dialog"
                  >
                    <X size={20} className="text-eldercare-text" aria-hidden="true" />
                  </button>
                </div>

                <form onSubmit={handleAddVital} className="space-y-4">
                  <div>
                    <label 
                      htmlFor="vital-type" 
                      className="block text-sm font-opensans font-medium text-eldercare-secondary mb-2"
                    >
                      Vital Type *
                    </label>
                    <select
                      id="vital-type"
                      value={formData.type}
                      onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                      className="w-full px-3 py-2 text-sm font-opensans border-2 border-eldercare-primary/20 rounded-lg focus:outline-none focus:ring-3 focus:ring-eldercare-primary focus:border-eldercare-primary transition-all duration-200 bg-white"
                      required
                    >
                      {vitalMetrics.map((metric) => (
                        <option key={metric.id} value={metric.id}>
                          {metric.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Date/Time Selection */}
                  <div>
                    <label className="block text-sm font-opensans font-medium text-eldercare-secondary mb-2">
                      When was this reading taken? *
                    </label>
                    <div className="space-y-3">
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="dateTime"
                          checked={formData.useCurrentDateTime}
                          onChange={() => setFormData(prev => ({ ...prev, useCurrentDateTime: true }))}
                          className="text-eldercare-primary focus:ring-eldercare-primary"
                        />
                        <span className="text-sm font-opensans text-eldercare-secondary">Right now</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="dateTime"
                          checked={!formData.useCurrentDateTime}
                          onChange={() => setFormData(prev => ({ ...prev, useCurrentDateTime: false }))}
                          className="text-eldercare-primary focus:ring-eldercare-primary"
                        />
                        <span className="text-sm font-opensans text-eldercare-secondary">Custom date & time</span>
                      </label>
                      
                      {!formData.useCurrentDateTime && (
                        <div className="grid grid-cols-2 gap-3 ml-6">
                          <div>
                            <label htmlFor="custom-date" className="block text-xs font-opensans text-eldercare-text mb-1">
                              Date
                            </label>
                            <input
                              id="custom-date"
                              type="date"
                              value={formData.customDate}
                              onChange={(e) => setFormData(prev => ({ ...prev, customDate: e.target.value }))}
                              className="w-full px-3 py-2 text-sm font-opensans border-2 border-eldercare-primary/20 rounded-lg focus:outline-none focus:ring-3 focus:ring-eldercare-primary focus:border-eldercare-primary transition-all duration-200"
                              required={!formData.useCurrentDateTime}
                            />
                          </div>
                          <div>
                            <label htmlFor="custom-time" className="block text-xs font-opensans text-eldercare-text mb-1">
                              Time
                            </label>
                            <input
                              id="custom-time"
                              type="time"
                              value={formData.customTime}
                              onChange={(e) => setFormData(prev => ({ ...prev, customTime: e.target.value }))}
                              className="w-full px-3 py-2 text-sm font-opensans border-2 border-eldercare-primary/20 rounded-lg focus:outline-none focus:ring-3 focus:ring-eldercare-primary focus:border-eldercare-primary transition-all duration-200"
                              required={!formData.useCurrentDateTime}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {formData.type === 'blood-pressure' ? (
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label 
                          htmlFor="systolic" 
                          className="block text-sm font-opensans font-medium text-eldercare-secondary mb-2"
                        >
                          Systolic *
                        </label>
                        <input
                          id="systolic"
                          type="number"
                          value={formData.systolic}
                          onChange={(e) => setFormData(prev => ({ ...prev, systolic: e.target.value }))}
                          className="w-full px-3 py-2 text-sm font-opensans border-2 border-eldercare-primary/20 rounded-lg focus:outline-none focus:ring-3 focus:ring-eldercare-primary focus:border-eldercare-primary transition-all duration-200"
                          placeholder="120"
                          min="70"
                          max="200"
                          required
                        />
                      </div>
                      <div>
                        <label 
                          htmlFor="diastolic" 
                          className="block text-sm font-opensans font-medium text-eldercare-secondary mb-2"
                        >
                          Diastolic *
                        </label>
                        <input
                          id="diastolic"
                          type="number"
                          value={formData.diastolic}
                          onChange={(e) => setFormData(prev => ({ ...prev, diastolic: e.target.value }))}
                          className="w-full px-3 py-2 text-sm font-opensans border-2 border-eldercare-primary/20 rounded-lg focus:outline-none focus:ring-3 focus:ring-eldercare-primary focus:border-eldercare-primary transition-all duration-200"
                          placeholder="80"
                          min="40"
                          max="120"
                          required
                        />
                      </div>
                    </div>
                  ) : (
                    <div>
                      <label 
                        htmlFor="vital-value" 
                        className="block text-sm font-opensans font-medium text-eldercare-secondary mb-2"
                      >
                        Value *
                      </label>
                      <input
                        id="vital-value"
                        type="text"
                        value={formData.value}
                        onChange={(e) => setFormData(prev => ({ ...prev, value: e.target.value }))}
                        className="w-full px-3 py-2 text-sm font-opensans border-2 border-eldercare-primary/20 rounded-lg focus:outline-none focus:ring-3 focus:ring-eldercare-primary focus:border-eldercare-primary transition-all duration-200"
                        placeholder={
                          formData.type === 'heart-rate' ? '72' :
                          formData.type === 'blood-glucose' ? '95' :
                          formData.type === 'oxygen-saturation' ? '98' :
                          formData.type === 'temperature' ? '98.6' :
                          formData.type === 'weight' ? '165' : 'Enter value'
                        }
                        required
                      />
                    </div>
                  )}

                  <div>
                    <label 
                      htmlFor="vital-notes" 
                      className="block text-sm font-opensans font-medium text-eldercare-secondary mb-2"
                    >
                      Notes (Optional)
                    </label>
                    <textarea
                      id="vital-notes"
                      value={formData.notes}
                      onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                      rows={3}
                      className="w-full px-3 py-2 text-sm font-opensans border-2 border-eldercare-primary/20 rounded-lg focus:outline-none focus:ring-3 focus:ring-eldercare-primary focus:border-eldercare-primary transition-all duration-200 resize-none"
                      placeholder="Any additional notes or observations..."
                    />
                  </div>

                  <div className="flex space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowAddForm(false)}
                      className="flex-1 px-4 py-2 border-2 border-eldercare-primary text-eldercare-primary rounded-lg font-opensans font-medium text-sm min-h-touch transition-all duration-300 focus:outline-none focus:ring-3 focus:ring-eldercare-primary focus:ring-offset-2 hover:bg-eldercare-primary/5"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-eldercare-primary hover:bg-eldercare-primary-dark text-white rounded-lg font-opensans font-medium text-sm min-h-touch transition-all duration-300 focus:outline-none focus:ring-3 focus:ring-eldercare-primary focus:ring-offset-2"
                    >
                      <Save size={16} aria-hidden="true" />
                      <span>Save Reading</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};