import { getUserNotifications } from "../controllers/notification.controller.js";
import { protect } from "../middleware/auth.middleeware.js";
import { Router } from "express";


const router = Router()

router.get('/notifications', protect, getUserNotifications);

export default router
