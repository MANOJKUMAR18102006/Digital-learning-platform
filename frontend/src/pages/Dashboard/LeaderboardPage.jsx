import React, { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import API_PATHS from '../../utils/apiPaths';
import { Trophy, Medal, Crown, Star, User } from 'lucide-react';
import Spinner from '../../components/common/Spinner';
import toast from 'react-hot-toast';

const LeaderboardPage = () => {
    const [players, setPlayers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const response = await axiosInstance.get('/api/progress/leaderboard');
                setPlayers(response.data.data);
            } catch (error) {
                toast.error('Failed to load leaderboard.');
            } finally {
                setLoading(false);
            }
        };
        fetchLeaderboard();
    }, []);

    if (loading) return <div className="h-screen flex items-center justify-center"><Spinner /></div>;

    const getRankIcon = (index) => {
        switch(index) {
            case 0: return <Crown className="text-amber-400 h-6 w-6" fill="currentColor" />;
            case 1: return <Medal className="text-slate-400 h-6 w-6" />;
            case 2: return <Medal className="text-amber-700 h-6 w-6" />;
            default: return <span className="font-bold text-slate-400">#{index + 1}</span>;
        }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto font-sans">
            <div className="flex flex-col items-center mb-10 text-center">
                <div className="h-16 w-16 bg-amber-50 rounded-full flex items-center justify-center mb-4 border border-amber-100 shadow-sm">
                    <Trophy className="h-8 w-8 text-amber-500" />
                </div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Global Hall of Fame</h1>
                <p className="text-slate-400 text-sm mt-1 uppercase tracking-widest font-bold">Top learners across the world</p>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
                <div className="grid grid-cols-12 px-6 py-4 bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-400 uppercase tracking-widest">
                    <div className="col-span-1">Rank</div>
                    <div className="col-span-6">Learner</div>
                    <div className="col-span-2 text-center">Level</div>
                    <div className="col-span-3 text-right">Progress (XP)</div>
                </div>

                <div className="divide-y divide-slate-100">
                    {players.map((player, index) => (
                        <div 
                            key={player._id} 
                            className={`grid grid-cols-12 px-6 py-5 items-center transition-all ${index < 3 ? 'bg-gradient-to-r from-amber-50/20 to-transparent' : 'hover:bg-slate-50'}`}
                        >
                            <div className="col-span-1 flex items-center">
                                {getRankIcon(index)}
                            </div>
                            <div className="col-span-6 flex items-center gap-4">
                                <div className="h-10 w-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 overflow-hidden shadow-sm">
                                    {player.profileImage ? (
                                        <img src={player.profileImage} alt={player.username} className="h-full w-full object-cover" />
                                    ) : (
                                        <User size={20} />
                                    )}
                                </div>
                                <div>
                                    <div className="font-bold text-slate-900">{player.username}</div>
                                    <div className="text-[10px] text-emerald-500 font-black uppercase tracking-tighter flex items-center gap-1">
                                        <Star size={10} fill="currentColor" />
                                        {player.achievements?.length || 0} Badges Earned
                                    </div>
                                </div>
                            </div>
                            <div className="col-span-2 text-center font-black text-slate-800">
                                <span className="bg-slate-100 px-2.5 py-1 rounded-lg">Lvl {player.level}</span>
                            </div>
                            <div className="col-span-3 text-right">
                                <div className="text-lg font-black text-emerald-600 tracking-tighter">
                                    {player.xp.toLocaleString()}
                                </div>
                                <div className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">Experience accumulated</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default LeaderboardPage;
