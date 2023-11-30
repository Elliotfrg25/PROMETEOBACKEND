// test/settingsController.js

// Importaciones necesarias
const chai = require('chai');
const chaiHttp = require('chai-http');
const { expect } = chai;
const sinon = require('sinon');
const { CosmosClient } = require('../db');
const settingsController = require('../controllers/settingsController');

chai.use(chaiHttp);

describe('Settings Controller', () => {
    // Mock de datos de usuario
    const mockUser = {
        id: 'john.doe@example.com',
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
        userId: 'john.doe@example.com'
    };
    const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub()
    };

    // Crear un stub directamente, no necesitas usar createStubInstance
    const mockContainer = {
        items: {
            query: sinon.stub().returns({
                fetchAll: sinon.stub().resolves({ resources: [mockUser] })
            })
        }
    };
    const mockDatabase = {
        container: sinon.stub().returns(mockContainer)
    };

    let originalCosmosClient;

    before(() => {
        // Almacenar el CosmosClient original
        originalCosmosClient = settingsController.CosmosClient;
    });

    beforeEach(() => {
        // Restaurar el CosmosClient original antes de cada prueba
        settingsController.CosmosClient = originalCosmosClient;
        sinon.stub(settingsController, 'CosmosClient').get(() => sinon.stub({
            database: sinon.stub().returns(mockDatabase)
        }));
    });

    describe('getSettings', () => {
        it('should fetch user settings successfully', async function () {
            this.timeout(9000);

            mockContainer.items.query.returns({
                fetchAll: sinon.stub().resolves({ resources: [mockUser] })
            });

            try {
                await settingsController.getSettings(req, res);
            } catch (error) {
                console.error("Error during getSettings test:", error);
            }

            console.log("res.json.args:", res.json.args);
            console.log("res.status.args:", res.status.args);

            // Aquí agregamos algunos mensajes de registro para ayudar a entender el estado actual
            console.log("resources:", mockContainer.items.query().fetchAll().resources);

            expect(res.status.calledOnceWith(200)).to.be.true;
            expect(res.json.calledOnceWith({ success: true, settings: mockUser.settings })).to.be.true;
        });

        it('should return 404 if user not found', async function () {
            this.timeout(9000);

            mockContainer.items.query.returns({
                fetchAll: sinon.stub().resolves({ resources: [] })
            });

            try {
                await settingsController.getSettings(req, res);
            } catch (error) {
                console.error("Error during getSettings test:", error);
            }

            console.log("res.json.args:", res.json.args);
            console.log("res.status.args:", res.status.args);

            // Aquí agregamos algunos mensajes de registro para ayudar a entender el estado actual
            console.log("resources:", mockContainer.items.query().fetchAll().resources);

            expect(res.status.calledOnceWith(404)).to.be.true;
            expect(res.json.calledOnceWith({ success: false, message: 'Usuario no encontrado' })).to.be.true;
        });
    });

    
    describe('updateSettings', () => {
        // Agrega pruebas para updateSettings aquí
        it('should update user settings successfully', async function () {
            // Tu implementación de prueba aquí
        });

        it('should handle validation errors when updating settings', async function () {
            // Tu implementación de prueba aquí
        });
    });

    describe('createSettings', () => {
        // Agrega pruebas para createSettings aquí
        it('should create user settings successfully', async function () {
            // Tu implementación de prueba aquí
        });

        it('should handle validation errors when creating settings', async function () {
            // Tu implementación de prueba aquí
        });
    });

    describe('deleteSettings', () => {
        // Agrega pruebas para deleteSettings aquí
        it('should delete user settings successfully', async function () {
            // Tu implementación de prueba aquí
        });
    });
});

















