import axios from "axios";
import { getRandomPropertyAgent } from "./dbHandler.mjs";
import { getRole } from "./sessionHandler.mjs";

const API_URL = process.env.API_URL;

export const handler = async (event) => {
  // Log the incoming event for debugging purposes
  console.log(event);
  let responseToLex = "";
  const agentEmail = await getRandomPropertyAgent();
  const guestEmail = event.sessionAttributes.guestEmail;
  const sessionToken = event.sessionAttributes.sessionToken;
  if (!agentEmail || !guestEmail || !sessionToken) {
    responseToLex = "Error creating a Ticket. Please try again.";
  } else {
    const role = await getRole(sessionToken);
    if (role !== "GUEST") {
      responseToLex =
        "Access denied. User is not authorized to raise a ticket as you are not a guest. Please contact support.";
    } else {
      const publishData = {
        agentEmail,
        guestEmail,
      };

      try {
        const response = await axios.post(API_URL, publishData);
        responseToLex =
          "Ticket created successfully. Ticket Id: " +
          response.data +
          ". Please visit your Chat section to talk with our agent. ";
        console.log("POST request response:", response.data);
      } catch (error) {
        responseToLex = "Error creating a Ticket. Please try again.";
        console.error("Error making POST request:", error);
      }
    }
  }

  // Create a response to send back to Lex
  const lexResponse = {
    dialogAction: {
      type: "Close",
      fulfillmentState: "Fulfilled",
      message: {
        contentType: "PlainText",
        content: responseToLex,
      },
    },
  };

  // Return the response
  return lexResponse;
};
