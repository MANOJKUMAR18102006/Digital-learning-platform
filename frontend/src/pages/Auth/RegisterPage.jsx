import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import authService from '../../services/authService';
import { BrainCircuit, User, Mail, Lock, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

const RegisterPage = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const { token, data } = await authService.register(username, email, password);
            login(data.user, token);
            toast.success('Account created successfully!');
            navigate('/dashboard');
        } catch (err) {
            const message = err.error || err.message || 'Failed to register. Please try again.';
            setError(message);
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
            <div className="relative w-full max-w-md px-6">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-500 mb-4">
                        <BrainCircuit className="h-7 w-7 text-white" strokeWidth={2} />
                    </div>
                    <h1 className="text-2xl font-medium text-slate-900 tracking-tight mb-2">
                        Create an account
                    </h1>
                    <p className="text-slate-500 text-sm">Start your learning journey today</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-2">
                        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide">Username</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                                <User className="h-5 w-5" strokeWidth={2} />
                            </div>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full h-12 pl-12 pr-4 border-2 border-slate-200 rounded-xl bg-white focus:outline-none focus:border-emerald-500"
                                placeholder="yourname"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide">Email</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                                <Mail className="h-5 w-5" strokeWidth={2} />
                            </div>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full h-12 pl-12 pr-4 border-2 border-slate-200 rounded-xl bg-white focus:outline-none focus:border-emerald-500"
                                placeholder="you@example.com"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide">Password</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                                <Lock className="h-5 w-5" strokeWidth={2} />
                            </div>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full h-12 pl-12 pr-4 border-2 border-slate-200 rounded-xl bg-white focus:outline-none focus:border-emerald-500"
                                placeholder="********"
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="rounded-lg bg-red-50 border border-red-200 p-3">
                            <p className="text-xs text-red-600 font-medium text-center">{error}</p>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="group relative w-full h-12 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl font-medium hover:from-emerald-600 hover:to-emerald-700 transition-all"
                    >
                        <span className="flex items-center justify-center gap-2">
                            {loading ? (
                                <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>Sign up <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" /></>
                            )}
                        </span>
                    </button>

                    <p className="text-center text-sm text-slate-500">
                        Already have an account?{' '}
                        <Link to="/login" className="text-emerald-500 hover:underline">Sign in</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default RegisterPage;
