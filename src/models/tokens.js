"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Tokens extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Tokens.belongsTo(models.Users, {
        foreignKey: "user_id",
      });
    }
  }
  Tokens.init(
    {
      user_id: DataTypes.INTEGER,
      token: DataTypes.STRING(500),
    },
    {
      sequelize,
      modelName: "Tokens",
    }
  );
  return Tokens;
};
