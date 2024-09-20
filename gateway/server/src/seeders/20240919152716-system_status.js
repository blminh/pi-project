"use strict";

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "system_statuses",
      [
        {
          name: "Temperature",
          topic: "temperature",
          total: 100.0,
          usage: 0.0,
          status: "off",
          details: "Temperature of system",
          updated_at: Date.now(),
          created_at: Date.now(),
        },
        {
          name: "Ram",
          topic: "ram",
          total: 100.0,
          usage: 0.0,
          status: "off",
          details: "Ram of system",
          updated_at: Date.now(),
          created_at: Date.now(),
        },
        {
          name: "Cpu",
          topic: "temperature",
          total: 100.0,
          usage: 0.0,
          status: "off",
          details: "Cpu of system",
          updated_at: Date.now(),
          created_at: Date.now(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("system_statuses", null, {});
  },
};
