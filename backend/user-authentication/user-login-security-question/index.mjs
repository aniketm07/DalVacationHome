import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const dynamo = DynamoDBDocumentClient.from(client);
const tableName = process.env.USER_TABLE;

export const handler = async (event) => {
  try {
    const { email, role } = JSON.parse(event.body);

    const headers = {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
    };

    if (!email || !role) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          status: "failed",
          message: "Email and role are required",
        }),
        headers,
      };
    }

    const params = {
      TableName: tableName,
      Key: { email, role },
    };

    const { Item } = await dynamo.send(new GetCommand(params));
    if (Item && Item.securityQuestion) {
      return {
        statusCode: 200,
        body: JSON.stringify({
          status: "success",
          securityQuestion: Item.securityQuestion,
        }),
        headers,
      };
    } else {
      return {
        statusCode: 404,
        body: JSON.stringify({
          status: "failed",
          message: "User or security question not found",
        }),
        headers,
      };
    }
  } catch (error) {
    console.error("Error fetching security question:", error);
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
