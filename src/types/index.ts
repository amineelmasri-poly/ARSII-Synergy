export type Role = 'ADMIN' | 'MANAGER' | 'TEAM_LEAD' | 'USER';

export interface User {
    id: string;
    name: string;
    email: string;
    role: Role;
    teamId?: string;
    avatar?: string;
}

export interface Team {
    id: string;
    name: string;
    leadId: string;
    projectId?: string;
}

export interface Project {
    id: string;
    name: string;
    description: string;
    status: 'PLANNING' | 'ACTIVE' | 'COMPLETED';
    progress: number;
}

export interface Task {
    id: string;
    title: string;
    description: string;
    projectId: string;
    assigneeId: string;
    reviewerId?: string; // e.g. Lead or Manager
    status: 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE';
    priority: 'LOW' | 'MEDIUM' | 'HIGH';
    deadline: string; // ISO date string
    createdAt: string;
}

export interface Comment {
    id: string;
    taskId: string;
    authorId: string;
    content: string;
    createdAt: string;
}

export interface Notification {
    id: string;
    userId: string;
    title: string;
    message: string;
    read: boolean;
    createdAt: string;
}
