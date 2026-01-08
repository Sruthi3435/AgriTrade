import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Register() {
    const navigate = useNavigate();

    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [shake, setShake] = useState(false);

    const [form, setForm] = useState({
        role: "",
        name: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        pinCode: "",
        licenseFile: null,
        idProofFile: null
    });

    /* ---------------- HANDLERS ---------------- */

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError("");
        setShake(false);
        setLoading(false);
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        setForm({ ...form, [name]: files[0] });
        setError("");
        setShake(false);
        setLoading(false);
    };

    /* ---------------- VALIDATION ---------------- */

    const validateStep = () => {
        if (step === 1) return form.role;
        if (step === 2) return form.name && form.email && form.phone;
        if (step === 3) return form.address && form.city && form.state && form.pinCode;
        if (step === 4) {
            if (form.role === "RETAILER") return form.licenseFile;
            if (form.role === "FARMER") return form.idProofFile;
        }
        return false;
    };

    const nextStep = () => {
        if (!validateStep()) {
            setError("Please fill all required fields");
            setShake(true);
            setTimeout(() => setShake(false), 400);
            return;
        }
        setError("");
        setStep(step + 1);
    };

    const prevStep = () => {
        setError("");
        setShake(false);
        setStep(step - 1);
    };

    /* ---------------- SUBMIT ---------------- */

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateStep()) {
            setError("Please complete all required fields before registering");
            setShake(true);
            setTimeout(() => setShake(false), 400);
            return;
        }

        setLoading(true);
        setError("");

        try {
            const formData = new FormData();
            Object.keys(form).forEach((key) => {
                if (form[key]) formData.append(key, form[key]);
            });

            await api.post("/auth/register", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            navigate("/pending-approval");
        } catch (err) {
            if (err.response?.status === 409) {
                setError("User already registered");
                setShake(true);
                setTimeout(() => setShake(false), 500);
            } else if (err.response?.data) {
                setError(err.response.data);
            } else {
                setError("Registration failed. Try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    /* ---------------- UI ---------------- */

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-lime-50 px-4">
            <div
                className={`w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden transition-transform ${
                    shake ? "animate-shake" : ""
                }`}
            >
                <div className="grid grid-cols-1 md:grid-cols-2">

                    {/* LEFT – FORM */}
                    <div className="p-10 md:p-12">
                        <h2 className="text-3xl font-bold text-green-700 mb-2">
                            Register Account
                        </h2>
                        <p className="text-sm text-gray-500 mb-6">
                            Join AgriTrade – secure farmer & retailer marketplace
                        </p>

                        {/* STEP INDICATOR */}
                        <div className="flex gap-2 mb-8">
                            {[1, 2, 3, 4].map((s) => (
                                <div
                                    key={s}
                                    className={`h-2 flex-1 rounded-full ${
                                        step >= s ? "bg-green-600" : "bg-green-200"
                                    }`}
                                />
                            ))}
                        </div>

                        {error && (
                            <p className="text-red-500 text-sm mb-4">{error}</p>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">

                            {/* STEP 1 */}
                            {step === 1 && (
                                <>
                                    <select
                                        name="role"
                                        value={form.role}
                                        onChange={handleChange}
                                        className="w-full p-3 border rounded-lg"
                                    >
                                        <option value="" disabled>Select Role</option>
                                        <option value="FARMER">Farmer</option>
                                        <option value="RETAILER">Retailer</option>
                                    </select>

                                    <button
                                        type="button"
                                        onClick={nextStep}
                                        className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold"
                                    >
                                        Continue
                                    </button>
                                </>
                            )}

                            {/* STEP 2 */}
                            {step === 2 && (
                                <>
                                    <input
                                        name="name"
                                        placeholder="Full Name"
                                        onChange={handleChange}
                                        className="w-full p-3 border rounded-lg"
                                    />
                                    <input
                                        name="email"
                                        type="email"
                                        placeholder="Email Address"
                                        onChange={handleChange}
                                        className="w-full p-3 border rounded-lg"
                                    />
                                    <input
                                        name="phone"
                                        placeholder="Mobile Number"
                                        onChange={handleChange}
                                        className="w-full p-3 border rounded-lg"
                                    />

                                    <div className="flex gap-3">
                                        <button
                                            type="button"
                                            onClick={prevStep}
                                            className="w-1/2 py-3 rounded-lg bg-gray-100"
                                        >
                                            Back
                                        </button>
                                        <button
                                            type="button"
                                            onClick={nextStep}
                                            className="w-1/2 py-3 rounded-lg bg-green-600 text-white"
                                        >
                                            Continue
                                        </button>
                                    </div>
                                </>
                            )}

                            {/* STEP 3 */}
                            {step === 3 && (
                                <>
                                    <input
                                        name="address"
                                        placeholder="Address"
                                        onChange={handleChange}
                                        className="w-full p-3 border rounded-lg"
                                    />
                                    <div className="grid grid-cols-2 gap-4">
                                        <input
                                            name="city"
                                            placeholder="City"
                                            onChange={handleChange}
                                            className="p-3 border rounded-lg"
                                        />
                                        <input
                                            name="state"
                                            placeholder="State"
                                            onChange={handleChange}
                                            className="p-3 border rounded-lg"
                                        />
                                    </div>
                                    <input
                                        name="pinCode"
                                        placeholder="Pincode"
                                        onChange={handleChange}
                                        className="w-full p-3 border rounded-lg"
                                    />

                                    <div className="flex gap-3">
                                        <button
                                            type="button"
                                            onClick={prevStep}
                                            className="w-1/2 py-3 rounded-lg bg-gray-100"
                                        >
                                            Back
                                        </button>
                                        <button
                                            type="button"
                                            onClick={nextStep}
                                            className="w-1/2 py-3 rounded-lg bg-green-600 text-white"
                                        >
                                            Continue
                                        </button>
                                    </div>
                                </>
                            )}

                            {/* STEP 4 */}
                            {step === 4 && (
                                <>
                                    {form.role === "FARMER" && (
                                        <input
                                            type="file"
                                            name="idProofFile"
                                            onChange={handleFileChange}
                                            className="w-full p-3 border rounded-lg"
                                        />
                                    )}

                                    {form.role === "RETAILER" && (
                                        <input
                                            type="file"
                                            name="licenseFile"
                                            onChange={handleFileChange}
                                            className="w-full p-3 border rounded-lg"
                                        />
                                    )}

                                    <div className="flex gap-3">
                                        <button
                                            type="button"
                                            onClick={prevStep}
                                            className="w-1/2 py-3 rounded-lg bg-gray-100"
                                        >
                                            Back
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="w-1/2 py-3 rounded-lg bg-green-600 text-white font-semibold"
                                        >
                                            {loading ? "Submitting..." : "Register"}
                                        </button>
                                    </div>
                                </>
                            )}

                        </form>
                    </div>

                    {/* RIGHT – VISUAL PANEL */}
                    <div className="hidden md:flex items-center justify-center bg-gradient-to-br from-green-700 to-lime-600 p-10">
                        <div className="text-white text-center">
                            <h3 className="text-3xl font-bold mb-4">
                                Grow Smarter with AgriTrade
                            </h3>
                            <p className="text-sm opacity-90">
                                Transparent trading • Secure payments • Verified users
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
