import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/api";
import LogoutConfirmModal from "../components/LogoutConfirmModal";

export default function FarmerLayout({ children }) {

    const [unreadCount, setUnreadCount] = useState(0);
    const [showPanel, setShowPanel] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [showLogout, setShowLogout] = useState(false);

    const loadNotifications = async () => {
        const res = await api.get("/bid/farmer/notifications");
        setNotifications(res.data);
        setUnreadCount(res.data.filter(n => !n.read).length);
    };

    useEffect(() => {
        loadNotifications();
    }, []);

    const handleConfirmLogout = () => {
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = "/login";
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100">

            <LogoutConfirmModal
                open={showLogout}
                onCancel={() => setShowLogout(false)}
                onConfirm={handleConfirmLogout}
            />

            <header className="fixed top-0 left-0 w-full z-50 bg-green-900/95 shadow-lg">
                <div className="flex items-center px-10 py-4 text-white">
                    <h2 className="text-2xl font-bold">AgroLink</h2>

                    <nav className="ml-auto flex items-center space-x-6 text-sm">
                        <Link to="/farmer/dashboard">Dashboard</Link>
                        <Link to="/farmer/listings">My Listings</Link>
                         <Link to="/farmer/new-listing">Add new Product</Link>
                        <Link to="/farmer/orders">Orders</Link>
                        <Link to="/farmer/profile">Profile</Link>

                        <button
                            onClick={() => setShowLogout(true)}
                            className="bg-red-500 hover:bg-red-600 px-4 py-1.5 rounded-md text-xs font-semibold"
                        >
                            Logout
                        </button>
                    </nav>
                </div>
            </header>

            <main className="pt-24 px-10 pb-10">
                {children}
            </main>
        </div>
    );
}
