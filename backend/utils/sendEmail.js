const nodeMailer = require('nodemailer');

const sendEmail = async (options) => {
    const transporter = nodeMailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        service: process.env.SMTP_SERVICE,
        auth: {
            user: process.env.SMTP_MAIL,
            pass: process.env.SMTP_PASSWORD,
        },
    });

    // Beautiful HTML Template with Emojis & Styling
    const htmlTemplate = `
        <div style="font-family: Arial, sans-serif; background-color: #f4f4f7; padding: 20px; border-radius: 10px;">
            <div style="max-width: 600px; margin: auto; background: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
                
                <!-- Header with Emoji/GIF -->
                <div style="text-align: center; margin-bottom: 20px;">
                    <h2 style="color: #4CAF50; margin: 0;">🎉 MaraProject Notification 🚀</h2>
                </div>

                <!-- Main Message Body -->
                <div style="font-size: 16px; color: #333333; line-height: 1.6; white-space: pre-line;">
                    ${options.message}
                </div>

                <!-- Optional Sticker / GIF Banner -->
                <div style="text-align: center; margin-top: 25px;">
                    <img src="https://media.giphy.com/media/3o7TKSjRrfIPjeiVyM/giphy.gif" alt="Success GIF" style="max-width: 150px; border-radius: 8px;" />
                </div>

                <!-- Footer -->
                <hr style="border: none; border-top: 1px solid #eeeeee; margin: 25px 0;" />
                <p style="font-size: 12px; color: #888888; text-align: center;">
                    This is an automated notification from <b>MaraProject</b>. Please do not reply to this email. 🌟
                </p>
            </div>
        </div>
    `;

    const mailOptions = {
        from: `MaraProject <${process.env.SMTP_MAIL}>`,
        to: options.email,
        subject: options.subject,
        html: htmlTemplate, // 👈 Yahan text ki bajaye HTML template pass kar di hai
    };

    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;