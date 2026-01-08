import { useEffect, useState } from "react";
import api from "../services/api";
import DashboardLayout from "../components/DashboardLayout";
import StatCard from "../components/StatCard";
import PendingUsersTable from "../components/PendingUsersTable";
import AdminCharts from "../components/AdminCharts";
import {
    Users,
    Clock,
    CheckCircle,
    XCircle,
    ShieldCheck
} from "lucide-react";
import toast from "react-hot-toast";

export default function AdminDashboard() {
    const [users, setUsers] = useState([]);
    const [stats, setStats] = useState({
        approved: 0,
        pending: 0,
        rejected: 0,
        total: 0
    });

    const fetchDashboardData = async () => {
        try {
            const res = await api.get("/admin/dashboard-stats");
            setStats(res.data);
            setUsers(res.data.users);
        } catch {
            toast.error("Failed to load dashboard");
        }
    };

    const approveUser = async (id) => {
        try {
            await api.put(`/admin/approve/${id}`);
            toast.success("User approved");
            fetchDashboardData();
        } catch {
            toast.error("Approval failed");
        }
    };

    const rejectUser = async (id) => {
        try {
            await api.put(`/admin/reject/${id}`);
            toast.success("User rejected");
            fetchDashboardData();
        } catch {
            toast.error("Reject failed");
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    return (
        <DashboardLayout>
            {/* HEADER */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800">
                    Admin Control Panel
                </h1>
                <p className="text-gray-500 mt-1">
                    Monitor platform activity, manage users, and track system health
                </p>
            </div>

            {/* KPI CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                <StatCard
                    title="Total Users"
                    value={stats.total}
                    icon={Users}
                    subtitle="Registered on platform"
                />
                <StatCard
                    title="Pending Requests"
                    value={stats.pending}
                    icon={Clock}
                    subtitle="Awaiting approval"
                />
                <StatCard
                    title="Approved Users"
                    value={stats.approved}
                    icon={CheckCircle}
                    subtitle="Active accounts"
                />
                <StatCard
                    title="Rejected Users"
                    value={stats.rejected}
                    icon={XCircle}
                    subtitle="Declined registrations"
                />
            </div>

            {/* ANALYTICS SECTION */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
                {/* PIE / CHART AREA */}
                <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm">
                    <h2 className="text-lg font-semibold mb-4 text-gray-800">
                        User Distribution Overview
                    </h2>
                    <AdminCharts stats={stats} />
                </div>

                {/* QUICK INSIGHTS */}
                <div className="bg-white rounded-xl p-6 shadow-sm">
                    <h2 className="text-lg font-semibold mb-4 text-gray-800">
                        Admin Insights
                    </h2>

                    <ul className="space-y-4 text-sm text-gray-600">
                        <li className="flex items-start gap-3">
                            <ShieldCheck className="text-green-600 mt-1" size={18} />
                            Approval rate reflects platform trust and onboarding quality
                        </li>
                        <li className="flex items-start gap-3">
                            <Clock className="text-yellow-600 mt-1" size={18} />
                            Pending users should be reviewed daily
                        </li>
                        <li className="flex items-start gap-3">
                            <Users className="text-blue-600 mt-1" size={18} />
                            User growth directly impacts marketplace liquidity
                        </li>
                    </ul>
                </div>
            </div>

            {/* PENDING USERS TABLE */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
                <h2 className="text-lg font-semibold mb-4 text-gray-800">
                    Pending User Approvals
                </h2>

                <PendingUsersTable
                    users={users}
                    onApprove={approveUser}
                    onReject={rejectUser}
                />
            </div>
        </DashboardLayout>
    );
}
