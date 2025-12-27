import { useState, useEffect } from "react";
import api from "../services/api";

export default function BidDrawer({ open, onClose, product }) {
    const [amount, setAmount] = useState("");
    const [highestBid, setHighestBid] = useState(null);

    useEffect(() => {
        if (product && open) {
            loadHighestBid();
        }
    }, [product, open]);

    const loadHighestBid = async () => {
        try {
            const res = await api.get(`/bid/product/${product.id}/highest`);
            setHighestBid(res.data.highest || null);
        } catch {
            setHighestBid(null);
        }
    };

    const placeBid = async () => {
        if (!amount) return alert("Enter a bid amount");

        if (Number(amount) < product.price) {
            return alert(`Bid must be ≥ base price ₹${product.price}`);
        }

        try {
            await api.post(`/bid/place/${product.id}`, { amount: Number(amount) });
            alert("Bid placed successfully!");
            setAmount("");
            onClose();
        } catch (err) {
            alert(err.response?.data || "Bid failed");
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-40">

            {/* Background dim (STARTS BELOW NAVBAR) */}
            <div
                className="absolute left-0 right-0"
                style={{
                    top: "72px",         // navbar height
                    height: "calc(100% - 72px)",
                    background: "rgba(0,0,0,0.4)"
                }}
                onClick={onClose}
            />

            {/* Drawer */}
            <div
                className="absolute right-0 bg-white shadow-xl p-6 animate-slideLeft"
                style={{
                    top: "72px",               // below navbar
                    height: "calc(100% - 72px)",
                    width: "380px",
                    borderTopLeftRadius: "12px"
                }}
            >
                {/* Close */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-xl font-bold text-gray-500 hover:text-black"
                >
                    ✕
                </button>

                <h2 className="text-2xl font-semibold mb-4">Place Bid</h2>

                {/* IMAGE */}
                <img
                    src={product.images}
                    className="w-full h-44 object-cover rounded-lg"
                />

                {/* DETAILS */}
                <h3 className="text-xl font-semibold mt-4">{product.name}</h3>
                <p className="text-gray-600 text-sm">{product.category}</p>
                <p className="text-gray-600 text-sm">
                    Qty: {product.quantity} {product.unit}
                </p>

                <p className="mt-2 text-green-700 font-semibold">
                    Base Price: ₹{product.price}
                </p>

                {highestBid ? (
                    <p className="mt-1 text-blue-600 font-medium">
                        Highest Bid: ₹{highestBid}
                    </p>
                ) : (
                    <p className="mt-1 text-gray-400 text-sm">No bids yet</p>
                )}

                <hr className="my-4" />


                {/* BID INPUT */}
                <label className="text-sm font-medium">Your Bid Amount</label>

                <input
                    type="number"

                    step="1"
                    value={amount}
                    onChange={(e) => {
                        const val = Number(e.target.value);

                        // prevent values below base price
                        if (val < product.price) {
                            setAmount(product.price);
                        } else {
                            setAmount(val);
                        }
                    }}
                    className={`w-full border p-2 rounded mt-1 focus:ring-2 
        ${amount < product.price ? "border-red-500 ring-red-300" : "border-gray-300"}`}
                    style={{
                        MozAppearance: "textfield"
                    }}
                    onWheel={(e) => e.target.blur()} // prevent wheel scroll
                    onKeyDown={(e) => {
                        if (e.key === "ArrowDown") e.preventDefault();
                    }}
                />

                {/* SHOW RED WARNING */}
                {amount < product.price && (
                    <p className="text-red-600 text-sm mt-1">
                        Bid must be at least ₹{product.price}
                    </p>
                )}

                {/* SUBMIT BUTTON */}
                <button
                    onClick={() => {
                        if (amount < product.price) {
                            alert(`Bid must be ≥ base price ₹${product.price}`);
                            return;
                        }
                        placeBid();
                    }}
                    disabled={amount < product.price}
                    className={`w-full py-2 mt-4 rounded-lg font-semibold 
        ${amount < product.price
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-green-700 text-white hover:bg-green-800"}`}
                >
                    Submit Bid
                </button>

            </div>
        </div>
    );
}
