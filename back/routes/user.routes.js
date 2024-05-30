import express from "express"
import protectRoute from "../middlewares/ProtectRoute.js";
import { getUsersForSidebar } from "../controllers/user.controller.js";

const router = express.Router();

router.get("/", protectRoute, getUsersForSidebar)

export default router;