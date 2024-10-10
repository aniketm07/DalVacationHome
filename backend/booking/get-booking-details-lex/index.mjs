import { getRole } from "./sessionHandler.mjs";
import { getBookingDetails } from "./dbHandler.mjs";

export const handler = async (event) => {
  const bookingId = event.currentIntent.slots.BookingId;
  const guestEmail = event.sessionAttributes.guestEmail;
  const sessionToken = event.sessionAttributes.sessionToken;
  let responseToLex = "";
  if (
    !sessionToken ||
    !bookingId ||
    !guestEmail ||
    sessionToken === null ||
    bookingId === null ||
    guestEmail === null ||
    sessionToken === undefined ||
    bookingId === undefined ||
    guestEmail === undefined
  ) {
    responseToLex = "Error getting booking details. Please try again.";
  } else {
    const role = await getRole(sessionToken);

    if (role !== "GUEST") {
      responseToLex =
        "Access denied. User is not authorized to view booking details as you are not a guest. Please contact support.";
    } else {
      const bookingDetails = await getBookingDetails(bookingId);
      if (
        !bookingDetails ||
        bookingDetails === null ||
        bookingDetails === undefined
      ) {
        responseToLex = "Booking not found. Please try again.";
      } else if (bookingDetails.email !== guestEmail) {
        responseToLex = "Booking not found. Please try again.";
      } else {
        responseToLex =
          "Booking details: " + JSON.stringify(bookingDetails, null, 2);
      }
    }
  }

  // Create a response to send back to Lex
  const response = {
    dialogAction: {
      type: "Close",
      fulfillmentState: "Fulfilled",
      message: {
        contentType: "PlainText",
        content: responseToLex,
      },
    },
  };

  // Return the response
  return response;
};
