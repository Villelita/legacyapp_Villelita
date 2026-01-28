import express from 'express';
import History from '../models/History.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/history/task/:taskId
// @desc    Obtener historial de una tarea
// @access  Private
router.get('/task/:taskId', protect, async (req, res) => {
  try {
    const history = await History.find({ taskId: req.params.taskId })
      .populate('userId', 'username')
      .sort({ createdAt: -1 });

    res.json(history);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/history
// @desc    Obtener todo el historial (últimos 100)
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const history = await History.find()
      .populate('userId', 'username')
      .populate('taskId', 'title')
      .sort({ createdAt: -1 })
      .limit(100);

    res.json(history);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
