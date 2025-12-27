import { useEffect, useState } from "react";
import api from "../services/api";
import DashboardLayout from "../components/DashboardLayout";
import StatCard from "../components/StatCard";
import PendingUsersTable from "../components/PendingUsersTable";
import { Users, Clock, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";
export default function AdminDashboard() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchPendingUsers = async () => {
        try {
            const res = await api.get("/admin/pending-users");
            setUsers(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };



    const approveUser = async (id) => {
        try {
            const res = await api.put(`/admin/approve/${id}`);

            toast.success(res.data || "Temporary password sent to user email");

            await fetchPendingUsers();
        } catch (err) {
            toast.error("Failed to approve user");
        }
    };


    const rejectUser = async (id) => {
        try {
            await api.put(`/admin/reject/${id}`);
            toast.success("User rejected");
            await fetchPendingUsers();
        } catch {
            toast.error("Reject failed");
        }
    };

    useEffect(() => {
        fetchPendingUsers();
    }, []);

    if (loading) return <p className="p-8">Loading...</p>;

    return (
        <DashboardLayout>
            <h1 className="text-3xl font-bold mb-6">Admin Overview</h1>

            {/* STAT CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <StatCard title="Total Users" value="—" icon={Users} />
                <StatCard title="Pending Requests" value={users.length} icon={Clock} />
                <StatCard title="Approved Users" value="—" icon={CheckCircle} />
            </div>

            {/* TABLE */}
            <PendingUsersTable
                users={users}
                onApprove={approveUser}
                onReject={rejectUser}
            />
        </DashboardLayout>
    );
}
