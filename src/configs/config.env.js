import { config } from "dotenv";

config({
  path: ".env",
});

const env = process.env.NODE_ENV;
if (!env) {
  console.log(
    `Bạn chưa cung cấp biến môi trường NODE_ENV (ví dụ: development, production)`
  );
  console.log(`Phát hiện NODE_ENV = ${env}`);
  process.exit(1);
}
console.log(`Phát hiện NODE_ENV = ${env}`);

export const envConfig = {
  port: process.env.PORT || 3000,
  host: process.env.HOST_NAME,
  dbMysqlHost: process.env.DB_MYSQL_HOST,
  dbMysqlName: process.env.DB_MYSQL_NAME,
  dbMysqlUser: process.env.DB_MYSQL_USER,
  dbMysqlDialect: process.env.DB_MYSQL_DIALECT,
  dbMysqlPort: process.env.DB_MYSQL_PORT,
  dbMysqlPassword: process.env.DB_MYSQL_PASSWORD,
  dbMongoPassword: process.env.DB_MONGO_PASSWORD,
  dbMongoUsername: process.env.DB_MONGO_USERNAME,
  dbMongoName: process.env.DB_MONGO_NAME,
  dbMessagesCollection: process.env.DB_MESSAGES_COLLECTION,
  dbNotificationsCollection: process.env.DB_NOTIFICATIONS_COLLECTION,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN,
  githubId: process.env.GITHUB_CLIENT_ID,
  githubSecret: process.env.GITHUB_CLIENT_SECRET,
  githubCallbackURL: process.env.GITHUB_CALL_BACK_URL,
  saltRounds: process.env.SALT_ROUNDS,
  geoAPI: process.env.GEOAPIFY_KEY,
};
