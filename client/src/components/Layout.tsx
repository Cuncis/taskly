import { NavLink, Outlet } from "react-router-dom";

export function Layout() {
    return (
        <>
            <nav style={{ display: "flex", gap: 12 }}>
                <NavLink to="/">Home</NavLink>
                <NavLink to="/tasks">Tasks</NavLink>
            </nav>
            <main style={{ maxWidth: 640, margin: "24px auto" }}>
                <Outlet />
            </main>
        </>
    )
}