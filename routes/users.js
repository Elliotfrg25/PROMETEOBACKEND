// routes/users.js

// Importar módulos necesarios
const express = require('express');
const usersController = require('../controllers/users');
const { check } = require('express-validator');
const { verifyToken } = require('../middleware/auth');

// Configuración de la documentación de Swagger para la ruta /register
/**
 * @swagger
 * /api/users/register:
 *  post:
 *    tags:
 *      - Users
 *    description: Registra un nuevo usuario
 *    parameters:
 *      - name: username
 *        description: Nombre de usuario
 *        in: formData
 *        required: true
 *        type: string
 *      - name: email
 *        description: Correo electrónico del usuario
 *        in: formData
 *        required: true
 *        type: string
 *      - name: password
 *        description: Contraseña del usuario
 *        in: formData
 *        required: true
 *        type: string
 *    responses:
 *      '200':
 *        description: Registro exitoso
 *      '400':
 *        description: Error en el registro
 */

// Inicializar el router de Express
const router = express.Router();

// Ruta para registrar un nuevo usuario
router.post(
    '/register',
    [
        // Validaciones del lado del servidor para email, password y username
        check('username').isAlphanumeric().isLength({ min: 5 }).withMessage('El nombre de usuario debe tener al menos 5 caracteres y ser alfanumérico'),
        check('email').isEmail().withMessage('Por favor ingrese un correo electrónico válido'),
        check('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
    ],
    usersController.register  // Controlador para manejar la lógica de registro
);

// Ruta para iniciar sesión
router.post(
    '/login',
    [
        // Validaciones del lado del servidor para email y password
        check('email').isEmail().withMessage('Por favor ingrese un correo electrónico válido'),
        check('password').exists().withMessage('La contraseña es requerida'),
    ],
    usersController.login  // Controlador para manejar la lógica de inicio de sesión
);

// Ruta para obtener el perfil del usuario
router.get('/profile', verifyToken, (req, res, next) => {
    console.log('Ruta de perfil accedida');
    next();
}, usersController.getProfile);

// Exportar el router para usarlo en otros archivos
module.exports = router; 

 

