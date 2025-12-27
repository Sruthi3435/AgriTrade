import { useEffect, useState } from "react";
import api from "../services/api";
import FarmerLayout from "../components/FarmerLayout.jsx";


export default function FarmerProfile() {
    const [farmer, setFarmer] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        pinCode: "",
        cropType: ""
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const res = await api.get("/users/me");
                setFarmer(res.data);
            } catch (e) {
                console.log("Error loading profile");
            }
        };
        loadProfile();
    }, []);

    const handleChange = (e) => {
        setFarmer({ ...farmer, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        setLoading(true);
        setMessage("");

        try {
            await api.put("/users/update", farmer);
            setMessage("Profile updated successfully!");
        } catch (e) {
            setMessage("Failed to update profile");
        }
        setLoading(false);
    };

    return (
        <div className="pt-24 px-8">
        <div className="flex min-h-screen bg-gray-50">

            <FarmerLayout />

            <div className="flex-1 p-10">
                <h1 className="text-3xl font-semibold mb-6 text-green-700">
                    My Profile
                </h1>

                {message && (
                    <p className="mb-4 text-center text-sm text-green-700 bg-green-100 p-2 rounded">
                        {message}
                    </p>
                )}

                <div className="bg-white shadow rounded-xl p-6 grid grid-cols-2 gap-6">

                    <input
                        name="name"
                        value={farmer.name}
                        onChange={handleChange}
                        className="border p-3 rounded"
                        placeholder="Full Name"
                    />

                    <input
                        type="email"
                        name="email"
                        value={farmer.email}
                        disabled
                        className="border p-3 rounded bg-gray-100 cursor-not-allowed"
                    />

                    <input
                        name="phone"
                        value={farmer.phone}
                        onChange={handleChange}
                        className="border p-3 rounded"
                        placeholder="Phone"
                    />

                    <input
                        name="cropType"
                        value={farmer.cropType}
                        onChange={handleChange}
                        className="border p-3 rounded"
                        placeholder="Crop Type"
                    />

                    <input
                        name="address"
                        value={farmer.address}
                        onChange={handleChange}
                        className="border p-3 rounded col-span-2"
                        placeholder="Address"
                    />

                    <input
                        name="city"
                        value={farmer.city}
                        onChange={handleChange}
                        className="border p-3 rounded"
                        placeholder="City"
                    />

                    <input
                        name="state"
                        value={farmer.state}
                        onChange={handleChange}
                        className="border p-3 rounded"
                        placeholder="State"
                    />

                    <input
                        name="pinCode"
                        value={farmer.pinCode}
                        onChange={handleChange}
                        className="border p-3 rounded"
                        placeholder="Pincode"
                    />
                </div>

                <button
                    onClick={handleSave}
                    className="mt-6 bg-green-600 text-white py-2 px-6 rounded-lg hover:bg-green-700"
                    disabled={loading}
                >
                    {loading ? "Saving..." : "Save Changes"}
                </button>
            </div>
        </div>
        </div>
    );
}
