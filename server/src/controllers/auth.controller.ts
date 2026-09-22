import type { Request, Response } from "express";
import { loginSchema, registerSchema } from "../schemas/auth.schema";
import * as auth from "../services/auth.service";

export async function register(req: Request, res: Response) {
    res.status(201).json(await auth.register(registerSchema.parse(req.body)))
}

export async function login(req: Request, res: Response) {
    res.json(await auth.login(loginSchema.parse(req.body)))
}

export async function me(req: Request, res: Response) {
    res.json(await auth.getMe(req.userId!))
}