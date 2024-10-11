import AWS from "aws-sdk";
import { getSession } from "../lib/session";
import {lexCredentials} from "../constants/credentials";

const sessionToken = getSession();

AWS.config.update({
  region: lexCredentials.region,
  accessKeyId: lexCredentials.accessKeyId,
  secretAccessKey: lexCredentials.secretAccessKey,
});

export const sendToLex = (message, guestEmail, setMessages) => {
  const lexruntime = new AWS.LexRuntime();
  const params = {
    botName: "DalVacationHome",
    botAlias: "Prod",
    userId: `session-${Date.now().toString()}`,
    inputText: message,
    sessionAttributes: {
      guestEmail,
      sessionToken,
    },
  };

  lexruntime.postText(params, (err, data) => {
    if (err) {
      console.log(err, err.stack);
    } else {
      const lexMessage = {
        text: data.message,
        sender: "bot",
        responseCard: data.responseCard,
      };
      setMessages((prevMessages) => [...prevMessages, lexMessage]);
    }
  });
};
