const { makeWASocket } = require("@whiskeysockets/baileys");
const {
  useMultiFileAuthState,
  DisconnectReason,
} = require("@whiskeysockets/baileys");

async function connectToWhatsApp() {
  const { state, saveCreds } = await useMultiFileAuthState("auth_info_baileys");
  const sock = makeWASocket({
    printQRInTerminal: true,
    auth: state,
  });

  sock.ev.on("creds.update", saveCreds);
  sock.ev.on("connection.update", (update) => {
    const { connection, lastDisconnect } = update;
    if (connection === "close") {
      // if user logout then it will be false else it will true then it try to reconnect
      const shouldReconnect =
        lastDisconnect?.error?.output?.statusCode !==
        DisconnectReason.loggedOut;
      console.log(
        "connection closed due to ",
        lastDisconnect?.error,
        ", reconnecting ",
        shouldReconnect
      );
      // reconnect if not logged out
      if (shouldReconnect) {
        connectToWhatsApp();
      }
    } else if (connection === "open") {
      console.log("Connected");
    }
  });
  sock.ev.on("messages.upsert", async (m) => {
    console.log(m); //When you receive any message, will be show here
  });
}

connectToWhatsApp();
