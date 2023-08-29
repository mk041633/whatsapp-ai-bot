import {
  Chat,
  Client,
  LocalAuth,
  Message,
  MessageContent,
  MessageSendOptions,
  ClientInfo,
  GroupChat
} from "whatsapp-web.js";
import { getAllUsers, getAllGroups } from "./domains/whatsapp-reply";
import { openAiMain } from "./domains/open-ai-chat";
import { whatsAppClient } from './utils/whatsapp-connect';
import { MessagesData } from './data/whatsapp';
import { Utils } from './utils'
import Queue from "bull";
import { Config } from "./domains/config";

type MessageJobType = {
  chatId: string,
  text: string
}

const messageQueue = new Queue<MessageJobType>('message-queue', { redis: Config.redisUrl });

async function randomName() {
  let names = ["Айдар","Айжан","Меруерт","Нуржан","Ернар"];
  const randomNumber: number = Math.floor(Math.random() * 5);
  return names[randomNumber];
}
async function start() {
    
    await whatsAppClient.initialize();

    
    whatsAppClient.on("message", async (msg:Message) => {
      const text = "Мы предлагаем сервис по автоматизации вашего Kaspi магазина. Одной из функции является автоизменения цены с адаптацией под конкурентов. С помощью нашего сервиса вы можете в разы увеличить ваш доход. Для более подробной информации перейдите по ссылке ниже: \n https://salescout.me?utm_source=wa2";
      const chatId = msg.from;

      await messageQueue.add({ chatId, text });
});

messageQueue.process(async (job: { id: any; data: { chatId: any; text: any }; }) => {
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
  
});


    /*
    for (const cht of groups){

      console.log('Current groupId:', cht.id._serialized);

      for(const usr of userIds){

          const isWpExists = await whatsAppClient.isRegisteredUser(usr);

          console.log([usr])

          if(isWpExists){
            try{
              if(count == 10){
                process.exit;
              }
              await cht.addParticipants([usr]);
              console.log(`${usr} has been added to the group: ${cht.id._serialized}`);
              await MessagesData.updateMerchant(usr, true)
              count ++;
              await Utils.sleep(1000);
            }
            catch(error){
              await MessagesData.updateMerchant(usr, false)
              console.log(`${usr} not added to group`, error);
              await Utils.sleep(1000);
            }
          }
          
      } 
      await Utils.sleep(1000);

      await cht.sendMessage(await openAiMain.handleUserMessage("Расскажи про ваш сервис"));
      
      await Utils.sleep(2000);

      await cht.sendMessage("Вот ссылка: \n https://salescout.me?utm_source=wa2");
    
    }*/
  }

  async function checkUser(){
    await whatsAppClient.initialize();
    const userIds = await getAllUsers();
    let isWpExists = false;
    for(const usr of userIds){
      try{
        isWpExists = await whatsAppClient.isRegisteredUser(usr);
      } catch(error){
        console.log(usr + " " + error);
        MessagesData.updateMerchant(usr, true);
      }
      if(!isWpExists){
        MessagesData.updateMerchant(usr, true);
      }
    }
    console.log("Succes");
  }
  async function sendFirstMessage(){
    const userIds = await getAllUsers();
    console.log(userIds)
  
      let count = 0;
      //console.log(userIds);
      for (const cht of userIds){
        
        if(count == 10){
            break;
        }
        try{
        console.log(`SENDING MESSAGE| ${cht} | ${new Date()}`);
        await Utils.sleep(5000);
        await whatsAppClient.sendMessage(cht, "Добрый день! Меня зовут " + await randomName() + ". Я представляю компанию SaleScout. У нас есть очень интересное предложение по увеличению дохода вашего kaspi магазина. Если интересно можете ответить на это сообщение и я вам скину ссылку на наш сайт с более подробной информацией.");
        count += 1;
        MessagesData.updateMerchant(cht, true);
        } catch(error){
          console.log(cht + " " + error);
        }
      }
  }

setInterval(sendFirstMessage, 3 * 60 * 1000);

start();
//checkUser();