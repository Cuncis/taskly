import { useState, type FormEvent } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
    const { login, user } = useAuth()
    const navigate = useNavigate()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState<string | null>(null)
    const [submitting, setSubmitting] = useState(false)

    if (user) return <Navigate to="/tasks" replace/>
    
    async function onSubmit(e: FormEvent) {
        e.preventDefault()
        setError(null)
        setSubmitting(true)

        try {
            await login(email, password)
            navigate("/tasks")
        } catch (err) {
            setError(err instanceof Error ? err.message : "Login failed")
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <form onSubmit={onSubmit} style={{ maxWidth: 320, margin: "80px auto", display: "grid", gap: 8 }}>
            <h1>Log in</h1>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
            {error && <p role="alert" style={{ color: "crimson" }}>{error}</p>}
            <button disabled={submitting}>{submitting ? "Signing in…" : "Log in"}</button>
            <Link to="/register">Create an account</Link>
        </form>
    );
}