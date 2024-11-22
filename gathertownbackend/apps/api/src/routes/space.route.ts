import { Router } from "express";

const spaceRouter:ReturnType<typeof Router>= Router();

spaceRouter.post("/")
spaceRouter.get("/all")
spaceRouter.delete("/:spaceId")
spaceRouter.get("/:spaceId")
spaceRouter.delete("/element")
spaceRouter.post("/element")

export default spaceRouter