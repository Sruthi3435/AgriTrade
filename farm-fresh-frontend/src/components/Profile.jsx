import { useEffect, useState } from "react";
import api from "../services/api";
import RetailerLayout from "../components/RetailerLayout";

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
        setTimeout(() => setSuccess(""), 3000);
    };

    if (!user) return null;

    return (

            <div className="pt-6 px-8 max-w-6xl mx-auto">

                {/* HEADER */}
                <div className="mb-8">
                    <h1 className="text-2xl font-semibold">My Profile</h1>
                    <p className="text-gray-500">
                        Manage your personal and account details
                    </p>
                </div>

                {/* MAIN GRID */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                    {/* LEFT PROFILE CARD */}
                    <div className="bg-white rounded-2xl border shadow-sm p-6 h-fit">

                        <div className="flex flex-col items-center text-center">
                            <div className="w-24 h-24 rounded-full bg-green-700 text-white
                                            flex items-center justify-center text-3xl font-bold mb-3">
                                {user.name?.charAt(0)}
                            </div>

                            <h2 className="text-lg font-semibold">{user.name}</h2>
                            <p className="text-sm text-gray-500">{user.email}</p>

                            <span className="mt-3 inline-block bg-green-100 text-green-700
                                             text-xs px-3 py-1 rounded-full">
                                {user.role}
                            </span>
                        </div>

                        <div className="mt-6 border-t pt-4 text-sm space-y-3">
                            <InfoRow label="Phone" value={user.phone} />
                            <InfoRow label="City" value={user.city} />
                            <InfoRow label="State" value={user.state} />
                        </div>

                        <button
                            onClick={() => setOpen(true)}
                            className="w-full mt-6 bg-gray-900 hover:bg-black
                                       text-white py-2 rounded-lg text-sm"
                        >
                            Edit Profile
                        </button>
                    </div>

                    {/* RIGHT DETAILS CARD */}
                    <div className="md:col-span-2 bg-white rounded-2xl border shadow-sm p-6">

                        <h3 className="text-lg font-semibold mb-6">
                            Account Details
                        </h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
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

                        {success && (
                            <p className="text-green-600 text-sm mt-6">
                                {success}
                            </p>
                        )}
                    </div>
                </div>

                {/* EDIT MODAL */}
                {open && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-2xl w-full max-w-xl p-6">

                            <h2 className="text-lg font-semibold mb-4">
                                Edit Profile
                            </h2>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">

                                <Input label="Phone" value={editData.phone}
                                       onChange={v => setEditData({ ...editData, phone: v })} />

                                <Input label="City" value={editData.city}
                                       onChange={v => setEditData({ ...editData, city: v })} />

                                <Input label="State" value={editData.state}
                                       onChange={v => setEditData({ ...editData, state: v })} />

                                <Input label="Pincode" value={editData.pinCode}
                                       onChange={v => setEditData({ ...editData, pinCode: v })} />

                                {user.role === "RETAILER" && (
                                    <Input label="Business Name"
                                           value={editData.businessName}
                                           onChange={v => setEditData({ ...editData, businessName: v })} />
                                )}

                                {user.role === "FARMER" && (
                                    <Input label="Crop Type"
                                           value={editData.cropType}
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

/* ---------------- HELPERS ---------------- */

function Field({ label, value }) {
    return (
        <div>
            <p className="text-gray-500 mb-1">{label}</p>
            <p className="font-medium">{value || "-"}</p>
        </div>
    );
}

function InfoRow({ label, value }) {
    return (
        <div className="flex justify-between">
            <span className="text-gray-500">{label}</span>
            <span className="font-medium">{value || "-"}</span>
        </div>
    );
}

function Input({ label, value, onChange }) {
    return (
        <div>
            <label className="text-gray-500 text-xs">{label}</label>
            <input
                value={value || ""}
                onChange={e => onChange(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 mt-1 text-sm"
            />
        </div>
    );
}
