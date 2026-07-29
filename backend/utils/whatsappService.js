const { makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys');
const qrcode = require('qrcode-terminal');
const P = require('pino');

let sock;

// WhatsApp Connection Start karne ke liye function
const connectToWhatsApp = async () => {
    const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys');
    
    sock = makeWASocket({
        auth: state,
        printQRInTerminal: true,
        logger: P({ level: 'silent' })
    });

    sock.afterConnect = () => {
        console.log("WhatsApp Connected Successfully!");
    };

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect, qr } = update;
        if (qr) {
            console.log("Scan this QR Code in WhatsApp:");
            qrcode.generate(qr, { small: true });
        }
        if (connection === 'close') {
            const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
            if (shouldReconnect) {
                connectToWhatsApp();
            }
        } else if (connection === 'open') {
            console.log('WhatsApp connection opened successfully!');
        }
    });

    sock.ev.on('creds.update', saveCreds);
};

// Message bhejne ka function
const sendWhatsAppMessage = async (phone, message) => {
    try {
        if (!sock) {
            console.log("WhatsApp socket not ready yet.");
            return;
        }
        // Phone number ko WhatsApp format me convert karna (e.g. 923001234567@s.whatsapp.net)
        let formattedPhone = phone.replace(/[^0-9]/g, '');
        if (!formattedPhone.includes('@s.whatsapp.net')) {
            formattedPhone = `${formattedPhone}@s.whatsapp.net`;
        }

        await sock.sendMessage(formattedPhone, { text: message });
        console.log("WhatsApp message sent successfully!");
    } catch (error) {
        console.log("Failed to send WhatsApp message:", error.message);
    }
};

module.exports = { connectToWhatsApp, sendWhatsAppMessage };