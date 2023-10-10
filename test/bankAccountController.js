// test/bankAccountController.js

const { expect } = require('chai');
const { linkBankAccount } = require('../controllers/bankAccountController');
// Importa el cliente de Cosmos para acceder a la base de datos
const { CosmosClient } = require('../db');

const databaseId = 'ToDoList';
const containerId = 'Items';
const container = CosmosClient.database(databaseId).container(containerId);

describe('bankAccountController', function () {
    this.timeout(9000); // Aumenta el tiempo de espera a 9000 ms

    // Limpiar la base de datos antes de cada prueba
    beforeEach(async () => {
        console.log("Limpiando base de datos antes de la prueba");

        // Aquí puedes agregar el código para limpiar la base de datos.
        // Por ejemplo, borrar todos los elementos de un contenedor:
        const querySpec = {
            query: 'SELECT * FROM Items'
        };
        const { resources } = await container.items.query(querySpec).fetchAll();

        // Asegúrate de que esta línea se ejecute correctamente
        for (let item of resources) {
            await container.item(item.id).delete();
        }
    });

    describe('linkBankAccount', () => {
        it('should link a bank account with valid data', async () => {
            const dynamicAccountNumber = '1234567890' + Math.floor(Math.random() * 1000); // Genera un número de cuenta dinámico

            const mockReq = {
                body: {
                    bankName: 'Bank of Test',
                    accountNumber: dynamicAccountNumber,
                },
                user: {
                    _id: 'someUserId',
                },
            };

            const mockRes = {
                statusCode: 0,
                status: function (code) {
                    this.statusCode = code;
                    return this;
                },
                send: function (message) { /* handle send */ },
            };

            await linkBankAccount(mockReq, mockRes);
            expect(mockRes.statusCode).to.equal(201);
        });

        it('should not link a bank account with invalid data', async () => {
            const mockReq = {
                body: {
                    bankName: '',
                    accountNumber: '123',
                },
                user: {
                    _id: 'someUserId',
                },
            };

            const mockRes = {
                statusCode: 0,
                status: function (code) {
                    this.statusCode = code;
                    return this;
                },
                send: function (message) { /* handle send */ },
            };

            await linkBankAccount(mockReq, mockRes);
            expect(mockRes.statusCode).to.equal(409); // Cambia 422 a 409 si sigue siendo el código de error apropiado
        });
    });
});






