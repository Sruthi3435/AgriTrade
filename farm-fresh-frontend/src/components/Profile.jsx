import { useEffect, useState } from "react";
import api from "../services/api";

export default function Profile() {
    const [user, setUser] = useState(null);
    const [editData, setEditData] = useState({});
    const [open, setOpen] = useState(false);
    const [success, setSuccess] = useState("");

    useEffect(() => {
        api.get("/users/me").then(res => {
            setUser(res.data);
            setEditData(res.data);
        });
    }, []);

    const handleSave = async () => {
        await api.put("/users/update", editData);
        setUser(editData);
        setOpen(false);
        setSuccess("Profile updated successfully");
    };

    if (!user) return null;

    return (
        <div className="pt-24 px-8 max-w-4xl mx-auto">

            <h1 className="text-3xl font-semibold mb-1">My Profile</h1>
            <p className="text-gray-500 mb-6">Manage your personal and account details</p>

            {/* VIEW MODE */}
            <div className="bg-white rounded-xl shadow p-6 relative">

                <span className="absolute top-4 right-4 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                    {user.role}
                </span>

                <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-full bg-green-700 text-white flex items-center justify-center text-2xl font-bold">
                        {user.name?.charAt(0)}
                    </div>
                    <div>
                        <p className="text-xl font-semibold">{user.name}</p>
                        <p className="text-gray-500">{user.email}</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-6 text-sm">
                    <Field label="Phone" value={user.phone} />
                    <Field label="City" value={user.city} />
                    <Field label="State" value={user.state} />
                    <Field label="Pincode" value={user.pinCode} />

                    {user.role === "RETAILER" && (
                        <Field label="Business Name" value={user.businessName} />
                    )}

                    {user.role === "FARMER" && (
                        <Field label="Crop Type" value={user.cropType} />
                    )}
                </div>

                <div className="mt-8 text-right">
                    <button
                        onClick={() => setOpen(true)}
                        className="bg-green-700 text-white px-6 py-2 rounded-lg"
                    >
                        Edit Profile
                    </button>
                </div>

                {success && <p className="text-green-600 mt-3">{success}</p>}
            </div>

            {/* EDIT MODAL */}
            {open && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl w-full max-w-lg p-6">

                        <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>

                        <div className="grid grid-cols-2 gap-4 text-sm">

                            <Input label="Phone" value={editData.phone}
                                   onChange={v => setEditData({ ...editData, phone: v })} />

                            <Input label="City" value={editData.city}
                                   onChange={v => setEditData({ ...editData, city: v })} />

                            <Input label="State" value={editData.state}
                                   onChange={v => setEditData({ ...editData, state: v })} />

                            <Input label="Pincode" value={editData.pinCode}
                                   onChange={v => setEditData({ ...editData, pinCode: v })} />

                            {user.role === "RETAILER" && (
                                <Input label="Business Name" value={editData.businessName}
                                       onChange={v => setEditData({ ...editData, businessName: v })} />
                            )}

                            {user.role === "FARMER" && (
                                <Input label="Crop Type" value={editData.cropType}
                                       onChange={v => setEditData({ ...editData, cropType: v })} />
                            )}
                        </div>

                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                onClick={() => setOpen(false)}
                                className="px-4 py-2 border rounded-lg"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                className="px-5 py-2 bg-green-700 text-white rounded-lg"
                            >
                                Save Changes
                            </button>
                        </div>

                    </div>
                </div>
            )}

        </div>
    );
}

/* ---------- SMALL HELPERS ---------- */

function Field({ label, value }) {
    return (
        <div>
            <p className="text-gray-500">{label}</p>
            <p className="font-medium">{value || "-"}</p>
        </div>
    );
}

function Input({ label, value, onChange }) {
    return (
        <div>
            <label className="text-gray-500">{label}</label>
            <input
                value={value || ""}
                onChange={e => onChange(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 mt-1"
            />
        </div>
    );
}
