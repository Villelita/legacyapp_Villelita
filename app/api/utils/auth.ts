import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

// Conectar a MongoDB
export async function connectDB() {
  if (mongoose.connection.readyState === 1) {
    return;
  }
  
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    throw new Error('MONGODB_URI no está configurada');
  }
  
  await mongoose.connect(mongoUri);
}

// Verificar token y obtener usuario
export async function verifyToken(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('No autorizado, no hay token');
  }

  const token = authHeader.split(' ')[1];
  const secret = process.env.JWT_SECRET || 'fallback_secret_key_minimo_32_caracteres_123456789';

  try {
    const decoded = jwt.verify(token, secret) as { id: string };
    return decoded.id;
  } catch (error) {
    throw new Error('Token inválido');
  }
}

// Schemas compartidos
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true }
}, { timestamps: true });

const ProjectSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, default: '' }
}, { timestamps: true });

const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  status: {
    type: String,
    enum: ['Pendiente', 'En Progreso', 'Completada', 'Bloqueada', 'Cancelada'],
    default: 'Pendiente'
  },
  priority: {
    type: String,
    enum: ['Baja', 'Media', 'Alta', 'Crítica'],
    default: 'Media'
  },
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    default: null
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  dueDate: { type: Date, default: null },
  estimatedHours: { type: Number, default: 0 },
  actualHours: { type: Number, default: 0 },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

const CommentSchema = new mongoose.Schema({
  taskId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  commentText: {
    type: String,
    required: true
  }
}, { timestamps: true });

const HistorySchema = new mongoose.Schema({
  taskId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  action: {
    type: String,
    required: true
  },
  oldValue: {
    type: String,
    default: ''
  },
  newValue: {
    type: String,
    default: ''
  }
}, { timestamps: true });

const NotificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  read: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

export const User = mongoose.models.User || mongoose.model('User', UserSchema);
export const Project = mongoose.models.Project || mongoose.model('Project', ProjectSchema);
export const Task = mongoose.models.Task || mongoose.model('Task', TaskSchema);
export const Comment = mongoose.models.Comment || mongoose.model('Comment', CommentSchema);
export const History = mongoose.models.History || mongoose.model('History', HistorySchema);
export const Notification = mongoose.models.Notification || mongoose.model('Notification', NotificationSchema);
