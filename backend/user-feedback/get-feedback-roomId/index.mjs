import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";

// Initialize DynamoDB client
const client = new DynamoDBClient({});
const dynamo = DynamoDBDocumentClient.from(client);
const tableName = process.env.CUSTOMER_FEEDBACK_TABLE;

export const handler = async (event) => {
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Credentials": true,
  };

  const roomId = event.roomId;

  if (!roomId) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        status: "failed",
        message: "roomId is required",
      }),
      headers,
    };
  }

  try {
    const params = {
      TableName: tableName,
      FilterExpression: "roomId = :roomId",
      ExpressionAttributeValues: {
        ":roomId": roomId,
      },
    };

    const data = await dynamo.send(new ScanCommand(params));

    return {
      statusCode: 200,
      body: JSON.stringify(data.Items),
      headers,
    };
  } catch (error) {
    console.error("Error fetching customer feedback:", error);
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
