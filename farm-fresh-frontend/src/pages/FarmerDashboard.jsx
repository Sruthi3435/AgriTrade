import { useEffect, useState } from "react";
import FarmerLayout from "../components/FarmerLayout";
import api from "../services/api";

import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    PieChart,
    Pie,
    Cell
} from "recharts";

export default function FarmerDashboard() {

    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        try {
            const res = await api.get("../farmer/stats");
            setStats(res.data);
        } catch (e) {
            console.error("Stats error:", e);
        }
        setLoading(false);
    };

    if (loading || !stats) {
        return (
            <FarmerLayout>
                <div className="pt-24 px-8 text-lg font-medium">Loading...</div>
            </FarmerLayout>
        );
    }

    // Fake sample data for charts to look professional
    const monthlyData = [
        { month: "Jan", orders: 5 },
        { month: "Feb", orders: 8 },
        { month: "Mar", orders: 10 },
        { month: "Apr", orders: 6 },
        { month: "May", orders: 12 },
    ];

    const categoryData = [
        { name: "Fruits", value: 60 },
        { name: "Vegetables", value: 25 },
        { name: "Grains", value: 15 },
    ];

    const COLORS = ["#2ecc71", "#3498db", "#f1c40f"];

    return (
        <FarmerLayout>
            <div className="pt-24 px-10">

                {/* ---------- HEADER ---------- */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-800 flex items-center">
                        Hey, Farmer <span className="ml-2 text-3xl">👋</span>
                    </h1>
                    <p className="text-gray-600 mt-1 text-lg">
                        Track your listings, orders, revenue and analytics here.
                    </p>
                </div>

                {/* ---------- STATS CARDS ---------- */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

                    <div className="p-6 bg-white rounded-2xl shadow hover:shadow-lg transition">
                        <p className="text-gray-500">Total Listings</p>
                        <h2 className="text-4xl font-extrabold text-green-700 mt-2">
                            {stats.totalListings}
                        </h2>
                    </div>

                    <div className="p-6 bg-white rounded-2xl shadow hover:shadow-lg transition">
                        <p className="text-gray-500">Active Listings</p>
                        <h2 className="text-4xl font-extrabold text-indigo-600 mt-2">
                            {stats.activeListings}
                        </h2>
                    </div>

                    <div className="p-6 bg-white rounded-2xl shadow hover:shadow-lg transition">
                        <p className="text-gray-500">Total Sales</p>
                        <h2 className="text-4xl font-extrabold text-teal-600 mt-2">
                            ₹{stats.totalSales}
                        </h2>
                    </div>

                    <div className="p-6 bg-white rounded-2xl shadow hover:shadow-lg transition">
                        <p className="text-gray-500">Pending Orders</p>
                        <h2 className="text-4xl font-extrabold text-red-600 mt-2">
                            {stats.pendingOrders}
                        </h2>
                    </div>

                </div>

                {/* ---------- ANALYTICS SECTION ---------- */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-10">

                    {/* ORDERS PER MONTH CHART */}
                    <div className="bg-white p-6 rounded-2xl shadow">
                        <h3 className="text-lg font-semibold mb-3">Orders Per Month</h3>

                        <AreaChart width={380} height={220} data={monthlyData}>
                            <defs>
                                <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#4ade80" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#4ade80" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="month" />
                            <YAxis />
                            <CartesianGrid strokeDasharray="3 3" />
                            <Tooltip />
                            <Area
                                type="monotone"
                                dataKey="orders"
                                stroke="#22c55e"
                                fillOpacity={1}
                                fill="url(#colorOrders)"
                            />
                        </AreaChart>
                    </div>

                    {/* CATEGORY WISE PIE CHART */}
                    <div className="bg-white p-6 rounded-2xl shadow flex flex-col items-center">
                        <h3 className="text-lg font-semibold mb-3">Category-wise Purchases</h3>

                        <PieChart width={300} height={270}>
                            <Pie
                                data={categoryData}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={90}
                                label
                            >
                                {categoryData.map((entry, index) => (
                                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                        </PieChart>
                    </div>

                    {/* UPCOMING TASKS */}
                    <div className="bg-white p-6 rounded-2xl shadow">
                        <h3 className="text-lg font-semibold mb-3">Upcoming Tasks</h3>

                        <ul className="text-gray-600 space-y-2">
                            <li>✔ Check pending delivery confirmations</li>
                            <li>✔ Update pricing for upcoming batches</li>
                            <li>✔ Review recent bids</li>
                        </ul>
                    </div>

                </div>

            </div>
        </FarmerLayout>
    );
}
