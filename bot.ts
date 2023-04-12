import { Client, ClientOptions, GatewayIntentBits  } from "discord.js";
import * as dotenv from "dotenv";
import TelegramBot from "node-telegram-bot-api";
import fs from "fs";

dotenv.config()

const discordToken = process.env.DISCORD_TOKEN as string;
const telegramToken = process.env.TELEGRAM_TOKEN as string;
let chatId_str = process.env.TELEGRAM_CHATID as string;

let chatId = parseInt(chatId_str);

console.log("Bot is starting...");

const bot = new TelegramBot(telegramToken, {polling: true});

bot.onText(/\/update/, (msg) => {
    chatId = msg.chat.id == chatId ? chatId : msg.chat.id;
    console.log('update chatId');
    fs.writeFileSync('chatId.txt', chatId.toString()), {encoding: 'utf-8', flag: 'w'};
});

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

client.on('messageCreate', (message) => {
    bot.sendMessage(chatId, message.content);
})

client.login(discordToken);
