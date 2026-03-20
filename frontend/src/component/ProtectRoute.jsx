import { Navigate } from "react-router-dom"

// Maps raw API role values to the canonical role used in the router's userRoles arrays
const normalizeRole = (role) => {
    if (!role) return null;
    const r = role.toLowerCase();
    if (r === "resident") return "user";       // API sends "resident", router uses "user"
    if (r === "security") return "guard";      // API sends "security", router uses "guard"
    return r;
};

const ProtectedRoute = ({ children, userRoles }) => {
    const token = localStorage.getItem("token");
    const rawRole = localStorage.getItem("role");
    const role = normalizeRole(rawRole);

    if (!token) {
        return <Navigate to="/" replace />;
    }
    if (!userRoles || !userRoles.includes(role)) {
        return <Navigate to="/" replace />;
    }
    return children;
};

export default ProtectedRoute;