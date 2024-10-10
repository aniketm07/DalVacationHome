
import { addFeedback } from "./dbHandler.mjs";
import { sentimentAnalysisHandler } from "./sentimentAnalysisHandler.mjs";

export const handler = async (event) => {
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Credentials": true,
  };

  try {
    const {
      email,
      roomId,
      title,
      description,
      rating,
      date,
    } = JSON.parse(event.body);

    if (
      !email ||
      !roomId ||
      !title ||
      !description ||
      !rating ||
      !date
    ) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          status: "failed",
          message:
            "UserEmail, RoomID, FeedbackTitle, FeedbackDescription, Rating, and Date are required",
        }),
        headers,
      };
    }

    const result = await sentimentAnalysisHandler(description);
    const sentimentScore = result.documentSentiment.score;
    const sentimentMagnitude = result.documentSentiment.magnitude;

   const feedbackId = await addFeedback(
      email,
      roomId,
      title,
      description,
      rating,
      date,
      sentimentScore,
      sentimentMagnitude
    );

    return {
      statusCode: 200,
      body: JSON.stringify({
        status: "success",
        message: "Feedback added successfully",
        feedbackId
      }),
      headers,
    };
  } catch (error) {
    console.error("Error processing feedback:", error);
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
