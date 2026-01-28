import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

// Conectar a MongoDB
async function connectDB() {
  if (mongoose.connection.readyState === 1) {
    return;
  }
  
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    throw new Error('MONGODB_URI no está configurada');
  }
  
  await mongoose.connect(mongoUri);
}

// Schema de Usuario
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true }
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', UserSchema);

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    // Obtener token del header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { message: 'No autorizado, no hay token' },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];
    const secret = process.env.JWT_SECRET || 'fallback_secret_key_minimo_32_caracteres_123456789';

    // Verificar token
    const decoded = jwt.verify(token, secret) as { id: string };
    
    // Obtener usuario
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return NextResponse.json(
        { message: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      _id: user._id.toString(),
      username: user.username
    });
  } catch (error: any) {
    console.error('Error en /me:', error);
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return NextResponse.json(
        { message: 'Token inválido' },
        { status: 401 }
      );
    }
    return NextResponse.json(
      { message: error.message || 'Error en el servidor' },
      { status: 500 }
    );
  }
}
