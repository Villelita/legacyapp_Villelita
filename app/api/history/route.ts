import { NextRequest, NextResponse } from 'next/server';
import { connectDB, verifyToken, History } from '../utils/auth';

export const dynamic = 'force-dynamic';

// GET /api/history - Obtener todo el historial
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    await verifyToken(request);

    const history = await History.find()
      .populate('taskId', 'title')
      .populate('userId', 'username')
      .sort({ createdAt: -1 });

    return NextResponse.json(history);
  } catch (error: any) {
    if (error.message.includes('No autorizado') || error.message.includes('Token')) {
      return NextResponse.json({ message: error.message }, { status: 401 });
    }
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
