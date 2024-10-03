// controllers/transactionController.js

// Importaciones necesarias para CosmosDB, modelo de transacciones y servicios de notificación
const { getContainer } = require('../db');
const transactionModel = require('../models/transaction');
const emailService = require('../services/emailService');
const smsService = require('../services/smsService');

// Función para obtener la tasa de cambio entre dos monedas (esto es solo un ejemplo)
const getExchangeRate = async (fromCurrency, toCurrency) => {
    return 1; // Este valor debe ser obtenido a través de una API o algún servicio de tasas de cambio
};

// Función para realizar una transferencia de dinero
const makeTransaction = async (req, res) => {
    try {
        const { senderId, receiverId, amount } = req.body;

        if (!senderId || !receiverId || !amount || isNaN(amount)) {
            return res.status(400).json({ success: false, message: 'Campos incompletos o inválidos' });
        }

        const container = await getContainer(); // Obtener el contenedor dentro de la función async

        const sender = await container.item(senderId).read();
        const receiver = await container.item(receiverId).read();

        if (!sender || !receiver) {
            return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
        }

        if (senderId === receiverId) {
            return res.status(400).json({ success: false, message: 'El remitente y el receptor deben ser diferentes.' });
        }

        const exchangeRate = await getExchangeRate(sender.resource.currency, receiver.resource.currency);
        const convertedAmount = amount * exchangeRate;

        if (sender.resource.balance < amount) {
            return res.status(400).json({ success: false, message: 'Saldo insuficiente' });
        }

        const transaction = {
            id: 'some_unique_id',
            entityType: 'Transaction',
            senderId,
            receiverId,
            amount,
            convertedAmount,
            timestamp: new Date().toISOString(),
            status: 'Pendiente'
        };

        await transactionModel.createTransaction(transaction);

        sender.resource.balance -= amount;
        receiver.resource.balance += convertedAmount;

        await container.item(senderId).replace(sender.resource);
        await container.item(receiverId).replace(receiver.resource);

        // Asegurándonos de que las notificaciones se envíen de forma asíncrona
        await Promise.all([
            emailService.sendTransactionEmail(sender.email, 'Transferencia realizada', `Has enviado ${amount} a ${receiver.email}`),
            smsService.sendTransactionSMS(sender.phoneNumber, `Has enviado ${amount} a ${receiver.phoneNumber}`),
            emailService.sendTransactionEmail(receiver.email, 'Transferencia recibida', `Has recibido ${convertedAmount}`),
            smsService.sendTransactionSMS(receiver.phoneNumber, `Has recibido ${convertedAmount}`)
        ]);

        res.status(201).json({ success: true, message: 'Transferencia realizada con éxito' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error al realizar la transferencia' });
    }
};

// Función para obtener el historial de transacciones de un usuario
const getTransactionHistory = async (req, res) => {
    try {
        // Obtener el ID del usuario del token
        const userId = req.userId;

        // Consultar el historial de transacciones en la base de datos
        const transactions = await transactionModel.findTransactionsBySenderId(userId);

        // Responder con el historial de transacciones
        res.status(200).json({ success: true, transactions: transactions });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error al obtener el historial de transacciones' });
    }
};

// Función para leer una transacción específica
const getTransaction = async (req, res) => {
    const transactionId = req.params.id;
    try {
        const container = await getContainer(); // Obtener el contenedor dentro de la función async

        const transaction = await container.item(transactionId).read();
        if (!transaction) {
            return res.status(404).json({ success: false, message: 'Transacción no encontrada' });
        }
        res.status(200).json({ success: true, transaction: transaction.resource });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error al obtener la transacción' });
    }
};

// Función para actualizar una transacción
const updateTransaction = async (req, res) => {
    const transactionId = req.params.id;
    const newDetails = req.body;
    try {
        const container = await getContainer(); // Obtener el contenedor dentro de la función async

        const transaction = await container.item(transactionId).read();
        if (!transaction) {
            return res.status(404).json({ success: false, message: 'Transacción no encontrada' });
        }
        Object.assign(transaction.resource, newDetails);
        await container.item(transactionId).replace(transaction.resource);
        res.status(200).json({ success: true, message: 'Transacción actualizada con éxito' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error al actualizar la transacción' });
    }
};

// Función para eliminar una transacción
const deleteTransaction = async (req, res) => {
    const transactionId = req.params.id;
    try {
        const container = await getContainer(); // Obtener el contenedor dentro de la función async

        await container.item(transactionId).delete();
        res.status(200).json({ success: true, message: 'Transacción eliminada con éxito' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error al eliminar la transacción' });
    }
};

// Exportar las funciones para usarlas en las rutas
module.exports = {
    makeTransaction,
    getTransactionHistory,
    getTransaction,
    updateTransaction,
    deleteTransaction
};

 





