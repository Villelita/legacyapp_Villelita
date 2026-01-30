'use client';

import { useState, useEffect } from 'react';
import { useProjects } from '@/hooks/useAPI';
import { Project } from '@/hooks/useAPI';
import { useNotification } from '@/hooks/useNotification';
import ConfirmModal from '@/components/ConfirmModal';

export default function Projects() {
  const { projects, addProject, updateProject, deleteProject, refreshProjects } = useProjects();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });
  const { notify } = useNotification();

  const [confirmDelete, setConfirmDelete] = useState<{
    open: boolean;
    id: string;
    name: string;
  } | null>(null);

  useEffect(() => {
    refreshProjects();
  }, []);

  const handleAddProject = async () => {
    if (!formData.name) {
      notify('El nombre es requerido', 'error');
      return;
    }

    try {
      await addProject(formData);
      setFormData({ name: '', description: '' });
      notify('Proyecto agregado correctamente', 'success');
    } catch (error: any) {
      notify('Error al agregar proyecto: ' + error.message, 'error');
    }
  };

  const handleUpdateProject = async () => {
    if (!selectedProject) {
      notify('Selecciona un proyecto de la tabla', 'error');
      return;
    }

    try {
      await updateProject(selectedProject._id, formData);
      setFormData({ name: '', description: '' });
      setSelectedProject(null);
      notify('Proyecto actualizado correctamente', 'success');
    } catch (error: any) {
      notify('Error al actualizar proyecto: ' + error.message, 'error');
    }
  };

  const handleDeleteProject = async () => {
    if (!selectedProject) {
      notify('Selecciona un proyecto de la tabla', 'error');
      return;
    }

    setConfirmDelete({
      open: true,
      id: selectedProject._id,
      name: selectedProject.name,
    });
  };

  const handleConfirmDeleteProject = async () => {
    if (!confirmDelete) return;
    try {
      await deleteProject(confirmDelete.id);
      setFormData({ name: '', description: '' });
      setSelectedProject(null);
      notify('Proyecto eliminado correctamente', 'error');
    } catch (error: any) {
      notify('Error al eliminar proyecto: ' + error.message, 'error');
    } finally {
      setConfirmDelete(null);
    }
  };

  const handleCancelDeleteProject = () => {
    setConfirmDelete(null);
  };

  const selectProject = (project: Project) => {
    setSelectedProject(project);
    setFormData({
      name: project.name,
      description: project.description || ''
    });
  };

  return (
    <div>
      <h2>Gestión de Proyectos</h2>
      <div className="form-section">
        <div className="form-group">
          <label>Nombre:</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
        <div className="button-group">
          <button onClick={handleAddProject}>Agregar</button>
          <button onClick={handleUpdateProject}>Actualizar</button>
          <button className="danger" onClick={handleDeleteProject}>Eliminar</button>
        </div>
      </div>
      <div className="table-section">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Descripción</th>
            </tr>
          </thead>
          <tbody>
            {projects.map(project => (
              <tr key={project._id} onClick={() => selectProject(project)}>
                <td>{project._id.substring(0, 8)}...</td>
                <td>{project.name}</td>
                <td>{project.description || ''}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ConfirmModal
        open={!!confirmDelete?.open}
        title="Eliminar proyecto"
        message={
          confirmDelete
            ? `¿Seguro que quieres eliminar el proyecto \"${confirmDelete.name}\"? Esta acción no se puede deshacer.`
            : ''
        }
        confirmLabel="Eliminar"
        cancelLabel="Cancelar"
        onConfirm={handleConfirmDeleteProject}
        onCancel={handleCancelDeleteProject}
      />
    </div>
  );
}
