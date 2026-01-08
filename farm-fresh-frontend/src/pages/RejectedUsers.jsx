import { useEffect, useState } from "react";
import api from "../services/api";
import DashboardLayout from "../components/DashboardLayout";

export default function RejectedUsers() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        api.get("/admin/rejected-users").then(res => setUsers(res.data));
    }, []);

    return (
        <DashboardLayout>
            <h1 className="text-2xl font-bold mb-6">Rejected Users</h1>

            <div className="bg-white rounded-xl p-6 shadow-sm">
                {users.length === 0 ? (
                    <p className="text-gray-500">No rejected users</p>
                ) : (
                    <ul className="space-y-3 text-sm">
                        {users.map(u => (
                            <li key={u.id} className="flex justify-between border-b pb-2">
                                <span>{u.name} ({u.email})</span>
                                <span className="text-red-600 font-medium">Rejected</span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </DashboardLayout>
    );
}
