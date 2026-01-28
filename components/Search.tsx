'use client';

import { useState } from 'react';
import { useSearch, useProjects } from '@/hooks/useAPI';

export default function Search() {
  const { projects } = useProjects();
  const { results, search, isLoading } = useSearch();
  const [filters, setFilters] = useState({
    text: '',
    status: '',
    priority: '',
    projectId: ''
  });

  const handleSearch = async () => {
    const searchFilters: any = {};
    if (filters.text) searchFilters.text = filters.text;
    if (filters.status) searchFilters.status = filters.status;
    if (filters.priority) searchFilters.priority = filters.priority;
    if (filters.projectId) searchFilters.projectId = filters.projectId;
    
    await search(searchFilters);
  };

  return (
    <div>
      <h2>Búsqueda Avanzada</h2>
      <div className="form-section">
        <div className="form-group">
          <label>Texto:</label>
          <input
            type="text"
            value={filters.text}
            onChange={(e) => setFilters({ ...filters, text: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>Estado:</label>
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          >
            <option value="">Todos</option>
            <option>Pendiente</option>
            <option>En Progreso</option>
            <option>Completada</option>
          </select>
        </div>
        <div className="form-group">
          <label>Prioridad:</label>
          <select
            value={filters.priority}
            onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
          >
            <option value="">Todas</option>
            <option>Baja</option>
            <option>Media</option>
            <option>Alta</option>
            <option>Crítica</option>
          </select>
        </div>
        <div className="form-group">
          <label>Proyecto:</label>
          <select
            value={filters.projectId}
            onChange={(e) => setFilters({ ...filters, projectId: e.target.value })}
          >
            <option value="">Todos</option>
            {projects.map(project => (
              <option key={project._id} value={project._id}>{project.name}</option>
            ))}
          </select>
        </div>
        <button onClick={handleSearch}>Buscar</button>
      </div>
      <div className="table-section">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Título</th>
              <th>Estado</th>
              <th>Prioridad</th>
              <th>Proyecto</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={5}>Buscando...</td></tr>
            ) : results.length === 0 ? (
              <tr><td colSpan={5}>No se encontraron resultados</td></tr>
            ) : (
              results.map(task => {
                const project = typeof task.projectId === 'object' ? task.projectId : projects.find(p => p._id === task.projectId);
                return (
                  <tr key={task._id}>
                    <td>{task._id.substring(0, 8)}...</td>
                    <td>{task.title}</td>
                    <td>{task.status || 'Pendiente'}</td>
                    <td>{task.priority || 'Media'}</td>
                    <td>{project && typeof project === 'object' ? project.name : 'Sin proyecto'}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
