import { Navigate } from "react-router-dom";

// Normalize roles
const normalizeRole = (role) => {
    if (!role) return null;
    const r = role.toLowerCase();
    if (r === "resident") return "user";
    if (r === "security") return "guard";
    return r;
};

// ✅ Decode JWT
const isTokenExpired = (token) => {
    try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        return Date.now() > payload.exp * 1000;
    } catch (err) {
        return true;
    }
};

const ProtectedRoute = ({ children, userRoles }) => {

    // ✅ USE sessionStorage
    const token = sessionStorage.getItem("token");
    const rawRole = sessionStorage.getItem("role");
    const role = normalizeRole(rawRole);

    // ❌ No token → redirect
    if (!token) {
        return <Navigate to="/" replace />;
    }

    // ❌ Token expired → logout + redirect
    if (isTokenExpired(token)) {
        sessionStorage.clear();
        return <Navigate to="/" replace />;
    }

    // ❌ Role not allowed
    if (!userRoles || !userRoles.includes(role)) {
        return <Navigate to="/" replace />;
    }

    // ✅ Allow access
    return children;
};

export default ProtectedRoute;