import { useAppStore } from '../../store';
import type { Task } from '../../types';
import { CheckSquare, Clock, AlertTriangle, CalendarDays } from 'lucide-react';
import { format, isBefore, parseISO } from 'date-fns';

export function UserDashboard({ data }: { data: any }) {
    const { currentUser } = useAppStore();
    const { tasks } = data;

    if (!currentUser) return null;

    const myTasks = tasks.filter((t: Task) => t.assigneeId === currentUser.id);
    const todo = myTasks.filter((t: Task) => t.status === 'TODO');
    const inProgress = myTasks.filter((t: Task) => t.status === 'IN_PROGRESS');
    const done = myTasks.filter((t: Task) => t.status === 'DONE');

    const upcomingDeadlines = [...todo, ...inProgress]
        .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
        .slice(0, 3);

    const isOverloaded = myTasks.filter((t: Task) => t.status !== 'DONE').length > 5;

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                    My Workload
                </h2>
                {isOverloaded && (
                    <span className="flex items-center gap-2 bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400 px-3 py-1.5 rounded-full text-sm font-semibold">
                        <AlertTriangle className="w-4 h-4" />
                        Heavy Workload Warning
                    </span>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-card p-6 border-l-4 border-slate-400">
                    <p className="text-sm font-medium text-slate-500">To Do</p>
                    <h3 className="text-3xl font-bold mt-2 text-slate-900 dark:text-white">{todo.length}</h3>
                </div>
                <div className="glass-card p-6 border-l-4 border-blue-500">
                    <p className="text-sm font-medium text-slate-500">In Progress</p>
                    <h3 className="text-3xl font-bold mt-2 text-slate-900 dark:text-white">{inProgress.length}</h3>
                </div>
                <div className="glass-card p-6 border-l-4 border-emerald-500">
                    <p className="text-sm font-medium text-slate-500">Completed</p>
                    <h3 className="text-3xl font-bold mt-2 text-slate-900 dark:text-white">{done.length}</h3>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="glass-card p-6">
                    <h3 className="font-semibold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
                        <CalendarDays className="w-5 h-5 text-indigo-500" /> Upcoming Deadlines
                    </h3>
                    <div className="space-y-3">
                        {upcomingDeadlines.length === 0 ? (
                            <p className="text-slate-500 text-sm">No upcoming deadlines.</p>
                        ) : (
                            upcomingDeadlines.map((task: Task) => {
                                const isOverdue = isBefore(parseISO(task.deadline), new Date());
                                return (
                                    <div key={task.id} className="p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 flex justify-between items-center hover:shadow-md transition-shadow">
                                        <div>
                                            <h4 className="font-medium text-slate-900 dark:text-slate-100">{task.title}</h4>
                                            <p className={`text-xs mt-1 ${isOverdue ? 'text-red-500 font-semibold' : 'text-slate-500'}`}>
                                                Due: {format(parseISO(task.deadline), 'MMM dd, yyyy')}
                                            </p>
                                        </div>
                                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${task.priority === 'HIGH' ? 'bg-red-100 text-red-700 dark:bg-red-900/30' :
                                            task.priority === 'MEDIUM' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30' :
                                                'bg-green-100 text-green-700 dark:bg-green-900/30'
                                            }`}>
                                            {task.priority}
                                        </span>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                <div className="glass-card p-6">
                    <h3 className="font-semibold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
                        <Clock className="w-5 h-5 text-blue-500" /> Recent Activity
                    </h3>
                    <div className="space-y-4">
                        {/* Stub for recent activity */}
                        <div className="flex gap-4">
                            <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center flex-shrink-0">
                                <CheckSquare className="w-4 h-4 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-slate-800 dark:text-slate-200">You completed 2 tasks this week.</p>
                                <p className="text-xs text-slate-500 mt-0.5">Keep up the good work!</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
