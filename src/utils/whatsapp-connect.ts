import {
    Client,
    LocalAuth,
  } from "whatsapp-web.js";
import qrcode from "qrcode-terminal";

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

whatsAppClient.on("qr", qr);

whatsAppClient.on("authenticated", authenticated);

export {whatsAppClient};
