import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/useAuth";

export function Layout() {
    const { logout } = useAuth();

    return (
        <>
            <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 24px", borderBottom: "1px solid #ddd" }}>
                <strong>Taskly</strong>
                <nav style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    <NavLink to="/">Home</NavLink>
                    <NavLink to="/tasks">Tasks</NavLink>
                    <button onClick={logout}>Log out</button>
                </nav>
            </header>
            <main style={{ maxWidth: 640, margin: "24px auto" }}>
                <Outlet />
            </main>
        </>
    )
}