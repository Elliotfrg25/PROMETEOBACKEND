//test/currencyController.js

const chai = require('chai');
const expect = chai.expect;
const axios = require('axios');
const sinon = require('sinon');
const { fetchExchangeRate, updateDailyExchangeRates } = require('../controllers/currencyController');

describe('Currency Controller', () => {

    describe('fetchExchangeRate', () => {
        it('should return a valid exchange rate for USD to EUR', async () => {
            // Mock axios function
            axios.get = async () => {
                return {
                    data: {
                        rates: {
                            EUR: 0.85
                        }
                    }
                };
            };

            const rate = await fetchExchangeRate('USD', 'EUR');
            expect(rate).to.be.a('number');
            expect(rate).to.be.greaterThan(0);
            expect(rate).to.equal(0.85);
        });
    });

    describe('Daily Rate Update', () => {
        let clock;

        // Configura un reloj falso y un axios mock antes de cada prueba
        beforeEach(() => {
            clock = sinon.useFakeTimers();
            axios.get = async () => {
                return {
                    data: {
                        rates: {
                            EUR: 0.85
                        }
                    }
                };
            };
        });

        // Limpia el reloj falso después de cada prueba
        afterEach(() => {
            clock.restore();
        });

        it('should update exchange rates daily', async () => {
            // Obtén la tasa inicial
            const initialRate = await fetchExchangeRate('USD', 'EUR');

            // Avanza el tiempo en 24 horas (86400 segundos son un día)
            clock.tick(86400 * 1000);

            // Cambia el mock de axios para simular una nueva tasa de cambio
            axios.get = async () => {
                return {
                    data: {
                        rates: {
                            EUR: 0.86  // Nueva tasa
                        }
                    }
                };
            };

            // Ejecuta la función de actualización diaria
            await updateDailyExchangeRates();

            // Obtén la tasa actualizada
            const updatedRate = await fetchExchangeRate('USD', 'EUR');

            // Verifica que la tasa haya cambiado
            expect(updatedRate).to.not.equal(initialRate);
            expect(updatedRate).to.equal(0.86);
        });
    });

});
