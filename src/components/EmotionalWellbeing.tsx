import React, { useState, useRef } from 'react';
import { 
  Smile, 
  Meh, 
  Frown, 
  Heart,
  Calendar,
  Clock,
  Mic,
  MicOff,
  Camera,
  Paperclip,
  Send,
  TrendingUp,
  BookOpen,
  Lightbulb,
  ChevronLeft,
  ChevronRight,
  X,
  Check,
  Volume2
} from 'lucide-react';

interface MoodEntry {
  id: string;
  mood: 'happy' | 'okay' | 'neutral' | 'sad' | 'upset';
  note?: string;
  voiceNote?: string;
  images?: string[];
  timestamp: Date;
  isCustomTime?: boolean;
}

interface JournalEntry {
  id: string;
  content: string;
  voiceNote?: string;
  images?: string[];
  timestamp: Date;
  isCustomTime?: boolean;
}

const moodOptions = [
  { id: 'happy', emoji: '😄', label: 'Happy', color: 'text-green-600' },
  { id: 'okay', emoji: '🙂', label: 'Okay', color: 'text-blue-600' },
  { id: 'neutral', emoji: '😐', label: 'Neutral', color: 'text-gray-600' },
  { id: 'sad', emoji: '🙁', label: 'Sad', color: 'text-yellow-600' },
  { id: 'upset', emoji: '😢', label: 'Upset', color: 'text-red-600' }
];

const supportTips = [
  {
    quote: "Take three deep breaths and smile.",
    tip: "Deep breathing can help calm your mind and reduce stress.",
    exercise: "Try the 4-7-8 breathing technique"
  },
  {
    quote: "It's okay to ask for help.",
    tip: "Reaching out to others shows strength, not weakness.",
    exercise: "Call a friend or family member today"
  },
  {
    quote: "Call someone you love.",
    tip: "Social connections are vital for emotional wellbeing.",
    exercise: "Share a happy memory with someone special"
  },
  {
    quote: "Every small step counts.",
    tip: "Progress doesn't have to be perfect to be meaningful.",
    exercise: "Celebrate one small achievement today"
  }
];

export const EmotionalWellbeing: React.FC = () => {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [moodNote, setMoodNote] = useState('');
  const [journalEntry, setJournalEntry] = useState('');
  const [showMoodHistory, setShowMoodHistory] = useState(false);
  const [showJournalHistory, setShowJournalHistory] = useState(false);
  const [historyDays, setHistoryDays] = useState(7);
  const [currentTip] = useState(supportTips[Math.floor(Math.random() * supportTips.length)]);
  
  // Time selection states
  const [moodTimeType, setMoodTimeType] = useState<'current' | 'custom'>('current');
  const [journalTimeType, setJournalTimeType] = useState<'current' | 'custom'>('current');
  const [customMoodDate, setCustomMoodDate] = useState('');
  const [customMoodTime, setCustomMoodTime] = useState('');
  const [customJournalDate, setCustomJournalDate] = useState('');
  const [customJournalTime, setCustomJournalTime] = useState('');
  
  // Voice recording states
  const [isMoodVoiceRecording, setIsMoodVoiceRecording] = useState(false);
  const [isJournalVoiceRecording, setIsJournalVoiceRecording] = useState(false);
  
  // File upload states
  const [moodImages, setMoodImages] = useState<string[]>([]);
  const [journalImages, setJournalImages] = useState<string[]>([]);
  
  // Data storage
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([
    {
      id: '1',
      content: 'Had a wonderful morning walk in the garden. The flowers are blooming beautifully and I felt so peaceful.',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      isCustomTime: false
    },
    {
      id: '2',
      content: 'Called my granddaughter today. She told me about her school project and it made me so proud. These moments are precious.',
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      isCustomTime: false
    },
    {
      id: '3',
      content: 'Tried a new recipe today - lemon cake. It turned out delicious! Shared it with my neighbor and we had a lovely chat.',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      isCustomTime: false
    }
  ]);
  
  const moodFileInputRef = useRef<HTMLInputElement>(null);
  const journalFileInputRef = useRef<HTMLInputElement>(null);

  const handleMoodSelection = (moodId: string) => {
    setSelectedMood(moodId);
  };

  const handleMoodVoiceToggle = () => {
    setIsMoodVoiceRecording(!isMoodVoiceRecording);
    // In a real implementation, this would start/stop voice recording
    if (!isMoodVoiceRecording) {
      console.log('Starting mood voice recording...');
    } else {
      console.log('Stopping mood voice recording...');
    }
  };

  const handleJournalVoiceToggle = () => {
    setIsJournalVoiceRecording(!isJournalVoiceRecording);
    // In a real implementation, this would start/stop voice recording
    if (!isJournalVoiceRecording) {
      console.log('Starting journal voice recording...');
    } else {
      console.log('Stopping journal voice recording...');
    }
  };

  const handleMoodImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      // In a real implementation, you would upload these files
      const newImages = Array.from(files).map(file => URL.createObjectURL(file));
      setMoodImages(prev => [...prev, ...newImages]);
    }
  };

  const handleJournalImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      // In a real implementation, you would upload these files
      const newImages = Array.from(files).map(file => URL.createObjectURL(file));
      setJournalImages(prev => [...prev, ...newImages]);
    }
  };

  const getTimestamp = (timeType: 'current' | 'custom', customDate: string, customTime: string): Date => {
    if (timeType === 'current') {
      return new Date();
    } else {
      return new Date(`${customDate}T${customTime}`);
    }
  };

  const submitMood = () => {
    if (!selectedMood) return;

    const timestamp = getTimestamp(moodTimeType, customMoodDate, customMoodTime);
    
    const newEntry: MoodEntry = {
      id: Date.now().toString(),
      mood: selectedMood as any,
      note: moodNote,
      voiceNote: isMoodVoiceRecording ? 'voice-note-placeholder' : undefined,
      images: moodImages.length > 0 ? moodImages : undefined,
      timestamp,
      isCustomTime: moodTimeType === 'custom'
    };

    setMoodEntries(prev => [...prev, newEntry]);
    
    // Reset form
    setSelectedMood(null);
    setMoodNote('');
    setMoodImages([]);
    setMoodTimeType('current');
    setCustomMoodDate('');
    setCustomMoodTime('');
    setIsMoodVoiceRecording(false);
  };

  const submitJournal = () => {
    if (!journalEntry.trim()) return;

    const timestamp = getTimestamp(journalTimeType, customJournalDate, customJournalTime);
    
    const newEntry: JournalEntry = {
      id: Date.now().toString(),
      content: journalEntry,
      voiceNote: isJournalVoiceRecording ? 'voice-note-placeholder' : undefined,
      images: journalImages.length > 0 ? journalImages : undefined,
      timestamp,
      isCustomTime: journalTimeType === 'custom'
    };

    setJournalEntries(prev => [...prev, newEntry]);
    
    // Reset form
    setJournalEntry('');
    setJournalImages([]);
    setJournalTimeType('current');
    setCustomJournalDate('');
    setCustomJournalTime('');
    setIsJournalVoiceRecording(false);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getMoodColor = (mood: string) => {
    const moodOption = moodOptions.find(option => option.id === mood);
    return moodOption?.color || 'text-gray-600';
  };

  const getMoodEmoji = (mood: string) => {
    const moodOption = moodOptions.find(option => option.id === mood);
    return moodOption?.emoji || '😐';
  };

  const recentMoods = moodEntries.slice(-historyDays).reverse();
  const recentJournals = journalEntries.slice().reverse();

  return (
    <main className="flex-1 ml-70 p-6 bg-eldercare-background" role="main" aria-label="Emotional Wellbeing">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-3xl font-nunito font-bold text-eldercare-secondary mb-2">
            Emotional Wellbeing
          </h1>
          <p className="text-lg font-opensans text-eldercare-text">
            Track your feelings, reflect, and find peace
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Mood Tracker & Journal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Daily Mood Check-In */}
            <section className="bg-white rounded-xl shadow-md border border-eldercare-primary/10 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-nunito font-bold text-eldercare-secondary">
                  How are you feeling today?
                </h2>
                
                {/* Time Selection Boxes */}
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setMoodTimeType('current')}
                    className={`px-4 py-2 rounded-lg font-opensans font-medium text-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-eldercare-primary focus:ring-offset-1 ${
                      moodTimeType === 'current'
                        ? 'bg-eldercare-primary text-white'
                        : 'bg-gray-100 text-eldercare-secondary hover:bg-gray-200'
                    }`}
                  >
                    Current
                  </button>
                  <button
                    onClick={() => setMoodTimeType('custom')}
                    className={`px-4 py-2 rounded-lg font-opensans font-medium text-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-eldercare-primary focus:ring-offset-1 ${
                      moodTimeType === 'custom'
                        ? 'bg-eldercare-primary text-white'
                        : 'bg-gray-100 text-eldercare-secondary hover:bg-gray-200'
                    }`}
                  >
                    Custom
                  </button>
                </div>
              </div>

              {/* Custom Time Selection */}
              {moodTimeType === 'custom' && (
                <div className="mb-4 p-4 bg-eldercare-background/50 rounded-lg">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="mood-date" className="block text-sm font-opensans font-medium text-eldercare-secondary mb-1">
                        Date
                      </label>
                      <input
                        id="mood-date"
                        type="date"
                        value={customMoodDate}
                        onChange={(e) => setCustomMoodDate(e.target.value)}
                        className="w-full px-3 py-2 text-sm font-opensans border-2 border-eldercare-primary/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-eldercare-primary focus:border-eldercare-primary transition-all duration-200"
                      />
                    </div>
                    <div>
                      <label htmlFor="mood-time" className="block text-sm font-opensans font-medium text-eldercare-secondary mb-1">
                        Time
                      </label>
                      <input
                        id="mood-time"
                        type="time"
                        value={customMoodTime}
                        onChange={(e) => setCustomMoodTime(e.target.value)}
                        className="w-full px-3 py-2 text-sm font-opensans border-2 border-eldercare-primary/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-eldercare-primary focus:border-eldercare-primary transition-all duration-200"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Mood Selection */}
              <div className="grid grid-cols-5 gap-4 mb-6">
                {moodOptions.map((mood) => (
                  <button
                    key={mood.id}
                    onClick={() => handleMoodSelection(mood.id)}
                    className={`p-4 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-3 focus:ring-eldercare-primary focus:ring-offset-2 hover:scale-105 ${
                      selectedMood === mood.id
                        ? 'border-eldercare-primary bg-eldercare-primary/10 shadow-md'
                        : 'border-gray-200 hover:border-eldercare-primary/50 hover:bg-eldercare-primary/5'
                    }`}
                    aria-label={`Select ${mood.label} mood`}
                  >
                    <div className="text-3xl mb-2">{mood.emoji}</div>
                    <div className={`text-sm font-opensans font-medium ${mood.color}`}>
                      {mood.label}
                    </div>
                  </button>
                ))}
              </div>

              {/* Mood Note Input */}
              {selectedMood && (
                <div className="space-y-4">
                  <div>
                    <label htmlFor="mood-note" className="block text-sm font-opensans font-medium text-eldercare-secondary mb-2">
                      Want to share more? (Optional)
                    </label>
                    <div className="relative">
                      <textarea
                        id="mood-note"
                        value={moodNote}
                        onChange={(e) => setMoodNote(e.target.value)}
                        rows={3}
                        className="w-full px-4 py-3 text-base font-opensans border-2 border-eldercare-primary/20 rounded-lg focus:outline-none focus:ring-3 focus:ring-eldercare-primary focus:border-eldercare-primary transition-all duration-200 resize-none"
                        placeholder="Tell us more about how you're feeling..."
                      />
                    </div>
                  </div>

                  {/* Voice and File Upload Controls */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {/* Voice Recording Button */}
                      <button
                        onClick={handleMoodVoiceToggle}
                        className={`flex items-center space-x-2 rounded-lg transition-all duration-300 focus:outline-none focus:ring-3 focus:ring-offset-2 ${
                          isMoodVoiceRecording
                            ? 'bg-red-500 hover:bg-red-600 focus:ring-red-500 text-white px-4 py-3 scale-105'
                            : 'bg-eldercare-primary hover:bg-eldercare-primary-dark focus:ring-eldercare-primary text-white p-3'
                        }`}
                        aria-label={isMoodVoiceRecording ? 'Stop voice recording' : 'Start voice recording'}
                        title={isMoodVoiceRecording ? 'Stop recording' : 'Record voice note'}
                      >
                        <Mic size={20} />
                        {isMoodVoiceRecording && (
                          <>
                            <Volume2 size={16} className="animate-pulse" />
                            <span className="text-sm font-opensans">Listening...</span>
                          </>
                        )}
                      </button>

                      {/* File Upload Button */}
                      <button
                        onClick={() => moodFileInputRef.current?.click()}
                        className="p-3 bg-eldercare-primary hover:bg-eldercare-primary-dark text-white rounded-lg transition-all duration-300 focus:outline-none focus:ring-3 focus:ring-eldercare-primary focus:ring-offset-2"
                        aria-label="Upload images"
                        title="Add photos"
                      >
                        <Camera size={20} />
                      </button>
                      
                      <input
                        ref={moodFileInputRef}
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleMoodImageUpload}
                        className="hidden"
                      />
                    </div>

                    {/* Submit Button */}
                    <button
                      onClick={submitMood}
                      className="px-6 py-3 bg-eldercare-primary hover:bg-eldercare-primary-dark text-white rounded-lg font-opensans font-semibold text-base transition-all duration-300 focus:outline-none focus:ring-3 focus:ring-eldercare-primary focus:ring-offset-2"
                    >
                      Submit Mood
                    </button>
                  </div>

                  {/* Uploaded Images Preview */}
                  {moodImages.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {moodImages.map((image, index) => (
                        <div key={index} className="relative">
                          <img
                            src={image}
                            alt={`Mood image ${index + 1}`}
                            className="w-16 h-16 object-cover rounded-lg border border-eldercare-primary/20"
                          />
                          <button
                            onClick={() => setMoodImages(prev => prev.filter((_, i) => i !== index))}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-colors duration-200"
                            aria-label="Remove image"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </section>

            {/* Journal Section */}
            <section className="bg-white rounded-xl shadow-md border border-eldercare-primary/10 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-nunito font-bold text-eldercare-secondary">
                  Write About Your Day
                </h2>
                
                {/* Time Selection Boxes */}
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setJournalTimeType('current')}
                    className={`px-4 py-2 rounded-lg font-opensans font-medium text-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-eldercare-primary focus:ring-offset-1 ${
                      journalTimeType === 'current'
                        ? 'bg-eldercare-primary text-white'
                        : 'bg-gray-100 text-eldercare-secondary hover:bg-gray-200'
                    }`}
                  >
                    Current
                  </button>
                  <button
                    onClick={() => setJournalTimeType('custom')}
                    className={`px-4 py-2 rounded-lg font-opensans font-medium text-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-eldercare-primary focus:ring-offset-1 ${
                      journalTimeType === 'custom'
                        ? 'bg-eldercare-primary text-white'
                        : 'bg-gray-100 text-eldercare-secondary hover:bg-gray-200'
                    }`}
                  >
                    Custom
                  </button>
                </div>
              </div>

              {/* Custom Time Selection */}
              {journalTimeType === 'custom' && (
                <div className="mb-4 p-4 bg-eldercare-background/50 rounded-lg">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="journal-date" className="block text-sm font-opensans font-medium text-eldercare-secondary mb-1">
                        Date
                      </label>
                      <input
                        id="journal-date"
                        type="date"
                        value={customJournalDate}
                        onChange={(e) => setCustomJournalDate(e.target.value)}
                        className="w-full px-3 py-2 text-sm font-opensans border-2 border-eldercare-primary/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-eldercare-primary focus:border-eldercare-primary transition-all duration-200"
                      />
                    </div>
                    <div>
                      <label htmlFor="journal-time" className="block text-sm font-opensans font-medium text-eldercare-secondary mb-1">
                        Time
                      </label>
                      <input
                        id="journal-time"
                        type="time"
                        value={customJournalTime}
                        onChange={(e) => setCustomJournalTime(e.target.value)}
                        className="w-full px-3 py-2 text-sm font-opensans border-2 border-eldercare-primary/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-eldercare-primary focus:border-eldercare-primary transition-all duration-200"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label htmlFor="journal-entry" className="block text-sm font-opensans font-medium text-eldercare-secondary mb-2">
                    What made you smile today?
                  </label>
                  <textarea
                    id="journal-entry"
                    value={journalEntry}
                    onChange={(e) => setJournalEntry(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 text-base font-opensans border-2 border-eldercare-primary/20 rounded-lg focus:outline-none focus:ring-3 focus:ring-eldercare-primary focus:border-eldercare-primary transition-all duration-200 resize-none"
                    placeholder="Share your thoughts, feelings, or memorable moments from today..."
                  />
                </div>

                {/* Voice and File Upload Controls */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {/* Voice Recording Button */}
                    <button
                      onClick={handleJournalVoiceToggle}
                      className={`flex items-center space-x-2 rounded-lg transition-all duration-300 focus:outline-none focus:ring-3 focus:ring-offset-2 ${
                        isJournalVoiceRecording
                          ? 'bg-red-500 hover:bg-red-600 focus:ring-red-500 text-white px-4 py-3 scale-105'
                          : 'bg-eldercare-primary hover:bg-eldercare-primary-dark focus:ring-eldercare-primary text-white p-3'
                      }`}
                      aria-label={isJournalVoiceRecording ? 'Stop voice recording' : 'Start voice recording'}
                      title={isJournalVoiceRecording ? 'Stop recording' : 'Record voice note'}
                    >
                      <Mic size={20} />
                      {isJournalVoiceRecording && (
                        <>
                          <Volume2 size={16} className="animate-pulse" />
                          <span className="text-sm font-opensans">Listening...</span>
                        </>
                      )}
                    </button>

                    {/* File Upload Button */}
                    <button
                      onClick={() => journalFileInputRef.current?.click()}
                      className="p-3 bg-eldercare-primary hover:bg-eldercare-primary-dark text-white rounded-lg transition-all duration-300 focus:outline-none focus:ring-3 focus:ring-eldercare-primary focus:ring-offset-2"
                      aria-label="Upload images"
                      title="Add photos"
                    >
                      <Camera size={20} />
                    </button>
                    
                    <input
                      ref={journalFileInputRef}
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleJournalImageUpload}
                      className="hidden"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    onClick={submitJournal}
                    disabled={!journalEntry.trim()}
                    className="px-6 py-3 bg-eldercare-primary hover:bg-eldercare-primary-dark disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg font-opensans font-semibold text-base transition-all duration-300 focus:outline-none focus:ring-3 focus:ring-eldercare-primary focus:ring-offset-2"
                  >
                    Save Entry
                  </button>
                </div>

                {/* Uploaded Images Preview */}
                {journalImages.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {journalImages.map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={image}
                          alt={`Journal image ${index + 1}`}
                          className="w-16 h-16 object-cover rounded-lg border border-eldercare-primary/20"
                        />
                        <button
                          onClick={() => setJournalImages(prev => prev.filter((_, i) => i !== index))}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-colors duration-200"
                          aria-label="Remove image"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>

            {/* Journal History Section */}
            <section className="bg-white rounded-xl shadow-md border border-eldercare-primary/10 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-nunito font-bold text-eldercare-secondary">
                  Journal History
                </h2>
                <button
                  onClick={() => setShowJournalHistory(!showJournalHistory)}
                  className="text-sm font-opensans text-eldercare-primary hover:text-eldercare-primary-dark transition-colors duration-200"
                >
                  {showJournalHistory ? 'Hide All' : 'Show All'}
                </button>
              </div>

              {journalEntries.length === 0 ? (
                <p className="text-sm font-opensans text-eldercare-text text-center py-4">
                  No journal entries yet. Start writing about your day!
                </p>
              ) : (
                <div className="space-y-4">
                  {(showJournalHistory ? recentJournals : recentJournals.slice(0, 2)).map((entry) => (
                    <div
                      key={entry.id}
                      className="p-4 bg-eldercare-background/30 rounded-lg border border-eldercare-primary/10"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="text-xs font-opensans text-eldercare-text-light">
                          {formatDate(entry.timestamp)}
                        </div>
                        {entry.voiceNote && (
                          <button
                            className="p-1 text-eldercare-primary hover:text-eldercare-primary-dark transition-colors duration-200"
                            aria-label="Play voice note"
                            title="Voice note available"
                          >
                            <Volume2 size={14} />
                          </button>
                        )}
                      </div>
                      <div className="text-sm font-opensans text-eldercare-secondary leading-relaxed">
                        {entry.content}
                      </div>
                      {entry.images && entry.images.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {entry.images.map((image, index) => (
                            <img
                              key={index}
                              src={image}
                              alt={`Journal image ${index + 1}`}
                              className="w-12 h-12 object-cover rounded-lg border border-eldercare-primary/20"
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* Right Column - Support & History */}
          <div className="space-y-6">
            {/* Today's Support Tip */}
            <section className="bg-white rounded-xl shadow-md border border-eldercare-primary/10 p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-eldercare-primary/10 rounded-lg">
                  <Lightbulb size={20} className="text-eldercare-primary" />
                </div>
                <h2 className="text-lg font-nunito font-bold text-eldercare-secondary">
                  Today's Support Tip
                </h2>
              </div>
              
              <div className="space-y-4">
                <blockquote className="text-base font-opensans text-eldercare-secondary italic border-l-4 border-eldercare-primary pl-4">
                  "{currentTip.quote}"
                </blockquote>
                
                <p className="text-sm font-opensans text-eldercare-text">
                  {currentTip.tip}
                </p>
                
                <div className="p-3 bg-eldercare-background/50 rounded-lg">
                  <p className="text-sm font-opensans font-medium text-eldercare-secondary">
                    Try this: {currentTip.exercise}
                  </p>
                </div>
              </div>
            </section>

            {/* Mood History */}
            <section className="bg-white rounded-xl shadow-md border border-eldercare-primary/10 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-nunito font-bold text-eldercare-secondary">
                  Recent Moods
                </h2>
                <button
                  onClick={() => setShowMoodHistory(!showMoodHistory)}
                  className="text-sm font-opensans text-eldercare-primary hover:text-eldercare-primary-dark transition-colors duration-200"
                >
                  {showMoodHistory ? 'Hide' : 'Show All'}
                </button>
              </div>

              {moodEntries.length === 0 ? (
                <p className="text-sm font-opensans text-eldercare-text text-center py-4">
                  No mood entries yet. Start by sharing how you feel!
                </p>
              ) : (
                <div className="space-y-3">
                  {(showMoodHistory ? recentMoods : recentMoods.slice(0, 3)).map((entry) => (
                    <div
                      key={entry.id}
                      className="flex items-center space-x-3 p-3 bg-eldercare-background/30 rounded-lg"
                    >
                      <div className="text-2xl">{getMoodEmoji(entry.mood)}</div>
                      <div className="flex-1 min-w-0">
                        <div className={`text-sm font-opensans font-medium ${getMoodColor(entry.mood)}`}>
                          {entry.mood.charAt(0).toUpperCase() + entry.mood.slice(1)}
                        </div>
                        <div className="text-xs font-opensans text-eldercare-text-light">
                          {formatDate(entry.timestamp)}
                        </div>
                        {entry.note && (
                          <div className="text-xs font-opensans text-eldercare-text mt-1 truncate">
                            {entry.note}
                          </div>
                        )}
                      </div>
                      {entry.voiceNote && (
                        <button
                          className="p-1 text-eldercare-primary hover:text-eldercare-primary-dark transition-colors duration-200"
                          aria-label="Play voice note"
                          title="Voice note available"
                        >
                          <Volume2 size={14} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </main>
  );
};