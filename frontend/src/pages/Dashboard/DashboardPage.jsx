import React, { useState, useEffect } from 'react';
import progressService from '../../services/progressService';
import { FileText, BookOpen, BrainCircuit, TrendingUp } from 'lucide-react';
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
                <div className="h-8 w-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
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

    return (
        <div className="p-6">
            <h1 className="text-2xl font-semibold text-slate-900 mb-6">Dashboard</h1>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {stats.map((stat) => (
                    <div key={stat.label} className={`rounded-2xl p-6 bg-gradient-to-br ${stat.gradient} ${stat.shadowColor} shadow-lg text-white`}>
                        <stat.icon className="h-8 w-8 mb-3 opacity-90" strokeWidth={2} />
                        <p className="text-3xl font-bold">{stat.value ?? 0}</p>
                        <p className="text-sm opacity-80 mt-1">{stat.label}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DashboardPage;
