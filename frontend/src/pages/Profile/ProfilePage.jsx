import React, { useState, useEffect } from "react";
import Spinner from "../../components/common/Spinner";
import authService from "../../services/authService";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import { User, Mail, Lock, Shield, Camera } from "lucide-react";

const ProfilePage = () => {
    const { user, updateUser } = useAuth();
    const [loading, setLoading] = useState(true);
    const [passwordLoading, setPasswordLoading] = useState(false);
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const { data } = await authService.getProfile();
                setUsername(data.username);
                setEmail(data.email);
            } catch (error) {
                toast.error("Failed to fetch profile data.");
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleChangePassword = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmNewPassword) {
            toast.error("New passwords do not match.");
            return;
        }
        if (newPassword.length < 6) {
            toast.error("Password must be at least 6 characters.");
            return;
        }
        setPasswordLoading(true);
        try {
            await authService.changePassword({ currentPassword, newPassword });
            toast.success("Password changed successfully!");
            setCurrentPassword("");
            setNewPassword("");
            setConfirmNewPassword("");
        } catch (error) {
            toast.error(error.error || "Failed to change password.");
        } finally {
            setPasswordLoading(false);
        }
    };

    if (loading) return <Spinner />;

    const avatarLetter = username?.charAt(0).toUpperCase() || 'U';

    return (
        <div className="p-6 max-w-2xl mx-auto">
            {/* Profile Header Card */}
            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 mb-6 text-white shadow-lg shadow-emerald-500/20">
                <div className="flex items-center gap-5">
                    <div className="relative">
                        <div className="flex items-center justify-center h-20 w-20 rounded-2xl bg-white/20 backdrop-blur-sm text-white text-3xl font-bold border-2 border-white/30">
                            {avatarLetter}
                        </div>
                        <div className="absolute -bottom-1 -right-1 flex items-center justify-center h-6 w-6 rounded-full bg-white text-emerald-500 shadow-sm">
                            <Camera className="h-3 w-3" strokeWidth={2.5} />
                        </div>
                    </div>
                    <div>
                        <h2 className="text-xl font-bold">{username}</h2>
                        <p className="text-emerald-100 text-sm mt-0.5">{email}</p>
                        <span className="inline-flex items-center gap-1 mt-2 px-2.5 py-0.5 bg-white/20 rounded-full text-xs font-medium">
                            <Shield className="h-3 w-3" strokeWidth={2} />
                            Active Account
                        </span>
                    </div>
                </div>
            </div>

            {/* Account Info Card */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-6 shadow-sm">
                <h3 className="text-base font-semibold text-slate-900 mb-4">Account Information</h3>
                <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                        <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-emerald-50 text-emerald-500 flex-shrink-0">
                            <User className="h-5 w-5" strokeWidth={2} />
                        </div>
                        <div>
                            <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">Username</p>
                            <p className="text-sm font-semibold text-slate-800 mt-0.5">{username}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                        <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-blue-50 text-blue-500 flex-shrink-0">
                            <Mail className="h-5 w-5" strokeWidth={2} />
                        </div>
                        <div>
                            <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">Email Address</p>
                            <p className="text-sm font-semibold text-slate-800 mt-0.5">{email}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Change Password Card */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-5">
                    <div className="flex items-center justify-center h-9 w-9 rounded-xl bg-amber-50 text-amber-500">
                        <Lock className="h-4 w-4" strokeWidth={2} />
                    </div>
                    <div>
                        <h3 className="text-base font-semibold text-slate-900">Change Password</h3>
                        <p className="text-xs text-slate-400">Update your password to keep your account secure</p>
                    </div>
                </div>

                <form onSubmit={handleChangePassword} className="space-y-4">
                    {[
                        { label: 'Current Password', value: currentPassword, setter: setCurrentPassword },
                        { label: 'New Password', value: newPassword, setter: setNewPassword },
                        { label: 'Confirm New Password', value: confirmNewPassword, setter: setConfirmNewPassword },
                    ].map(({ label, value, setter }) => (
                        <div key={label} className="space-y-1.5">
                            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide">
                                {label}
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                                    <Lock className="h-4 w-4" strokeWidth={2} />
                                </div>
                                <input
                                    type="password"
                                    value={value}
                                    onChange={(e) => setter(e.target.value)}
                                    required
                                    className="w-full h-11 pl-11 pr-4 border-2 border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 transition-colors bg-white"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>
                    ))}

                    <button
                        type="submit"
                        disabled={passwordLoading}
                        className="w-full h-11 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white text-sm font-medium rounded-xl transition-all shadow-sm shadow-emerald-500/25 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
                    >
                        {passwordLoading ? (
                            <span className="flex items-center justify-center gap-2">
                                <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Changing...
                            </span>
                        ) : 'Change Password'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ProfilePage;
