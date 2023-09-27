//controllers/users.js

// Importar módulos necesarios
const { CosmosClient } = require('../db'); // Cliente de CosmosDB
const jwt = require('jsonwebtoken'); // Para manejar JSON Web Tokens
const bcrypt = require('bcrypt'); // Para el hash de las contraseñas
const { validationResult } = require('express-validator'); // Para validar el cuerpo de la petición

// Configuración de CosmosDB
const databaseId = 'ToDoList';
const containerId = 'Items';
const container = CosmosClient.database(databaseId).container(containerId);

// Función para autenticar usuarios
const authenticateUser = async (req, res, next) => {
    const token = req.header('Authorization').replace('Bearer ', '');
    if (!token) return res.status(401).send('Acceso denegado. Token no proporcionado.');

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (ex) {
        res.status(400).send('Token inválido.');
    }
};


// Función para registrar usuarios
const register = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const newUser = {
        id: req.body.email,
        email: req.body.email,
        password: hashedPassword
    };

    try {
        const { resource } = await container.items.create(newUser);
        res.status(201).send('Usuario registrado con éxito.');
    } catch (error) {
        res.status(500).send('Error al registrar usuario.');
    }
};


// Leer usuario por ID
const getUserById = async (req, res) => {
    const { id } = req.params;
    try {
        const { resource } = await container.item(id).read();
        res.status(200).json(resource);
    } catch (error) {
        res.status(500).json({ error: "Error al leer usuario" });
    }
};

// Actualizar usuario
const updateUser = async (req, res) => {
    const { id } = req.params;
    const { name, email } = req.body; // Solo actualizamos nombre y email en este ejemplo

    try {
        const { resource } = await container.item(id).replace({ id, name, email });
        res.status(200).json(resource);
    } catch (error) {
        res.status(500).json({ error: "Error al actualizar usuario" });
    }
};

//  Eliminar usuario
const deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        await container.item(id).delete();
        res.status(204).json({});
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar usuario" });
    }
};

// Función para obtener el perfil del usuario
const getProfile = async (req, res) => {
    const userId = req.user._id;

    try {
        const { resource } = await container.item(userId).read();
        res.status(200).send(resource);
    } catch (error) {
        res.status(500).send('Error al obtener el perfil.');
    }
};

// Función para iniciar sesión
const login = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });

    try {
        const { resource } = await container.item(req.body.email).read();
        const user = resource;

        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword) return res.status(400).send('Contraseña incorrecta.');

        const token = jwt.sign({ _id: user.id }, process.env.JWT_SECRET);
        res.send({ token });
    } catch (error) {
        res.status(500).send('Error al iniciar sesión.');
    }
};


// Exportar las funciones para su uso en otros archivos
module.exports = {
    authenticateUser,
    register,
    getProfile,
    login,
    // NUEVAS FUNCIONES CRUD
    getUserById,
    updateUser,
    deleteUser
}; 
 



