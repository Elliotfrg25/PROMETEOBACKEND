// Importar el módulo dotenv para gestionar variables de entorno.
require('dotenv').config();

// Leer las variables de entorno para la conexión a CosmosDB.
const endpoint = process.env.COSMOS_DB_ENDPOINT;
const key = process.env.COSMOS_DB_KEY;
const databaseId = process.env.COSMOS_DB_DATABASE_ID;
const containerId = process.env.COSMOS_DB_CONTAINER_ID;

// Verificación adicional para ver las variables de entorno en los logs
console.log('COSMOS_DB_ENDPOINT:', endpoint || 'No definida');
console.log('COSMOS_DB_KEY:', key ? 'Definida' : 'No definida');
console.log('COSMOS_DB_DATABASE_ID:', databaseId || 'No definida');
console.log('COSMOS_DB_CONTAINER_ID:', containerId || 'No definida');

// Importar el cliente CosmosDB de la biblioteca de Azure.
const { CosmosClient } = require('@azure/cosmos');

// Verificar si CosmosClient se ha importado correctamente
console.log('CosmosClient:', CosmosClient);

// Inicialización del cliente de CosmosDB (inicializado como null inicialmente).
let client = null;  // Se inicializa a null para evitar errores

// Función para inicializar CosmosClient
async function initializeCosmosClient() {
    try {
        if (!client) {  // Solo inicializar si no existe un cliente
            client = new CosmosClient({ endpoint, key });
            console.log('Cliente de CosmosDB inicializado exitosamente');
        } else {
            console.log('Cliente de CosmosDB ya estaba inicializado');
        }
    } catch (error) {
        console.error('Error al inicializar el cliente de CosmosDB:', error.message);
        throw new Error('No se pudo inicializar el cliente de CosmosDB.');
    }
}

// Función para obtener el contenedor de CosmosDB
async function getContainer() {
    // Verificar si el cliente ha sido inicializado
    if (!client) {
        console.log('Cliente de CosmosDB no está inicializado. Iniciando cliente...');
        await initializeCosmosClient();  // Inicializar si no está inicializado
    }

    try {
        const database = client.database(databaseId);
        const container = database.container(containerId);
        return container;
    } catch (error) {
        console.error('Error al obtener el contenedor:', error.message);
        throw error;
    }
}

// Exportar las funciones
module.exports = { getContainer, initializeCosmosClient };







// Función para probar la conexión a la base de datos.
// Esta función ha sido comentada para evitar su ejecución automática.
/*
async function testConnection() {
    try {
        // Crear una base de datos y un contenedor si no existen.
        const { database } = await client.databases.createIfNotExists({ id: "TestDatabase" });
        const { container } = await database.containers.createIfNotExists({ id: "TestContainer" });
        
        // Crear un elemento en el contenedor.
        const { resource: createdItem } = await container.items.create({ id: "test-id", name: "Test Item" });
        console.log("Item creado:", createdItem);
        
        // Leer el elemento del contenedor.
        const { resource: readItem } = await container.item("test-id").read();
        console.log("Item leído:", readItem);
        
        // Eliminar el elemento y el contenedor.
        await container.item("test-id").delete();
        await container.delete();
        await database.delete();
        
        // Mostrar un mensaje de éxito.
        console.log("Prueba de conexión exitosa!");
    } catch (error) {
        // Mostrar el mensaje de error si algo sale mal.
        console.error("Error en la prueba de conexión:", error.message);
    }
}

// Descomentar la siguiente línea para ejecutar la prueba de conexión.
// testConnection();*/
