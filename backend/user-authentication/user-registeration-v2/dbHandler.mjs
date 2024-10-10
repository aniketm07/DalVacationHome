import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  QueryCommand,
  PutCommand,
} from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const dynamo = DynamoDBDocumentClient.from(client);
const tableName = process.env.USER_TABLE;

export const verifyUser = async (email, role) => {
  const params = {
    TableName: tableName,
    KeyConditionExpression: "#email = :email and #role = :role",
    ExpressionAttributeNames: {
      "#email": "email",
      "#role": "role",
    },
    ExpressionAttributeValues: {
      ":email": email,
      ":role": role,
    },
  };

  try {
    const data = await dynamo.send(new QueryCommand(params));
    return data?.Items?.length > 0;
  } catch (error) {
    console.error("Error verifying user:", error);
    throw new Error("Unable to verify user");
  }
};

export const createUser = async (user) => {
  try {
    const {
      email,
      password,
      securityQuestion,
      securityAnswer,
      firstName,
      lastName,
      role,
      ceasarCipherKey,
    } = user;
    const timestamp = Date.now();
    const params = {
      TableName: tableName,
      Item: {
        email: email,
        role: role,
        password: password,
        securityQuestion: securityQuestion,
        securityAnswer: securityAnswer,
        firstName: firstName,
        lastName: lastName,
        ceasarCipherKey: ceasarCipherKey,
        createdAt: timestamp,
      },
    };

    // Store User data in DynamoDB
    await dynamo.send(new PutCommand(params));
    return true;
  } catch (error) {
    console.error("Error adding user:", error);
    throw new Error("Unable to add user");
  }
};
