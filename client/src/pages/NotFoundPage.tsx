import { Link } from "react-router-dom";

export default function NotFoundPage() {
    return (
        <div style={{ textAlign: "center", marginTop: 80 }}>
            <h1>Page not found</h1>
            <p>The page you're looking for doesn't exist.</p>
            <Link to="/">Go back home</Link>
        </div>
    );
}
