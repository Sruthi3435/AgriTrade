import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../services/api";

export default function RetailerLayout({ children }) {

    const [unreadCount, setUnreadCount] = useState(0);
    const [showPanel, setShowPanel] = useState(false);
    const [notifications, setNotifications] = useState([]);

    const toggleNotifications = () => setShowPanel(!showPanel);

    const loadNotifications = async () => {
        const res = await api.get("/bid/notifications");

        setNotifications(res.data); // store full list
        setUnreadCount(res.data.filter(n => !n.read).length);
    };

    const markAsRead = async (id) => {
        await api.post(`/bid/notifications/read/${id}`);

        // remove from UI immediately
        setNotifications(prev => prev.filter(n => n.id !== id));
        setUnreadCount(prev => prev - 1);
    };

    useEffect(() => {
        loadNotifications();
    }, []);

    // polling updates count + refresh list
    useEffect(() => {
        const interval = setInterval(async () => {
            const res = await api.get("/bid/notifications");
            const unread = res.data.filter(n => !n.read).length;

            if (unread > unreadCount) {
                new Audio("/notify.mp3").play();
            }

            setUnreadCount(unread);
            setNotifications(res.data);
        }, 5000);

        return () => clearInterval(interval);
    }, [unreadCount]);

    return (
        <div className="min-h-screen bg-gray-50">

            <div className="w-full bg-green-800 text-white flex items-center px-8 py-4 shadow fixed top-0 left-0 z-50">

                <h2 className="text-2xl font-bold">AgroLink</h2>

                <nav className="flex space-x-8 ml-auto mr-6">
                    <Link to="/retailer/dashboard">Dashboard</Link>
                    <Link to="/retailer/marketplace">Marketplace</Link>
                    <Link to="/retailer/orders">My Orders</Link>
                    <Link to="/retailer/messages">Messages</Link>
                    <Link to="/retailer/profile">Profile</Link>
                </nav>

                <div className="relative cursor-pointer" onClick={toggleNotifications}>
                    <i className="fa fa-bell text-2xl text-yellow-400"></i>

                    {unreadCount > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                            {unreadCount}
                        </span>
                    )}
                </div>
            </div>

            {showPanel && (
                <div className="absolute right-8 top-16 bg-white text-black shadow-lg rounded-lg w-80 z-50 p-4 max-h-96 overflow-y-auto">

                    <h3 className="font-semibold text-lg mb-3 border-b pb-2">Notifications</h3>

                    {notifications.length === 0 ? (
                        <p className="text-gray-500 text-sm">No notifications</p>
                    ) : (
                        notifications.map((n) => (
                            <div key={n.id} className="p-3 rounded mb-2 bg-gray-100">
                                <p className="text-sm">{n.message}</p>
                                <p className="text-xs text-gray-500">
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

            <div className="pt-2 px-8">
                {children}
            </div>
        </div>
    );
}
