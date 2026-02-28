# ARSII Synergy MVP
A unified project management Progressive Web App (PWA) built for the ARSII-Sfax challenge.

## Features
- **Role-Based Architecture**: 4 distinct views for ADMIN, MANAGER, TEAM LEAD, and USER.
- **Project & Task Lifecycle**: Full flow from project planning to task execution.
- **Progress Dashboard**: Role-specific analytics and workload tracking using Chart.js.
- **Team Visualization**: Organization tree component for Admins.
- **Accountability**: Real-time notifications for task assignments and status updates.
- **Modern Glassmorphism UI**: High-end visual aesthetic crafted with Tailwind CSS and Framer Motion logic.

## Tech Stack
- React 18 + TypeScript + Vite
- Zustand (Global State Management)
- Tailwind CSS + Lucide React (Styling & Icons)
- Chart.js + React-Chartjs-2 (Analytics)
- React Router v6 (Navigation)
- JSON Server (Mock Backend)
- Vite PWA Plugin

## Project Structure
- `/src/components/dashboard` - Role-based dashboard widgets
- `/src/components/layout` - Sidebar and Header navigation
- `/src/pages` - Main module views (Login, Projects, Tasks, Team)
- `/src/store` - Zustand store definition
- `/db.json` - Mock database for users, projects, teams, tasks

## Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Run the Mock Backend (JSON Server)**
   ```bash
   npm run dev:mock
   ```
   *This starts the server on http://localhost:3001*

3. **Start the Frontend Application**
   ```bash
   npm run dev
   ```
   *This starts the Vite dev server on http://localhost:5173*

## Demo Walkthrough
1. **Login**: The login screen lets you simulate clicking into one of the 4 roles.
2. **Admin View**: Check the Organization Tree mapping Leads to Users.
3. **Manager View**: See Cross-Team analytics and global progress metrics.
4. **Lead View**: Access the Team Progress Dashboard focusing on assigned members' workloads.
5. **User View**: View personal tasks, upcoming deadlines, and update status.
6. **Task Updates**: Try changing a task status from "To Do" to "Done". If you accepted the browser notification prompt, "Done" triggers a browser notification.

## License
MIT
