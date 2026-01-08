import { useEffect, useState } from "react";
import api from "../services/api";
import DashboardLayout from "../components/DashboardLayout";

export default function ApprovedUsers() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        api.get("/admin/approved-users").then(res => setUsers(res.data));
    }, []);

    return (
        <DashboardLayout>
            <h1 className="text-2xl font-bold mb-6">Approved Users</h1>

            <div className="bg-white rounded-xl p-6 shadow-sm">
                <table className="w-full text-sm">
                    <thead className="border-b">
                    <tr>
                        <th className="text-left py-2">Name</th>
                        <th className="text-left py-2">Email</th>
                        <th className="text-left py-2">Role</th>
                    </tr>
                    </thead>
                    <tbody>
                    {users.map(u => (
                        <tr key={u.id} className="border-b">
                            <td className="py-2">{u.name}</td>
                            <td className="py-2">{u.email}</td>
                            <td className="py-2">
                  <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded">
                    {u.role}
                  </span>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </DashboardLayout>
    );
}
