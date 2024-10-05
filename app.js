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
const path = require('path'); // Para manejar rutas del sistema de archivos

// Inicialización de Express fuera de la función asíncrona
const app = express();
const port = process.env.PORT || 8080; // Asegúrate de usar el puerto que Azure proporciona

// Middlewares
app.use(helmet()); // Mejora la seguridad con cabeceras de seguridad
app.use(cors()); // Habilita CORS para permitir solicitudes de otros dominios
app.use(express.json()); // Parseo del cuerpo de la solicitud en JSON
app.use(morgan('combined')); // Log de solicitudes HTTP

// Configuración de Swagger para la documentación de la API
const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: "Prometeo API",
            description: "API para gestionar transferencias de dinero",
            contact: {
                name: "Soporte técnico"
            },
            servers: ["http://localhost:5000"] // Cambia esto si usas un dominio en producción
        }
    },
    apis: ["./routes/*.js"]
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Verificar variables de entorno críticas antes de iniciar el servidor
if (!process.env.SECRET_KEY) {
    console.error("Falta la variable de entorno SECRET_KEY. Terminando...");
    process.exit(1); // Termina el proceso si falta SECRET_KEY
}

// Importar y configurar las rutas de la API
const userRoutes = require('./routes/users');
const adminRoutes = require('./routes/admin');
const transactionRoutes = require('./routes/transactionRoutes');
const settingsRoutes = require('./routes/settingsRoutes');
const currencyRoutes = require('./routes/currencyRoutes');
const bankAccountRoutes = require('./routes/bankAccountRoutes');

// Rutas de la API
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/currency', currencyRoutes);
app.use('/api/bank-accounts', bankAccountRoutes);

// Middleware para manejar errores no capturados
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('¡Algo salió mal!');
});

// Intentar inicializar la conexión a CosmosDB y arrancar el servidor
(async () => {
    try {
        await initializeCosmosClient(); // Asegura que el cliente CosmosDB esté listo antes de iniciar el servidor
        console.log('Conexión a CosmosDB inicializada exitosamente');

        // Iniciar el servidor solo después de la inicialización exitosa de CosmosDB
        app.listen(port, () => {
            console.log(`Servidor corriendo en http://localhost:${port}`);
        });

    } catch (error) {
        console.error('Error al inicializar la conexión a CosmosDB:', error.message);
        process.exit(1); // Termina el proceso si falla la conexión a la base de datos
    }
})();

// Exportar la aplicación
module.exports = app;
