import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, User, Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import aiService from '../../services/aiService';
import toast from 'react-hot-toast';

const ChatInterface = ({ documentId }) => {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const isVoiceGloballyEnabled = localStorage.getItem('voiceAssistantEnabled') !== 'false';
    const [isListening, setIsListening] = useState(false);
    const [isSpeakingEnabled, setIsSpeakingEnabled] = useState(isVoiceGloballyEnabled);
    const messagesEndRef = useRef(null);
    const recognitionRef = useRef(null);

    // Sync with global setting changes
    useEffect(() => {
        setIsSpeakingEnabled(isVoiceGloballyEnabled);
    }, [isVoiceGloballyEnabled]);

    // Initialize Speech Recognition
    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = false;
            recognitionRef.current.interimResults = false;
            recognitionRef.current.lang = 'en-US';

            recognitionRef.current.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                setMessage(transcript);
                setIsListening(false);
                processMessage(transcript);
            };

            recognitionRef.current.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                setIsListening(false);
                toast.error('Voice recognition failed. Please try again.');
            };

            recognitionRef.current.onend = () => {
                setIsListening(false);
            };
        }
    }, []);

    const toggleListening = () => {
        if (isListening) {
            recognitionRef.current?.stop();
        } else {
            if (!recognitionRef.current) {
                toast.error('Speech recognition is not supported in this browser.');
                return;
            }
            recognitionRef.current.start();
            setIsListening(true);
        }
    };

    const speak = (text) => {
        if (!isSpeakingEnabled) return;
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.9;
        utterance.pitch = 1.0;
        window.speechSynthesis.speak(utterance);
    };

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, loading]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        processMessage(message);
    };

    const processMessage = async (text) => {
        if (!text.trim()) return;

        const userMessage = { role: 'user', content: text };
        setMessages((prev) => [...prev, userMessage]);
        setMessage('');
        setLoading(true);

        try {
            const response = await aiService.chat(documentId, text);
            const aiContent = response.data?.answer || 'No response received.';
            
            let finalContent = aiContent;
            try {
                // Get a spoken-friendly version
                const spokenResponse = await aiService.explainSpoken(aiContent);
                finalContent = spokenResponse.data;
            } catch (err) {
                console.warn('Using raw content for TTS');
            }

            const aiMessage = { role: 'assistant', content: aiContent, spokenContent: finalContent };
            setMessages((prev) => [...prev, aiMessage]);
            
            if (isSpeakingEnabled) {
                speak(finalContent);
            }
        } catch (error) {
            toast.error('Failed to get response.');
            setMessages((prev) => [...prev, { role: 'assistant', content: 'Sorry, I could not process your request.' }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-[70vh] bg-gradient-to-b from-slate-50 to-white rounded-2xl overflow-hidden">

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 bg-white/80 backdrop-blur-sm">
                <div className="flex items-center gap-2.5">
                    <div className="flex items-center justify-center h-7 w-7 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 text-white shadow-sm">
                        <Sparkles className="h-3.5 w-3.5" strokeWidth={2.5} />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-slate-800">AI Tutor Assistant</p>
                        <p className="text-xs text-emerald-500 font-medium">
                            {isVoiceGloballyEnabled ? 'Listening to your future' : 'Ready to help'}
                        </p>
                    </div>
                </div>
                {isVoiceGloballyEnabled && (
                    <button 
                        onClick={() => setIsSpeakingEnabled(!isSpeakingEnabled)}
                        className={`p-2 rounded-lg transition-all ${isSpeakingEnabled ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-400'}`}
                        title={isSpeakingEnabled ? 'Mute AI' : 'Enable AI Voice'}
                    >
                        {isSpeakingEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
                    </button>
                )}
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5">
                {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full gap-4 text-slate-400">
                        <div className="flex items-center justify-center h-14 w-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 text-white shadow-lg shadow-emerald-500/20">
                            <Sparkles className="h-7 w-7" strokeWidth={2} />
                        </div>
                        <div className="text-center">
                            <p className="text-sm font-medium text-slate-600">Ask me anything</p>
                            <p className="text-xs text-slate-400 mt-1">I can help you understand this document</p>
                        </div>
                    </div>
                ) : (
                    messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`flex items-end gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            {msg.role === 'assistant' && (
                                <div className="flex items-center justify-center h-7 w-7 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 text-white flex-shrink-0 shadow-sm">
                                    <Sparkles className="h-3.5 w-3.5" strokeWidth={2} />
                                </div>
                            )}
                            <div
                                className={`max-w-[75%] px-4 py-3 text-sm leading-relaxed shadow-sm ${
                                    msg.role === 'user'
                                        ? 'bg-gradient-to-br from-emerald-500 to-teal-500 text-white rounded-2xl rounded-br-sm shadow-emerald-500/20'
                                        : 'bg-white text-slate-700 rounded-2xl rounded-bl-sm border border-slate-100'
                                }`}
                            >
                                {msg.content}
                            </div>
                            {msg.role === 'user' && (
                                <div className="flex items-center justify-center h-7 w-7 rounded-full bg-slate-200 text-slate-500 flex-shrink-0">
                                    <User className="h-3.5 w-3.5" strokeWidth={2} />
                                </div>
                            )}
                        </div>
                    ))
                )}

                {loading && (
                    <div className="flex justify-start items-end gap-2.5">
                        <div className="flex items-center justify-center h-7 w-7 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 text-white flex-shrink-0 shadow-sm">
                            <Sparkles className="h-3.5 w-3.5" strokeWidth={2} />
                        </div>
                        <div className="bg-white border border-slate-100 px-4 py-3 rounded-2xl rounded-bl-sm shadow-sm">
                            <div className="flex gap-1.5 items-center">
                                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="px-5 py-4 border-t border-slate-100 bg-white shadow-[0_-4px_12px_rgba(0,0,0,0.02)]">
                <form onSubmit={handleSendMessage} className="flex items-center gap-3">
                    <div className="relative flex-1 group">
                        <input
                            type="text"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder={isListening ? "Listening..." : "Ask your AI tutor..."}
                            className={`w-full h-11 pl-4 pr-12 border-2 ${isListening ? 'border-emerald-500 bg-emerald-50' : 'border-slate-100 bg-slate-50 group-hover:border-slate-200'} rounded-xl text-sm font-medium focus:outline-none focus:border-emerald-500 focus:bg-white transition-all disabled:opacity-50`}
                            disabled={loading}
                        />
                        {isVoiceGloballyEnabled && (
                            <button
                                type="button"
                                onClick={toggleListening}
                                disabled={loading}
                                className={`absolute right-2 top-1/2 -translate-y-1/2 flex items-center justify-center h-8 w-8 rounded-lg transition-all ${
                                    isListening ? 'bg-rose-500 text-white animate-pulse' : 'text-slate-400 hover:text-emerald-500 hover:bg-emerald-50'
                                }`}
                            >
                                {isListening ? <MicOff size={18} /> : <Mic size={18} />}
                            </button>
                        )}
                    </div>
                    <button
                        type="submit"
                        disabled={loading || !message.trim()}
                        className="flex items-center justify-center h-11 w-11 bg-slate-900 hover:bg-emerald-600 text-white rounded-xl transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0 shadow-lg shadow-slate-900/10 active:scale-95"
                    >
                        <Send className="h-4 w-4" strokeWidth={2.5} />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChatInterface;
