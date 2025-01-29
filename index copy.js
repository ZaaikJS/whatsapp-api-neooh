console.log("Iniciando o bot...");

const { Client, LocalAuth } = require('whatsapp-web.js');

// Criando o cliente WhatsApp
const client = new Client({
    authStrategy: new LocalAuth(), // Mantém a sessão ativa sem precisar escanear o QR sempre
    puppeteer: { headless: true } // Se quiser ver o navegador, altere para false
});

// Exibir QR Code no terminal
client.on('qr', qr => {
    const qrcode = require('qrcode-terminal');
    qrcode.generate(qr, { small: true });
    console.log('Escaneie o QR Code para logar no WhatsApp');
});

// Quando o cliente estiver pronto
client.on('ready', async () => {
    console.log('Bot conectado ao WhatsApp!');

    const numero = '553181128756@c.us'; // Número no formato correto

    try {
        await client.sendMessage(numero, 'Olá! Esta é uma mensagem de teste enviada pelo bot. 🤖');
        console.log('Mensagem enviada com sucesso!');
    } catch (err) {
        console.error('Erro ao enviar a mensagem:', err);
    }
});

// Inicia o cliente
client.initialize();
