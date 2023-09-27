// testConnection.js

const web3 = require('./web3'); // Ajusta la ruta según la ubicación de tu archivo web3.js

// Obtén el número del último bloque en la red Ethereum
web3.eth.getBlockNumber(function (error, blockNumber) {
    if (error) {
        console.error('Error:', error);
    } else {
        console.log('Número de bloque más reciente:', blockNumber);
    }
});






