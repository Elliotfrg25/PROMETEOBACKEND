//controllers/currencyControllers.js

require('dotenv').config();

// Importar el cliente de CosmosDB y validaciones
const { getContainer } = require('../db');
const { body, validationResult } = require('express-validator');
const axios = require('axios');

// Función para obtener el contenedor de CosmosDB
const getCosmosContainer = async () => {
    return await getContainer();
};

// Función para obtener la tasa de cambio desde una API externa
const fetchExchangeRate = async (fromCurrency, toCurrency) => {
    try {
        const response = await axios.get(`https://api.exchangerate-api.com/v4/latest/${fromCurrency}?apiKey=${process.env.EXCHANGE_RATE_API_KEY}`);
        return response.data.rates[toCurrency];
    } catch (error) {
        console.error('Error al obtener la tasa de cambio:', error);
        throw new Error('No se pudo obtener la tasa de cambio');
    }
};

// Función para convertir moneda
const convertCurrency = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { fromCurrency, toCurrency, amount } = req.body;
        const exchangeRate = await fetchExchangeRate(fromCurrency, toCurrency);
        const convertedAmount = amount * exchangeRate;
        res.status(200).json({ success: true, convertedAmount });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error al convertir la moneda' });
    }
};

// Función para obtener tasas de cambio actuales
const getCurrentRates = async (req, res) => {
    try {
        const querySpec = {
            query: 'SELECT * FROM c WHERE c.entityType = "ExchangeRate"',
        };
        const container = await getCosmosContainer();  // Obtenemos el contenedor dentro de la función
        const { resources } = await container.items.query(querySpec).fetchAll();
        const currentRates = resources.reduce((acc, rate) => {
            acc[`${rate.fromCurrency}_${rate.toCurrency}`] = rate.rate;
            return acc;
        }, {});
        res.status(200).json({ success: true, currentRates });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error al obtener las tasas de cambio actuales' });
    }
};

// Función para crear una tasa de cambio
const createExchangeRate = async (req, res) => {
    const { fromCurrency, toCurrency, rate } = req.body;
    const exchangeRate = {
        entityType: 'ExchangeRate',
        fromCurrency,
        toCurrency,
        rate
    };
    try {
        const container = await getCosmosContainer();  // Obtenemos el contenedor dentro de la función
        const { resource } = await container.items.create(exchangeRate);
        res.status(201).json({ success: true, exchangeRate: resource });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error al crear la tasa de cambio' });
    }
};

// Función para actualizar una tasa de cambio
const updateExchangeRate = async (req, res) => {
    const { id } = req.params;
    const { rate } = req.body;
    try {
        const container = await getCosmosContainer();  // Obtenemos el contenedor dentro de la función
        const oldResource = await container.item(id).read();
        const newResource = { ...oldResource.resource, rate };
        const { resource } = await container.item(id).replace(newResource);
        res.status(200).json({ success: true, exchangeRate: resource });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error al actualizar la tasa de cambio' });
    }
};

// Función para eliminar una tasa de cambio
const deleteExchangeRate = async (req, res) => {
    const { id } = req.params;
    try {
        const container = await getCosmosContainer();  // Obtenemos el contenedor dentro de la función
        await container.item(id).delete();
        res.status(200).json({ success: true, message: 'Tasa de cambio eliminada exitosamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error al eliminar la tasa de cambio' });
    }
};

// Validaciones para la conversión de moneda
const validateCurrencyConversion = [
    body('fromCurrency').notEmpty().withMessage('La moneda de origen es obligatoria'),
    body('toCurrency').notEmpty().withMessage('La moneda de destino es obligatoria'),
    body('amount').isFloat({ gt: 0 }).withMessage('El monto debe ser un número mayor que cero')
];

// Leer tasa de cambio por ID
const getExchangeRateById = async (req, res) => {
    const { id } = req.params;
    try {
        const container = await getCosmosContainer();  // Obtenemos el contenedor dentro de la función
        const { resource } = await container.item(id).read();
        res.status(200).json(resource);
    } catch (error) {
        res.status(500).json({ error: "Error al leer la tasa de cambio" });
    }
};

// Listar todas las tasas de cambio
const listExchangeRates = async (req, res) => {
    try {
        const container = await getCosmosContainer();  // Obtenemos el contenedor dentro de la función
        const { resources } = await container.items
            .query('SELECT * FROM c WHERE c.entityType = "ExchangeRate"')
            .fetchAll();
        res.status(200).json(resources);
    } catch (error) {
        res.status(500).json({ error: "Error al listar las tasas de cambio" });
    }
};

// Función para actualizar o crear tasas de cambio en la base de datos diariamente
const updateDailyExchangeRates = async () => {
    try {
        const container = await getCosmosContainer();  // Obtenemos el contenedor dentro de la función
        const response = await axios.get(`https://api.exchangerate-api.com/v4/latest/USD?apiKey=${process.env.EXCHANGE_RATE_API_KEY}`);
        const newRates = response.data.rates;

        for (const [currency, rate] of Object.entries(newRates)) {
            try {
                const querySpec = {
                    query: `SELECT * FROM c WHERE c.entityType = "ExchangeRate" AND c.toCurrency = @currency`,
                    parameters: [{ name: '@currency', value: currency }]
                };

                const { resources } = await container.items.query(querySpec).fetchAll();

                if (resources.length > 0) {
                    const id = resources[0].id;
                    const oldResource = await container.item(id).read();
                    const newResource = { ...oldResource.resource, rate };
                    await container.item(id).replace(newResource);
                } else {
                    const exchangeRate = {
                        entityType: 'ExchangeRate',
                        fromCurrency: 'USD',
                        toCurrency: currency,
                        rate
                    };
                    await container.items.create(exchangeRate);
                }
            } catch (innerError) {
                console.error(`Error al manejar la tasa de cambio para la moneda ${currency}:`, innerError);
            }
        }
    } catch (outerError) {
        console.error('Error al actualizar las tasas de cambio:', outerError);
    }
};

// Ejecutar la función una vez al día (86400 segundos son un día)
setInterval(updateDailyExchangeRates, 86400 * 1000);

// Exportar las funciones
module.exports = {
    getExchangeRateById,
    listExchangeRates,
    convertCurrency,
    getCurrentRates,
    createExchangeRate,
    updateExchangeRate,
    deleteExchangeRate,
    validateCurrencyConversion,
    fetchExchangeRate,
    updateDailyExchangeRates
};


 
