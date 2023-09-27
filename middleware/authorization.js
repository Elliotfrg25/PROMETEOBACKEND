// middleware/authorization.js

const { findUserById } = require('../models/user');  // Importar la función desde tu modelo de usuario

// Middleware para requerir ciertos roles para acceder a una ruta
exports.requireRole = (...requiredRoles) => {
    return async (req, res, next) => {
        let userRole = req.userRole;  // Obtener el rol del token JWT

        // Si el rol no está en el token, buscarlo en la base de datos
        if (!userRole) {
            try {
                const user = await findUserById(req.userId);
                if (!user) {
                    return res.status(404).json({ message: 'Usuario no encontrado.' });
                }
                userRole = user.role;  // Asumiendo que 'role' es un campo en tu modelo de usuario
            } catch (error) {
                console.error("Error al buscar el usuario:", error);
                return res.status(500).json({ message: 'Error interno del servidor.' });
            }
        }

        // Verificar si el rol del usuario está en los roles requeridos
        if (!requiredRoles.includes(userRole)) {
            return res.status(403).json({ message: 'No tienes permiso para realizar esta acción.' });
        }

        next();  // Si todo está bien, continuar con el siguiente middleware o ruta
    };
}; 



