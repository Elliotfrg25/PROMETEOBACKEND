// middleware/authorization.js

const { findUserById } = require('../models/user');

exports.requireRole = (...requiredRoles) => {
    return async (req, res, next) => {
        console.log('Iniciando la verificación del rol del usuario');
        let userRole = req.userRole;

        if (!userRole) {
            try {
                console.log('Buscando rol del usuario en la base de datos');
                const user = await findUserById(req.userId);
                if (!user) {
                    console.log('Usuario no encontrado');
                    return res.status(404).json({ message: 'Usuario no encontrado.' });
                }
                userRole = user.role;
            } catch (error) {
                console.error('Error al buscar el usuario:', error);
                return res.status(500).json({ message: 'Error interno del servidor.' });
            }
        }

        if (!requiredRoles.includes(userRole)) {
            console.log('El usuario no tiene permiso para realizar esta acción');
            return res.status(403).json({ message: 'No tienes permiso para realizar esta acción.' });
        }

        console.log('Verificación de rol completada con éxito');
        next();
    };
};



