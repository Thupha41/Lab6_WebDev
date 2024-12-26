import { envConfig } from "./config.env.js";
export default {
  mongo_db: {
    development: {
      USERNAME: envConfig.dbMongoUsername,
      PASSWORD: envConfig.dbMongoPassword,
      NAME: envConfig.dbMongoName,
    },
  },
};
