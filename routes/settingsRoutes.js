//routes/settingsRoutes.js

// Importaciones necesarias
const express = require('express');
const { getSettings, createSettings, updateSettings, deleteSettings, validateSettings } = require('../controllers/settingsController');

const router = express.Router();

/**
 * @swagger
 * /api/settings:
 *   get:
 *     tags:
 *       - Configuraciones
 *     description: Lee las configuraciones del usuario
 *     responses:
 *       '200':
 *         description: Configuraciones obtenidas con éxito
 *       '401':
 *         description: No autorizado
 */

router.get('/', getSettings);  // Leer configuraciones

/**
 * @swagger
 * /api/settings:
 *   post:
 *     tags:
 *       - Configuraciones
 *     description: Crea nuevas configuraciones para el usuario
 *     responses:
 *       '201':
 *         description: Configuraciones creadas con éxito
 *       '400':
 *         description: Datos inválidos o insuficientes
 *       '401':
 *         description: No autorizado
 */
router.post('/', validateSettings, createSettings);  // Crear configuraciones

/**
 * @swagger
 * /api/settings:
 *   put:
 *     tags:
 *       - Configuraciones
 *     description: Actualiza las configuraciones del usuario
 *     responses:
 *       '200':
 *         description: Configuraciones actualizadas con éxito
 *       '400':
 *         description: Datos inválidos o insuficientes
 *       '401':
 *         description: No autorizado
 */
router.put('/', validateSettings, updateSettings);  // Actualizar configuraciones

/**
 * @swagger
 * /api/settings:
 *   delete:
 *     tags:
 *       - Configuraciones
 *     description: Elimina las configuraciones del usuario
 *     responses:
 *       '200':
 *         description: Configuraciones eliminadas con éxito
 *       '401':
 *         description: No autorizado
 */
router.delete('/', deleteSettings);  // Eliminar configuraciones

module.exports = router;


 
