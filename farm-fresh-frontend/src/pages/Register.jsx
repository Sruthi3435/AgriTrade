import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Register() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
            name: "",
            email: "",
            phone: "",
            role: "",
            address: "",
            city: "",
            state: "",
            pinCode: "",
            cropType: "",
            businessName: ""
        });



    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            await api.post("/auth/register", form);

            navigate("/pending-approval"); // ✅ after registration
        } catch (err) {
            setError("Registration failed");
        } finally {
            setLoading(false);
        }
    };

    return (

        <div className="min-h-screen flex items-center justify-center bg-green-50">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl w-full max-w-md shadow">
                <h2 className="text-2xl font-bold mb-6 text-center text-green-600">
                    Create Account
                </h2>

                {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

                <input
                    name="name"
                    placeholder="Full Name"
                    onChange={handleChange}
                    required
                    className="w-full mb-3 p-2 border rounded"
                />

                <input
                    name="email"
                    type="email"
                    placeholder="Email"
                    onChange={handleChange}
                    required
                    className="w-full mb-3 p-2 border rounded"
                />

                <input
                    name="phone"
                    placeholder="Phone"
                    onChange={handleChange}
                    required
                    className="w-full mb-3 p-2 border rounded"
                />
                <input
                    name="address"
                    placeholder="Address"
                    value={form.address}
                    onChange={handleChange}
                    required
                    className="w-full mb-3 p-2 border rounded"
                />
                <input
                    name="city"
                    placeholder="City"
                    value={form.city}
                    onChange={handleChange}
                    required
                    className="w-full mb-3 p-2 border rounded"
                />
                <input
                    name="state"
                    placeholder="State"
                    value={form.state}
                    onChange={handleChange}
                    required
                    className="w-full mb-3 p-2 border rounded"
                />
                <input
                    name="pinCode"
                    placeholder="Pincode"
                    value={form.pinCode}
                    onChange={handleChange}
                    required
                    className="w-full mb-3 p-2 border rounded"
                />


                <select
                    name="role"
                    value={form.role}
                    onChange={handleChange}
                    required
                    className="w-full mb-4 p-2 border rounded"
                >
                    <option value="" disabled>
                        Select Role
                    </option>
                    <option value="FARMER">Farmer</option>
                    <option value="RETAILER">Retailer</option>
                </select>


                <button
                    disabled={loading}
                    className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
                >
                    {loading ? "Submitting..." : "Register"}
                </button>
            </form>
        </div>
    );
}
