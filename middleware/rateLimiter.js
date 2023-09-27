// middleware/rateLimiter.js

const rateLimit = require('express-rate-limit');

// Configuración del Rate Limiter
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // Límite de 100 solicitudes por ventana
    message: 'Has excedido el límite de 100 solicitudes en 15 minutos. Por favor, intenta más tarde.'
});

module.exports = apiLimiter;
