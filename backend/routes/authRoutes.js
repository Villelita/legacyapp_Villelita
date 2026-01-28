import express from 'express';
import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   POST /api/auth/register
// @desc    Registrar nuevo usuario
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Usuario y contraseña requeridos' });
    }

    // Verificar si el usuario ya existe
    const userExists = await User.findOne({ username });
    if (userExists) {
      return res.status(400).json({ message: 'El usuario ya existe' });
    }

    // Crear usuario
    const user = await User.create({
      username,
      password
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        username: user.username,
        token: generateToken(user._id)
      });
    } else {
      res.status(400).json({ message: 'Error al crear usuario' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/auth/login
// @desc    Autenticar usuario
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Usuario y contraseña requeridos' });
    }

    // Buscar usuario
    const user = await User.findOne({ username });

    if (!user) {
      console.log(`Usuario no encontrado: ${username}`);
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const isPasswordValid = await user.matchPassword(password);
    
    if (isPasswordValid) {
      res.json({
        _id: user._id,
        username: user.username,
        token: generateToken(user._id)
      });
    } else {
      console.log(`Contraseña incorrecta para usuario: ${username}`);
      res.status(401).json({ message: 'Credenciales inválidas' });
    }
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/auth/me
// @desc    Obtener usuario actual
// @access  Private
router.get('/me', protect, async (req, res) => {
  try {
    res.json(req.user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
