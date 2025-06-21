import React, { useState, useRef, useEffect } from 'react';
import { 
  Mic, 
  MicOff, 
  Send, 
  Volume2, 
  MessageCircle,
  Loader2
} from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'mitra';
  timestamp: Date;
  hasAudio?: boolean;
}

export const ChatAssistant: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi, I'm Mitra, your AI companion. I'm here to support you with reminders, wellness, or just a friendly chat. How can I help you today?",
      sender: 'mitra',
      timestamp: new Date(),
      hasAudio: true
    }
  ]);
  
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [transcription, setTranscription] = useState('');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

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

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "I understand. Let me help you with that. Is there anything specific you'd like to know?",
        "That's a great question! Based on your health profile, I'd recommend checking with your doctor.",
        "I'm here to support you. Would you like me to set a reminder for that?",
        "Thank you for sharing that with me. How are you feeling today?",
        "I can help you with medication reminders, health tracking, or just have a friendly conversation."
      ];
      
      const mitraResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: responses[Math.floor(Math.random() * responses.length)],
        sender: 'mitra',
        timestamp: new Date(),
        hasAudio: true
      };

      setMessages(prev => [...prev, mitraResponse]);
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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(inputText);
    }
  };

  return (
    <main className="flex-1 ml-70 bg-eldercare-background" role="main" aria-label="Chat with Mitra">
      <div className="h-screen flex flex-col">
        {/* Header - Fixed and Compact */}
        <header className="flex-shrink-0 p-4 bg-eldercare-background border-b border-eldercare-primary/10">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-eldercare-primary/10 rounded-full">
                <MessageCircle size={24} className="text-eldercare-primary" aria-hidden="true" />
              </div>
              <div>
                <h1 className="text-2xl font-nunito font-bold text-eldercare-secondary">
                  Mitra – Your AI Companion
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
    </main>
  );
};