// test/register.js

// Cargar las variables de entorno
require('dotenv').config();

const { expect } = require('chai');
const { register } = require('../controllers/users');
const bcrypt = require('bcrypt');

describe('register', () => {
    it('should register a user with valid data', async () => {
        let responseMessage = '';  // Variable para almacenar el mensaje de respuesta

        const uniqueId = Date.now();  // Generar un ID único basado en la hora actual
        const mockReq = {
            body: {
                username: `testUser${uniqueId}`,
                email: `test${uniqueId}@example.com`,
                password: 'password1234567',
            },
        };
        const mockRes = {
            statusCode: 0,
            status: function (code) { this.statusCode = code; return this; },
            send: function (message) {
                responseMessage = message;  // Almacena el mensaje de respuesta aquí
                console.log("Mensaje de respuesta: ", message);
                console.log("Código de estado HTTP: ", this.statusCode);
            },
        };

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(mockReq.body.password, salt);

        await register(mockReq, mockRes);

        expect(responseMessage).to.equal('Usuario registrado con éxito.');
        expect(mockRes.statusCode).to.equal(201);
    });

    it('should not register a user with invalid data', async () => {
        let responseMessage = '';  // Variable para almacenar el mensaje de respuesta

        const mockReq = {
            body: {
                username: 'us',
                email: 'invalidEmail',
                password: '123',
            },
        };
        const mockRes = {
            statusCode: 0,
            status: function (code) { this.statusCode = code; return this; },
            json: function (message) {
                responseMessage = message;  // Almacena el mensaje de respuesta aquí
                console.log("Mensaje de respuesta con datos inválidos: ", message);
                console.log("Código de estado HTTP: ", this.statusCode);
            },
            send: function (message) {  // Aquí se ha añadido la función send
                return message;
            },
        };

        await register(mockReq, mockRes);

        expect(responseMessage).to.have.property('errors');
        expect(mockRes.statusCode).to.equal(422);
    });
});








