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

/**
 * @swagger
 * /api/bank-accounts/link:
 *   post:
 *     tags:
 *       - Cuentas Bancarias Vinculadas
 *     description: Vincula una nueva cuenta bancaria al usuario
 *     responses:
 *       '201':
 *         description: Cuenta bancaria vinculada con éxito
 *       '400':
 *         description: Datos inválidos o insuficientes
 *       '401':
 *         description: No autorizado
 */

// Ruta para vincular una nueva cuenta bancaria
router.post('/link', validateBankAccount, linkBankAccount);

/**
 * @swagger
 * /api/bank-accounts/linked:
 *   get:
 *     tags:
 *       - Cuentas Bancarias Vinculadas
 *     description: Obtiene todas las cuentas bancarias vinculadas del usuario
 *     responses:
 *       '200':
 *         description: Lista de cuentas bancarias vinculadas obtenida con éxito
 *       '401':
 *         description: No autorizado
 */

// Ruta para obtener todas las cuentas bancarias vinculadas
router.get('/linked', getLinkedAccounts);

/**
 * @swagger
 * /api/bank-accounts/linked/{id}:
 *   get:
 *     tags:
 *       - Cuentas Bancarias Vinculadas
 *     description: Obtiene una cuenta bancaria vinculada específica por su ID
 *     parameters:
 *       - name: id
 *         description: ID de la cuenta bancaria vinculada
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       '200':
 *         description: Cuenta bancaria vinculada obtenida con éxito
 *       '401':
 *         description: No autorizado
 */

// Ruta para obtener una cuenta bancaria específica por ID
router.get('/linked/:id', getAccountById); // Nueva ruta

/**
 * @swagger
 * /api/bank-accounts/linked/{id}:
 *   put:
 *     tags:
 *       - Cuentas Bancarias Vinculadas
 *     description: Actualiza una cuenta bancaria vinculada específica por su ID
 *     parameters:
 *       - name: id
 *         description: ID de la cuenta bancaria vinculada
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       '200':
 *         description: Cuenta bancaria vinculada actualizada con éxito
 *       '401':
 *         description: No autorizado
 */

// Ruta para actualizar una cuenta bancaria específica por ID
router.put('/linked/:id', updateAccountById); // Nueva ruta

/**
 * @swagger
 * /api/bank-accounts/linked/{id}:
 *   delete:
 *     tags:
 *       - Cuentas Bancarias Vinculadas
 *     description: Elimina una cuenta bancaria vinculada específica por su ID
 *     parameters:
 *       - name: id
 *         description: ID de la cuenta bancaria vinculada
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       '200':
 *         description: Cuenta bancaria vinculada eliminada con éxito
 *       '401':
 *         description: No autorizado
 */

// Ruta para eliminar una cuenta bancaria específica por ID
router.delete('/linked/:id', deleteAccountById); // Nueva ruta

module.exports = router;


