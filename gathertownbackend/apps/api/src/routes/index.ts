import { Router } from "express";
import { signup, signin, getElements, getAvatars } from "../controllers/index.controller";
import userRouter from "./user.route";
import spaceRouter from "./space.route";
import adminRouter from "./admin.route";
import { rateLimit } from 'express-rate-limit'

const router:ReturnType<typeof Router>= Router();

const limiter = rateLimit({
	windowMs: 60 * 1000, // 15 minutes
	limit: 5, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

router.post("/signup", signup);
router.post("/signin", signin);
router.get('/elements', limiter, getElements)
router.get('/avatars', limiter, getAvatars)


router.use("/user", userRouter)
router.use("/space", spaceRouter)
router.use("/admin",adminRouter)

export default router