"use strict";
const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const basename = path.basename(__filename);
const {
  development: { host, username, password, database, port, dialect },
} = require("../configs/config.mysql");
// const config = require(__dirname + "/../configs/config.js")[env];
const db = {};

let sequelize;
// if (config.use_env_variable) {
//   sequelize = new Sequelize(process.env[config.use_env_variable], config);
// } else {
//   sequelize = new Sequelize(
//     config.database,
//     config.username,
//     config.password,
//     config
//   );
// }
const customizeConfig = {
  host: host,
  port: port,
  dialect: dialect,
  logging: (query) => {
    console.log(`SQL Query: ${query}`);
  },
  timezone: "+07:00",
};
sequelize = new Sequelize(database, username, password, customizeConfig);

fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
    );
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(
      sequelize,
      Sequelize.DataTypes
    );
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
