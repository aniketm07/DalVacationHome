import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const dynamo = DynamoDBDocumentClient.from(client);
const userTable = process.env.USER_TABLE;

export const getRandomPropertyAgent = async () => {
  const params = {
    TableName: userTable,
    FilterExpression: "#role = :role",
    ExpressionAttributeNames: {
      "#role": "role",
    },
    ExpressionAttributeValues: {
      ":role": "AGENT",
    },
  };
  try {
    const { Items } = await dynamo.send(new ScanCommand(params));
    if (Items.length === 0) {
      throw new Error("No agents found");
    }
    const randomAgent = Items[Math.floor(Math.random() * Items.length)];
    return randomAgent.email;
  } catch (error) {
    console.error("getRandomPropertyAgent :: Error getting property agent:", error);
    throw new Error("Error getting property agent");
  }
};
