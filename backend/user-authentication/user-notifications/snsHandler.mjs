// snsHandler.mjs
import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";

// Initialize the SNS Client
const snsClient = new SNSClient({});

// Function to send a notification
export const sendNotification = async (topicArn, message, subject) => {
  const params = {
    TopicArn: topicArn,
    Message: message,
    Subject: subject,
  };

  try {
    const data = await snsClient.send(new PublishCommand(params));
    console.log("Message sent to the topic:", topicArn);
    console.log("MessageID is " + data.MessageId);
    return data.MessageId;
  } catch (error) {
    console.error("Error sending SNS notification:", error);
    throw new Error("Failed to send SNS notification");
  }
};
