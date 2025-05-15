### 📁 Project Directory Structure Overview

| Path (`src/` omitted)           | Purpose                                                        |
| ------------------------------- | -------------------------------------------------------------- |
| `app/`                          | Top-level routing using Next.js App Router                     |
| `app/tasks/`                    | Pages for task CRUD operations                                 |
| `app/tasks/page.tsx`            | Displays list of tasks                                         |
| `app/tasks/new/page.tsx`        | Form page to create a new task                                 |
| `app/tasks/[id]/page.tsx`       | Form page to view or edit an existing task                     |
| `lib/`                          | Utility logic, Firebase, and data layer                        |
| `lib/firebase.ts`               | Firebase configuration and Firestore instance setup            |
| `lib/firebase-tasks.ts`         | CRUD helper functions for task documents in Firestore          |
| `components/`                   | Reusable and feature-specific UI components                    |
| `components/tasks/TaskForm.tsx` | Form component for creating/updating a task                    |
| `components/tasks/TaskItem.tsx` | List/display component for a single task                       |
| `contexts/`                     | Context providers to manage global state                       |
| `hooks/`                        | Custom hooks to abstract state management, data fetching, etc. |
| `types/`                        | TypeScript interfaces and types                                |
| `types/task.ts`                 | `Task` interface defining Firestore document structure         |
| `styles/`                       | Global styles and CSS modules                                  |
