const { ImapFlow } = require('imapflow');
const { simpleParser } = require('mailparser');
require('dotenv').config();

const client = new ImapFlow({
    host: process.env.IMAP_SERVER_NAME,       // change to your IMAP server
    port: process.env.IMAP_PORT,
    secure: process.env.IMAP_SSL_REQUIRED,
    auth: {
        user: process.env.IMAP_USERNAME,
        pass: process.env.IMAP_APP_PASSWORD   // use app password if needed
    }
});

async function main() {
    await client.connect();
    console.log('✅ Connected to IMAP server');

    // Select and lock the mailbox
    let lock = await client.getMailboxLock('INBOX');
    console.log('📥 Listening to INBOX...');

    // Event for new messages
    client.on('exists', async () => {
        // Fetch latest message (most recent UID)
        let message = await client.fetchOne('*', { source: true });
        const parsed = await simpleParser(message.source);

        console.log('📧 New Email Received');
        console.log('From:', parsed.from?.text);
        console.log('Subject:', parsed.subject);
        console.log('Body:', parsed.text);
    });

    // Keep the lock open to keep listening
    // DO NOT release the lock
    // await lock.release(); <-- don't do this!
}

main().catch(err => {
    console.error('❌ Error:', err);
});
