'use client';

import React from 'react';

type NotificationVariant = 'success' | 'error' | 'info';

interface Props {
  state: {
    message: string;
    variant: NotificationVariant;
    visible: boolean;
  } | null;
  onClose: () => void;
}

export default function NotificationModal({ state, onClose }: Props) {
  if (!state || !state.visible) return null;

  const { message, variant } = state;

  const variantClass =
    variant === 'success'
      ? 'notification-success'
      : variant === 'error'
      ? 'notification-error'
      : 'notification-info';

  return (
    <div className="notification-overlay" onClick={onClose}>
      <div
        className={`notification-modal ${variantClass}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="notification-message">{message}</div>
        <button className="notification-close" onClick={onClose}>
          Cerrar
        </button>
      </div>
    </div>
  );
}

