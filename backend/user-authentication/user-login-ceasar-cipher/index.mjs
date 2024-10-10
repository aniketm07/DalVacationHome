import { getUserDetails, getSession } from "./dbHandler.mjs";
import { sendNotification } from './snsHandler.mjs';

export const handler = async (event) => {
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Credentials": true,
  };

  try {
    const body = JSON.parse(event.body);
    const { email, role, ceasarQuestion, ceasarAnswer } = body;

    if (!email || !role || !ceasarQuestion || !ceasarAnswer) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          status: "failed",
          message: "The request body is invalid",
        }),
        headers,
      };
    }

    const userResponse = await getUserDetails(email, role);
    if (userResponse === null) {
      return {
        statusCode: 404,
        body: JSON.stringify({ status: "failed", message: "User not found" }),
        headers,
      };
    }
    console.log(userResponse);
    const isCipherValid = await checkCeasarCipher(
      ceasarQuestion,
      ceasarAnswer,
      userResponse.ceasarCipherKey
    );

    if (!isCipherValid) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          status: "failed",
          message: "Authentication failed! Invalid cipher.",
        }),
        headers,
      };
    }

    const session = await getSession(email, role);
    if (!session) {
      return {
        statusCode: 404,
        body: JSON.stringify({ status: "failed", message: "Session not found" }),
        headers,
      };
    }

    session.ceasarcipher = true;

    // Send notification email
    const message = "You have successfully logged in.";
    const subject = "Login Notification";
    const topicArn = 'arn:aws:sns:us-east-1:730335646873:login-notification'; // Replace with your topic ARN
    await sendNotification(email, message, subject, topicArn);

    return {
      statusCode: 200,
      body: JSON.stringify({
        status: "success",
        message: "Authentication successful",
        user: {
          email,
          role,
          firstName: userResponse.firstName,
          lastName: userResponse.lastName,
          token: session.token,
        },
      }),
      headers,
    };
  } catch (error) {
    console.error("handler :: Error during authentication:", error);
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

const checkCeasarCipher = async (
  ceasarQuestion,
  ceasarAnswer,
  ceasarCipherKey
) => {
  const encryptedQuestion = encryptString(ceasarQuestion, ceasarCipherKey);
  return encryptedQuestion === ceasarAnswer;
};

const encryptString = (ceasarQuestion, ceasarCipherKey) => {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  return ceasarQuestion
    .split("")
    .map((char) => {
      const charIndex = alphabet.indexOf(char.toUpperCase());
      if (charIndex === -1) {
        return char;
      }
      const newIndex = (charIndex + Number(ceasarCipherKey)) % alphabet.length;
      return char === char.toLowerCase()
        ? alphabet[newIndex].toLowerCase()
        : alphabet[newIndex];
    })
    .join("");
};
