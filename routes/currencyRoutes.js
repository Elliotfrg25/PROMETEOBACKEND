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

// Ruta original para la conversión de moneda, añadiendo validaciones antes de llamar al controlador
router.post('/convert', validateCurrencyConversion, convertCurrency);

// Nueva ruta para crear una tasa de cambio
router.post('/create-rate', createExchangeRate);

// Nueva ruta para actualizar una tasa de cambio
router.put('/update-rate/:id', updateExchangeRate);

// Nueva ruta para eliminar una tasa de cambio
router.delete('/delete-rate/:id', deleteExchangeRate);

// Exportar el router
module.exports = router;


