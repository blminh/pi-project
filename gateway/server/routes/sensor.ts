import express from "express";
import sensorController from "../controllers/sensor.controller";
import sensorTypeController from "../controllers/sensorType.controller ";
import systemStatusController from "../controllers/systemStatus.controller";

const router = express.Router();
router.get("/", sensorController.sensorsList);
router.get("/get?:id", sensorController.getSensor);
router.get("/type", sensorTypeController.sensorTypesList);
router.get("/type/get?:id", sensorTypeController.getSensorType);
router.get("/system", systemStatusController.systemStatus);

router.post("/add", sensorController.addSensor);
router.post("/set", sensorController.setSensor);
router.post("/type/add", sensorTypeController.addSensorType);
router.post("/type/update", sensorTypeController.modifySensorType);

export default router;
