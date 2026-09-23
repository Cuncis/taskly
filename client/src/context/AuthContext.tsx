import { createContext, useContext, useState, type ReactNode } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";
import type { User } from "../types";

type AuthResponse = { user: User; token: string }
type AuthContextValue = {
    user: User | null
    login: (email: string, password: string) => Promise<void>
    register: (name: string, email: string, password: string) => Promise<void>
    logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

function loadUser(): User | null {
    try {
        const raw = localStorage.getItem("user")
        return raw ? (JSON.parse(raw) as User): null
    } catch {
        return null
    }
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const qc = useQueryClient()
    const [user, setUser] = useState<User | null>(loadUser)

    function save(res: AuthResponse) {
        localStorage.setItem("token", res.token)
        localStorage.setItem("user", JSON.stringify(res.user))
        setUser(res.user)
    }

    async function login(email: string, password: string) {
        save(await api<AuthResponse>("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) }))
    }

    async function register(name: string, email: string, password: string) {
        save(await api<AuthResponse>("/auth/register", { method: "POST", body: JSON.stringify({ name, email, password }) }))
    }

    async function logout() {
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        qc.clear()
        setUser(null)
    }

    return <AuthContext.Provider value={{ user, login, register, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>")
    return ctx
}