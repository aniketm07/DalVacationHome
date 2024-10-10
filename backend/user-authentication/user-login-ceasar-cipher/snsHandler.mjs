import { SNSClient, PublishCommand, SubscribeCommand } from "@aws-sdk/client-sns";

// Initialize the SNS Client
const snsClient = new SNSClient({ region: 'us-east-1' }); // Change the region if needed

// Function to subscribe an email to an SNS topic
export const subscribeToSNSTopic = async (email, topicArn) => {
  const params = {
    Protocol: 'email',
    TopicArn: topicArn,
    Endpoint: email,
  };

  try {
    const data = await snsClient.send(new SubscribeCommand(params));
    console.log("Subscription ARN is " + data.SubscriptionArn);
    return data.SubscriptionArn;
  } catch (error) {
    console.error("Error subscribing to SNS topic:", error);
    throw new Error("Failed to subscribe to SNS topic");
  }
};

// Function to send a notification
export const sendNotification = async (message, subject, topicArn) => {
  const params = {
    Message: message, // Message text
    Subject: subject, // Email subject
    TopicArn: topicArn,
  };

  try {
    const data = await snsClient.send(new PublishCommand(params));
    console.log("Message sent to the topic:", topicArn);
    console.log("MessageID is " + data.MessageId);
    return data;
  } catch (error) {
    console.error("Error sending SNS notification:", error);
    throw new Error("Failed to send SNS notification");
  }
};
