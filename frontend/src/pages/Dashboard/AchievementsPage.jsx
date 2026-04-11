import React, { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import { Award, Shield, Zap, Target, Book, Lock } from 'lucide-react';
import Spinner from '../../components/common/Spinner';
import toast from 'react-hot-toast';

const AchievementsPage = () => {
    const [achievements, setAchievements] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAchievements = async () => {
            try {
                // First, sync with backend to catch any missed achievements
                await axiosInstance.post('/api/progress/achievements/sync');
                
                const response = await axiosInstance.get('/api/progress/achievements');
                setAchievements(response.data.data);
            } catch (error) {
                console.error('Sync error:', error);
                // Fallback: try to load what we have even if sync fails
                try {
                    const response = await axiosInstance.get('/api/progress/achievements');
                    setAchievements(response.data.data);
                } catch (innerError) {
                    toast.error('Failed to load achievements.');
                }
            } finally {
                setLoading(false);
            }
        };
        fetchAchievements();
    }, []);

    if (loading) return <div className="h-screen flex items-center justify-center"><Spinner /></div>;

    const allBadges = [
        { name: 'Bronze Scholar', icon: '🥉', color: 'bg-amber-100', text: 'text-amber-700' },
        { name: 'Silver Scholar', icon: '🥈', color: 'bg-slate-200', text: 'text-slate-700' },
        { name: 'Gold Scholar', icon: '🥇', color: 'bg-amber-200', text: 'text-amber-800' },
        { name: 'Flashcard Pro', icon: '🧠', color: 'bg-emerald-100', text: 'text-emerald-700' },
        { name: 'Consistency King', icon: '🔥', color: 'bg-rose-100', text: 'text-rose-700' },
    ];

    return (
        <div className="p-6 max-w-5xl mx-auto font-sans">
            <div className="flex flex-col items-center mb-12 text-center">
                <div className="h-16 w-16 bg-blue-50 rounded-full flex items-center justify-center mb-4 border border-blue-100 shadow-sm animate-bounce">
                    <Award className="h-8 w-8 text-blue-500" />
                </div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Your Learning Trophy Room</h1>
                <p className="text-slate-400 text-sm mt-1 uppercase tracking-widest font-bold">Showcasing your intellectual milestones</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {allBadges.map((badge) => {
                    const isUnlocked = achievements.some(a => a.name === badge.name);
                    const unlockedData = achievements.find(a => a.name === badge.name);

                    return (
                        <div 
                            key={badge.name} 
                            className={`p-6 rounded-3xl border-2 transition-all duration-300 relative overflow-hidden group ${
                                isUnlocked 
                                ? 'bg-white border-emerald-100 shadow-xl shadow-emerald-500/5' 
                                : 'bg-slate-50 border-slate-200 opacity-60'
                            }`}
                        >
                            {!isUnlocked && (
                                <div className="absolute top-4 right-4">
                                    <Lock size={16} className="text-slate-300" />
                                </div>
                            )}
                            
                            <div className={`h-20 w-20 ${isUnlocked ? badge.color : 'bg-slate-200'} rounded-2xl flex items-center justify-center text-4xl mb-5 shadow-inner transition-transform group-hover:scale-110`}>
                                {isUnlocked ? badge.icon : '?'}
                            </div>

                            <h3 className={`text-lg font-black tracking-tight ${isUnlocked ? 'text-slate-900' : 'text-slate-400'}`}>
                                {badge.name}
                            </h3>
                            <p className="text-sm text-slate-500 mt-2 leading-relaxed">
                                {isUnlocked ? unlockedData.description : 'Locked. Complete specific learning tasks to reveal.'}
                            </p>

                            {isUnlocked && (
                                <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between">
                                    <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Unlocked</span>
                                    <span className="text-[10px] text-slate-400">
                                        {new Date(unlockedData.unlockedAt).toLocaleDateString()}
                                    </span>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default AchievementsPage;
