const functions = require("@google-cloud/functions-framework");
const cors = require("cors")({ origin: true });
const crypto = require("crypto");
const { PubSub } = require("@google-cloud/pubsub");

const pubSubClient = new PubSub();
const topicName = "ticket_generation_topic";

functions.http("publishMessage", async (req, res) => {
  cors(req, res, async () => {
    // Set CORS headers for preflight requests
    res.set("Access-Control-Allow-Origin", "*");
    res.set("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.set("Access-Control-Allow-Headers", "*");

    if (req.method === "OPTIONS") {
      // Stops the lambda function early without calling the actual method
      res.status(204).send("");
      return;
    }

    if (req.method === "POST") {
      const input = req.body;
      const { guestEmail, agentEmail } = input;

      if (!input || !guestEmail || !agentEmail) {
        res.status(400).send("The request body is invalid");
        return;
      }

      try {
        const ticketId = crypto.randomUUID();
        const publishMessage = {
          ticketId,
          guestEmail,
          agentEmail,
        };
        await pubSubClient
          .topic(topicName)
          .publishMessage({
            data: Buffer.from(JSON.stringify(publishMessage)),
          });
        console.log(`${ticketId}`);
        res.status(200).send(ticketId);
      } catch (error) {
        console.error("Error publishing message:", error);
        res.status(500).send("Internal Server Error");
      }
    } else {
      res.status(405).send("Method Not Allowed");
    }
  });
});
