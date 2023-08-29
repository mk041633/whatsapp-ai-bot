import { handleNewMessage2 } from "./domains/whatsapp-reply";
import {Client, Message} from "whatsapp-web.js";
import qrcode from "qrcode-terminal";
import { openAiMain } from "./domains/open-ai-chat";
import { Utils } from "./utils";
import Queue from "bull";
import { Config } from "./domains/config";

type MessageJobType = {
  chatId: string,
  text: string
}

const messageQueue4 = new Queue<MessageJobType>('message-queue4', { redis: Config.redisUrl });

function authenticated() {
  console.log(`WHATSAPP CLIENT SUCCESFULLY AUTHENTICATED | ${new Date()}`);
}

function qr(qr: string) {
  qrcode.generate(qr, {
    small: true,
  });
}

const whatsAppClient = new Client({
      
  puppeteer: {
    headless: true,
    args: ["--no-sandbox", "--disabled-setupid-sandbox"],
  },
});

async function start() {

  whatsAppClient.on("qr", qr);
  
  whatsAppClient.on("authenticated", authenticated);

  await whatsAppClient.initialize();

  whatsAppClient.on("message", async (msg:Message) => {
            const text = await openAiMain.handleUserMessage( msg.body);
            const chatId = msg.from;

            await messageQueue4.add({ chatId, text });
  });
}

messageQueue4.process(async (job: { id: any; data: { chatId: any; text: any }; }) => {
  console.log(`Processing job ${job.id}:`);
  const { chatId, text } = job.data;
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
  
start();