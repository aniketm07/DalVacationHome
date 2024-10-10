import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const dynamo = DynamoDBDocumentClient.from(client);
const sessionTableName = process.env.SESSION_TABLE;
const userTableName = process.env.USER_TABLE;

export const getUserDetails = async (email, role) => {
  const params = {
    TableName: userTableName,
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

export const getSession = async (email, role) => {
  const params = {
    TableName: sessionTableName,
    Key: { email, role },
  };

  try {
    const { Item } = await dynamo.send(new GetCommand(params));
    if (Item) {
      Item.ceasarcipher = true;
      const updateParams = {
        TableName: sessionTableName,
        Item,
      };
      await dynamo.send(new PutCommand(updateParams));
      return Item;
    }
    return null;
  } catch (error) {
    console.error("Error fetching session data:", error);
    throw new Error("Error fetching session data");
  }
};
