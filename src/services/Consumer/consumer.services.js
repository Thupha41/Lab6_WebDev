import amqp from "amqplib";
import mongoDatabaseService from "../../databases/init.mongodb.js";

const RABBITMQ_URL = "amqp://localhost";
const QUEUE = "messages";

//Connect to database mongo db
mongoDatabaseService.connect();
const consumeMessages = async () => {
  try {
    // Connect to RabbitMQ
    console.log("Attempting to connect to RabbitMQ...");
    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();

    await channel.assertQueue(QUEUE, {
      durable: true,
    });

    console.log(
      `Successfully connected to RabbitMQ. Waiting for messages in ${QUEUE}...`
    );

    // Consume messages from RabbitMQ
    channel.consume(QUEUE, async (msg) => {
      if (msg === null) {
        console.log("Received null message, skipping...");
        return;
      }

      try {
        const messageContent = JSON.parse(msg.content.toString());
        console.log(`Received ${messageContent.type} message:`, messageContent);

        // Add different processing logic based on message type
        const collection =
          messageContent.type === "user_message"
            ? mongoDatabaseService.messages
            : mongoDatabaseService.notifications;

        await collection.insertOne({
          ...messageContent,
          metadata: {
            source: "RabbitMQ",
            priority:
              messageContent.type === "notification"
                ? messageContent.priority
                : "High",
          },
          receivedAt: new Date(),
        });

        console.log(`Saved ${messageContent.type} to MongoDB:`, messageContent);
        channel.ack(msg);
      } catch (err) {
        console.error("Error processing message:", err);
        channel.nack(msg, false, true);
      }
    });
  } catch (error) {
    console.error("Error in consumeMessages:", error);
    // Attempt to reconnect after a delay
    setTimeout(() => consumeMessages(), 5000);
  }
};

// Run the consumer
consumeMessages().catch(console.error);
