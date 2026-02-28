import { NavLink } from 'react-router-dom';
import { useAppStore } from '../../store';
import { Home, FolderKanban, CheckSquare, Users, Settings, LogOut } from 'lucide-react';
import { cn } from '../../lib/utils';

export function Sidebar() {
    const { currentUser, setCurrentUser } = useAppStore();

    if (!currentUser) return null;

    const links = [
        { name: 'Dashboard', to: '/dashboard', icon: Home, roles: ['ADMIN', 'MANAGER', 'TEAM_LEAD', 'USER'] },
        { name: 'Projects', to: '/projects', icon: FolderKanban, roles: ['ADMIN', 'MANAGER', 'TEAM_LEAD'] },
        { name: 'My Tasks', to: '/tasks', icon: CheckSquare, roles: ['TEAM_LEAD', 'USER'] },
        { name: 'Team', to: '/team', icon: Users, roles: ['ADMIN', 'MANAGER', 'TEAM_LEAD'] },
        { name: 'Settings', to: '/settings', icon: Settings, roles: ['ADMIN'] },
    ];

    const visibleLinks = links.filter(link => link.roles.includes(currentUser.role));

    return (
        <aside className="w-64 flex-shrink-0 glass border-r flex flex-col transition-all h-full">
            <div className="h-16 flex items-center px-6 border-b border-slate-200/50 dark:border-slate-700/50">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold">
                        S
                    </div>
                    <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                        Synergy
                    </span>
                </div>
            </div>

            <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
                {visibleLinks.map((link) => {
                    const Icon = link.icon;
                    return (
                        <NavLink
                            key={link.name}
                            to={link.to}
                            className={({ isActive }) =>
                                cn(
                                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                                    isActive
                                        ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/40 dark:text-blue-200'
                                        : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800/50'
                                )
                            }
                        >
                            <Icon className="w-5 h-5" />
                            {link.name}
                        </NavLink>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-slate-200/50 dark:border-slate-700/50">
                <button
                    onClick={() => setCurrentUser(null)}
                    className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 transition-colors"
                >
                    <LogOut className="w-5 h-5" />
                    Logout
                </button>
            </div>
        </aside>
    );
}
