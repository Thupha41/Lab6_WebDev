"use strict";

const { query } = require("express-validator");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    return Promise.all([
      queryInterface.addColumn("Users", "loginTime", {
        type: Sequelize.DATE,
        allowNull: true,
      }),
      queryInterface.addColumn("Users", "loginAddress", {
        type: Sequelize.STRING,
        allowNull: true,
      }),
    ]);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    return Promise.all([
      queryInterface.removeColumn("Users", "loginTime"),
      queryInterface.removeColumn("Users", "loginAddress"),
    ]);
  },
};
