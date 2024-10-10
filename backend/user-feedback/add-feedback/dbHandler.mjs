import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand,
} from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from "uuid";

// Initialize DynamoDB client
const client = new DynamoDBClient({});
const dynamo = DynamoDBDocumentClient.from(client);
const feedbackTable = process.env.CUSTOMER_FEEDBACK_TABLE;
const userTable = process.env.USER_TABLE;

export const addFeedback = async (email, roomId, title, description, rating, date, sentimentScore, sentimentMagnitude) => {
  // Store feedback in DynamoDB
  const feedbackId = uuidv4(); // Auto-generate FeedbackID
  const userDetails = await getUserDetails(email, "GUEST");
  const params = {
    TableName: feedbackTable,
    Item: {
      id: feedbackId,
      email,
      name: userDetails.firstName + " " + userDetails.lastName,
      roomId,
      title,
      description,
      rating,
      date,
      sentimentScore,
      sentimentMagnitude,
    },
  };

  await dynamo.send(new PutCommand(params));
  return feedbackId;
};

export const getUserDetails = async (email, role) => {
  const params = {
    TableName: userTable,
    Key: { email, role },
  };

  try {
    const { Item } = await dynamo.send(new GetCommand(params));
    return Item || null;
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw new Error("Error fetching user data");
  }
};