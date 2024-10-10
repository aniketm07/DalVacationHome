/**
@author: an370985@dal.ca
@bannerId: B00969798

This is the lambda function that configures the AWS Cognito User Pool auto-confirmation and auto-verification.
*/

export const handler = async (event) => {
    event.response.autoConfirmUser = true;
    event.response.autoVerifyEmail = true;
    return event;
};