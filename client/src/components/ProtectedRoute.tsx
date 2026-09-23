import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/useAuth";

export function ProtectedRoute() {
    const { user } = useAuth()
    return user ? <Outlet/> : <Navigate to="/login" replace />
}