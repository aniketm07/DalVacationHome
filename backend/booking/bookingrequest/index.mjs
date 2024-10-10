import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";

// Initialize the SQS Client
const sqsClient = new SQSClient({ region: "us-east-1" }); // Change the region if needed

const headers = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Credentials": true,
};

export const handler = async (event) => {
  try {
    const body = JSON.parse(event.body);
    const { room_id, user_email } = body;

    if (!room_id || !user_email) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          status: "failed",
          message: "room_id and user_email are required",
        }),
        headers,
      };
    }

    // Hardcoded unique booking_id for testing purposes
    const booking_id = "1234";

    // Define the SQS message parameters
    const params = {
      QueueUrl: "", // Replace with your SQS queue URL
      MessageBody: JSON.stringify({ room_id, user_email, booking_id }),
      MessageGroupId: room_id,
      //MessageDeduplicationId: 'hardcoded-deduplication-id' // Hardcoded for testing purposes
    };

    // Send the message to SQS
    const data = await sqsClient.send(new SendMessageCommand(params));
    console.log("Message sent to the queue:", data);

    return {
      statusCode: 200,
      body: JSON.stringify({
        status: "success",
        message: "Booking request submitted",
        booking_id,
      }),
      headers,
    };
  } catch (error) {
    console.error("Error submitting booking request:", error);
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
