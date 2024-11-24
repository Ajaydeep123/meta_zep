import { Router } from "express";
import { createAvatar, createElement, createMap, updateElement } from "../controllers/admin.controller";
import { adminMiddleware } from "../middlewares/admin.middleware";
const adminRouter:ReturnType<typeof Router>= Router();

adminRouter.use(adminMiddleware)

adminRouter.post("/map", createMap)
adminRouter.post("/avatar", createAvatar)
adminRouter.post("/element", createElement)
adminRouter.put("/element/:elementId", updateElement)
export default adminRouter