// Configuración de la API
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Función helper para hacer peticiones
async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(`${API_URL}${endpoint}`, config);
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error en la petición' }));
    throw new Error(error.message || 'Error en la petición');
  }

  return response.json();
}

// Auth API
export const authAPI = {
  login: async (username: string, password: string) => {
    const data = await fetchAPI('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify({ _id: data._id, username: data.username }));
    }
    return data;
  },

  register: async (username: string, password: string) => {
    const data = await fetchAPI('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify({ _id: data._id, username: data.username }));
    }
    return data;
  },

  getMe: async () => {
    return fetchAPI('/auth/me');
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};

// Tasks API
export const tasksAPI = {
  getAll: async () => fetchAPI('/tasks'),
  getById: async (id: string) => fetchAPI(`/tasks/${id}`),
  create: async (task: any) => fetchAPI('/tasks', {
    method: 'POST',
    body: JSON.stringify(task),
  }),
  update: async (id: string, task: any) => fetchAPI(`/tasks/${id}`, {
    method: 'PUT',
    body: JSON.stringify(task),
  }),
  delete: async (id: string) => fetchAPI(`/tasks/${id}`, {
    method: 'DELETE',
  }),
};

// Projects API
export const projectsAPI = {
  getAll: async () => fetchAPI('/projects'),
  getById: async (id: string) => fetchAPI(`/projects/${id}`),
  create: async (project: any) => fetchAPI('/projects', {
    method: 'POST',
    body: JSON.stringify(project),
  }),
  update: async (id: string, project: any) => fetchAPI(`/projects/${id}`, {
    method: 'PUT',
    body: JSON.stringify(project),
  }),
  delete: async (id: string) => fetchAPI(`/projects/${id}`, {
    method: 'DELETE',
  }),
};

// Comments API
export const commentsAPI = {
  getByTask: async (taskId: string) => fetchAPI(`/comments/task/${taskId}`),
  create: async (comment: any) => fetchAPI('/comments', {
    method: 'POST',
    body: JSON.stringify(comment),
  }),
};

// History API
export const historyAPI = {
  getByTask: async (taskId: string) => fetchAPI(`/history/task/${taskId}`),
  getAll: async () => fetchAPI('/history'),
};

// Notifications API
export const notificationsAPI = {
  getAll: async () => fetchAPI('/notifications'),
  markAsRead: async () => fetchAPI('/notifications/mark-read', {
    method: 'PUT',
  }),
};

// Search API
export const searchAPI = {
  search: async (filters: any) => fetchAPI('/search', {
    method: 'POST',
    body: JSON.stringify(filters),
  }),
};

// Reports API
export const reportsAPI = {
  getTasksReport: async () => fetchAPI('/reports/tasks'),
  getProjectsReport: async () => fetchAPI('/reports/projects'),
  getUsersReport: async () => fetchAPI('/reports/users'),
  exportCSV: async () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const response = await fetch(`${API_URL}/reports/export`, {
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'export_tasks.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  },
};
