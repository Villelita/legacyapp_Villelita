import { NextRequest, NextResponse } from 'next/server';
import { connectDB, verifyToken, Comment } from '../utils/auth';

export const dynamic = 'force-dynamic';

// POST /api/comments - Crear nuevo comentario
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const userId = await verifyToken(request);

    const { taskId, commentText } = await request.json();

    if (!taskId || !commentText) {
      return NextResponse.json(
        { message: 'ID de tarea y comentario requeridos' },
        { status: 400 }
      );
    }

    const comment = await Comment.create({
      taskId,
      userId: userId,
      commentText
    });

    const populatedComment = await Comment.findById(comment._id)
      .populate('userId', 'username');

    return NextResponse.json(populatedComment, { status: 201 });
  } catch (error: any) {
    if (error.message.includes('No autorizado') || error.message.includes('Token')) {
      return NextResponse.json({ message: error.message }, { status: 401 });
    }
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
