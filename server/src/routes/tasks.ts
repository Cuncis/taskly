import { Router } from "express";
import * as c from "../controllers/task.controller";
import { requireAuth } from "../middleware/auth";

export const taskRouter = Router();
taskRouter.use(requireAuth);

taskRouter.get("/", c.index);
taskRouter.post("/", c.store);
taskRouter.get("/:id", c.show);
taskRouter.patch("/:id", c.update);
taskRouter.delete("/:id", c.destroy);
