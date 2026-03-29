import { useEffect, useState } from "react";
import api from "../services/api";
import RetailerLayout from "../components/RetailerLayout";
import { load } from "@cashfreepayments/cashfree-js";
import InvoicePreviewModal from "../components/InvoicePreviewModal";

/* ===================== ORDER STEPPER ===================== */
const OrderStepper = ({ status }) => {
    const steps = [
        { key: "CONFIRMED", label: "Confirmed", icon: "🛒" },
        { key: "READY", label: "Ready", icon: "📦" },
        { key: "SHIPPED", label: "Shipped", icon: "🚚" },
        { key: "OUT_FOR_DELIVERY", label: "Out for Delivery", icon: "📍" },
        { key: "DELIVERED", label: "Delivered", icon: "🏠" }
    ];

    const currentStatus = status || "CONFIRMED";
    const activeIndex = steps.findIndex(s => s.key === currentStatus);
    const progressPercent =
        activeIndex <= 0 ? 0 : (activeIndex / (steps.length - 1)) * 100;

    return (
        <div className="mt-6">
            <div className="relative">
                <div className="absolute left-0 right-0 top-5 h-[2px] bg-gray-200" />
                <div
                    className="absolute left-0 top-5 h-[2px] bg-emerald-500 transition-all"
                    style={{ width: `${progressPercent}%` }}
                />
                <div className="relative z-10 flex justify-between">
                    {steps.map((step, index) => {
                        const active = index <= activeIndex;
                        return (
                            <div key={step.key} className="flex flex-col items-center">
                                <div
                                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm ${
                                        active
                                            ? "bg-emerald-600 text-white"
                                            : "bg-gray-300 text-gray-600"
                                    }`}
                                >
                                    {step.icon}
                                </div>
                                <span
                                    className={`mt-2 text-xs ${
                                        active
                                            ? "text-emerald-700"
                                            : "text-gray-400"
                                    }`}
                                >
                                    {step.label}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

/* ===================== ORDER DETAILS MODAL ===================== */
const OrderDetailsModal = ({ order, isPaid, onClose, onPay }) => {
    const image = order.image?.split("|")[0] || "/placeholder.jpg";
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const submitFeedback = async () => {
        if (!rating) {
            alert("Please select a rating");
            return;
        }

        await api.post(`/feedback/submit/${order.id}`, {
            rating,
            comment
        });

        setSubmitted(true);
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white w-[540px] max-w-[95%] rounded-2xl p-6 relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-xl text-gray-400 hover:text-black"
                >
                    ✕
                </button>

                <div className="text-center mb-6">
                    <img
                        src={image}
                        className="w-28 h-28 rounded-xl mx-auto mb-3 object-cover border"
                        alt="product"
                    />
                    <h2 className="text-xl font-semibold">{order.productName}</h2>
                    <p className="text-sm text-gray-500">Order #{order.id}</p>
                </div>

                <OrderStepper status={order.deliveryStatus} />

                <div className="mt-6 space-y-3 text-sm">
                    <div className="flex justify-between">
                        <span className="text-gray-500">Quantity</span>
                        <span className="font-medium">
                            {order.quantity} {order.unit}
                        </span>
                    </div>

                    <div className="flex justify-between">
                        <span className="text-gray-500">Total Amount</span>
                        <span className="font-medium">₹{order.finalPrice}</span>
                    </div>

                    <div className="flex justify-between">
                        <span className="text-gray-500">Payment</span>
                        <span
                            className={`font-medium ${
                                isPaid
                                    ? "text-emerald-600"
                                    : "text-amber-600"
                            }`}
                        >
                            {isPaid ? "PAID" : "PENDING"}
                        </span>
                    </div>

                    <div className="flex justify-between">
                        <span className="text-gray-500">Delivery Status</span>
                        <span className="font-medium">
                            {order.deliveryStatus}
                        </span>
                    </div>
                </div>

                {!isPaid && (
                    <div className="mt-8 flex justify-center">
                        <button
                            onClick={() => onPay(order)}
                            className="px-6 py-2 bg-emerald-600 text-white rounded-lg text-sm hover:bg-emerald-700"
                        >
                            Pay Now
                        </button>
                    </div>
                )}

                {order.deliveryStatus === "DELIVERED" && (
                    <div className="mt-8 border-t pt-6">
                        <h3 className="text-sm font-semibold mb-3 text-center">
                            Rate your experience
                        </h3>

                        <div className="flex justify-center gap-2 mb-4">
                            {[1, 2, 3, 4, 5].map(i => (
                                <button
                                    key={i}
                                    onClick={() => setRating(i)}
                                    className={`text-3xl transition ${
                                        i <= rating
                                            ? "text-yellow-400"
                                            : "text-gray-300"
                                    }`}
                                >
                                    ★
                                </button>
                            ))}
                        </div>

                        <textarea
                            rows={3}
                            value={comment}
                            onChange={e => setComment(e.target.value)}
                            placeholder="Write your feedback (optional)"
                            className="w-full border rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />

                        <button
                            onClick={submitFeedback}
                            disabled={submitted}
                            className={`mt-4 w-full py-2 rounded-lg text-sm ${
                                submitted
                                    ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                                    : "bg-emerald-600 hover:bg-emerald-700 text-white"
                            }`}
                        >
                            {submitted
                                ? "Feedback Submitted"
                                : "Submit Feedback"}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

/* ===================== MAIN PAGE ===================== */
export default function MyOrders() {
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [invoice, setInvoice] = useState(null);

    useEffect(() => {
        api.get("/orders/retailer").then(res =>
            setOrders(res.data || [])
        );
    }, []);
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const cfOrderId = params.get("order_id");

        if (cfOrderId) {
            api.get(`/payment/verify/by-cashfree/${cfOrderId}`)
                .then(() => {
                    // clean URL
                    window.history.replaceState({}, "", "/retailer/orders");
                    return api.get("/orders/retailer");
                })
                .then(res => setOrders(res.data || []))
                .catch(err => console.error("Payment verification failed", err));
        }
    }, []);

    let cashfreeInstance = null;

    const initCashfree = async () => {
        if (!cashfreeInstance) {
            cashfreeInstance = await load({ mode: "sandbox" });
        }
        return cashfreeInstance;
    };

    const handlePayNow = async order => {
        const res = await api.post(`/payment/create/${order.id}`);
        const data =
            typeof res.data === "string"
                ? JSON.parse(res.data)
                : res.data;

        const cashfree = await initCashfree();
        await cashfree.checkout({
            paymentSessionId: data.payment_session_id,
            redirectTarget: "_self"
        });
    };

    const openInvoicePreview = async orderId => {
        const res = await api.get(`/orders/invoice/preview/${orderId}`);
        setInvoice(res.data);
    };

    const downloadInvoice = async orderId => {
        const res = await api.get(
            `/orders/download/invoice/${orderId}`,
            { responseType: "blob" }
        );

        const blob = new Blob([res.data], {
            type: "application/pdf"
        });

        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `invoice_${orderId}.pdf`;
        link.click();
    };

    return (
        <RetailerLayout>
            <div className="pt-6 px-8 min-h-screen bg-gray-100">
                <h1 className="text-2xl font-semibold mb-8">
                    My Orders
                </h1>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {orders.map(order => {
                        const isPaid =
                            order.paymentStatus === "PAID" ||
                            order.deliveryStatus === "READY" ||
                            order.deliveryStatus === "DELIVERED";

                        const thumb =
                            order.image?.split("|")[0] ||
                            "/placeholder.jpg";

                        return (
                            <div
                                key={order.id}
                                className="bg-white rounded-2xl border shadow-sm hover:shadow-lg transition p-5 flex flex-col"
                            >
                                <div className="flex justify-between mb-3">
                                    <span
                                        className={`text-xs font-semibold px-3 py-1 rounded-full ${
                                            isPaid
                                                ? "bg-emerald-100 text-emerald-700"
                                                : "bg-amber-100 text-amber-700"
                                        }`}
                                    >
                                        {isPaid ? "PAID" : "PENDING"}
                                    </span>
                                    <span className="text-xs text-gray-400">
                                        #{order.id}
                                    </span>
                                </div>

                                <img
                                    src={thumb}
                                    className="w-full h-36 object-cover rounded-xl mb-4 border"
                                    alt="product"
                                />

                                <h3 className="font-semibold text-lg">
                                    {order.productName}
                                </h3>

                                <p className="text-sm text-gray-500">
                                    {order.quantity} {order.unit}
                                </p>

                                <p className="font-semibold mt-1 mb-4">
                                    ₹{order.finalPrice}
                                </p>

                                <button
                                    onClick={() =>
                                        setSelectedOrder(order)
                                    }
                                    className="mt-auto bg-gray-900 hover:bg-black text-white py-2 rounded-lg text-sm"
                                >
                                    View Order
                                </button>

                                {isPaid && (
                                    <button
                                        onClick={() =>
                                            openInvoicePreview(order.id)
                                        }
                                        className="mt-4 bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-lg text-sm"
                                    >
                                        View Invoice
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>

                {invoice && (
                    <InvoicePreviewModal
                        invoice={invoice}
                        onClose={() => setInvoice(null)}
                        onDownload={downloadInvoice}
                    />
                )}

                {selectedOrder && (
                    <OrderDetailsModal
                        order={selectedOrder}
                        isPaid={
                            selectedOrder.paymentStatus === "PAID" ||
                            selectedOrder.deliveryStatus === "READY" ||
                            selectedOrder.deliveryStatus === "DELIVERED"
                        }
                        onClose={() => setSelectedOrder(null)}
                        onPay={handlePayNow}
                    />
                )}
            </div>
        </RetailerLayout>
    );
}
