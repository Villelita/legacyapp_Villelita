import { NextRequest, NextResponse } from 'next/server';
import { connectDB, verifyToken, History } from '../../../utils/auth';

export const dynamic = 'force-dynamic';

// GET /api/history/task/:taskId - Obtener historial de una tarea
export async function GET(
  request: NextRequest,
  { params }: { params: { taskId: string } }
) {
  try {
    await connectDB();
    await verifyToken(request);

    const history = await History.find({ taskId: params.taskId })
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
