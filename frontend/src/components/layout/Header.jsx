import React from "react";
import { useAuth } from "../../context/AuthContext";
import { Bell, User, Menu } from "lucide-react";

const Header = ({ toggleSidebar }) => {
    const { user } = useAuth();

    return (
        <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-slate-200 shadow-sm">
            <div className="flex items-center">
                {/* Mobile Menu Button */}
                <button
                    onClick={toggleSidebar}
                    className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors lg:hidden"
                    aria-label="Toggle sidebar"
                >
                    <Menu size={24} />
                </button>
            </div>

            <div className="flex-1" />

            <div className="flex items-center gap-4">
                <button className="relative p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors">
                    <Bell size={20} strokeWidth={2} className="text-slate-500" />
                    <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-emerald-500 rounded-full"></span>
                </button>

                {/* User Profile */}
                <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center h-9 w-9 rounded-full bg-emerald-100 text-emerald-600">
                        <User size={18} strokeWidth={2.5} />
                    </div>
                    <div className="hidden sm:block">
                        <p className="text-sm font-medium text-slate-900">
                            {user?.username || 'User'}
                        </p>
                        <p className="text-xs text-slate-500">
                            {user?.email || 'user@example.com'}
                        </p>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
