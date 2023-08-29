import mongoose, { Document, Model, Schema, model } from "mongoose";
import { kaspiCollection } from './db/whatsapp/initDatabase';
import { Config } from "./domains/config";
import Queue from "bull";
import { Utils } from "./utils";
import { MessagesData } from "./data/whatsapp";
import { whatsAppClient } from "./utils/whatsapp-connect";

type MessageJobType = {
    chatId: string,
    text: string
}

export const messageQueue = new Queue<MessageJobType>('message-queue', { redis: Config.redisUrl });

export const BotSendMessage = {
    async sendMessage(chatId: string, text: string) {
        await Utils.sleep(1000);
        //await MessagesData.saveMessage({chatId:chatId, message:text, fromMe:true});
        await messageQueue.add({ chatId, text });
    }
};

messageQueue.process(async (job: { id: any; data: { chatId: any; text: any; }; }) => {
    console.log(`Processing job ${job.id}: ${JSON.stringify(job.data)}`);
    const { chatId, text } = job.data;
    /*const isWpExists = await whatsAppClient.isRegisteredUser(chatId);
    if(!isWpExists){
        console.log(
            `USER DOES NOT EXISTS IN WHATSAPP | ${chatId} | ${new Date()}`
          );
    }
    else{*/
        try {
            const chat = await whatsAppClient.getChatById(chatId);

            await chat.sendSeen();
            console.log(`CHAT SEEN | ${chatId} | ${new Date()}`);

            let beforeTimeout = parseInt((Math.random() * 500 + 2000).toString());
            await Utils.sleep(beforeTimeout);

            await chat.sendStateTyping();
            console.log(`SEND STATE TYPING | ${chatId} | ${new Date()}`);

            beforeTimeout = parseInt((Math.random() * 500 + 10000).toString());
            await Utils.sleep(beforeTimeout);

            await chat.clearState();

            beforeTimeout = parseInt((Math.random() * 500 + 1000).toString());
            await Utils.sleep(beforeTimeout);
            await whatsAppClient.sendMessage(chatId, text);

            beforeTimeout = parseInt((Math.random() * 500 + 2000).toString());
            await Utils.sleep(beforeTimeout);

            console.log(`Message sent to ${chatId}`);
        } catch (error) {
            console.error(`Error sending message to ${chatId}: ${error}`);
        }
    
})

