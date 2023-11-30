//controllers/users.js

// Importar módulos necesarios
const { CosmosClient } = require('../db'); // Cliente de CosmosDB
const jwt = require('jsonwebtoken'); // Para manejar JSON Web Tokens
const bcrypt = require('bcrypt'); // Para el hash de las contraseñas
const { validationResult } = require('express-validator'); // Para validar el cuerpo de la petición

// Configuración de CosmosDB
const databaseId = process.env.COSMOS_DB_DATABASE_ID || 'ToDoList';
const containerId = process.env.COSMOS_DB_CONTAINER_ID || 'Items';

// Resto de tu configuración
const container = CosmosClient.database(databaseId).container(containerId);


// Función para verificar si un ID ya existe en la base de datos
const checkIfIdExists = async (idToCheck) => {
    // LOG: Añadiendo logging aquí
    console.log(`Verificando si el ID ${idToCheck} ya existe`);

    const querySpec = {
        query: "SELECT * from c WHERE c.id = @id",
        parameters: [
            {
                name: "@id",
                value: idToCheck
            }
        ]
    };

    const { resources: results } = await container.items.query(querySpec).fetchAll();
    return results.length > 0;
};

// Función para autenticar usuarios
const authenticateUser = async (req, res, next) => {
    const token = req.header('Authorization').replace('Bearer ', '');
    if (!token) return res.status(401).send('Acceso denegado. Token no proporcionado.');

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.user = decoded;
        next();
    } catch (ex) {
        res.status(400).send('Token inválido.');
    }
};

// Función para registrar usuarios
const register = async (req, res) => {
    try {
        // LOG: Añadiendo logging aquí
        console.log('Intento de registro de usuario');

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log(`Entrando al bloque de errores de validación: ${JSON.stringify(errors.array())}`);
            return res.status(422).json({ errors: errors.array() });
        }

        const idExists = await checkIfIdExists(req.body.email);
        if (idExists) {
            return res.status(400).send("ID ya existe");
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        const newUser = {
            id: req.body.email,
            email: req.body.email,
            password: hashedPassword
        };

        const { resource } = await container.items.create(newUser);
        return res.status(201).send('Usuario registrado con éxito.');
    } catch (error) {
        console.log(`Error inesperado en el registro: ${error}`);
        return res.status(500).send('Error inesperado.');
    }
};

// Leer usuario por ID
const getUserById = async (req, res) => {
    const { id } = req.params;
    try {
        // LOG: Añadiendo logging aquí
        console.log(`Leyendo usuario con ID ${id}`);

        const { resource } = await container.item(id).read();
        res.status(200).json(resource);
    } catch (error) {
        res.status(500).json({ error: "Error al leer usuario" });
    }
};

// Actualizar usuario
const updateUser = async (req, res) => {
    const { id } = req.params;
    const { name, email } = req.body;
    try {
        // LOG: Añadiendo logging aquí
        console.log(`Actualizando usuario con ID ${id}`);

        const { resource } = await container.item(id).replace({ id, name, email });
        res.status(200).json(resource);
    } catch (error) {
        res.status(500).json({ error: "Error al actualizar usuario" });
    }
};

// Eliminar usuario
const deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        // LOG: Añadiendo logging aquí
        console.log(`Eliminando usuario con ID ${id}`);

        await container.item(id).delete();
        res.status(204).json({});
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar usuario" });
    }
};

// Función para obtener el perfil del usuario
const getProfile = async (req, res) => {
    console.log('Obteniendo perfil del usuario');
    const userId = req.user.id; // Usar req.user.id en lugar de req.userId
    try {
        const { resource } = await container.item(userId).read();
        res.status(200).send(resource);
    } catch (error) {
        res.status(500).send('Error al obtener el perfil.');
    }
};


// Función para iniciar sesión
const login = async (req, res) => {
    console.log('Intento de inicio de sesión');
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });
    try {
        const { resource } = await container.item(req.body.email).read();
        const user = resource;
        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword) return res.status(400).send('Contraseña incorrecta.');
        const token = jwt.sign({ _id: user.id }, process.env.SECRET_KEY);
        res.send({ token });
    } catch (error) {
        console.log(`Error inesperado en el inicio de sesión: ${error}`);
        res.status(500).send('Error al iniciar sesión.');
    }
};

// Exportar las funciones para su uso en otros archivos
module.exports = {
    register,
    authenticateUser,
    getProfile,
    login,
    getUserById,
    updateUser,
    deleteUser
};








