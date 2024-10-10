function fetchCustomerFeedbackAndUserStats() {
  // URLs to your AWS Lambda functions
  const feedbackApiUrl =
    "feedbackApiUrl"; // Customer feedback Lambda function URL
  const userStatsApiUrl =
    "userStatsApiUrl"; // User statistics Lambda function URL

  // Fetch data from customer feedback Lambda function
  const feedbackResponse = UrlFetchApp.fetch(feedbackApiUrl, {
    method: "get",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const feedbackData = JSON.parse(feedbackResponse.getContentText());

  // Prepare data for Google Sheets (Feedback)
  const feedbackValues = feedbackData.map((item) => {
    let sentimentCategory;
    if (item.SentimentScore > 0.5) {
      sentimentCategory = "Positive";
    } else if (item.SentimentScore >= -0.5) {
      sentimentCategory = "Neutral";
    } else {
      sentimentCategory = "Negative";
    }
    return [
      item.FeedbackID,
      item.UserEmail,
      item.RoomID,
      item.Feedback,
      item.Date,
      item.SentimentScore,
      item.SentimentMagnitude,
      sentimentCategory, // New column for categorization
    ];
  });

  // Add titles to feedback values
  feedbackValues.unshift([
    "FeedbackID",
    "UserEmail",
    "RoomID",
    "Feedback",
    "Date",
    "SentimentScore",
    "SentimentMagnitude",
    "SentimentCategory",
  ]);

  // Fetch data from user statistics Lambda function
  const userStatsResponse = UrlFetchApp.fetch(userStatsApiUrl, {
    method: "get",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const userStatsData = JSON.parse(userStatsResponse.getContentText());

  // Prepare data for Google Sheets (User Stats)
  const userStatsValues = [
    ["Total Users", "Total Logged In Users"], // Column names
    [userStatsData.total_users, userStatsData.total_logged_in_users],
  ];

  // Get the spreadsheet and sheets
  const spreadsheet = SpreadsheetApp.openById(
    "spreadsheetId"
  ); // Replace with your Google Spreadsheet ID
  const feedbackSheet = spreadsheet.getSheetByName("Sheet1"); // Change 'Sheet1' to your feedback sheet name
  const userStatsSheet = spreadsheet.getSheetByName("Sheet2"); // Change 'Sheet2' to your user stats sheet name

  // Clear existing content
  feedbackSheet.clear();
  userStatsSheet.clear();

  // Write the new data to the feedback sheet
  feedbackSheet
    .getRange(1, 1, feedbackValues.length, feedbackValues[0].length)
    .setValues(feedbackValues);

  // Write the new data to the user stats sheet
  userStatsSheet
    .getRange(1, 1, userStatsValues.length, userStatsValues[0].length)
    .setValues(userStatsValues);
}
