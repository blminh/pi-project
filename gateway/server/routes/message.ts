import express from "express";
import messageController from "../controllers/messageController";

const router = express.Router();
router.get("/", messageController.messagesList);
router.get("/get?:id", messageController.getMsg);

router.post("/add", messageController.addMsg);

export default router;
