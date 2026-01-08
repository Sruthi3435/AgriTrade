
import RetailerLayout from "../components/RetailerLayout";


import {
    Chart,
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
    ArcElement,
    Tooltip,
    Legend
} from "chart.js";

Chart.register(
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
    ArcElement,
    Tooltip,
    Legend
);
import { useEffect, useState } from "react";
import api from "../services/api";

import { Line, Pie } from "react-chartjs-2";
Chart.register(LineElement, CategoryScale, LinearScale, PointElement);



export default function RetailerDashboard() {
    const [stats, setStats] = useState(null);

    useEffect(() => {
        api.get("/retailer/stats").then(res => setStats(res.data));
    }, []);

    if (!stats) return <p>Loading...</p>;

    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

    /* PIE CHART DATA */
    const orderStatusData = {
        labels: ["Completed Orders", "Pending Orders"],
        datasets: [
            {
                data: [
                    stats.totalOrders - stats.pendingOrders,
                    stats.pendingOrders
                ],
                backgroundColor: ["#16a34a", "#f59e0b"],
                borderWidth: 0
            }
        ]
    };

    /* LINE CHART DATA */
    const spendingData = {
        labels: stats.spendingPerMonth.map(m => months[m[0] - 1]),
        datasets: [
            {
                label: "Monthly Spending",
                data: stats.spendingPerMonth.map(m => m[1]),
                borderColor: "#2563eb",
                borderWidth: 3,
                tension: 0.35,
                pointRadius: 4
            }
        ]
    };

    return (
        <RetailerLayout>

            {/* HEADER */}
            <div className="mb-10">
                <h1 className="text-4xl font-bold text-gray-800">
                    Retailer Dashboard
                </h1>
                <p className="text-gray-500 mt-2">
                    Business performance and spending insights
                </p>
            </div>

            {/* KPI CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="bg-white rounded-2xl shadow p-6 border-l-4 border-emerald-600">
                    <p className="text-gray-500">Total Orders</p>
                    <h2 className="text-3xl font-bold text-emerald-700">
                        {stats.totalOrders}
                    </h2>
                </div>

                <div className="bg-white rounded-2xl shadow p-6 border-l-4 border-amber-500">
                    <p className="text-gray-500">Pending Orders</p>
                    <h2 className="text-3xl font-bold text-amber-600">
                        {stats.pendingOrders}
                    </h2>
                </div>

                <div className="bg-white rounded-2xl shadow p-6 border-l-4 border-blue-600">
                    <p className="text-gray-500">Total Spending</p>
                    <h2 className="text-3xl font-bold text-blue-700">
                        ₹{stats.totalSpending}
                    </h2>
                </div>
            </div>

            {/* CHARTS SECTION */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">

                {/* PIE CHART */}
                <div className="bg-white rounded-2xl shadow p-6 flex flex-col items-center">
                    <h3 className="font-semibold mb-4">
                        Order Status Distribution
                    </h3>
                    <div className="w-64">
                        <Pie data={orderStatusData} />
                    </div>
                </div>

                {/* LINE CHART */}
                <div className="bg-white rounded-2xl shadow p-6">
                    <h3 className="font-semibold mb-4">
                        Monthly Spending Trend
                    </h3>
                    <Line data={spendingData} />
                </div>

            </div>

            {/* RECENT ORDERS */}
            <div className="bg-white rounded-2xl shadow p-6">
                <h3 className="font-semibold mb-4">Recent Orders</h3>

                {stats.recentOrders.length === 0 ? (
                    <p className="text-gray-500">No recent orders</p>
                ) : (
                    <table className="w-full text-sm">
                        <thead className="text-gray-500 border-b">
                        <tr>
                            <th className="py-2 text-left">Product</th>
                            <th className="py-2 text-left">Amount</th>
                            <th className="py-2 text-right">Date</th>
                        </tr>
                        </thead>
                        <tbody>
                        {stats.recentOrders.map(o => (
                            <tr key={o.id} className="border-b last:border-0">
                                <td className="py-3">{o.productId}</td>
                                <td className="py-3 font-semibold">
                                    ₹{o.finalPrice}
                                </td>
                                <td className="py-3 text-right text-gray-500">
                                    {new Date(o.createdAt).toLocaleDateString()}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
            </div>

        </RetailerLayout>
    );
}
