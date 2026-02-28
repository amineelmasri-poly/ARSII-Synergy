import { create } from 'zustand';
import type { User, Notification } from '../types';

interface AppState {
    currentUser: User | null;
    setCurrentUser: (user: User | null) => void;
    notifications: Notification[];
    setNotifications: (notifications: Notification[]) => void;
    addNotification: (notification: Notification) => void;
    markNotificationRead: (id: string) => void;
    theme: 'dark' | 'light';
    toggleTheme: () => void;
}

export const useAppStore = create<AppState>((set) => ({
    currentUser: null,
    setCurrentUser: (user) => set({ currentUser: user }),
    notifications: [],
    setNotifications: (notifications) => set({ notifications }),
    addNotification: (notification) => set((state) => ({ notifications: [notification, ...state.notifications] })),
    markNotificationRead: (id) => set((state) => ({
        notifications: state.notifications.map(n => n.id === id ? { ...n, read: true } : n)
    })),
    theme: 'dark', // Default to modern UI 
    toggleTheme: () => set((state) => {
        const newTheme = state.theme === 'light' ? 'dark' : 'light';
        if (newTheme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        return { theme: newTheme };
    }),
}));
