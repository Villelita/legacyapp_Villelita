import { NextRequest, NextResponse } from 'next/server';
import { connectDB, verifyToken, Project } from '../utils/auth';

export const dynamic = 'force-dynamic';

// GET /api/projects - Obtener todos los proyectos
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    await verifyToken(request);

    const projects = await Project.find().sort({ createdAt: -1 });
    return NextResponse.json(projects);
  } catch (error: any) {
    if (error.message.includes('No autorizado') || error.message.includes('Token')) {
      return NextResponse.json({ message: error.message }, { status: 401 });
    }
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

// POST /api/projects - Crear nuevo proyecto
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    await verifyToken(request);

    const { name, description } = await request.json();

    if (!name) {
      return NextResponse.json(
        { message: 'El nombre es requerido' },
        { status: 400 }
      );
    }

    const project = await Project.create({
      name,
      description: description || ''
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error: any) {
    if (error.message.includes('No autorizado') || error.message.includes('Token')) {
      return NextResponse.json({ message: error.message }, { status: 401 });
    }
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
