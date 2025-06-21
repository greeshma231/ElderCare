import React, { useState, useRef, useEffect } from 'react';
import { 
  Mic, 
  MicOff, 
  Send, 
  Volume2, 
  MessageCircle,
  Loader2,
  Plus,
  Clock,
  Smile,
  Meh,
  Frown,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Save
} from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'mitra';
  timestamp: Date;
  hasAudio?: boolean;
}

interface ChatSession {
  id: string;
  title: string;
  lastUpdated: Date;
  mood: 'happy' | 'neutral' | 'sad';
  messages: Message[];
}

export const ChatAssistant: React.FC = () => {
  const [currentSessionId, setCurrentSessionId] = useState<string>('1');
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([
    {
      id: '1',
      title: 'Mitra – June 21, 2025',
      lastUpdated: new Date(),
      mood: 'happy',
      messages: [
        {
          id: '1',
          text: "Hi, I'm Mitra, your AI companion. I'm here to support you with reminders, wellness, or just a friendly chat. How can I help you today?",
          sender: 'mitra',
          timestamp: new Date(),
          hasAudio: true
        }
      ]
    },
    {
      id: '2',
      title: 'Mitra – June 20, 2025',
      lastUpdated: new Date(Date.now() - 24 * 60 * 60 * 1000),
      mood: 'neutral',
      messages: [
        {
          id: '1',
          text: "Hi, I'm Mitra, your AI companion. I'm here to support you with reminders, wellness, or just a friendly chat. How can I help you today?",
          sender: 'mitra',
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
          hasAudio: true
        },
        {
          id: '2',
          text: "How are my medications today?",
          sender: 'user',
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000 + 5 * 60 * 1000),
        },
        {
          id: '3',
          text: "Let me check your medication schedule for today. You have three medications scheduled: Amlodipine at 8 AM (completed), Metformin at 12 PM (upcoming), and Lisinopril at 6 PM (scheduled). You're doing great staying on track!",
          sender: 'mitra',
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000 + 6 * 60 * 1000),
          hasAudio: true
        }
      ]
    },
    {
      id: '3',
      title: 'Mitra – June 19, 2025',
      lastUpdated: new Date(Date.now() - 48 * 60 * 60 * 1000),
      mood: 'sad',
      messages: [
        {
          id: '1',
          text: "Hi, I'm Mitra, your AI companion. I'm here to support you with reminders, wellness, or just a friendly chat. How can I help you today?",
          sender: 'mitra',
          timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000),
          hasAudio: true
        },
        {
          id: '2',
          text: "I'm feeling a bit lonely today",
          sender: 'user',
          timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000 + 10 * 60 * 1000),
        },
        {
          id: '3',
          text: "I'm sorry to hear you're feeling lonely. That's completely understandable, and I'm here with you. Would you like to talk about what's on your mind, or perhaps I could suggest some activities that might help you feel more connected?",
          sender: 'mitra',
          timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000 + 11 * 60 * 1000),
          hasAudio: true
        }
      ]
    }
  ]);

  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Get current session
  const currentSession = chatSessions.find(session => session.id === currentSessionId);
  const messages = currentSession?.messages || [];

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: text.trim(),
      sender: 'user',
      timestamp: new Date()
    };

    // Update current session with new message
    setChatSessions(prev => prev.map(session => 
      session.id === currentSessionId 
        ? { 
            ...session, 
            messages: [...session.messages, userMessage],
            lastUpdated: new Date()
          }
        : session
    ));

    setInputText('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "I understand. Let me help you with that. Is there anything specific you'd like to know?",
        "That's a great question! Based on your health profile, I'd recommend checking with your doctor.",
        "I'm here to support you. Would you like me to set a reminder for that?",
        "Thank you for sharing that with me. How are you feeling today?",
        "I can help you with medication reminders, health tracking, or just have a friendly conversation.",
        "That sounds wonderful! Tell me more about what's making you feel that way.",
        "I'm glad you reached out. Let's work through this together."
      ];
      
      const mitraResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: responses[Math.floor(Math.random() * responses.length)],
        sender: 'mitra',
        timestamp: new Date(),
        hasAudio: true
      };

      setChatSessions(prev => prev.map(session => 
        session.id === currentSessionId 
          ? { 
              ...session, 
              messages: [...session.messages, mitraResponse],
              lastUpdated: new Date()
            }
          : session
      ));
      setIsTyping(false);
    }, 1500);
  };

  const handleVoiceInput = () => {
    if (isListening) {
      // Stop listening
      setIsListening(false);
      setTranscription('');
    } else {
      // Start listening
      setIsListening(true);
      setTranscription('Listening...');
      
      // Simulate voice recognition
      setTimeout(() => {
        const sampleTranscriptions = [
          "How are my medications today?",
          "I'm feeling a bit tired",
          "Can you remind me about my appointment?",
          "What's the weather like?",
          "I need help with my blood pressure reading"
        ];
        
        const transcribed = sampleTranscriptions[Math.floor(Math.random() * sampleTranscriptions.length)];
        setTranscription(transcribed);
        setInputText(transcribed);
        setIsListening(false);
      }, 3000);
    }
  };

  const handleTextToSpeech = (text: string) => {
    // In a real implementation, this would use the Web Speech API
    console.log('Playing text-to-speech:', text);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(inputText);
    }
  };

  const startNewChat = () => {
    // Check if current chat has unsaved messages
    const currentMessages = currentSession?.messages || [];
    if (currentMessages.length > 1) {
      setShowSaveModal(true);
    } else {
      createNewChat();
    }
  };

  const createNewChat = () => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: `Mitra – ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`,
      lastUpdated: new Date(),
      mood: 'neutral',
      messages: [
        {
          id: '1',
          text: "Hi, I'm Mitra, your AI companion. I'm here to support you with reminders, wellness, or just a friendly chat. How can I help you today?",
          sender: 'mitra',
          timestamp: new Date(),
          hasAudio: true
        }
      ]
    };

    setChatSessions(prev => [newSession, ...prev]);
    setCurrentSessionId(newSession.id);
    setShowSaveModal(false);
  };

  const switchToSession = (sessionId: string) => {
    setCurrentSessionId(sessionId);
  };

  const deleteSession = (sessionId: string) => {
    setChatSessions(prev => prev.filter(session => session.id !== sessionId));
    setShowDeleteModal(null);
    
    // If we deleted the current session, switch to the first available one
    if (sessionId === currentSessionId) {
      const remainingSessions = chatSessions.filter(session => session.id !== sessionId);
      if (remainingSessions.length > 0) {
        setCurrentSessionId(remainingSessions[0].id);
      } else {
        createNewChat();
      }
    }
  };

  const getMoodIcon = (mood: string) => {
    switch (mood) {
      case 'happy':
        return <Smile size={16} className="text-green-600" aria-hidden="true" />;
      case 'sad':
        return <Frown size={16} className="text-red-600" aria-hidden="true" />;
      default:
        return <Meh size={16} className="text-gray-600" aria-hidden="true" />;
    }
  };

  const getMoodColor = (mood: string) => {
    switch (mood) {
      case 'happy':
        return 'border-l-green-400';
      case 'sad':
        return 'border-l-red-400';
      default:
        return 'border-l-gray-400';
    }
  };

  return (
    <main className="flex-1 ml-70 bg-eldercare-background flex" role="main" aria-label="Chat with Mitra">
      {/* Chat History Sidebar */}
      <aside 
        className={`bg-white border-r border-eldercare-primary/20 transition-all duration-300 flex-shrink-0 shadow-lg ${
          sidebarOpen ? 'w-80' : 'w-0'
        } overflow-hidden ${sidebarOpen ? 'relative' : 'absolute'} z-10 h-full`}
        role="complementary"
        aria-label="Chat history"
      >
        <div className="h-full flex flex-col">
          {/* Sidebar Header */}
          <div className="p-4 border-b border-eldercare-primary/10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-nunito font-bold text-eldercare-secondary">
                Past Conversations
              </h2>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 hover:bg-eldercare-primary/10 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-eldercare-primary lg:hidden"
                aria-label="Close chat history"
              >
                <X size={20} className="text-eldercare-text" />
              </button>
            </div>
            
            {/* New Chat Button */}
            <button
              onClick={startNewChat}
              className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-eldercare-primary hover:bg-eldercare-primary-dark text-white rounded-xl font-opensans font-semibold text-base min-h-touch transition-all duration-300 focus:outline-none focus:ring-3 focus:ring-eldercare-primary focus:ring-offset-2"
              aria-label="Start new conversation"
            >
              <Plus size={20} aria-hidden="true" />
              <span>Start New Chat</span>
            </button>
          </div>

          {/* Chat Sessions List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {chatSessions.map((session) => (
              <div
                key={session.id}
                className={`p-4 rounded-xl border-2 border-l-4 cursor-pointer transition-all duration-300 hover:shadow-md ${
                  session.id === currentSessionId
                    ? 'bg-eldercare-primary/10 border-eldercare-primary shadow-md'
                    : 'bg-eldercare-background/50 border-eldercare-primary/20 hover:border-eldercare-primary/40'
                } ${getMoodColor(session.mood)}`}
                onClick={() => switchToSession(session.id)}
                role="button"
                tabIndex={0}
                aria-label={`Switch to conversation from ${formatDate(session.lastUpdated)}`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    switchToSession(session.id);
                  }
                }}
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-opensans font-semibold text-eldercare-secondary text-sm truncate flex-1">
                    {session.title}
                  </h3>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowDeleteModal(session.id);
                    }}
                    className="p-1 hover:bg-red-100 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 ml-2"
                    aria-label={`Delete conversation from ${formatDate(session.lastUpdated)}`}
                    title="Delete conversation"
                  >
                    <Trash2 size={14} className="text-red-500" />
                  </button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Clock size={12} className="text-eldercare-text-light" aria-hidden="true" />
                    <span className="text-xs font-opensans text-eldercare-text-light">
                      {formatDate(session.lastUpdated)}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-1" title={`Mood: ${session.mood}`}>
                    {getMoodIcon(session.mood)}
                  </div>
                </div>
                
                {/* Preview of last message */}
                {session.messages.length > 1 && (
                  <div className="mt-2 pt-2 border-t border-eldercare-primary/10">
                    <p className="text-xs font-opensans text-eldercare-text-light truncate">
                      {session.messages[session.messages.length - 1].text}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* Header - Fixed and Compact */}
        <header className="flex-shrink-0 p-4 bg-eldercare-background border-b border-eldercare-primary/10">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 hover:bg-eldercare-primary/10 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-eldercare-primary"
                aria-label={sidebarOpen ? "Close chat history" : "Open chat history"}
                title={sidebarOpen ? "Hide past conversations" : "Show past conversations"}
              >
                <Clock size={20} className="text-eldercare-primary" />
              </button>
              
              <div className="p-2 bg-eldercare-primary/10 rounded-full">
                <MessageCircle size={24} className="text-eldercare-primary" aria-hidden="true" />
              </div>
              <div>
                <h1 className="text-2xl font-nunito font-bold text-eldercare-secondary">
                  {currentSession?.title || 'Mitra – Your AI Companion'}
                </h1>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" aria-hidden="true"></div>
                  <span className="text-base font-opensans text-eldercare-text">
                    Online & Ready to Help
                  </span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Chat Container - Flexible */}
        <div className="flex-1 flex flex-col min-h-0 p-6">
          <div className="max-w-4xl mx-auto w-full flex flex-col h-full">
            {/* Chat Window - Takes remaining space */}
            <div className="flex-1 bg-white rounded-xl shadow-md border border-eldercare-primary/10 flex flex-col overflow-hidden min-h-0">
              {/* Messages Area - Scrollable */}
              <div 
                ref={chatContainerRef}
                className="flex-1 overflow-y-auto p-6 space-y-4" 
                role="log" 
                aria-live="polite" 
                aria-label="Chat messages"
                tabIndex={0}
                style={{ scrollBehavior: 'smooth' }}
              >
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-lg px-6 py-4 rounded-2xl shadow-sm ${
                        message.sender === 'user'
                          ? 'bg-orange-100 text-eldercare-secondary ml-4'
                          : 'bg-eldercare-sidebar text-eldercare-secondary mr-4'
                      }`}
                      role="article"
                      aria-label={`Message from ${message.sender === 'user' ? 'you' : 'Mitra'}`}
                    >
                      <p className="text-base lg:text-lg font-opensans leading-relaxed mb-2 break-words">
                        {message.text}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-opensans text-eldercare-text-light">
                          {formatTime(message.timestamp)}
                        </span>
                        {message.sender === 'mitra' && message.hasAudio && (
                          <button
                            onClick={() => handleTextToSpeech(message.text)}
                            className="ml-2 p-1 rounded-md hover:bg-eldercare-primary/10 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-eldercare-primary focus:ring-offset-1"
                            aria-label="Listen to this message"
                            title="Listen to this message"
                          >
                            <Volume2 size={14} className="text-eldercare-primary" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* Typing Indicator */}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-eldercare-sidebar text-eldercare-secondary mr-4 px-6 py-4 rounded-2xl shadow-sm">
                      <div className="flex items-center space-x-2">
                        <Loader2 size={16} className="animate-spin text-eldercare-primary" />
                        <span className="text-base font-opensans">Mitra is typing...</span>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Voice Transcription Display */}
              {(isListening || transcription) && (
                <div className="px-6 py-3 bg-blue-50 border-t border-blue-100">
                  <div className="flex items-center space-x-2">
                    {isListening && (
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" aria-hidden="true"></div>
                    )}
                    <span className="text-sm font-opensans text-blue-700">
                      {isListening ? 'Listening...' : `Heard: "${transcription}"`}
                    </span>
                  </div>
                </div>
              )}

              {/* Input Area - Fixed at bottom */}
              <div className="flex-shrink-0 p-6 border-t border-eldercare-primary/10 bg-eldercare-background/30">
                <div className="flex items-end space-x-3">
                  {/* Text Input */}
                  <div className="flex-1">
                    <label htmlFor="message-input" className="sr-only">
                      Type your message
                    </label>
                    <input
                      ref={inputRef}
                      id="message-input"
                      type="text"
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Type your message..."
                      className="w-full px-4 py-3 text-base font-opensans border-2 border-eldercare-primary/20 rounded-xl focus:outline-none focus:ring-3 focus:ring-eldercare-primary focus:border-eldercare-primary transition-all duration-200 bg-white"
                      disabled={isListening}
                    />
                  </div>

                  {/* Voice Input Button */}
                  <button
                    onClick={handleVoiceInput}
                    className={`min-w-[44px] min-h-[44px] p-3 rounded-xl transition-all duration-300 focus:outline-none focus:ring-3 focus:ring-offset-2 ${
                      isListening
                        ? 'bg-red-500 hover:bg-red-600 focus:ring-red-500 animate-pulse'
                        : 'bg-eldercare-primary hover:bg-eldercare-primary-dark focus:ring-eldercare-primary'
                    }`}
                    aria-label={isListening ? 'Stop voice input' : 'Start voice input'}
                    title={isListening ? 'Click to stop listening' : 'Click to use voice input'}
                  >
                    {isListening ? (
                      <MicOff size={20} className="text-white" aria-hidden="true" />
                    ) : (
                      <Mic size={20} className="text-white" aria-hidden="true" />
                    )}
                  </button>

                  {/* Send Button */}
                  <button
                    onClick={() => handleSendMessage(inputText)}
                    disabled={!inputText.trim() || isListening}
                    className="min-w-[44px] min-h-[44px] p-3 bg-eldercare-primary hover:bg-eldercare-primary-dark disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-xl transition-all duration-300 focus:outline-none focus:ring-3 focus:ring-eldercare-primary focus:ring-offset-2"
                    aria-label="Send message"
                    title="Send message"
                  >
                    <Send size={20} aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Save Current Chat Modal */}
      {showSaveModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          role="dialog"
          aria-modal="true"
          aria-labelledby="save-modal-title"
        >
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Save size={24} className="text-eldercare-primary" aria-hidden="true" />
              <h3 id="save-modal-title" className="text-xl font-nunito font-bold text-eldercare-secondary">
                Start New Chat?
              </h3>
            </div>
            <p className="text-base font-opensans text-eldercare-text mb-6">
              You have an ongoing conversation. Your current chat will be automatically saved in your chat history.
            </p>
            <div className="flex space-x-4">
              <button
                onClick={() => setShowSaveModal(false)}
                className="flex-1 px-6 py-3 border-2 border-eldercare-primary text-eldercare-primary rounded-lg font-opensans font-semibold text-base min-h-touch transition-all duration-300 focus:outline-none focus:ring-3 focus:ring-eldercare-primary focus:ring-offset-2 hover:bg-eldercare-primary/5"
              >
                Cancel
              </button>
              <button
                onClick={createNewChat}
                className="flex-1 px-6 py-3 bg-eldercare-primary hover:bg-eldercare-primary-dark text-white rounded-lg font-opensans font-semibold text-base min-h-touch transition-all duration-300 focus:outline-none focus:ring-3 focus:ring-eldercare-primary focus:ring-offset-2"
              >
                Start New Chat
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
              Delete Conversation
            </h3>
            <p className="text-base font-opensans text-eldercare-text mb-6">
              Are you sure you want to delete this conversation? This action cannot be undone.
            </p>
            <div className="flex space-x-4">
              <button
                onClick={() => setShowDeleteModal(null)}
                className="flex-1 px-6 py-3 border-2 border-gray-300 text-eldercare-secondary rounded-lg font-opensans font-semibold text-base min-h-touch transition-all duration-300 focus:outline-none focus:ring-3 focus:ring-gray-300 focus:ring-offset-2 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteSession(showDeleteModal)}
                className="flex-1 px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-opensans font-semibold text-base min-h-touch transition-all duration-300 focus:outline-none focus:ring-3 focus:ring-red-500 focus:ring-offset-2"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};