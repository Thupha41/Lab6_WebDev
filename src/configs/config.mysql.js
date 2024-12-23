require("dotenv").config();

module.exports = {
  development: {
    username: process.env.DB_MYSQL_USER,
    password: process.env.DB_MYSQL_PASSWORD,
    database: process.env.DB_MYSQL_NAME,
    host: process.env.DB_MYSQL_HOST,
    port: process.env.DB_MYSQL_PORT,
    dialect: process.env.DB_MYSQL_DIALECT,
    define: {
      freezeTableName: true,
    },
  },
  test: {
    username: "root",
    password: null,
    database: "database_test",
    host: "127.0.0.1",
    dialect: "mysql",
  },
  production: {
    username: process.env.DB_MYSQL_USER,
    password: process.env.DB_MYSQL_PASSWORD,
    database: process.env.DB_MYSQL_NAME,
    host: process.env.DB_MYSQL_HOST,
    port: process.env.DB_MYSQL_PORT,
    dialect: process.env.DB_MYSQL_DIALECT,
    define: {
      freezeTableName: true,
    },
  },
};
