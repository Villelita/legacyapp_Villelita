import { NextRequest, NextResponse } from 'next/server';
import { connectDB, verifyToken, Project, Task } from '../../utils/auth';

export const dynamic = 'force-dynamic';

// GET /api/reports/projects - Reporte de proyectos con conteo de tareas
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    await verifyToken(request);

    const projects = await Project.find();
    const tasks = await Task.find();

    const report = projects.map(project => ({
      name: project.name,
      taskCount: tasks.filter(t => 
        t.projectId && t.projectId.toString() === project._id.toString()
      ).length
    }));

    return NextResponse.json(report);
  } catch (error: any) {
    if (error.message.includes('No autorizado') || error.message.includes('Token')) {
      return NextResponse.json({ message: error.message }, { status: 401 });
    }
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
