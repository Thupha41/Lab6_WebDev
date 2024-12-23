import { MongoClient } from "mongodb";
import config from "../configs/config.mongodb";
const { USERNAME, PASSWORD, NAME } = config.mongo_db.development;
import { envConfig } from "../configs/config.env";
const uri = `mongodb+srv://${USERNAME}:${PASSWORD}@twitter-cluster.hzc1q.mongodb.net/?retryWrites=true&w=majority&appName=Twitter-Cluster`;
class MongoDatabase {
  constructor() {
    this.client = new MongoClient(uri);
    this.db = this.client.db(NAME);
  }
  async connect() {
    try {
      // Send a ping to confirm a successful connection
      await this.db.command({ ping: 1 });
      console.log(
        "Pinged your deployment. You successfully connected to MongoDB!"
      );
    } catch (error) {
      console.log("Error", error);
      throw error;
    }
  }

  get messages() {
    return this.db.collection(envConfig.dbMessagesCollection);
  }
}
const mongoDatabaseService = new MongoDatabase();
export default mongoDatabaseService;
