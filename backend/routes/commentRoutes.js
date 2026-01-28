import express from 'express';
import Comment from '../models/Comment.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/comments/task/:taskId
// @desc    Obtener comentarios de una tarea
// @access  Private
router.get('/task/:taskId', protect, async (req, res) => {
  try {
    const comments = await Comment.find({ taskId: req.params.taskId })
      .populate('userId', 'username')
      .sort({ createdAt: -1 });

    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/comments
// @desc    Crear nuevo comentario
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { taskId, commentText } = req.body;

    if (!taskId || !commentText) {
      return res.status(400).json({ message: 'ID de tarea y comentario requeridos' });
    }

    const comment = await Comment.create({
      taskId,
      userId: req.user._id,
      commentText
    });

    const populatedComment = await Comment.findById(comment._id)
      .populate('userId', 'username');

    res.status(201).json(populatedComment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
