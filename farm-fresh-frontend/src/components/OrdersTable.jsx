import { Eye, FileText } from "lucide-react";

export default function OrdersTable({ orders, showRetailer, onViewInvoice }) {
    return (
        <div className="bg-white shadow rounded-xl overflow-hidden">
            <table className="w-full text-sm">
                <thead className="bg-gray-100 text-gray-700">
                <tr>
                    <th className="px-4 py-3 text-left">Order ID</th>
                    {showRetailer && <th className="px-4 py-3">Retailer</th>}
                    <th className="px-4 py-3">Product</th>
                    <th className="px-4 py-3">Qty</th>
                    <th className="px-4 py-3">Amount</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Image</th>
                    <th className="px-4 py-3">Invoice</th>
                </tr>
                </thead>

                <tbody className="divide-y">
                {orders.map(o => (
                    <tr key={o.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium">#{o.id}</td>

                        {showRetailer && (
                            <td className="px-4 py-3">{o.retailerName}</td>
                        )}

                        <td className="px-4 py-3">{o.productName}</td>
                        <td className="px-4 py-3">
                            {o.quantity} {o.unit}
                        </td>
                        <td className="px-4 py-3 font-semibold">
                            ₹{o.finalPrice}
                        </td>

                        <td className="px-4 py-3">
                                <span
                                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                                        o.deliveryStatus === "DELIVERED"
                                            ? "bg-green-100 text-green-700"
                                            : "bg-yellow-100 text-yellow-700"
                                    }`}
                                >
                                    {o.deliveryStatus}
                                </span>
                        </td>

                        {/* IMAGE PREVIEW */}
                        <td className="px-4 py-3">
                            <img
                                src={o.image}
                                alt="product"
                                className="w-10 h-10 object-cover rounded cursor-pointer"
                                onClick={() => window.open(o.image, "_blank")}
                            />
                        </td>

                        {/* VIEW INVOICE */}
                        <td className="px-4 py-3">
                            <button
                                onClick={() => onViewInvoice(o)}
                                className="flex items-center gap-1 text-green-700 hover:underline"
                            >
                                <FileText size={16} />
                                View
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}
