import { NextRequest, NextResponse } from 'next/server';
import { connectDB, verifyToken, Task } from '../utils/auth';

export const dynamic = 'force-dynamic';

// POST /api/search - Búsqueda avanzada de tareas
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    await verifyToken(request);

    const { text, status, priority, projectId } = await request.json();

    // Construir query
    const query: any = {};

    if (text) {
      query.$or = [
        { title: { $regex: text, $options: 'i' } },
        { description: { $regex: text, $options: 'i' } }
      ];
    }

    if (status) {
      query.status = status;
    }

    if (priority) {
      query.priority = priority;
    }

    if (projectId) {
      query.projectId = projectId;
    }

    const tasks = await Task.find(query)
      .populate('projectId', 'name description')
      .populate('assignedTo', 'username')
      .sort({ createdAt: -1 });

    return NextResponse.json(tasks);
  } catch (error: any) {
    if (error.message.includes('No autorizado') || error.message.includes('Token')) {
      return NextResponse.json({ message: error.message }, { status: 401 });
    }
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
