import { Router } from "express";

const userRouter:ReturnType<typeof Router>= Router();

userRouter.post("/metadata")
userRouter.get("/metadata/bulk")

export default userRouter