//test/transactionController.js

const { expect } = require('chai');
const sinon = require('sinon');
const transactionController = require('../controllers/transactionController');

describe('Transaction Controller', () => {
    describe('makeTransaction', () => {
        let res;
        let container;
        let CosmosClient;
        let transactionModel;
        let emailService;
        let smsService;

        beforeEach(() => {
            // Restablecer todos los stubs antes de cada prueba
            sinon.restore();

            // Mock para el objeto res
            res = {
                json: sinon.stub(),
                status: sinon.stub().returnsThis(),
            };

            // Stub para CosmosClient
            container = {
                item: sinon.stub().returnsThis(),
                read: sinon.stub(),
                replace: sinon.stub(),
            };
            CosmosClient = {
                database: sinon.stub().returnsThis(),
                container: sinon.stub().returns(container),
            };

            // Stub para transactionModel
            transactionModel = {
                createTransaction: sinon.stub(),
                findTransactionsBySenderId: sinon.stub(),
            };

            // Stubs para servicios de notificación
            emailService = {
                sendTransactionEmail: sinon.stub(),
            };
            smsService = {
                sendTransactionSMS: sinon.stub(),
            };
        });

        it('should make a transaction with valid data', async () => {
            // Configura tus stubs para que devuelvan lo que esperas
            container.read.returns({
                resource: {
                    balance: 1000,
                    currency: 'USD',
                    email: 'example@email.com',
                    phoneNumber: '1234567890',
                },
            });

            // Llama a makeTransaction
            const reqWithValidData = {
                body: {
                    senderId: 'senderId',
                    receiverId: 'receiverId',
                    amount: 200,
                },
            };
            await transactionController.makeTransaction(reqWithValidData, res);

            // Verificaciones
            expect(res.status.calledOnceWith(201)).to.be.true;
            expect(res.json.calledOnceWith({
                success: true,
                message: 'Transferencia realizada con éxito',
            })).to.be.true;
        });

        // Puedes añadir más pruebas aquí para casos como transacciones inválidas, saldo insuficiente, etc.
    });
});
