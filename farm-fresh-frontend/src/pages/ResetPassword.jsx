import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import { Lock } from "lucide-react";

export default function ResetPassword() {

    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const email = localStorage.getItem("verifiedEmail");

    const submit = async (e) => {
        e.preventDefault();

        if (password !== confirm) {
            setError("Passwords do not match");
            return;
        }

        try {
            await api.post("/auth/reset-password", {
                email,
                newPassword: password,
            });
            localStorage.removeItem("pendingEmail");

            navigate("/login");
        } catch {
            setError("Failed to reset password");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-slate-100">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">

                <div className="text-center mb-6">
                    <div className="inline-flex bg-green-100 p-3 rounded-full text-green-600 mb-3">
                        <Lock size={28} />
                    </div>
                    <h2 className="text-2xl font-bold">Set New Password</h2>
                    <p className="text-gray-500 text-sm">
                        Please set a permanent password to continue
                    </p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 text-sm p-2 rounded mb-4 text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={submit} className="space-y-4">


                    <input
                        type="password"
                        placeholder="New Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-green-500"
                    />

                    <input
                        type="password"
                        placeholder="Confirm Password"
                        value={confirm}
                        onChange={(e) => setConfirm(e.target.value)}
                        required
                        className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-green-500"
                    />

                    <button className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition">
                        Save Password
                    </button>
                </form>
            </div>
        </div>
    );
}
