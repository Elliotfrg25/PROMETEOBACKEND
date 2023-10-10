// app.js

// Carga las variables de entorno desde el archivo .env
require('dotenv').config();
// Inicializa la conexión a la base de datos
require('./db');

// Importaciones de paquetes necesarios
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require('cors');
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

// Importaciones de rutas
const userRoutes = require('./routes/users');
const adminRoutes = require('./routes/admin');
const transactionRoutes = require('./routes/transactionRoutes');
const settingsRoutes = require('./routes/settingsRoutes');
const currencyRoutes = require('./routes/currencyRoutes');
const bankAccountRoutes = require('./routes/bankAccountRoutes');
const apiLimiter = require('./middleware/rateLimiter');

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

// Verificar variables de entorno
if (!process.env.SECRET_KEY) {
    console.error("Falta la variable de entorno SECRET_KEY. Terminando...");
    process.exit(1);
}

// Inicialización de Express
const app = express();
const port = process.env.PORT || 5000;

// Middlewares
app.use(helmet());  // Cabeceras de seguridad
app.use(cors());  // Habilitar CORS
app.use(express.json()); // Parseo del cuerpo JSON
app.use(morgan('combined'));  // Registro de solicitudes HTTP

// Ruta de Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Ruta de prueba para verificar que el backend está funcionando
app.get('/', (req, res) => {
    res.send('Prometeo Backend está en funcionamiento!');
});

app.use('/api/', apiLimiter);

// Rutas de la API
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/currency', currencyRoutes);
app.use('/api/bank-accounts', bankAccountRoutes);

// Middleware para manejo de errores no capturados
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('¡Algo salió mal!');
});

// Iniciar el servidor en el puerto especificado
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});

module.exports = app;




