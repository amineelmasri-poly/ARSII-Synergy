import { useEffect, useState } from 'react';
import { useAppStore } from '../store';
import { api } from '../services/api';
import type { Project, Task, Team } from '../types';
import { AdminDashboard } from '../components/dashboard/AdminDashboard';
import { ManagerDashboard } from '../components/dashboard/ManagerDashboard';
import { LeadDashboard } from '../components/dashboard/LeadDashboard';
import { UserDashboard } from '../components/dashboard/UserDashboard';

export function Dashboard() {
    const { currentUser } = useAppStore();
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [projects, tasks, teams, users] = await Promise.all([
                    api.get<Project[]>('/projects'),
                    api.get<Task[]>('/tasks'),
                    api.get<Team[]>('/teams'),
                    api.get<any[]>('/users')
                ]);
                setData({ projects, tasks, teams, users });
            } catch (err) {
                console.error("Failed to load dashboard data");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (!currentUser) return null;
    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin dark:border-blue-900 dark:border-t-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                    Dashboard Overview
                </h1>
                <div className="px-4 py-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm text-sm font-medium text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                    Role: <span className="text-blue-600 dark:text-blue-400 capitalize">{currentUser.role.replace('_', ' ').toLowerCase()}</span>
                </div>
            </div>

            {currentUser.role === 'ADMIN' && <AdminDashboard data={data} />}
            {currentUser.role === 'MANAGER' && <ManagerDashboard data={data} />}
            {currentUser.role === 'TEAM_LEAD' && <LeadDashboard data={data} />}
            {currentUser.role === 'USER' && <UserDashboard data={data} />}
        </div>
    );
}
