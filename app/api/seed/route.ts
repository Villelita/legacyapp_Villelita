import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// Conectar a MongoDB
async function connectDB() {
  if (mongoose.connection.readyState === 1) {
    return; // Ya está conectado
  }
  
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI no está configurada');
  }
  
  await mongoose.connect(process.env.MONGODB_URI);
}

// Modelos
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

// Método para comparar passwords
UserSchema.methods.matchPassword = async function(enteredPassword: string) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const ProjectSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, default: '' }
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', UserSchema);
const Project = mongoose.models.Project || mongoose.model('Project', ProjectSchema);

export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    // Conectar a MongoDB
    await connectDB();

    // Crear usuarios
    const usersData = [
      { username: 'admin', password: 'admin' },
      { username: 'user1', password: 'user1' },
      { username: 'user2', password: 'user2' },
      { username: 'manager', password: 'manager123' },
      { username: 'developer', password: 'dev123' }
    ];

    const createdUsers = [];
    for (const userData of usersData) {
      let user = await User.findOne({ username: userData.username });
      if (!user) {
        user = await User.create(userData);
        console.log(`✅ Usuario creado: ${userData.username}`);
      } else {
        console.log(`⚠️  Usuario ya existe: ${userData.username}`);
      }
      createdUsers.push(user);
    }

    // Crear proyectos
    const projectsData = [
      { name: 'Proyecto Demo', description: 'Proyecto de ejemplo' },
      { name: 'Proyecto Alpha', description: 'Proyecto importante' },
      { name: 'Proyecto Beta', description: 'Proyecto secundario' },
      { name: 'Sistema Web', description: 'Desarrollo del sistema web' },
      { name: 'App Móvil', description: 'Aplicación móvil' }
    ];

    const createdProjects = [];
    for (const projectData of projectsData) {
      let project = await Project.findOne({ name: projectData.name });
      if (!project) {
        project = await Project.create(projectData);
        console.log(`✅ Proyecto creado: ${projectData.name}`);
      } else {
        project = await Project.findOne({ name: projectData.name });
        console.log(`⚠️  Proyecto ya existe: ${projectData.name}`);
      }
      createdProjects.push(project);
    }

    return NextResponse.json({
      success: true,
      message: 'Datos iniciales creados exitosamente',
      data: {
        users: createdUsers.length,
        projects: createdProjects.length
      }
    });
  } catch (error: any) {
    console.error('Error al crear datos iniciales:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Error al crear datos iniciales',
        error: error.message
      },
      { status: 500 }
    );
  }
}
