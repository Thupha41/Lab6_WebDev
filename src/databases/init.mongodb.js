import { MongoClient } from "mongodb";
import config from "../configs/config.mongodb.js";
const { USERNAME, PASSWORD, NAME } = config.mongo_db.development;
import { envConfig } from "../configs/config.env.js";
const uri = `mongodb+srv://${USERNAME}:${PASSWORD}@twitter-cluster.hzc1q.mongodb.net/?retryWrites=true&w=majority&appName=Twitter-Cluster`;
class MongoDatabase {
  constructor() {
    this.client = new MongoClient(uri);
    this.db = this.client.db(NAME);
  }
  async connect() {
    try {
      console.log("Connected to MongoDB client");

      // Then ping the database
      await this.db.command({ ping: 1 });
      console.log(
        "Pinged your deployment. You successfully connected to MongoDB!"
      );
    } catch (error) {
      console.error("MongoDB Connection Error:", error);
      throw error;
    }
  }

  get messages() {
    return this.db.collection(envConfig.dbMessagesCollection);
  }
  get notifications() {
    return this.db.collection(envConfig.dbNotificationsCollection);
  }
}
const mongoDatabaseService = new MongoDatabase();
export default mongoDatabaseService;
