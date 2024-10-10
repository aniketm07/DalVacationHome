import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetItemCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const dynamo = DynamoDBDocumentClient.from(client);
const bookingTable = process.env.BOOKING_TABLE;

export const getBookingDetails = async (bookingid) => {
  const params = {
    TableName: bookingTable,
    Key: {
      "bookingid": { S: bookingid }
    },
  };

  try {
    const { Item } = await dynamo.send(new GetItemCommand(params));
    if (!Item) {
      return null;
    }
    return Item;
  } catch (error) {
    console.error("getBookingDetails :: Error getting booking details:", error);
    throw new Error("Error getting booking details");
  }
};
