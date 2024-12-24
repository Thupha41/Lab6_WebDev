import amqp from "amqplib";
import { faker } from "faker-js/faker";

const RABBITMQ_URL = "amqp://localhost";
const QUEUE = "message";

let connection;
let channel;
class ProducerService {
  static generateFakeMessage = () => {
    return {
      id: faker.string.uuid(),
      name: faker.person.fullName(),
      email: faker.internet.email(),
      content: faker.lorem.sentence(),
      timestamp: new Date().toISOString(),
    };
  };

  static initRabbitMQ = async () => {
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

  static sendMessage = async (message) => {
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

  static startAutoProducer = () => {
    console.log("Starting auto-producer...");
    setInterval(async () => {
      const fakeMessage = generateFakeMessage();
      await sendMessage(fakeMessage);
    }, 5000);
  };
}

export default ProducerService;
