import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, GetCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const dynamo = DynamoDBDocumentClient.from(client);
const sessionTable = process.env.SESSION_TABLE;
const userTable = process.env.USER_TABLE;

export const addNewSession = async (email, role, token) => {
  try {
    const params = {
      TableName: sessionTable,
      Item: {
        email: email,
        role: role,
        token: token,
        emailpassword: true,
        securityquestion: false,
        ceasercipher: false,
      },
    };
    await dynamo.send(new PutCommand(params));
    return true;
  } catch (error) {
    console.error("addNewSession :: Error adding new session:", error);
    return false;
  }
};

export const getSecurityQuestion = async (email, role) => {
  const params = {
    TableName: userTable,
    Key: { 
      email: email,
      role: role 
    },
  };
  try {
    const { Item } = await dynamo.send(new GetCommand(params));
    return Item.securityQuestion;
  } catch (error) {
    console.error("getSecurityQuestion :: Error getting security question:", error);
    throw new Error("Error getting security question");
  }
};
