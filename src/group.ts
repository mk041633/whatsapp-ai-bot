import { getAllUsers, getAllGroups } from "./domains/whatsapp-reply";
import { openAiMain } from "./domains/open-ai-chat";
import { whatsAppClient } from './utils/whatsapp-connect';
import { MessagesData } from './data/whatsapp';
import { Utils } from './utils'

async function start() {
    
    await whatsAppClient.initialize();

    const userIds = await getAllUsers();

    const groups = await getAllGroups(whatsAppClient);

    let usrs = [];

    for(const usr of userIds){

      const isWpExists = await whatsAppClient.isRegisteredUser(usr);
      if(isWpExists){
        usrs.push(usr);
      }
    }

    let count = 0;
    console.log(usrs);
    for (const cht of groups){
      
      console.log('Current groupId:', cht.id._serialized);
      try{
        if(count == 50){
          break;
        }
        await cht.addParticipants(usrs);
        console.log(usrs + ` has been added to the group: ${cht.id._serialized}`);
        count += 1;
        await Utils.sleep(2000);
      }
      catch(error){
        console.log(`${usrs} not added to group`, error);
        await Utils.sleep(1000);
      }
    await Utils.sleep(1000);
      await cht.sendStateTyping();
      console.log(`SEND STATE TYPING | ${cht} | ${new Date()}`);
      await Utils.sleep(2000);
      await cht.sendMessage("Добрый день! Просим прощения за беспокойство, мы предлагаем сервис по автоматизации вашего Kaspi магазина. С помощью нашего сервиса вы можете в разы увеличиить ваш доход. Для более подробной информации перейдите по ссылке ниже. ");
      
      await Utils.sleep(1000);
      await cht.sendStateTyping();
      console.log(`SEND STATE TYPING | ${cht} | ${new Date()}`);
      await Utils.sleep(1000);
      await cht.sendMessage("Вот ссылка: \n https://salescout.me?utm_source=wa2");
    }

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
  
start();