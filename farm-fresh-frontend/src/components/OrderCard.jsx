export default function OrderCard({ order, onPay, onTrack }) {
    return (
        <div className="bg-white border rounded-xl p-5 hover:shadow-lg transition">
            <div className="flex items-center gap-5">

                {/* IMAGE */}
                <img
                    src={order.image}
                    alt={order.productName}
                    className="w-24 h-24 object-cover rounded-lg"
                />

                {/* INFO */}
                <div className="flex-1">
                    <h3 className="font-semibold">{order.productName}</h3>

                    <p className="text-sm text-gray-500">
                        {order.quantity} {order.unit}
                    </p>

                    <p className="font-semibold text-green-700 mt-1">
                        ₹{order.finalPrice}
                    </p>

                    <span
                        className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium
            ${order.paymentStatus === "PAID"
                            ? "bg-green-100 text-green-700"
                            : "bg-orange-100 text-orange-700"}`}
                    >
            {order.paymentStatus}
          </span>
                </div>

                {/* ACTIONS */}
                <div className="flex flex-col gap-2">
                    {order.paymentStatus !== "PAID" && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();   // ✅ CRITICAL
                                onPay(order.id);
                            }}
                            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                        >
                            Pay Now
                        </button>
                    )}

                    <button
                        onClick={(e) => {
                            e.stopPropagation();   // ✅ THIS FIXES YOUR ISSUE
                            onTrack(order);
                        }}
                        className="px-4 py-2 border rounded-md hover:bg-gray-100"
                    >
                        Track Order
                    </button>
                </div>

            </div>
        </div>
    );
}
