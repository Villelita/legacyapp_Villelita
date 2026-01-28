'use client';

import { useState } from 'react';
import { useReports } from '@/hooks/useAPI';

export default function Reports() {
  const { tasksReport, projectsReport, usersReport, loadTasksReport, loadProjectsReport, loadUsersReport, exportCSV, isLoading } = useReports();
  const [reportText, setReportText] = useState('');

  const generateReport = async (type: string) => {
    let text = `=== REPORTE: ${type.toUpperCase()} ===\n\n`;

    try {
      if (type === 'tasks') {
        await loadTasksReport();
        if (tasksReport) {
          Object.keys(tasksReport).forEach(status => {
            text += `${status}: ${tasksReport[status]} tareas\n`;
          });
        }
      } else if (type === 'projects') {
        await loadProjectsReport();
        if (projectsReport) {
          projectsReport.forEach((item: any) => {
            text += `${item.name}: ${item.taskCount} tareas\n`;
          });
        }
      } else if (type === 'users') {
        await loadUsersReport();
        if (usersReport) {
          usersReport.forEach((item: any) => {
            text += `${item.username}: ${item.taskCount} tareas asignadas\n`;
          });
        }
      }

      setReportText(text);
    } catch (error: any) {
      alert('Error al generar reporte: ' + error.message);
    }
  };

  const handleExportCSV = async () => {
    try {
      await exportCSV();
      alert('Exportado a export_tasks.csv');
    } catch (error: any) {
      alert('Error al exportar: ' + error.message);
    }
  };

  return (
    <div>
      <h2>Generación de Reportes</h2>
      <div className="form-section">
        <div className="button-group">
          <button onClick={() => generateReport('tasks')}>Reporte de Tareas</button>
          <button onClick={() => generateReport('projects')}>Reporte de Proyectos</button>
          <button onClick={() => generateReport('users')}>Reporte de Usuarios</button>
          <button onClick={handleExportCSV}>Exportar a CSV</button>
        </div>
      </div>
      <div className="text-area-section">
        <textarea
          value={isLoading ? 'Generando reporte...' : reportText || 'Selecciona un tipo de reporte para generar'}
          rows={20}
          readOnly
        />
      </div>
    </div>
  );
}
