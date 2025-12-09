import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Phone, 
  PhoneOff,
  Send,
  Paperclip,
  Image,
  Calendar,
  Clock,
  User,
  Stethoscope,
  PawPrint,
  Star,
  MapPin,
  Languages
} from 'lucide-react';
import { format } from 'date-fns';

const LiveConsultation = () => {
  const [activeMode, setActiveMode] = useState('chat'); // 'chat' or 'video'
  const [messages, setMessages] = useState([
    {
      id: '1',
      type: 'expert',
      content: 'Hello! I\'m Dr. Sarah Ahmed, a licensed veterinarian. How can I help you with your pet today?',
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      expert: {
        name: 'Dr. Sarah Ahmed',
        specialization: 'Small Animal Veterinarian',
        rating: 4.9,
        avatar: null
      }
    },
    {
      id: '2',
      type: 'user',
      content: 'Hi! My dog Max has been coughing for the past 2 days. Should I be worried?',
      timestamp: new Date(Date.now() - 3 * 60 * 1000)
    },
    {
      id: '3',
      type: 'expert',
      content: 'I understand your concern. Can you tell me more about the cough? Is it dry or does he bring up any phlegm? Also, has he been eating and drinking normally?',
      timestamp: new Date(Date.now() - 2 * 60 * 1000),
      expert: {
        name: 'Dr. Sarah Ahmed',
        specialization: 'Small Animal Veterinarian',
        rating: 4.9,
        avatar: null
      }
    }
  ]);

  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isVideoCall, setIsVideoCall] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [experts] = useState([
    {
      id: '1',
      name: 'Dr. Sarah Ahmed',
      specialization: 'Small Animal Veterinarian',
      rating: 4.9,
      experience: '8 years',
      languages: ['English', 'Bengali'],
      avatar: null,
      isOnline: true,
      responseTime: '< 2 min'
    },
    {
      id: '2',
      name: 'Dr. Rahman Khan',
      specialization: 'Pet Behaviorist',
      rating: 4.8,
      experience: '12 years',
      languages: ['English', 'Bengali', 'Arabic'],
      avatar: null,
      isOnline: true,
      responseTime: '< 5 min'
    },
    {
      id: '3',
      name: 'Dr. Fatima Begum',
      specialization: 'Exotic Pet Specialist',
      rating: 4.7,
      experience: '6 years',
      languages: ['English', 'Bengali'],
      avatar: null,
      isOnline: false,
      responseTime: '< 15 min'
    }
  ]);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    let interval;
    if (isVideoCall) {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isVideoCall]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const message = {
      id: Date.now().toString(),
      type: 'user',
      content: newMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');
    setIsTyping(true);

    // Simulate expert response
    setTimeout(() => {
      const expertResponse = {
        id: (Date.now() + 1).toString(),
        type: 'expert',
        content: 'Thank you for your message. Let me review your pet\'s information and get back to you with some advice.',
        timestamp: new Date(),
        expert: {
          name: 'Dr. Sarah Ahmed',
          specialization: 'Small Animal Veterinarian',
          rating: 4.9,
          avatar: null
        }
      };
      setMessages(prev => [...prev, expertResponse]);
      setIsTyping(false);
    }, 2000);
  };

  const startVideoCall = () => {
    setIsVideoCall(true);
    setCallDuration(0);
  };

  const endVideoCall = () => {
    setIsVideoCall(false);
    setCallDuration(0);
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-8rem)]">
          {/* Expert List Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg h-full">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <Stethoscope className="h-5 w-5 text-blue-500" />
                  Available Experts
                </h2>
              </div>
              
              <div className="p-4 space-y-3 overflow-y-auto h-full">
                {experts.map((expert) => (
                  <motion.div
                    key={expert.id}
                    whileHover={{ scale: 1.02 }}
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                      expert.isOnline 
                        ? 'border-green-200 bg-green-50 dark:bg-green-900/20' 
                        : 'border-gray-200 bg-gray-50 dark:bg-gray-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                        <User className="h-5 w-5 text-blue-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                            {expert.name}
                          </h4>
                          {expert.isOnline && (
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {expert.specialization}
                        </p>
                        <div className="flex items-center gap-1 mt-1">
                          <Star className="h-3 w-3 text-yellow-500" />
                          <span className="text-xs text-gray-500">{expert.rating}</span>
                          <span className="text-xs text-gray-400">•</span>
                          <span className="text-xs text-gray-500">{expert.responseTime}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-2">
                      <div className="flex items-center gap-1">
                        <Languages className="h-3 w-3 text-gray-400" />
                        <span className="text-xs text-gray-500">
                          {expert.languages.join(', ')}
                        </span>
                      </div>
                    </div>

                    <div className="mt-2 flex gap-2">
                      <button 
                        className="flex-1 bg-blue-500 hover:bg-blue-600 text-white text-xs py-1 px-2 rounded"
                        onClick={() => setActiveMode('chat')}
                      >
                        Chat
                      </button>
                      <button 
                        className="flex-1 bg-green-500 hover:bg-green-600 text-white text-xs py-1 px-2 rounded"
                        onClick={() => {
                          setActiveMode('video');
                          startVideoCall();
                        }}
                        disabled={!expert.isOnline}
                      >
                        Video
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Consultation Area */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg h-full flex flex-col">
              {/* Header */}
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                      <Stethoscope className="h-5 w-5 text-blue-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        Live Veterinary Consultation
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Dr. Sarah Ahmed • Small Animal Veterinarian
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-green-600">Online</span>
                    </div>
                    
                    {isVideoCall && (
                      <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-lg">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {formatDuration(callDuration)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Mode Toggle */}
                <div className="flex items-center gap-2 mt-4">
                  <button
                    onClick={() => setActiveMode('chat')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeMode === 'chat'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <MessageSquare className="h-4 w-4" />
                    Chat
                  </button>
                  <button
                    onClick={() => setActiveMode('video')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeMode === 'video'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <Video className="h-4 w-4" />
                    Video Call
                  </button>
                </div>
              </div>

              {/* Chat Messages */}
              {activeMode === 'chat' && (
                <div className="flex-1 flex flex-col">
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-xs lg:max-w-md ${
                          message.type === 'user'
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                        } rounded-lg p-3`}>
                          {message.type === 'expert' && message.expert && (
                            <div className="flex items-center gap-2 mb-2 pb-2 border-b border-gray-200 dark:border-gray-600">
                              <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                                <User className="h-3 w-3 text-blue-500" />
                              </div>
                              <div>
                                <div className="text-xs font-medium">{message.expert.name}</div>
                                <div500">{message.expert.specialization}</div>
                              </div>
                            </div>
                          )}
                          
                          <p className="text-sm">{message.content}</p>
                          <p className={`text-xs mt-1 ${
                            message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                          }`}>
                            {format(message.timestamp, 'HH:mm')}
                          </p>
                        </div>
                      </div>
                    ))}
                    
                    {isTyping && (
                      <div className="flex justify-start">
                        <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3 max-w-xs">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Message Input */}
                  <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                    <form onSubmit={handleSendMessage} className="flex gap-2">
                      <div className="flex-1 relative">
                        <input
                          type="text"
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          placeholder="Type your message..."
                          className="w-full px-4 py-2 pr-12 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        />
                        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-1">
                          <button type="button" className="p-1 text-gray-400 hover:text-gray-600">
                            <Paperclip className="h-4 w-4" />
                          </button>
                          <button type="button" className="p-1 text-gray-400 hover:text-gray-600">
                            <Image className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      <button
                        type="submit"
                        disabled={!newMessage.trim()}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Send className="h-4 w-4" />
                      </button>
                    </form>
                  </div>
                </div>
              )}

              {/* Video Call Interface */}
              {activeMode === 'video' && (
                <div className="flex-1 flex flex-col">
                  <div className="flex-1 bg-gray-900 rounded-lg m-4 flex items-center justify-center relative">
                    {!isVideoCall ? (
                      <div className="text-center text-white">
                        <Video className="h-16 w-16 mx-auto mb-4 opacity-50" />
                        <h3 className="text-xl font-semibold mb-2">Start Video Consultation</h3>
                        <p className="text-gray-300 mb-6">
                          Connect with Dr. Sarah Ahmed for a face-to-face consultation
                        </p>
                        <button
                          onClick={startVideoCall}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium"
                        >
                          Start Video Call
                        </button>
                      </div>
                    ) : (
                      <div className="w-full h-full relative">
                        {/* Main video feed */}
                        <div className="w-full h-full bg-gray-800 rounded-lg flex items-center justify-center">
                          <div className="text-center text-white">
                            <User className="h-16 w-16 mx-auto mb-4 opacity-50" />
                            <p className="text-lg">Dr. Sarah Ahmed</p>
                            <p className="text-sm text-gray-300">Video call in progress</p>
                          </div>
                        </div>

                        {/* Picture-in-picture self view */}
                        <div className="absolute bottom-4 right-4 w-32 h-24 bg-gray-700 rounded-lg border-2 border-white flex items-center justify-center">
                          <User className="h-8 w-8 text-gray-400" />
                        </div>

                        {/* Video controls */}
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-4 bg-black/50 px-6 py-3 rounded-full">
                          <button
                            onClick={() => setIsMuted(!isMuted)}
                            className={`p-3 rounded-full transition-colors ${
                              isMuted ? 'bg-red-500' : 'bg-gray-600 hover:bg-gray-500'
                            }`}
                          >
                            {isMuted ? <MicOff className="h-5 w-5 text-white" /> : <Mic className="h-5 w-5 text-white" />}
                          </button>

                          <button
                            onClick={() => setIsCameraOff(!isCameraOff)}
                            className={`p-3 rounded-full transition-colors ${
                              isCameraOff ? 'bg-red-500' : 'bg-gray-600 hover:bg-gray-500'
                            }`}
                          >
                            {isCameraOff ? <VideoOff className="h-5 w-5 text-white" /> : <Video className="h-5 w-5 text-white" />}
                          </button>

                          <button
                            onClick={endVideoCall}
                            className="p-3 rounded-full bg-red-500 hover:bg-red-600 transition-colors"
                          >
                            <PhoneOff className="h-5 w-5 text-white" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveConsultation;