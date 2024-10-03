// Cargar dotenv
require('dotenv').config();
const { CosmosClient } = require('@azure/cosmos');

// Asegurarse de que las variables de entorno están definidas
const endpoint = process.env.COSMOS_DB_ENDPOINT;
const key = process.env.COSMOS_DB_KEY;

console.log('COSMOS_DB_ENDPOINT:', endpoint || 'No definida');
console.log('COSMOS_DB_KEY:', key ? 'Definida' : 'No definida');

// Prueba de inicialización de CosmosClient
try {
    const client = new CosmosClient({ endpoint, key });
    console.log('Cliente de CosmosDB inicializado exitosamente:', client);
} catch (error) {
    console.error('Error al inicializar el cliente de CosmosDB:', error.message);
}
