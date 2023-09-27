//routes/settingsRoutes.js

// Importaciones necesarias
const express = require('express');
const { getSettings, createSettings, updateSettings, deleteSettings, validateSettings } = require('../controllers/settingsController');

const router = express.Router();

router.get('/', getSettings);  // Leer configuraciones
router.post('/', validateSettings, createSettings);  // Crear configuraciones
router.put('/', validateSettings, updateSettings);  // Actualizar configuraciones
router.delete('/', deleteSettings);  // Eliminar configuraciones

module.exports = router;


 
