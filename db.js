// db.js

// Importar el módulo dotenv para gestionar variables de entorno.
require('dotenv').config();

// Leer las variables de entorno para la conexión a CosmosDB.
const endpoint = process.env.COSMOS_DB_ENDPOINT;
const key = process.env.COSMOS_DB_KEY;
const databaseId = process.env.COSMOS_DB_DATABASE_ID;
const containerId = process.env.COSMOS_DB_CONTAINER_ID;

// Verificación adicional para ver las variables de entorno en los logs
console.log('COSMOS_DB_ENDPOINT:', process.env.COSMOS_DB_ENDPOINT || 'No definida');
console.log('COSMOS_DB_KEY:', process.env.COSMOS_DB_KEY ? 'Definida' : 'No definida'); // No imprimir el valor de la clave por seguridad
console.log('COSMOS_DB_DATABASE_ID:', process.env.COSMOS_DB_DATABASE_ID || 'No definida');
console.log('COSMOS_DB_CONTAINER_ID:', process.env.COSMOS_DB_CONTAINER_ID || 'No definida');

// LOG: Verificando la presencia de variables de entorno
console.log('Verificando variables de entorno para la conexión a CosmosDB');

// Comprobar si las variables de entorno están definidas.
if (!endpoint || !key || !databaseId || !containerId) {
    console.error('COSMOS_DB_ENDPOINT, COSMOS_DB_KEY, COSMOS_DB_DATABASE_ID y COSMOS_DB_CONTAINER_ID deben estar definidos');
    throw new Error("Faltan variables de entorno requeridas.");
}

// Importar el cliente CosmosDB de la biblioteca de Azure.
const { CosmosClient } = require('@azure/cosmos');

// LOG: Inicializando el cliente de CosmosDB
console.log('Inicializando el cliente de CosmosDB');

// Inicialización del cliente de CosmosDB.
let client;
try {
    client = new CosmosClient({ endpoint, key });
    console.log('Cliente de CosmosDB inicializado exitosamente');
} catch (error) {
    console.error('Error al inicializar el cliente de CosmosDB:', error.message);
    process.exit(1); // Terminar el proceso si la inicialización falla
}

// Función para obtener el contenedor de CosmosDB
async function getContainer() {
    try {
        const database = client.database(databaseId);
        const container = database.container(containerId);
        return container;
    } catch (error) {
        console.error('Error al obtener el contenedor:', error.message);
        throw error;
    }
}

// Exportar la función para obtener el contenedor
module.exports = { getContainer };


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
