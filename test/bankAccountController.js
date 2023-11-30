// test/bankAccountController.js

const { expect } = require('chai');
const { linkBankAccount } = require('../controllers/bankAccountController');
const { CosmosClient } = require('../db');

const databaseId = 'ToDoList';
const containerId = 'Items';
const container = CosmosClient.database(databaseId).container(containerId);

describe('bankAccountController', function () {
    this.timeout(9000); // Aumenta el tiempo de espera para la prueba a 9000 ms

    // Limpiar la base de datos antes de cada prueba
    beforeEach(async () => {
        console.log("Limpiando base de datos antes de la prueba");

        // Consulta para obtener todos los elementos del contenedor
        const querySpec = {
            query: 'SELECT * FROM Items'
        };
        const { resources } = await container.items.query(querySpec).fetchAll();

        // Eliminar cada elemento del contenedor
        for (let item of resources) {
            await container.item(item.id).delete();
        }
    });

    // Grupo de pruebas para la función linkBankAccount
    describe('linkBankAccount', () => {
        it('should link a bank account with valid data', async () => {
            // Genera un número de cuenta dinámico
            const dynamicAccountNumber = '1234567890' + Math.floor(Math.random() * 1000);

            // Mock de la petición
            const mockReq = {
                body: {
                    bankName: 'Bank of Test',
                    accountNumber: dynamicAccountNumber,
                },
                user: {
                    _id: 'someUserId',
                },
            };

            // Mock de la respuesta
            const mockRes = {
                statusCode: 0,
                status: function (code) {
                    this.statusCode = code;
                    return this;
                },
                send: function (message) { },
                json: function (data) { }  // Añadido método json para evitar el error
            };

            await linkBankAccount(mockReq, mockRes);
            expect(mockRes.statusCode).to.equal(201); // Comprueba si el estado es 201
        });

        it('should not link a bank account with invalid data', async () => {
            // Mock de la petición con datos inválidos
            const mockReq = {
                body: {
                    bankName: '',
                    accountNumber: '123',
                },
                user: {
                    _id: 'someUserId',
                },
            };

            // Mock de la respuesta
            const mockRes = {
                statusCode: 0,
                status: function (code) {
                    this.statusCode = code;
                    return this;
                },
                send: function (message) { },
                json: function (data) { }  // Añadido método json para evitar el error
            };

            await linkBankAccount(mockReq, mockRes);
            expect(mockRes.statusCode).to.equal(409); // Comprueba si el estado es 409
        });
    });
});

 





