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

/**
 * @swagger
 * /api/admin/create-user:
 *   post:
 *     tags:
 *       - Admin
 *     description: Crea un nuevo usuario (Solo para administradores)
 *     parameters:
 *       - name: name
 *         description: Nombre del usuario
 *         in: formData
 *         required: true
 *         type: string
 *       - name: email
 *         description: Correo electrónico del usuario
 *         in: formData
 *         required: true
 *         type: string
 *       - name: password
 *         description: Contraseña del usuario
 *         in: formData
 *         required: true
 *         type: string
 *     responses:
 *       '201':
 *         description: Usuario creado con éxito
 *       '400':
 *         description: Datos inválidos o insuficientes
 *       '401':
 *         description: No autorizado
 */

router.post(
    '/create-user',
    requireRole('admin'), // Middleware para verificar el rol de admin
    createUserValidation, // Validaciones
    userController.register // Lógica para crear un nuevo usuario
);

// Aquí puedes añadir más rutas administrativas y validaciones, si lo necesitas.

module.exports = router;



