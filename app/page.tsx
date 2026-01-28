'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAPI';
import Login from '@/components/Login';
import Tasks from '@/components/Tasks';
import Projects from '@/components/Projects';
import Comments from '@/components/Comments';
import History from '@/components/History';
import Notifications from '@/components/Notifications';
import Search from '@/components/Search';
import Reports from '@/components/Reports';

type Tab = 'tasks' | 'projects' | 'comments' | 'history' | 'notifications' | 'search' | 'reports';

export default function Home() {
  const { user, logout, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('tasks');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (user) {
      setIsLoggedIn(true);
    }
  }, [user]);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    logout();
    setIsLoggedIn(false);
    setActiveTab('tasks');
  };

  if (isLoading) {
    return (
      <div className="container">
        <div style={{ textAlign: 'center', padding: '50px' }}>Cargando...</div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="container">
        <Login onLogin={handleLogin} />
      </div>
    );
  }

  return (
    <div className="container">
      <h1>Task Manager</h1>
      
      <div className="panel">
        <div className="header">
          <span>Usuario: <strong>{user?.username}</strong></span>
          <button onClick={handleLogout}>Salir</button>
        </div>

        <div className="tabs">
          <button
            className={`tab-button ${activeTab === 'tasks' ? 'active' : ''}`}
            onClick={() => setActiveTab('tasks')}
          >
            Tareas
          </button>
          <button
            className={`tab-button ${activeTab === 'projects' ? 'active' : ''}`}
            onClick={() => setActiveTab('projects')}
          >
            Proyectos
          </button>
          <button
            className={`tab-button ${activeTab === 'comments' ? 'active' : ''}`}
            onClick={() => setActiveTab('comments')}
          >
            Comentarios
          </button>
          <button
            className={`tab-button ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => setActiveTab('history')}
          >
            Historial
          </button>
          <button
            className={`tab-button ${activeTab === 'notifications' ? 'active' : ''}`}
            onClick={() => setActiveTab('notifications')}
          >
            Notificaciones
          </button>
          <button
            className={`tab-button ${activeTab === 'search' ? 'active' : ''}`}
            onClick={() => setActiveTab('search')}
          >
            Búsqueda
          </button>
          <button
            className={`tab-button ${activeTab === 'reports' ? 'active' : ''}`}
            onClick={() => setActiveTab('reports')}
          >
            Reportes
          </button>
        </div>

        <div className={`tab-content ${activeTab === 'tasks' ? 'active' : ''}`}>
          <Tasks />
        </div>

        <div className={`tab-content ${activeTab === 'projects' ? 'active' : ''}`}>
          <Projects />
        </div>

        <div className={`tab-content ${activeTab === 'comments' ? 'active' : ''}`}>
          <Comments />
        </div>

        <div className={`tab-content ${activeTab === 'history' ? 'active' : ''}`}>
          <History />
        </div>

        <div className={`tab-content ${activeTab === 'notifications' ? 'active' : ''}`}>
          <Notifications />
        </div>

        <div className={`tab-content ${activeTab === 'search' ? 'active' : ''}`}>
          <Search />
        </div>

        <div className={`tab-content ${activeTab === 'reports' ? 'active' : ''}`}>
          <Reports />
        </div>
      </div>
    </div>
  );
}
