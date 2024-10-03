// models/transaction.js

// Importar el cliente de CosmosDB
const { getContainer } = require('../db');

// Método para crear una nueva transacción
exports.createTransaction = async (transaction) => {
    try {
        const container = await getContainer(); // Obtener el contenedor dentro de la función async
        // Añadir el campo entityType para identificar que se trata de una transacción
        transaction.entityType = 'Transaction';
        return await container.items.create(transaction);
    } catch (error) {
        console.error('Error al crear transacción:', error);
        throw new Error('No se pudo crear la transacción');
    }
};

// Método para buscar transacciones por ID del remitente
exports.findTransactionsBySenderId = async (senderId) => {
    try {
        const container = await getContainer(); // Obtener el contenedor dentro de la función async
        const querySpec = {
            query: 'SELECT * FROM Transactions t WHERE t.senderId = @senderId AND t.entityType = "Transaction"',
            parameters: [{ name: '@senderId', value: senderId }]
        };
        const { resources } = await container.items.query(querySpec).fetchAll();
        return resources;
    } catch (error) {
        console.error('Error al buscar transacciones por remitente:', error);
        throw new Error('No se pudo obtener las transacciones');
    }
};

// Método para buscar transacciones por ID del receptor
exports.findTransactionsByReceiverId = async (receiverId) => {
    try {
        const container = await getContainer(); // Obtener el contenedor dentro de la función async
        const querySpec = {
            query: 'SELECT * FROM Transactions t WHERE t.receiverId = @receiverId AND t.entityType = "Transaction"',
            parameters: [{ name: '@receiverId', value: receiverId }]
        };
        const { resources } = await container.items.query(querySpec).fetchAll();
        return resources;
    } catch (error) {
        console.error('Error al buscar transacciones por receptor:', error);
        throw new Error('No se pudo obtener las transacciones');
    }
};

// Método para actualizar el estado de una transacción
exports.updateTransactionStatus = async (transactionId, newStatus) => {
    try {
        const container = await getContainer(); // Obtener el contenedor dentro de la función async
        const { resource } = await container.item(transactionId).read();
        if (resource && resource.entityType === "Transaction") {
            resource.status = newStatus;
            return await container.item(transactionId).replace(resource);
        } else {
            return null;
        }
    } catch (error) {
        console.error('Error al actualizar el estado de la transacción:', error);
        throw new Error('No se pudo actualizar el estado de la transacción');
    }
};
