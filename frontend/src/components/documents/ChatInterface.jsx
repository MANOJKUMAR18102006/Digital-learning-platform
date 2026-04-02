import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, User } from 'lucide-react';
import aiService from '../../services/aiService';
import toast from 'react-hot-toast';

const ChatInterface = ({ documentId }) => {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, loading]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!message.trim()) return;

        const userMessage = { role: 'user', content: message };
        setMessages((prev) => [...prev, userMessage]);
        setMessage('');
        setLoading(true);

        try {
            const response = await aiService.chat(documentId, message);
            const aiMessage = { role: 'assistant', content: response.data?.answer || 'No response received.' };
            setMessages((prev) => [...prev, aiMessage]);
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
            <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-slate-100 bg-white/80 backdrop-blur-sm">
                <div className="flex items-center justify-center h-7 w-7 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 text-white shadow-sm">
                    <Sparkles className="h-3.5 w-3.5" strokeWidth={2.5} />
                </div>
                <div>
                    <p className="text-sm font-semibold text-slate-800">AI Assistant</p>
                    <p className="text-xs text-emerald-500 font-medium">Online</p>
                </div>
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
            <div className="px-5 py-4 border-t border-slate-100 bg-white/80 backdrop-blur-sm">
                <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Ask a follow-up question..."
                        className="flex-1 h-11 px-4 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/10 transition-all disabled:opacity-50 bg-slate-50 placeholder:text-slate-400"
                        disabled={loading}
                    />
                    <button
                        type="submit"
                        disabled={loading || !message.trim()}
                        className="flex items-center justify-center h-11 w-11 bg-gradient-to-br from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0 shadow-md shadow-emerald-500/25"
                    >
                        <Send className="h-4 w-4" strokeWidth={2} />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChatInterface;
