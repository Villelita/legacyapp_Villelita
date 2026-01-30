'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useState,
  ReactNode,
} from 'react';
import NotificationModal from '@/components/NotificationModal';

type NotificationVariant = 'success' | 'error' | 'info';

interface NotificationState {
  message: string;
  variant: NotificationVariant;
  visible: boolean;
}

interface NotificationContextValue {
  notify: (message: string, variant?: NotificationVariant) => void;
}

const NotificationContext = createContext<NotificationContextValue | undefined>(
  undefined
);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notification, setNotification] = useState<NotificationState | null>(
    null
  );

  const notify = useCallback(
    (message: string, variant: NotificationVariant = 'info') => {
      setNotification({ message, variant, visible: true });

      // Auto-cerrar después de unos segundos
      setTimeout(() => {
        setNotification((current) =>
          current ? { ...current, visible: false } : current
        );
      }, 3500);
    },
    []
  );

  const handleClose = () => setNotification(null);

  return (
    <NotificationContext.Provider value={{ notify }}>
      {children}
      <NotificationModal state={notification} onClose={handleClose} />
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      'useNotification debe usarse dentro de un NotificationProvider'
    );
  }
  return context;
}

