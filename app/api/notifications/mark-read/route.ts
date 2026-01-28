import { NextRequest, NextResponse } from 'next/server';
import { connectDB, verifyToken, Notification } from '../../utils/auth';

export const dynamic = 'force-dynamic';

// PUT /api/notifications/mark-read - Marcar todas las notificaciones como leídas
export async function PUT(request: NextRequest) {
  try {
    await connectDB();
    const userId = await verifyToken(request);

    await Notification.updateMany(
      { userId, read: false },
      { read: true }
    );

    return NextResponse.json({ message: 'Notificaciones marcadas como leídas' });
  } catch (error: any) {
    if (error.message.includes('No autorizado') || error.message.includes('Token')) {
      return NextResponse.json({ message: error.message }, { status: 401 });
    }
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
