import { Router } from "express";
import { userMiddleware } from "../middlewares/user.middleware";
import { bulkmetadata, updatemetadata } from "../controllers/user.controller";

const userRouter:ReturnType<typeof Router>= Router();

userRouter.post("/metadata",userMiddleware, updatemetadata)
userRouter.get("/metadata/bulk", bulkmetadata)

export default userRouter