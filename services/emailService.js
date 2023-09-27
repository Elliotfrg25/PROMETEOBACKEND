//services/emailService.js

const nodemailer = require('nodemailer');

const sendTransactionEmail = async (email, subject, message) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'tu_correo@gmail.com',
            pass: 'tu_contraseña'
        }
    });

    const mailOptions = {
        from: 'tu_correo@gmail.com',
        to: email,
        subject: subject,
        text: message
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error(`Error al enviar el correo: ${error}`);
    }
};

module.exports = {
    sendTransactionEmail
};
