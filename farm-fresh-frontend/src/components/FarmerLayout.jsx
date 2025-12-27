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

// remove visually
        setNotifications(prev => prev.filter(n => n.id !== id));

// decrease count
        setUnreadCount(prev => prev - 1);
    };
    useEffect(() => {
        loadNotifications();
    }, []);

    useEffect(() => {
        const interval = setInterval(async () => {
            const res = await api.get("/bid/farmer/notifications");
            const unread = res.data.filter(n => !n.read).length;

            if (unread > unreadCount) {
                new Audio('/notify.mp3').play();
            }

            setUnreadCount(unread);
        }, 5000);

        return () => clearInterval(interval);
    }, [unreadCount]);

    return (
        <div className="min-h-screen bg-gray-50">

            {/* NAVBAR */}
            <div className="w-full bg-green-800 text-white flex items-center px-8 py-4 shadow fixed top-0 left-0 z-50">

                {/* logo */}
                <h2 className="text-2xl font-bold">AgroLink</h2>

                {/* nav links */}
                <nav className="flex space-x-8 ml-auto mr-6">
                    <Link to="/farmer/dashboard" className="hover:text-gray-200">Dashboard</Link>
                    <Link to="/farmer/listings" className="hover:text-gray-200">My Listings</Link>
                    <Link to="/farmer/new-listing" className="hover:text-gray-200">Add Product</Link>
                    <Link to="/farmer/orders" className="hover:text-gray-200">Orders</Link>
                    <Link to="/farmer/profile" className="hover:text-gray-200">Profile</Link>
                </nav>

                {/* bell */}
                <div className="relative cursor-pointer" onClick={toggleNotifications}>
                    <i className="fa fa-bell text-2xl text-yellow-400"></i>
                    {unreadCount > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                            {unreadCount}
                        </span>
                    )}
                </div>
                {showPanel && (
                    <div className="absolute right-8 top-16 bg-white text-black shadow-lg rounded-lg w-80 z-50 p-4 max-h-96 overflow-y-auto">

                        <h3 className="font-semibold text-lg mb-3 border-b pb-2">Notifications</h3>

                        {notifications.length === 0 ? (
                            <p className="text-gray-500 text-sm">No notifications</p>
                        ) : (
                            notifications.map((n) => (
                                <div
                                    key={n.id}
                                    className={`p-3 rounded mb-2 ${
                                        !n.read ? "bg-yellow-100" : "bg-gray-100"
                                    }`}
                                >
                                    <p className="text-sm">{n.message}</p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {new Date(n.createdAt).toLocaleString()}
                                    </p>

                                    {!n.read && (
                                        <button
                                            onClick={() => markAsRead(n.id)}
                                            className="text-blue-600 text-xs mt-1"
                                        >
                                            Mark as read
                                        </button>


                                    )}
                                </div>
                            ))
                        )}
                    </div>
                )}

            </div>

            {/* page content */}
            <div className="pt-20 p-8">
                {children}
            </div>

        </div>
    );
}
