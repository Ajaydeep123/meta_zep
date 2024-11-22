import { Router } from "express";

const adminRouter:ReturnType<typeof Router>= Router();


adminRouter.post("/map")
adminRouter.post("/avatar")
adminRouter.post("/element")
adminRouter.put("/element/:elementId")
export default adminRouter