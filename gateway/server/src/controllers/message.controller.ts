import expressAsyncHandler from "express-async-handler";
import { QueryTypes } from "sequelize";
import sequelize from "../database/db";

let includeMsgAndSensor = (data: any) =>
  data.map((el: any) => ({
    id: el.message_id,
    topic: el.message_topic,
    message_type: el.message_type,
    status: el.message_status,
    details: el.message_details,
    createdAt: el.messages_created_at,
    updatedAt: el.messages_updated_at,
    sensor: {
      name: el.sensor_name,
      status: el.sensor_status,
      sensor_type: {
        id: el.sensor_type_id,
        name: el.sensor_type_name,
      },
    },
  }));

const messagesList = expressAsyncHandler(async (req, res) => {
  let data = await sequelize.query(
    `SELECT messages.id AS message_id,
            messages.topic AS message_topic,
            messages.message_type AS message_type,
            messages.status AS message_status,
            messages.details AS message_details,
            messages.created_at AS messages_created_at,
            messages.updated_at AS messages_updated_at,
            sensor_id,
            sensors.name AS sensor_name,
            sensors.status AS sensor_status,
            sensors.sensor_type_id,
            sensor_types.name AS sensor_type_name
     FROM messages 
     INNER JOIN sensors ON sensor_id = sensors.id
     INNER JOIN sensor_types ON sensors.sensor_type_id = sensor_types.id;`,
    {
      type: QueryTypes.SELECT,
      mapToModel: true,
      nest: true,
    }
  );

  console.log(data);

  res.json(includeMsgAndSensor(data));
});

const getMsg = expressAsyncHandler(async (req, res) => {
  let id = req.query.id;
  let data = await sequelize.query(
    `SELECT messages.id AS message_id,
            messages.topic AS message_topic,
            messages.message_type AS message_type,
            messages.status AS message_status,
            messages.details AS message_details,
            messages.created_at AS messages_created_at,
            messages.updated_at AS messages_updated_at,
            sensor_id,
            sensor_type_id,
            sensors.name AS sensor_name,
            sensors.topic AS sensor_topic,
            sensors.status AS sensor_status,
            sensors.details AS sensor_details,
            sensors.created_at AS sensor_create_at,
            sensors.updated_at AS sensor_updated_at,
            sensor_types.name AS sensor_type_name
     FROM messages
     INNER JOIN sensors ON sensor_id = sensors.id
     INNER JOIN sensor_types ON sensors.sensor_type_id = sensor_types.id
     WHERE sensor_id = :id;`,
    {
      type: QueryTypes.SELECT,
      mapToModel: true,
      nest: true,
      replacements: { id },
    }
  );
  console.log(data);

  res.json(includeMsgAndSensor(data));
});

const addMsg = expressAsyncHandler(async (req, res) => {
  let result = await sequelize.query(
    `INSERT INTO messages (sensor_id, topic, message_type, status, details)
     VALUES (:sensor_id, :topic, :message_type, :status, :details);`,
    {
      type: QueryTypes.INSERT,
      replacements: { ...req.body },
    }
  );
  res.json(result);
});

const addMsgFromServer = async (data: any) => {
  let result = await sequelize.query(
    `INSERT INTO messages (sensor_id, topic, message_type, status, details)
     VALUES (:sensor_id, :topic, :message_type, :status, :details);`,
    {
      type: QueryTypes.INSERT,
      replacements: { ...data },
    }
  );
};

export default { messagesList, addMsg, addMsgFromServer, getMsg };
