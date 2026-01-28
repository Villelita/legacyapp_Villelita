'use client';

import { useState, useEffect } from 'react';
import { useNotifications } from '@/hooks/useAPI';
import { useNotification } from '@/hooks/useNotification';

export default function Notifications() {
  const { notifications, loadNotifications, markAsRead, isLoading } = useNotifications();
  const { notify } = useNotification();

  useEffect(() => {
    loadNotifications();
  }, []);

  const handleMarkAsRead = async () => {
    try {
      await markAsRead();
      notify('Notificaciones marcadas como leídas', 'success');
    } catch (error: any) {
      notify('Error al marcar notificaciones: ' + error.message, 'error');
    }
  };

  const notificationsText = notifications.map(notif => 
    `• [${notif.type}] ${notif.message} (${new Date(notif.createdAt).toLocaleString()})`
  ).join('\n');

  return (
    <div>
      <h2>Notificaciones</h2>
      <div className="form-section">
        <div className="button-group">
          <button onClick={loadNotifications}>Cargar Notificaciones</button>
          <button onClick={handleMarkAsRead}>Marcar como Leídas</button>
        </div>
      </div>
      <div className="text-area-section">
        <textarea
          value={isLoading ? 'Cargando...' : notifications.length === 0 ? '=== NOTIFICACIONES ===\n\nNo hay notificaciones nuevas' : `=== NOTIFICACIONES ===\n\n${notificationsText}`}
          rows={20}
          readOnly
        />
      </div>
    </div>
  );
}
