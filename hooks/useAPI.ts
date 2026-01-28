'use client';

import { useEffect, useState } from 'react';
import { authAPI, tasksAPI, projectsAPI, commentsAPI, historyAPI, notificationsAPI, searchAPI, reportsAPI } from '@/lib/api';

// Tipos
export interface User {
  _id: string;
  username: string;
}

export interface Task {
  _id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  projectId?: { _id: string; name: string; description?: string } | string | null;
  assignedTo?: { _id: string; username: string } | string | null;
  dueDate?: string | null;
  estimatedHours: number;
  actualHours: number;
  createdBy: { _id: string; username: string } | string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Project {
  _id: string;
  name: string;
  description: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Comment {
  _id: string;
  taskId: string;
  userId: { _id: string; username: string } | string;
  commentText: string;
  createdAt: string;
}

export interface HistoryEntry {
  _id: string;
  taskId: string;
  userId: { _id: string; username: string } | string;
  action: string;
  oldValue: string;
  newValue: string;
  createdAt: string;
}

export interface Notification {
  _id: string;
  userId: string;
  message: string;
  type: string;
  read: boolean;
  createdAt: string;
}

// Hook de autenticación
export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const data = await authAPI.login(username, password);
      setUser({ _id: data._id, username: data.username });
      return true;
    } catch (error: any) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    authAPI.logout();
    setUser(null);
  };

  return { user, login, logout, isLoading };
}

// Hook de tareas
export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadTasks = async () => {
    try {
      setIsLoading(true);
      const data = await tasksAPI.getAll();
      setTasks(data);
    } catch (error) {
      console.error('Error loading tasks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const addTask = async (task: Partial<Task>) => {
    try {
      const newTask = await tasksAPI.create(task);
      await loadTasks();
      return newTask;
    } catch (error) {
      console.error('Error adding task:', error);
      throw error;
    }
  };

  const updateTask = async (id: string, task: Partial<Task>) => {
    try {
      const updatedTask = await tasksAPI.update(id, task);
      await loadTasks();
      return updatedTask;
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  };

  const deleteTask = async (id: string) => {
    try {
      await tasksAPI.delete(id);
      await loadTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  };

  return { tasks, addTask, updateTask, deleteTask, refreshTasks: loadTasks, isLoading };
}

// Hook de proyectos
export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadProjects = async () => {
    try {
      setIsLoading(true);
      const data = await projectsAPI.getAll();
      setProjects(data);
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const addProject = async (project: Partial<Project>) => {
    try {
      const newProject = await projectsAPI.create(project);
      await loadProjects();
      return newProject;
    } catch (error) {
      console.error('Error adding project:', error);
      throw error;
    }
  };

  const updateProject = async (id: string, project: Partial<Project>) => {
    try {
      const updatedProject = await projectsAPI.update(id, project);
      await loadProjects();
      return updatedProject;
    } catch (error) {
      console.error('Error updating project:', error);
      throw error;
    }
  };

  const deleteProject = async (id: string) => {
    try {
      await projectsAPI.delete(id);
      await loadProjects();
    } catch (error) {
      console.error('Error deleting project:', error);
      throw error;
    }
  };

  return { projects, addProject, updateProject, deleteProject, refreshProjects: loadProjects, isLoading };
}

// Hook de comentarios
export function useComments() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadComments = async (taskId: string) => {
    try {
      setIsLoading(true);
      const data = await commentsAPI.getByTask(taskId);
      setComments(data);
    } catch (error) {
      console.error('Error loading comments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addComment = async (comment: { taskId: string; commentText: string }) => {
    try {
      const newComment = await commentsAPI.create(comment);
      await loadComments(comment.taskId);
      return newComment;
    } catch (error) {
      console.error('Error adding comment:', error);
      throw error;
    }
  };

  return { comments, loadComments, addComment, isLoading };
}

// Hook de historial
export function useHistory() {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadHistory = async (taskId?: string) => {
    try {
      setIsLoading(true);
      const data = taskId ? await historyAPI.getByTask(taskId) : await historyAPI.getAll();
      setHistory(data);
    } catch (error) {
      console.error('Error loading history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return { history, loadHistory, isLoading };
}

// Hook de notificaciones
export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadNotifications = async () => {
    try {
      setIsLoading(true);
      const data = await notificationsAPI.getAll();
      setNotifications(data);
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const markAsRead = async () => {
    try {
      await notificationsAPI.markAsRead();
      await loadNotifications();
    } catch (error) {
      console.error('Error marking notifications as read:', error);
    }
  };

  return { notifications, loadNotifications, markAsRead, isLoading };
}

// Hook de búsqueda
export function useSearch() {
  const [results, setResults] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const search = async (filters: { text?: string; status?: string; priority?: string; projectId?: string }) => {
    try {
      setIsLoading(true);
      const data = await searchAPI.search(filters);
      setResults(data);
    } catch (error) {
      console.error('Error searching:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return { results, search, isLoading };
}

// Hook de reportes
export function useReports() {
  const [tasksReport, setTasksReport] = useState<any>(null);
  const [projectsReport, setProjectsReport] = useState<any>(null);
  const [usersReport, setUsersReport] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const loadTasksReport = async () => {
    try {
      setIsLoading(true);
      const data = await reportsAPI.getTasksReport();
      setTasksReport(data);
    } catch (error) {
      console.error('Error loading tasks report:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadProjectsReport = async () => {
    try {
      setIsLoading(true);
      const data = await reportsAPI.getProjectsReport();
      setProjectsReport(data);
    } catch (error) {
      console.error('Error loading projects report:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadUsersReport = async () => {
    try {
      setIsLoading(true);
      const data = await reportsAPI.getUsersReport();
      setUsersReport(data);
    } catch (error) {
      console.error('Error loading users report:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const exportCSV = async () => {
    try {
      await reportsAPI.exportCSV();
    } catch (error) {
      console.error('Error exporting CSV:', error);
    }
  };

  return {
    tasksReport,
    projectsReport,
    usersReport,
    loadTasksReport,
    loadProjectsReport,
    loadUsersReport,
    exportCSV,
    isLoading
  };
}
