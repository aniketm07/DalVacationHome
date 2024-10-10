// index.mjs
import { sendNotification } from "./snsHandler.mjs";

export const handler = async (event) => {
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Credentials": true,
  };

  try {
    const body = JSON.parse(event.body);
    const { topicArn, message, subject } = body;

    if (!topicArn || !message || !subject) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          status: "failed",
          message: "Missing topic ARN, message, or subject in request",
        }),
        headers,
      };
    }

    // Send notification
    const messageId = await sendNotification(topicArn, message, subject);

    return {
      statusCode: 200,
      body: JSON.stringify({
        status: "success",
        message: "Notification sent successfully",
        messageId,
      }),
      headers,
    };
  } catch (error) {
    console.error("handler :: Error during notification process:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        status: "failed",
        message: "Internal server error",
      }),
      headers,
    };
  }
};
