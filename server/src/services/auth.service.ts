import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "../lib/env";
import { HttpError } from "../lib/errors";
import { prisma } from "../lib/prisma";
import type { LoginInput, RegisterInput } from "../schemas/auth.schema";
import fa from "zod/v4/locales/fa.js";

const publicUser = { id: true, name: true, email: true } as const

const signToken = (userId: number) => jwt.sign({ sub: String(userId) }, env.jwtSecret, { expiresIn: "7d" })

export async function register(input: RegisterInput) {
    const exists = await prisma.user.findUnique({ where: { email: input.email } })
    if (exists) throw new HttpError(409, "Email already registered")

    const user = await prisma.user.create({
        data: { ...input, password: await bcrypt.hash(input.password, 10) },
        select: publicUser,
    })

    return { user, token: signToken(user.id) }
}

export async function login(input: LoginInput) {
    const user = await prisma.user.findUnique({ where: { email: input.email } })
    const valid = user ? await bcrypt.compare(input.password, user.password) : false
    if (!user || !valid) throw new HttpError(401, "Invalid email or password")

    return {
        user: { id: user.id, name: user.name, email: user.email },
        token: signToken(user.id)
    }
}

export const getMe = (id: number) => prisma.user.findUniqueOrThrow({ where: { id }, select: publicUser })