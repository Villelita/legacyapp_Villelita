// Sistema de almacenamiento con localStorage
export interface User {
  id: number;
  username: string;
  password: string;
}

export interface Project {
  id: number;
  name: string;
  description: string;
}

export interface Task {
  id: number;
  title: string;
  description: string;
  status: string;
  priority: string;
  projectId: number;
  assignedTo: number;
  dueDate: string;
  estimatedHours: number;
  actualHours: number;
  createdBy: number;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: number;
  taskId: number;
  userId: number;
  commentText: string;
  createdAt: string;
}

export interface HistoryEntry {
  id: number;
  taskId: number;
  userId: number;
  action: string;
  oldValue: string;
  newValue: string;
  timestamp: string;
}

export interface Notification {
  id: number;
  userId: number;
  message: string;
  type: string;
  read: boolean;
  createdAt: string;
}

export const Storage = {
  // Inicializar datos por defecto
  init() {
    if (typeof window === 'undefined') return;
    
    if (!localStorage.getItem('users')) {
      localStorage.setItem('users', JSON.stringify([
        { id: 1, username: 'admin', password: 'admin' },
        { id: 2, username: 'user1', password: 'user1' },
        { id: 3, username: 'user2', password: 'user2' }
      ]));
    }
    if (!localStorage.getItem('projects')) {
      localStorage.setItem('projects', JSON.stringify([
        { id: 1, name: 'Proyecto Demo', description: 'Proyecto de ejemplo' },
        { id: 2, name: 'Proyecto Alpha', description: 'Proyecto importante' },
        { id: 3, name: 'Proyecto Beta', description: 'Proyecto secundario' }
      ]));
    }
    if (!localStorage.getItem('tasks')) {
      localStorage.setItem('tasks', JSON.stringify([]));
    }
    if (!localStorage.getItem('comments')) {
      localStorage.setItem('comments', JSON.stringify([]));
    }
    if (!localStorage.getItem('history')) {
      localStorage.setItem('history', JSON.stringify([]));
    }
    if (!localStorage.getItem('notifications')) {
      localStorage.setItem('notifications', JSON.stringify([]));
    }
    if (!localStorage.getItem('nextTaskId')) {
      localStorage.setItem('nextTaskId', '1');
    }
    if (!localStorage.getItem('nextProjectId')) {
      localStorage.setItem('nextProjectId', '4');
    }
  },

  // Usuarios
  getUsers(): User[] {
    if (typeof window === 'undefined') return [];
    return JSON.parse(localStorage.getItem('users') || '[]');
  },

  // Proyectos
  getProjects(): Project[] {
    if (typeof window === 'undefined') return [];
    return JSON.parse(localStorage.getItem('projects') || '[]');
  },

  addProject(project: Omit<Project, 'id'>): number {
    if (typeof window === 'undefined') return 0;
    const projects = this.getProjects();
    const id = parseInt(localStorage.getItem('nextProjectId') || '1');
    const newProject: Project = { ...project, id };
    projects.push(newProject);
    localStorage.setItem('projects', JSON.stringify(projects));
    localStorage.setItem('nextProjectId', String(id + 1));
    return id;
  },

  updateProject(id: number, project: Partial<Project>): boolean {
    if (typeof window === 'undefined') return false;
    const projects = this.getProjects();
    const index = projects.findIndex(p => p.id === id);
    if (index !== -1) {
      projects[index] = { ...projects[index], ...project, id };
      localStorage.setItem('projects', JSON.stringify(projects));
      return true;
    }
    return false;
  },

  deleteProject(id: number): boolean {
    if (typeof window === 'undefined') return false;
    const projects = this.getProjects();
    const filtered = projects.filter(p => p.id !== id);
    localStorage.setItem('projects', JSON.stringify(filtered));
    return true;
  },

  // Tareas
  getTasks(): Task[] {
    if (typeof window === 'undefined') return [];
    return JSON.parse(localStorage.getItem('tasks') || '[]');
  },

  addTask(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): number {
    if (typeof window === 'undefined') return 0;
    const tasks = this.getTasks();
    const id = parseInt(localStorage.getItem('nextTaskId') || '1');
    const newTask: Task = {
      ...task,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    tasks.push(newTask);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    localStorage.setItem('nextTaskId', String(id + 1));
    return id;
  },

  updateTask(id: number, task: Partial<Task>): boolean {
    if (typeof window === 'undefined') return false;
    const tasks = this.getTasks();
    const index = tasks.findIndex(t => t.id === id);
    if (index !== -1) {
      tasks[index] = { ...tasks[index], ...task, id, updatedAt: new Date().toISOString() };
      localStorage.setItem('tasks', JSON.stringify(tasks));
      return true;
    }
    return false;
  },

  deleteTask(id: number): boolean {
    if (typeof window === 'undefined') return false;
    const tasks = this.getTasks();
    const filtered = tasks.filter(t => t.id !== id);
    localStorage.setItem('tasks', JSON.stringify(filtered));
    return true;
  },

  // Comentarios
  getComments(): Comment[] {
    if (typeof window === 'undefined') return [];
    return JSON.parse(localStorage.getItem('comments') || '[]');
  },

  addComment(comment: Omit<Comment, 'id' | 'createdAt'>): void {
    if (typeof window === 'undefined') return;
    const comments = this.getComments();
    const newComment: Comment = {
      ...comment,
      id: comments.length + 1,
      createdAt: new Date().toISOString()
    };
    comments.push(newComment);
    localStorage.setItem('comments', JSON.stringify(comments));
  },

  // Historial
  getHistory(): HistoryEntry[] {
    if (typeof window === 'undefined') return [];
    return JSON.parse(localStorage.getItem('history') || '[]');
  },

  addHistory(entry: Omit<HistoryEntry, 'id' | 'timestamp'>): void {
    if (typeof window === 'undefined') return;
    const history = this.getHistory();
    const newEntry: HistoryEntry = {
      ...entry,
      id: history.length + 1,
      timestamp: new Date().toISOString()
    };
    history.push(newEntry);
    localStorage.setItem('history', JSON.stringify(history));
  },

  // Notificaciones
  getNotifications(): Notification[] {
    if (typeof window === 'undefined') return [];
    return JSON.parse(localStorage.getItem('notifications') || '[]');
  },

  addNotification(notification: Omit<Notification, 'id' | 'read' | 'createdAt'>): void {
    if (typeof window === 'undefined') return;
    const notifications = this.getNotifications();
    const newNotification: Notification = {
      ...notification,
      id: notifications.length + 1,
      read: false,
      createdAt: new Date().toISOString()
    };
    notifications.push(newNotification);
    localStorage.setItem('notifications', JSON.stringify(notifications));
  },

  markNotificationsRead(userId: number): void {
    if (typeof window === 'undefined') return;
    const notifications = this.getNotifications();
    notifications.forEach(n => {
      if (n.userId === userId) {
        n.read = true;
      }
    });
    localStorage.setItem('notifications', JSON.stringify(notifications));
  }
};
