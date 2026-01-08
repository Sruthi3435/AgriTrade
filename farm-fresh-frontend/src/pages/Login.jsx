import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Lock } from "lucide-react";
import api from "../services/api";
import { getRoleFromToken } from "../utils/token";

export default function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
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

            if (role === "ROLE_ADMIN") navigate("/admin");
            else if (role === "ROLE_FARMER") navigate("/farmer/dashboard");
            else if (role === "ROLE_RETAILER") navigate("/retailer/dashboard");
            else navigate("/dashboard");
        } catch (err) {
            if (err.response?.data === "TEMP_PASSWORD") {
                localStorage.setItem("pendingEmail", email);
                navigate("/verify-temp");
            } else {
                setError("Invalid email or password");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-gradient-to-br from-white via-green-50 to-white font-['Inter']">

            {/* LEFT BRAND PANEL */} <div className=" hidden lg:flex w-[60%] min-h-screen relative overflow-hidden bg-gradient-to-br from-green-600 via-green-700 to-green-900 text-white " style={{ clipPath: "ellipse(95% 110% at 0% 50%)", }} > {/* Image Overlay */} <div className="absolute inset-0 bg-cover bg-center opacity-20" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1501004318641-b39e6451bec6')", }} /> {/* CENTERED BRAND CONTENT */} <div className="relative z-10 w-full h-full flex items-center"> <div className="max-w-xl px-24 text-left"> <h1 className="text-5xl font-bold mb-6 tracking-tight"> AgroLink </h1> <p className="text-xl leading-relaxed text-green-100"> A trusted digital marketplace empowering farmers and retailers to trade directly with transparency and efficiency. </p> <div className="mt-10 flex items-center gap-4 text-green-200 text-sm"> <span className="w-1 h-8 bg-green-300 rounded-full" /> Secure • Transparent • Data-Driven </div> </div> </div> </div>
            {/* RIGHT LOGIN PANEL */}
            <div className="w-full lg:w-[40%] min-h-screen flex items-center justify-center px-6">
                <div className="w-full max-w-lg">

                    <div
                        className="
              bg-white rounded-2xl px-12 py-14
              shadow-[0_30px_90px_rgba(0,0,0,0.12)]
              transition-all duration-300
              hover:shadow-[0_45px_120px_rgba(0,0,0,0.16)]
              focus-within:shadow-[0_60px_160px_rgba(0,0,0,0.18)]
            "
                    >
                        <h2 className="text-3xl font-semibold text-slate-900 mb-2">
                            Sign in
                        </h2>
                        <p className="text-slate-500 mb-10">
                            Access your AgroLink workspace
                        </p>

                        {error && (
                            <div className="mb-6 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-red-700 text-sm">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleLogin} className="space-y-7">

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-medium text-slate-600 mb-2">
                                    Email address
                                </label>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="
                    w-full rounded-xl bg-slate-50 border border-slate-300
                    px-4 py-3 text-base
                    focus:bg-white focus:border-green-700
                    focus:ring-4 focus:ring-green-100
                    outline-none transition
                  "
                                />
                            </div>

                            {/* Password */}
                            <div>
                                <label className="block text-sm font-medium text-slate-600 mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="
                      w-full rounded-xl bg-slate-50 border border-slate-300
                      px-4 py-3 pr-12 text-base
                      focus:bg-white focus:border-green-700
                      focus:ring-4 focus:ring-green-100
                      outline-none transition
                    "
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            {/* CTA */}
                            <button
                                disabled={loading}
                                className={`
                  w-full rounded-xl py-3.5 text-base font-semibold text-white
                  transition-all duration-300
                  ${
                                    loading
                                        ? "bg-slate-400 cursor-not-allowed"
                                        : "bg-gradient-to-r from-green-700 to-green-600 hover:shadow-lg hover:-translate-y-[1px]"
                                }
                `}
                            >
                                {loading ? "Signing in…" : "Sign in"}
                            </button>
                        </form>

                        {/* Footer */}
                        <div className="mt-8 flex items-center justify-between text-sm text-slate-500">
              <span
                  onClick={() => navigate("/forgot-password")}
                  className="hover:text-green-700 cursor-pointer"
              >
                Forgot password?
              </span>

                            <div className="flex items-center gap-2 text-green-700">
                                <Lock size={14} />
                                Secure login
                            </div>
                        </div>

                        <div className="mt-6 text-center text-sm text-slate-500">
                            New to AgroLink?
                            <span
                                onClick={() => navigate("/register")}
                                className="ml-1 font-medium text-green-700 hover:underline cursor-pointer"
                            >
                Create account
              </span>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
