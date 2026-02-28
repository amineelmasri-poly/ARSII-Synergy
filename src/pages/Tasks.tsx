import { useState, useEffect } from 'react';
import { useAppStore } from '../store';
import { api } from '../services/api';
import type { Task, Project, User } from '../types';
import { format, parseISO } from 'date-fns';
import { Search, Plus, MoreVertical } from 'lucide-react';

export function Tasks() {
    const { currentUser } = useAppStore();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [projects, setProjects] = useState<Project[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [tData, pData, uData] = await Promise.all([
                api.get<Task[]>('/tasks'),
                api.get<Project[]>('/projects'),
                api.get<User[]>('/users')
            ]);
            setTasks(tData);
            setProjects(pData);
            setUsers(uData);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const updateTaskStatus = async (taskId: string, newStatus: Task['status']) => {
        try {
            const task = tasks.find(t => t.id === taskId);
            if (!task) return;
            const updated = { ...task, status: newStatus };
            await api.patch(`/tasks/${taskId}`, { status: newStatus });
            setTasks(tasks.map(t => t.id === taskId ? updated : t));

            // If Real-time / Simulation: Show Notification
            if (newStatus === 'DONE' && Notification.permission === 'granted') {
                new Notification('Task Completed', {
                    body: `Task "${task.title}" was marked as DONE.`,
                    icon: '/mask-icon.svg'
                });
            }
        } catch (err) {
            console.error("Failed to update status");
        }
    };

    const visibleTasks = tasks.filter(t => {
        // Role based visibility
        if (currentUser?.role === 'USER' && t.assigneeId !== currentUser.id) return false;
        // simple filtering
        if (statusFilter !== 'ALL' && t.status !== statusFilter) return false;
        if (search && !t.title.toLowerCase().includes(search.toLowerCase())) return false;
        return true;
    });

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                    Tasks
                </h1>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search tasks..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-9 pr-4 py-2 w-full md:w-64 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm dark:text-white"
                        />
                    </div>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                    >
                        <option value="ALL">All Status</option>
                        <option value="TODO">To Do</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="REVIEW">Review</option>
                        <option value="DONE">Done</option>
                    </select>
                    {['ADMIN', 'MANAGER', 'TEAM_LEAD'].includes(currentUser?.role || '') && (
                        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm shadow-blue-500/30">
                            <Plus className="w-4 h-4" />
                            New Task
                        </button>
                    )}
                </div>
            </div>

            <div className="glass-card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 text-sm">
                                <th className="px-6 py-4 font-medium">Task Name</th>
                                <th className="px-6 py-4 font-medium">Project</th>
                                <th className="px-6 py-4 font-medium">Assignee</th>
                                <th className="px-6 py-4 font-medium">Due Date</th>
                                <th className="px-6 py-4 font-medium">Priority</th>
                                <th className="px-6 py-4 font-medium">Status</th>
                                <th className="px-6 py-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                            {visibleTasks.map((task) => {
                                const project = projects.find(p => p.id === task.projectId);
                                const assignee = users.find(u => u.id === task.assigneeId);
                                return (
                                    <tr key={task.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <p className="font-medium text-slate-900 dark:text-slate-100">{task.title}</p>
                                            <p className="text-xs text-slate-500 truncate max-w-[200px]">{task.description}</p>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
                                            {project?.name || 'Unknown'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                {assignee && <img src={assignee.avatar} alt="" className="w-6 h-6 rounded-full" />}
                                                <span className="text-sm text-slate-700 dark:text-slate-300">{assignee?.name || 'Unassigned'}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
                                            {format(parseISO(task.deadline), 'MMM dd')}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${task.priority === 'HIGH' ? 'bg-red-100 text-red-700 dark:bg-red-900/40' :
                                                task.priority === 'MEDIUM' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40' :
                                                    'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40'
                                                }`}>
                                                {task.priority}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <select
                                                value={task.status}
                                                onChange={(e) => updateTaskStatus(task.id, e.target.value as Task['status'])}
                                                className={`text-xs px-2.5 py-1.5 rounded-full font-medium border-0 cursor-pointer focus:ring-2 focus:ring-blue-500 appearance-none ${task.status === 'DONE' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400' :
                                                    task.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400' :
                                                        'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                                                    }`}
                                            >
                                                <option value="TODO">To Do</option>
                                                <option value="IN_PROGRESS">In Progress</option>
                                                <option value="REVIEW">Review</option>
                                                <option value="DONE">Done</option>
                                            </select>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="text-slate-400 hover:text-blue-600 transition-colors">
                                                <MoreVertical className="w-5 h-5 ml-auto" />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                            {visibleTasks.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                                        No tasks found matching your criteria.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
