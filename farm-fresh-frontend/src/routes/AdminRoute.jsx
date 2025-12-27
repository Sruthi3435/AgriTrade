import { Navigate } from "react-router-dom";
import { getRoleFromToken } from "../utils/token";

export default function AdminRoute({ children }) {
    const role = getRoleFromToken();

    if (role !== "ROLE_ADMIN") {
        return <Navigate to="/login" replace />;
    }

    return children;
}
