
import { Users, FolderKanban, CheckSquare, Activity } from 'lucide-react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

export function AdminDashboard({ data }: { data: any }) {
    const { projects, tasks, teams, users } = data;

    const stats = [
        { label: 'Total Users', value: users.length, icon: Users, color: 'text-blue-600', bg: 'bg-blue-100 dark:bg-blue-900/40' },
        { label: 'Active Projects', value: projects.length, icon: FolderKanban, color: 'text-indigo-600', bg: 'bg-indigo-100 dark:bg-indigo-900/40' },
        { label: 'Total Teams', value: teams.length, icon: Activity, color: 'text-emerald-600', bg: 'bg-emerald-100 dark:bg-emerald-900/40' },
        { label: 'Total Tasks', value: tasks.length, icon: CheckSquare, color: 'text-amber-600', bg: 'bg-amber-100 dark:bg-amber-900/40' },
    ];

    const taskStatusData = {
        labels: ['Todo', 'In Progress', 'Done'],
        datasets: [{
            data: [
                tasks.filter((t: any) => t.status === 'TODO').length,
                tasks.filter((t: any) => t.status === 'IN_PROGRESS').length,
                tasks.filter((t: any) => t.status === 'DONE').length,
            ],
            backgroundColor: ['#94a3b8', '#3b82f6', '#10b981'],
            borderWidth: 0,
        }]
    };

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Stats row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <div key={stat.label} className="glass-card p-6 flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
                                <Icon className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{stat.label}</p>
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</h3>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Tree View Component */}
                <div className="glass-card p-6 lg:col-span-2">
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">Organization Tree</h3>
                    <div className="space-y-4">
                        {teams.map((team: any) => {
                            const lead = users.find((u: any) => u.id === team.leadId);
                            const members = users.filter((u: any) => u.teamId === team.id && u.role === 'USER');

                            return (
                                <div key={team.id} className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 bg-slate-50/50 dark:bg-slate-800/50">
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                        <h4 className="font-semibold text-slate-900 dark:text-white">{team.name}</h4>
                                    </div>
                                    <div className="pl-6 space-y-3 relative before:absolute before:left-3 before:top-0 before:bottom-2 before:w-px before:bg-slate-300 dark:before:bg-slate-700">
                                        {/* Lead */}
                                        {lead && (
                                            <div className="flex items-center gap-3 relative before:absolute before:left-[-12px] before:top-1/2 before:w-3 before:h-px before:bg-slate-300 dark:before:bg-slate-700">
                                                <img src={lead.avatar} alt="" className="w-8 h-8 rounded-full border border-slate-200" />
                                                <div>
                                                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{lead.name}</p>
                                                    <p className="text-xs text-blue-600 dark:text-blue-400">Team Lead</p>
                                                </div>
                                            </div>
                                        )}
                                        {/* Members */}
                                        {members.map((member: any) => (
                                            <div key={member.id} className="flex items-center gap-3 relative before:absolute before:left-[-12px] before:top-1/2 before:w-3 before:h-px before:bg-slate-300 dark:before:bg-slate-700">
                                                <img src={member.avatar} alt="" className="w-8 h-8 rounded-full border border-slate-200" />
                                                <div>
                                                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{member.name}</p>
                                                    <p className="text-xs text-slate-500">Member</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Chart View */}
                <div className="glass-card p-6">
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">Platform Task Status</h3>
                    <div className="aspect-square relative">
                        <Doughnut
                            data={taskStatusData}
                            options={{
                                cutout: '70%',
                                plugins: {
                                    legend: { position: 'bottom', labels: { color: document.documentElement.className.includes('dark') ? '#cbd5e1' : '#334155' } }
                                }
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
