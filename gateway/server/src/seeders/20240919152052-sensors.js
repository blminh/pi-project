"use strict";

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "sensors",
      [
        {
          sensor_type_id: 1,
          name: "Camera laptop",
          topic: "webcam",
          status: "on",
          details: "Webcam laptop",
          updated_at: Date.now(),
          created_at: Date.now(),
        },
        {
          sensor_type_id: 2,
          name: "Led pi",
          topic: "led_pi",
          status: "on",
          details: "Led of raspberry",
          updated_at: Date.now(),
          created_at: Date.now(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("sensors", null, {});
  },
};
