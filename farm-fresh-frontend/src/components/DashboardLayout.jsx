import { NavLink } from "react-router-dom";
import {
    LayoutDashboard,
    Clock,
    Settings,
    LogOut
} from "lucide-react";
import { HelpCircle } from "lucide-react";
import { useState } from "react";
import LogoutConfirmModal from "../components/LogoutConfirmModal";

export default function DashboardLayout({ children }) {

    const [showLogout, setShowLogout] = useState(false);

    const handleConfirmLogout = () => {
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = "/login";
    };

    return (
        <div className="flex min-h-screen bg-gray-100">

            <LogoutConfirmModal
                open={showLogout}
                onCancel={() => setShowLogout(false)}
                onConfirm={handleConfirmLogout}
            />

            <aside className="w-64 bg-white border-r px-4 py-6">
                <h1 className="text-2xl font-bold text-green-600 mb-8">
                    AgroLink
                </h1>

                <nav className="space-y-2 text-sm">
                    <NavItem to="/admin" icon={LayoutDashboard} label="Dashboard" />
                    <NavItem to="/admin/pending" icon={Clock} label="Pending Users" />
                    <NavItem to="/admin/help" icon={HelpCircle} label="Help & Support" />
                    <NavItem to="/admin/settings" icon={Settings} label="Settings" />

                    <button
                        onClick={() => setShowLogout(true)}
                        className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-red-50 hover:text-red-600 w-full"
                    >
                        <LogOut size={18} />
                        Logout
                    </button>
                </nav>
            </aside>

            <main className="flex-1 p-8 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}

function NavItem({ to, icon: Icon, label }) {
    return (
        <NavLink
            to={to}
            className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg transition ${
                    isActive
                        ? "bg-green-100 text-green-700"
                        : "text-gray-600 hover:bg-gray-100"
                }`
            }
        >
            <Icon size={18} />
            {label}
        </NavLink>
    );
}
