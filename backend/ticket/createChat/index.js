const admin = require('firebase-admin');

// Initialize Firebase
admin.initializeApp();
const db = admin.firestore();

/**
 * Triggered from a message on a Cloud Pub/Sub topic.
 *
 * @param {!Object} event Event payload.
 * @param {!Object} context Metadata for the event.
 */
exports.createChat = async (event, context) => {
  const message = Buffer.from(event.data, 'base64').toString();
  const { ticketId, agentEmail, guestEmail } = JSON.parse(message);
  const currentTime = Date.now();
  const chatList = {
    [ticketId]: {
      guest: guestEmail,
      agent: agentEmail,
      ticketId,
      lastMessage: "You are connected to a property agent. Please enter your concerns and we will get back to you shortly.",
      lastMessageTimestamp: currentTime,
      lastMessageBy: agentEmail
    }
  };
  await db.collection("chatList").doc(agentEmail).set(chatList, { merge: true });
  await db.collection("chatList").doc(guestEmail).set(chatList, { merge: true });

  const firstMessage = {
    sender: agentEmail,
    role: "AGENT",
    message: "You are connected to a property agent. Please enter your concerns and we will get back to you shortly.",
    timeStamp: currentTime,
  }
  const chatDocRef = db.collection("chats").doc(ticketId);
  await chatDocRef.set({});
  await chatDocRef.collection("messages").add(firstMessage);
  console.log(`message: ${message}`);
  console.log(`firstMessage: ${firstMessage}`);
};