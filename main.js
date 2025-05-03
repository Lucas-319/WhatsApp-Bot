require('dotenv').config();
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const qrcodeImage = require('qrcode');
const express = require('express');

const app = express();
let qrCodeData = null;

const chatIdTeste = process.env.CHAT_ID_TESTE;
const chatIdTestByLucas = process.env.CHAT_ID_TEST_BY_LUCAS;
const chatId = process.env.CHAT_ID;
const chatJulia = process.env.CHAT_JULIA;
const messageConfirmation = 'Olá!\n\nEu sou o Kowalski 🐧, uma automação criada para auxiliar a comunidade do curso de ADS - IFBA, campus SSA.\n\nPra entrar no grupo de ADS, por favor informar o número da matrícula.';

const client = new Client({
    puppeteer: {
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        headless: true,
        executablePath: require('puppeteer').executablePath()
    },
    authStrategy: new LocalAuth({ dataPath: 'wppSessionData' })
});

client.on('qr', qr => {
    qrCodeData = qr;
    console.log('QR Code recebido, acesse /qrcode para visualizá-lo.');
    qrcode.generate(qr, { small: true });
});

app.get('/qrcode', (_, res) => {
    if (!qrCodeData) {
        console.log('QR Code ainda não gerado.');
        return res.status(404).send('QR Code ainda não gerado. Aguarde...');
    }
    qrcodeImage.toDataURL(qrCodeData, (err, url) => {
        if (err) {
            console.error('Erro ao gerar QR Code:', err);
            return res.status(500).send('Erro ao gerar QR Code.');
        }
        const html = `
            <html>
                <body>
                    <h1>Escaneie o QR Code abaixo:</h1>
                    <img src="${url}" alt="QR Code" />
                </body>
            </html>
        `;
        res.send(html);
    });
});

app.listen(8000, () => {
    console.log('Servidor HTTP rodando na porta 8080. Acesse /qrcode para visualizar o QR Code.');
});

const objects = {
    '!link': 'Links úteis: https://linktr.ee/ads.ifba',
    '!discord': 'Link do Discord: https://discord.gg/PrR9byfFAn',
    '!telegram': 'Link do Telegram: https://t.me/%20Xm8nkV1i34M1NTBh',
    '!emile': 'Link do App Emile: \n\n[Android] = https://play.google.com/store/apps/details?id=br.edu.ifba.gsort_emile \n\n[IOS] = https://apps.apple.com/us/app/emile/id1525888004',
    '!sala': 'Link do aplicativo para encontrar a sua sala (2025.1): https://find-your-class-front.vercel.app/',
    '!aula': 'Link do aplicativo "Que Aula": https://que-aula.vercel.app/',
    '!calendario': 'Link do calendário acadêmico: https://portal.ifba.edu.br/salvador/documentos/ensino/calendarios-academicos/2025/calendario_superior_2025.pdf',
    '!suap': 'Link do suap: https://suap.ifba.edu.br/accounts/login/?next=/',
    '!ping': 'pong 🏓',
    '!help': 'Comandos disponíveis: \n\n!link \n!discord \n!telegram \n!emile \n!sala \n!aula \n!calendario \n!suap \n!ping'
};

client.on('group_membership_request', async (notification) => {
    const requesterId = notification.author;
    await client.sendMessage(requesterId, messageConfirmation);
    const formattedRequesterId = requesterId.replace('55', '').split('@')[0];
    return client.sendMessage(chatJulia, `Nova solicitação de entrada no grupo de ADS: ${formattedRequesterId}`);
});

client.on('group_join', async (notification) => {
    if (notification.chatId === chatId || notification.chatId === chatIdTestByLucas) {
        const chat = await notification.getChat();
        const user = notification.id.participant;
        return chat.sendMessage(`Bem-vindo ao grupo, @${user.split('@')[0]}!`, {
            mentions: [user]
        });
    }
    return true;
});

client.on('message', message => {
    if (message.body.startsWith('!')) {
        const command = message.body.slice(1).toLowerCase();
        if (objects.hasOwnProperty('!' + command)) {
            return message.reply(objects['!' + command]);
        } else {
            return message.reply('Comando não encontrado. Use !help para ver a lista de comandos disponíveis.');
        }
    }
    return true;
});

client.on('auth_failure', (msg) => {
    console.error('Falha na autenticação:', msg);
});

client.on('disconnected', (reason) => {
    console.error('Cliente desconectado:', reason);
});

client.on('ready', () => {
    console.log('Client is ready!');
});

client.initialize();
