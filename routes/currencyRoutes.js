//routes/currencyRoutes.js

const express = require('express');
const {
    convertCurrency,
    validateCurrencyConversion, // Importar las validaciones
    createExchangeRate, // Nueva función importada
    updateExchangeRate, // Nueva función importada
    deleteExchangeRate // Nueva función importada
} = require('../controllers/currencyController');

const router = express.Router();

/**
 * @swagger
 * /api/currency/convert:
 *   post:
 *     tags:
 *       - Conversión de Moneda
 *     description: Convierte una cantidad de una moneda a otra
 *     responses:
 *       '200':
 *         description: Conversión realizada con éxito
 *       '400':
 *         description: Datos inválidos o insuficientes
 *       '401':
 *         description: No autorizado
 */

// Ruta original para la conversión de moneda, añadiendo validaciones antes de llamar al controlador
router.post('/convert', validateCurrencyConversion, convertCurrency);

/**
 * @swagger
 * /api/currency/create-rate:
 *   post:
 *     tags:
 *       - Tasas de Cambio
 *     description: Crea una nueva tasa de cambio
 *     responses:
 *       '201':
 *         description: Tasa de cambio creada con éxito
 *       '400':
 *         description: Datos inválidos o insuficientes
 *       '401':
 *         description: No autorizado
 */

// Nueva ruta para crear una tasa de cambio
router.post('/create-rate', createExchangeRate);

/**
 * @swagger
 * /api/currency/update-rate/{id}:
 *   put:
 *     tags:
 *       - Tasas de Cambio
 *     description: Actualiza una tasa de cambio existente
 *     parameters:
 *       - name: id
 *         description: ID de la tasa de cambio
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       '200':
 *         description: Tasa de cambio actualizada con éxito
 *       '400':
 *         description: Datos inválidos o insuficientes
 *       '401':
 *         description: No autorizado
 */

// Nueva ruta para actualizar una tasa de cambio
router.put('/update-rate/:id', updateExchangeRate);

/**
 * @swagger
 * /api/currency/delete-rate/{id}:
 *   delete:
 *     tags:
 *       - Tasas de Cambio
 *     description: Elimina una tasa de cambio existente
 *     parameters:
 *       - name: id
 *         description: ID de la tasa de cambio
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       '200':
 *         description: Tasa de cambio eliminada con éxito
 *       '401':
 *         description: No autorizado
 */

// Nueva ruta para eliminar una tasa de cambio
router.delete('/delete-rate/:id', deleteExchangeRate);

// Exportar el router
module.exports = router;

