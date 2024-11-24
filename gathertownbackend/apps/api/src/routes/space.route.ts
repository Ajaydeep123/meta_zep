import { Router } from "express";
import { userMiddleware } from "../middlewares/user.middleware";
import { addElement, createSpace, deleteElement, deleteSpace, getAllSpaces, getSpace } from "../controllers/space.controller";
const spaceRouter:ReturnType<typeof Router>= Router();

spaceRouter.post("/",userMiddleware, createSpace)
spaceRouter.delete("/element", userMiddleware, deleteElement)
spaceRouter.get("/all", userMiddleware, getAllSpaces)
spaceRouter.delete("/:spaceId", userMiddleware, deleteSpace)
spaceRouter.get("/:spaceId", getSpace)
spaceRouter.post("/element", userMiddleware, addElement)

export default spaceRouter