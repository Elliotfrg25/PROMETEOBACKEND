//routes/transactionRoutes.js

const express = require('express');
const { check } = require('express-validator'); // Importar express-validator
const {
    makeTransaction,
    getTransaction,
    updateTransaction,
    deleteTransaction,
    getTransactionHistory,
} = require('../controllers/transactionController');

const router = express.Router();

/**
 * @swagger
 * /api/transactions/transfer:
 *   post:
 *     tags:
 *       - Transacciones
 *     description: Realiza una transferencia de dinero entre usuarios
 *     parameters:
 *       - name: senderId
 *         description: ID del usuario que envía el dinero
 *         in: formData
 *         required: true
 *         type: string
 *       - name: receiverId
 *         description: ID del usuario que recibe el dinero
 *         in: formData
 *         required: true
 *         type: string
 *       - name: amount
 *         description: Cantidad de dinero a transferir
 *         in: formData
 *         required: true
 *         type: number
 *     responses:
 *       '200':
 *         description: Transferencia realizada con éxito
 *       '400':
 *         description: Datos inválidos o insuficientes
 *       '401':
 *         description: No autorizado
 */

// Agregar validaciones
router.post(
    '/transfer',
    [
        check('senderId').isUUID().withMessage('El ID del remitente debe ser un UUID válido'),
        check('receiverId').isUUID().withMessage('El ID del receptor debe ser un UUID válido'),
        check('amount').isFloat({ gt: 0 }).withMessage('La cantidad debe ser un número positivo'),
    ],
    makeTransaction
);

/**
 * @swagger
 * /api/transactions/history:
 *   get:
 *     tags:
 *       - Transacciones
 *     description: Obtiene el historial de transacciones del usuario
 *     responses:
 *       '200':
 *         description: Historial obtenido con éxito
 *       '401':
 *         description: No autorizado
 */
router.get('/history', getTransactionHistory);

/**
 * @swagger
 * /api/transactions/{id}:
 *   get:
 *     tags:
 *       - Transacciones
 *     description: Obtiene una transacción específica usando su ID
 *     parameters:
 *       - name: id
 *         description: ID de la transacción
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       '200':
 *         description: Transacción obtenida con éxito
 *       '404':
 *         description: Transacción no encontrada
 *       '401':
 *         description: No autorizado
 */
// Nueva ruta para obtener una transacción específica
router.get('/:id', getTransaction);

/**
 * @swagger
 * /api/transactions/{id}:
 *   put:
 *     tags:
 *       - Transacciones
 *     description: Actualiza una transacción existente usando su ID
 *     parameters:
 *       - name: id
 *         description: ID de la transacción
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       '200':
 *         description: Transacción actualizada con éxito
 *       '404':
 *         description: Transacción no encontrada
 *       '401':
 *         description: No autorizado
 */

// Nueva ruta para actualizar una transacción
router.put('/:id', updateTransaction);

/**
 * @swagger
 * /api/transactions/{id}:
 *   delete:
 *     tags:
 *       - Transacciones
 *     description: Elimina una transacción existente usando su ID
 *     parameters:
 *       - name: id
 *         description: ID de la transacción
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       '200':
 *         description: Transacción eliminada con éxito
 *       '404':
 *         description: Transacción no encontrada
 *       '401':
 *         description: No autorizado
 */

// Nueva ruta para eliminar una transacción
router.delete('/:id', deleteTransaction);

module.exports = router;