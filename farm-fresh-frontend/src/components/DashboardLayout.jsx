import { LogOut, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function DashboardLayout({ title, role, children }) {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);

    const logout = () => {
        localStorage.removeItem("token");
        navigate("/");
    };

    return (
        <div className="min-h-screen flex bg-gray-100">

            {/* Mobile overlay */}
            {open && (
                <div
                    className="fixed inset-0 bg-black/40 z-40 md:hidden"
                    onClick={() => setOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed md:static z-50 h-full w-64 bg-white shadow-lg transform transition-transform
        ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
            >
                <div className="px-6 py-4 text-2xl font-bold text-green-600 border-b">
                    AgroLink
                </div>

                <div className="px-6 py-3 text-sm text-gray-500">
                    {role} Dashboard
                </div>

                {/* Logout */}
                <div className="mt-auto p-4">
                    <button
                        onClick={logout}
                        className="w-full flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"
                    >
                        <LogOut size={18} />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main */}
            <main className="flex-1 w-full">
                {/* Mobile top bar */}
                <div className="bg-white shadow px-4 py-3 flex items-center gap-3 md:hidden">
                    <button onClick={() => setOpen(true)}>
                        <Menu />
                    </button>
                    <h1 className="font-semibold">{title}</h1>
                </div>

                <div className="p-4 md:p-10">
                    <h1 className="hidden md:block text-3xl font-bold mb-8">
                        {title}
                    </h1>
                    {children}
                </div>
            </main>
        </div>
    );
}
