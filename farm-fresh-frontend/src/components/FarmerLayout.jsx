import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/api";

export default function FarmerLayout({ children }) {

    const [unreadCount, setUnreadCount] = useState(0);
    const [showPanel, setShowPanel] = useState(false);
    const [notifications, setNotifications] = useState([]);

    const toggleNotifications = () => setShowPanel(!showPanel);

    const loadNotifications = async () => {
        const res = await api.get("/bid/farmer/notifications");
        setNotifications(res.data);
        const unread = res.data.filter(n => !n.read).length;
        setUnreadCount(unread);
    };

    const markAsRead = async (id) => {
        await api.post(`/bid/farmer/notifications/read/${id}`);
        setNotifications(prev => prev.filter(n => n.id !== id));
        setUnreadCount(prev => prev - 1);
    };

    useEffect(() => {
        loadNotifications();
    }, []);

    const handleLogout = () => {
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = "/login";
    };

    useEffect(() => {
        const interval = setInterval(async () => {
            const res = await api.get("/bid/farmer/notifications");
            const unread = res.data.filter(n => !n.read).length;

            if (unread > unreadCount) {
                new Audio("/notify.mp3").play();
            }

            setUnreadCount(unread);
        }, 5000);

        return () => clearInterval(interval);
    }, [unreadCount]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100">

            {/* NAVBAR */}
            <header className="fixed top-0 left-0 w-full z-50 bg-green-900/95 backdrop-blur shadow-lg">
                <div className="flex items-center px-10 py-4 text-white">

                    {/* LOGO */}
                    <h2 className="text-2xl font-bold tracking-wide">
                        AgroLink
                    </h2>

                    {/* NAV LINKS */}
                    <nav className="flex items-center space-x-8 ml-auto mr-6 text-sm font-medium">
                        <Link className="hover:text-green-300" to="/farmer/dashboard">Dashboard</Link>
                        <Link className="hover:text-green-300" to="/farmer/listings">My Listings</Link>
                        <Link className="hover:text-green-300" to="/farmer/new-listing">Add Product</Link>
                        <Link className="hover:text-green-300" to="/farmer/orders">Orders</Link>
                        <Link className="hover:text-green-300" to="/farmer/notifications">Notifications</Link>
                        <Link className="hover:text-green-300" to="/farmer/profile">Profile</Link>

                        <button
                            onClick={handleLogout}
                            className="bg-red-500 hover:bg-red-600 px-4 py-1.5 rounded-md text-xs font-semibold transition"
                        >
                            Logout
                        </button>
                    </nav>

                    {/* NOTIFICATION BELL */}
                    <div className="relative cursor-pointer" onClick={toggleNotifications}>
                        <i className="fa fa-bell text-xl text-yellow-400"></i>
                        {unreadCount > 0 && (
                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-semibold rounded-full w-5 h-5 flex items-center justify-center">
                                {unreadCount}
                            </span>
                        )}
                    </div>
                </div>

                {/* NOTIFICATION PANEL */}
                {showPanel && (
                    <div className="absolute right-10 top-16 bg-white text-black shadow-xl rounded-xl w-80 z-50 p-4 max-h-96 overflow-y-auto animate-slide-down">

                        <h3 className="font-semibold text-lg mb-3 border-b pb-2">
                            Notifications
                        </h3>

                        {notifications.length === 0 ? (
                            <p className="text-gray-500 text-sm">No notifications</p>
                        ) : (
                            notifications.map((n) => (
                                <div
                                    key={n.id}
                                    className={`p-3 rounded-lg mb-2 transition ${
                                        !n.read ? "bg-green-50" : "bg-gray-50"
                                    }`}
                                >
                                    <p className="text-sm text-gray-800">{n.message}</p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {new Date(n.createdAt).toLocaleString()}
                                    </p>

                                    {!n.read && (
                                        <button
                                            onClick={() => markAsRead(n.id)}
                                            className="text-green-700 text-xs mt-1 font-medium hover:underline"
                                        >
                                            Mark as read
                                        </button>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                )}
            </header>

            {/* PAGE CONTENT */}
            <main className="pt-24 px-10 pb-10">
                {children}
            </main>

        </div>
    );
}
