const nodemailer = require("nodemailer");
require('dotenv').config();

// Create a test account or replace with real credentials.
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_SERVER_NAME,
    port: process.env.SMTP_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_APP_PASSWORD,
    },
});

async function main() {
    const recipient = ''; // input your recipient
    if (!recipient) {
        throw new Error("Missing email receiver!");
    }

    const message = {
        from: process.env.SMTP_USERNAME,
        to: recipient,
        subject: "Hello ✔",
        text: "Hello world?", // plain‑text body
        html: "<b>Hello world?</b>", // HTML body
    };

    console.log("Sending ...");

    const info = await transporter.sendMail(message);

    console.log("Message sent:", info.messageId);
}

main().catch(err => {
    console.error('❌ Error:', err);
});
