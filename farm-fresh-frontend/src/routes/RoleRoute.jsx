import { Navigate } from "react-router-dom";
import { getRoleFromToken } from "../utils/token";

export default function RoleRoute({ allow, children }) {
    const role = getRoleFromToken();
    if (!role || !allow.includes(role)) {
        return <Navigate to="/login" replace />;
    }
    return children;
}
