import express from 'express';
import {sendMessage} from "../controllers/message.controller.js";
import {getMessage} from "../controllers/message.controller.js";
import protectRoute from "../middlewares/ProtectRoute.js";
const router = express.Router();
router.get("/send/:id",protectRoute, getMessage);
router.post("/send/:id",protectRoute, sendMessage);
export default router;