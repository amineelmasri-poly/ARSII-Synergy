import { useState, useEffect } from 'react';
import { useAppStore } from '../store';
import { api } from '../services/api';
import type { Project, Task } from '../types';
import { FolderKanban, Plus, Search, MoreVertical, TrendingUp, CheckSquare } from 'lucide-react';

export function Projects() {
    const { currentUser } = useAppStore();
    const [projects, setProjects] = useState<Project[]>([]);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            api.get<Project[]>('/projects'),
            api.get<Task[]>('/tasks')
        ]).then(([p, t]) => {
            setProjects(p);
            setTasks(t);
            setLoading(false);
        });
    }, []);

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
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <FolderKanban className="w-6 h-6 text-indigo-500" />
                    Projects
                </h1>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search projects..."
                            className="pl-9 pr-4 py-2 w-full md:w-64 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm dark:text-white"
                        />
                    </div>
                    {['ADMIN', 'MANAGER'].includes(currentUser?.role || '') && (
                        <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm shadow-indigo-500/30">
                            <Plus className="w-4 h-4" />
                            New Project
                        </button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {projects.map((project) => {
                    const projectTasks = tasks.filter(t => t.projectId === project.id);
                    const completed = projectTasks.filter(t => t.status === 'DONE').length;
                    const total = projectTasks.length;

                    return (
                        <div key={project.id} className="glass-card p-6 flex flex-col hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors group cursor-pointer relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4">
                                <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <MoreVertical className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="flex items-start gap-4 mb-4">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${project.status === 'ACTIVE' ? 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                                    <FolderKanban className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg text-slate-900 dark:text-white line-clamp-1">{project.name}</h3>
                                    <span className={`inline-flex items-center px-2 py-0.5 mt-1 rounded text-xs font-semibold ${project.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40' : 'bg-slate-100 text-slate-600 dark:bg-slate-800'
                                        }`}>
                                        {project.status.replace('_', ' ')}
                                    </span>
                                </div>
                            </div>

                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 flex-1 line-clamp-2">
                                {project.description}
                            </p>

                            <div className="pt-4 border-t border-slate-200 dark:border-slate-700/50 mt-auto">
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
                                        <TrendingUp className="w-4 h-4" /> Progress
                                    </span>
                                    <span className="font-medium text-indigo-600 dark:text-indigo-400">{project.progress}%</span>
                                </div>
                                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 mb-4 overflow-hidden">
                                    <div className="bg-gradient-to-r from-indigo-500 to-blue-500 h-2 rounded-full transition-all duration-500" style={{ width: `${project.progress}%` }}></div>
                                </div>
                                <div className="flex justify-between items-center text-xs text-slate-500 dark:text-slate-400">
                                    <div className="flex items-center gap-1">
                                        <CheckSquare className="w-3.5 h-3.5" />
                                        {completed}/{total} Tasks
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

