import React, { useState, useEffect, useRef } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { Bell, Flame, Award, X, Circle, CheckCircle2 } from 'lucide-react';
import moment from 'moment';

const NotificationDropdown = () => {
    const [notifications, setNotifications] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const fetchNotifications = async () => {
        try {
            const response = await axiosInstance.get(API_PATHS.NOTIFICATIONS.GET_ALL);
            setNotifications(response.data.data);
        } catch (error) {
            console.error('Failed to fetch notifications');
        }
    };

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 60000); // Check every minute
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleMarkAsRead = async () => {
        try {
            await axiosInstance.put(API_PATHS.NOTIFICATIONS.MARK_READ);
            setNotifications(notifications.map(n => ({ ...n, isRead: true })));
        } catch (error) {
            console.error('Failed to mark as read');
        }
    };

    const unreadCount = notifications.filter(n => !n.isRead).length;

    const getIcon = (type) => {
        switch(type) {
            case 'streak_warning': return <Flame className="text-orange-500" size={16} fill="currentColor" />;
            case 'achievement_unlocked': return <Award className="text-amber-500" size={16} />;
            default: return <Bell className="text-blue-500" size={16} />;
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button 
                onClick={() => {
                    setIsOpen(!isOpen);
                    if (!isOpen && unreadCount > 0) handleMarkAsRead();
                }}
                className="relative p-2 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-all border border-transparent hover:border-slate-200"
            >
                <Bell size={20} strokeWidth={2} />
                {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 h-4 w-4 bg-rose-500 text-white text-[10px] font-black flex items-center justify-center rounded-full border-2 border-white">
                        {unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-3 w-80 bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden z-[100] animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-5 py-4 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                        <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Notifications</h3>
                        {unreadCount > 0 && (
                            <span className="text-[10px] bg-rose-100 text-rose-600 px-2 py-0.5 rounded-full font-bold">
                                {unreadCount} New
                            </span>
                        )}
                    </div>

                    <div className="max-h-[400px] overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="p-10 text-center">
                                <Bell className="mx-auto text-slate-200 mb-3" size={32} />
                                <p className="text-xs text-slate-400 font-bold uppercase">All quiet here</p>
                            </div>
                        ) : (
                            notifications.map((n) => (
                                <div 
                                    key={n._id} 
                                    className={`px-5 py-4 border-b border-slate-50 hover:bg-slate-50 transition-colors flex gap-4 ${!n.isRead ? 'bg-blue-50/30' : ''}`}
                                >
                                    <div className="h-8 w-8 rounded-lg bg-white border border-slate-100 shadow-sm flex items-center justify-center flex-shrink-0">
                                        {getIcon(n.type)}
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-xs font-black text-slate-900 mb-0.5">{n.title}</h4>
                                        <p className="text-[11px] text-slate-500 leading-relaxed mb-2">{n.message}</p>
                                        <span className="text-[9px] font-bold text-slate-300 uppercase">
                                            {moment(n.createdAt).fromNow()}
                                        </span>
                                    </div>
                                    {!n.isRead && (
                                        <div className="flex-shrink-0">
                                            <Circle size={8} className="text-blue-500" fill="currentColor" />
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                    
                    <div className="p-3 bg-slate-50 text-center">
                        <button className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-colors">
                            View All History
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationDropdown;
