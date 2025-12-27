import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import toast from "react-hot-toast";
export default function PendingApproval() {
    const [email, setEmail] = useState("");
    const [tempPassword, setTempPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleVerify = async () => {
        setError("");

        if (!email || !tempPassword) {
            setError("Email and temporary password are required");
            return;
        }

        try {

            await api.post("/auth/verify-temp-password", {
                email: email.trim(),
                tempPassword: tempPassword.trim(),
            });

            localStorage.setItem("verifiedEmail", email);

            navigate("/reset-password");
        } catch (err) {
            setError(
                err.response?.data || "Invalid or expired temporary password"
            );
        }
    };




    return (
        <div className="pt-24 px-8">
        <div className="min-h-screen flex items-center justify-center bg-green-50">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-[420px] text-center">

                <div className="w-16 h-16 mx-auto mb-4 bg-yellow-100 rounded-full flex items-center justify-center">
                    ⏳
                </div>

                <h2 className="text-2xl font-bold mb-2">Temporary Password</h2>
                <p className="text-gray-600 mb-6">
                    Enter the temporary code sent to your mail
                </p>

                <input
                    type="email"
                    placeholder="Enter your registered email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full mb-4 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500"
                    required
                />

                <input
                    type="text"
                    placeholder="Enter temporary password"
                    value={tempPassword}
                    onChange={(e) => setTempPassword(e.target.value)}
                    className="w-full mb-2 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500"
                    required
                />

                {error && (
                    <p className="text-red-500 mt-3 text-sm">{error}</p>
                )}

                <button
                    onClick={handleVerify}
                    className="mt-6 w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700"
                >
                    Verify Code
                </button>
            </div>
        </div>
        </div>
    );
}
