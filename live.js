import fetch from "node-fetch";
import { setTimeout } from "timers";
import * as dotenv from "dotenv";
import TelegramBot from "node-telegram-bot-api";
import fs from "fs";

dotenv.config();

const telegramToken = process.env.TELEGRAM_TOKEN;
let chatId_str = process.env.TELEGRAM_CHATID;
const channels = { supertf: false };


let chatId = parseInt(chatId_str);
console.log("Bot is starting...");
const bot = new TelegramBot(telegramToken, { polling: true });

bot.onText(/\/update/, (msg) => {
    chatId = msg.chat.id == chatId ? chatId : msg.chat.id;
    console.log("update chatId");
    fs.writeFileSync("chatId.txt", chatId.toString()),
        { encoding: "utf-8", flag: "w" };
});

async function checkLive() {
    for (let channelName in channels) {
        let response = await fetch(`https://www.twitch.tv/${channelName}`);
        let responseText = await response.text();

        if (
            responseText.includes("isLiveBroadcast") &&
            !channels[channelName]
        ) {
            channels[channelName] = true;
            bot.sendMessage(chatId, `${channelName} is live`);
        } else if (!responseText.includes("isLiveBroadcast") && channels[channelName]) {
            channels[channelName] = false;
        }
    }
}

setTimeout(checkLive, 1000 * 30);