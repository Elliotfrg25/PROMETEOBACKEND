// models/user.js

// Importar el cliente de CosmosDB y bcrypt
const { getContainer } = require('../db');  // Importar la función getContainer desde db.js
const bcrypt = require('bcrypt'); // Importar la biblioteca bcrypt para el manejo de contraseñas

// Función para crear un nuevo usuario con validaciones adicionales
exports.createUser = async (user) => {
    const container = await getContainer();  // Obtener el contenedor desde db.js

    // Verificar si el correo electrónico ya está en uso en la base de datos
    const querySpec = {
        query: 'SELECT * FROM Users u WHERE u.email = @email',
        parameters: [{ name: '@email', value: user.email }],
    };

    const emailExists = (await container.items.query(querySpec).fetchAll()).resources.length > 0;
    if (emailExists) {
        throw new Error('Este correo electrónico ya está en uso.');
    }

    // Hash de la contraseña usando bcrypt
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    // Inicializar el balance del usuario en 0
    user.balance = 0;

    // Inicializar el rol del usuario como 'user'
    user.role = 'user';

    // Añadir el campo entityType para identificar que se trata de un usuario
    user.entityType = 'User';

    // Crear el usuario en la base de datos y devolver el resultado
    return await container.items.create(user);
};

// Función para buscar un usuario por su ID
exports.findUserById = async (id) => {
    const container = await getContainer();  // Obtener el contenedor desde db.js

    // Consulta para encontrar un usuario por ID
    const querySpec = {
        query: 'SELECT * FROM Users u WHERE u.id = @id',
        parameters: [{ name: '@id', value: id }],
    };

    // Ejecutar la consulta y devolver el primer resultado
    const { resources } = await container.items.query(querySpec).fetchAll();
    return resources[0];
};

// Función para autenticar un usuario
exports.authenticateUser = async (email, password) => {
    const container = await getContainer();  // Obtener el contenedor desde db.js

    // Consulta para encontrar un usuario por correo electrónico
    const querySpec = {
        query: 'SELECT * FROM Users u WHERE u.email = @email',
        parameters: [{ name: '@email', value: email }],
    };

    // Ejecutar la consulta y obtener el usuario
    const { resources } = await container.items.query(querySpec).fetchAll();
    const user = resources[0];

    // Verificar si el usuario existe y si la contraseña es correcta
    if (user && await bcrypt.compare(password, user.password)) {
        return user;
    }

    // Devolver null si la autenticación falla
    return null;
};





