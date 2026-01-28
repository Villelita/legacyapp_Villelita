import { NextRequest, NextResponse } from 'next/server';
import { connectDB, verifyToken, Task, History, Notification } from '../utils/auth';

export const dynamic = 'force-dynamic';

// GET /api/tasks - Obtener todas las tareas
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const userId = await verifyToken(request);

    const tasks = await Task.find()
      .populate('projectId', 'name description')
      .populate('assignedTo', 'username')
      .populate('createdBy', 'username')
      .sort({ createdAt: -1 });

    return NextResponse.json(tasks);
  } catch (error: any) {
    if (error.message.includes('No autorizado') || error.message.includes('Token')) {
      return NextResponse.json({ message: error.message }, { status: 401 });
    }
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

// POST /api/tasks - Crear nueva tarea
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const userId = await verifyToken(request);

    const {
      title,
      description,
      status,
      priority,
      projectId,
      assignedTo,
      dueDate,
      estimatedHours
    } = await request.json();

    if (!title) {
      return NextResponse.json(
        { message: 'El título es requerido' },
        { status: 400 }
      );
    }

    const task = await Task.create({
      title,
      description: description || '',
      status: status || 'Pendiente',
      priority: priority || 'Media',
      projectId: projectId || null,
      assignedTo: assignedTo || null,
      dueDate: dueDate || null,
      estimatedHours: estimatedHours || 0,
      actualHours: 0,
      createdBy: userId
    });

    // Crear entrada en historial
    await History.create({
      taskId: task._id,
      userId: userId,
      action: 'CREATED',
      oldValue: '',
      newValue: title
    });

    // Crear notificación si hay asignado
    if (assignedTo) {
      await Notification.create({
        userId: assignedTo,
        message: `Nueva tarea asignada: ${title}`,
        type: 'task_assigned'
      });
    }

    const populatedTask = await Task.findById(task._id)
      .populate('projectId', 'name description')
      .populate('assignedTo', 'username')
      .populate('createdBy', 'username');

    return NextResponse.json(populatedTask, { status: 201 });
  } catch (error: any) {
    if (error.message.includes('No autorizado') || error.message.includes('Token')) {
      return NextResponse.json({ message: error.message }, { status: 401 });
    }
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
