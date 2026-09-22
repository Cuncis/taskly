import { Router } from "express";
import * as c from "../controllers/task.controller";

export const taskRouter = Router();
taskRouter.get("/", c.index);
taskRouter.post("/", c.store);
taskRouter.get("/:id", c.show);
taskRouter.patch("/:id", c.update);
taskRouter.delete("/:id", c.destroy);
