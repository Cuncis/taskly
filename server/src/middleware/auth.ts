import type { NextFunction, Request, Response } from "express"
import jwt from "jsonwebtoken"
import { env } from "../lib/env"
import { HttpError } from "../lib/errors"

export function requireAuth(req: Request, _res: Response, next: NextFunction) {
    const header = req.headers.authorization
    if (!header?.startsWith("Bearer ")) throw new HttpError(401, "Missing token")

    let userId: number
    try {
        const payload = jwt.verify(header.slice(7), env.jwtSecret)
        if (typeof payload === "string" || !payload.sub) throw new Error("bad payload")
        userId = Number(payload.sub)
    } catch {
        throw new HttpError(401, "Invalid or exprired token")
    }
    req.userId = userId
    next()
}