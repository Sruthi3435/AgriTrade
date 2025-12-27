import { useEffect, useState } from "react";
import api from "../services/api";
import RetailerLayout from "../components/RetailerLayout";
import { Line } from "react-chartjs-2";
import { Chart, LineElement, CategoryScale, LinearScale, PointElement } from "chart.js";

Chart.register(LineElement, CategoryScale, LinearScale, PointElement);

export default function RetailerDashboard() {

    const [stats, setStats] = useState(null);

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        try {
            const res = await api.get("/retailer/stats");
            setStats(res.data);
        } catch (e) {
            console.error("Stats error:", e);
        }
    };

    if (!stats) return <p className="pt-24 px-8">Loading...</p>;

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul",
        "Aug", "Sep", "Oct", "Nov", "Dec"];

    const ordersData = {
        labels: stats.ordersPerMonth.map(m => months[m[0] - 1]),
        datasets: [{
            label: "Orders per Month",
            data: stats.ordersPerMonth.map(m => m[1]),
            borderColor: "green",
            borderWidth: 2,
            tension: 0.4
        }]
    };

    const spendingData = {
        labels: stats.spendingPerMonth.map(m => months[m[0] - 1]),
        datasets: [{
            label: "Spending per Month",
            data: stats.spendingPerMonth.map(m => m[1]),
            borderColor: "blue",
            borderWidth: 2,
            tension: 0.4
        }]
    };

    return (
        <RetailerLayout>
            <div className="pt-24 px-8">
                <h1 className="text-3xl font-semibold">
                    Hey, Retailer 👋
                </h1>
                <p className="text-gray-600 mt-1">
                    Track your purchases, spending and analytics in one place.
                </p>

                {/* TOP CARDS */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8">

                    <div className="p-6 bg-white shadow rounded-xl">
                        <p className="text-gray-500">Total Orders</p>
                        <h2 className="text-3xl font-bold text-green-700">{stats.totalOrders}</h2>
                    </div>

                    <div className="p-6 bg-white shadow rounded-xl">
                        <p className="text-gray-500">Pending Orders</p>
                        <h2 className="text-3xl font-bold text-yellow-600">{stats.pendingOrders}</h2>
                    </div>

                    <div className="p-6 bg-white shadow rounded-xl">
                        <p className="text-gray-500">Total Spending</p>
                        <h2 className="text-3xl font-bold text-blue-700">₹{stats.totalSpending}</h2>
                    </div>

                </div>

                {/* CHARTS SECTION */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-10">

                    <div className="p-6 bg-white shadow rounded-xl">
                        <h3 className="font-semibold mb-2">Orders Per Month</h3>
                        <Line data={ordersData} />
                    </div>

                    <div className="p-6 bg-white shadow rounded-xl">
                        <h3 className="font-semibold mb-2">Spending Per Month</h3>
                        <Line data={spendingData} />
                    </div>

                </div>

                {/* RECENT ORDERS */}
                <div className="mt-10 p-6 bg-white rounded-xl shadow">
                    <h3 className="font-semibold mb-3">Recent Orders</h3>

                    {stats.recentOrders.length === 0 ? (
                        <p className="text-gray-500 text-sm">No recent orders</p>
                    ) : (
                        <ul className="divide-y">
                            {stats.recentOrders.map((o) => (
                                <li key={o.id} className="py-3 flex justify-between">
                                    <span>
                                        <b>Product:</b> {o.productId} <br />
                                        <b>Price:</b> ₹{o.finalPrice}
                                    </span>
                                    <span className="text-gray-500">
                                        {new Date(o.createdAt).toLocaleDateString()}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

            </div>
        </RetailerLayout>
    );
}
