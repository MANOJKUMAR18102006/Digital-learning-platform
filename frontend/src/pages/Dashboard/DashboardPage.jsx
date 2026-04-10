import React, { useState, useEffect } from 'react';
import progressService from '../../services/progressService';
import aiService from '../../services/aiService';
import { FileText, BookOpen, BrainCircuit, TrendingUp, Clock, Sparkles, Activity } from 'lucide-react';
import MarkdownRenderer from '../../components/common/MarkdownRenderer';
import Spinner from '../../components/common/Spinner';
import ActivityHeatmap from '../../components/dashboard/ActivityHeatmap';
import toast from 'react-hot-toast';

const DashboardPage = () => {
    const [dashboardData, setDashboardData] = useState(null);
    const [heatmapData, setHeatmapData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [aiAnalysis, setAiAnalysis] = useState(null);
    const [analyzing, setAnalyzing] = useState(false);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [dashRes, heatmapRes] = await Promise.all([
                    progressService.getDashboardData(),
                    progressService.getHeatmapData()
                ]);
                setDashboardData(dashRes.data);
                setHeatmapData(heatmapRes.data);
            } catch (error) {
                toast.error('Failed to fetch dashboard data.');
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const handleAnalyzePerformance = async () => {
        setAnalyzing(true);
        try {
            const response = await aiService.analyzePerformance();
            setAiAnalysis(response.data);
            toast.success('Performance analyzed!');
        } catch (error) {
            toast.error('Failed to analyze performance.');
        } finally {
            setAnalyzing(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Spinner />
            </div>
        );
    }

    if (!dashboardData || !dashboardData.overview) {
        return (
            <div className="flex flex-col items-center justify-center h-screen text-slate-500">
                <TrendingUp className="h-10 w-10 mb-3" />
                <p>No dashboard data available.</p>
            </div>
        );
    }

    const stats = [
        {
            label: 'Study Level',
            value: `Lvl ${dashboardData.overview.level}`,
            icon: Sparkles,
            bg: 'bg-indigo-600',
            shadowColor: 'shadow-indigo-500/20',
        },
        {
            label: 'Total XP',
            value: dashboardData.overview.xp,
            icon: TrendingUp,
            bg: 'bg-emerald-600',
            shadowColor: 'shadow-emerald-500/20',
        },
        {
            label: 'Study Streak',
            value: `${dashboardData.overview.studyStreak} Days`,
            icon: Activity,
            bg: 'bg-rose-600',
            shadowColor: 'shadow-rose-500/20',
        },
    ];

    const recentActivities = dashboardData.recentActivity?.logs || [];

    return (
        <div className="p-6">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Welcome back!</h1>
                        <p className="text-sm text-slate-500 mt-0.5">Your learning journey continues here.</p>
                    </div>
                    <div className="text-right">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Level {dashboardData.overview.level}</span>
                        <div className="text-sm font-black text-slate-900">{1000 - (dashboardData.overview.xp % 1000)} XP to Next Level</div>
                    </div>
                </div>
                
                {/* XP Progress Bar */}
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                    <div 
                        className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-1000 ease-out"
                        style={{ width: `${(dashboardData.overview.xp % 1000) / 10}%` }}
                    />
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                {stats.map((stat, index) => (
                    <div
                        key={index}
                        className={`rounded-2xl p-6 ${stat.bg} ${stat.shadowColor} shadow-lg text-white border border-white/10`}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-sm font-medium opacity-80">
                                {stat.label}
                            </span>
                            <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center shadow">
                                <stat.icon className="h-5 w-5" strokeWidth={2} />
                            </div>
                        </div>
                        <div className="text-3xl font-bold">
                            {stat.value ?? 0}
                        </div>
                    </div>
                ))}
            </div>

            {/* AI Insights Card */}
            <div className="mb-8 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm overflow-hidden relative">
                <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                    <BrainCircuit size={120} className="text-emerald-500" />
                </div>
                
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-xl bg-emerald-50 flex items-center justify-center border border-emerald-100/50">
                            <Sparkles className="text-emerald-500 h-6 w-6" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-slate-800 tracking-tight">AI Performance Analyst</h2>
                            <p className="text-slate-500 text-sm">Get personalized insights and a productivity score</p>
                        </div>
                    </div>
                    
                    <button
                        onClick={handleAnalyzePerformance}
                        disabled={analyzing}
                        className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-emerald-500/20 active:scale-95 disabled:opacity-50 flex items-center gap-2"
                    >
                        {analyzing ? (
                            <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <Activity className="h-4 w-4" />
                        )}
                        {analyzing ? 'Analyzing Data...' : aiAnalysis ? 'Re-analyze' : 'Analyze My Progress'}
                    </button>
                </div>

                {aiAnalysis && (
                    <div className="mt-8 pt-6 border-t border-slate-100 relative z-10 transition-all duration-500 animate-in fade-in slide-in-from-top-4">
                        <div className="prose prose-slate prose-sm max-w-none prose-p:text-slate-600 prose-headings:text-slate-900 prose-strong:text-emerald-600">
                            <MarkdownRenderer content={aiAnalysis} />
                        </div>
                    </div>
                )}
            </div>

            {/* Heatmap Section */}
            <div className="mb-8">
                <ActivityHeatmap data={heatmapData} />
            </div>

            {/* Recent Activity Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-center gap-2 mb-4">
                    <Clock className="h-5 w-5 text-slate-500" strokeWidth={2} />
                    <h3 className="text-base font-semibold text-slate-900">
                        Recent Activity
                    </h3>
                </div>

                {recentActivities.length === 0 ? (
                    <p className="text-sm text-slate-400 text-center py-4">No recent activity.</p>
                ) : (
                    <div className="space-y-3">
                        {recentActivities.map((activity) => (
                            <div key={activity._id} className="flex items-center justify-between gap-3 group">
                                <div className="flex items-center gap-3">
                                    <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                                        activity.type === 'document_upload' ? 'bg-blue-400' : 
                                        activity.type === 'quiz_complete' ? 'bg-emerald-400' : 
                                        activity.type === 'flashcards_gen' ? 'bg-purple-400' :
                                        activity.type === 'notes_gen' ? 'bg-orange-400' :
                                        activity.type === 'mindmap_gen' ? 'bg-amber-400' :
                                        'bg-rose-400'
                                    }`} />
                                    <p className="text-sm text-slate-600">
                                        <span className="font-medium text-slate-900">{activity.description}</span>
                                    </p>
                                </div>
                                <span className="text-[10px] font-bold text-slate-300 uppercase tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity">
                                    {new Date(activity.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                        ))}
                        
                    </div>
                )}
            </div>
        </div>
    );
};

export default DashboardPage;
