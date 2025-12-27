import { useEffect, useState } from "react";
import api from "../services/api";
import RetailerLayout from "../components/RetailerLayout";
import { Eye } from "lucide-react";

export default function MyOrders() {
    const [orders, setOrders] = useState([]);
    const [previewImg, setPreviewImg] = useState(null);

    useEffect(() => {
        api.get("/orders/retailer")
            .then(res => setOrders(res.data))
            .catch(console.error);
    }, []);

    // ✅ existing working download logic (unchanged)
    const downloadInvoice = async (id) => {
        const res = await api.get(`/orders/download/invoice/${id}`, {
            responseType: "blob"
        });
        const blob = new Blob([res.data], { type: "application/pdf" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `invoice_${id}.pdf`;
        link.click();
        URL.revokeObjectURL(link.href);
    };

    return (
        <RetailerLayout>
            <div className="pt-24 px-8">

                <h1 className="text-2xl font-semibold mb-6">My Orders</h1>

                {/* TABLE */}
                <div className="bg-white shadow rounded-xl overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-100 text-gray-700">
                        <tr>
                            <th className="px-4 py-3 text-left">Order ID</th>
                            <th className="px-4 py-3 text-left">Product</th>
                            <th className="px-4 py-3 text-center">Qty</th>
                            <th className="px-4 py-3 text-center">Amount</th>
                            <th className="px-4 py-3 text-center">Status</th>
                            <th className="px-4 py-3 text-center">Image</th>
                            <th className="px-4 py-3 text-center">Invoice</th>
                        </tr>
                        </thead>

                        <tbody className="divide-y">
                        {orders.map(o => (
                            <tr key={o.id} className="hover:bg-gray-50 h-14">

                                {/* ORDER ID */}
                                <td className="px-4 py-3 font-medium">
                                    #{o.id}
                                </td>

                                {/* PRODUCT */}
                                <td className="px-4 py-3">
                                    <div className="font-medium">{o.productName}</div>
                                    <div className="text-xs text-gray-500 uppercase">
                                        {o.location}
                                    </div>
                                </td>

                                {/* QTY */}
                                <td className="px-4 py-3 text-center">
                                    {o.quantity} {o.unit}
                                </td>

                                {/* AMOUNT */}
                                <td className="px-4 py-3 text-center font-semibold text-green-700">
                                    ₹{o.finalPrice}
                                </td>

                                {/* STATUS */}
                                <td className="px-4 py-3 text-center">
                    <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-medium
                        ${o.deliveryStatus === "DELIVERED"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                    >
                        {o.deliveryStatus}
                    </span>
                                </td>

                                {/* IMAGE */}
                                <td className="px-4 py-3 text-center">
                                    <button
                                        onClick={() => setPreviewImg(o.image)}
                                        className="inline-flex items-center justify-center p-2 rounded hover:bg-gray-200"
                                    >
                                        <Eye size={16} />
                                    </button>
                                </td>

                                {/* INVOICE */}
                                <td className="px-4 py-3 text-center">
                                    <button
                                        onClick={() => downloadInvoice(o.id)}
                                        className="text-green-700 font-medium hover:underline"
                                    >
                                        Download
                                    </button>
                                </td>

                            </tr>
                        ))}
                        </tbody>
                    </table>

                </div>

                {/* IMAGE MODAL */}
                {previewImg && (
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                        onClick={() => setPreviewImg(null)}
                    >
                        <img
                            src={previewImg}
                            className="max-w-md max-h-[80vh] rounded-lg shadow-xl"
                            alt="preview"
                        />
                    </div>
                )}

            </div>
        </RetailerLayout>
    );
}