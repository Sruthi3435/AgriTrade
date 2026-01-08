import OrderStepper from "./OrderStepper";

export default function OrderDetailsModal({ order, onClose, onInvoice }) {
    if (!order) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
            <div className="bg-white w-[720px] rounded-xl shadow-2xl p-6 relative">

                <button
                    onClick={onClose}
                    className="absolute top-4 right-5 text-xl text-gray-500 hover:text-black"
                >
                    ×
                </button>

                <div className="flex gap-6">
                    <img
                        src={order.image}
                        alt=""
                        className="w-36 h-36 object-cover rounded-lg border"
                    />

                    <div className="flex-1">
                        <h2 className="text-xl font-semibold">{order.productName}</h2>

                        <p className="text-sm text-gray-500 mt-1">
                            Quantity: {order.quantity} {order.unit}
                        </p>

                        <p className="mt-2 text-lg font-bold text-green-700">
                            ₹{order.finalPrice}
                        </p>

                        <p className="mt-3 text-sm">
                            Payment Status:
                            <span className={`ml-2 font-semibold ${
                                order.paymentStatus === "PAID"
                                    ? "text-green-600"
                                    : "text-orange-600"
                            }`}>
                {order.paymentStatus}
              </span>
                        </p>

                        <p className="text-xs text-gray-500 mt-1">
                            Order ID: #{order.id}
                        </p>
                    </div>
                </div>

                {order.paymentStatus === "PAID" && (
                    <OrderStepper status={order.deliveryStatus} />
                )}

                <div className="mt-6 flex justify-end gap-3">
                    {order.paymentStatus === "PAID" && (
                        <button
                            onClick={() => onInvoice(order.id)}
                            className="px-5 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                        >
                            Download Invoice
                        </button>
                    )}

                    <button
                        onClick={onClose}
                        className="px-5 py-2 border rounded-md hover:bg-gray-100"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
