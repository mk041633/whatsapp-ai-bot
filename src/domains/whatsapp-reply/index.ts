import { initDatabase, kaspiCollection, kaspiCollection2 } from '../../db/whatsapp/initDatabase';
import { IUserInfo, IMessages, UserModel, MessagesModel, IKaspi, KaspiModel } from '../../db/whatsapp';
import { Client, Message, GroupChat } from "whatsapp-web.js";
import { middleMessagesWithStoreName, firstMessages } from "./message-constraints";
import { MessagesData } from "../../data/whatsapp";
import {ScenarioFind} from '../scenariofind';
import {BotSendMessage} from '../../send-message-queue';
import {MiddleScenario} from '../middle-scenario';
import {openAiMain} from "../open-ai-chat";
import {openAiBool} from '../open-ai-chat-bool';
import {openAiCom} from '../open-ai-chat-com';
import {whatsAppClient} from '../../utils/whatsapp-connect';
import { Db } from 'mongodb';

const COLLECTION_NAME = 'kaspi';

let db: Db;
let counter = 0;
;

async function isFirstTime(chatId:string){
    const msg = await MessagesModel.find({chatId: chatId});
    let check = msg? true: false;
    return check;
}

export async function getAllGroups(client:Client){

    // Get the chats (groups and contacts)
    const chats = await client.getChats() as GroupChat[];
     
    // Find the group with a matching title or description
    const matchingGroup = chats.filter((chat) => chat.isGroup);

    return matchingGroup;
}
/*
export async function sendFirstMessage(){
    const data = await getAllUsers();
    data.forEach(async element => {
        if(element.status == true){
            console.log(element.storePhone);
        }
        else{
           BotSendMessage.sendMessage(element.storePhone.replace("+","") + "@c.us", "Здравствуйте!" + "\n\n" +

        `Вы когда-нибудь задумывались о том, как существенно упростить управление своим бизнесом ${element.storeName}? ` + "\n\n" +
        
        "Salescout - ваш надежный помощник в автоматизации бизнес-процессов. Наш сервис позволяет сэкономить ваше время и ресурсы, а также повысить эффективность работы вашей компании. "+ "\n\n"+
        
        "Присоединяйтесь к нашим довольным клиентам и начните путь к эффективности и успеху уже сегодня!" + "\n\n" +
        
        `Вот ссылка: \n https://salescout.me?utm_source=wa2`);
        }
        
        
    });
    //BotSendMessage.sendMessage(id, firstMessages()[2]);
}*/

export async function getAllUsers(){

    const data = await MessagesData.getAllUsers();
    const chatIds: string[] = data.map((data) => data.storePhone.replace('+','') + "@c.us");
    return chatIds;

}
export async function getAllUsers2(){
    /*
    const userInfoList: IUserInfo[] = await UserModel.find({}, 'chatId');
    const chatIds: string[] = userInfoList.map((userInfo) => userInfo.chatId);

    return chatIds;*/
    await initDatabase();
    const data = await kaspiCollection.find().toArray();

    const chatIds: string[] = data.map((data) => data.storePhone.replace('+','') + "@c.us");
    /*
    const userInfoList: IKaspi[] = await KaspiModel.find({}, "storePhone");
    console.log(userInfoList);
    const chatIds: string[] = userInfoList.map((userInfo) => userInfo.storePhone.replace('+','') + "@c.us");
*/
    return chatIds;
}
async function handleNewMessage(msg: Message){
    console.log(msg.body);
    console.log(msg.from);
    console.log(msg.fromMe);
    //const history: IMessages[] = await MessagesModel.find({'chatId':msg.from, 'fromMe':false});
    //const msgHistory: string[] = history.map((userInfo) => userInfo.message);
    let msgs = '';
    const bl = await openAiBool.handleUserMessage(msg.body);
    if(bl == 'true' || bl == 'True'){
        msgs = await openAiMain.handleUserMessage( msg.body);
    }
    else {
        msgs = await openAiCom.handleUserMessage( msg.body);
    }
    BotSendMessage.sendMessage(msg.from, msgs);
    //ScenarioFind.find(msg.from, msg.body);
    await MessagesData.saveMessage({chatId:msg.from, message:msg.body, fromMe:msg.fromMe});
}

async function handleNewMessage2(msg: Message){
    let msgs = '';
    msgs = await openAiMain.handleUserMessage( msg.body);
    BotSendMessage.sendMessage(msg.from, msgs);
}

export { handleNewMessage, handleNewMessage2 };