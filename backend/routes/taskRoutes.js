import express from 'express';
import Task from '../models/Task.js';
import History from '../models/History.js';
import Notification from '../models/Notification.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/tasks
// @desc    Obtener todas las tareas
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate('projectId', 'name description')
      .populate('assignedTo', 'username')
      .populate('createdBy', 'username')
      .sort({ createdAt: -1 });
    
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/tasks/:id
// @desc    Obtener una tarea por ID
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('projectId', 'name description')
      .populate('assignedTo', 'username')
      .populate('createdBy', 'username');

    if (!task) {
      return res.status(404).json({ message: 'Tarea no encontrada' });
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/tasks
// @desc    Crear nueva tarea
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const {
      title,
      description,
      status,
      priority,
      projectId,
      assignedTo,
      dueDate,
      estimatedHours
    } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'El título es requerido' });
    }

    const task = await Task.create({
      title,
      description: description || '',
      status: status || 'Pendiente',
      priority: priority || 'Media',
      projectId: projectId || null,
      assignedTo: assignedTo || null,
      dueDate: dueDate || null,
      estimatedHours: estimatedHours || 0,
      actualHours: 0,
      createdBy: req.user._id
    });

    // Crear entrada en historial
    await History.create({
      taskId: task._id,
      userId: req.user._id,
      action: 'CREATED',
      oldValue: '',
      newValue: title
    });

    // Crear notificación si hay asignado
    if (assignedTo) {
      await Notification.create({
        userId: assignedTo,
        message: `Nueva tarea asignada: ${title}`,
        type: 'task_assigned'
      });
    }

    const populatedTask = await Task.findById(task._id)
      .populate('projectId', 'name description')
      .populate('assignedTo', 'username')
      .populate('createdBy', 'username');

    res.status(201).json(populatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/tasks/:id
// @desc    Actualizar tarea
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Tarea no encontrada' });
    }

    const oldTask = { ...task.toObject() };
    const {
      title,
      description,
      status,
      priority,
      projectId,
      assignedTo,
      dueDate,
      estimatedHours
    } = req.body;

    // Actualizar campos
    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (status !== undefined) task.status = status;
    if (priority !== undefined) task.priority = priority;
    if (projectId !== undefined) task.projectId = projectId;
    if (assignedTo !== undefined) task.assignedTo = assignedTo;
    if (dueDate !== undefined) task.dueDate = dueDate;
    if (estimatedHours !== undefined) task.estimatedHours = estimatedHours;

    await task.save();

    // Crear entradas en historial para cambios importantes
    if (oldTask.status !== task.status) {
      await History.create({
        taskId: task._id,
        userId: req.user._id,
        action: 'STATUS_CHANGED',
        oldValue: oldTask.status,
        newValue: task.status
      });
    }

    if (oldTask.title !== task.title) {
      await History.create({
        taskId: task._id,
        userId: req.user._id,
        action: 'TITLE_CHANGED',
        oldValue: oldTask.title,
        newValue: task.title
      });
    }

    // Crear notificación si hay asignado
    if (assignedTo) {
      await Notification.create({
        userId: assignedTo,
        message: `Tarea actualizada: ${task.title}`,
        type: 'task_updated'
      });
    }

    const populatedTask = await Task.findById(task._id)
      .populate('projectId', 'name description')
      .populate('assignedTo', 'username')
      .populate('createdBy', 'username');

    res.json(populatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   DELETE /api/tasks/:id
// @desc    Eliminar tarea
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Tarea no encontrada' });
    }

    // Crear entrada en historial
    await History.create({
      taskId: task._id,
      userId: req.user._id,
      action: 'DELETED',
      oldValue: task.title,
      newValue: ''
    });

    await Task.findByIdAndDelete(req.params.id);

    res.json({ message: 'Tarea eliminada' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
