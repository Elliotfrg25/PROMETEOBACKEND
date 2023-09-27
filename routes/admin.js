// routes/admin.js

const express = require('express');
const { body } = require('express-validator');
const { requireRole } = require('../middleware/authorization');
const userController = require('../controllers/users'); // Importamos el controlador de usuarios

const router = express.Router();

// Reglas de validación para crear usuarios
const createUserValidation = [
    body('name')
        .isLength({ min: 3 })
        .withMessage('El nombre debe tener al menos 3 caracteres'),
    body('email')
        .isEmail()
        .withMessage('Correo electrónico no válido'),
    body('password')
        .isLength({ min: 8 })
        .withMessage('La contraseña debe tener al menos 8 caracteres')
];

router.post(
    '/create-user',
    requireRole('admin'), // Middleware para verificar el rol de admin
    createUserValidation, // Validaciones
    userController.register // Lógica para crear un nuevo usuario
);

// Aquí puedes añadir más rutas administrativas y validaciones, si lo necesitas.

module.exports = router;


