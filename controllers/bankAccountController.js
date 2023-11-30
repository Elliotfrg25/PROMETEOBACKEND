//controllers/banckAccountControllers.js

// Importaciones necesarias
const { CosmosClient } = require('../db');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');

// Configuración de CosmosDB
const databaseId = 'ToDoList';
const containerId = 'Items';
const container = CosmosClient.database(databaseId).container(containerId);

// Función para vincular una nueva cuenta bancaria (Crear)
const linkBankAccount = async (req, res) => {
    console.log("Iniciando linkBankAccount");
    console.log("Request Body: ", req.body);

    const errors = validationResult(req);
    console.log("Validation Errors: ", errors.array());

    if (!errors.isEmpty()) {
        console.log("Datos inválidos", errors.array());
        return res.status(422).json({ errors: errors.array() }); // 422 Unprocessable Entity
    }

    // Ajusta estos números según tus necesidades
    if (!req.body.bankName || req.body.accountNumber.length < 10 || req.body.accountNumber.length > 13) {
        console.log("Datos inválidos: Verificación adicional");
        return res.status(409).json({ errors: "Datos inválidos en la verificación adicional" }); // 400 Bad Request
    }

    // Asegúrate de que req.user._id está disponible y es válido
    if (!req.user || !req.user._id) {
        console.log("Usuario no identificado");
        return res.status(401).json({ errors: "Usuario no identificado" }); // 401 Unauthorized
    }

    const newBankAccount = {
        id: req.body.accountNumber,
        bankName: req.body.bankName,
        accountNumber: req.body.accountNumber,
        userId: req.user._id
    };

    try {
        const { resource } = await container.items.create(newBankAccount);
        console.log("Cuenta bancaria vinculada con éxito");
        res.status(201).send('Cuenta bancaria vinculada con éxito.');
    } catch (error) {
        console.error("Error al vincular la cuenta bancaria:", error);
        if (error.code === 409) {
            res.status(409).send('La cuenta bancaria ya existe.');
        } else {
            res.status(500).send('Error al vincular la cuenta bancaria.');
        }
    }
};



// Función para obtener todas las cuentas bancarias vinculadas (Leer todas)
const getLinkedAccounts = async (req, res) => {
    const userId = req.user._id;
    const querySpec = {
        query: 'SELECT * FROM Accounts a WHERE a.userId = @userId',
        parameters: [{ name: '@userId', value: userId }]
    };

    try {
        const { resources } = await container.items.query(querySpec).fetchAll();
        res.status(200).json(resources);
    } catch (error) {
        res.status(500).send('Error al obtener las cuentas vinculadas.');
    }
};

// Función para obtener una cuenta bancaria específica por ID (Leer una)
const getAccountById = async (req, res) => {
    const id = req.params.id;
    const { resource } = await container.item(id).read();
    if (resource) {
        res.status(200).json({ success: true, bankAccount: resource });
    } else {
        res.status(404).json({ success: false, message: 'Cuenta no encontrada' });
    }
};

// Función para actualizar una cuenta bancaria específica por ID (Actualizar)
const updateAccountById = async (req, res) => {
    const id = req.params.id;
    const { bankName, accountNumber } = req.body;

    const { resource } = await container.item(id).read();
    if (resource) {
        resource.bankName = bankName;
        resource.accountNumber = accountNumber;
        await container.item(id).replace(resource);
        res.status(200).json({ success: true, message: 'Cuenta actualizada' });
    } else {
        res.status(404).json({ success: false, message: 'Cuenta no encontrada' });
    }
};

// Función para eliminar una cuenta bancaria específica por ID (Eliminar)
const deleteAccountById = async (req, res) => {
    const id = req.params.id;
    const { resource } = await container.item(id).delete();
    if (resource) {
        res.status(200).json({ success: true, message: 'Cuenta eliminada' });
    } else {
        res.status(404).json({ success: false, message: 'Cuenta no encontrada' });
    }
};

// Validaciones para el nombre del banco y el número de cuenta
const validateBankAccount = [
    body('bankName').notEmpty().withMessage('El nombre del banco es obligatorio'),
    body('accountNumber').isLength({ min: 10, max: 12 }).withMessage('El número de cuenta debe tener entre 10 y 12 dígitos')
];

// Exportar las funciones y validaciones
module.exports = {
    linkBankAccount,
    getLinkedAccounts,
    getAccountById,       // Nueva función
    updateAccountById,    // Nueva función
    deleteAccountById,    // Nueva función
    validateBankAccount   // Validaciones exportadas para uso en rutas
}; 

// También validar contra una lista blanca de bancos
// const allowedBanks = ['Bank1', 'Bank2', 'Bank3'];
// if (!allowedBanks.includes(bankName)) {
//     return res.status(400).json({ success: false, message: 'Banco no permitido.' });
// }
