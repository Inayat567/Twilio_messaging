const { makeWASocket } = require("@whiskeysockets/baileys");
const {
  useMultiFileAuthState,
  DisconnectReason,
} = require("@whiskeysockets/baileys");
const { Mimetype } = require("@whiskeysockets/baileys");

type MessageProp = {
  type: string;
  content: string;
};

const Message: MessageProp = {
  //for Text
  type: "text",
  content: "آپ کی ادائیگی 2000 روپے موصول آپ کے بقایا جات 1500 روپے ہیں۔",

  //for Docmument
  // type: 'document',
  // content: './dummy.pdf',

  //for Image
  // type: 'image',
  // content: './logo.jpeg',

  //for Audio
  // type: 'audio',
  // content: './voice.ogg',
};

const whatAppGroupID: string = "923000603149-1598644280@g.us";

async function sendMessageToWahtApp(
  whatAppGroupID: string,
  message: MessageProp
) {
  let globalSock;

  const { state, saveCreds } = await useMultiFileAuthState("auth_info_baileys");
  const sock = makeWASocket({
    printQRInTerminal: true,
    auth: state,
  });
  globalSock = sock;

  try {
    let finalMessage;
    if (message.type == "text") {
      finalMessage = { text: message.content };
    } else if (message.type == "document") {
      finalMessage = {
        document: { url: message.content },
        mimetype: "application/pdf",
        filename: "Bakery Detail Sample.pdf",
      };
    } else if (message.type == "image") {
      finalMessage = {
        image: { url: message.content },
      };
    } else if (message.type == "audio") {
      (finalMessage = {
        audio: { url: message.content },
        mimetype: "audio/mp4",
      }),
        { url: message.content };
    }

    const sent = await globalSock?.sendMessage(whatAppGroupID, finalMessage);
    // store[sent.key.id]= sent;
  } catch (e) {
    console.log("Error is Sending Message : ", e);
  }
}

sendMessageToWahtApp(whatAppGroupID, Message);
