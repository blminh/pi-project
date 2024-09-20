"use strict";

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "messages",
      [
        {
          sensor_id: 1,
          topic: "camera/webcam",
          message_type: "subscribe",
          status: "success",
          details: "Webcam laptop detect motion",
          updated_at: Date.now(),
          created_at: Date.now(),
        },
        {
          sensor_id: 2,
          topic: "led/led_pi",
          message_type: "publish",
          status: "success",
          details: "Turn on led of raspberry",
          updated_at: Date.now(),
          created_at: Date.now(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("People", null, {});
  },
};
