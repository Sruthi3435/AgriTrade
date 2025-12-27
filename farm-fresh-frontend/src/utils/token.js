import { jwtDecode } from "jwt-decode";

export const getRoleFromToken = () => {
    try {
        const token = localStorage.getItem("token");
        if (!token) return null;

        const decoded = jwtDecode(token);
        return decoded?.role || null;
    } catch (e) {
        console.error("Invalid token", e);
        return null;
    }
};
