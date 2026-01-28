import { NextRequest, NextResponse } from 'next/server';
import { connectDB, verifyToken, User } from '../utils/auth';

export const dynamic = 'force-dynamic';

// GET /api/users - Obtener todos los usuarios
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    await verifyToken(request);

    const users = await User.find().select('username _id').sort({ username: 1 });
    
    return NextResponse.json(users);
  } catch (error: any) {
    if (error.message.includes('No autorizado') || error.message.includes('Token')) {
      return NextResponse.json({ message: error.message }, { status: 401 });
    }
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
