import { Router } from "express";
import * as c from "../controllers/auth.controller";
import { requireAuth } from "../middleware/auth";

export const authRouter = Router()
authRouter.post("/register", c.register)
authRouter.post("/login", c.login)
authRouter.get("/me", requireAuth, c.me)