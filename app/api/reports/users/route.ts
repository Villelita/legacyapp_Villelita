import { NextRequest, NextResponse } from 'next/server';
import { connectDB, verifyToken, User, Task } from '../../utils/auth';

export const dynamic = 'force-dynamic';

// GET /api/reports/users - Reporte de usuarios con tareas asignadas
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    await verifyToken(request);

    const users = await User.find();
    const tasks = await Task.find();

    const report = users.map(user => ({
      username: user.username,
      taskCount: tasks.filter(t => 
        t.assignedTo && t.assignedTo.toString() === user._id.toString()
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
