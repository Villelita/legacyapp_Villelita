'use client';

import { useState } from 'react';
import { useHistory } from '@/hooks/useAPI';

export default function History() {
  const { history, loadHistory, isLoading } = useHistory();
  const [taskId, setTaskId] = useState('');

  const handleLoadHistory = async () => {
    if (!taskId) {
      alert('ID de tarea requerido');
      return;
    }
    await loadHistory(taskId);
  };

  const handleLoadAllHistory = async () => {
    await loadHistory();
  };

  const historyText = history.map(entry => {
    const user = typeof entry.userId === 'object' ? entry.userId.username : 'Desconocido';
    return `Tarea #${entry.taskId} - ${entry.action} - ${new Date(entry.createdAt).toLocaleString()}\n  Usuario: ${user}\n  Antes: ${entry.oldValue || '(vacío)'}\n  Después: ${entry.newValue || '(vacío)'}`;
  }).join('\n---\n');

  return (
    <div>
      <h2>Historial de Cambios</h2>
      <div className="form-section">
        <div className="form-group">
          <label>ID Tarea:</label>
          <input
            type="text"
            value={taskId}
            onChange={(e) => setTaskId(e.target.value)}
            placeholder="ID de la tarea (opcional para ver todo)"
          />
        </div>
        <div className="button-group">
          <button onClick={handleLoadHistory}>Cargar Historial</button>
          <button onClick={handleLoadAllHistory}>Cargar Todo el Historial</button>
        </div>
      </div>
      <div className="text-area-section">
        <textarea
          value={isLoading ? 'Cargando...' : history.length === 0 ? 'No hay historial' : (taskId ? `=== HISTORIAL TAREA #${taskId} ===\n\n${historyText}` : `=== HISTORIAL COMPLETO ===\n\n${historyText}`)}
          rows={20}
          readOnly
        />
      </div>
    </div>
  );
}
