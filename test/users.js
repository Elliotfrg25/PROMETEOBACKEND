// test/users.js

const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const app = require('../app');  // Importa tu aplicación Express aquí
const jwt = require('jsonwebtoken');

// Cargar las variables de entorno
require('dotenv').config();

chai.use(chaiHttp);

describe('Users', () => {
    let invalidToken;
    let validToken;
    let invalidUser;
    let validUser;

    before(() => {
        invalidToken = 'someInvalidTokenHere';
        const user = { id: 1, role: 'user' };
        validToken = jwt.sign(user, process.env.SECRET_KEY, { expiresIn: '1h' });

        invalidUser = {
            username: 'John',
            email: 'invalidEmail',
            password: '123'
        };

        validUser = {
            username: 'JohnDoe',
            email: 'john.doe@example.com',
            password: 'password123'
        };
    });

    // Helper function para manejar el tiempo de espera
    const timeout = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    // Test para authenticateUser
    describe('authenticateUser', () => {
        it('should return 401 for invalid token', async () => {
            await timeout(5000); // Ajustar el tiempo de espera directamente aquí
            const res = await chai.request(app)
                .get('/api/users/profile')  // Ruta protegida que requiere autenticación
                .set('Authorization', `Bearer ${invalidToken}`);

            expect(res).to.have.status(401);
            expect(res.body).to.have.property('message').eql('Token no válido.');
        });

        it('should return 200 for valid token', async () => {
            await timeout(5000); // Ajustar el tiempo de espera directamente aquí
            const res = await chai.request(app)
                .get('/api/users/profile')  // Ruta protegida que requiere autenticación
                .set('Authorization', `Bearer ${validToken}`);

            expect(res).to.have.status(200);
        });
    });

    // Test para register
    describe('register', () => {
        it('should return 422 for invalid user data', async () => {
            await timeout(5000); // Ajustar el tiempo de espera directamente aquí
            const res = await chai.request(app)
                .post('/api/users/register')  // Ruta para registrar un usuario
                .send(invalidUser);

            expect(res).to.have.status(422);
            expect(res.body).to.have.property('errors');
        });

        it('should return 201 for valid user data', async () => {
            await timeout(5000); // Ajustar el tiempo de espera directamente aquí
            const res = await chai.request(app)
                .post('/api/users/register')  // Ruta para registrar un usuario
                .send(validUser);

            expect(res).to.have.status(201);
            expect(res.body).to.have.property('message').eql('Usuario registrado con éxito.');
        });
    });
});
















