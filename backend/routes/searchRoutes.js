import express from 'express';
import Task from '../models/Task.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   POST /api/search
// @desc    Búsqueda avanzada de tareas
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { text, status, priority, projectId } = req.body;

    // Construir query
    const query = {};

    if (text) {
      query.$or = [
        { title: { $regex: text, $options: 'i' } },
        { description: { $regex: text, $options: 'i' } }
      ];
    }

    if (status) {
      query.status = status;
    }

    if (priority) {
      query.priority = priority;
    }

    if (projectId) {
      query.projectId = projectId;
    }

    const tasks = await Task.find(query)
      .populate('projectId', 'name description')
      .populate('assignedTo', 'username')
      .sort({ createdAt: -1 });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
