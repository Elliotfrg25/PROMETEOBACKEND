//services/smsService.js

require('dotenv').config(); // Asegúrate de requerir dotenv al inicio de tu archivo

const twilio = require('twilio');

// Utiliza las variables de entorno para las credenciales de Twilio
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

const client = new twilio(accountSid, authToken);

const sendTransactionSMS = async (phoneNumber, message) => {
    try {
        await client.messages.create({
            body: message,
            to: phoneNumber,
            from: twilioPhoneNumber // Usa la variable de entorno para el número de Twilio
        });
    } catch (error) {
        console.error(`Error al enviar el SMS: ${error}`);
    }
};

module.exports = {
    sendTransactionSMS
};

