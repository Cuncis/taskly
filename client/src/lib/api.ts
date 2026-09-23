const API_URL = import.meta.env.VITE_API_URL as string

export class ApiError extends Error {
    status: number;
    details?: unknown;

    constructor(status: number, message: string, details?: unknown) {
        super(message)
        this.status = status
        this.details = details
    }
}

export async function api<T>(path:string, options: RequestInit = {}): Promise<T> {
    const token = localStorage.getItem("token")
    const res = await fetch(`${API_URL}${path}`, {
        ...options,
        headers: {
            "Content-type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...options.headers,
        }
    })

    if (res.status === 204) return undefined as T
    const data = await res.json().catch(() => null)

    if (!res.ok) {
        if (res.status === 401 && token) {
            localStorage.clear()
            window.location.href = "/login"
        }
        throw new ApiError(res.status, data?.message ?? "Request failed", data?.errors)
    }
    return data as T
}