'use client';

import { useState } from 'react';
import { useComments } from '@/hooks/useAPI';

export default function Comments() {
  const { comments, loadComments, addComment, isLoading } = useComments();
  const [taskId, setTaskId] = useState('');
  const [commentText, setCommentText] = useState('');

  const handleAddComment = async () => {
    if (!taskId) {
      alert('ID de tarea requerido');
      return;
    }

    if (!commentText) {
      alert('El comentario no puede estar vacío');
      return;
    }

    try {
      await addComment({ taskId, commentText });
      setCommentText('');
      alert('Comentario agregado');
    } catch (error: any) {
      alert('Error al agregar comentario: ' + error.message);
    }
  };

  const handleLoadComments = async () => {
    if (!taskId) {
      alert('ID de tarea requerido');
      return;
    }
    await loadComments(taskId);
  };

  const commentsText = comments.map(comment => {
    const user = typeof comment.userId === 'object' ? comment.userId.username : 'Usuario';
    return `[${new Date(comment.createdAt).toLocaleString()}] ${user}: ${comment.commentText}`;
  }).join('\n---\n');

  return (
    <div>
      <h2>Comentarios de Tareas</h2>
      <div className="form-section">
        <div className="form-group">
          <label>ID Tarea:</label>
          <input
            type="text"
            value={taskId}
            onChange={(e) => setTaskId(e.target.value)}
            placeholder="ID de la tarea"
          />
        </div>
        <div className="form-group">
          <label>Comentario:</label>
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            rows={3}
          />
        </div>
        <div className="button-group">
          <button onClick={handleAddComment}>Agregar Comentario</button>
          <button onClick={handleLoadComments}>Cargar Comentarios</button>
        </div>
      </div>
      <div className="text-area-section">
        <h3>Comentarios</h3>
        <textarea
          value={taskId ? `=== COMENTARIOS TAREA #${taskId} ===\n\n${isLoading ? 'Cargando...' : comments.length === 0 ? 'No hay comentarios' : commentsText}` : 'Ingresa un ID de tarea'}
          rows={15}
          readOnly
        />
      </div>
    </div>
  );
}
