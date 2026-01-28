'use client';

import { useState, useEffect } from 'react';
import { useTasks, useProjects, useAuth } from '@/hooks/useAPI';
import { Task, Project } from '@/hooks/useAPI';

export default function Tasks() {
  const { user } = useAuth();
  const { tasks, addTask, updateTask, deleteTask, refreshTasks, isLoading } = useTasks();
  const { projects, refreshProjects } = useProjects();
  const [users, setUsers] = useState<any[]>([]);

  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'Pendiente',
    priority: 'Media',
    projectId: '',
    assignedTo: '',
    dueDate: '',
    estimatedHours: 0
  });

  useEffect(() => {
    // Cargar usuarios desde la API (necesitarías un endpoint para esto)
    // Por ahora, usaremos los usuarios que vienen en las tareas
    refreshProjects();
  }, []);

  const handleAddTask = async () => {
    if (!formData.title) {
      alert('El título es requerido');
      return;
    }

    try {
      const taskData: any = {
        title: formData.title,
        description: formData.description,
        status: formData.status,
        priority: formData.priority,
        estimatedHours: formData.estimatedHours,
      };

      if (formData.projectId) taskData.projectId = formData.projectId;
      if (formData.assignedTo) taskData.assignedTo = formData.assignedTo;
      if (formData.dueDate) taskData.dueDate = formData.dueDate;

      await addTask(taskData);
      clearForm();
      alert('Tarea agregada');
    } catch (error: any) {
      alert('Error al agregar tarea: ' + error.message);
    }
  };

  const handleUpdateTask = async () => {
    if (!selectedTaskId) {
      alert('Selecciona una tarea');
      return;
    }

    try {
      const taskData: any = {
        title: formData.title,
        description: formData.description,
        status: formData.status,
        priority: formData.priority,
        estimatedHours: formData.estimatedHours,
      };

      if (formData.projectId) taskData.projectId = formData.projectId;
      if (formData.assignedTo) taskData.assignedTo = formData.assignedTo;
      if (formData.dueDate) taskData.dueDate = formData.dueDate;

      await updateTask(selectedTaskId, taskData);
      clearForm();
      alert('Tarea actualizada');
    } catch (error: any) {
      alert('Error al actualizar tarea: ' + error.message);
    }
  };

  const handleDeleteTask = async () => {
    if (!selectedTaskId) {
      alert('Selecciona una tarea');
      return;
    }

    const task = tasks.find(t => t._id === selectedTaskId);
    if (!task) return;

    if (confirm('¿Eliminar tarea: ' + task.title + '?')) {
      try {
        await deleteTask(selectedTaskId);
        clearForm();
        alert('Tarea eliminada');
      } catch (error: any) {
        alert('Error al eliminar tarea: ' + error.message);
      }
    }
  };

  const clearForm = () => {
    setFormData({
      title: '',
      description: '',
      status: 'Pendiente',
      priority: 'Media',
      projectId: '',
      assignedTo: '',
      dueDate: '',
      estimatedHours: 0
    });
    setSelectedTaskId(null);
  };

  const selectTask = (task: Task) => {
    setSelectedTaskId(task._id);
    const projectId = typeof task.projectId === 'object' && task.projectId ? task.projectId._id : '';
    const assignedTo = typeof task.assignedTo === 'object' && task.assignedTo ? task.assignedTo._id : '';
    
    setFormData({
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      projectId: projectId || '',
      assignedTo: assignedTo || '',
      dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
      estimatedHours: task.estimatedHours
    });
  };

  const stats = () => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.status === 'Completada').length;
    const pending = tasks.filter(t => t.status !== 'Completada').length;
    const highPriority = tasks.filter(t => t.priority === 'Alta' || t.priority === 'Crítica').length;
    const overdue = tasks.filter(t => {
      if (!t.dueDate || t.status === 'Completada') return false;
      return new Date(t.dueDate) < new Date();
    }).length;

    return { total, completed, pending, highPriority, overdue };
  };

  const statsData = stats();

  // Obtener lista única de usuarios de las tareas
  const allUsers = Array.from(new Set(
    tasks
      .map(t => t.assignedTo)
      .filter(Boolean)
      .map(u => typeof u === 'object' ? u : null)
      .filter(Boolean)
  ));

  if (isLoading) {
    return <div>Cargando tareas...</div>;
  }

  return (
    <div>
      <h2>Gestión de Tareas</h2>
      
      <div className="form-section">
        <h3>Nueva/Editar Tarea</h3>
        <div className="form-group">
          <label>Título:</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>Descripción:</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
          />
        </div>
        <div className="form-group">
          <label>Estado:</label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
          >
            <option>Pendiente</option>
            <option>En Progreso</option>
            <option>Completada</option>
            <option>Bloqueada</option>
            <option>Cancelada</option>
          </select>
        </div>
        <div className="form-group">
          <label>Prioridad:</label>
          <select
            value={formData.priority}
            onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
          >
            <option>Baja</option>
            <option>Media</option>
            <option>Alta</option>
            <option>Crítica</option>
          </select>
        </div>
        <div className="form-group">
          <label>Proyecto:</label>
          <select
            value={formData.projectId}
            onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
          >
            <option value="">Sin proyecto</option>
            {projects.map(project => (
              <option key={project._id} value={project._id}>{project.name}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Asignado a:</label>
          <input
            type="text"
            value={formData.assignedTo}
            onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
            placeholder="ID de usuario (por ahora)"
          />
        </div>
        <div className="form-group">
          <label>Fecha Vencimiento:</label>
          <input
            type="date"
            value={formData.dueDate}
            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>Horas Estimadas:</label>
          <input
            type="number"
            step="0.5"
            value={formData.estimatedHours}
            onChange={(e) => setFormData({ ...formData, estimatedHours: parseFloat(e.target.value) || 0 })}
          />
        </div>
        <div className="button-group">
          <button onClick={handleAddTask}>Agregar</button>
          <button onClick={handleUpdateTask}>Actualizar</button>
          <button className="danger" onClick={handleDeleteTask}>Eliminar</button>
          <button className="secondary" onClick={clearForm}>Limpiar</button>
        </div>
      </div>

      <div className="table-section">
        <h3>Lista de Tareas</h3>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Título</th>
              <th>Estado</th>
              <th>Prioridad</th>
              <th>Proyecto</th>
              <th>Asignado</th>
              <th>Vencimiento</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map(task => {
              const project = typeof task.projectId === 'object' ? task.projectId : projects.find(p => p._id === task.projectId);
              const assignedUser = typeof task.assignedTo === 'object' ? task.assignedTo : null;
              return (
                <tr key={task._id} onClick={() => selectTask(task)}>
                  <td>{task._id.substring(0, 8)}...</td>
                  <td>{task.title}</td>
                  <td>{task.status || 'Pendiente'}</td>
                  <td>{task.priority || 'Media'}</td>
                  <td>{project && typeof project === 'object' ? project.name : 'Sin proyecto'}</td>
                  <td>{assignedUser && typeof assignedUser === 'object' ? assignedUser.username : 'Sin asignar'}</td>
                  <td>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'Sin fecha'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="stats">
        <strong>Estadísticas:</strong>{' '}
        Total: {statsData.total} | Completadas: {statsData.completed} | Pendientes: {statsData.pending} | Alta Prioridad: {statsData.highPriority} | Vencidas: {statsData.overdue}
      </div>
    </div>
  );
}
