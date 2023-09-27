// web3.js

const Web3 = require('web3');

const provider = new Web3.providers.HttpProvider('https://mainnet.infura.io/v3/067a47cccd9149a28d38dbdecf2501ef');
const web3 = new Web3(provider);

module.exports = web3;
