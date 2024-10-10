import { LanguageServiceClient } from "@google-cloud/language";
import path from "path";

// Path to the service account key file in the Lambda environment
const SERVICE_ACCOUNT_KEY_PATH = path.join(
  "/var/task",
  "service-account-file.json"
);

// Initialize Google Cloud Natural Language API client
const googleClient = new LanguageServiceClient({
  keyFilename: SERVICE_ACCOUNT_KEY_PATH,
});

export const sentimentAnalysisHandler = async (description) => {
  // Perform sentiment analysis on feedback description
  const [result] = await googleClient.analyzeSentiment({
    document: {
      content: description,
      type: "PLAIN_TEXT",
    },
  });
  return result;
};
