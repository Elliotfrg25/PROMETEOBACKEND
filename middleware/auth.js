// middleware/auth.js

const jwt = require('jsonwebtoken');

// Asegúrate de que esta llave sea fuerte y esté almacenada de forma segura.
// Es mejor guardarla en variables de entorno en lugar de codificarla directamente en el archivo.
const SECRET_KEY = process.env.SECRET_KEY || 'your-secure-secret-key';

// Generar un nuevo token JWT
// Este método toma un objeto 'user' y retorna un token JWT
exports.generateToken = (user) => {
    // La información que se quiere encriptar está en el segundo argumento.
    // En este caso, estamos poniendo el id y el rol del usuario dentro del token.
    return jwt.sign({ id: user.id, role: user.role }, SECRET_KEY, { expiresIn: '1h' });
};

// Verificar el token JWT en el header de la solicitud
// Este es un middleware que se ejecutará antes de llegar al controlador final
exports.verifyToken = (req, res, next) => {
    // Obtiene el token del header 'Authorization'
    // El formato generalmente es "Bearer <token>"
    const token = req.headers['authorization']?.split(' ')[1];

    // Si el token no está presente, detener la ejecución y responder con un error
    if (!token) {
        return res.status(403).json({ message: 'Token no proporcionado.' });
    }

    // Verificar el token
    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        // Si hay un error durante la verificación, detener la ejecución y responder con un error
        if (err) {
            return res.status(401).json({ message: 'Token no válido.' });
        }

        // Si todo está bien, establecer el userId y userRole en el objeto 'req'
        // Esto se puede usar más tarde en los controladores para autorización
        req.userId = decoded.id;
        req.userRole = decoded.role;

        // Pasar al siguiente middleware o controlador
        next();
    });
};



