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

router.get('/history', getTransactionHistory);

// Nueva ruta para obtener una transacción específica
router.get('/:id', getTransaction);

// Nueva ruta para actualizar una transacción
router.put('/:id', updateTransaction);

// Nueva ruta para eliminar una transacción
router.delete('/:id', deleteTransaction);

module.exports = router;
