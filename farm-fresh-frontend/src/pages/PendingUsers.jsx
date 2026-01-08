import { useEffect, useState } from "react";
import api from "../services/api";
import DashboardLayout from "../components/DashboardLayout";
import PendingUsersTable from "../components/PendingUsersTable";
import toast from "react-hot-toast";

export default function PendingUsers() {
    const [users, setUsers] = useState([]);

    const loadUsers = async () => {
        try {
            const res = await api.get("/admin/pending-users");
            setUsers(res.data);
        } catch {
            toast.error("Failed to load pending users");
        }
    };

    useEffect(() => {
        loadUsers();
    }, []);

    return (
        <DashboardLayout>
            <h1 className="text-2xl font-bold mb-6">Pending User Requests</h1>

            <div className="bg-white p-6 rounded-xl shadow-sm">
                <PendingUsersTable
                    users={users}
                    onApprove={() => loadUsers()}
                    onReject={() => loadUsers()}
                />
            </div>
        </DashboardLayout>
    );
}
