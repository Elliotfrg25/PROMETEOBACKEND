//settingsController.js

// Importaciones necesarias
const { CosmosClient } = require('../db');
const { validationResult, check } = require('express-validator');

// Configuración de CosmosDB
const databaseId = 'ToDoList';
const containerId = 'Items';
const container = CosmosClient.database(databaseId).container(containerId);

// Validaciones para los campos de configuración
const validateSettings = [
    check('settings.defaultCurrency').isIn(['USD', 'EUR', 'GBP', 'COP']).withMessage('Moneda no soportada'),
    check('settings.language').isIn(['en', 'es']).withMessage('Idioma no soportado'),
    check('settings.notifications.transaction').isBoolean().withMessage('Debe ser un valor booleano'),
    check('settings.notifications.weeklyReport').isBoolean().withMessage('Debe ser un valor booleano'),
    check('settings.privacy.profileVisibility').isIn(['everyone', 'onlyMe']).withMessage('Visibilidad de perfil no válida'),
    check('settings.privacy.activityVisibility').isIn(['everyone', 'onlyMe']).withMessage('Visibilidad de actividad no válida')
];

// Función para obtener las configuraciones del usuario
const getSettings = async (req, res) => {
    // Obtener el ID del usuario desde el request (asumo que se guarda en req.userId)
    const userId = req.userId;

    // Crear la consulta para CosmosDB
    const querySpec = {
        query: 'SELECT * FROM Usuarios u WHERE u.id = @id',
        parameters: [{ name: '@id', value: userId }],
    };

    // Ejecutar la consulta
    const { resources } = await container.items.query(querySpec).fetchAll();

    // Obtener el primer usuario que coincida (debería ser único)
    const user = resources[0];

    // Verificar si el usuario existe
    if (!user) {
        return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    }

    // Devolver las configuraciones del usuario
    // Si no hay configuraciones almacenadas, se devuelve un objeto vacío {}
    res.status(200).json({ success: true, settings: user.settings || {} });
};


// Función para actualizar las configuraciones del usuario
const updateSettings = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const userId = req.userId;
        const newSettings = req.body;

        const querySpec = {
            query: 'SELECT * FROM Usuarios u WHERE u.id = @id',
            parameters: [{ name: '@id', value: userId }],
        };
        const { resources } = await container.items.query(querySpec).fetchAll();
        const user = resources[0];

        if (!user) {
            return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
        }

        user.settings = newSettings;

        const { resource } = await container.item(user.id).replace(user);

        res.status(200).json({ success: true, message: 'Configuraciones actualizadas con éxito' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error al actualizar las configuraciones' });
    }
};

// Nueva función para crear configuraciones para un nuevo usuario
const createSettings = async (req, res) => {
    const newSettings = req.body;
    const userId = req.userId;
    try {
        const user = {
            id: userId,
            settings: newSettings
        };
        const { resource } = await container.items.create(user);
        res.status(201).json({ success: true, settings: resource.settings });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error al crear las configuraciones' });
    }
};

// Nueva función para eliminar configuraciones del usuario
const deleteSettings = async (req, res) => {
    const userId = req.userId;
    try {
        await container.item(userId).delete();
        res.status(200).json({ success: true, message: 'Configuraciones eliminadas con éxito' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error al eliminar las configuraciones' });
    }
};

// Exportar las funciones y validaciones
module.exports = {
    getSettings,
    createSettings,
    updateSettings,
    deleteSettings,
    validateSettings
};
 

