import { envConfig } from "./config.env";
export default {
  mongo_db: {
    development: {
      USERNAME: envConfig.dbMongoUsername,
      PASSWORD: envConfig.dbMongoPassword,
      NAME: envConfig.dbMongoName,
    },
  },
};
