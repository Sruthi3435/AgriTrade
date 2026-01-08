import { useEffect, useState } from "react";
import api from "../services/api";
import RetailerLayout from "../components/RetailerLayout";
import { load } from "@cashfreepayments/cashfree-js";

/* ---------------- ORDER STATUS STEPPER ---------------- */
const OrderStepper = ({ status }) => {
    const steps = [
        { key: "CONFIRMED", label: "Confirmed", emoji: "🛒" },
        { key: "SHIPPED", label: "Shipped", emoji: "📦" },
        { key: "OUT_FOR_DELIVERY", label: "Out for Delivery", emoji: "🚚" },
        { key: "DELIVERED", label: "Delivered", emoji: "🏠" },
    ];

    const currentStatus = status || "CONFIRMED";
    const activeIndex = steps.findIndex(s => s.key === currentStatus);

    return (
        <div className="mt-3">
            <div className="flex justify-between items-center relative">
                {steps.map((step, index) => (
                    <div key={step.key} className="flex-1 flex flex-col items-center relative">
                        {index !== 0 && (
                            <div
                                className={`absolute left-0 top-6 w-full h-1 -z-10
                                ${index <= activeIndex ? "bg-green-600" : "bg-gray-300"}`}
                            />
                        )}

                        <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center text-lg
                            ${index <= activeIndex
                                ? "bg-green-600 text-white"
                                : "bg-gray-300 text-gray-600"
                            }`}
                        >
                            {step.emoji}
                        </div>

                        <span
                            className={`mt-2 text-xs font-medium
                            ${index <= activeIndex ? "text-green-700" : "text-gray-400"}`}
                        >
                            {step.label}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default function MyOrders() {
    const [orders, setOrders] = useState([]);

    // 🔹 Image preview (upgraded safely)
    const [previewImages, setPreviewImages] = useState([]);
    const [previewIndex, setPreviewIndex] = useState(0);

    const [selectedOrder, setSelectedOrder] = useState(null);

    /* ---------------- FETCH ORDERS ---------------- */
    const fetchOrders = () => {
        api.get("/orders/retailer")
            .then(res => setOrders(res.data || []))
            .catch(console.error);
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    /* ---------------- VERIFY PAYMENT ---------------- */
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const orderId = params.get("order_id");
        if (!orderId) return;

        api.get(`/payment/verify/by-cashfree/${params.get("order_id")}`)

            .then(fetchOrders)
            .finally(() => {
                window.history.replaceState({}, "", "/retailer/orders");
            });
    }, []);

    /* ---------------- INVOICE ---------------- */
    const downloadInvoice = async (id) => {
        const res = await api.get(`/orders/download/invoice/${id}`, {
            responseType: "blob",
        });
        const blob = new Blob([res.data], { type: "application/pdf" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `invoice_${id}.pdf`;
        link.click();
        URL.revokeObjectURL(link.href);
    };

    /* ---------------- CASHFREE ---------------- */
    let cashfreeInstance = null;

    const initCashfree = async () => {
        if (!cashfreeInstance) {
            cashfreeInstance = await load({ mode: "sandbox" });
        }
        return cashfreeInstance;
    };

    const handlePayNow = async (order) => {
        try {
            const res = await api.post(`/payment/create/${order.id}`);
            const data = typeof res.data === "string"
                ? JSON.parse(res.data)
                : res.data;

            const cashfree = await initCashfree();

            const result = await cashfree.checkout({
                paymentSessionId: data.payment_session_id,
                redirectTarget: "_modal",
            });

            // ✅ Payment popup completed
            if (result?.paymentDetails?.orderId) {
                await api.get(
                    `/payment/verify/by-cashfree/${result.paymentDetails.orderId}`
                );

                // ✅ Refresh UI
                fetchOrders();
            }

        } catch (err) {
            alert("Payment failed");
        }
    };


    return (
        <RetailerLayout>
            <div className="pt-24 px-6 min-h-screen bg-gray-50">
                <h1 className="text-xl font-semibold mb-6">My Orders</h1>

                {/* ORDER GRID */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {orders.map(o => {
                        const images = o.image?.split("|") || [];
                        const thumb = images[0] || "/placeholder.jpg";

                        return (
                            <div
                                key={o.id}
                                className="bg-white rounded-xl border border-gray-200 shadow-sm
                                           hover:shadow-md transition p-4 flex flex-col gap-3"
                            >
                                <div className="flex items-center gap-3">
                                    <img
                                        src={thumb}
                                        alt={o.productName}
                                        className="w-14 h-14 rounded-lg object-cover border cursor-pointer"
                                        onClick={() => {
                                            setPreviewImages(images);
                                            setPreviewIndex(0);
                                        }}
                                    />

                                    <div className="flex-1">
                                        <h3 className="text-sm font-semibold truncate">
                                            {o.productName}
                                        </h3>
                                        <p className="text-xs text-gray-500">
                                            {o.quantity} {o.unit} • ₹{o.finalPrice}
                                        </p>
                                    </div>

                                    <span
                                        className={`text-[10px] px-2 py-1 rounded-full font-semibold
                                        ${o.paymentStatus === "PAID"
                                            ? "bg-green-100 text-green-700"
                                            : "bg-amber-100 text-amber-700"
                                        }`}
                                    >
                                        {o.paymentStatus === "PAID" ? "PAID" : "PENDING"}
                                    </span>
                                </div>

                                <p className="text-[11px] text-gray-400">
                                    Order #{o.id}
                                </p>

                                <div className="flex justify-between items-center pt-2 border-t">
                                    <button
                                        onClick={() => setSelectedOrder(o)}
                                        className="text-xs font-semibold text-emerald-700 hover:underline"
                                    >
                                        Track
                                    </button>

                                    {o.paymentStatus !== "PAID" ? (
                                        <button
                                            onClick={() => handlePayNow(o)}
                                            className="text-xs bg-green-600 text-white px-3 py-1.5 rounded-md hover:bg-green-700"
                                        >
                                            Pay Now
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => downloadInvoice(o.id)}
                                            className="text-xs text-green-700 hover:underline"
                                        >
                                            Invoice
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* TRACK ORDER MODAL */}
                {selectedOrder && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <div className="bg-white w-[720px] max-w-full rounded-2xl p-8 relative">
                            <button
                                onClick={() => setSelectedOrder(null)}
                                className="absolute top-4 right-4 text-lg"
                            >
                                ✕
                            </button>

                            <h2 className="text-lg font-semibold">
                                Order #{selectedOrder.id}
                            </h2>

                            <p className="text-sm text-gray-500 mb-6">
                                Current Status: {selectedOrder.deliveryStatus || "CONFIRMED"}
                            </p>

                            <OrderStepper status={selectedOrder.deliveryStatus} />
                        </div>
                    </div>
                )}

                {/* IMAGE PREVIEW (3-IMAGE SAFE) */}
                {previewImages.length > 0 && (
                    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
                        <button
                            onClick={() => setPreviewImages([])}
                            className="absolute top-6 right-6 text-white text-3xl"
                        >
                            ✕
                        </button>

                        <div className="relative">
                            <img
                                src={previewImages[previewIndex]}
                                className="max-w-xl max-h-[85vh] rounded-xl shadow-2xl"
                            />

                            {previewImages.length > 1 && (
                                <>
                                    <button
                                        onClick={() =>
                                            setPreviewIndex(
                                                (i) => (i - 1 + previewImages.length) % previewImages.length
                                            )
                                        }
                                        className="absolute left-2 top-1/2 -translate-y-1/2
                                                   bg-black/60 text-white text-3xl px-3 py-1 rounded-full"
                                    >
                                        ‹
                                    </button>

                                    <button
                                        onClick={() =>
                                            setPreviewIndex(
                                                (i) => (i + 1) % previewImages.length
                                            )
                                        }
                                        className="absolute right-2 top-1/2 -translate-y-1/2
                                                   bg-black/60 text-white text-3xl px-3 py-1 rounded-full"
                                    >
                                        ›
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </RetailerLayout>
    );
}
