const nodeMailer = require('nodemailer');

const sendEmail = async (options) => {

    // 1. Transporter Create Karein (Gmail ki settings ke saath)
    const transporter = nodeMailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        service: process.env.SMTP_SERVICE,
        auth: {
            user: process.env.SMTP_MAIL,
            pass: process.env.SMTP_PASSWORD, // Wo 16-digit App Password jo .env mein hai
        },
    });

    // 2. Mail Options Set Karein
    const mailOptions = {
        from: process.env.SMTP_MAIL,
        to: options.email,
        subject: options.subject,
        text: options.message, // Simple text message ke liye
        // html: options.message, // Agar aap HTML bhej rahe hain toh isay use karein
    };

    // 3. Email Send Karein
    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;