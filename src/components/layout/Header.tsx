import { Bell, Moon, Sun } from 'lucide-react';
import { useAppStore } from '../../store';

export function Header() {
    const { currentUser, theme, toggleTheme, notifications } = useAppStore();
    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <header className="h-16 flex items-center justify-between px-6 glass border-b sticky top-0 z-10 transition-colors">
            <div className="flex-1">
                {currentUser && (
                    <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                        Welcome back, {currentUser.name.split(' ')[0]}
                    </h2>
                )}
            </div>

            <div className="flex items-center gap-4">
                <button
                    onClick={toggleTheme}
                    className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-400"
                    aria-label="Toggle theme"
                >
                    {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>

                <div className="relative">
                    <button className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-400">
                        <Bell className="w-5 h-5" />
                        {unreadCount > 0 && (
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-slate-900" />
                        )}
                    </button>
                </div>

                {currentUser && (
                    <div className="flex items-center gap-3 pl-4 border-l border-slate-200 dark:border-slate-700">
                        <div className="flex flex-col items-end">
                            <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                                {currentUser.name}
                            </span>
                            <span className="text-xs text-slate-500 dark:text-slate-400 capitalize">
                                {currentUser.role.replace('_', ' ').toLowerCase()}
                            </span>
                        </div>
                        <img
                            src={currentUser.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser.name}`}
                            alt={currentUser.name}
                            className="w-10 h-10 rounded-full border-2 border-slate-200 dark:border-slate-700"
                        />
                    </div>
                )}
            </div>
        </header>
    );
}
