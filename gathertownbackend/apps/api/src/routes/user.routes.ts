import { Router } from "express";
import { signup, signin } from "../controllers/user.controller";

const router:ReturnType<typeof Router>= Router();


router.post("/signup", signup);
router.post("/signin", signin);

export default router;