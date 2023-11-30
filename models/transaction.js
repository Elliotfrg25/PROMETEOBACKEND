// models/transaction.js

// Importar el cliente de CosmosDB
const { CosmosClient } = require('../db');

// Configuración de CosmosDB
const databaseId = process.env.COSMOS_DB_DATABASE_ID || 'ToDoList';
const containerId = process.env.COSMOS_DB_CONTAINER_ID || 'Items';

// Resto de tu configuración
const container = CosmosClient.database(databaseId).container(containerId);


// Método para crear una nueva transacción
exports.createTransaction = async (transaction) => {
    // Añadir el campo entityType para identificar que se trata de una transacción
    transaction.entityType = 'Transaction';
    return await container.items.create(transaction);
};

// Método para buscar transacciones por ID del remitente
exports.findTransactionsBySenderId = async (senderId) => {
    const querySpec = {
        query: 'SELECT * FROM Transactions t WHERE t.senderId = @senderId AND t.entityType = "Transaction"',
        parameters: [{ name: '@senderId', value: senderId }]
    };
    const { resources } = await container.items.query(querySpec).fetchAll();
    return resources;
};

// Método para buscar transacciones por ID del receptor
exports.findTransactionsByReceiverId = async (receiverId) => {
    const querySpec = {
        query: 'SELECT * FROM Transactions t WHERE t.receiverId = @receiverId AND t.entityType = "Transaction"',
        parameters: [{ name: '@receiverId', value: receiverId }]
    };
    const { resources } = await container.items.query(querySpec).fetchAll();
    return resources;
};

// Método para actualizar el estado de una transacción
exports.updateTransactionStatus = async (transactionId, newStatus) => {
    const { resource } = await container.item(transactionId).read();
    if (resource && resource.entityType === "Transaction") {
        resource.status = newStatus;
        return await container.item(transactionId).replace(resource);
    } else {
        return null;
    }
};
