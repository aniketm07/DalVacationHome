import { CognitoUserPool, CognitoUser, AuthenticationDetails } from 'amazon-cognito-identity-js';

const userPoolId = process.env.USER_POOL_ID;
const clientId = process.env.COGNITO_CLIENT_ID;

export const getUserPool = () => {
    const poolData = {
        UserPoolId: userPoolId,
        ClientId: clientId,
    };
    return new CognitoUserPool(poolData);
};

export const getCognitoUser = (userPool, uniqueUsername) => {
    const userParams = {
      Pool: userPool,
      Username: uniqueUsername,
    };
    return new CognitoUser(userParams);
};
  
export const getAuthenticationDetails = (email, password) => {
    const authenticationData = {
        Username: email,
        Password: password,
    };
    return new AuthenticationDetails(authenticationData);
};