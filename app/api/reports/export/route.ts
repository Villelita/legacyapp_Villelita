import { NextRequest, NextResponse } from 'next/server';
import { connectDB, verifyToken, Task } from '../../utils/auth';

export const dynamic = 'force-dynamic';

// GET /api/reports/export - Exportar tareas a CSV
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    await verifyToken(request);

    const tasks = await Task.find()
      .populate('projectId', 'name');

    let csv = 'ID,Título,Estado,Prioridad,Proyecto\n';

    tasks.forEach(task => {
      const projectName = task.projectId && typeof task.projectId === 'object' && 'name' in task.projectId
        ? (task.projectId as any).name
        : 'Sin proyecto';
      csv += `${task._id},"${task.title}","${task.status || 'Pendiente'}","${task.priority || 'Media'}","${projectName}"\n`;
    });

    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename=export_tasks.csv'
      }
    });
  } catch (error: any) {
    if (error.message.includes('No autorizado') || error.message.includes('Token')) {
      return NextResponse.json({ message: error.message }, { status: 401 });
    }
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
