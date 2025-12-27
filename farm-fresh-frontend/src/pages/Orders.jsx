import { useEffect, useState } from "react";
import api from "../services/api";
import FarmerLayout from "../components/FarmerLayout";
import { Eye } from "lucide-react";

export default function Orders() {
    const [orders, setOrders] = useState([]);
    const [previewImg, setPreviewImg] = useState(null);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showStatusModal, setShowStatusModal] = useState(false);

    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = async () => {
        const res = await api.get("/orders/farmer");
        setOrders(res.data);
    };

    const downloadInvoice = async (orderId) => {
        const res = await api.get(`/orders/download/invoice/${orderId}`, {
            responseType: "blob",
        });

        const blob = new Blob([res.data], { type: "application/pdf" });
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = `invoice_${orderId}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
    };

    const updateDelivery = async (status) => {
        await api.put(
            `/orders/update-delivery/${selectedOrder.id}?deliveryStatus=${status}`
        );
        setShowStatusModal(false);
        setSelectedOrder(null);
        loadOrders();
    };

    return (
        <FarmerLayout>
            <div className="pt-24 px-8">
                <h1 className="text-2xl font-semibold mb-6">Received Orders</h1>

                <div className="bg-white shadow rounded-xl overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-100 text-gray-700">
                        <tr>
                            <th className="px-4 py-3 text-left">Order ID</th>
                            <th className="px-4 py-3">Product</th>
                            <th className="px-4 py-3">Retailer</th>
                            <th className="px-4 py-3">Qty</th>
                            <th className="px-4 py-3">Amount</th>
                            <th className="px-4 py-3">Status</th>
                            <th className="px-4 py-3">Image</th>
                            <th className="px-4 py-3">Invoice</th>
                            <th className="px-4 py-3">Action</th>
                        </tr>
                        </thead>

                        <tbody className="divide-y">
                        {orders.map((o) => (
                            <tr key={o.id} className="hover:bg-gray-50">
                                <td className="px-4 py-3">#{o.id}</td>

                                <td className="px-4 py-3">
                                    <b>{o.productName}</b>
                                    <div className="text-xs text-gray-500">
                                        {o.location}
                                    </div>
                                </td>

                                <td className="px-4 py-3">
                                    {o.retailerName}
                                </td>

                                <td className="px-4 py-3">
                                    {o.quantity} {o.unit}
                                </td>

                                <td className="px-4 py-3 font-medium">
                                    ₹{o.finalPrice}
                                </td>

                                <td className="px-4 py-3">
                                        <span
                                            className={`px-2 py-1 rounded-full text-xs font-semibold
                                            ${
                                                o.deliveryStatus === "DELIVERED"
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-yellow-100 text-yellow-700"
                                            }`}
                                        >
                                            {o.deliveryStatus}
                                        </span>
                                </td>

                                {/* IMAGE PREVIEW */}
                                <td className="px-4 py-3 text-center">
                                    <button
                                        onClick={() =>
                                            setPreviewImg(o.image)
                                        }
                                        className="p-2 rounded hover:bg-gray-200"
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

                                {/* UPDATE DELIVERY */}
                                <td className="px-4 py-3">
                                    {o.deliveryStatus !== "DELIVERED" && (
                                        <button
                                            onClick={() => {
                                                setSelectedOrder(o);
                                                setShowStatusModal(true);
                                            }}
                                            className="bg-gray-800 text-white px-3 py-1 rounded hover:bg-black text-xs"
                                        >
                                            Update
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* IMAGE MODAL */}
            {previewImg && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                    onClick={() => setPreviewImg(null)}
                >
                    <img
                        src={previewImg}
                        className="max-w-md rounded-lg shadow-xl"
                        alt="preview"
                    />
                </div>
            )}

            {/* DELIVERY STATUS MODAL */}
            {showStatusModal && selectedOrder && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
                    <div className="bg-white w-80 rounded-xl shadow-xl p-6">
                        <h2 className="text-xl font-semibold mb-4">
                            Update Delivery
                        </h2>

                        <button
                            onClick={() => updateDelivery("CONFIRMED")}
                            className="w-full bg-yellow-600 text-white py-2 rounded-lg mb-2"
                        >
                            Mark as Confirmed
                        </button>

                        <button
                            onClick={() => updateDelivery("DELIVERED")}
                            className="w-full bg-green-600 text-white py-2 rounded-lg"
                        >
                            Mark as Delivered
                        </button>

                        <button
                            onClick={() => setShowStatusModal(false)}
                            className="mt-4 w-full bg-gray-800 text-white py-2 rounded-lg"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </FarmerLayout>
    );
}