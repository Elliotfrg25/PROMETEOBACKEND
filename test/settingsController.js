//test/settingsController.js
// Importaciones necesarias
const chai = require('chai');
const chaiHttp = require('chai-http');
const { expect } = chai;
const sinon = require('sinon');
const { CosmosClient } = require('../db'); // Asegúrate de tener este archivo o mockealo
const settingsController = require('../controllers/settingsController');

chai.use(chaiHttp);

describe('Settings Controller', () => {
    describe('getSettings', () => {

        // Mock de datos de usuario
        const mockUser = {
            id: '1',
            settings: {
                defaultCurrency: 'USD',
                language: 'en',
                notifications: {
                    transaction: true,
                    weeklyReport: false
                },
                privacy: {
                    profileVisibility: 'everyone',
                    activityVisibility: 'onlyMe'
                }
            }
        };

        // Mock de request y response
        const req = {
            userId: '1'
        };
        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub()
        };

        afterEach(() => {
            // Restaura las funciones espiadas después de cada prueba
            console.log("Restaurando funciones espiadas...");
            sinon.restore();
        });

        it('should fetch user settings successfully', async () => {
            console.log("Ejecutando prueba para obtener configuraciones exitosamente...");
            // Espía y mockea la función de consulta a la base de datos
            const queryStub = sinon.stub().returns({ fetchAll: sinon.stub().resolves({ resources: [mockUser] }) });
            sinon.stub(CosmosClient.database().container(), 'items').value({ query: queryStub });

            // Llama a getSettings
            await settingsController.getSettings(req, res);

            // Verifica el estado y el cuerpo de la respuesta
            console.log("Verificando resultados...");
            expect(res.status.calledOnceWith(200)).to.be.true;
            expect(res.json.calledOnceWith({ success: true, settings: mockUser.settings })).to.be.true;
        });

        it('should return 404 if user not found', async () => {
            console.log("Ejecutando prueba para caso de usuario no encontrado...");
            // Espía y mockea la función de consulta a la base de datos
            const queryStub = sinon.stub().returns({ fetchAll: sinon.stub().resolves({ resources: [] }) });
            sinon.stub(CosmosClient.database().container(), 'items').value({ query: queryStub });

            // Llama a getSettings
            await settingsController.getSettings(req, res);

            // Verifica el estado y el cuerpo de la respuesta
            console.log("Verificando resultados...");
            expect(res.status.calledOnceWith(404)).to.be.true;
            expect(res.json.calledOnceWith({ success: false, message: 'Usuario no encontrado' })).to.be.true;
        });
    });
});


