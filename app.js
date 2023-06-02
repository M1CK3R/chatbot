// Supports ES6
// import { create, Whatsapp } from 'venom-bot';
const venom = require('venom-bot');
const dialogflow = require("./dialogflow")

venom
  .create({
    session: 'session-name', //name of session
    multidevice: false // for version not multidevice use false.(default: true)
  })
  .then((client) => start(client))
  .catch((erro) => {
    console.log(erro);
  });

function start(client) {
    client.onMessage(async (message) => {
      console.log(message);
      let payload=await dialogflow.sendToDialogFlow(message.body,"123123");
      let responses=payload.fulfillmentMessages;
      for (const response of responses) {
        await sendMessageToWhatsapp(client, message, response);
      }
    });
}

function sendMessageToWhatsapp(client, message, response) {
    return new Promise ((resolve, reject) => {
        client
        .sendText(message.from, response.text.text[0])
        .then((result) => {
            console.log('Result: ', result); //return object success
            resolve(result);
        })
        .catch((erro) => {
            console.error('Error when sending: ', erro);
            reject(erro);
        });
    });
}
