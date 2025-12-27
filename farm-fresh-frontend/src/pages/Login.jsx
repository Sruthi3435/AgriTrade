import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { getRoleFromToken } from "../utils/token";

export default function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await api.post("/auth/login", { email, password });

            const token = res.data;
            localStorage.setItem("token", token);

            const role = getRoleFromToken(token);

            if (role === "ROLE_ADMIN") {
                navigate("/admin");
            } else if (role === "ROLE_FARMER") {
                navigate("/farmer/dashboard");
            } else if (role === "ROLE_RETAILER") {
                navigate("/retailer/dashboard");
            } else {
                navigate("/dashboard");
            }
        }
        catch (err) {
            if (err.response?.data === "TEMP_PASSWORD") {
                localStorage.setItem("pendingEmail", email);
                navigate("/verify-temp");
            } else {
                setError("Invalid credentials");
            }
            setLoading(false); // 🔥 restore button state
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">

                <div className="text-center mb-6">
                    <h1 className="text-3xl font-bold text-green-600">AgroLink</h1>
                    <p className="text-gray-500 mt-1">Login to continue</p>
                </div>

                {error && (
                    <div className="mb-4 text-sm text-red-600 text-center bg-red-50 border border-red-200 rounded-md py-2">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                        />
                    </div>

                    <button
                        disabled={loading}
                        className={`w-full py-2 rounded-lg text-white 
                        ${loading ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"}`}
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-gray-500">
                    Don't have an account?
                    <span
                        onClick={() => navigate("/register")}
                        className="text-green-600 cursor-pointer font-medium hover:underline"
                    >
                        &nbsp;Register
                    </span>
                </div>

            </div>
        </div>
    );
}
