const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const chatIdTeste = "120363391407848498@g.us";
const chatIdTestByLucas = "120363416834910047@g.us";
const chatId = '557193631886-1433983949@g.us';
const chatJulia = "557499990520@c.us";
const messageConfirmation = 'Olá!\n\nEu sou o Kowalski 🐧, uma automação criada para auxiliar a comunidade do curso de ADS - IFBA, campus SSA.\n\nPra entrar no grupo de ADS, por favor informar o número da matrícula.';

const wwebVersion = '2.3000.1015010030-alpha';

const client = new Client({
    puppeteer: {
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    },
    authStrategy: new LocalAuth(
        { dataPath: 'wppSessionData' }
    ),
    webVersionCache: {
        type: 'remote',
        remotePath: `https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/${wwebVersion}.html`,
    }
});

client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
});

const objects = {
    '!link': 'Links úteis: https://linktr.ee/ads.ifba',
    '!discord': 'Link do Discord: https://discord.gg/PrR9byfFAn',
    '!telegram': 'Link do Telegram: https://t.me/%20Xm8nkV1i34M1NTBh',
    '!sala': 'Link do aplicativo para encontrar a sua sala (2024.1): https://find-your-class-front.vercel.app/',
    '!calendario': 'Link do calendário acadêmico: https://portal.ifba.edu.br/salvador/documentos/ensino/calendarios-academicos/2025/calendario_superior_2025.pdf',
    '!suap': 'Link do suap: https://suap.ifba.edu.br/accounts/login/?next=/',
    '!ping': 'pong 🏓',
    '!help': 'Comandos disponíveis: \n\n!link \n!discord \n!telegram \n!sala \n!calendario \n!suap \n!ping'
};

client.on('group_membership_request', async (notification) => {
    const requesterId = notification.author;
    await client.sendMessage(requesterId, messageConfirmation);
    const formattedRequesterId = requesterId.replace('55', '').split('@')[0];
    return client.sendMessage(chatJulia, `Nova solicitação de entrada no grupo de ADS: ${formattedRequesterId}`);
});

client.on('group_join', async (notification) => {
    if (notification.chatId === chatId) {
        const chat = await notification.getChat();
        const user = notification.id.participant;
        return chat.sendMessage(`Bem-vindo ao grupo, @${user.split('@')[0]}!`, {
            mentions: [user]
        });
    }
    return true
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
    return true
});

client.on('message_revoke_everyone', async (after, before) => {
    const messageText = `@${before.author.split('@')[0]} enviou uma mensagem e apagou! \n Mensagem: ${before.body}`;
    if (before) {
        console.log(before);
        return await client.sendMessage(before.from, messageText, {
            mentions: [before.author]
        });
    }
    return await client.sendMessage(before.from, messageText);
});

client.on('ready', () => {
    console.log('Client is ready!');
});

client.initialize();
