"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const whatsapp_web_js_1 = require("whatsapp-web.js");
const qrcode_terminal_1 = __importDefault(require("qrcode-terminal"));
const whatsapp_reply_1 = require("./src/domains/whatsapp-reply");
const whatsAppClient = new whatsapp_web_js_1.Client({
    authStrategy: new whatsapp_web_js_1.LocalAuth({}),
    puppeteer: {
        headless: true,
        args: ["--no-sandbox", "--disabled-setupid-sandbox"],
    },
});
function authenticated() {
    console.log(`WHATSAPP CLIENT SUCCESFULLY AUTHENTICATED | ${new Date()}`);
}
function qr(qr) {
    qrcode_terminal_1.default.generate(qr, {
        small: true,
    });
}
function start() {
    return __awaiter(this, void 0, void 0, function* () {
        whatsAppClient.on("qr", qrcode_terminal_1.default.generate({ small: true }));
        whatsAppClient.on("authenticated", authenticated);
        (0, whatsapp_reply_1.sendFirstMessage)(whatsAppClient, "77084875400@c.us");
    });
}
