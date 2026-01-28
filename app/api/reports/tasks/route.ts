import { NextRequest, NextResponse } from 'next/server';
import { connectDB, verifyToken, Task } from '../../utils/auth';

export const dynamic = 'force-dynamic';

// GET /api/reports/tasks - Reporte de tareas por estado
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    await verifyToken(request);

    const tasks = await Task.find();
    const statusCount: Record<string, number> = {};

    tasks.forEach(task => {
      const status = task.status || 'Pendiente';
      statusCount[status] = (statusCount[status] || 0) + 1;
    });

    return NextResponse.json(statusCount);
  } catch (error: any) {
    if (error.message.includes('No autorizado') || error.message.includes('Token')) {
      return NextResponse.json({ message: error.message }, { status: 401 });
    }
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
