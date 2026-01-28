import type { Metadata } from 'next';
import './globals.css';
import { NotificationProvider } from '@/hooks/useNotification';

export const metadata: Metadata = {
  title: 'Task Manager - Sistema de Gestión',
  description: 'Sistema de gestión de tareas y proyectos',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        <NotificationProvider>{children}</NotificationProvider>
      </body>
    </html>
  );
}

