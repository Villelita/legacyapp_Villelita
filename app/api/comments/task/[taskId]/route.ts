import { NextRequest, NextResponse } from 'next/server';
import { connectDB, verifyToken, Comment } from '../../../utils/auth';

export const dynamic = 'force-dynamic';

// GET /api/comments/task/:taskId - Obtener comentarios de una tarea
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ taskId: string }> }
) {
  try {
    await connectDB();
    await verifyToken(request);
    const { taskId } = await params;

    const comments = await Comment.find({ taskId })
      .populate('userId', 'username')
      .sort({ createdAt: -1 });

    return NextResponse.json(comments);
  } catch (error: any) {
    if (error.message.includes('No autorizado') || error.message.includes('Token')) {
      return NextResponse.json({ message: error.message }, { status: 401 });
    }
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
