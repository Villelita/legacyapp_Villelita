import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectDB, verifyToken, Task, History, Notification } from '../../utils/auth';

export const dynamic = 'force-dynamic';

// GET /api/tasks/:id - Obtener una tarea por ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    await verifyToken(request);
    const { id } = await params;

    const task = await Task.findById(id)
      .populate('projectId', 'name description')
      .populate('assignedTo', 'username')
      .populate('createdBy', 'username');

    if (!task) {
      return NextResponse.json(
        { message: 'Tarea no encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json(task);
  } catch (error: any) {
    if (error.message.includes('No autorizado') || error.message.includes('Token')) {
      return NextResponse.json({ message: error.message }, { status: 401 });
    }
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

// PUT /api/tasks/:id - Actualizar tarea
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const userId = await verifyToken(request);
    const { id } = await params;

    const task = await Task.findById(id);

    if (!task) {
      return NextResponse.json(
        { message: 'Tarea no encontrada' },
        { status: 404 }
      );
    }

    const {
      title,
      description,
      status,
      priority,
      projectId,
      assignedTo,
      dueDate,
      estimatedHours,
      actualHours
    } = await request.json();

    // Validar ObjectIds si se proporcionan
    if (projectId !== undefined && projectId !== null && projectId !== '') {
      if (!mongoose.Types.ObjectId.isValid(projectId)) {
        return NextResponse.json(
          { message: 'ID de proyecto inválido' },
          { status: 400 }
        );
      }
    }

    if (assignedTo !== undefined && assignedTo !== null && assignedTo !== '') {
      if (!mongoose.Types.ObjectId.isValid(assignedTo)) {
        return NextResponse.json(
          { message: 'ID de usuario asignado inválido' },
          { status: 400 }
        );
      }
    }

    // Guardar valores antiguos para historial
    const oldStatus = task.status;
    const oldPriority = task.priority;
    const oldAssignedTo = task.assignedTo?.toString();

    // Actualizar campos
    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (status !== undefined) task.status = status;
    if (priority !== undefined) task.priority = priority;
    if (projectId !== undefined) task.projectId = projectId || null;
    if (assignedTo !== undefined) task.assignedTo = assignedTo || null;
    if (dueDate !== undefined) task.dueDate = dueDate;
    if (estimatedHours !== undefined) task.estimatedHours = estimatedHours;
    if (actualHours !== undefined) task.actualHours = actualHours;

    await task.save();

    // Crear entradas en historial para cambios importantes
    if (status !== undefined && status !== oldStatus) {
      await History.create({
        taskId: task._id,
        userId: userId,
        action: 'Estado cambiado',
        oldValue: oldStatus,
        newValue: status
      });
    }

    if (priority !== undefined && priority !== oldPriority) {
      await History.create({
        taskId: task._id,
        userId: userId,
        action: 'Prioridad cambiada',
        oldValue: oldPriority,
        newValue: priority
      });
    }

    if (assignedTo !== undefined && assignedTo !== oldAssignedTo) {
      await History.create({
        taskId: task._id,
        userId: userId,
        action: 'Asignación cambiada',
        oldValue: oldAssignedTo || '',
        newValue: assignedTo || ''
      });

      // Crear notificación si hay nuevo asignado
      if (assignedTo) {
        await Notification.create({
          userId: assignedTo,
          message: `Tarea asignada: ${task.title}`,
          type: 'task_assigned'
        });
      }
    }

    const populatedTask = await Task.findById(task._id)
      .populate('projectId', 'name description')
      .populate('assignedTo', 'username')
      .populate('createdBy', 'username');

    return NextResponse.json(populatedTask);
  } catch (error: any) {
    if (error.message.includes('No autorizado') || error.message.includes('Token')) {
      return NextResponse.json({ message: error.message }, { status: 401 });
    }
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

// DELETE /api/tasks/:id - Eliminar tarea
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    await verifyToken(request);
    const { id } = await params;

    const task = await Task.findById(id);

    if (!task) {
      return NextResponse.json(
        { message: 'Tarea no encontrada' },
        { status: 404 }
      );
    }

    await Task.findByIdAndDelete(id);

    return NextResponse.json({ message: 'Tarea eliminada' });
  } catch (error: any) {
    if (error.message.includes('No autorizado') || error.message.includes('Token')) {
      return NextResponse.json({ message: error.message }, { status: 401 });
    }
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
