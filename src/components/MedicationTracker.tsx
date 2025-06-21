import React, { useState } from 'react';
import { 
  Pill, 
  Plus, 
  Clock, 
  Check, 
  AlertTriangle, 
  X,
  Calendar,
  Edit3,
  Trash2,
  Search,
  ChevronLeft,
  ChevronRight,
  Download,
  Filter
} from 'lucide-react';

interface Medication {
  id: string;
  name: string;
  time: string;
  dose: string;
  frequency: string;
  notes?: string;
  taken: boolean;
  takenAt?: Date;
  missed?: boolean;
}

interface AddMedicationFormData {
  name: string;
  time: string;
  dose: string;
  frequency: string;
  notes: string;
}

interface WeeklyMedication {
  id: string;
  name: string;
  time: string;
  dose: string;
  status: 'taken' | 'missed' | 'pending';
  takenAt?: Date;
  notes?: string;
}

interface HistoryEntry {
  id: string;
  date: Date;
  medicationName: string;
  dose: string;
  status: 'taken' | 'missed';
  takenAt?: Date;
  notes?: string;
  markedBy?: string;
}

export const MedicationTracker: React.FC = () => {
  const [medications, setMedications] = useState<Medication[]>([
    {
      id: '1',
      name: 'Amlodipine',
      time: '8:00 AM',
      dose: '1 Tablet – After Breakfast',
      frequency: 'Daily',
      taken: true,
      takenAt: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
    },
    {
      id: '2',
      name: 'Metformin',
      time: '12:00 PM',
      dose: '2 Tablets – With Lunch',
      frequency: 'Daily',
      taken: false
    },
    {
      id: '3',
      name: 'Lisinopril',
      time: '6:00 PM',
      dose: '1 Tablet – Before Dinner',
      frequency: 'Daily',
      taken: false
    },
    {
      id: '4',
      name: 'Vitamin D',
      time: '9:00 AM',
      dose: '1 Capsule – With Food',
      frequency: 'Daily',
      taken: false,
      missed: true
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'today' | 'weekly' | 'history'>('today');
  const [searchQuery, setSearchQuery] = useState('');
  const [weekOffset, setWeekOffset] = useState(0); // 0 = this week, -1 = last week
  const [historyFilter, setHistoryFilter] = useState<'all' | 'taken' | 'missed'>('all');
  const [historySearch, setHistorySearch] = useState('');
  const [formData, setFormData] = useState<AddMedicationFormData>({
    name: '',
    time: '',
    dose: '',
    frequency: 'Daily',
    notes: ''
  });

  // Generate sample weekly data
  const generateWeeklyData = (): { [key: string]: WeeklyMedication[] } => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const weeklyData: { [key: string]: WeeklyMedication[] } = {};
    
    days.forEach((day, index) => {
      const isToday = index === 5; // Saturday is today
      const isPast = index < 5;
      
      weeklyData[day] = medications.map(med => ({
        id: `${med.id}-${day}`,
        name: med.name,
        time: med.time,
        dose: med.dose,
        status: isToday 
          ? (med.taken ? 'taken' : med.missed ? 'missed' : 'pending')
          : isPast 
            ? (Math.random() > 0.2 ? 'taken' : 'missed')
            : 'pending',
        takenAt: isToday && med.taken ? med.takenAt : isPast && Math.random() > 0.2 ? new Date(Date.now() - (6 - index) * 24 * 60 * 60 * 1000) : undefined,
        notes: med.notes
      }));
    });
    
    return weeklyData;
  };

  // Generate sample history data
  const generateHistoryData = (): HistoryEntry[] => {
    const history: HistoryEntry[] = [];
    const today = new Date();
    
    for (let i = 0; i < 30; i++) {
      const date = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
      medications.forEach(med => {
        if (Math.random() > 0.1) { // 90% chance of having an entry
          const status = Math.random() > 0.15 ? 'taken' : 'missed';
          history.push({
            id: `${med.id}-${i}`,
            date,
            medicationName: med.name,
            dose: med.dose,
            status,
            takenAt: status === 'taken' ? new Date(date.getTime() + Math.random() * 12 * 60 * 60 * 1000) : undefined,
            notes: Math.random() > 0.8 ? 'Felt dizzy after taking' : undefined,
            markedBy: Math.random() > 0.7 ? 'Caregiver Sarah' : 'Self'
          });
        }
      });
    }
    
    return history.sort((a, b) => b.date.getTime() - a.date.getTime());
  };

  const weeklyData = generateWeeklyData();
  const historyData = generateHistoryData();

  const confirmTaken = (id: string) => {
    setMedications(prev => 
      prev.map(med => 
        med.id === id 
          ? { ...med, taken: true, takenAt: new Date(), missed: false }
          : med
      )
    );
    setShowConfirmModal(null);
  };

  const markAsUntaken = (id: string) => {
    setMedications(prev => 
      prev.map(med => 
        med.id === id 
          ? { ...med, taken: false, takenAt: undefined }
          : med
      )
    );
  };

  const handleAddMedication = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.time || !formData.dose) {
      return;
    }

    const newMedication: Medication = {
      id: Date.now().toString(),
      name: formData.name,
      time: formData.time,
      dose: formData.dose,
      frequency: formData.frequency,
      notes: formData.notes,
      taken: false
    };

    setMedications(prev => [...prev, newMedication]);
    setFormData({ name: '', time: '', dose: '', frequency: 'Daily', notes: '' });
    setShowAddForm(false);
  };

  const confirmDelete = (id: string) => {
    setMedications(prev => prev.filter(med => med.id !== id));
    setShowDeleteModal(null);
  };

  const formatTakenTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getWeekTitle = () => {
    if (weekOffset === 0) return 'This Week';
    if (weekOffset === -1) return 'Last Week';
    return `${Math.abs(weekOffset)} weeks ago`;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'taken':
        return <Check size={16} className="text-green-600" aria-hidden="true" />;
      case 'missed':
        return <AlertTriangle size={16} className="text-red-600" aria-hidden="true" />;
      case 'pending':
        return <Clock size={16} className="text-gray-500" aria-hidden="true" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'taken':
        return 'bg-green-50 border-green-200';
      case 'missed':
        return 'bg-red-50 border-red-200';
      case 'pending':
        return 'bg-gray-50 border-gray-200';
      default:
        return 'bg-white border-gray-200';
    }
  };

  const filteredMedications = medications.filter(med =>
    med.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    med.dose.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredHistory = historyData.filter(entry => {
    const matchesFilter = historyFilter === 'all' || entry.status === historyFilter;
    const matchesSearch = entry.medicationName.toLowerCase().includes(historySearch.toLowerCase()) ||
                         entry.dose.toLowerCase().includes(historySearch.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const takenCount = medications.filter(med => med.taken).length;
  const totalCount = medications.length;
  const missedCount = medications.filter(med => med.missed).length;
  const remainingCount = totalCount - takenCount;

  const handleExport = (format: 'pdf' | 'csv') => {
    // In a real implementation, this would generate and download the file
    console.log(`Exporting medication history as ${format.toUpperCase()}`);
    alert(`Medication history exported as ${format.toUpperCase()}`);
  };

  return (
    <main className="flex-1 ml-70 p-8 bg-eldercare-background" role="main" aria-label="Medication Tracker">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-nunito font-bold text-eldercare-secondary mb-2">
                Medication Tracker
              </h1>
              <p className="text-lg font-opensans text-eldercare-text">
                Track, schedule, and mark medications with ease
              </p>
            </div>
            
            {/* Search Bar */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={20} className="text-eldercare-text-light" aria-hidden="true" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search medications..."
                className="w-80 pl-10 pr-4 py-3 text-base font-opensans border-2 border-eldercare-primary/20 rounded-xl focus:outline-none focus:ring-3 focus:ring-eldercare-primary focus:border-eldercare-primary transition-all duration-200 bg-white"
                aria-label="Search medications"
              />
            </div>
          </div>

          {/* Mini Dashboard */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-xl shadow-md border border-green-200 p-4 text-center min-h-[120px] flex flex-col justify-center">
              <div className="p-2 bg-green-100 rounded-lg w-fit mx-auto mb-2">
                <Check size={24} className="text-green-600" aria-hidden="true" />
              </div>
              <div className="text-2xl font-nunito font-bold text-green-700 mb-1">
                {takenCount}/{totalCount}
              </div>
              <div className="text-sm font-opensans text-eldercare-text">
                Taken Today
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md border border-eldercare-primary/20 p-4 text-center min-h-[120px] flex flex-col justify-center">
              <div className="p-2 bg-blue-100 rounded-lg w-fit mx-auto mb-2">
                <Clock size={24} className="text-blue-600" aria-hidden="true" />
              </div>
              <div className="text-2xl font-nunito font-bold text-eldercare-secondary mb-1">
                {remainingCount}
              </div>
              <div className="text-sm font-opensans text-eldercare-text">
                Remaining
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md border border-red-200 p-4 text-center min-h-[120px] flex flex-col justify-center">
              <div className="p-2 bg-red-100 rounded-lg w-fit mx-auto mb-2">
                <AlertTriangle size={24} className="text-red-600" aria-hidden="true" />
              </div>
              <div className="text-2xl font-nunito font-bold text-red-700 mb-1">
                {missedCount}
              </div>
              <div className="text-sm font-opensans text-eldercare-text">
                Missed
              </div>
            </div>
          </div>
        </header>

        {/* Navigation Tabs */}
        <nav className="mb-8" role="tablist" aria-label="Medication views">
          <div className="flex space-x-1 bg-white rounded-xl p-2 shadow-md border border-eldercare-primary/10">
            {[
              { id: 'today', label: "Today's Meds", icon: Pill },
              { id: 'weekly', label: 'Weekly View', icon: Calendar },
              { id: 'history', label: 'History', icon: Clock }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as any)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-opensans font-medium text-base min-h-touch transition-all duration-300 focus:outline-none focus:ring-3 focus:ring-eldercare-primary focus:ring-offset-2 ${
                  activeTab === id
                    ? 'bg-eldercare-primary text-white shadow-md'
                    : 'text-eldercare-secondary hover:bg-eldercare-primary/10'
                }`}
                role="tab"
                aria-selected={activeTab === id}
                aria-controls={`${id}-panel`}
              >
                <Icon size={18} aria-hidden="true" />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </nav>

        {/* Today's Medications */}
        {activeTab === 'today' && (
          <section 
            id="today-panel" 
            role="tabpanel" 
            aria-labelledby="today-tab"
            className="space-y-4"
          >
            <h2 className="text-xl font-nunito font-bold text-eldercare-secondary mb-6">
              Saturday, June 21, 2025
            </h2>

            {filteredMedications.length === 0 ? (
              <div className="bg-white rounded-xl shadow-md border border-eldercare-primary/10 p-8 text-center">
                <Pill size={48} className="text-eldercare-primary mx-auto mb-4" aria-hidden="true" />
                <h3 className="text-xl font-nunito font-bold text-eldercare-secondary mb-2">
                  {searchQuery ? 'No medications found' : 'No medications scheduled'}
                </h3>
                <p className="text-base font-opensans text-eldercare-text">
                  {searchQuery ? 'Try adjusting your search terms' : 'Click "Add Medication" to get started'}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredMedications.map((medication) => (
                  <div
                    key={medication.id}
                    className={`bg-white rounded-xl shadow-md border-2 p-6 w-full transition-all duration-300 hover:shadow-lg ${
                      medication.taken 
                        ? 'border-green-200 bg-green-50' 
                        : medication.missed
                          ? 'border-red-200 bg-red-50'
                          : 'border-eldercare-primary/20'
                    }`}
                    style={{ minHeight: '120px' }}
                    role="article"
                    aria-labelledby={`med-${medication.id}-name`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-6 flex-1">
                        <div className={`p-3 rounded-lg flex-shrink-0 ${
                          medication.taken 
                            ? 'bg-green-100' 
                            : medication.missed
                              ? 'bg-red-100'
                              : 'bg-eldercare-primary/10'
                        }`}>
                          <Pill 
                            size={24} 
                            className={`${
                              medication.taken 
                                ? 'text-green-600' 
                                : medication.missed
                                  ? 'text-red-600'
                                  : 'text-eldercare-primary'
                            }`}
                            aria-hidden="true" 
                          />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h3 
                            id={`med-${medication.id}-name`}
                            className="text-xl font-nunito font-bold text-eldercare-secondary mb-2"
                          >
                            {medication.name}
                          </h3>
                          
                          <div className="flex items-center space-x-6 text-base font-opensans text-eldercare-text mb-2">
                            <span className="flex items-center space-x-2">
                              <Clock size={16} aria-hidden="true" />
                              <span className="font-medium">{medication.time}</span>
                            </span>
                            <span className="text-eldercare-text-light">{medication.frequency}</span>
                          </div>
                          
                          <p className="text-base font-opensans text-eldercare-text mb-2">
                            {medication.dose}
                          </p>

                          {/* Status Messages */}
                          {medication.taken && medication.takenAt && (
                            <div className="flex items-center space-x-3 text-green-700">
                              <Check size={16} aria-hidden="true" />
                              <span className="text-sm font-opensans">
                                Taken at {formatTakenTime(medication.takenAt)}
                              </span>
                              <button
                                onClick={() => markAsUntaken(medication.id)}
                                className="text-sm text-green-600 hover:text-green-800 underline focus:outline-none focus:ring-2 focus:ring-green-500 rounded px-1"
                                aria-label={`Undo taking ${medication.name}`}
                              >
                                Undo
                              </button>
                            </div>
                          )}

                          {medication.missed && (
                            <div className="flex items-center space-x-2 text-red-700">
                              <AlertTriangle size={16} aria-hidden="true" />
                              <span className="text-sm font-opensans font-medium">
                                Missed dose – Please consult your doctor
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center space-x-3 ml-6">
                        {!medication.taken && !medication.missed && (
                          <button
                            onClick={() => setShowConfirmModal(medication.id)}
                            className="px-6 py-3 bg-eldercare-primary hover:bg-eldercare-primary-dark text-white rounded-lg font-opensans font-medium text-base min-h-touch transition-all duration-300 focus:outline-none focus:ring-3 focus:ring-eldercare-primary focus:ring-offset-2"
                            aria-label={`Mark ${medication.name} as taken`}
                          >
                            Mark as Taken
                          </button>
                        )}
                        
                        <button
                          onClick={() => setShowDeleteModal(medication.id)}
                          className="p-3 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg min-h-touch min-w-touch transition-all duration-300 focus:outline-none focus:ring-3 focus:ring-red-500 focus:ring-offset-2"
                          aria-label={`Delete ${medication.name}`}
                          title="Delete medication"
                        >
                          <Trash2 size={18} aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Weekly View */}
        {activeTab === 'weekly' && (
          <section id="weekly-panel" role="tabpanel" aria-labelledby="weekly-tab">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-nunito font-bold text-eldercare-secondary">
                  Weekly Medication Overview
                </h2>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setWeekOffset(prev => prev - 1)}
                    className="p-2 bg-white border border-eldercare-primary/20 rounded-lg hover:bg-eldercare-primary/5 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-eldercare-primary"
                    aria-label="Previous week"
                  >
                    <ChevronLeft size={20} className="text-eldercare-primary" />
                  </button>
                  <span className="text-lg font-opensans font-medium text-eldercare-secondary min-w-[120px] text-center">
                    {getWeekTitle()}
                  </span>
                  <button
                    onClick={() => setWeekOffset(prev => prev + 1)}
                    disabled={weekOffset >= 0}
                    className="p-2 bg-white border border-eldercare-primary/20 rounded-lg hover:bg-eldercare-primary/5 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-eldercare-primary disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Next week"
                  >
                    <ChevronRight size={20} className="text-eldercare-primary" />
                  </button>
                </div>
              </div>
              <p className="text-base font-opensans text-eldercare-text">
                Check your medication status for the past 7 days
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-md border border-eldercare-primary/10 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full" role="table">
                  <thead>
                    <tr className="bg-eldercare-primary/5 border-b border-eldercare-primary/10">
                      <th className="text-left p-4 font-nunito font-bold text-eldercare-secondary">
                        Day
                      </th>
                      <th className="text-left p-4 font-nunito font-bold text-eldercare-secondary">
                        Medications
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(weeklyData).map(([day, dayMedications], index) => {
                      const isToday = day === 'Saturday';
                      return (
                        <tr 
                          key={day}
                          className={`border-b border-eldercare-primary/5 ${
                            index % 2 === 0 ? 'bg-white' : 'bg-eldercare-background/30'
                          } ${isToday ? 'bg-eldercare-primary/10' : ''}`}
                        >
                          <td className="p-4 align-top">
                            <div className={`font-opensans font-medium text-base ${
                              isToday ? 'text-eldercare-primary font-bold' : 'text-eldercare-secondary'
                            }`}>
                              {day}
                              {isToday && (
                                <span className="block text-sm text-eldercare-primary">
                                  Today
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="space-y-3">
                              {dayMedications.map((med) => (
                                <div
                                  key={med.id}
                                  className={`flex items-center justify-between p-3 rounded-lg border ${getStatusColor(med.status)}`}
                                >
                                  <div className="flex items-center space-x-3 flex-1">
                                    {getStatusIcon(med.status)}
                                    <div className="flex-1">
                                      <div className="font-opensans font-medium text-eldercare-secondary">
                                        {med.name}
                                      </div>
                                      <div className="text-sm text-eldercare-text-light">
                                        {med.time} • {med.dose}
                                      </div>
                                      {med.status === 'taken' && med.takenAt && (
                                        <div className="text-xs text-green-600 mt-1">
                                          Taken at {formatTakenTime(med.takenAt)}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}

        {/* History */}
        {activeTab === 'history' && (
          <section id="history-panel" role="tabpanel" aria-labelledby="history-tab">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-nunito font-bold text-eldercare-secondary mb-2">
                    Medication History
                  </h2>
                  <p className="text-base font-opensans text-eldercare-text">
                    View past medication logs and notes
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => handleExport('pdf')}
                    className="flex items-center space-x-2 px-4 py-2 bg-eldercare-primary hover:bg-eldercare-primary-dark text-white rounded-lg font-opensans font-medium text-sm transition-all duration-300 focus:outline-none focus:ring-3 focus:ring-eldercare-primary focus:ring-offset-2"
                  >
                    <Download size={16} aria-hidden="true" />
                    <span>Export PDF</span>
                  </button>
                  <button
                    onClick={() => handleExport('csv')}
                    className="flex items-center space-x-2 px-4 py-2 bg-white border border-eldercare-primary text-eldercare-primary hover:bg-eldercare-primary/5 rounded-lg font-opensans font-medium text-sm transition-all duration-300 focus:outline-none focus:ring-3 focus:ring-eldercare-primary focus:ring-offset-2"
                  >
                    <Download size={16} aria-hidden="true" />
                    <span>Export CSV</span>
                  </button>
                </div>
              </div>

              {/* History Filters */}
              <div className="flex items-center space-x-4 mb-6">
                <div className="relative flex-1 max-w-md">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search size={16} className="text-eldercare-text-light" aria-hidden="true" />
                  </div>
                  <input
                    type="text"
                    value={historySearch}
                    onChange={(e) => setHistorySearch(e.target.value)}
                    placeholder="Search by medication..."
                    className="w-full pl-10 pr-4 py-2 text-base font-opensans border-2 border-eldercare-primary/20 rounded-lg focus:outline-none focus:ring-3 focus:ring-eldercare-primary focus:border-eldercare-primary transition-all duration-200 bg-white"
                    aria-label="Search medication history"
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Filter size={16} className="text-eldercare-text-light" aria-hidden="true" />
                  <select
                    value={historyFilter}
                    onChange={(e) => setHistoryFilter(e.target.value as any)}
                    className="px-3 py-2 text-base font-opensans border-2 border-eldercare-primary/20 rounded-lg focus:outline-none focus:ring-3 focus:ring-eldercare-primary focus:border-eldercare-primary transition-all duration-200 bg-white"
                    aria-label="Filter medication history"
                  >
                    <option value="all">All Status</option>
                    <option value="taken">Taken Only</option>
                    <option value="missed">Missed Only</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md border border-eldercare-primary/10">
              <div className="max-h-96 overflow-y-auto">
                {filteredHistory.length === 0 ? (
                  <div className="p-8 text-center">
                    <Clock size={48} className="text-eldercare-primary mx-auto mb-4" aria-hidden="true" />
                    <h3 className="text-xl font-nunito font-bold text-eldercare-secondary mb-2">
                      No history found
                    </h3>
                    <p className="text-base font-opensans text-eldercare-text">
                      Try adjusting your search or filter criteria
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-eldercare-primary/5">
                    {filteredHistory.map((entry) => (
                      <div
                        key={entry.id}
                        className="p-4 hover:bg-eldercare-background/30 transition-colors duration-200"
                        role="article"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3 flex-1">
                            <div className="flex-shrink-0 mt-1">
                              {getStatusIcon(entry.status)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-3 mb-1">
                                <h4 className="font-opensans font-medium text-eldercare-secondary">
                                  {entry.medicationName}
                                </h4>
                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-opensans font-medium ${
                                  entry.status === 'taken' 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-red-100 text-red-800'
                                }`}>
                                  {entry.status === 'taken' ? 'Taken' : 'Missed'}
                                </span>
                              </div>
                              <p className="text-sm font-opensans text-eldercare-text mb-1">
                                {entry.dose}
                              </p>
                              <div className="flex items-center space-x-4 text-xs font-opensans text-eldercare-text-light">
                                <span>{formatDate(entry.date)}</span>
                                {entry.takenAt && (
                                  <span>Taken at {formatTakenTime(entry.takenAt)}</span>
                                )}
                                {entry.markedBy && (
                                  <span>Marked by {entry.markedBy}</span>
                                )}
                              </div>
                              {entry.notes && (
                                <p className="text-sm font-opensans text-eldercare-text italic mt-2">
                                  Note: {entry.notes}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Floating Add Button */}
        <button
          onClick={() => setShowAddForm(true)}
          className="fixed bottom-8 right-8 w-16 h-16 bg-eldercare-primary hover:bg-eldercare-primary-dark text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 focus:outline-none focus:ring-3 focus:ring-eldercare-primary focus:ring-offset-2 hover:scale-105"
          aria-label="Add new medication"
          title="Add Medication"
        >
          <Plus size={24} aria-hidden="true" />
        </button>

        {/* Confirmation Modal */}
        {showConfirmModal && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-modal-title"
          >
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
              <h3 
                id="confirm-modal-title"
                className="text-xl font-nunito font-bold text-eldercare-secondary mb-4"
              >
                Confirm Medication
              </h3>
              <p className="text-base font-opensans text-eldercare-text mb-6">
                Are you sure you've taken this medication?
              </p>
              <div className="flex space-x-4">
                <button
                  onClick={() => setShowConfirmModal(null)}
                  className="flex-1 px-6 py-3 border-2 border-eldercare-primary text-eldercare-primary rounded-lg font-opensans font-semibold text-base min-h-touch transition-all duration-300 focus:outline-none focus:ring-3 focus:ring-eldercare-primary focus:ring-offset-2 hover:bg-eldercare-primary/5"
                >
                  Cancel
                </button>
                <button
                  onClick={() => confirmTaken(showConfirmModal)}
                  className="flex-1 px-6 py-3 bg-eldercare-primary hover:bg-eldercare-primary-dark text-white rounded-lg font-opensans font-semibold text-base min-h-touch transition-all duration-300 focus:outline-none focus:ring-3 focus:ring-eldercare-primary focus:ring-offset-2"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-modal-title"
          >
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
              <h3 
                id="delete-modal-title"
                className="text-xl font-nunito font-bold text-eldercare-secondary mb-4"
              >
                Delete Medication
              </h3>
              <p className="text-base font-opensans text-eldercare-text mb-6">
                Are you sure you want to delete this medication? This action cannot be undone.
              </p>
              <div className="flex space-x-4">
                <button
                  onClick={() => setShowDeleteModal(null)}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-eldercare-secondary rounded-lg font-opensans font-semibold text-base min-h-touch transition-all duration-300 focus:outline-none focus:ring-3 focus:ring-gray-300 focus:ring-offset-2 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => confirmDelete(showDeleteModal)}
                  className="flex-1 px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-opensans font-semibold text-base min-h-touch transition-all duration-300 focus:outline-none focus:ring-3 focus:ring-red-500 focus:ring-offset-2"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add Medication Modal */}
        {showAddForm && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-medication-title"
          >
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 
                    id="add-medication-title"
                    className="text-2xl font-nunito font-bold text-eldercare-secondary"
                  >
                    Add New Medication
                  </h2>
                  <button
                    onClick={() => setShowAddForm(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-eldercare-primary focus:ring-offset-1"
                    aria-label="Close dialog"
                  >
                    <X size={24} className="text-eldercare-text" aria-hidden="true" />
                  </button>
                </div>

                <form onSubmit={handleAddMedication} className="space-y-6">
                  <div>
                    <label 
                      htmlFor="med-name" 
                      className="block text-base font-opensans font-medium text-eldercare-secondary mb-2"
                    >
                      Medication Name *
                    </label>
                    <input
                      id="med-name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-4 py-3 text-base font-opensans border-2 border-eldercare-primary/20 rounded-lg focus:outline-none focus:ring-3 focus:ring-eldercare-primary focus:border-eldercare-primary transition-all duration-200"
                      placeholder="e.g., Amlodipine"
                      required
                    />
                  </div>

                  <div>
                    <label 
                      htmlFor="med-time" 
                      className="block text-base font-opensans font-medium text-eldercare-secondary mb-2"
                    >
                      Time *
                    </label>
                    <input
                      id="med-time"
                      type="time"
                      value={formData.time}
                      onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                      className="w-full px-4 py-3 text-base font-opensans border-2 border-eldercare-primary/20 rounded-lg focus:outline-none focus:ring-3 focus:ring-eldercare-primary focus:border-eldercare-primary transition-all duration-200"
                      required
                    />
                  </div>

                  <div>
                    <label 
                      htmlFor="med-dose" 
                      className="block text-base font-opensans font-medium text-eldercare-secondary mb-2"
                    >
                      Dose Information *
                    </label>
                    <input
                      id="med-dose"
                      type="text"
                      value={formData.dose}
                      onChange={(e) => setFormData(prev => ({ ...prev, dose: e.target.value }))}
                      className="w-full px-4 py-3 text-base font-opensans border-2 border-eldercare-primary/20 rounded-lg focus:outline-none focus:ring-3 focus:ring-eldercare-primary focus:border-eldercare-primary transition-all duration-200"
                      placeholder="e.g., 1 Tablet - After Breakfast"
                      required
                    />
                  </div>

                  <div>
                    <label 
                      htmlFor="med-frequency" 
                      className="block text-base font-opensans font-medium text-eldercare-secondary mb-2"
                    >
                      Frequency
                    </label>
                    <select
                      id="med-frequency"
                      value={formData.frequency}
                      onChange={(e) => setFormData(prev => ({ ...prev, frequency: e.target.value }))}
                      className="w-full px-4 py-3 text-base font-opensans border-2 border-eldercare-primary/20 rounded-lg focus:outline-none focus:ring-3 focus:ring-eldercare-primary focus:border-eldercare-primary transition-all duration-200"
                    >
                      <option value="Daily">Daily</option>
                      <option value="Every Other Day">Every Other Day</option>
                      <option value="Weekly">Weekly</option>
                      <option value="As Needed">As Needed</option>
                    </select>
                  </div>

                  <div>
                    <label 
                      htmlFor="med-notes" 
                      className="block text-base font-opensans font-medium text-eldercare-secondary mb-2"
                    >
                      Notes (Optional)
                    </label>
                    <textarea
                      id="med-notes"
                      value={formData.notes}
                      onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                      rows={3}
                      className="w-full px-4 py-3 text-base font-opensans border-2 border-eldercare-primary/20 rounded-lg focus:outline-none focus:ring-3 focus:ring-eldercare-primary focus:border-eldercare-primary transition-all duration-200 resize-none"
                      placeholder="Any special instructions..."
                    />
                  </div>

                  <div className="flex space-x-4 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowAddForm(false)}
                      className="flex-1 px-6 py-3 border-2 border-eldercare-primary text-eldercare-primary rounded-lg font-opensans font-semibold text-base min-h-touch transition-all duration-300 focus:outline-none focus:ring-3 focus:ring-eldercare-primary focus:ring-offset-2 hover:bg-eldercare-primary/5"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-6 py-3 bg-eldercare-primary hover:bg-eldercare-primary-dark text-white rounded-lg font-opensans font-semibold text-base min-h-touch transition-all duration-300 focus:outline-none focus:ring-3 focus:ring-eldercare-primary focus:ring-offset-2"
                    >
                      Save Medication
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