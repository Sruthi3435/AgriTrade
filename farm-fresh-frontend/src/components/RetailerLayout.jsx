import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../services/api";

export default function RetailerLayout({ children }) {
    const [unreadCount, setUnreadCount] = useState(0);
    const [showPanel, setShowPanel] = useState(false);
    const [notifications, setNotifications] = useState([]);

    const loadNotifications = async () => {
        const res = await api.get("/bid/notifications");
        setNotifications(res.data);
        setUnreadCount(res.data.filter(n => !n.read).length);
    };

    useEffect(() => {
        loadNotifications();
    }, []);

    useEffect(() => {
        const interval = setInterval(loadNotifications, 5000);
        return () => clearInterval(interval);
    }, []);

    const handleLogout = () => {
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = "/login";
    };

    return (
        <div className="min-h-screen bg-gray-100">

            {/* TOP BAR */}
            <header className="fixed top-0 left-0 w-full h-16 bg-emerald-800 text-white flex items-center px-10 shadow z-50">
                <h1 className="text-2xl font-bold tracking-wide">AgroLink</h1>

                <nav className="ml-auto flex items-center gap-8 text-sm font-medium">
                    <Link className="hover:text-green-300" to="/retailer/dashboard">Dashboard</Link>
                    <Link className="hover:text-green-300" to="/retailer/marketplace">Marketplace</Link>
                    <Link className="hover:text-green-300" to="/retailer/orders">Orders</Link>
                    <Link className="hover:text-green-300" to="/retailer/messages">Messages</Link>
                    <Link className="hover:text-green-300" to="/retailer/profile">Profile</Link>

                    <button
                        onClick={handleLogout}
                        className="bg-red-500 hover:bg-red-600 px-4 py-1 rounded-md text-white"
                    >
                        Logout
                    </button>




                </nav>
            </header>

            {/* PAGE CONTENT */}
            <main className="pt-20 px-10">
                {children}
            </main>
        </div>
    );
}
