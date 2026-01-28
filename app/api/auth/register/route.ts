import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
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

UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);

// Generar token JWT
function generateToken(id: string) {
  const secret = process.env.JWT_SECRET || 'fallback_secret_key_minimo_32_caracteres_123456789';
  return jwt.sign({ id }, secret, {
    expiresIn: '30d'
  });
}

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { message: 'Usuario y contraseña requeridos' },
        { status: 400 }
      );
    }

    // Verificar si el usuario ya existe
    const userExists = await User.findOne({ username });
    if (userExists) {
      return NextResponse.json(
        { message: 'El usuario ya existe' },
        { status: 400 }
      );
    }

    // Crear usuario
    const user = await User.create({
      username,
      password
    });

    if (user) {
      const token = generateToken(user._id.toString());
      return NextResponse.json({
        _id: user._id.toString(),
        username: user.username,
        token
      }, { status: 201 });
    } else {
      return NextResponse.json(
        { message: 'Error al crear usuario' },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error('Error en registro:', error);
    return NextResponse.json(
      { message: error.message || 'Error en el servidor' },
      { status: 500 }
    );
  }
}
