import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Project from '../models/Project.js';
import Task from '../models/Task.js';
import Comment from '../models/Comment.js';
import History from '../models/History.js';
import Notification from '../models/Notification.js';
import connectDB from '../config/database.js';

dotenv.config();

const seedData = async () => {
  try {
    console.log('🌱 Iniciando creación de colecciones y datos iniciales...\n');
    await connectDB();

    // ============================================
    // 1. CREAR USUARIOS
    // ============================================
    console.log('📝 Creando usuarios...');
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
        console.log(`   ✅ Usuario creado: ${userData.username}`);
      } else {
        console.log(`   ⚠️  Usuario ya existe: ${userData.username}`);
      }
      createdUsers.push(user);
    }

    const adminUser = createdUsers.find(u => u.username === 'admin');
    const user1 = createdUsers.find(u => u.username === 'user1');
    const user2 = createdUsers.find(u => u.username === 'user2');
    const manager = createdUsers.find(u => u.username === 'manager');
    const developer = createdUsers.find(u => u.username === 'developer');

    console.log(`   📊 Total usuarios: ${createdUsers.length}\n`);

    // ============================================
    // 2. CREAR PROYECTOS
    // ============================================
    console.log('📁 Creando proyectos...');
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
        console.log(`   ✅ Proyecto creado: ${projectData.name}`);
      } else {
        project = await Project.findOne({ name: projectData.name });
        console.log(`   ⚠️  Proyecto ya existe: ${projectData.name}`);
      }
      createdProjects.push(project);
    }

    const proyectoDemo = createdProjects.find(p => p.name === 'Proyecto Demo');
    const proyectoAlpha = createdProjects.find(p => p.name === 'Proyecto Alpha');
    const proyectoBeta = createdProjects.find(p => p.name === 'Proyecto Beta');

    console.log(`   📊 Total proyectos: ${createdProjects.length}\n`);

    // ============================================
    // 3. CREAR TAREAS
    // ============================================
    console.log('✅ Creando tareas...');
    const tasksData = [
      {
        title: 'Configurar base de datos',
        description: 'Configurar MongoDB y crear las colecciones necesarias',
        status: 'Completada',
        priority: 'Alta',
        projectId: proyectoDemo._id,
        assignedTo: adminUser._id,
        dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 días atrás
        estimatedHours: 4,
        actualHours: 3.5,
        createdBy: adminUser._id
      },
      {
        title: 'Implementar autenticación',
        description: 'Crear sistema de login y registro de usuarios',
        status: 'En Progreso',
        priority: 'Crítica',
        projectId: proyectoAlpha._id,
        assignedTo: developer._id,
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 días adelante
        estimatedHours: 8,
        actualHours: 4,
        createdBy: manager._id
      },
      {
        title: 'Diseñar interfaz de usuario',
        description: 'Crear mockups y diseño de la interfaz principal',
        status: 'Pendiente',
        priority: 'Media',
        projectId: proyectoAlpha._id,
        assignedTo: user1._id,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 días adelante
        estimatedHours: 12,
        actualHours: 0,
        createdBy: manager._id
      },
      {
        title: 'Escribir documentación',
        description: 'Documentar la API y los endpoints disponibles',
        status: 'Pendiente',
        priority: 'Baja',
        projectId: proyectoBeta._id,
        assignedTo: user2._id,
        dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 días adelante
        estimatedHours: 6,
        actualHours: 0,
        createdBy: adminUser._id
      },
      {
        title: 'Revisar código',
        description: 'Realizar code review del código existente',
        status: 'En Progreso',
        priority: 'Alta',
        projectId: proyectoDemo._id,
        assignedTo: manager._id,
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 días adelante
        estimatedHours: 4,
        actualHours: 2,
        createdBy: adminUser._id
      },
      {
        title: 'Optimizar consultas',
        description: 'Mejorar el rendimiento de las consultas a la base de datos',
        status: 'Pendiente',
        priority: 'Media',
        projectId: proyectoAlpha._id,
        assignedTo: developer._id,
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 días adelante
        estimatedHours: 10,
        actualHours: 0,
        createdBy: manager._id
      },
      {
        title: 'Implementar tests',
        description: 'Crear tests unitarios y de integración',
        status: 'Pendiente',
        priority: 'Media',
        projectId: proyectoBeta._id,
        assignedTo: developer._id,
        dueDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000), // 6 días adelante
        estimatedHours: 16,
        actualHours: 0,
        createdBy: manager._id
      }
    ];

    const createdTasks = [];
    for (const taskData of tasksData) {
      const task = await Task.create(taskData);
      createdTasks.push(task);
      console.log(`   ✅ Tarea creada: ${taskData.title}`);
    }

    console.log(`   📊 Total tareas: ${createdTasks.length}\n`);

    // ============================================
    // 4. CREAR COMENTARIOS
    // ============================================
    console.log('💬 Creando comentarios...');
    const commentsData = [
      {
        taskId: createdTasks[0]._id,
        userId: adminUser._id,
        commentText: 'Excelente trabajo en la configuración de la base de datos. Todo funcionando correctamente.'
      },
      {
        taskId: createdTasks[0]._id,
        userId: developer._id,
        commentText: 'Gracias! La conexión está estable y funcionando bien.'
      },
      {
        taskId: createdTasks[1]._id,
        userId: manager._id,
        commentText: 'Recuerda usar JWT para la autenticación. Es importante para la seguridad.'
      },
      {
        taskId: createdTasks[1]._id,
        userId: developer._id,
        commentText: 'Entendido, ya implementé el sistema de tokens JWT.'
      },
      {
        taskId: createdTasks[2]._id,
        userId: user1._id,
        commentText: 'Necesito más información sobre los requisitos del diseño.'
      },
      {
        taskId: createdTasks[4]._id,
        userId: manager._id,
        commentText: 'El código está bien estructurado, solo faltan algunos ajustes menores.'
      }
    ];

    for (const commentData of commentsData) {
      await Comment.create(commentData);
      console.log(`   ✅ Comentario creado en tarea: ${commentData.commentText.substring(0, 30)}...`);
    }

    console.log(`   📊 Total comentarios: ${commentsData.length}\n`);

    // ============================================
    // 5. CREAR HISTORIAL
    // ============================================
    console.log('📜 Creando historial de cambios...');
    const historyData = [
      {
        taskId: createdTasks[0]._id,
        userId: adminUser._id,
        action: 'Estado cambiado',
        oldValue: 'Pendiente',
        newValue: 'Completada'
      },
      {
        taskId: createdTasks[0]._id,
        userId: adminUser._id,
        action: 'Horas actualizadas',
        oldValue: '4',
        newValue: '3.5'
      },
      {
        taskId: createdTasks[1]._id,
        userId: developer._id,
        action: 'Estado cambiado',
        oldValue: 'Pendiente',
        newValue: 'En Progreso'
      },
      {
        taskId: createdTasks[1]._id,
        userId: developer._id,
        action: 'Horas actualizadas',
        oldValue: '0',
        newValue: '4'
      },
      {
        taskId: createdTasks[4]._id,
        userId: manager._id,
        action: 'Estado cambiado',
        oldValue: 'Pendiente',
        newValue: 'En Progreso'
      },
      {
        taskId: createdTasks[4]._id,
        userId: manager._id,
        action: 'Prioridad cambiada',
        oldValue: 'Media',
        newValue: 'Alta'
      }
    ];

    for (const historyItem of historyData) {
      await History.create(historyItem);
      console.log(`   ✅ Historial creado: ${historyItem.action}`);
    }

    console.log(`   📊 Total registros de historial: ${historyData.length}\n`);

    // ============================================
    // 6. CREAR NOTIFICACIONES
    // ============================================
    console.log('🔔 Creando notificaciones...');
    const notificationsData = [
      {
        userId: adminUser._id,
        message: 'Nueva tarea asignada: Configurar base de datos',
        type: 'task_assigned',
        read: true
      },
      {
        userId: developer._id,
        message: 'Tarea completada: Configurar base de datos',
        type: 'task_completed',
        read: false
      },
      {
        userId: manager._id,
        message: 'Nueva tarea creada: Implementar autenticación',
        type: 'task_created',
        read: false
      },
      {
        userId: user1._id,
        message: 'Tienes una nueva tarea asignada: Diseñar interfaz de usuario',
        type: 'task_assigned',
        read: false
      },
      {
        userId: user2._id,
        message: 'Nuevo comentario en: Escribir documentación',
        type: 'comment_added',
        read: false
      },
      {
        userId: developer._id,
        message: 'Tarea actualizada: Implementar autenticación',
        type: 'task_updated',
        read: false
      }
    ];

    for (const notificationData of notificationsData) {
      await Notification.create(notificationData);
      console.log(`   ✅ Notificación creada: ${notificationData.message.substring(0, 40)}...`);
    }

    console.log(`   📊 Total notificaciones: ${notificationsData.length}\n`);

    // ============================================
    // RESUMEN FINAL
    // ============================================
    console.log('═══════════════════════════════════════════════════════');
    console.log('✅ ¡Datos iniciales creados exitosamente!');
    console.log('═══════════════════════════════════════════════════════');
    console.log('\n📊 Resumen de colecciones creadas:');
    console.log(`   👥 Usuarios: ${createdUsers.length}`);
    console.log(`   📁 Proyectos: ${createdProjects.length}`);
    console.log(`   ✅ Tareas: ${createdTasks.length}`);
    console.log(`   💬 Comentarios: ${commentsData.length}`);
    console.log(`   📜 Historial: ${historyData.length}`);
    console.log(`   🔔 Notificaciones: ${notificationsData.length}`);
    console.log('\n🔑 Credenciales de acceso:');
    console.log('   Usuario: admin / Contraseña: admin');
    console.log('   Usuario: user1 / Contraseña: user1');
    console.log('   Usuario: user2 / Contraseña: user2');
    console.log('   Usuario: manager / Contraseña: manager123');
    console.log('   Usuario: developer / Contraseña: dev123');
    console.log('\n🎉 ¡Base de datos lista para usar!\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error al crear datos iniciales:', error);
    process.exit(1);
  }
};

seedData();
