//middleware/auth.js

const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY || 'your-secure-secret-key';

exports.generateToken = (user) => {
    console.log('Generando token para el usuario:', user);
    return jwt.sign({ id: user.id, role: user.role }, SECRET_KEY, { expiresIn: '1h' });
};

exports.verifyToken = (req, res, next) => {
    console.log('Iniciando la verificación del token');
    const token = req.headers['authorization']?.split(' ')[1];
    console.log('Token extraído:', token);

    if (!token) {
        console.log('Token no proporcionado');
        return res.status(403).json({ message: 'Token no proporcionado.' });
    }

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        console.log('Verificando token');
        if (err) {
            console.log('Error al verificar el token:', err);
            return res.status(401).json({ message: 'Token no válido.' });
        }
        console.log('Token verificado correctamente:', decoded);
        req.userId = decoded.id;
        req.userRole = decoded.role;
        next();
    });
};

 



