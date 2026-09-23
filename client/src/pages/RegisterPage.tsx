import { useState, type FormEvent } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { ApiError } from "../lib/api";

type FieldErrors = Partial<Record<"name" | "email" | "password", string[]>>;

function getFieldErrors(details: unknown): FieldErrors {
    if (!details || typeof details !== "object" || Array.isArray(details)) return {};
    return details as FieldErrors;
}

export default function RegisterPage() {
    const { register, user } = useAuth();
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
    const [submitting, setSubmitting] = useState(false);

    if (user) return <Navigate to="/tasks" replace />;

    async function onSubmit(e: FormEvent) {
        e.preventDefault();
        setError(null);
        setFieldErrors({});
        setSubmitting(true);

        try {
            await register(name, email, password);
            navigate("/tasks");
        } catch (err) {
            if (err instanceof ApiError) {
                const fe = getFieldErrors(err.details);
                if (Object.keys(fe).length > 0) {
                    setFieldErrors(fe);
                } else {
                    setError(err.message);
                }
            } else {
                setError("Registration failed");
            }
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <form onSubmit={onSubmit} style={{ maxWidth: 320, margin: "80px auto", display: "grid", gap: 8 }}>
            <h1>Create an account</h1>

            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" required />
            {fieldErrors.name?.length ? (
                <p role="alert" style={{ color: "crimson", margin: 0 }}>{fieldErrors.name[0]}</p>
            ) : null}

            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
            />
            {fieldErrors.email?.length ? (
                <p role="alert" style={{ color: "crimson", margin: 0 }}>{fieldErrors.email[0]}</p>
            ) : null}

            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
            />
            {fieldErrors.password?.length ? (
                <p role="alert" style={{ color: "crimson", margin: 0 }}>{fieldErrors.password[0]}</p>
            ) : null}

            {error && <p role="alert" style={{ color: "crimson" }}>{error}</p>}
            <button disabled={submitting}>{submitting ? "Creating account…" : "Create account"}</button>
            <Link to="/login">Already have an account? Log in</Link>
        </form>
    );
}
