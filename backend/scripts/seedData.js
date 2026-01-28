import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Project from '../models/Project.js';
import connectDB from '../config/database.js';

dotenv.config();

const seedData = async () => {
  try {
    await connectDB();

    // Limpiar datos existentes (opcional)
    // await User.deleteMany({});
    // await Project.deleteMany({});

    // Crear usuarios por defecto
    const users = [
      { username: 'admin', password: 'admin' },
      { username: 'user1', password: 'user1' },
      { username: 'user2', password: 'user2' }
    ];

    for (const userData of users) {
      const existingUser = await User.findOne({ username: userData.username });
      if (!existingUser) {
        await User.create(userData);
        console.log(`Usuario creado: ${userData.username}`);
      } else {
        console.log(`Usuario ya existe: ${userData.username}`);
      }
    }

    // Crear proyectos por defecto
    const projects = [
      { name: 'Proyecto Demo', description: 'Proyecto de ejemplo' },
      { name: 'Proyecto Alpha', description: 'Proyecto importante' },
      { name: 'Proyecto Beta', description: 'Proyecto secundario' }
    ];

    for (const projectData of projects) {
      const existingProject = await Project.findOne({ name: projectData.name });
      if (!existingProject) {
        await Project.create(projectData);
        console.log(`Proyecto creado: ${projectData.name}`);
      } else {
        console.log(`Proyecto ya existe: ${projectData.name}`);
      }
    }

    console.log('Datos iniciales creados exitosamente');
    process.exit(0);
  } catch (error) {
    console.error('Error al crear datos iniciales:', error);
    process.exit(1);
  }
};

seedData();
