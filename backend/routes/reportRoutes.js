import express from 'express';
import Task from '../models/Task.js';
import Project from '../models/Project.js';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/reports/tasks
// @desc    Reporte de tareas por estado
// @access  Private
router.get('/tasks', protect, async (req, res) => {
  try {
    const tasks = await Task.find();
    const statusCount = {};

    tasks.forEach(task => {
      const status = task.status || 'Pendiente';
      statusCount[status] = (statusCount[status] || 0) + 1;
    });

    res.json(statusCount);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/reports/projects
// @desc    Reporte de proyectos con conteo de tareas
// @access  Private
router.get('/projects', protect, async (req, res) => {
  try {
    const projects = await Project.find();
    const tasks = await Task.find();

    const report = projects.map(project => ({
      name: project.name,
      taskCount: tasks.filter(t => t.projectId && t.projectId.toString() === project._id.toString()).length
    }));

    res.json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/reports/users
// @desc    Reporte de usuarios con tareas asignadas
// @access  Private
router.get('/users', protect, async (req, res) => {
  try {
    const users = await User.find();
    const tasks = await Task.find();

    const report = users.map(user => ({
      username: user.username,
      taskCount: tasks.filter(t => t.assignedTo && t.assignedTo.toString() === user._id.toString()).length
    }));

    res.json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/reports/export
// @desc    Exportar tareas a CSV
// @access  Private
router.get('/export', protect, async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate('projectId', 'name');

    let csv = 'ID,Título,Estado,Prioridad,Proyecto\n';

    tasks.forEach(task => {
      const projectName = task.projectId ? task.projectId.name : 'Sin proyecto';
      csv += `${task._id},"${task.title}","${task.status || 'Pendiente'}","${task.priority || 'Media'}","${projectName}"\n`;
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=export_tasks.csv');
    res.send(csv);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
