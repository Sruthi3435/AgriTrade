import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../services/api";
import LogoutConfirmModal from "../components/LogoutConfirmModal";

export default function RetailerLayout({ children }) {

    const [showLogout, setShowLogout] = useState(false);

    const handleConfirmLogout = () => {
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = "/login";
    };

    return (
        <div className="min-h-screen bg-gray-100">

            <LogoutConfirmModal
                open={showLogout}
                onCancel={() => setShowLogout(false)}
                onConfirm={handleConfirmLogout}
            />

            <header className="fixed top-0 left-0 w-full h-16 bg-emerald-800 text-white flex items-center px-10 shadow z-50">
                <h1 className="text-2xl font-bold">AgroLink</h1>

                <nav className="ml-auto flex items-center gap-8 text-sm">
                    <Link to="/retailer/dashboard">Dashboard</Link>
                    <Link to="/retailer/marketplace">Marketplace</Link>
                    <Link to="/retailer/orders">Orders</Link>
                    <Link to="/retailer/messages">Notifications</Link>
                    <Link to="/retailer/profile">Profile</Link>

                    <button
                        onClick={() => setShowLogout(true)}
                        className="bg-red-500 hover:bg-red-600 px-4 py-1 rounded-md"
                    >
                        Logout
                    </button>
                </nav>
            </header>

            <main className="pt-20 px-10">
                {children}
            </main>
        </div>
    );
}
