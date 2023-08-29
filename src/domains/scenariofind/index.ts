import {BotSendMessage} from "../../send-message-queue";
import {openAiMain} from "../open-ai-chat";
import { UserModel, MessagesModel } from '../../db/whatsapp';
import { middleMessagesWithStoreName, firstMessages } from "../whatsapp-reply/message-constraints";

export class ScenarioFind {
    public static find(chatId: string, textUser: string) {
        const textUserOldVer = textUser;

        let lowerCaseText = ScenarioFind.reformatUserText(textUser);
        const regexSynonymsReady = [/привет/i, /доброе утро/i, /слушаю/i, /здравствуйте/i, /добрый вечер/i, /добрый день/i]; // Добавьте сюда другие синонимы
        const regexSynonymsNotReady = [/занят/i]; // Добавьте сюда другие синонимы

        // Проверяем, содержит ли сообщение один из синонимов слова "да" или "нет"
        const containsReady = regexSynonymsReady.some((regex) => regex.test(lowerCaseText));
        const containsNotReady = regexSynonymsNotReady.some((regex) => regex.test(lowerCaseText));
        // Массив регулярных выражений для синонимов слов "да" и "нет" -  \b добавить мб
        const regexSynonymsYes = [/да/i, /конечно/i, /слушаю/i, /с радостью/i]; // Добавьте сюда другие синонимы
        const regexSynonymsNo = [/нет/i, /не хочу/i, /не интересно/i, /не понравилось/i]; // Добавьте сюда другие синонимы

        // Проверяем, содержит ли сообщение один из синонимов слова "да" или "нет"
        const containsYes = regexSynonymsYes.some((regex) => regex.test(lowerCaseText));
        const containsNo = regexSynonymsNo.some((regex) => regex.test(lowerCaseText));

        // Возвращаем результаты поиска
        switch (true) {
            case containsReady:
                this.handleReady(chatId, textUserOldVer);
                break;
            case containsNotReady:
                this.handleNotReady(chatId, textUserOldVer);
                break;
            case containsYes:
                this.handleYes(chatId, textUserOldVer);
                break;
            case containsNo:
                this.handleNo(chatId, textUserOldVer);
                break;
            default:
                this.handleOther(chatId, textUserOldVer);
                break;
        }
    }
    private static async handleReady(chatId: string, textUser: string) {
        let store = await UserModel.findOne({ chatId:chatId });
        const chatResponse: any = middleMessagesWithStoreName(store? store.store: '')[2];
        BotSendMessage.sendMessage(chatId, chatResponse);
    }
    private static handleNotReady(chatId: string, textUser: string) {
        const chatResponse = "Извиняюсь, напишу попозже";
        BotSendMessage.sendMessage(chatId, chatResponse);
    }
    private static async handleYes(chatId: string, textUser: string) {
        const chatResponse = await openAiMain.handleUserMessage(textUser);
        BotSendMessage.sendMessage(chatId, chatResponse);
    }

    private static handleNo(chatId: string, textUser: string) {
        const chatResponse = "Извиняюсь, пока";
        BotSendMessage.sendMessage(chatId, chatResponse);
    }

    private static handleOther(chatId: string, textUser: string) {
        const chatResponse = "Свяжемся с вами позже";
        BotSendMessage.sendMessage(chatId, chatResponse);
    }

    public static reformatUserText(textUser: string): string {

        // Удаляем все символы и знаки препинания, оставляя только буквы и пробелы
        const cleanedText = textUser.replace(/[^\p{L}\s]/gu, '');

        // Добавляем пробелы между словами
        const spacedText = cleanedText.replace(/\s+/g, ' ').trim();

        // Приводим сообщение пользователя к нижнему регистру
        return spacedText.toLowerCase()
    }

}
