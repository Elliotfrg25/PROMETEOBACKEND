//db.js

// Importar el módulo dotenv para gestionar variables de entorno.
require('dotenv').config();

// Leer las variables de entorno para la conexión a CosmosDB.
const endpoint = process.env.COSMOS_DB_ENDPOINT;
const key = process.env.COSMOS_DB_KEY;

// Imprimir las variables para depuración.
console.log("Endpoint:", endpoint);
console.log("Key:", key);

// Comprobar si las variables de entorno están definidas.
if (!endpoint || !key) {
    throw new Error("COSMOS_DB_ENDPOINT and COSMOS_DB_KEY must be defined.");
}

// Importar el cliente CosmosDB de la biblioteca de Azure.
const { CosmosClient } = require('@azure/cosmos');

// Inicializar el cliente de CosmosDB con los datos de conexión.
const client = new CosmosClient({ endpoint, key });

// Mostrar el objeto del cliente en la consola para fines de depuración.
console.log("CosmosClient:", client);

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
*/




