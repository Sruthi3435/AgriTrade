import FarmerLayout from "../components/FarmerLayout";
import { useEffect, useState } from "react";
import api from "../services/api";

export default function FarmerNotifications() {
    const [notifications, setNotifications] = useState([]);
    const [filter, setFilter] = useState("ALL"); // ALL | UNREAD | READ
    const [loading, setLoading] = useState(false);

    const loadNotifications = async () => {
        setLoading(true);
        const res = await api.get("/bid/farmer/notifications");

        // newest first
        const sorted = [...res.data].sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        setNotifications(sorted);
        setLoading(false);
    };

    useEffect(() => {
        loadNotifications();
    }, []);

    const markAsRead = async (id) => {
        await api.post(`/bid/farmer/notifications/read/${id}`);
        loadNotifications();
    };

    const markAllAsRead = async () => {
        const unread = notifications.filter(n => !n.read);
        for (const n of unread) {
            await api.post(`/bid/farmer/notifications/read/${n.id}`);
        }
        loadNotifications();
    };

    const filteredNotifications = notifications.filter(n => {
        if (filter === "UNREAD") return !n.read;
        if (filter === "READ") return n.read;
        return true;
    });

    const unreadCount = notifications.filter(n => !n.read).length;
    const readCount = notifications.filter(n => n.read).length;

    return (
        <FarmerLayout>
            <div className="min-h-screen p-8">

                {/* HEADER */}
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-semibold">Notifications</h1>

                    {unreadCount > 0 && (
                        <button
                            onClick={markAllAsRead}
                            className="px-5 py-2.5 bg-emerald-600 text-white text-base rounded-lg hover:bg-emerald-700"
                        >
                            Mark all as read
                        </button>
                    )}
                </div>

                {/* FILTERS */}
                <div className="flex gap-4 mb-6">
                    <button
                        onClick={() => setFilter("ALL")}
                        className={`px-5 py-2.5 rounded-lg text-base font-medium ${
                            filter === "ALL"
                                ? "bg-green-700 text-white"
                                : "bg-white"
                        }`}
                    >
                        Inbox ({notifications.length})
                    </button>

                    <button
                        onClick={() => setFilter("UNREAD")}
                        className={`px-5 py-2.5 rounded-lg text-base font-medium ${
                            filter === "UNREAD"
                                ? "bg-green-700 text-white"
                                : "bg-white"
                        }`}
                    >
                        Unread ({unreadCount})
                    </button>

                    <button
                        onClick={() => setFilter("READ")}
                        className={`px-5 py-2.5 rounded-lg text-base font-medium ${
                            filter === "READ"
                                ? "bg-green-700 text-white"
                                : "bg-white"
                        }`}
                    >
                        Read ({readCount})
                    </button>
                </div>

                {/* NOTIFICATION LIST */}
                <div className="space-y-4">
                    {loading && (
                        <p className="text-center text-gray-500 text-base">
                            Loading notifications...
                        </p>
                    )}

                    {!loading && filteredNotifications.length === 0 && (
                        <p className="text-center text-gray-500 text-base mt-12">
                            No notifications found
                        </p>
                    )}

                    {filteredNotifications.map(n => (
                        <div
                            key={n.id}
                            className={`flex items-start justify-between gap-6 p-6 rounded-2xl shadow-md transition ${
                                n.read ? "bg-white/70" : "bg-white"
                            }`}
                        >
                            {/* MESSAGE */}
                            <div className="max-w-3xl">
                                <p className="text-2xl  text-gray-800 leading-relaxed">
                                    {n.message}
                                </p>
                                <p className="text-sm text-gray-500 mt-2">
                                    {new Date(n.createdAt).toLocaleString()}
                                </p>
                            </div>

                            {/* STATUS */}
                            <div className="flex flex-col items-end gap-3">
                                <span
                                    className={`text-sm px-4 py-1.5 rounded-full font-medium ${
                                        n.read
                                            ? "bg-emerald-100 text-emerald-700"
                                            : "bg-yellow-100 text-yellow-700"
                                    }`}
                                >
                                    {n.read ? "Read" : "Unread"}
                                </span>

                                {!n.read && (
                                    <button
                                        onClick={() => markAsRead(n.id)}
                                        className="text-sm text-green-700 font-medium hover:underline"
                                    >
                                        Mark as read
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </FarmerLayout>
    );
}
