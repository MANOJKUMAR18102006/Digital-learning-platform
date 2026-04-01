import React, { useState, useEffect } from 'react';
import progressService from '../../services/progressService';
import { FileText, BookOpen, BrainCircuit, TrendingUp, Clock } from 'lucide-react';
import Spinner from '../../components/common/Spinner';
import toast from 'react-hot-toast';

const DashboardPage = () => {
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const data = await progressService.getDashboardData();
                console.log("Data__getDashboard", data);
                setDashboardData(data.data);
            } catch (error) {
                toast.error('Failed to fetch dashboard data.');
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

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
            label: 'Total Documents',
            value: dashboardData.overview.totalDocuments,
            icon: FileText,
            gradient: 'from-blue-400 to-cyan-500',
            shadowColor: 'shadow-blue-500/25',
        },
        {
            label: 'Total Flashcards',
            value: dashboardData.overview.totalFlashcards,
            icon: BookOpen,
            gradient: 'from-purple-400 to-pink-500',
            shadowColor: 'shadow-purple-500/25',
        },
        {
            label: 'Total Quizzes',
            value: dashboardData.overview.totalQuizzes,
            icon: BrainCircuit,
            gradient: 'from-emerald-400 to-teal-500',
            shadowColor: 'shadow-emerald-500/25',
        },
    ];

    const recentActivities = [
        ...(dashboardData.recentActivity?.documents || []).map(doc => ({
            _id: doc._id,
            description: doc.title,
            timestamp: doc.lastAccessed,
            link: `/documents/${doc._id}`,
            type: 'document',
        })),
        ...(dashboardData.recentActivity?.quizzes || []).map(quiz => ({
            _id: quiz._id,
            description: quiz.title,
            timestamp: quiz.completedAt,
            link: `/quizzes/${quiz._id}`,
            type: 'quiz',
        })),
    ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    return (
        <div className="p-6">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-semibold text-slate-900">Dashboard</h1>
                <p className="text-sm text-slate-500 mt-1">
                    Track your learning progress and activity
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                {stats.map((stat, index) => (
                    <div
                        key={index}
                        className={`rounded-2xl p-6 bg-gradient-to-br ${stat.gradient} ${stat.shadowColor} shadow-lg text-white`}
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
                            <div key={activity._id} className="flex items-center gap-3">
                                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${activity.type === 'document' ? 'bg-blue-400' : 'bg-emerald-400'}`} />
                                <p className="text-sm text-slate-600">
                                    {activity.type === 'document' ? 'Accessed Document: ' : 'Attempted Quiz: '}
                                    <span className="font-medium text-slate-900">{activity.description}</span>
                                </p>
                            </div>
                        ))}
                        
                    </div>
                )}
            </div>
        </div>
    );
};

export default DashboardPage;
