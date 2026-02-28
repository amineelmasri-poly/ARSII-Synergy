import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store';
import { api } from '../services/api';
import type { User } from '../types';

export function Login() {
    const navigate = useNavigate();
    const { setCurrentUser } = useAppStore();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async (role: string) => {
        setLoading(true);
        setError('');
        try {
            const users = await api.get<User[]>('/users');
            const user = users.find((u: User) => u.role === role);
            if (user) {
                setCurrentUser(user);
                navigate('/dashboard');
            } else {
                setError('User not found for this role');
            }
        } catch (err) {
            setError('Failed to connect to JSON server. Is it running?');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 transition-colors p-4">
            <div className="w-full max-w-md glass-card p-8 animate-slide-up">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4 shadow-lg shadow-blue-500/30">
                        S
                    </div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                        ARSII Synergy
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2">
                        Select a role to demo the application
                    </p>
                </div>

                {error && (
                    <div className="mb-6 p-4 rounded-lg bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 text-sm border border-red-200 dark:border-red-900/50">
                        {error}
                    </div>
                )}

                <div className="space-y-3">
                    {[
                        { role: 'ADMIN', label: 'Login as Admin', desc: 'Full access & hierarchy view' },
                        { role: 'MANAGER', label: 'Login as Manager', desc: 'Cross-team analytics' },
                        { role: 'TEAM_LEAD', label: 'Login as Team Lead', desc: 'Team progress dashboard' },
                        { role: 'USER', label: 'Login as User', desc: 'Personal workload view' },
                    ].map(({ role, label, desc }) => (
                        <button
                            key={role}
                            onClick={() => handleLogin(role)}
                            disabled={loading}
                            className="w-full flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-all group disabled:opacity-50"
                        >
                            <div className="text-left">
                                <div className="font-semibold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                    {label}
                                </div>
                                <div className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                                    {desc}
                                </div>
                            </div>
                            <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center group-hover:bg-blue-100 dark:group-hover:bg-blue-900 transition-colors text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                                →
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
