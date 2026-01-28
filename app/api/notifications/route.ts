import { NextRequest, NextResponse } from 'next/server';
import { connectDB, verifyToken, Notification } from '../utils/auth';

export const dynamic = 'force-dynamic';

// GET /api/notifications - Obtener todas las notificaciones del usuario
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const userId = await verifyToken(request);

    const notifications = await Notification.find({ userId })
      .sort({ createdAt: -1 });

    return NextResponse.json(notifications);
  } catch (error: any) {
    if (error.message.includes('No autorizado') || error.message.includes('Token')) {
      return NextResponse.json({ message: error.message }, { status: 401 });
    }
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
