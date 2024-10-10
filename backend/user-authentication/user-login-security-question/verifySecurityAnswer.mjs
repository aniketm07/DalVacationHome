import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const dynamo = DynamoDBDocumentClient.from(client);
const tableName = process.env.USER_TABLE;

export const handler = async (event) => {
  try {
    const { email, role, securityAnswer } = JSON.parse(event.body);

    const headers = {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
    };

    if (!email || !role || !securityAnswer) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          status: "failed",
          message: "Email, role, and security answer are required",
        }),
        headers,
      };
    }

    const params = {
      TableName: tableName,
      Key: { email, role },
    };

    const { Item } = await dynamo.send(new GetCommand(params));
    if (Item && Item.securityAnswer === securityAnswer) {
      return {
        statusCode: 200,
        body: JSON.stringify({
          status: "success",
          message: "Security answer verified",
        }),
        headers,
      };
    } else {
      return {
        statusCode: 403,
        body: JSON.stringify({
          status: "failed",
          message: "Invalid security answer",
        }),
        headers,
      };
    }
  } catch (error) {
    console.error("Error verifying security answer:", error);
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
