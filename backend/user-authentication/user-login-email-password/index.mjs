import { getCognitoUser, getUserPool, getAuthenticationDetails } from './cognitoHandler.mjs';
import { addNewSession, getSecurityQuestion } from './dbHandler.mjs';

const headers =  {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*", 
  "Access-Control-Allow-Credentials": true
};

export const handler = async (event) => {
  try {
    const body = JSON.parse(event.body);
    const { email, password, role } = body;

    if (!email || !password || !role) {
      return {
        statusCode: 400,
        body: JSON.stringify({ status : 'failed', message: 'email, password, and role are required' }),
        headers
      };
    }

    const token = await getToken(email, password, role);
    if (token !== null) {
      console.log(token);
      const status = await addNewSession(email, role, token);
      if (status) {
        const question = await getSecurityQuestion(email, role);
        return {
          statusCode: 200,
          body: JSON.stringify({ status: 'success', emailpassword: true, securityquestion: false, ceasercipher: false, question: question }),
          headers
        };
      } else {
        console.error('handler :: Error during storing the token in session table:');
        return {
          statusCode: 500,
          body: JSON.stringify({ status: 'failed', message: 'Internal server error' }),
          headers
        };
      }
    } else {
      return {
        statusCode: 401,
        body: JSON.stringify({ status: 'failed', message: 'Authentication failed! Invalid email, password, or role' }),
        headers
      };
    }
  } catch (error) {
    console.error('handler :: Error during authentication:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ status: 'failed', message: 'Internal server error' }),
      headers
    };
  }
};

const getToken = async (email, password, role) => {
  const userPool = getUserPool();
  const cognitoUser = getCognitoUser(userPool, `${email}-${role}`);
  const authenticationDetails = getAuthenticationDetails(email, password);

  return new Promise((resolve, reject) => {
    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: function (result) {
        const token = result.getIdToken().getJwtToken();
        resolve(token);
      },
      onFailure: function (err) {
        console.error('getToken :: Authentication error:', err);
        resolve(null);
      },
    });
  });
};
