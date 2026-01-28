'use client';

import { useEffect, useState } from 'react';
import { Storage, User, Task, Project, Comment, HistoryEntry, Notification } from '@/lib/storage';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Storage.init();
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = (username: string, password: string): boolean => {
    const users = Storage.getUsers();
    const foundUser = users.find(u => u.username === username && u.password === password);
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('currentUser', JSON.stringify(foundUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  return { user, login, logout, isLoading };
}

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    Storage.init();
    setTasks(Storage.getTasks());
  }, []);

  const refreshTasks = () => {
    setTasks(Storage.getTasks());
  };

  const addTask = (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    Storage.addTask(task);
    refreshTasks();
  };

  const updateTask = (id: number, task: Partial<Task>) => {
    Storage.updateTask(id, task);
    refreshTasks();
  };

  const deleteTask = (id: number) => {
    Storage.deleteTask(id);
    refreshTasks();
  };

  return { tasks, addTask, updateTask, deleteTask, refreshTasks };
}

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    Storage.init();
    setProjects(Storage.getProjects());
  }, []);

  const refreshProjects = () => {
    setProjects(Storage.getProjects());
  };

  const addProject = (project: Omit<Project, 'id'>) => {
    Storage.addProject(project);
    refreshProjects();
  };

  const updateProject = (id: number, project: Partial<Project>) => {
    Storage.updateProject(id, project);
    refreshProjects();
  };

  const deleteProject = (id: number) => {
    Storage.deleteProject(id);
    refreshProjects();
  };

  return { projects, addProject, updateProject, deleteProject, refreshProjects };
}

export function useComments() {
  const [comments, setComments] = useState<Comment[]>([]);

  const loadComments = (taskId: number) => {
    const allComments = Storage.getComments();
    setComments(allComments.filter(c => c.taskId === taskId));
  };

  const addComment = (comment: Omit<Comment, 'id' | 'createdAt'>) => {
    Storage.addComment(comment);
    loadComments(comment.taskId);
  };

  return { comments, loadComments, addComment };
}

export function useHistory() {
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  const loadHistory = (taskId?: number) => {
    const allHistory = Storage.getHistory();
    if (taskId) {
      setHistory(allHistory.filter(h => h.taskId === taskId));
    } else {
      setHistory(allHistory.slice(-100).reverse());
    }
  };

  const addHistory = (entry: Omit<HistoryEntry, 'id' | 'timestamp'>) => {
    Storage.addHistory(entry);
  };

  return { history, loadHistory, addHistory };
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const loadNotifications = (userId: number) => {
    const allNotifications = Storage.getNotifications();
    setNotifications(allNotifications.filter(n => n.userId === userId && !n.read));
  };

  const markAsRead = (userId: number) => {
    Storage.markNotificationsRead(userId);
    loadNotifications(userId);
  };

  const addNotification = (notification: Omit<Notification, 'id' | 'read' | 'createdAt'>) => {
    Storage.addNotification(notification);
  };

  return { notifications, loadNotifications, markAsRead, addNotification };
}
