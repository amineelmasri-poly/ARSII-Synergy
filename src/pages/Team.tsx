import { useState, useEffect } from 'react';
import { api } from '../services/api';
import type { Team, User } from '../types';
import { Users, Search, Mail } from 'lucide-react';

export function TeamView() {
    const [teams, setTeams] = useState<Team[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([api.get<Team[]>('/teams'), api.get<User[]>('/users')])
            .then(([t, u]) => {
                setTeams(t);
                setUsers(u);
                setLoading(false);
            });
    }, []);

    if (loading) return null;

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Users className="w-6 h-6 text-emerald-500" />
                    Directory
                </h1>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search teams or members..."
                        className="pl-9 pr-4 py-2 w-full md:w-64 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm dark:text-white"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {teams.map((team) => {
                    const lead = users.find(u => u.id === team.leadId);
                    const members = users.filter(u => u.teamId === team.id && u.role !== 'TEAM_LEAD');

                    return (
                        <div key={team.id} className="glass-card p-0 overflow-hidden">
                            <div className="p-6 border-b border-slate-200 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-800/20">
                                <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">{team.name}</h2>
                                <p className="text-sm text-slate-500 mt-1">{members.length + 1} members</p>
                            </div>

                            <div className="p-6">
                                {/* Lead */}
                                {lead && (
                                    <div className="mb-6">
                                        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">Team Lead</h3>
                                        <div className="flex items-center justify-between p-3 rounded-xl border border-blue-100 bg-blue-50/50 dark:border-blue-900/30 dark:bg-blue-900/10">
                                            <div className="flex items-center gap-3">
                                                <img src={lead.avatar} className="w-10 h-10 rounded-full border border-slate-200 dark:border-slate-700" alt="" />
                                                <div>
                                                    <p className="font-semibold text-slate-900 dark:text-white">{lead.name}</p>
                                                    <p className="text-xs text-blue-600 dark:text-blue-400">{lead.email}</p>
                                                </div>
                                            </div>
                                            <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors">
                                                <Mail className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Members */}
                                <div>
                                    <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">Members</h3>
                                    <div className="space-y-2">
                                        {members.map(member => (
                                            <div key={member.id} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-slate-200 dark:border-slate-700/50 dark:hover:border-slate-600 transition-colors group">
                                                <div className="flex items-center gap-3">
                                                    <img src={member.avatar} className="w-10 h-10 rounded-full border border-slate-200 dark:border-slate-700 grayscale-[0.2] group-hover:grayscale-0 transition-all" alt="" />
                                                    <div>
                                                        <p className="font-medium text-slate-800 dark:text-slate-200">{member.name}</p>
                                                        <p className="text-xs text-slate-500 dark:text-slate-400">{member.email}</p>
                                                    </div>
                                                </div>
                                                <button className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Mail className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
