import { NextRequest, NextResponse } from 'next/server';
import { connectDB, verifyToken, Project } from '../../utils/auth';

export const dynamic = 'force-dynamic';

// GET /api/projects/:id - Obtener un proyecto por ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    await verifyToken(request);

    const project = await Project.findById(params.id);

    if (!project) {
      return NextResponse.json(
        { message: 'Proyecto no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(project);
  } catch (error: any) {
    if (error.message.includes('No autorizado') || error.message.includes('Token')) {
      return NextResponse.json({ message: error.message }, { status: 401 });
    }
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

// PUT /api/projects/:id - Actualizar proyecto
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    await verifyToken(request);

    const project = await Project.findById(params.id);

    if (!project) {
      return NextResponse.json(
        { message: 'Proyecto no encontrado' },
        { status: 404 }
      );
    }

    const { name, description } = await request.json();

    if (name !== undefined) project.name = name;
    if (description !== undefined) project.description = description;

    await project.save();

    return NextResponse.json(project);
  } catch (error: any) {
    if (error.message.includes('No autorizado') || error.message.includes('Token')) {
      return NextResponse.json({ message: error.message }, { status: 401 });
    }
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

// DELETE /api/projects/:id - Eliminar proyecto
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    await verifyToken(request);

    const project = await Project.findById(params.id);

    if (!project) {
      return NextResponse.json(
        { message: 'Proyecto no encontrado' },
        { status: 404 }
      );
    }

    await Project.findByIdAndDelete(params.id);

    return NextResponse.json({ message: 'Proyecto eliminado' });
  } catch (error: any) {
    if (error.message.includes('No autorizado') || error.message.includes('Token')) {
      return NextResponse.json({ message: error.message }, { status: 401 });
    }
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
