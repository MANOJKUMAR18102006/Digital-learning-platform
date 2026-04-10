import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LayoutDashboard, FileText, User, LogOut, BrainCircuit, BookOpen, X, Sparkles, Trophy, Award } from 'lucide-react';

const Sidebar = ({ isSidebarOpen, toggleSidebar }) => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navLinks = [
        { to: '/dashboard', icon: LayoutDashboard, text: 'Dashboard' },
        { to: '/documents', icon: FileText, text: 'Documents' },
        { to: '/flashcards', icon: BookOpen, text: 'Flashcards' },
        { to: '/study-plan', icon: Sparkles, text: 'Study Plan' },
        { to: '/leaderboard', icon: Trophy, text: 'Leaderboard' },
        { to: '/achievements', icon: Award, text: 'Achievements' },
        { to: '/profile', icon: User, text: 'Profile' },
    ];

    return (
        <>
            {/* Overlay */}
            <div
                className={`fixed inset-0 bg-black/30 z-40 md:hidden transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={toggleSidebar}
                aria-hidden="true"
            />

            <aside
                className={`fixed top-0 left-0 h-full w-64 bg-white/90 backdrop-blur-lg border-r border-slate-200 z-50 flex flex-col transition-transform duration-300 md:relative md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
            >
                {/* Logo and Close button */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
                    <div className="flex items-center gap-2">
                        <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-emerald-500 text-white">
                            <BrainCircuit size={20} strokeWidth={2.5} />
                        </div>
                        <h1 className="text-sm font-semibold text-slate-900">AI Learning Assistant</h1>
                    </div>
                    <button onClick={toggleSidebar} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors md:hidden">
                        <X size={24} />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                    {navLinks.map((link) => (
                        <NavLink
                            key={link.to}
                            to={link.to}
                            onClick={toggleSidebar}
                            className={({ isActive }) =>
                                `group flex items-center gap-3 px-4 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 ${isActive
                                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md shadow-emerald-500/25'
                                    : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                                }`
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    <link.icon
                                        size={18}
                                        strokeWidth={2.5}
                                        className={`transition-transform duration-200 ${isActive ? '' : 'group-hover:scale-110'}`}
                                    />
                                    {link.text}
                                </>
                            )}
                        </NavLink>
                    ))}
                </nav>

                {/* Logout Section */}
                <div className="px-3 py-4 border-t border-slate-200">
                    <button
                        onClick={handleLogout}
                        className="group flex items-center gap-3 w-full px-4 py-2.5 text-sm font-semibold rounded-xl text-slate-700 hover:bg-red-50 hover:text-red-600 transition-all duration-200"
                    >
                        <LogOut
                            size={18}
                            strokeWidth={2.5}
                            className="transition-transform duration-200 group-hover:scale-110"
                        />
                        Logout
                    </button>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
