import { useEffect, useState } from "react";
import api from "../services/api";
import DashboardLayout from "../components/DashboardLayout";
import { MessageCircle } from "lucide-react";

export default function AdminHelp() {
    const [queries, setQueries] = useState([]);

    useEffect(() => {
        // replace endpoint later if needed
        api.get("/admin/help-queries")
            .then(res => setQueries(res.data))
            .catch(() => setQueries([]));
    }, []);

    return (
        <DashboardLayout>
            <div className="mb-6">
                <h1 className="text-2xl font-bold">Help & Support</h1>
                <p className="text-gray-500 text-sm">
                    View and manage queries raised by farmers and retailers
                </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
                {queries.length === 0 ? (
                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                        <MessageCircle size={18} />
                        No support queries available
                    </div>
                ) : (
                    <table className="w-full text-sm">
                        <thead className="border-b">
                        <tr>
                            <th className="text-left py-2">User</th>
                            <th className="text-left py-2">Role</th>
                            <th className="text-left py-2">Subject</th>
                            <th className="text-left py-2">Status</th>
                            <th className="text-left py-2">Date</th>
                            <th className="text-center py-2">Action</th>
                        </tr>
                        </thead>

                        <tbody>
                        {queries.map(q => (
                            <tr key={q.id} className="border-b last:border-none">
                                <td className="py-2">{q.name}</td>
                                <td className="py-2">
                    <span className="px-2 py-1 text-xs rounded bg-green-100 text-green-700">
                      {q.role}
                    </span>
                                </td>
                                <td className="py-2">{q.subject}</td>
                                <td className="py-2">
                    <span className={`px-2 py-1 text-xs rounded 
                      ${q.status === "OPEN"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-green-100 text-green-700"}`}>
                      {q.status}
                    </span>
                                </td>
                                <td className="py-2">{q.createdAt}</td>
                                <td className="py-2 text-center">
                                    <button className="text-green-600 hover:underline">
                                        View
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
            </div>
        </DashboardLayout>
    );
}
