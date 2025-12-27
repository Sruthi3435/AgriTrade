import api from "../services/api";

export default function InvoiceModal({ order, onClose }) {
    if (!order) return null;

    const downloadInvoice = async () => {
        const res = await api.get(
            `/orders/invoice/${order.id}`,
            {
                responseType: "blob",
                headers: {} // 🚫 no Authorization
            }
        );

        const blob = new Blob([res.data], { type: "application/pdf" });
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = `AgriLink_Invoice_${order.id}.pdf`;
        a.click();

        window.URL.revokeObjectURL(url);
    };


    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white w-[520px] rounded-xl shadow-xl p-6 relative">

                {/* CLOSE */}
                <button
                    onClick={onClose}
                    className="absolute top-3 right-4 text-xl font-bold"
                >
                    ✕
                </button>

                {/* HEADER */}
                <h2 className="text-2xl font-bold text-green-700">
                    AgriLink Invoice
                </h2>
                <p className="text-sm text-gray-500">
                    Order #{order.id}
                </p>

                <hr className="my-4" />

                {/* DETAILS */}
                <div className="space-y-2 text-sm">
                    <p><b>Product:</b> {order.productName}</p>
                    <p><b>Quantity:</b> {order.quantity} {order.unit}</p>
                    <p><b>Amount:</b> ₹{order.finalPrice}</p>
                    <p><b>Status:</b> {order.deliveryStatus}</p>
                    <p><b>Date:</b> {new Date(order.createdAt).toLocaleString()}</p>
                </div>

                <hr className="my-4" />

                {/* ACTIONS */}
                <div className="flex justify-end gap-3">
                    <button
                        onClick={downloadInvoice}
                        className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800"
                    >
                        Download PDF
                    </button>
                    <button
                        onClick={onClose}
                        className="border px-4 py-2 rounded"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
