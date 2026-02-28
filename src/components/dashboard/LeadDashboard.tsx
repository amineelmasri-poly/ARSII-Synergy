import { useAppStore } from '../../store';
import type { Task, User } from '../../types';
import { CheckSquare, Clock, AlertTriangle, Activity } from 'lucide-react';
import { Doughnut } from 'react-chartjs-2';

export function LeadDashboard({ data }: { data: any }) {
    const { currentUser } = useAppStore();
    const { tasks, users, teams } = data;

    if (!currentUser) return null;

    const team = teams.find((t: any) => t.leadId === currentUser.id);
    const teamMembers = users.filter((u: User) => u.teamId === team?.id);
    const memberIds = teamMembers.map((m: User) => m.id);

    const teamTasks = tasks.filter((t: Task) => memberIds.includes(t.assigneeId));
    const todo = teamTasks.filter((t: Task) => t.status === 'TODO').length;
    const inProgress = teamTasks.filter((t: Task) => t.status === 'IN_PROGRESS').length;
    const done = teamTasks.filter((t: Task) => t.status === 'DONE').length;

    const chartData = {
        labels: ['To Do', 'In Progress', 'Done'],
        datasets: [{
            data: [todo, inProgress, done],
            backgroundColor: ['#94a3b8', '#3b82f6', '#10b981'],
            borderWidth: 0,
        }]
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                    {team?.name || 'Your Team'} Overview
                </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-card p-6 border-l-4 border-slate-400">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-slate-500">To Do</p>
                            <h3 className="text-2xl font-bold mt-1 text-slate-900 dark:text-white">{todo}</h3>
                        </div>
                        <Clock className="w-5 h-5 text-slate-400" />
                    </div>
                </div>
                <div className="glass-card p-6 border-l-4 border-blue-500">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-slate-500">In Progress</p>
                            <h3 className="text-2xl font-bold mt-1 text-slate-900 dark:text-white">{inProgress}</h3>
                        </div>
                        <Activity className="w-5 h-5 text-blue-500" />
                    </div>
                </div>
                <div className="glass-card p-6 border-l-4 border-emerald-500">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-slate-500">Completed</p>
                            <h3 className="text-2xl font-bold mt-1 text-slate-900 dark:text-white">{done}</h3>
                        </div>
                        <CheckSquare className="w-5 h-5 text-emerald-500" />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="glass-card p-6">
                    <h3 className="font-semibold text-slate-800 dark:text-slate-100 mb-4">Team Progress</h3>
                    <div className="aspect-square relative max-w-[300px] mx-auto">
                        <Doughnut data={chartData} options={{ cutout: '75%' }} />
                    </div>
                </div>

                <div className="glass-card p-6 overflow-hidden flex flex-col">
                    <h3 className="font-semibold text-slate-800 dark:text-slate-100 mb-4">Team Members Workload</h3>
                    <div className="flex-1 overflow-y-auto space-y-4">
                        {teamMembers.map((member: User) => {
                            const memberTasks = teamTasks.filter((t: Task) => t.assigneeId === member.id && t.status !== 'DONE');
                            const isOverloaded = memberTasks.length > 5;

                            return (
                                <div key={member.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                                    <div className="flex items-center gap-3">
                                        <img src={member.avatar} alt="" className="w-10 h-10 rounded-full" />
                                        <div>
                                            <p className="font-medium text-slate-900 dark:text-white">{member.name}</p>
                                            <p className="text-xs text-slate-500">{memberTasks.length} active tasks</p>
                                        </div>
                                    </div>
                                    {isOverloaded ? (
                                        <div className="flex items-center gap-1 text-red-600 bg-red-100 dark:bg-red-900/40 px-2 py-1 rounded-md text-xs font-semibold">
                                            <AlertTriangle className="w-3 h-3" />
                                            Overloaded
                                        </div>
                                    ) : (
                                        <div className="text-emerald-600 bg-emerald-100 dark:bg-emerald-900/40 px-2 py-1 rounded-md text-xs font-semibold">
                                            Healthy
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}


