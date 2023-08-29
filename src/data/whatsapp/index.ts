import { MessagesModel } from '../../db/whatsapp';
import { initDatabase, kaspiCollection } from '../../db/whatsapp/initDatabase';


initDatabase();

export type NewMessageType = {
    chatId: string;
    message: string;
    fromMe: boolean;
}

class MessagesData {
    constructor() { }

    static async saveMessage(messageFrom: NewMessageType) {
        const msg = new MessagesModel(messageFrom);
        return await msg.save();
    }

    static async updateMerchant(chatId:String, status:Boolean){
        await kaspiCollection.updateOne({"storePhone":"+" + chatId.replace("@c.us","")}, { $set: {"status":status}});
    }

    static async getAllUsers(){
        return await kaspiCollection.find( {status: { $exists: false } }).toArray();
    }
}



export { MessagesData };
