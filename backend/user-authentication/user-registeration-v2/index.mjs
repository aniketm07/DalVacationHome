import { verifyUser, createUser } from "./dbHandler.mjs";
import { checkAndUpdateUserPool } from "./cognitoHandler.mjs";
import { subscribeToSNSTopic, sendNotification } from './snsHandler.mjs';

const headers = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Credentials": true 
};

export const handler = async (event) => {
  try {
    const body = JSON.parse(event.body);
    const { email, password, role } = body;

    if (!email || !password) {
      return {
        statusCode: 400,
        body: JSON.stringify({ status: 'failed', message: "email and password are required" }),
        headers
      };
    }

    if (await verifyUser(email, role)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ status: 'failed', message: "User already exists" }),
        headers
      };
    }

    if (!await checkAndUpdateUserPool(email, password, role)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ status: 'failed', message: "User already exists" }),
        headers
      };
    }

    await createUser(body);

    // Subscribe the email to the SNS topic
    const topicArn = 'arn:aws:sns:us-east-1:730335646873:login-notification'; // Replace with your topic ARN
    await subscribeToSNSTopic(email, topicArn);

    // Send notification email
    const message = "Welcome to our service! Your registration was successful.";
    const subject = "Registration Confirmation";
    await sendNotification(message, subject, topicArn);

    const response = {
      statusCode: 200,
      body: JSON.stringify({ status: 'success', message: "User created successfully and notification sent!" }),
      headers
    };
    return response;
  } catch (error) {
    console.error("Error during authentication:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ status: 'failed', message: "Internal server error" }),
      headers
    };
  }
};
