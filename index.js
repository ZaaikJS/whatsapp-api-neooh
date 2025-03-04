const express = require('express');
const { Client, LocalAuth } = require('whatsapp-web.js');
const QRCode = require('qrcode');
const app = express();
const port = 3000;

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: { headless: true }
});

client.on('ready', () => {
    console.log('WhatsApp client is ready');
});

client.on('qr', (qr) => {
    QRCode.toDataURL(qr, (err, url) => {
        if (err) {
            console.error('Erro ao gerar QR Code:', err);
            return;
        }

        app.locals.qrCodeUrl = url;
    });
});

client.initialize();

app.get('/connect', (req, res) => {
    if (app.locals.qrCodeUrl) {
        res.send(`<h1>Escaneie o QR Code para conectar</h1><img src="${app.locals.qrCodeUrl}" alt="QR Code">`);
    } else {
        res.status(400).send('QR Code ainda não gerado.');
    }
});

app.get('/createGroup', async (req, res) => {
    const { name, desc, members } = req.query;

    if (!name || !members) {
        return res.status(400).send('Faltando parâmetros obrigatórios: "name" e "members".');
    }

    const memberArray = members.split(',').map(member => `${member.trim()}@c.us`).filter(member => member !== '@c.us');

    try {
        const group = await client.createGroup(name, memberArray);
        console.log('Grupo criado:', group);

        res.status(200).send(`Grupo criado com sucesso: ${group.gid._serialized}`);
    } catch (error) {
        console.error('Erro ao criar o grupo:', error);
        res.status(500).send('Erro ao criar o grupo.');
    }
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
