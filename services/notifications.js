// services/notifications.js

const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'escarto88@gmail.com',
        pass: 'tu-contraseña'
    }
});

exports.sendEmailNotification = (to, subject, text) => {
    const mailOptions = { from: 'escarto88@gmail.com', to, subject, text };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) console.log(error);
        else console.log('Email sent:', info.response);
    });
};
