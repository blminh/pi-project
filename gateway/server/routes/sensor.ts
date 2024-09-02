import express from "express";
import sensorController from "../controllers/sensorController";

const router = express.Router();
router.get("/", sensorController.sensorsList);
router.get("/get?:id", sensorController.getSensor);

router.post("/add", sensorController.addSensor);
router.post("/set", sensorController.setSensor);

export default router;
