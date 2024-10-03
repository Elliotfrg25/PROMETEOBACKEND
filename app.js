// Carga las variables de entorno desde el archivo .env
require('dotenv').config();
// Inicializa la conexión a la base de datos y maneja errores de inicialización
const { initializeCosmosClient } = require('./db');

// Importaciones de paquetes necesarios
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require('cors');
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const path = require('path');  // Importamos 'path' para manejar rutas del sistema de archivos

// Inicialización de Express fuera de la función asíncrona
const app = express();
const port = process.env.PORT || 5000;

// Middlewares
app.use(helmet());  // Cabeceras de seguridad
app.use(cors());  // Habilitar CORS
app.use(express.json()); // Parseo del cuerpo JSON
app.use(morgan('combined'));  // Registro de solicitudes HTTP

// Configuración de Swagger
const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: "Prometeo API",
            description: "API para gestionar transferencias de dinero",
            contact: {
                name: "Soporte técnico"
            },
            servers: ["http://localhost:5000"]
        }
    },
    apis: ["./routes/*.js"]
};

// Inicialización de Swagger
const swaggerDocs = swaggerJsDoc(swaggerOptions);

// Verificar variables de entorno críticas antes de iniciar el servidor
if (!process.env.SECRET_KEY) {
    console.error("Falta la variable de entorno SECRET_KEY. Terminando...");
    process.exit(1);
}

// Rutas de la API
app.use('/api/users', require('./routes/users'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/transactions', require('./routes/transactionRoutes'));
app.use('/api/settings', require('./routes/settingsRoutes'));
app.use('/api/currency', require('./routes/currencyRoutes'));
app.use('/api/bank-accounts', require('./routes/bankAccountRoutes'));

// Sirviendo los archivos estáticos del frontend (generados en la carpeta 'build')
app.use(express.static(path.join(__dirname, '../frontend/build')));

// Cualquier ruta que no coincida con las anteriores (APIs), envía el index.html del frontend
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});

// Ruta de Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Middleware para manejo de errores no capturados
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('¡Algo salió mal!');
});

// Intentar inicializar la conexión a CosmosDB
(async () => {
    try {
        await initializeCosmosClient();  // Asegura que el cliente CosmosDB esté listo antes de iniciar el servidor
        console.log('Conexión a CosmosDB inicializada exitosamente');

        // Iniciar el servidor en el puerto especificado solo después de la inicialización exitosa de CosmosDB
        app.listen(port, () => {
            console.log(`Servidor corriendo en http://localhost:${port}`);
        });

    } catch (error) {
        console.error('Error al inicializar la conexión a CosmosDB:', error.message);
        process.exit(1);  // Termina el proceso si falla la conexión
    }
})();

// Exportar la aplicación
module.exports = app;
