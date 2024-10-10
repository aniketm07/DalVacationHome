import {
  CognitoIdentityProviderClient,
  SignUpCommand,
} from "@aws-sdk/client-cognito-identity-provider";

const config = {
  region: "us-east-1",
};
const client = new CognitoIdentityProviderClient(config);

export const checkAndUpdateUserPool = async (email, password, role) => {
  try {
    const uniqueUsername = `${email}-${role}`;
    const input = {
      ClientId: process.env.COGNITO_CLIENT_ID,
      Username: uniqueUsername,
      Password: password,
      UserAttributes: [
        {
          Name: "email",
          Value: email,
        },
        {
          Name: "custom:role",
          Value: role,
        },
      ],
    };
    const command = new SignUpCommand(input);
    const cognitoResponse = await client.send(command);
    return cognitoResponse;
  } catch (error) {
    console.error("SignUp error:", error);
    return null;
  }
};
