import express from 'express';
import Notification from '../models/Notification.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/notifications
// @desc    Obtener notificaciones del usuario actual
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const notifications = await Notification.find({
      userId: req.user._id,
      read: false
    })
      .sort({ createdAt: -1 });

    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/notifications/mark-read
// @desc    Marcar todas las notificaciones como leídas
// @access  Private
router.put('/mark-read', protect, async (req, res) => {
  try {
    await Notification.updateMany(
      { userId: req.user._id, read: false },
      { read: true }
    );

    res.json({ message: 'Notificaciones marcadas como leídas' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
