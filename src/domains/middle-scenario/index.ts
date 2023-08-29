import {ScenarioFind} from "../scenariofind";
import {BotSendMessage} from "../../send-message-queue";
import { UserModel, MessagesModel } from '../../db/whatsapp';
import { middleMessagesWithStoreName, firstMessages } from "../whatsapp-reply/message-constraints";

export class MiddleScenario {

    static middleFind(chatId: string, textUser: string) {
        const textUserOldVer = textUser;

        let lowerCaseText = ScenarioFind.reformatUserText(textUser);

        const regexSynonymsReady = [/привет/i, /доброе утро/i, /слушаю/i, /здравствуйте/i, /добрый вечер/i, /добрый день/i]; // Добавьте сюда другие синонимы
        const regexSynonymsNotReady = [/занят/i]; // Добавьте сюда другие синонимы

        // Проверяем, содержит ли сообщение один из синонимов слова "да" или "нет"
        const containsReady = regexSynonymsReady.some((regex) => regex.test(lowerCaseText));
        const containsNotReady = regexSynonymsNotReady.some((regex) => regex.test(lowerCaseText));

        // Возвращаем результаты поиска
        switch (true) {
            case containsReady:
                this.handleYes(chatId, textUserOldVer);
                break;
            case containsNotReady:
                this.handleNo(chatId, textUserOldVer);
                break;
            default:
                this.handleOther(chatId, textUserOldVer);
                break;
        }
    }

    private static async handleYes(chatId: string, textUser: string) {
        let store = await UserModel.findOne({ chatId:chatId });
        const chatResponse: any = middleMessagesWithStoreName(store? store.store: '')[2];
        BotSendMessage.sendMessage(chatId, chatResponse);
    }
    
    private static handleNo(chatId: string, textUser: string) {
        const chatResponse = "Извиняюсь, напишу попозже";
        BotSendMessage.sendMessage(chatId, chatResponse);
    }

    private static handleOther(chatId: string, textUser: string) {
        const chatResponse = "Свяжемся с вами позже";
        BotSendMessage.sendMessage(chatId, chatResponse);
    }

}