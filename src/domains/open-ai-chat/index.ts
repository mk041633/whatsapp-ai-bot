import {Config} from "../config";
import axios from "axios";

const openaiApiKey = Config.chatOpenAIKey;
export class openAiMain{
    static async  getChatResponse(userText: string) {
    try {
        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                "model": "gpt-3.5-turbo",
                "messages": [{
                    "role": "system",
                    "content": "Поговори с пользователем обо всем. Предлагай темы для обсуждения. Твоя задача поддерживать разгавор" //Привет, как ты ? , есть предложение по бизнесу

                }, {
                    "role": "user",
                    "content": `${userText}`,
                }],
                "max_tokens": 150
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${openaiApiKey}`,
                },

            }
        );
        return response.data.choices.map((choice: { message: { content: string; }; }) => choice.message.content.trim());
    } catch (error) {
        console.error('Ошибка при отправке запроса к OpenAI API:', error);
        return ['Произошла ошибка. Пожалуйста, попробуйте еще раз.'];
    }
}

    static async handleUserMessage(userText: string): Promise<string> {
    try {
        const responses = await openAiMain.getChatResponse(userText);
        let chatResponse: string = "";
        // Здесь вы можете отправить ответы обратно пользователю,
        // используя ваш механизм общения (например, WhatsApp API)
        for (let i = 0; i < responses.length; i++) {
            chatResponse += responses[i];
            console.log('Ответ бота:', responses[i]);
        }
        return chatResponse
    } catch (error) {
        console.error('Ошибка при обработке сообщения:', error);
        return ""
    }
}
}