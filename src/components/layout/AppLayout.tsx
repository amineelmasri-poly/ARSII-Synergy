import { Outlet, Navigate } from 'react-router-dom';
import { useAppStore } from '../../store';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

export function AppLayout() {
    const { currentUser } = useAppStore();

    if (!currentUser) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="flex h-screen bg-slate-50 dark:bg-slate-900 transition-colors">
            <Sidebar />
            <div className="flex flex-col flex-1 overflow-hidden">
                <Header />
                <main className="flex-1 overflow-y-auto p-6 scroll-smooth">
                    <div className="max-w-7xl mx-auto animate-fade-in">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}
