import amqp from "amqplib";
import { faker } from "@faker-js/faker";
import express from "express";
import bodyParser from "body-parser";

const app = express();
app.use(bodyParser.json());
const RABBITMQ_URL = "amqp://localhost";
const QUEUE = "messages";

let connection;
let channel;

const generateUserMessage = () => {
  return {
    type: "user_message",
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    email: faker.internet.email(),
    content: faker.lorem.sentence(),
    timestamp: new Date().toISOString(),
  };
};

const initRabbitMQ = async () => {
  try {
    console.log("Connecting to RabbitMQ...");
    connection = await amqp.connect(RABBITMQ_URL);
    channel = await connection.createChannel();
    await channel.assertQueue(QUEUE);
    console.log("RabbitMQ connected and queue asserted");
  } catch (error) {
    console.error("Error initializing RabbitMQ", error);
    process.exit(1);
  }
};

const sendMessage = async (message) => {
  try {
    if (!channel) {
      throw new Error("Channel is not initialized");
    }
    channel.sendToQueue(QUEUE, Buffer.from(JSON.stringify(message)));
    console.log(`Message sent: ${JSON.stringify(message)}`);
  } catch (error) {
    console.error("Error sending message:", error);
  }
};

const startUserProducer = () => {
  console.log("Starting user message producer...");
  setInterval(async () => {
    const userMessage = generateUserMessage();
    await sendMessage(userMessage);
  }, 7000);
};

const closeRabbitMQ = async () => {
  try {
    console.log("Closing RabbitMQ connection...");
    if (channel) await channel.close();
    if (connection) await connection.close();
    console.log("RabbitMQ connection closed.");
  } catch (error) {
    console.error("Error closing RabbitMQ connection: ", error);
  }
};

process.on("SIGINT", async () => {
  await closeRabbitMQ();
  process.exit(0);
});

const PORT = 3000;
app.listen(PORT, async () => {
  console.log(`User Producer running on http://localhost:${PORT}`);
  await initRabbitMQ();
  startUserProducer();
});
