import { Router } from "express";
import { signup, signin } from "../controllers/index.controller";
import userRouter from "./user.route";
import spaceRouter from "./space.route";
import adminRouter from "./admin.route";

const router:ReturnType<typeof Router>= Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.get('/elements',)
router.get('/avatars',)


router.use("/user", userRouter)
router.use("/space", spaceRouter)
router.use("/admin",adminRouter)

export default router