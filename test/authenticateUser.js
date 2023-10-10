//test/authenticateUser.js

// Cargar las variables de entorno
require('dotenv').config();

// Importar las bibliotecas y módulos necesarios
const { expect } = require('chai');
const { authenticateUser } = require('../controllers/users');
const jwt = require('jsonwebtoken');

// Comenzar la descripción de las pruebas
describe('Users Controller', () => {

    // Descripción de las pruebas para la función authenticateUser
    describe('authenticateUser', () => {

        // Primera prueba: debería autenticar a un usuario con un token válido
        it('should authenticate a user with a valid token', async () => {

            // Crear una solicitud simulada (mock) con un token válido
            const mockReq = {
                header: () => `Bearer ${jwt.sign({ _id: 'testID' }, process.env.SECRET_KEY)}`,
            };

            // Crear una respuesta simulada (mock)
            const mockRes = {
                status: (code) => mockRes,
                send: (message) => message,
            };

            // Variable para verificar si se llamó a la función 'next'
            let nextCalled = false;

            // Llamar a la función authenticateUser
            await authenticateUser(mockReq, mockRes, () => { nextCalled = true; });

            // Verificar si se llamó a la función 'next'
            expect(nextCalled).to.be.true;
        });

        // Segunda prueba: debería no autenticar a un usuario con un token inválido
        it('should not authenticate a user with an invalid token', async () => {

            // Crear una solicitud simulada (mock) con un token inválido
            const mockReq = {
                header: () => 'Bearer invalidToken',
            };

            // Variable para guardar el mensaje de respuesta
            let resMessage = '';

            // Crear una respuesta simulada (mock) y guardar el mensaje enviado
            const mockRes = {
                status: (code) => mockRes,
                send: (message) => { resMessage = message; return mockRes; },
            };

            // Llamar a la función authenticateUser
            await authenticateUser(mockReq, mockRes, () => { });

            // Verificar si el mensaje es 'Token inválido.'
            expect(resMessage).to.equal('Token inválido.');
        });
    });
});

