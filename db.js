// db.js

// Importar el módulo dotenv para gestionar variables de entorno.
require('dotenv').config();

// Leer las variables de entorno para la conexión a CosmosDB.
const endpoint = process.env.COSMOS_DB_ENDPOINT;
const key = process.env.COSMOS_DB_KEY;

// LOG: Verificando la presencia de variables de entorno
console.log('Verificando variables de entorno para la conexión a CosmosDB');

// Comprobar si las variables de entorno están definidas.
if (!endpoint || !key) {
    // LOG: Error de configuración
    console.error('COSMOS_DB_ENDPOINT y COSMOS_DB_KEY deben estar definidos');
    throw new Error("COSMOS_DB_ENDPOINT and COSMOS_DB_KEY must be defined.");
}

// LOG: Variables de entorno correctas, procediendo a la conexión
console.log('Variables de entorno correctas, procediendo a la conexión');

// Importar el cliente CosmosDB de la biblioteca de Azure.
const { CosmosClient } = require('@azure/cosmos');

// LOG: Inicializando el cliente de CosmosDB
console.log('Inicializando el cliente de CosmosDB');

// Manejo de errores en la inicialización del cliente de CosmosDB.
let client;
try {
    client = new CosmosClient({ endpoint, key });
    // LOG: Cliente de CosmosDB inicializado
    console.log('Cliente de CosmosDB inicializado exitosamente');
} catch (error) {
    // LOG: Error al inicializar el cliente
    console.error('Error al inicializar el cliente de CosmosDB:', error.message);
    process.exit(1); // Terminar el proceso si la inicialización falla
}

// Exportar el cliente para que pueda ser utilizado en otros archivos del proyecto.
module.exports = { CosmosClient: client };

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
// testConnection();
