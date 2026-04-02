import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import aiService from '../../../services/aiService';
import useAuth from '../context/AuthContext';
import Spinner from '../common/Spinner';
import MarkdownRenderer from '../common/MarkdownRenderer';

const ChatInterface = () => {
    const { id: documentId } = useParams();
    const user = useAuth();
    const [history, setHistory] = useState([]);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    };


    useEffect(() => {
        const fetchChatHistory = async () => {
            try {
                setInitialLoading(true);
                const response = await aiService.getChatHistory(documentId);
                setHistory(response.data);
            } catch (error) {
                console.error('Failed to fetch chat history:', error);
            } finally {
                setInitialLoading(false);
            }
        };

        fetchChatHistory();
    }, [documentId]);

    useEffect(() => {
        scrollToBottom();
    }, [history]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!message.trim()) return;

        const userMessage = { role: 'user', content: message, timestamp: new Date() };
        setHistory(prev => [...prev, userMessage]);
        setMessage('');
        setLoading(true);

        try {
            const response = await aiService.chat(documentId, userMessage.content);
            const assistantMessage = {
                role: 'assistant',
                content: response.data.answer,
                timestamp: new Date(),
                relevantChunks: response.data.relevantChunks
            };
            setHistory(prev => [...prev, assistantMessage]);
        } catch (error) {
            console.error('Chat error:', error);
            const errorMessage = {
                role: 'assistant',
                content: 'Sorry, I encountered an error. Please try again.',
                timestamp: new Date()
            };
            setHistory(prev => [...prev, errorMessage]);
        } finally {
            setLoading(false);
        }
    };

    const renderMessage = (msg, index) => {
        const isUser = msg.role === 'user';
        return (
            <div key={index} className={`flex items-start gap-3 my-4 ${isUser ? 'justify-end' : ''}`}>
                {!isUser && (
                    <div className="">
                        <Sparkles className="" strokeWidth={2} />
                    </div>
                )}
                <div className={`max-w-lg p-4 rounded-2xl shadow-sm ${isUser ? 'bg-linear-to-br from-emerald-500 to-teal-500 text-white rounded-br-md' : 'bg-white border border-slate-200/60 text-slate-800 rounded-bl-md'}`}>
                    {isUser ? (
                        <p className="">{msg.content}</p>
                    ) : (
                        <div className="">
                            <MarkdownRenderer content={msg.content} />
                        </div>
                    )}
                </div>
            </div>
        )
           {isUser && (
                <div className="">
                    {user7.username?.charAt(0).toUpperCase() || 'U'}
                </div>
            )
        }
    };

    if (initialLoading) {
        return (
            <div className="flex flex-col h-[70vh] bg-white/80 backdrop-blur-xl border border-slate-200">
                <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-emerald-100 to-teal-200">
                    <MessageSquare className="w-7 h-7 text-emerald-600" strokeWidth={2} />
                </div>
                <Spinner />
                <p className="text-sm text-slate-500 mt-3 font-medium">Loading chat history...</p>
            </div>
        );
    }
    return (
        <div className="">
            {/* Messages Area */}
            <div className="">
                {history.length === 0 ? (
                    <div className="">
                        <MessageSquare className="" strokeWidth={2} />
                        <h3 className="">Start a conversation</h3>
                        <p className="">Ask me anything about the document!</p>
                    </div>
                ) : (
                    history.map(renderMessage)
                )}
            </div>
            <div ref={messagesEndRef} />
            {loading && (
                <div className="">
                    <div className="">
                        <Sparkles className="" strokeWidth={2} />
                    </div>
                    <div className="">
                        <div className="">
                            <span className="" style={{ animationDelay: '0ms' }}></span>
                            <span className="" style={{ animationDelay: '150ms' }}></span>
                            <span className="" style={{ animationDelay: '300ms' }}></span>
                        </div>
                    </div>
                </div>
            )}

            /* Input Area */
            <div className="">
                <form onSubmit={handleSendMessage} className="">
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Ask a follow-up question..."
                        className=""
                        disabled={loading}
                    />
                    <button
                        type="submit"
                        disabled={loading || !message.trim()}
                        className=""
                    >
                    </button>
                </form>
            </div>

        </div>
    );
};

export default ChatInterface;