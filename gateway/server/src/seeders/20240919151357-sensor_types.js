"use strict";

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "sensor_types",
      [
        {
          name: "Camera",
          topic: "camera",
          status: "active",
          details: "Camera type",
          updated_at: Date.now(),
          created_at: Date.now(),
        },
        {
          name: "Led",
          topic: "led",
          status: "active",
          details: "LED type",
          updated_at: Date.now(),
          created_at: Date.now(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("sensor_types", null, {});
  },
};
