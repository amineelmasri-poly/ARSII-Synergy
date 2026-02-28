import type { Team, Task, Project } from '../../types';
import { Bar } from 'react-chartjs-2';
import { Activity, FolderKanban, AlertCircle } from 'lucide-react';

export function ManagerDashboard({ data }: { data: any }) {
    const { projects, tasks, teams } = data;

    const projectStats = {
        labels: projects.map((p: Project) => p.name),
        datasets: [
            {
                label: 'Project Progress %',
                data: projects.map((p: Project) => p.progress),
                backgroundColor: '#6366f1',
            }
        ]
    };

    const highPriorityTasks = tasks.filter((t: Task) => t.priority === 'HIGH' && t.status !== 'DONE');

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-card p-6 flex flex-col justify-between">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 flex items-center justify-center">
                            <FolderKanban className="w-5 h-5" />
                        </div>
                        <h3 className="font-semibold text-slate-700 dark:text-slate-300">Active Projects</h3>
                    </div>
                    <p className="text-3xl font-bold text-slate-900 dark:text-white">{projects.filter((p: Project) => p.status === 'ACTIVE').length}</p>
                </div>

                <div className="glass-card p-6 flex flex-col justify-between">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 flex items-center justify-center">
                            <Activity className="w-5 h-5" />
                        </div>
                        <h3 className="font-semibold text-slate-700 dark:text-slate-300">Teams Managed</h3>
                    </div>
                    <p className="text-3xl font-bold text-slate-900 dark:text-white">{teams.length}</p>
                </div>

                <div className="glass-card p-6 flex flex-col justify-between border-red-200 dark:border-red-900/50">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-900/40 text-red-600 flex items-center justify-center">
                            <AlertCircle className="w-5 h-5" />
                        </div>
                        <h3 className="font-semibold text-slate-700 dark:text-slate-300">High Priority Tasks</h3>
                    </div>
                    <p className="text-3xl font-bold text-red-600 dark:text-red-400">{highPriorityTasks.length}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="glass-card p-6">
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">Project Progress Overview</h3>
                    <div className="h-64">
                        <Bar
                            data={projectStats}
                            options={{
                                maintainAspectRatio: false,
                                scales: {
                                    y: { beginAtZero: true, max: 100 }
                                }
                            }}
                        />
                    </div>
                </div>

                <div className="glass-card p-6">
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">Cross-Team Analytics</h3>
                    <div className="space-y-4">
                        {teams.map((team: Team) => {
                            const teamTasks = tasks.filter((t: Task) => usersInTeam(t.assigneeId, team.id, data.users));
                            const completed = teamTasks.filter((t: Task) => t.status === 'DONE').length;
                            const total = teamTasks.length;
                            const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

                            return (
                                <div key={team.id} className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="font-medium text-slate-900 dark:text-white">{team.name}</span>
                                        <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">{percent}%</span>
                                    </div>
                                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5">
                                        <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${percent}%` }}></div>
                                    </div>
                                    <p className="text-xs text-slate-500 mt-2">{completed} of {total} tasks completed</p>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}

// Helper to check if task assignee belongs to team
function usersInTeam(userId: string, teamId: string, users: any[]) {
    const user = users.find(u => u.id === userId);
    return user ? user.teamId === teamId : false;
}
