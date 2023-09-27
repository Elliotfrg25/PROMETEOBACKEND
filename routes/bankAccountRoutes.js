//routes/bankAccountRoutes.js

const express = require('express');
const {
    linkBankAccount,
    getLinkedAccounts,
    getAccountById,       // Importar la nueva función
    updateAccountById,    // Importar la nueva función
    deleteAccountById,    // Importar la nueva función
    validateBankAccount  // Importar las validaciones
} = require('../controllers/bankAccountController');

const router = express.Router();

// Ruta para vincular una nueva cuenta bancaria
router.post('/link', validateBankAccount, linkBankAccount);

// Ruta para obtener todas las cuentas bancarias vinculadas
router.get('/linked', getLinkedAccounts);

// Ruta para obtener una cuenta bancaria específica por ID
router.get('/linked/:id', getAccountById); // Nueva ruta

// Ruta para actualizar una cuenta bancaria específica por ID
router.put('/linked/:id', updateAccountById); // Nueva ruta

// Ruta para eliminar una cuenta bancaria específica por ID
router.delete('/linked/:id', deleteAccountById); // Nueva ruta

module.exports = router;

