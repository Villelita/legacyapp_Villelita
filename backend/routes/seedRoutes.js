import express from 'express';
import User from '../models/User.js';
import Project from '../models/Project.js';
import Task from '../models/Task.js';
import Comment from '../models/Comment.js';
import History from '../models/History.js';
import Notification from '../models/Notification.js';

const router = express.Router();

// @route   POST /api/seed/init
// @desc    Inicializar datos en la base de datos (solo para primera vez)
// @access  Public (deberías proteger esto en producción)
router.post('/init', async (req, res) => {
  try {
    console.log('🌱 Iniciando creación de datos iniciales...');

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

    const adminUser = createdUsers.find(u => u.username === 'admin');
    const user1 = createdUsers.find(u => u.username === 'user1');
    const user2 = createdUsers.find(u => u.username === 'user2');
    const manager = createdUsers.find(u => u.username === 'manager');
    const developer = createdUsers.find(u => u.username === 'developer');

    // Crear proyectos
    const projectsData = [
      { name: 'Proyecto Demo', description: 'Proyecto de ejemplo para demostración' },
      { name: 'Proyecto Alpha', description: 'Proyecto importante con alta prioridad' },
      { name: 'Proyecto Beta', description: 'Proyecto secundario en desarrollo' },
      { name: 'Sistema Web', description: 'Desarrollo del sistema web principal' },
      { name: 'App Móvil', description: 'Aplicación móvil para iOS y Android' }
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

    const proyectoDemo = createdProjects.find(p => p.name === 'Proyecto Demo');
    const proyectoAlpha = createdProjects.find(p => p.name === 'Proyecto Alpha');
    const proyectoBeta = createdProjects.find(p => p.name === 'Proyecto Beta');

    // Crear tareas de ejemplo
    const tasksData = [
      {
        title: 'Configurar base de datos',
        description: 'Configurar MongoDB y crear las colecciones necesarias',
        status: 'Completada',
        priority: 'Alta',
        projectId: proyectoDemo?._id,
        assignedTo: adminUser?._id,
        dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        estimatedHours: 4,
        actualHours: 3.5,
        createdBy: adminUser?._id
      },
      {
        title: 'Implementar autenticación',
        description: 'Crear sistema de login y registro de usuarios',
        status: 'En Progreso',
        priority: 'Crítica',
        projectId: proyectoAlpha?._id,
        assignedTo: developer?._id,
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        estimatedHours: 8,
        actualHours: 4,
        createdBy: manager?._id
      }
    ];

    const createdTasks = [];
    for (const taskData of tasksData) {
      if (taskData.createdBy) {
        const task = await Task.create(taskData);
        createdTasks.push(task);
        console.log(`✅ Tarea creada: ${taskData.title}`);
      }
    }

    res.json({
      success: true,
      message: 'Datos iniciales creados exitosamente',
      data: {
        users: createdUsers.length,
        projects: createdProjects.length,
        tasks: createdTasks.length
      }
    });
  } catch (error) {
    console.error('Error al crear datos iniciales:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear datos iniciales',
      error: error.message
    });
  }
});

export default router;
