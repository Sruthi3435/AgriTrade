import DashboardLayout from "../components/DashboardLayout";
import AdminCharts from "../components/AdminCharts";
import StatCard from "../components/StatCard.jsx";
import {CheckCircle, Clock, Users, XCircle} from "lucide-react";

export default function Analytics() {
    return (
        <DashboardLayout>
            <h1 className="text-2xl font-bold mb-6">Platform Analytics</h1>

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
            </div>

        </DashboardLayout>
    );
}
