import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { HttpError } from "../lib/errors";

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
    if (err instanceof HttpError) {
        res.status(err.status).json({ message: err.message, errors: err.details })
        return
    }
    if (err instanceof ZodError) {
        res.status(422).json({ message: "Validation failed", errors: err.flatten().fieldErrors })
        return
    }
    if (err instanceof SyntaxError) {
        res.status(400).json({ message: "Invalid JSON" })
        return
    }
    console.error(err)
    res.status(500).json({ message: "Internal server error" })
}